/**
 * project.js
 * A model detailling a project in the application.
 *
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  'use strict';

  // Export the main app function.
  module.exports = {

    model: function(db, app){

      var Project = db.define('Projects', {

        title: { type: db.String, limit: 80 },
        employer: { type: db.String, limit: 80 },
        description: { type: db.Text }

      });

      return Project;

    }

  };

})();