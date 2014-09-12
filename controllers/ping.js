/**
 * ping.js
 * Simply returns PONG. Useful for checking the health from the load balancers.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package di-api
 */

(function() {
  'use strict';

  // Export the route function.
  module.exports = function(app){

    // GET /ping - Responds with 200 PONG.
    app.get('/ping', function(req, res){

      return res.status(200).send('PONG');

    });

  };

})();