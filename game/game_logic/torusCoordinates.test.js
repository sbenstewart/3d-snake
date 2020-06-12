const test_module = require ("./torusCoordinates");

/****************************************************************************
 * torusCoordinates.js
 *
 * Tests the mapping of list indexes to coordinates with a variety
 * of array sizes and shapes.
 ***************************************************************************/

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

//A collection of lists with different shapes
//The lists are all 1-dimensional lists but laying them out like this
//should help understand the expected results.

let listA = [ 0, 1, 2,
              3, 4, 5,
              6, 7, 8 ];

let listB = [ 0, 1,
              2, 3,
              4, 5,
              6, 7,
              8, 9 ];

let listC = [ 0, 1, 2 ];

let listD = [ 0,
              1,
              2 ];

let listE = [ 0,  1,  2,  3,  4, 
              5,  6,  7,  8,  9,
              10, 11, 12, 13, 14,
              15, 16, 17, 18, 19,
              20, 21, 22, 23, 24 ];

//This list of data represents the values the test function will
//call the listIdxToCoord function with and what results it should

let normalRangeData = [

    //first index
    { idx : 0, width : 3, list : listA, coord : { x:0, y:0 }},
    { idx : 0, width : 2, list : listB, coord : { x:0, y:0 }},
    { idx : 0, width : 3, list : listC, coord : { x:0, y:0 }},
    { idx : 0, width : 1, list : listD, coord : { x:0, y:0 }},

    //middle index
    { idx : 4, width : 3, list : listA, coord : { x:1, y:1 }},
    { idx : 4, width : 2, list : listB, coord : { x:0, y:2 }},
    { idx : 1, width : 3, list : listC, coord : { x:1, y:0 }},
    { idx : 1, width : 1, list : listD, coord : { x:0, y:1 }},

    //final index
    { idx : 8, width : 3, list : listA, coord : { x:2, y:2 }},
    { idx : 9, width : 2, list : listB, coord : { x:1, y:4 }},
    { idx : 2, width : 3, list : listC, coord : { x:2, y:0 }},
    { idx : 2, width : 1, list : listD, coord : { x:0, y:2 }},
];

//This list of data focuses on parameters where the index goes out of
//bounds of the array size and should wrap around.

let wrapRangeData = [

    { 
        list         : listE,
        width        : 5,
        startIdx     : 0,
        startCoord   : { x : 0, y : 0 },
        displacement : { x : 0, y : -1 },
        finishIdx    : 20,
        finishCoord  : { x : 0, y : 4 }
    },

    { 
        list         : listE,
        width        : 5,
        startIdx     : 0,
        startCoord   : { x : 0, y : 0 },
        displacement : { x : -1, y : 0 },
        finishIdx    : 4,
        finishCoord  : { x : 4, y : 0 }
    },

    { 
        list         : listE,
        width        : 5,
        startIdx     : 24,
        startCoord   : { x : 4, y : 4 },
        displacement : { x : 1, y : 0 },
        finishIdx    : 20,
        finishCoord  : { x : 0, y : 4 }
    },

    { 
        list         : listE,
        width        : 5,
        startIdx     : 24,
        startCoord   : { x : 4, y : 4 },
        displacement : { x : 0, y : 1 },
        finishIdx    : 4,
        finishCoord  : { x : 4, y : 0 }
    },

    { 
        list         : listE,
        width        : 5,
        startIdx     : 2,
        startCoord   : { x : 2, y : 0 },
        displacement : { x : 0, y : -3 },
        finishIdx    : 12,
        finishCoord  : { x : 2, y : 2 }
    },

    { 
        list         : listE,
        width        : 5,
        startIdx     : 22,
        startCoord   : { x : 2, y : 4 },
        displacement : { x : 0, y : 3 },
        finishIdx    : 12,
        finishCoord  : { x : 2, y : 2 }
    },

    { 
        list         : listE,
        width        : 5,
        startIdx     : 10,
        startCoord   : { x : 0, y : 2 },
        displacement : { x : -3, y : 0 },
        finishIdx    : 12,
        finishCoord  : { x : 2, y : 2 }
    },

    { 
        list         : listE,
        width        : 5,
        startIdx     : 14,
        startCoord   : { x : 4, y : 2 },
        displacement : { x : 3, y : 0 },
        finishIdx    : 12,
        finishCoord  : { x : 2, y : 2 }
    }
];

//This list of data provides test cases for the 'wrapCoordinate' function
let wrapCoordinateData = [
    { 
        coordIn  : { x :  0, y :  0 }, 
        coordOut : { x :  0, y :  0 },
        width    : 5,
        height   : 5
    },

    { 
        coordIn  : { x : -1, y :  0 }, 
        coordOut : { x :  4, y :  0 },
        width    : 5,
        height   : 5
    },

    { 
        coordIn  : { x :  0, y : -1 }, 
        coordOut : { x :  0, y :  3 },
        width    : 4,
        height   : 4
    },

    { 
        coordIn  : { x :  4, y :  0 }, 
        coordOut : { x :  0, y :  0 },
        width    : 4,
        height   : 4
    },

    { 
        coordIn  : { x :  0, y :  4 }, 
        coordOut : { x :  0, y :  0 },
        width    : 4,
        height   : 4
    },

    { 
        coordIn  : { x : -1, y : -1 }, 
        coordOut : { x :  3, y :  3 },
        width    : 4,
        height   : 4
    },

    { 
        coordIn  : { x :  4, y :  4 }, 
        coordOut : { x :  1, y :  1 },
        width    : 3,
        height   : 3
    },

];

/****************************************************************************
 * TESTS
 ***************************************************************************/

describe ( "window.babylonProject.listIdxToCoord", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.listIdxToCoord )
            .toBeDefined ();
    });


    test ( "test function with valid paramters from normalRangeData", () =>
    {
        normalRangeData.forEach ( function ( testData )
        {
            let idx = testData.idx;
            let width = testData.width;

            let ret = 
                window.babylonProject.listIdxToCoord ( 
                        idx, width, testData.list.length );

            expect ( ret.x ).toEqual ( testData.coord.x );
            expect ( ret.y ).toEqual ( testData.coord.y );
        });
    });

    test ( "test function with out of bounds data", () =>
    {
        expect ( () =>
                window.babylonProject.listIdxToCoord ( -1, 2, undefined ) )
            .toThrow ( "idx must be >= 0" );

        expect ( () =>
                window.babylonProject.listIdxToCoord ( 1, undefined ) )
            .toThrow ( "width must be >= 0" );

        expect ( () =>
                window.babylonProject.listIdxToCoord  ( 1, 4, 5 ) )
            .toThrow ( "width should divide length with no remainder." );

        expect ( () =>
                window.babylonProject.listIdxToCoord  ( 1, 4, undefined ) )
            .toThrow ( "width should divide length with no remainder." );

        expect ( () =>
                window.babylonProject.listIdxToCoord  ( 5, 2, 4 ) )
            .toThrow ( "idx out of bounds of the list" );

    });
});

describe ( "window.babylonProject.coordToListIdx", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.coordToListIdx )
            .toBeDefined ();
    });

    test ( "test function with valid paramters from normalRangeData", () =>
    {
        normalRangeData.forEach ( function ( testData )
        {
            let coord = testData.coord;
            let width = testData.width;

            let ret = 
                window.babylonProject.coordToListIdx ( 
                        coord, width, testData.list.length );

            expect ( ret ).toEqual ( testData.idx );

        });
    });

    test ( "has a 1 to 1 mapping with listIdxToCoord", () =>
    {
        normalRangeData.forEach ( function ( testData )
        {
            let coord = testData.coord;
            let width = testData.width;

            let ret = 
                window.babylonProject.coordToListIdx ( 
                        coord, width, testData.list.length );

            let retCoord = 
                window.babylonProject.listIdxToCoord ( 
                        ret, width, testData.list.length );

            expect ( retCoord ).toEqual ( coord );

        });
    });

    test ( "test function with out of bounds data", () =>
    {
        expect ( () =>
                window.babylonProject.coordToListIdx  ( undefined, 0, 1 ) )
            .toThrow ( "width must be > 0" );

        expect ( () =>
                window.babylonProject.coordToListIdx  ( undefined, 1, 0 ) )
            .toThrow ( "list length must be > 0" );

        expect ( () =>
                window.babylonProject.coordToListIdx  ( 0, 3, 7 ) )
            .toThrow ( "width should divide length with no remainder." );

    });

    test ( "test function with wrap range data", () =>
    {
        wrapRangeData.forEach ( function ( testData )
        {
            let coord = 
            {
                x : testData.startCoord.x + testData.displacement.x,
                y : testData.startCoord.y + testData.displacement.y
            }

            expect ( 
                babylonProject.coordToListIdx ( 
                    coord, testData.width, testData.list.length ))
                .toEqual ( testData.finishIdx );
        });
    });
});

describe ( "window.babylonProject.wrapCoordinate", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.wrapCoordinate )
            .toBeDefined ();
    });

    test ( "executs test data correctly", () =>
    {
        wrapCoordinateData.forEach ( function ( testData )
        {
            expect ( window.babylonProject.wrapCoordinate (
                testData.coordIn, testData.width, testData.height ) )
                .toEqual ( testData.coordOut );
        });
    });

});
