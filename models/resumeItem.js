/**
 * resumeItem.js
 * Defines a line in the resume.
 *
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  'use strict';

  // Export the main app function.
  module.exports = {

    model: function(db, app){

      var ResumeItem = db.define('ResumeItems', {

        type: { type: db.String, limit: 20 },

        place: { type: db.String, limit: 80 },
        location: { type: db.String, limit: 40 },
        title: { type: db.String, limit: 120 },

        yearStart: { type: db.String, limit: 4 },
        yearEnd: { type: db.String, limit: 4 },

        description: { type: db.Text },

      });

      ResumeItem.validatesInclusionOf('type', { in: [ 'work', 'education', 'community', 'certification' ] });

      return ResumeItem;

    }

  };

})();
