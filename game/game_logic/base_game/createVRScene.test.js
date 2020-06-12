const createVRScene = require ("./createVRScene");

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

let MockVRHelper = jest.fn ();

let MockBabylon = jest.fn ( function ()
{
    this.Scene = jest.fn ( function ()
    {
        this.createDefaultEnvironment = jest.fn ();
        this.createDefaultVRExperience = jest.fn ( function () 
        {
            return new MockVRHelper ();
        });
    });
});

let MockEngine = jest.fn ();


/****************************************************************************
 * TESTS
 ***************************************************************************/

describe ( "window.babylonProject.createVRScene", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.createVRScene ).toBeDefined ();
    });

    test ( "returns a tuple containing an instance of BABYLON.Scene "+
           "and the returned value of scene.createDefaultExperience", () =>
    {
        mockBabylon = new MockBabylon ();
        mockEngine = new MockEngine ();

        returnValue = window.babylonProject.createVRScene (
                mockBabylon,
                mockEngine    );

        expect ( returnValue.scene ).toBeInstanceOf ( mockBabylon.Scene );

        expect ( returnValue.vrHelper )
            .toBe ( returnValue.scene.createDefaultVRExperience.mock
                        .results [ 0 ].value );
    });

    test ( "passed engine to Scene constructor", () =>
    {
        mockBabylon = new MockBabylon ();
        mockEngine = new MockEngine ();

        window.babylonProject.createVRScene (
                mockBabylon,
                mockEngine    );

        expect ( mockBabylon.Scene )
            .toBeCalledWith ( mockEngine );
    });


    test ( "calls scene.createDefaultEnvironment", () =>
    {
        mockBabylon = new MockBabylon ();
        mockEngine = new MockEngine ();

        let retVal = window.babylonProject.createVRScene (
                mockBabylon,
                mockEngine    );

        expect ( retVal.scene.createDefaultEnvironment )
            .toBeCalledTimes ( 1 );
    });
  
    test ( "calls scene.createDefaultVRExperience", () =>
    {
        mockBabylon = new MockBabylon ();
        mockEngine = new MockEngine ();

        let retVal =  window.babylonProject.createVRScene (
                mockBabylon,
                mockEngine    );

        expect ( retVal.scene.createDefaultVRExperience )
            .toBeCalledTimes ( 1 );
    });
    

})
