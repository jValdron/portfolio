/**
 * routes.js
 * Provides the routes for our frontend.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  "use strict";

  app.config([ '$routeProvider', function($routeProvider){

    $routeProvider

      // GET / - Redirect to intro page.
      .when('/', {
        redirectTo: '/intro',
        key: 'intro'
      })

      // GET /intro - Intro page - Quick overview of the portfolio.
      .when('/intro', {
        templateUrl: cdn + 'views/pages/intro.html?v=' + version,
        key: 'intro'
      })

      // GET /resume - Resume page - Gets the resume information from the backend.
      .when('/resume', {
        templateUrl: cdn + 'views/pages/resume.html?v=' + version,
        controller: 'ResumeCtrl',
        key: 'resume'
      })

      // GET /about/me - About page - More information about Jason Valdron.
      .when('/about/me', {
        templateUrl: cdn + 'views/pages/about/me.html?v=' + version,
        controller: 'AboutMeCtrl',
        key: 'about-me'
      })

      // GET /about/portfolio - About page - More information about the portfolio.
      .when('/about/portfolio', {
        templateUrl: cdn + 'views/pages/about/portfolio.html?v=' + version,
        key: 'about-portfolio'
      })

      // GET /projects - Projects page - Gets a listing of all the projects.
      .when('/projects', {
        templateUrl: cdn + 'views/pages/projects.html?v=' + version,
        controller: 'ProjectsCtrl',
        key: 'projects'
      })

      // GET /experiences - Experiences page - Gets information from life/volunteer experiences.
      .when('/experiences', {
        templateUrl: cdn + 'views/pages/experiences.html?v=' + version,
        controller: 'ExperiencesCtrl',
        key: 'experiences'
      })

      // GET /experience/:id - Experience page - Gets detailled information from one life/volunteer experience.
      .when('/experience/:id', {
        templateUrl: cdn + 'views/pages/experience-detailled.html?v=' + version,
        controller: 'ExperienceDetailledCtrl',
        key: 'experiences'
      })

      // GET /errors/404 - Page Not Found.
      .when('/errors/404', {
        templateUrl: cdn + 'views/errors/404.html?v=' + version,
        key: 'error'
      })

      .otherwise({
        redirectTo: '/errors/404'
      });

  }]);

  // Dynamically adjust the titles and propagate the current page to the rootScope.
  app.run([ '$rootScope', 'i18ng', function($rootScope, i18ng){

      $rootScope.$on('$routeChangeSuccess', function(e, current, previous){

        document.title = i18ng.t(current.$$route.key + '.title');
        $rootScope.currentPage = current.$$route.key;

        $('body').trigger('routeChange');

      });

  }]);

})();