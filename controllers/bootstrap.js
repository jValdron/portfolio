/**
 * bootstrap.js
 * Renders the bootstrap view, serves to bootstrap the whole frontend.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package di-api
 */

(function() {
  'use strict';

  // Export the route function.
  module.exports = function(app){

    // GET / - Responds with the bootstrap view.
    app.get('/', function(req, res){

      return res.render('bootstrap');

    });

  };

})();