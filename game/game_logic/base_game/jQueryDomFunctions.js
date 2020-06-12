/****************************************************************************
 * jQueryDomFunctions.js
 * 
 * Functions where the game interacts with the DOM are defined here.
 *
 * This function is outside the coverage of unit testing as it was 
 * awkward to mock jQuery and the DOM.
 *
 * Where possible it simply  passes DOM objects to a function within the
 * scope of tests.
 ***************************************************************************/

(function( babylonProject, $,  undefined )
{
    //Called when all HTML/DOM objects have been loaded.
    $(document).ready(function() 
    {
        babylonProject.pageLoaded ( document, BABYLON );
    });

    //Dynamically resizes the canvas as the browser window changes.
    // The babylon game engine is no longer available as a global var
    // if the resize function is needed in future it will have to be 
    // rewritten so that the engine instance is passed to it from the
    // pageloaded.js script
//    $(window).on("resize load", function()
//    {
//        if ( babylonProject.engine )
//        {
//            babylonProject.engine.resize();
//        }
//    });

} ( window.babylonProject = window.babylonProject || {},
    jQuery));
