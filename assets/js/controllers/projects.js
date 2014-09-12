/**
 * projects.js
 * Main controller to retrieve the projects.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  "use strict";

  app.controller('ProjectsCtrl', [ '$scope', '$http', function($scope, $http){

    // Get our dynamic data.
    $http({
      method: 'GET',
      url: '/api/projects'
    }).success(function(data){

      // Export our projects to the scope.
      $scope.projects = data;

    });

  }]);

})();