---
layout: post
title: Grunt in a box
categories: grunt
date: 2014-02-06 9:33:39
image: grunt.png
---
Notes
=====
At the time of writing this post, grunt-in-a-box (giab) was at version 0.0.2

Grunt in a box
==============
Grunt in a box is the next project that i am going to work on for the foreseeable future.  It involves writing a grunt plugin that
will provide a full grunt environment.  It will dictate how projects should be set up (`src/`, `test/`).  It will attempt to bring
the best practices of javascript from the beginning of a project.

The idea
========
The basic idea of `grunt-in-a-box` is every Gruntfile seems to contain a similar set of features.  JSHint, module loading, transpiling, etc.
This library will load all these features, out of the box, with as little pain as possible.  The idea came from the 100th time that
i set up watch, requirejs, jshint, etc.

What your gruntfile could look like
===================================
{% highlight javascript %}
// Gruntfile.js from the actual project
module.exports = function(grunt) {
    require('grunt-in-a-box')(grunt);
}
{% endhighlight %}
------------------------------------

The project allows for custom configurations and only supports `jshint` and the time of this article.  Plenty more to come!  Next
post will go over the internals of giab and how i approached solving this problem.  The code is going to be a state of flux until
we start hitting version 0.1.x or 0.2.x
