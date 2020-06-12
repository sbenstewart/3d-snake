/****************************************************************************
 * snake.js
 *
 * Defines functions used to manipulate the snake data structure.
 *
 * Snakes are defined as a list of coordinate positions.
 *
 * The coorindates are offsets from the head of the snake so:
 *   - Snake head is always   :  { x : 0, y : 0 }
 *   - Adjacent part would be :  { x : 1, y : 0 }
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    //empty object is used to contain other snake functions in a namespace
    babylonProject.snake = {};

    /**
     * babylonProject.snake.turnAllowed ( newDir, currentDir )
     *
     * Returns true if the snake is allowed to turn towards newDir
     * from currentDir.
     *
     * Only perpindicular movement is allowed.
     */
    babylonProject.snake.turnAllowed = function ( newDir, currentDir )
    {
        let config = window.babylonProject.config;

        if ( !config.isValidDirection ( newDir ) )
        {
            throw ( "newDir is not valid direction" );
        }

        if ( !config.isValidDirection ( currentDir ) )
        {
            throw ( "currentDir is not valid direction" );
        }

        let u = config.dirUp;
        let d = config.dirDown;
        let l = config.dirLeft;
        let r = config.dirRight;

        //check perpindicular for up or down
        let vertical =
            ( newDir == u     || newDir == d ) && 
            ( currentDir == l || currentDir == r );
        
        //check perpindicular for left or right
        let horizontal =
            ( newDir == r     || newDir == l ) && 
            ( currentDir == u || currentDir == d );

        return ( vertical || horizontal );
        
    };

    babylonProject.snake.moveSnake = function ( dir, snakeParts, wrapFunc )
    {
        if ( !babylonProject.config.isValidDirection ( dir ) )
        {
            throw ( "dir is not valid direction" );
        }
        
        let newSnake = snakeParts.map ( function ( val, idx, arr )
        {
            let retVal = { x : 0, y : 0 };

            if ( idx != 0 )
            {
                retVal.x = snakeParts [ idx - 1 ].x + dir.x;
                retVal.y = snakeParts [ idx - 1 ].y + dir.y;

                retVal = wrapFunc ( retVal );
            }

            return retVal;
        });

        return newSnake;
    }

    /**
     * bylonProject.snake.turnSnake ( newDir, currentDir )
     *
     * Checks if the snake is allowed to turn towards newDir from
     * the currentDir.  I.e. the directions are perpendicular.
     *
     * If the turn is allowed then newDir will be returned.
     *
     * Otherwise currentDir will be returned.
     */
    babylonProject.snake.turnSnake = function ( newDir, currentDir )
    {
        if ( babylonProject.snake.turnAllowed ( newDir, currentDir ) )
        {
            return newDir;
        } 
        else
        {
            return currentDir;
        }   
    };

    /**
     * Adds a new head to the snake and then moves it in the desired 
     * direction.
     *
     * Note that when the snake eats an apple this function should be 
     * called after the normal move delay instead of using the normal
     * move function.
     *
     * moveSnake is called as part of this function so that the snake 
     * doesn't end up with multiple sections occupying the same position.
     */
    babylonProject.snake.growSnake = function ( dir, snakeParts, wrapFunc )
    {
        let newSnakeParts = [ { x : 0, y : 0 } ].concat ( snakeParts );

        return babylonProject.snake.moveSnake 
            ( dir, newSnakeParts, wrapFunc );
    }; 

    /**
     * babylonProject.snake.createSnake ( dir, length )
     *
     * Creates a snake with the number of parts specified by the length
     * parameter.
     *
     * The snake is created using the growSnake function.
     *
     * The length is NOT checked against the size of the grid so attempts
     * to create a snake longer than the grid can hold will result in
     * terrible things.
     *
     * The head will be { x:0, y:0 } and other items will be offset
     * according to dir
     */
    babylonProject.snake.createSnake = function ( dir, length )
    {
        if ( length <= 0 )
        {
            throw ( "length must be > 0" ); 
        }

        let snakeParts = [];

        //move snake expects a function to use to wrap the coordinates
        //this dummy function will return the same input
        let wrapFunc = ( snakeParts ) => { return snakeParts; }

        for ( let i = 0; i < length; i++ )
        {
            snakeParts = babylonProject.snake.growSnake (
                    dir, snakeParts, wrapFunc );
        }

        return snakeParts;
    };

} ( window.babylonProject = window.babylonProject || {} ));
