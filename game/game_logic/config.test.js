const test_module = require ("./config");

/****************************************************************************
 * config.test.js
 *
 * Provides tests for the configuration data.  It should not specify the
 * exact values for the data but can provide some sanity checks.
 ***************************************************************************/

/****************************************************************************
 * EXPECTED TEST VALUES
 ***************************************************************************/

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

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

describe ( "window.babylonProject.config", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.config )
            .toBeDefined ();
    });

    test ( "defines upPos", () =>
    {
        expect ( window.babylonProject.config.upPos )
            .toBeDefined ();

        expect ( window.babylonProject.config.upPos.x )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.upPos.x ) )
            .not.toBeNaN ();

        expect ( window.babylonProject.config.upPos.y )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.upPos.y ) )
            .not.toBeNaN ();

        expect ( window.babylonProject.config.upPos.z )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.upPos.z ) )
            .not.toBeNaN ();

    });

    test ( "defines downPos", () =>
    {
        expect ( window.babylonProject.config.downPos )
            .toBeDefined ();

        expect ( window.babylonProject.config.downPos.x )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.downPos.x ) )
            .not.toBeNaN ();

        expect ( window.babylonProject.config.downPos.y )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.downPos.y ) )
            .not.toBeNaN ();

        expect ( window.babylonProject.config.downPos.z )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.downPos.z ) )
            .not.toBeNaN ();

    });

    test ( "defines rightPos", () =>
    {
        expect ( window.babylonProject.config.rightPos )
            .toBeDefined ();

        expect ( window.babylonProject.config.rightPos.x )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.rightPos.x ) )
            .not.toBeNaN ();

        expect ( window.babylonProject.config.rightPos.y )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.rightPos.y ) )
            .not.toBeNaN ();

        expect ( window.babylonProject.config.rightPos.z )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.rightPos.z ) )
            .not.toBeNaN ();

    });

    test ( "defines leftPos", () =>
    {
        expect ( window.babylonProject.config.leftPos )
            .toBeDefined ();

        expect ( window.babylonProject.config.leftPos.x )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.leftPos.x ) )
            .not.toBeNaN ();

        expect ( window.babylonProject.config.leftPos.y )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.leftPos.y ) )
            .not.toBeNaN ();

        expect ( window.babylonProject.config.leftPos.z )
            .toBeDefined ();

        expect ( parseFloat ( window.babylonProject.config.leftPos.z ) )
            .not.toBeNaN ();

    });

    test ( "defines turnControlPlaneSize", () =>
    {
        expect ( parseFloat ( 
            window.babylonProject.config.turnControlPlaneSize ) )
            .not.toBeNaN ();
    });

    test ( "defines snakeMoveInitialInterval", () =>
    {
        expect ( window.babylonProject.config.snakeMoveInitialInterval )
            .toBeDefined ();

        expect ( window.babylonProject.config.snakeMoveInitialInterval )
            .not.toBeNaN ();
    });

    test ( "defines movement directions", () =>
    {
        expect ( window.babylonProject.config.dirUp )
            .toBeDefined ();

        expect ( window.babylonProject.config.dirDown )
            .toBeDefined ();

        expect ( window.babylonProject.config.dirLeft )
            .toBeDefined ();

        expect ( window.babylonProject.config.dirRight )
            .toBeDefined ();

    });

    test ( "defines isValidDirection function", () =>
    {
        expect ( window.babylonProject.config.isValidDirection )
            .toBeDefined ();

        let badDir = { x : 0, y : 1 };

        expect ( window.babylonProject.config.isValidDirection ( badDir ) )
            .toBe ( false );

        expect ( window.babylonProject.config.isValidDirection ( 
                window.babylonProject.config.dirUp ) )
            .toBe ( true );

        expect ( window.babylonProject.config.isValidDirection ( 
                window.babylonProject.config.dirDown ) )
            .toBe ( true );

        expect ( window.babylonProject.config.isValidDirection ( 
                window.babylonProject.config.dirLeft ) )
            .toBe ( true );

        expect ( window.babylonProject.config.isValidDirection ( 
                window.babylonProject.config.dirRight ) )
            .toBe ( true );

    });

});
