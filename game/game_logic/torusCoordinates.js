/****************************************************************************
 * torusCoordinates.js
 *
 * Provides a function that maps a set of 1 dimensional list indicies
 * to a two dimensional { x , y } coordinate tuple.
 *
 * The tests for the module have some examples of the functions with
 * various shapes of array
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    //This function allows negative numbers to be wrapped into positive
    //number.  Javascript's modulo returns a negative result for negative
    //values, which is not what is wanted to wrap coordinates.
    let wrap = ( x, n ) => ( x % n + n ) % n;

    babylonProject.listIdxToCoord = function ( idx, width, length )
    {
        if ( idx < 0 || idx == undefined )
        {
            throw ( "idx must be >= 0" );
        }

        if ( idx > length - 1)
        {
            throw ( "idx out of bounds of the list" );
        }

        if ( width < 1 || width == undefined )
        {
            throw ( "width must be >= 0" );
        }

        if ( length % width != 0 )
        {
            throw ( "width should divide length with no remainder." );
        }

        let coord = 
        { 
            x : idx % width,
            y : Math.floor ( idx/width )
        }

        return coord;
    }
    
    /**
     * coordToListIdx
     *
     * Maps a 2 dimensional coordinate to an index of a one dimensional
     * list.
     *
     * Coordinates outside the range of the 2D space will be wrapped
     * as though the space is a torus.
     *
     * Params:
     *  - coord  : The two dimensional { x, y } coordinate tuple
     *  - width  : The width of the 2D space
     *  - length : The number of elements in a 1D list containing all the 
     *             coordinates
     */
    babylonProject.coordToListIdx = function ( coord, width, length )
    {
        if ( width < 1 || width == undefined )
        {
            throw ( "width must be > 0" );
        }

        if ( length < 1 )
        {
            throw ( "list length must be > 0" );
        }

        if ( length % width != 0 )
        {
            throw ( "width should divide length with no remainder." );
        }

        let height = length / width;

        return width * wrap ( coord.y, height ) + wrap ( coord.x, width );
    };

    /**
     * wrapCoordinate
     *
     * Wraps the x and y of the coordinate parameter to  fit within
     * a torus shaped grid with the width and length provided.
     */
    babylonProject.wrapCoordinate = function ( coord, width, height )
    {
       let wrappedCoord = 
       {
           x : wrap ( coord.x, width ),
           y : wrap ( coord.y, height )
       };

       return wrappedCoord;
    }

} ( window.babylonProject = window.babylonProject || {} ));
