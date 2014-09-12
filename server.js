/**
 * server.js
 * Acts as the central point of the application, loads the bootstrap and
 * then the app goes from there.
 *
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  'use strict';

  var path = require('path');

  // By default, we're in development environment if we have no environment configured.
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  // Include the bootstrap and start listening the application.
  require(path.join(process.cwd(), 'lib', 'bootstrap'))(function(app, server){

    app.logger.info('Awesome porfolio running on port ' + server.address().port + '!');

  });

})();
