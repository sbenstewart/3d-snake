/****************************************************************************
 * gameplayState.js
 *
 * Checks if the snake has moved and updates the grid squares if so.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    babylonProject.GameplayStateData = function ( babylon, scene )
    {
        if ( babylon == undefined )
        {
            throw new Error ( "babylon is undefined." );
        }

        if ( scene == undefined )
        {
            throw new Error ( "scene is undefined." );
        }

        //create snake
        this.snakeParts = babylonProject.snake
            .createSnake ( babylonProject.config.dirLeft, 3);

        //snake move timer and interval

        this.snakeMoveInterval =
            babylonProject.config.snakeMoveInitialInterval;

        this.snakeMoveTimer =
            babylonProject.config.snakeMoveInitialInterval;

        //apple position

        this.applePos = { x : 2, y : 1 };

        //current direction

        this.currentDir = babylonProject.config.dirLeft;

        //turn input controls

        this.turnInputControls = 
            new TurnInputControls ( babylon, scene, this );

    }

    babylonProject.gameplayState = 
        function ( babylon, gameData, stateData )
    {

        if ( babylon == undefined )
        {
            throw new Error ( "babylon is undefined." );
        }

        if ( gameData == undefined )
        {
            throw new Error ( "gameData is undefined." );
        }

        if ( stateData == undefined )
        {
            throw new Error ( "stateData is undefined." );
        }

        let config = window.babylonProject.config;

        //enable arrow buttons that are perpindicular to currentDir

        let setButtonEnabled = ( controlName, enabled ) => 
        {
            stateData.turnInputControls [ controlName ].buttonPlane
                .isEnabled ( enabled  );

            stateData.turnInputControls [ controlName ].button
                .isEnabled = enabled;

            stateData.turnInputControls [ controlName ].button
                .isVisible = enabled;

        }

        let vertical = ( stateData.currentDir == config.dirUp ||
                         stateData.currentDir == config.dirDown );

        setButtonEnabled ( "upControl",   !vertical );
        setButtonEnabled ( "downControl", !vertical );
        setButtonEnabled ( "rightControl", vertical );
        setButtonEnabled ( "leftControl",  vertical );

        //check if move timer has elapsed and move if so

        stateData.snakeMoveTimer -= gameData.engine.getDeltaTime ();

        if ( stateData.snakeMoveTimer <= 0 )
        {
            stateData.snakeMoveTimer = stateData.snakeMoveInterval;

            stateData.snakeParts = 
                window.babylonProject.snake.moveSnake (
                        stateData.currentDir, 
                        stateData.snakeParts, 
                        gameData.wrapTorusCoord );

            stateData.applePos = 
            {
                x : stateData.applePos.x + stateData.currentDir.x,
                y : stateData.applePos.y + stateData.currentDir.y
            };

            stateData.applePos = 
                gameData.wrapTorusCoord ( stateData.applePos );

            window.babylonProject.updateTorusMeshes ( 
                      stateData.snakeParts,
                      stateData.applePos,
                      gameData.torusMeshes,
                      gameData.torusCoordToMeshIdx,
                      gameData.snakeMat,
                      gameData.appleMat  
                      );
        } 

        //render the scene and return next state

        gameData.scene.render ();

        return () => babylonProject
            .gameplayState ( babylon, gameData, stateData );
    }

    /************************************************************************
     * Input Controls
     ***********************************************************************/

    let TurnInputControls = function ( babylon, scene, stateData )
    {
        if ( babylon == undefined )
        {
            throw new Error ( "babylon is undefined." );
        }

        if ( scene == undefined )
        {
            throw new Error ( "scene is undefined." );
        }

        if ( stateData == undefined )
        {
            throw new Error ( "stateData is undefined." );
        }

        let config = babylonProject.config; 

        let buttonData = [
            {
                name        : "up",
                text        : "U",
                dir         : config.dirUp,
                pos         : config.upPos,
                controlName : "upControl"
            },

            {
                name        : "down",
                text        : "D",
                dir         : config.dirDown,
                pos         : config.downPos,
                controlName : "downControl"
            },

            {
                name        : "left",
                text        : "L",
                dir         : config.dirLeft,
                pos         : config.leftPos,
                controlName : "leftControl"
            },

            {
                name        : "right",
                text        : "R",
                dir         : config.dirRight,
                pos         : config.rightPos,
                controlName : "rightControl"
            }
        ];

        let turnControlCallback = function ( stateData, newDir )
        {
            stateData.currentDir = 
                babylonProject.snake
                    .turnSnake ( newDir, stateData.currentDir );
        };

        //Create the data in a loop.  Note that the 'this' parameter is 
        //passed to bind the data to this object as its constructed

        buttonData.forEach ( function ( data )
        {
            this [ data.controlName ] = 
                babylonProject.createButtonPlane (

                    data.name,

                    //plane options
                    {
                        size  : config.turnControlPlaneSize
                    },
                    //button options
                    {
                        buttonText : data.text,
                        buttonCall : 
                            () => turnControlCallback ( stateData, data.dir ) 
                    },
                    scene,
                    babylon

            );
            

            this [ data.controlName ].buttonPlane.position = data.pos;

        }, this);
        
    };


} ( window.babylonProject = window.babylonProject || {} ));
