/**
 * json.js
 * A middleware to compress JSON files. Requires 3 options: src, dest and match.
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
        var original = options.src + req.url,
            compressed = options.dest + req.url;

        // Set the JSON file header.
        res.header('Content-Type', 'application/json');

        // Get the stats of the original file.
        fs.stat(original, function(err, originalStats){

          // Report any errors we have.
          if (err) return next(err);

          // Get the stats of the compressed file.
          fs.stat(compressed, function(err, compressedStats){

            // Check if we're missing the file or the file has been modified.
            if ((err && err.code === 'ENOENT') || (originalStats && originalStats.mtime > compressedStats.mtime)) {

              // Read the original.
              fs.readFile(original, {
                  encoding: 'utf8'
              }, function(err, locale){

                // Report any errors we have.
                if (err) return next(err);

                try {

                  // Parse the JSON and the stringify it.
                  var data = JSON.stringify(JSON.parse(locale));

                  var write = function(){

                    // Write the compressed JSON file to the compressed path.
                    fs.writeFile(compressed, data, {
                        encoding: 'utf8'
                    }, function(err){

                      if (err && err.code ==='ENOENT') {

                        // Create the folder as it doesn't exist.
                        return fs.mkdirs(compressed.substr(0, compressed.lastIndexOf('/') + 1), write);

                      }

                      // Report any errors we have.
                      if (err) return next(err);

                      // Send out the compressed data.
                      return res.end(data);

                    });

                  };

                  return write();

                } catch(e) {
                    return next(e);
                }

              });

            } else {

              // Read the compressed file as this is the latest version.
              fs.readFile(compressed, {
                  encoding: 'utf8'
              }, function(err, data){

                // Report any errors we have.
                if (err) return next(err);

                // Send out the compressed data.
                return res.end(data);

              });

            }

          });

        });

      } else {
        return next();
      }

    };

  };

})();