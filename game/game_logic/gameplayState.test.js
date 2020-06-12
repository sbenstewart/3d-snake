const startState = require ( "./gameplayState" );

/****************************************************************************
 * gameplayState.test.js
 ***************************************************************************/

/****************************************************************************
 * SETUP / TEARDOWN
 ***************************************************************************/

beforeEach ( () =>
{
    window.babylonProject.updateTorusMeshes = jest.fn ();

    window.babylonProject.config =
    {
        dirUp    : { x : -1, y :  0 },
        dirDown  : { x :  1, y :  0 },
        dirLeft  : { x :  0, y :  1 },
        dirRight : { x :  0, y : -1 },

        isValidDirection : jest.fn (),

        upPos    : { x : -1, y :  0 },
        downPos  : { x :  1, y :  0 },
        leftPos  : { x :  0, y :  1 },
        rightPos : { x :  0, y : -1 },

        upPos : { x : 1, y : 1, z : 1 },

        turnControlPlaneSize : 5,

        snakeMoveInitialInterval : 4
    };

    window.babylonProject.config.isValidDirection
       .mockReturnValue ( true ); 

    window.babylonProject.createButtonPlane = jest.fn ( function ()
    {
        return new MockControl ();
    });

    window.babylonProject.snake = {};

    window.babylonProject.snake.turnAllowed = jest.fn ();

    window.babylonProject.snake.turnSnake = jest.fn ();

    window.babylonProject.snake.moveSnake = jest.fn ();

    window.babylonProject.snake.growSnake = jest.fn ();
    
    window.babylonProject.snake.createSnake = jest.fn ();
});

//Tests can assign a function here to have it called after they exit
let oneTimeCleanUp = () => {};

afterEach ( () =>
{
    //execute the one time cleanup and then set it as an empty function
    //again
 
    oneTimeCleanUp ();

    oneTimeCleanUp  = () => {};
});

/****************************************************************************
 * EXPECTED TEST VALUES
 ***************************************************************************/

//This test data is used to check that the move function is called when
//the timer elapses and that the timer values are set correctly each time

let timerTestData = [
    { 
        snakeMoveTimerBefore : 0,
        moveFunctionsCalled  : true,
        snakeMoveTimerAfter  : 0.5
    }, 

    { 
        snakeMoveTimerBefore : 0.1,
        moveFunctionsCalled  : true,
        snakeMoveTimerAfter  : 0.5
    }, 

    { 
        snakeMoveTimerBefore : 0.2,
        moveFunctionsCalled  : false,
        snakeMoveTimerAfter  : 0.1
    }, 

    { 
        snakeMoveTimerBefore : 0.3,
        moveFunctionsCalled  : false,
        snakeMoveTimerAfter  : 0.2
    }, 

    { 
        snakeMoveTimerBefore : 0.4,
        moveFunctionsCalled  : false,
        snakeMoveTimerAfter  : 0.3
    } ] 


/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

let MockStateData = jest.fn ( function ()
{
    this.snakeParts = jest.fn ();

    this.snakeMoveInterval = jest.fn ();

    this.snakeMoveTimer = jest.fn ();

    this.applePos = jest.fn();
    this.applePos.x = 1;
    this.applePos.y = 2;

    this.snakeMoveInterval = 0.5;
    this.snakeMoveTimer = 0.5;

    this.turnInputControls = jest.fn ();
    this.turnInputControls.upControl = new MockControl ();
    this.turnInputControls.downControl = new MockControl ();
    this.turnInputControls.rightControl = new MockControl ();
    this.turnInputControls.leftControl = new MockControl ();

    this.currentDir = jest.fn ();

});

let MockBabylon = jest.fn ( function ()
{
    this.Mesh = new MockMesh ();

    this.Vector3 = jest.fn ( function ( x, y, z )
    {
        this.x = x;
        this.y = y;
        this.z = z;
    });
});

let MockMesh = jest.fn ( function ()
{
    this.position = jest.fn ();

    this.isEnabled = jest.fn ();
});

let MockControl = jest.fn ( function ()
{
    this.buttonPlane = jest.fn ();
    this.buttonPlane.isEnabled = jest.fn ();

    this.button = jest.fn ();
    this.button.isEnabled = true;
    this.button.isVisible = true;

    this.buttonTexture = jest.fn ();
});

let MockGameData = jest.fn ( function ()
{
    this.snakeParts = jest.fn ();
    this.scene = new MockScene ();
    this.torusMeshes = [];

    this.engine = new MockEngine ();

    this.wrapTorusCoord = jest.fn ();
    this.wrapTorusCoord.mockReturnValue ( jest.fn () );

    this.appleMat = jest.fn ();

    this.snakeMat = jest.fn ();

});

let MockScene = jest.fn ( function ()
{
    this.render = jest.fn();
});

let MockEngine = jest.fn ( function ()
{
    this.getDeltaTime = jest.fn( function ()
    {
        return 0.1;
    });
});

/****************************************************************************
 * TESTS
 ***************************************************************************/

describe ( "window.babylonProject.gameplayState", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.gameplayState )
            .toBeDefined ();
    });

    test ( "expects game data and babylon args to be defined", () =>
    {
        babylon = new MockBabylon ();
        gameData = new MockGameData ();

        expect ( () => 
                window.babylonProject.gameplayState ( ))
            .toThrow ( "babylon is undefined" );
        
        expect ( () => 
                window.babylonProject.gameplayState ( babylon ))
            .toThrow ( "gameData is undefined" );

        expect ( () => 
                window.babylonProject.gameplayState ( babylon, gameData  ))
            .toThrow ( "stateData is undefined" );

    });

    test ( "disables perpindicular move arrows", () =>
    {
        let babylon = new MockBabylon ();

        let gameData = new MockGameData ();

        let stateData = new MockStateData ();

        let config = window.babylonProject.config;

        let u = config.dirUp;
        let d = config.dirDown;
        let l = config.dirLeft;
        let r = config.dirRight;

        let allDirs = [ u, d, l, r ];
        
        let testCases = [
            {
                currentDir : [ u, d ],
                enabled    : [ "right", "left" ],
                disabled   : [ "up",    "down" ]
            },

            {
                currentDir : [ r, l ],
                enabled    : [ "up",    "down" ],
                disabled   : [ "right", "left" ]
            }

        ];

        let updateFunc = 
            window.babylonProject.gameplayState ( 
                    babylon, gameData, stateData );

        let testButtonEnabled = ( dirName, callCount, enabled ) =>
        {
            let controlName = dirName+"Control";

            //plane isEnabled () function should be called

            expect ( stateData.turnInputControls
                   [ controlName ].buttonPlane.isEnabled )
               .toHaveBeenCalledTimes ( callCount );

            expect ( stateData.turnInputControls
                   [ controlName ].buttonPlane.isEnabled )
               .toHaveBeenLastCalledWith ( enabled );

            //button isEnabled and isVisible property should be set

            expect ( stateData.turnInputControls
                   [ controlName ].button.isEnabled )
               .toBe ( enabled );

            expect ( stateData.turnInputControls
                   [ controlName ].button.isVisible )
               .toBe ( enabled );

        };

        //These properties should be reset between each test case
        let resetButtonProperties = () =>
        {
            stateData.turnInputControls
                .upControl.button.isEnabled = undefined;
            
            stateData.turnInputControls
                .downControl.button.isEnabled = undefined;
            
            stateData.turnInputControls
                .leftControl.button.isEnabled = undefined;
            
            stateData.turnInputControls
                .rightControl.button.isEnabled = undefined;

            stateData.turnInputControls
                .upControl.button.isVisble = undefined;
            
            stateData.turnInputControls
                .downControl.button.isVisble = undefined;
            
            stateData.turnInputControls
                .leftControl.button.isVisble = undefined;
            
            stateData.turnInputControls
                .rightControl.button.isVisble = undefined;

        };

        //keeps track of how many times isEnabled should have been called
        //on the buttons - starts at one because it is called during that
        //first call to the state
        let isEnabledCallCount = 1;

        //loop through each test case
        testCases.forEach ( function ( testData )
        {
            //each test case specifies two current directions to set
            testData.currentDir.forEach ( function ( cd )
            {
                //set the current direction
                stateData.currentDir = cd;

                resetButtonProperties ();

                //update the current state and store the returned function
                //for the next testcase
                updateFunc = updateFunc ();

                //expect isEnabled to have been called on all 4 buttons
                isEnabledCallCount += 1;

                //these direction controls should be enabled
                testData.enabled.forEach ( function ( dirName )
                {
                    testButtonEnabled ( dirName, isEnabledCallCount, true );
                });
                
                //these direction controls should be enabled
                testData.disabled.forEach ( function ( dirName )
                {
                    testButtonEnabled ( dirName, isEnabledCallCount, false );
                });
                
                
            });
        });
    });

    test ( "scene.render is called and a function is returned every time "+
           "but update torus meshes, and move snake/apple are only " +
           "called when delta time causes the timer to elapse.",
            () =>
    {

        let babylon = new MockBabylon ();

        let gameData = new MockGameData ();

        let stateData = new MockStateData ();

        //keep a count of how many times the move functions should have
        //been called during the test execution

        let expectedMoveCalls = 0;

        //the previous snake parts are stored so that it is possible to 
        //assert that they were passed to the moveSnake function when the
        //timer elapsed and that the snake parts property is not changed
        //if the timer does not elapse

        let previousSnakeParts = stateData.snakeParts;

        timerTestData.forEach ( function ( testData, idx )
        {
            babylonProject.snake.moveSnake.mockReturnValueOnce (
                    jest.fn () );

            stateData.snakeMoveTimer = testData.snakeMoveTimerBefore;

            //call the state function

            let retVal = babylonProject.gameplayState ( 
                        babylon, gameData, stateData );

            //render should be called every time
            expect ( gameData.scene.render )
                .toHaveBeenCalledTimes ( idx + 1 );

            //these functions should only be called when the snake move 
            //timer elapses

            if ( testData.moveFunctionsCalled )
            {
                expectedMoveCalls += 1;
            } 

            //check the snake was moved

            expect ( babylonProject.snake.moveSnake )
                .toHaveBeenCalledTimes ( expectedMoveCalls );

            expect ( babylonProject.snake.moveSnake )
                .toHaveBeenCalledWith ( 
                        stateData.currentDir,
                        previousSnakeParts,
                        gameData.wrapTorusCoord );
            
            //check the apple was moved

            expect ( gameData.wrapTorusCoord )
                .toHaveBeenCalledTimes ( expectedMoveCalls );

            expect ( gameData.wrapTorusCoord.mock
                .calls [ expectedMoveCalls -1 ] [ 0 ] )
                    .toEqual (   
                    {
                        x : stateData.applePos.x + stateData.currentDir.x,
                        y : stateData.applePos.y + stateData.currentDir.y
                    });

            let wrappedApplePos =
                gameData.wrapTorusCoord.mock
                    .results [ expectedMoveCalls -1 ].value;

            //check the torus meshes were updated

            expect ( babylonProject.updateTorusMeshes )
                .toHaveBeenCalledTimes ( expectedMoveCalls );

            expect ( babylonProject.updateTorusMeshes )
                .toHaveBeenLastCalledWith (
                      stateData.snakeParts,
                      wrappedApplePos,
                      gameData.torusMeshes,
                      gameData.torusCoordToMeshIdx,
                      gameData.snakeMat,
                      gameData.appleMat  
                      );

            //snakeParts should be the last returned value from moveSnake

            expect ( stateData.snakeParts )
                .toBe ( babylonProject.snake.moveSnake.mock
                        .results [ expectedMoveCalls - 1 ].value );

            //the return of the state function should be another function

            expect ( retVal )
                .toBeInstanceOf ( Function );
            
            //the move timer should have decreased by 0.1

            expect ( stateData.snakeMoveTimer )
                .toBeCloseTo ( testData.snakeMoveTimerAfter );

            //the move interval should be unchanged

            expect ( stateData.snakeMoveInterval )
                .toBeCloseTo ( 0.5 );
        });

    });

});

describe ( "window.babylonProject.GameplayStateData", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.GameplayStateData )
            .toBeDefined ();
    });

    test ( "validates parameters", () =>
    {
        let babylon = jest.fn ();
        let scene = jest.fn ();

        expect ( () => babylonProject.GameplayStateData () )
            .toThrow ( "babylon is undefined." );

        expect ( () => babylonProject.GameplayStateData ( babylon ) )
            .toThrow ( "scene is undefined." );

    });

    test ( "returns an object with expected properties", () =>
    {
        let babylon = jest.fn ();
        let scene = jest.fn ();

        let stateData = 
            new babylonProject.GameplayStateData ( babylon, scene );

        // snake was created

        expect ( babylonProject.snake.createSnake )
            .toHaveBeenCalledTimes ( 1 );

        expect ( babylonProject.snake.createSnake )
            .toHaveBeenCalledWith ( babylonProject.config.dirLeft, 3 );

        expect ( stateData.snakeParts )
            .toBe ( babylonProject.snake.createSnake
                    .mock.results [ 0 ].value );

        //snake move timer and interval

        expect ( stateData.snakeMoveInterval )
            .toEqual ( babylonProject.config.snakeMoveInitialInterval );

        expect ( stateData.snakeMoveTimer )
            .toEqual ( babylonProject.config.snakeMoveInitialInterval );

        //apple position

        expect ( stateData.applePos )
            .toEqual ( { x : 2, y : 1 } );

        //current direction

        expect ( stateData.currentDir )
            .toEqual ( babylonProject.config.dirLeft  );

        //turn input controls
        
        expect ( babylonProject.createButtonPlane )
            .toHaveBeenCalledTimes ( 4 );

        let createButtonMock = babylonProject.createButtonPlane.mock; 

        expect ( stateData.turnInputControls.upControl )
            .toBe ( createButtonMock.results [ 0 ].value );

        expect ( stateData.turnInputControls.downControl )
            .toBe ( createButtonMock.results [ 1 ].value );

        expect ( stateData.turnInputControls.leftControl )
            .toBe ( createButtonMock.results [ 2 ].value );

        expect ( stateData.turnInputControls.rightControl )
            .toBe ( createButtonMock.results [ 3 ].value );

        //check the callback function was passed to each button
        //and executes snake.turnSnake when called

        createButtonMock.calls.forEach ( function ( call, idx )
        {
            expect ( call [ 2 ].buttonCall )
                .toBeInstanceOf ( Function );

            babylonProject.snake.turnSnake
                .mockReturnValueOnce ( jest.fn () );

            call [ 2 ].buttonCall ();

            expect ( babylonProject.snake.turnSnake )
                .toHaveBeenCalledTimes ( idx + 1 );

            expect ( stateData.currentDir )
                .toBe ( babylonProject.snake.turnSnake
                        .mock.results [ idx ].value );
        });
    });

});


