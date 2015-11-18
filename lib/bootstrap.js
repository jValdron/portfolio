/**
 * bootstrap.js
 * Loads the configurations, setup Express, the routes, starts the database
 * connection while setting up the models and starts the application.
 *
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  'use strict';

  // Load up the depencencies.
  var async = require('async'),
      fs = require('fs'),
      path = require('path'),
      walker = require('walk');

  // Export the main app function.
  module.exports = function(callback){

    var app = require('express')(),
        server = require('http').createServer(app);

    // We want to setup our logger first, then the configs.
    async.series([

      // Setup the Winston, our logger.
      function(next){

        var winston = require('winston');

        // Create new transport and handlers for the logger.
        var transports = [
          new winston.transports.Console({
            colorize: true,
            timestamp: true,
            level: 'info'
          }),
          new winston.transports.File({
            filename: path.join(process.cwd(), 'log', 'debug.log'),
            level: 'data',
            maxsize: 2 * 1024 * 1024
          })
        ];

        var exceptionHandlers = [
          new winston.transports.Console({
            colorize: true,
            timestamp: true
          }),
          new winston.transports.File({
            filename: path.join(process.cwd(), 'log', 'exceptions.log'),
            maxsize: 2 * 1024 * 1024
          })
        ];

        // Make sure we have a logs directory, we use synchronous because we're 
        // at startup, so blocking isn't a big problem.
        if (!fs.existsSync(path.join(process.cwd(), 'log'))) {
          fs.mkdirSync(path.join(process.cwd(), 'log'), 511); // 0777 in decimal
        }

        // Create our logger and make it global to the application.
        app.logger = new winston.Logger({
            transports: transports,
            exceptionHandlers: exceptionHandlers
        });

        app.logger.info('Logger initialized!');

        return next();

      },

      // Load up our configs.
      function(next){

        app.logger.info('Loading config files...');

        if (fs.existsSync(path.join(process.cwd(), 'config', process.env.NODE_ENV + '.js'))) {

          // Load the environment specific config.
          app.config = require(path.join(process.cwd(), 'config', process.env.NODE_ENV))();

        } else {

          app.config = {};

          if (process.env.DATABASE_URL) {

            // Get our connection information.
            var info = process.env.DATABASE_URL.match(/([A-z0-9].+):\/\/([A-z0-9\.].+):([A-z0-9\.].+)@([A-z0-9\.].+):([0-9].+)\/(.*)/);

            app.config.db = {
             driver: info[1],
             host: info[4],
             port: info[5],
             username: info[2],
             password: info[3],
             database: info[6],
             pool: true
            };

          }

          // Import the CDN URL from the configs.
          if (process.env.CDN_URL) app.config.url = {
            cdn: process.env.CDN_URL
          };

        }

        return next();

      },

    ], function(){

      // Let's configure some stuff parallel-ly.
      async.parallel([

        // Favicon.
        function(done){

          app.logger.info('Serving up the favicon...');

          // Setup our Favicon.
          app.use(require('serve-favicon')(path.join(process.cwd(), 'public', 'img', 'favicon.ico')));

          return done();

        },

        // Express configuration (Jade, view compiler).
        function(done){

            app.logger.info('Setting up our Jade views...');

            // Setup Jade.
            app.set('views', path.join(process.cwd(), 'views'));
            app.set('view engine', 'jade');
            app.locals.config = app.config;
            app.locals.environment = process.env.NODE_ENV;
            app.locals.version = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'))).version;

            // Trust out the X-Forwarded-* header fields, usally required when behind a load balance.
            app.enable('trust proxy');
            app.disable('x-powered-by');

            // View cache.
            if (process.env.NODE_ENV !== 'development') {

                app.logger.info('Caching up those views...');

                // We want to cache our views.
                app.enable('view cache');

            }

          return done();

        },

        // Parsers.
        function(done){

          app.logger.info('Setting up the body parser...');

          // Parse forms and JSON requests.
          app.use(require('body-parser').urlencoded({ extended: false }));
          app.use(require('body-parser').json());

          return done();

        },

        // LESS/JS on-the-fly compilers (middlewares).
        function(done){

          // Development environment configuration.
          if (process.env.NODE_ENV === 'development') {

            app.logger.info('Setting up LESS middleware...');

            // Use the LESS middleware.
            app.use(require('less-middleware')(path.join(process.cwd(), 'assets', 'css'), {
              force: true,
              dest: path.join(process.cwd(), 'public'),
              preprocess: {
                path: function(pathname, req){
                  return pathname.replace('/css/', '/');
                }
              }
            }, null, {
              compress: false
            }));

            app.logger.info('Setting up the JavaScript merger...');

            // Use the UglifyJS middleware.
            app.use(require(path.join(process.cwd(), 'lib', 'middlewares', 'merge-js'))({
              src: path.join(process.cwd(), 'assets'),
              match: /\/js\/(.*).js/g
            }));

            app.logger.info('Setting up JSON middleware...');

            // Use the JSON middlware for the locales.
            app.use(require(path.join(process.cwd(), 'lib', 'middlewares', 'json'))({
              dest: path.join(process.cwd(), 'public'),
              src: path.join(process.cwd(), 'assets'),
              match: /\/locales\/(.*).json/g
            }));

            // Serve out static files.
            app.use(require('serve-static')(path.join(process.cwd(), 'public')));

          }

          return done();

        },

        function(done){

          app.logger.info('Setting up ORM (Caminte)...');

          var Schema = require('caminte').Schema;

          // Setting up the database.
          app.db = new Schema(app.config.db.driver, app.config.db);

          app.logger.info('Connecting to DB ' + app.config.db.database + ' on ' + app.config.db.host + ':' + app.config.db.port + ' of type ' + app.config.db.driver + ' using ' + app.config.db.username);

          return done();

        }

      ], function(){

        // Create an empty object to store the models.
        app.db.models = {};
        var models = [];

        var walk = walker.walk(path.join(process.cwd(), 'models'));

        // Loop through all the models.
        walk.on('file', function(root, file, next){

          // Remove the extension.
          models[path.join(root, file.name)] = file.name.substr(0, file.name.indexOf('.'));
          return next();

        });

        // Done loading the models.
        walk.on('end', function(){

          async.series([

            function(next){

              app.logger.info('Loading models...');

              async.each(Object.keys(models), function(path, done){

                // Load the model.
                app.db.models[models[path]] = require(path).model(app.db, app);
                app.logger.info('- Model %s loaded!', models[path]);

                return done();

              }, next);

            },

            function(next){

              app.logger.info('Creating model associations...');

              async.each(Object.keys(models), function(path, done){

                // Load the model.
                var model = require(path);

                // Associate the model.
                if (model.associate) {
                    model.associate.call(app.db.models[models[path]], app.db);
                    app.logger.info('- Model %s associated!', models[path]);
                }

                return done();

              }, next);

            },

            // Load up the controllers.
            function(next){

              app.logger.info('Loading controllers...');

              var walk = walker.walk(path.join(process.cwd(), 'controllers'));

              // Loop through all the controllers.
              walk.on('file', function(root, file, next){

                  // Load the router.
                  var route = require(root + '/' + file.name)(app);
                  app.logger.info('- Controller %s loaded!', file.name);

                  return next();

              });

              // Done loading the controllers.
              walk.on('end', next);

            }

          ], function(){

            async.series([

              // 404 page.
              function(next){

                  // Setup our 404 page.
                  app.use(function(req, res, next){

                      res.status(404);

                      if (req.accepts('html')) return res.redirect('/#/errors/404');
                      if (req.accepts('json')) return res.send({ error: 'Not found' });
                      return res.type('txt').send('Not found');

                  });

                  return next();

              }

            ], function(){

              // Listen for incoming HTTP requests.
              server.listen(process.env.PORT || 3000);

              // Trigger the callback and pass the app.
              return callback(app, server);

            }); // ], function(){

          }); // ], function(){

        }); // walk.on('end', function(){

      }); // ], function(){

    }); // function(next){

  };

})();
