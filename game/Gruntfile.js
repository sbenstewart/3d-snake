module.exports = function ( grunt ) {

    grunt.loadNpmTasks ( 'grunt-run' );
    grunt.loadNpmTasks ( 'grunt-contrib-concat' );

    //Note: uglification can be added later as a separate 'build' command.
    //      The build command would remove tests before minifying code.
    //grunt.loadNpmTasks ( 'grunt-contrib-uglify' );

    grunt.initConfig ({

        run: 
        {
            options: 
            {
            },
            npm_test_jest:
            {
                cmd : 'npm',
                args : [ 'test', '--', '--bail', './game_logic/' ]
            }
        },

        concat : 
        {
            game_logic :
            {
                src : ['game_logic/**/*.js', '!game_logic/**/*.test.js'],
                dest: 'game_logic.min.js'
            }
        }
                 
    });

    grunt.registerTask( 'default', ['run:npm_test_jest','concat']);
};
