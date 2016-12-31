---
layout: post
title: Bullet Dodger - Intro
category: game-programming
permalink: /game-programming/bullet-dodger-1
---

### Bullet Dodger
 The first game I thought I would make would be a bullet dodger. The concept
 will not be much different than most bullet dodgers, except it will be a FPS
 style one.

 Here is my scope, and hopefully I will not creep :)

 * Game Play
  * FPS style bullet dodger
  * Basic level with small structures to hide behind
  * Infinite level with progressively harder levels

 * Enemies
  * Random-ish flight patterns of enemies
  * No Modeling, just basic shapes offered by Unity.
  * A couple of different types of enemies, denoted by the type of gun they use

* HUD
 * Score
 * radar
 * health

* Effects
 * Screen Effects on being shot
 * Particle Effects on bullets

I want to build so many more features, but I am intentionally limiting it to
what I believe I can accomplis in a small amount of time.

### The project
It is open source and can be found here: [Bullet Dodger](https://github.com/michaelbpaulson/bullet-dodger)

### Links
Here are a few links that really helped me create this game.  Most of this is very simple.

* [Input Controls](/game-programming-tips/xbox-controller-setup)
* [Enemy Movement](https://www.youtube.com/watch?v=oLqWkR28ORM)
 * It does exactly what I thought it would do.  Use a Mathf.Sin function to control flight.
   I am going to extend that and use spawn/random points, user location, and that movement to make the
   enemies flight appear a bit more random.
* [FPS Controls](https://www.youtube.com/watch?v=blO039OzUZc)
* [Space Shooter](https://unity3d.com/learn/tutorials/projects/space-shooter-tutorial)
 * This tutorial really helped.  Gave me the great idea of a shotSpawn.
* [Icons For Empty Game Objects](https://unity3d.com/learn/tutorials/topics/tips/use-custom-icons-empty-game-objects-scene-views)

