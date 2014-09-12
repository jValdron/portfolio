/**
 * kwicks.js
 * A directive to use the Kwicks jQuery plugin.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  "use strict";

  app.directive('kwicks', [ function(){
    return {
      restrict: 'A',
      link: function(scope, el, attrs){

        // Wait until we get our data to call the Kwicks plugin.
        scope.$watch(attrs.kwicks, function(data){
          if (data) {

            // Setup Kwicks.
            el.kwicks({
              behavior: 'menu',
              maxSize: 200,
              spacing: 10
            });

          }
        });

      }
    };
  }]);

})();