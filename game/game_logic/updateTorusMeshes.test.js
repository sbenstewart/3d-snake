const test_module = require ("./updateTorusMeshes");

/****************************************************************************
 * updateTorusMeshes.test.js
 ***************************************************************************/

/****************************************************************************
 * EXPECTED TEST VALUES
 ***************************************************************************/

/****************************************************************************
 * MOCK DATA
 ***************************************************************************/

let mockList = function ( length )
{
    let list = []

    for ( let i = 0; i < length; i++ )
    {
        list.push ( jest.fn () );
    }
     return list;
}

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

describe ( "window.babylonProject.updateTorusMeshes", () =>
{

    test ( "is defined", () =>
    {
        expect ( window.babylonProject.updateTorusMeshes )
            .toBeDefined ();
    });

    test ( "validates parameters", () =>
    {
        let snakeParts = mockList ( 5 );
        let applePos = jest.fn ();
        let torusMeshes = mockList ( 10 );
        let torusCoordToMeshIdx = jest.fn ();
        let snakeMat = jest.fn ();
        let appleMat = jest.fn ();

        expect ( () => 
            window.babylonProject.updateTorusMeshes () )
            .toThrow ( "snakeParts parameter is undefined" );

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( snakeParts ))
            .toThrow ( "applePos parameter is undefined" );

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( 
                snakeParts, applePos ))
            .toThrow ( "torusMeshes parameter is undefined" );

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( 
                snakeParts, applePos, torusMeshes ))
            .toThrow ( "torusCoordToMeshIdx parameter is undefined" );

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( 
                snakeParts, applePos, torusMeshes, torusCoordToMeshIdx  ))
            .toThrow ( "snakeMat parameter is undefined" );

        expect ( () => 
            window.babylonProject.updateTorusMeshes ( 
                snakeParts, applePos, torusMeshes, torusCoordToMeshIdx,
                snakeMat  ))
            .toThrow ( "appleMat parameter is undefined" );


    });

    test ( "The torusCoordToMeshIdx function is called once for each "+
           "member of snakeParts and the corresponding torusMesh isVisible "+
           "property is set to false.", () =>
    {
        let snakeParts = mockList ( 5 );
        let applePos = jest.fn ();
        let torusMeshes = mockList ( 15 );
        let torusCoordToMeshIdx = jest.fn ();
        let snakeMat = jest.fn ();
        let appleMat = jest.fn ();


        //have torusCoordToMeshIdx return a different index for each
        //snakePart

        snakeParts.forEach ( function ( val, idx )
        {
            torusCoordToMeshIdx.mockReturnValueOnce ( idx );
        });

        //add a return value for the apple pos
        
        let appleIdx = 8;

        torusCoordToMeshIdx.mockReturnValueOnce ( appleIdx );

        babylonProject.updateTorusMeshes ( 
                snakeParts, applePos, torusMeshes, torusCoordToMeshIdx,
                snakeMat, appleMat ); 

        //expect the coordinate conversion function to have been called
        //once for each snakePart and once for the apple

        expect ( torusCoordToMeshIdx )
            .toHaveBeenCalledTimes ( snakeParts.length + 1);

        torusCoordToMeshIdx.mock.calls.forEach ( function ( call, idx )
        {
            if ( idx < snakeParts.length )
            {
                expect ( call [ 0 ] )
                    .toBe ( snakeParts [ idx ] );
            }
            else
            {
                expect ( call [ 0 ] )
                    .toBe ( applePos );
            }
        });

        torusMeshes.forEach ( function ( torusMesh, idx )
        {
            //some boolean logic to check if the meshIdx matches a snakePart
            //or appleIdx and should therefore be visible.

            let snakePart = ( idx < snakeParts.length ); 
            let applePos  = ( idx == appleIdx );

            let expectVisible = ( snakePart || applePos );

            expect ( torusMesh.isVisible )
                .toEqual ( expectVisible );

            if ( snakePart )
            {
                expect ( torusMesh.material )
                    .toBe ( snakeMat ); 
            }
            else if ( applePos )
            {
                expect ( torusMesh.material )
                    .toBe ( appleMat ); 
            }
            else
            {
                expect ( torusMesh.isVisible )
                    .toEqual ( false ); 

                expect ( torusMesh.material )
                    .toBeUndefined (); 

            }

        });

    });

});

