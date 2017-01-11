module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			development: {
				files: {
					"Source/js/global.js": ["Source/js/global/*.js"]
				}
			},
			production: {
				files: [{
					expand: true,
					cwd: "Build/js",
					src: "**/*.js",
					dest: "Build/js"
				}]
			}
		},
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
			development: {
				files: {
					"Source/css/global.css": ["Source/css/global/*.css"]
				}
			},
			production: {
				files: [{
					expand: true,
					cwd: "Build/css",
					src: "**/*.css",
					dest: "Build/css",
				}]
			}
		},
		imagemin: {
		    production: {
		        options: {
		      	    optimizationLevel: 3,
		      	    svgoPlugins: [{ removeViewBox: false }],
		        },
				files: [{
					expand: true,
			        cwd: "Build/img/",
			        src: ["**/*.{png,jpg,gif}"],
			        dest: "Build/img"
			    }]
			}
		},
		watch: {
			js: {
				files: ["Source/js/global/*.js"],
				tasks: ["uglify:development"],
			},
			css: {
				files: ["Source/css/global/*.css"],
				tasks: ["cssmin:development"],
			}
		},
		copy: {
			production: {
				expand: true,
				cwd: "Source",
				src: ["**/*"],
				dest: "Build/"
			},
			publish: {
				mode: "0644",
				expand: true,
				cwd: "Build",
				src:["index.html"],
				dest: "../help"
			}
		},
		clean: {
			options: {
				force: true
			},
			production: {
				src: ["Build/Gruntfile.js",
						"Build/package.json",
						"Build/.git",
						"Build/.DS_Store",
						"Build/node_modules",
						"Build/css/global",
						"Build/js/global"]
			},
			preproduction: {
				src: ["Build/"]
			}
		},
		htmlmin: {
			production: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				expand: true,
				cwd: "Source/Views",
		    	src: ["**/*.php","**/*.html"],
		    	dest: "Build/Views"
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-gitrevision');

	grunt.registerTask("default",
			["uglify:development",
			"cssmin:development",
			"watch"]);

	grunt.registerTask("build",
			["clean:preproduction",
			"copy:production",
			"gitrevision:production",
			"clean:production",
			"uglify:production",
			"cssmin:production",
			"htmlmin:production",
			"imagemin:production"]);

	grunt.registerTask("publish",
			["copy:publish"]);
}
