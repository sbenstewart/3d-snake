/****************************************************************************
 * createVRScene.js
 *
 * Used to create an empty babylon scene with the default VR experience.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    /**
     * createVRSceme ( babylon, engine )
     *
     * Returns a Babylon scene with the default VR experience.     
     */
    babylonProject.createVRScene = function ( babylon, engine )
    {
        let scene = new babylon.Scene ( engine );

        scene.createDefaultEnvironment ();
        
        let vrHelper = scene.createDefaultVRExperience ();

        let returnValue = 
        {
            scene    : scene,
            vrHelper : vrHelper
        };

        return returnValue;
    };
} ( window.babylonProject = window.babylonProject || {} ));
