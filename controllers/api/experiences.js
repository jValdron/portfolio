/**
 * experiences.js
 * Returns the dynamic elements of the experiences in JSON.
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

    // GET /api/experiences - Responds with the experiences in JSON format.
    app.get('/api/experiences', function(req, res){

      var Experience = app.db.models.experience;

      var validCacheTime = (new Date()).getTime() - (30 * 60 * 1000); // Use use a 30 minutes cache.

      // Let's see if we have to grab our data back or we can use our cache.
      if (cache.lastHit && cache.lastHit.getTime() > validCacheTime) {

        return res.status(200).json(cache.data);

      } else {

        // Get all of our experiences.
        Experience.all({}, function(err, experiences){

          cache.data = experiences;
          cache.lastHit = new Date();

          return res.status(200).json(experiences);

        });

      }

    });

    // GET /api/experience/:id - Responds with a specific experience in JSON format.
    app.get('/api/experience/:id', function(req, res){

      var Experience = app.db.models.experience;

      // Get all of our experiences.
      Experience.findOne({
        where: {
          id: req.params.id
        }
      }, function(err, experience){

        return res.status(200).json(experience);

      });

    });

  };

})();