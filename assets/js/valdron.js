/**
 * valdron.js
 * Main script that includes everything custom made for 
 * this portfolio, frontend wise.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  "use strict";

  // Define our AngularJS app.
  var app = angular.module('valdronApp', [
    'ngRoute',
    'ngSanitize',
    'i18ng',
    'ngFitText',
    'valdronControllers'
  ]);

  // Configure i18next.
  app.config([ 'i18ngProvider', function(i18ngProvider){

    i18ngProvider.init({
      cookieName: 'valdron.i18n',
      fallbackLng: 'en',
      load: 'unspecific',
      resGetPath: cdn + 'locales/__lng__/__ns__.json',
      ns: {
        namespaces: [ 'app' ],
        defaultNs: 'app'
      }
    });

  }]);

  app.config([ '$sceProvider', function($sceProvider){

    // Remove strick contextual escaping support.
    $sceProvider.enabled(false);

  } ]);

  @import "controllers.js";
  @import "directives/kwicks.js";
  @import "routes.js";
  @import "ui.js";

})();