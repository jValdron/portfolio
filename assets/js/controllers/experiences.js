/**
 * experiences.js
 * Main controller to retrieve the life experiences from the API.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  "use strict";

  app.controller('ExperiencesCtrl', [ '$scope', '$http', function($scope, $http){

    // Get our dynamic experiences data.
    $http({
      method: 'GET',
      url: '/api/experiences'
    }).success(function(data){

      // Export our experiences data to the scope.
      $scope.experiences = data;

    });

  }]);

  app.controller('ExperienceDetailledCtrl', [ '$scope', '$http', '$routeParams', '$location', function($scope, $http, $routeParams, $location){

    // Get our specific experience data.
    $http({
      method: 'GET',
      url: '/api/experience/' + $routeParams.id
    }).success(function(data){

      if (!data || data === 'null') return $location.path('experiences');

      // Export our daitalled experience data to the scope.
      $scope.experience = data;

    });

  }]);

})();