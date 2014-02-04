---
layout: post
title: Introduction into Grunt
categories: grunt
date: 2014-02-02 17:17:17
image: grunt.png
---

Getting started with Grunt
---------------

### grunt.initConfig
The initConfig is primary way of communicating to grunt what tasks need to be run under what conditions.  This is not the only way of specifying grunt tasks, its the primary way.
To get started, lets create a config that will jshint files every time a file is edited.

{% highlight javascript %}
// Gruntfile.js
// Remember, grunt runs off of a file called Gruntfile.js.
// It is commonly located at within the same directory that package.json is located (the root usually).
module.exports = function(grunt) {
    // Grunt provides a set of tasks that are extremely handy.  They are npm installable and easily included.
    grunt.loadNpmTask('grunt-contrib-watch');
    grunt.loadNpmTask('grunt-contrib-requirejs');

    // The initial config defines configurations for each task to be ran.
    grunt.initConfig({
        requirejs: {
            // .. configuration ..
        },
        watch: {
            // .. configuration ..
        }
    });
}
{% endhighlight %}
---

requirejs and watch are just two of hundreds of premade tasks.  The exact configuration i'll provide later on.  As a part
of writing this tutorial i am going to make a "grunt-out-of-the-box" project that will provide a basic grunt framework.
On customizing grunt tasks, here is an example of just running your very own node code!

{% highlight javascript %}
// Gruntfile.js
module.exports = function(grunt) {
    // .. configurations ..

    // if 'grunt' is executed from command line, the 'default' task is ran.
    grunt.registerTask('default', ['requirejs', 'watch']);

    // If you want just part of a task to run (any multiTask allow for this feature)
    // 'grunt devOnly' will execute this
    grunt.registerTask('devOnly', ['requirejs:dev', 'watch:dev']);

    // More of this will be covered in detail in next tutorial.
}
{% endhighlight %}
---

[JS/Pipe](http://jspipe.org/)
