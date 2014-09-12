/**
 * development.js
 * Provides development specific configurations.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  'use strict';

  var path = require('path');

  // Export the config object.
  module.exports = function(){

    return {

      // See CaminteJS documentation: https://github.com/biggora/caminte
      db: {
        driver: 'sqlite',
        database: path.join(process.cwd(), 'db', 'valdron.db')
      },

      // Absolute URLs to external services.
      url: {
        cdn: '/'
      },

      // AWS connection settings, not required on dev, but on production. This 
      // is required to deploy to the S3 bucket that is configured with Cloudfront.
      aws: {
        key: null,
        secret: null,
        s3: {
          bucket: null
        }
      }

    };

  };

})();