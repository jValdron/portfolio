/**
 * merge-js.js
 * A middleware to merge JavaScript files. Requires 2 options: src and match. It
 * doesn't compress or cache the files as this is for development purposes, on
 * production, everything gets compiled.
 *
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  'use strict';

  var fs = require('fs-extra');

  // Export the library function.
  module.exports = function(options){

    return function(req, res, next){

      // Check if we have a locale JSON file.
      if (req.url.match(options.match)) {

        // We replace .. just to make sure we don't go back and we remove the query string.
        req.url = req.url.replace(/\.\./g, '');
        req.url = (req.url.indexOf('?') > -1 ? req.url.substr(0, req.url.indexOf('?')) : req.url);

        // Set the paths for the original and the compressed files.
        var original = options.src + req.url;

        // Read the original.
        fs.readFile(original, {
            encoding: 'utf8'
        }, function(err, script){

          if (err) return next(err);

          // Send out the original file.
          res.header('Content-Type', 'text/javascript');

          var replace = function(script){

            return script.replace(/\@import "(.*)";/g, function(match, url){
                return replace(fs.readFileSync(process.cwd() + '/assets/' + req.url.substr(0, req.url.lastIndexOf('/') + 1) + url, {
                  encoding: 'utf8'
                }));
            });

          };

          // Include our imports.
          script = replace(script);

          return res.end(script);

        });

      } else {
        return next();
      }

    };

  };

})();