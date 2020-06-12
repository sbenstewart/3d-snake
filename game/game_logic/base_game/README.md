Base Game
=========

Core functionality that is common among many games is found in this
directory.

The entry point to the system:

    ./jQueryDomFunctions.js

When the page is loaded this function passes references to the HTML Canvas
and the Babylon library to:

    ./pageLoaded.js

This handles initialization and starts the game loop function by calling 
babylon.engine.runRenderLoop with the function defined in:

    ./gameLoop.js

The game loop function runs a finite state machine that expects the start
state to be defined as found in

    [project root]/game_logic/startState.js

Functionality specific to a game can use the start state as an entry
point and assume that its update method will be called during the game
loop when the game is loaded.
