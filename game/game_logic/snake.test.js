const test_module = require ("./snake");
!!

/****************************************************************************
 * snake.test.js
 ***************************************************************************/

/****************************************************************************
 * EXPECTED TEST VALUES
 ***************************************************************************/

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

beforeEach ( () =>
{
    window.babylonProject.config =
    {
        dirUp    : { x : -1, y :  0 },
        dirDown  : { x :  1, y :  0 },
        dirLeft  : { x :  0, y :  1 },
        dirRight : { x :  0, y : -1 },

        isValidDirection : jest.fn ()
    };

    window.babylonProject.config.isValidDirection
        .mockReturnValue ( true );
});

/****************************************************************************
 * SETUP / TEARDOWN
 ***************************************************************************/

beforeEach ( () =>
{
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
 * TESTS
 ***************************************************************************/

describe ( "babylonProject.snake", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.snake )
            .toBeDefined ();
    });

});

describe ( "babylonProject.snake.turnAllowed", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.snake.turnAllowed )
            .toBeDefined ();
    });

    test ( "validates direction parameters", () =>
    {
        babylonProject.config.isValidDirection
            .mockReturnValueOnce ( false );

        expect ( () => babylonProject.snake.turnAllowed () )
            .toThrow ( "newDir is not valid direction" );
            
        babylonProject.config.isValidDirection
            .mockReturnValueOnce ( true );

        babylonProject.config.isValidDirection
            .mockReturnValueOnce ( false );

        expect ( () => babylonProject.snake.turnAllowed () )
            .toThrow ( "currentDir is not valid direction" );
            
    });

    test ( "returns true if directions are perpindicular", () =>
    {
        let config = window.babylonProject.config;

        let u = config.dirUp;
        let d = config.dirDown;
        let l = config.dirLeft;
        let r = config.dirRight;

        let trueTestCases = [ [ u, r ], [ u, l ], [ d, r ], [ d, l ] ];

        let falseTestCases = [ [ u, u ], [ u, d ], [ d, d ], 
                               [ r, l ], [ r, r ], [ l, l ] ];

        //test cases expected to be true:

        trueTestCases.forEach ( function ( testCase )
        {
            //test each pair of directions

            expect ( babylonProject.snake.turnAllowed ( 
                        testCase [ 0 ], testCase [ 1 ] ) )
                .toEqual ( true );

            //test the reverse of each test case

            expect ( babylonProject.snake.turnAllowed ( 
                        testCase [ 1 ], testCase [ 0 ] ) )
                .toEqual ( true );

        });

        //test cases expected to be false:

        falseTestCases.forEach ( function ( testCase )
        {
            //test each pair of directions

            expect ( babylonProject.snake.turnAllowed ( 
                        testCase [ 0 ], testCase [ 1 ] ) )
                .toEqual ( false );

            //test the reverse of each test case

            expect ( babylonProject.snake.turnAllowed ( 
                        testCase [ 1 ], testCase [ 0 ] ) )
                .toEqual ( false );

        });

    });

});

describe ( "babylonProject.snake.moveSnake", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.snake.moveSnake )
            .toBeDefined ();
    });

    test ( "validates direction parameters", () =>
    {
        babylonProject.config.isValidDirection
            .mockReturnValueOnce ( false );

        expect ( () => babylonProject.snake.moveSnake () )
            .toThrow ( "dir is not valid direction" );
            
    });

    test ( "returns new array of same length and each item in the array"+
           "has been offset according to movement dir and wrapped", () =>
    {
        let snakeParts =  [ { x : 0, y : 0 },
                            { x : 2, y : 1 },
                            { x : 2, y : 2 },
                            { x : 3, y : 3 },
                            { x : 3, y : 4 },
                            { x : 3, y : 5 } ];

        let dir = babylonProject.config.dirUp;

        let wrapFunc = jest.fn ();

        wrapFunc.mockReturnValue ( {} );

        let newSnake = babylonProject.snake
            .moveSnake ( dir, snakeParts, wrapFunc );

        expect ( newSnake )
            .toBeInstanceOf ( Array );

        expect ( newSnake )
            .not.toBe ( snakeParts );

        expect ( newSnake.length )
            .toEqual ( snakeParts.length );

        expect ( wrapFunc )
            .toHaveBeenCalledTimes ( snakeParts.length - 1 );

        newSnake.forEach ( function ( val, idx )
        {
            if ( idx == 0 )
            {
                //head should be ( 0, 0 )
                expect ( newSnake [ idx ] )
                    .toEqual ( { x : 0, y : 0 } );

            }
            else
            {
                //wrapFunc should have been called with the sum of dir
                //and the previous snakePart

                expect ( wrapFunc.mock.calls [ idx - 1 ] [ 0 ] )
                    .toEqual ( { x : dir.x + snakeParts [ idx - 1 ].x,
                                 y : dir.y + snakeParts [ idx - 1 ].y } );

                //value in array should be result of wrapFunc
                expect ( newSnake [ idx ] )
                    .toEqual ( wrapFunc.mock.results [ idx - 1 ].value );

            }
        });
    });

});

describe ( "babylonProject.snake.turnSnake", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.snake.turnSnake )
            .toBeDefined ();
    });

    test ( "returns newDir if turnAllowed returns true", () =>
    {
        let oldFunc = babylonProject.snake.turnAllowed;

        babylonProject.snake.turnAllowed = jest.fn ();

        oneTimeCleanUp = 
            () => { babylonProject.snake.turnAllowed = oldFunc; } 

        babylonProject.snake.turnAllowed.mockReturnValueOnce ( true );

        let newDir = jest.fn (); 

        let currentDir = jest.fn (); 

        expect ( babylonProject.snake.turnSnake ( newDir, currentDir ) )
            .toBe ( newDir );

    });

    test ( "returns currentDir if turnAllowed returns false", () =>
    {
        let oldFunc = babylonProject.snake.turnAllowed;

        babylonProject.snake.turnAllowed = jest.fn ();

        oneTimeCleanUp = 
            () => { babylonProject.snake.turnAllowed = oldFunc; } 

        babylonProject.snake.turnAllowed.mockReturnValueOnce ( false );

        let newDir = jest.fn (); 

        let currentDir = jest.fn (); 

        expect ( babylonProject.snake.turnSnake ( newDir, currentDir ) )
            .toBe ( currentDir );

    });

});

describe ( "babylonProject.snake.growSnake", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.snake.growSnake )
            .toBeDefined ();
    });

    test ( "adds new head and calls moveSnaje", () =>
    {
        //replace moveSnake with mock function
        
        let oldFunc = babylonProject.snake.moveSnake;

        babylonProject.snake.moveSnake = jest.fn ();

        babylonProject.snake.moveSnake.mockReturnValueOnce ( jest.fn () );

        oneTimeCleanUp = 
            () => { babylonProject.snake.moveSnake = oldFunc; } 

        //call function with typical data

        let dir = babylonProject.config.dirUp;
        let snakeParts = [ { x:0,y:0 }, { x:1,y:0 }, { x:1,y:1 } ];
        let wrapFunc = jest.fn();

        let retVal = 
            babylonProject.snake.growSnake ( dir, snakeParts, wrapFunc );

        //expect moveSnake function to have been called and its return to
        //have been passed through

        let moveSnake = babylonProject.snake.moveSnake; 

        expect ( moveSnake ).toHaveBeenCalledTimes ( 1 );

        expect ( moveSnake.mock.calls [ 0 ] [ 0 ] )
            .toBe ( dir );

        //check new head was added
        expect ( moveSnake.mock.calls [ 0 ] [ 1 ] [ 0 ] )
            .toEqual ( { x : 0, y : 0 } );

        //check remaining snakeparts array is intact
        expect ( moveSnake.mock.calls [ 0 ] [ 1 ].slice ( 1 )  )
            .toEqual ( snakeParts );

        expect ( moveSnake.mock.calls [ 0 ] [ 2 ] )
            .toBe ( wrapFunc );

        //expect return value passed through unchanged from moveSnake

        expect ( retVal )
            .toBe ( moveSnake.mock.results [ 0 ].value );

        expect ( retVal )
            .toEqual ( moveSnake.mock.results [ 0 ].value );

    });

});

describe ( "babylonProject.snake.createSnake", () =>
{
    test ( "is defined", () =>
    {
        expect ( babylonProject.snake.createSnake )
            .toBeDefined ();
    });

    test ( "checks length is > 0", () =>
    {
        expect ( () => babylonProject.snake.createSnake ( undefined, 0 ) )
            .toThrow ( "length must be > 0" );

        expect ( () => babylonProject.snake.createSnake ( undefined, -10 ) )
            .toThrow ( "length must be > 0" );

    });

    test ( "calls grow snake [length] times and returns final call", () =>
    {
        //replace growSnake with mock function
        
        let oldFunc = babylonProject.snake.growSnake;

        babylonProject.snake.growSnake = jest.fn ();

        let mockGrowSnake = babylonProject.snake.growSnake;

        mockGrowSnake.mockReturnValueOnce ( jest.fn () );
        mockGrowSnake.mockReturnValueOnce ( jest.fn () );
        mockGrowSnake.mockReturnValueOnce ( jest.fn () );
        mockGrowSnake.mockReturnValueOnce ( jest.fn () );

        oneTimeCleanUp = 
            () => { babylonProject.snake.growSnake = oldFunc; } 

        //call create snake with len 4

        let dir = jest.fn ();

        let retVal = babylonProject.snake.createSnake ( dir, 4 );

        expect ( mockGrowSnake )
            .toHaveBeenCalledTimes ( 4 );

        //result of each growSnake call is passed to the next

        mockGrowSnake.mock.calls.forEach ( function ( val, idx, array )
        {
            //first parameter is always dir

            expect ( val [ 0 ] ).toBe ( dir );

            //first call is passed [] as snakeParts
            if ( idx == 0 )
            {
                expect ( val [ 1 ] ).toEqual ( [] );
            }
            //subsquent calls passed return value of last as snakeParts
            else
            {
                expect ( val [ 1 ] )
                    .toEqual ( 
                            mockGrowSnake.mock.results [ idx - 1 ].value );
            }

            //third paramter is a function that returns the current snake
            //parts ( i.e. wrap function that returns its input coord )

            expect ( val [ 2 ] )
                .toBeInstanceOf ( Function );
            
            expect ( val [ 2 ] ( val [ 1 ] ) )
                .toBe ( val [ 1 ] );
        });

        //returns the final result of growSnake

        expect ( retVal )
            .toBe ( mockGrowSnake.mock.results [ 3 ].value );
    });

});

