/**
 * resume.js
 * Main controller to retrieve the dynamic resume stuff.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  "use strict";

  app.controller('ResumeCtrl', [ '$scope', '$http', function($scope, $http){

    // Get our dynamic resume data.
    $http({
      method: 'GET',
      url: '/api/resume'
    }).success(function(data){

      // Export our resume data to the scope.
      $scope.resume = data;

    });

  }]);

})();