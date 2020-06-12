const renderLoop = require ( "./gameLoop" );

/****************************************************************************
 * TESTS
 ***************************************************************************/

describe ( "window.babylonProject.gameLoop", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.gameLoop ).toBeDefined ();
    });

    test ( "stores return of current state as next update", () =>
    {
        testFunc = jest.fn ();
    
        window.babylonProject.nextUpdate = testFunc;

        testNewState = jest.fn ();

        testFunc.mockReturnValueOnce ( testNewState );
    
        window.babylonProject.gameLoop ();

        expect ( window.babylonProject.nextUpdate ).toBe ( testNewState );
    });


});

test ( "window.babylonProject.nextUpdate is defined", () =>
{
    expect ( window.babylonProject.nextUpdate ).toBeDefined ();
});
