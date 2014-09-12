/**
 * experience.js
 * Contains the definition for a life experience.
 *
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  'use strict';

  // Export the main app function.
  module.exports = {

    model: function(db, app){

      var Experience = db.define('Experiences', {

        title: { type: db.String, limit: 120 },
        location: { type: db.String, limit: 40 },

        yearStart: { type: db.String, limit: 4 },
        yearEnd: { type: db.String, limit: 4 },

        about: { type: db.Text },
        role: { type: db.Text },
        victory: { type: db.Text }

      });

      Experience.validatesInclusionOf('type', { in: [ 'coding', 'designAndCoding', 'frontend', 'modification' ] });

      return Experience;

    }

  };

})();