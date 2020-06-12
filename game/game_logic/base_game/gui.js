/****************************************************************************
 * gui.js
 *
 * Handles the creation of commonly used GUI components.
 ***************************************************************************/

( function ( babylonProject, undefined )
{

    babylonProject.createButtonPlane = 
        function ( name, planeOptions, buttonOptions, scene, babylon )
    {
        if ( name == undefined )
        {
            throw ( "name parameter is undefined" );
        }

        if ( planeOptions == undefined )
        {
            throw ( "planeOptions parameter is undefined" );
        }

        if ( buttonOptions == undefined )
        {
            throw ( "buttonOptions parameter is undefined" );
        }

        if ( scene == undefined )
        {
            throw ( "scene parameter is undefined" );
        }

        if ( babylon == undefined )
        {
            throw ( "babylon parameter is undefined" );
        }

        let plane = babylon.MeshBuilder.CreatePlane (
            name+"ButtonPlane", planeOptions, scene );

        let advancedTexture = 
            babylon.GUI.AdvancedDynamicTexture.CreateForMesh ( plane );

        let button = 
            babylon.GUI.Button.CreateSimpleButton ( 
                    name+"Button", buttonOptions.buttonText );

        button.width = 1;
        button.height = 0.4;
        button.color = "white";
        button.fontSize = 50;
        button.background = "green";

        button.onPointerUpObservable.add ( buttonOptions.buttonCall );

        advancedTexture.addControl ( button );

        let retVal =
        {
            buttonPlane   : plane,
            button        : button,
            buttonTexture : advancedTexture
        };

        return retVal;
    };

} ( window.babylonProject = window.babylonProject || {} ));
