/**
 * views.js
 * Serves up a rendered view on development.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package di-api
 */

(function() {
  'use strict';

  // Export the route function.
  module.exports = function(app){

    // GET /views/* - Renders the requested view.
    app.get('/views/*', function(req, res){

      var view = req.url.replace('/views/', '').replace('.html', '');
      return res.render(view);

    });

  };

})();