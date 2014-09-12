/**
 * projects.js
 * Returns the dynamic elements of the projects in JSON.
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

    // GET /api/projects - Responds with the projects in JSON format.
    app.get('/api/projects', function(req, res){

      var Project = app.db.models.project;

      var validCacheTime = (new Date()).getTime() - (30 * 60 * 1000); // Use use a 30 minutes cache.

      // Let's see if we have to grab our data back or we can use our cache.
      if (cache.lastHit && cache.lastHit.getTime() > validCacheTime) {

        return res.status(200).json(cache.data);

      } else {

        // Get all of our projects.
        Project.all({}, function(err, projects){

          cache.data = projects;
          cache.lastHit = new Date();

          return res.status(200).json(projects);

        });

      }

    });

  };

})();