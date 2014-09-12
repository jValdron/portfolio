/**
 * skill.js
 * Definition for a skill that I have experience on.
 *
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  'use strict';

  // Export the main app function.
  module.exports = {

    model: function(db, app){

      var Skill = db.define('Skills', {

        type: { type: db.String, limit: 20 },
        name: { type: db.String, limit: 40 },
        years: { type: db.Number }

      });

      Skill.validatesInclusionOf('type', { in: [ 'coding', 'database', 'cloud', 'os', 'design' ] });

      return Skill;

    }

  };

})();