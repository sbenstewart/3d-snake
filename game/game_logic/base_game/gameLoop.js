/****************************************************************************
 * gameLoop.js
 *
 * This is the main game loop that is used to update objects and render
 * the scene.
 *
 * A finite state machine is used to switch between logical scenarios
 * such as the main menu or gameplay.
 *
 * The states are defined as functions that are to be executed each tick.
 *
 * The next function to be called to update the game's state is
 * stored as a function pointer in:
 *     
 *     babylonProject.nextUpdate;
 *
 * The game loop will call nextUpdate () and save its return as nextUpdate().
 *
 * The state functions are expected to wrap their data and execution in
 * an 'arrow operator' function pointer with any data they need and
 * return it so that calling nextUpdate () again will advance the state.
 *
 * The './pageLoaded.js' page loaded function sets the initial state to
 * 'babylonProject.StartState'.  This state can be found in the root
 * of the 'game_logic' directory and is a starting point for any game
 * using the base game as its template.
 ***************************************************************************/

( function ( babylonProject, undefined )
{
    /**
     * babylonProject.nextUpdate
     *
     * This is expected to be a function pointer that can be called with
     * no paramters in order to advance the execution of the game by one
     * tick.
     *
     * The function should return a function pointer that can be called
     * with no paramters to execute the next tick.
     */
    babylonProject.nextUpdate = () => {};

    /**
     * babylonProject.gameLoop
     *
     * Calls babylonProject.nextUpdate () and saves its return in
     * babylonProject.nextUpdate.
     *
     * This should advance the game by one logic tick and save a function
     * pointer that can be called to execute the next tick.
     */
    babylonProject.gameLoop = function ()
    {
        //update state and store return value as next update
        babylonProject.nextUpdate = babylonProject.nextUpdate (); 
    }

} ( window.babylonProject = window.babylonProject || {} ));
