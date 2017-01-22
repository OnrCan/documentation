module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		uglify: {
			development: {
				files: {
					"Source/documentation/js/global.js": ["Source/documentation/js/global/*.js"]
				}
			},
			production: {
				files: [{
					expand: true,
					cwd: "Build/documentation/js",
					src: "**/*.js",
					dest: "Build/documentation/js"
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
					"Source/documentation/css/global.css": ["Source/documentation/css/global/*.css"]
				}
			},
			production: {
				files: [{
					expand: true,
					cwd: "Build/documentation/css",
					src: "**/*.css",
					dest: "Build/documentation/css",
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
			        cwd: "Build/documentation/img/",
			        src: ["**/*.{png,jpg,gif}"],
			        dest: "Build/documentation/img"
			    }]
			}
		},
		watch: {
			js: {
				files: ["Source/documentation/js/global/*.js"],
				tasks: ["uglify:development"],
			},
			css: {
				files: ["Source/documentation/css/global/*.css"],
				tasks: ["cssmin:development"],
			}
		},
		copy: {
			production: {
				expand: true,
				cwd: "Source/documentation",
				src: ["**/*"],
				dest: "Build/documentation"
			},
			publish: {
				mode: "0644",
				expand: true,
				cwd: "Build/documentation",
				src:["**/*"],
				dest: "../../documentation"
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
						"Build/documentation/css/global",
						"Build/documentation/js/global"]
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
				cwd: "Source/documentation",
		    	src: ["**/*.html"],
		    	dest: "Build/documentation"
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

	grunt.registerTask("default",
			["uglify:development",
			"cssmin:development",
			"watch"]);

	grunt.registerTask("build",
			["clean:preproduction",
			"copy:production",
			"clean:production",
			"uglify:production",
			"cssmin:production",
			"htmlmin:production",
			"imagemin:production"]);

	grunt.registerTask("publish",
			["copy:publish"]);
}
