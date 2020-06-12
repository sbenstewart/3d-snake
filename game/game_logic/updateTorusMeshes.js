/****************************************************************************
 * updateTorusMeshes.js
 *
 * Defines a function that updates a list of meshes in order to represent
 * the current state of the snake body.
 *
 * The headIndex parameter specifies which mesh should represent the head
 * of the snake.  The position of the other body parts will be calculated
 * relevant to this.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    /**
     * babylonProject.updateTorusMeshes
     * 
     * Given a list of the meshes that appear at each vertex of the 
     * torus this function will toggle isVisible on each according
     * to the current position of the snake.
     */  
    babylonProject.updateTorusMeshes = 
        function ( snakeParts, applePos, torusMeshes, torusCoordToMeshIdx,
                   snakeMat, appleMat  )
    {

        if ( snakeParts == undefined )
        {
            throw ( "snakeParts parameter is undefined" );
        }
        
        if ( applePos == undefined )
        {
            throw ( "applePos parameter is undefined" );
        }
        
        if ( torusMeshes == undefined )
        {
            throw ( "torusMeshes parameter is undefined" );
        }
        
        if ( torusCoordToMeshIdx == undefined )
        {
            throw ( "torusCoordToMeshIdx parameter is undefined" );
        }

        if ( snakeMat == undefined )
        {
            throw ( "snakeMat parameter is undefined" );
        }

        if ( appleMat == undefined )
        {
            throw ( "appleMat parameter is undefined" );
        }

        //set all torusMeshes to be invisble
        torusMeshes.forEach ( 
        function ( torusMesh )
        {
            torusMesh.isVisible = false;
        });

        //set the snake torusMeshes to be visible
        snakeParts.forEach (
        function ( s )
        {
            let meshIdx = torusCoordToMeshIdx ( s );

            torusMeshes [ meshIdx ].isVisible = true;

            torusMeshes [ meshIdx ].material = snakeMat;

        });

        //set the apple mesh to be visible

        let appleIdx = torusCoordToMeshIdx ( applePos );

        torusMeshes [ appleIdx ].isVisible = true;

        torusMeshes [ appleIdx ].material = appleMat;

    }


} ( window.babylonProject = window.babylonProject || {} ));
