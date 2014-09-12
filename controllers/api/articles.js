/**
 * articles.js
 * Returns the dynamic elements of the articles in JSON.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package di-api
 */

(function() {
  'use strict';

  var async = require('async');

  // Export the route function.
  module.exports = function(app){

    var cache = {
      data: {},
      lastHit: null
    };

    // GET /api/articles - Responds with the articles in JSON format.
    app.get('/api/articles', function(req, res){

      var Article = app.db.models.article;

      var validCacheTime = (new Date()).getTime() - (30 * 60 * 1000); // Use use a 30 minutes cache.

      // Let's see if we have to grab our data back or we can use our cache.
      if (cache.lastHit && cache.lastHit.getTime() > validCacheTime) {

        return res.status(200).json(cache.data);

      } else {

        // Get all of our articles.
        Article.all({}, function(err, articles){

          cache.data = articles;
          cache.lastHit = new Date();

          return res.status(200).json(articles);

        });

      }

    });

  };

})();