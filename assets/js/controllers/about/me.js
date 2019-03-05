/**
 * me.js
 * Main controller to retrieve the articles in the about me page.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  "use strict";

  app.controller('AboutMeCtrl', [ '$scope', '$http', function($scope, $http){

    // Get our dynamic data.
    $http({
      method: 'GET',
      url: '/api/articles'
    }).then(function(result){

      // Export our articles to the scope.
      $scope.articles = result.data;

    });

  }]);

})();