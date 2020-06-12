/****************************************************************************
 * pageLoaded.js
 *
 * The page loaded function is called by the jQueryDomFunctions.js 
 * module when the HTML Document is ready.
 *
 * This is the entry point into the game logic.  The game should be 
 * initialized and the first state of the finite state machine defined
 * in game_state/ should be loaded for the game loop to execute.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    /**
     * pageLoaded ( documentRef, babylonRef )
     *
     * The first game logic function that is called when the
     * HTML page is ready.
     *
     * Sets the babylonProject.nextUpdate function pointer to be
     * babylonProject.startState
     *
     * Parameters:
     *  - documentRef: The HTML DOM object 'document'
     *  - babylonRef : A reference to the Babylon object
     */
    babylonProject.pageLoaded = function ( documentRef, babylonRef )
    {
        let canvas = documentRef.querySelector( "#renderCanvas" );

        let gameData = 
        {
            engine : babylonProject
                        .createBabylonEngine ( babylonRef, canvas )
        }

        //set the next update to be the startState function
        babylonProject.nextUpdate = () => 
                    babylonProject.startState( babylonRef, gameData );

        gameData.engine.runRenderLoop ( babylonProject.gameLoop );
    };

    /**
     * createBabylonEngine ( babylonRef, canvas )
     *
     * The call to the constructor of the Babylon engine has been 
     * encapsulated within this factory method to enable mocking
     * of the engine object during testing.
     */
    babylonProject.createBabylonEngine = function ( babylonRef, canvas )
    {
        //check if canvas is undefined as it would create a silent error
        //if the engine was initialized without a valid canvas

        if ( canvas == null )
        {
            throw "Canvas is undefined.";
        }

        return new babylonRef.Engine ( canvas, true );
    };
} ( window.babylonProject = window.babylonProject || {} ));
