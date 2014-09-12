/**
 * article.js
 * A model for listing an article about me.
 *
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  'use strict';

  // Export the main app function.
  module.exports = {

    model: function(db, app){

      var Article = db.define('Articles', {

        title: { type: db.String, limit: 80 },
        lang: { type: db.String, limit: 2 }

      });

      Article.validatesInclusionOf('lang', { in: [ 'en', 'fr' ] });

      return Article;

    }

  };

})();