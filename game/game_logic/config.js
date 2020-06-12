/****************************************************************************
 * config.js
 *
 * Provides access to configuration data.  Things such as object sizes,
 * colours and positions can be defined here so they can be adjusted 
 * during development.
 ***************************************************************************/

( function ( babylonProject, undefined )
{

    babylonProject.config = 
    {
        snakeMoveInitialInterval : 1200,

        //directions the snake turn buttons should move the snake
        
        dirUp    : { x :  1, y :  0 },
        dirDown  : { x : -1, y :  0 },
        dirLeft  : { x :  0, y :  1 },
        dirRight : { x :  0, y : -1 },

        isValidDirection : function ( d )
        {
            if ( d == this.dirUp   || d == this.dirDown || 
                 d == this.dirLeft || d == this.dirRight )
            {
                return true;
            }
            else
            {
                return false;
            }
        },

        //position of the direction button planes
        
        upPos    : { x :    0, y : 1.25, z : 1 },
        downPos  : { x :    0, y : 0.75, z : 1 },
        rightPos : { x :  0.5, y :    1, z : 1 },
        leftPos  : { x : -0.5, y :    1, z : 1 },

        turnControlPlaneSize :  0.3
    };

} ( window.babylonProject = window.babylonProject || {} ));
