const test_module = require ("./gui");

/****************************************************************************
 * gui.test.js
 ***************************************************************************/

/****************************************************************************
 * EXPECTED TEST VALUES
 ***************************************************************************/

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

let MockBabylon = jest.fn ( function ()
{
    this.GUI = 
    {
        Button : 
        {
            CreateSimpleButton : jest.fn ( function ()
            {
                return new MockButton ();
            })
        },
        AdvancedDynamicTexture :
        {
            CreateForMesh : jest.fn ( function ()
            {
                return new MockAdvancedDynamicTexture ();
            })
        }
    };

    this.MeshBuilder =
    {
        CreatePlane : jest.fn ( function () 
        {
            return new MockMesh ();
        })
    };

});

let MockMesh = jest.fn ();

let MockButton = jest.fn ( function ()
{
    this.onPointerUpObservable = 
    {
        add : jest.fn ()
    };

});

let MockAdvancedDynamicTexture = jest.fn ( function ()
{
    this.addControl = jest.fn ();
});

let defaultButtonOptions = function ()
{
    retVal = 
    {
        Text : "Click Here",
        buttonCall : jest.fn (),
    }

    return retVal;
};

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

describe ( "window.babylonProject.createButtonPlane", () =>
{
    test ( "is defined", () =>
    {
        expect ( window.babylonProject.createButtonPlane )
            .toBeDefined ();
    });

    test ( "validates args", () =>
    {
        let mock_babylon = new MockBabylon ();
        
        expect ( () => window.babylonProject.createButtonPlane () )
            .toThrow ( "name parameter is undefined" );

        expect ( () => window.babylonProject.createButtonPlane (
                    "name" ) )
            .toThrow ( "planeOptions parameter is undefined" );

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                "name", jest.fn () ) )
            .toThrow ( "buttonOptions parameter is undefined" );

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                "name", jest.fn (), jest.fn () ) )
            .toThrow ( "scene parameter is undefined" );

        expect ( () => 
            window.babylonProject.createButtonPlane ( 
                "name", jest.fn (), jest.fn (), jest.fn () ) )
            .toThrow ( "babylon parameter is undefined" );

    });

    test ( "creates and returns button", () =>
    {
        let mock_babylon = new MockBabylon ();

        let planeOptions = jest.fn ();

        let buttonOptions = defaultButtonOptions ();

        let scene = jest.fn ();

        let retVal = 
            window.babylonProject.createButtonPlane ( 
                "name", planeOptions, buttonOptions, scene, mock_babylon );

        expect ( retVal )
            .toBeDefined ();

        //check button plane was created and returned

        expect ( mock_babylon.MeshBuilder.CreatePlane )
            .toHaveBeenCalledTimes ( 1 );

        expect ( mock_babylon.MeshBuilder.CreatePlane )
            .toHaveBeenCalledWith ( "nameButtonPlane", planeOptions, scene );

        expect ( retVal.buttonPlane )
            .toBeDefined ();

        expect ( retVal.buttonPlane )
            .toBe ( mock_babylon.MeshBuilder.CreatePlane
                .mock.results [ 0 ].value ); 

        //check advanced texture was created and returned

        expect ( mock_babylon.GUI.AdvancedDynamicTexture.CreateForMesh )
            .toHaveBeenCalledTimes ( 1 );

        expect ( mock_babylon.GUI.AdvancedDynamicTexture.CreateForMesh )
            .toHaveBeenCalledWith ( retVal.buttonPlane );

        expect ( retVal.buttonTexture )
            .toBeDefined ();

        expect ( retVal.buttonTexture )
            .toBe ( mock_babylon.GUI.AdvancedDynamicTexture.CreateForMesh
                .mock.results [ 0 ].value ); 

        //check button was created and returned

        expect ( mock_babylon.GUI.Button.CreateSimpleButton )
            .toHaveBeenCalledTimes ( 1 );

        expect ( mock_babylon.GUI.Button.CreateSimpleButton )
            .toHaveBeenCalledWith ( 
                    "nameButton", buttonOptions.buttonText );

        expect ( retVal.button )
            .toBeDefined ();

        expect ( retVal.button )
            .toBe ( mock_babylon.GUI.Button.CreateSimpleButton
                .mock.results [ 0 ].value ); 

        //check button was added to texture as control

        expect ( retVal.buttonTexture.addControl )
            .toHaveBeenCalledTimes ( 1 );

        expect ( retVal.buttonTexture.addControl )
            .toHaveBeenCalledWith ( retVal.button );

        //check buttonCall is set to the function from buttonOptions

        expect ( buttonOptions.buttonCall )
            .toHaveBeenCalledTimes ( 0 );

        expect ( retVal.button.onPointerUpObservable.add )
            .toHaveBeenCalledTimes ( 1 );

        expect ( retVal.button.onPointerUpObservable.add )
            .toHaveBeenCalledWith ( buttonOptions.buttonCall );

    });

});
