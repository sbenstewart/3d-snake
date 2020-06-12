/****************************************************************************
 * startState.js
 * 
 * The ./base_game/ functions define a gameLoop that expects a function
 * with no paramters each tick.
 *
 * On page load babylonProject.startState ( babylon, gameData ) is set to be
 * called.
 *
 * When called it is expected to update the game state and return a 
 * function pointer that can be called with no parameters on the next
 * update.
 *
 * By default the startState will expect the gameData to have a property
 * 'gameData.engine' that contains an instance of the BabylonJS engine 
 * created by the page loaded function.
 *
 * if gameData.scene has not beed defined the function will create it 
 * and the game objects needed.  Any extra data needed for the game will
 * be stored in gameData.
 *
 * The function will update the state and then use the javascript 
 * arrow notation to return a function pointer that can be called with no
 * paramters for the next update tick of the game loop.
 *      
 * See ./base_game/gameLoop.js for more information.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    /**
     * babylonProject.startState ( babylon, gameData)
     *
     * Updates the game's state and returns a function that can be 
     * called with no paramters for the next update.
     */
    babylonProject.startState = function ( babylon, gameData )
    {
        if ( gameData == undefined )
        {
            throw new Error ( "GameData is undefined." );
        }

        if ( gameData.engine == undefined )
        {
            throw new Error ( "Engine is undefined." );
        }

        if ( babylon == undefined )
        {
            throw new Error ( "Babylon is undefined." );
        }

        //private procedure used to initialize all the game objects
        initializeGameData ( babylon, gameData );

        //create the data for the next state

        let stateData = 
            new babylonProject.GameplayStateData ( babylon, gameData.scene );

        return () => 
            babylonProject.gameplayState ( babylon, gameData, stateData );
    }; 

    /************************************************************************
     * PRIVATE FUNCTIONS
     ***********************************************************************/

    let initializeGameData = function ( babylon, gameData )
    {
        createScene ( babylon, gameData );

        createMaterials ( babylon, gameData );

        createTorus ( babylon, gameData );

        createTorusMeshes ( babylon, gameData ); 

        createTorusIndexFunctions ( gameData );

    }

    let createScene = function ( babylon, gameData )
    {

        //create the VR scene using base_game/ createVRScene function
        let vrSceneData =
            babylonProject.createVRScene ( babylon, gameData.engine );
 
        gameData.scene = vrSceneData.scene;

        gameData.vrHelper = vrSceneData.vrHelper;

        gameData.vrHelper.enableInteractions ();

        //create light
        gameData.light = new babylon.DirectionalLight (
                "light", 
                new babylon.Vector3 ( 0, 0.5, 1.0 ), 
                gameData.scene  );
 
        gameData.light.position = new babylon.Vector3 ( 0, 5, 2 );

    }

    let createMaterials = function ( babylon, gameData )
    {

       gameData.torusMat = 
           new babylon.StandardMaterial ( "torusMat", gameData.scene );

       gameData.snakeMat = 
           new babylon.StandardMaterial ( "snakeMat", gameData.scene );

       gameData.snakeMat.diffuseColor =
           new babylon.Color3 ( 0, 255, 0 );

       gameData.appleMat = 
           new babylon.StandardMaterial ( "appleMat", gameData.scene );

       gameData.appleMat.diffuseColor =
           new babylon.Color3 ( 255, 0, 0 );

    }

    let createTorus = function ( babylon, gameData )
    {
        //Create torus
        torus_options = 
        {
            diameter : 3,
            thickness : 0.75,
            tessellation : 16 
        }
 
        gameData.torus = babylon.MeshBuilder.CreateTorus (
                "torus", torus_options, gameData.scene );
 
        gameData.torus.position = new babylon.Vector3 ( 0, 1, 0 );
 
        //set torus material and make wireframe
        gameData.torus.material = gameData.torusMat;
 
        gameData.torus.material.wireframe = true;
 
    }

    let createTorusMeshes = function ( babylon, gameData )
    {
        //create a mesh for every unique vertex of the torus
        //
        //There will be duplicated vertex positions for each row
        //and column of the grid.
        //
        //To avoid duplicate torus meshes the last element in each row
        //and the last column of the vertex data will be skipped
        //
        //A torus with tesselation of n will correspond to a snake
        //grid with n-1 rows and columns
        
        let torusVD = gameData.torus
            .getVerticesData ( babylon.VertexBuffer.PositionKind ) ;
 
        gameData.torusMeshes = [];
 
        //loop through vertex position buffer 3 spaces at a time 
        //in order to read position data as float3[]
        //
        //The loop termination condition stops before the last row
        //of data.

        let vertexGridElems = torusVD.length / 3;

        let vertexGridSize = Math.sqrt ( vertexGridElems );

        let snakeGridSize = vertexGridSize - 1;

        let snakeGridElems = snakeGridSize * snakeGridSize;

        //keep track of spawn count for assigning ID
        let spawnCount = 0;

        torusVD.forEach ( function ( value, idx, array )
        {
            //vector3s are stored as 3 list elements so only process
            //every third item
            
            if ( idx % 3 != 0 )
            {
                return;
            }

            //store the vector idx for readability

            let vectorIdx = idx/3;

            //skip the final row of vertex grid

            if ( vectorIdx >= vertexGridElems - vertexGridSize )
            {
                return;
            }

            //skip the final element of each row of the vertex grid

            if ( ( vectorIdx + 1 ) % vertexGridSize == 0 )
            {
                return;
            }
            
            //use string formatter to make unique name
            let meshName = `TorusMesh${ spawnCount++ }`; 
            
            let mesh = babylon.MeshBuilder.CreateSphere (
                    meshName,
                    { diameter : 0.1 },
                    gameData.scene );
 
            let vertexPos = babylon.Vector3.FromArray ( torusVD, idx );
 
            mesh.position = vertexPos.add (
                   gameData.torus.position,  );
 
            gameData.torusMeshes.push ( mesh );

        });
    }

    /**
     * This sub-routine stores function calls to the index mapping
     * functions so that they can be called elsewhere in the system
     * without having to pass things like the grid size or other
     * data that doesn't change throughout the game.
     */ 
    let createTorusIndexFunctions = function ( gameData )
    {
        let width = Math.sqrt ( gameData.torusMeshes.length );

        gameData.meshIdxToTorusCoord = 
            ( i ) => window.babylonProject.listIdxToCoord 
                         ( 
                            i, width, gameData.torusMeshes.length
                         );

        gameData.torusCoordToMeshIdx  = 
            ( coord ) => window.babylonProject.coordToListIdx  
                         ( 
                            coord, width, gameData.torusMeshes.length
                         );

        gameData.wrapTorusCoord  = 
            ( coord ) => window.babylonProject.wrapCoordinate  
                         ( 
                            coord, width, width
                         );

    }
} ( window.babylonProject = window.babylonProject || {} ));
