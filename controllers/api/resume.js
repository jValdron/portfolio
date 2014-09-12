/**
 * resume.js
 * Returns the dynamic elements of the resume in JSON.
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

    // GET /api/resume - Responds with the resume in JSON format.
    app.get('/api/resume', function(req, res){

      var ResumeItem = app.db.models.resumeItem,
          Skill = app.db.models.skill;

      var validCacheTime = (new Date()).getTime() - (30 * 60 * 1000); // Use use a 30 minutes cache.

      // Let's see if we have to grab our data back or we can use our cache.
      if (cache.lastHit && cache.lastHit.getTime() > validCacheTime) {

        return res.status(200).json(cache.data);

      } else {

        // Start out an object to store those items grouped by their types.
        var items = {
          community: [],
          education: [],
          skills: {
            cloud: [],
            coding: [],
            database: [],
            design: [],
            os: []
          },
          work: []
        };

        async.parallel([

          function(done){

            // Get all of our resume items.
            ResumeItem.all({
              order: 'type, yearStart DESC'
            }, function(err, entries){

              // Push out the item in each types.
              entries.forEach(function(entry){
                items[entry.type].push(entry);
              });

              return done();

            });

          },

          function(done){

            // Get all the tech skills.
            Skill.all({
              order: 'type, years DESC'
            }, function(err, entries){

              // Push out the item in each types.
              entries.forEach(function(entry){
                items.skills[entry.type].push(entry);
              });

              return done();

            });

          }

        ], function(){

          cache.data = items;
          cache.lastHit = new Date();

          return res.status(200).json(items);

        });

      }

    });

  };

})();