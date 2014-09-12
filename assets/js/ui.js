/**
 * ui.js
 * A couple of utilities methods to make the UI work correctly.
 * 
 * @author  Jason Valdron <jason@valdron.ca>
 * @package valdron
 */

(function(){
  "use strict";

  $(document).ready(function(){

    // Provides a way to open pages in a new tab/window.
    $('body').on('click', 'a[rel=external]', function(e){

      e.preventDefault();
      window.open($(this).attr('href'));

    });

    // Fade the fade block element, the gradient.
    $('body').on('routeChange', function(){

      $('#fade').hide();

      setTimeout(function(){
        $('#fade').fadeIn(250);
      }, 150);

    });

  });

})();