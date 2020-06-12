module.exports = function ( grunt ) {

    grunt.loadNpmTasks ( 'grunt-run' );
    grunt.loadNpmTasks ( 'grunt-contrib-concat' );

    //Note: uglification can be added later as a separate 'build' command.
    //      The build command would remove tests before minifying code.
    //grunt.loadNpmTasks ( 'grunt-contrib-uglify' );

    grunt.initConfig ({


        concat : 
        {
            game_logic :
            {
                src : ['game_logic/**/*.js', '!game_logic/**/*.test.js'],
                dest: 'game_logic.min.js'
            }
        }
                 
    });

    grunt.registerTask( 'default', ['concat']);
};
