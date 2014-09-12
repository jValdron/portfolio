/**
 * controllers.js
 * Script that concatenate our controllers.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  "use strict";

  var valdronControllers = angular.module('valdronControllers', []);

  @import "controllers/about/me.js";
  @import "controllers/experiences.js";
  @import "controllers/projects.js";
  @import "controllers/resume.js";

})();
