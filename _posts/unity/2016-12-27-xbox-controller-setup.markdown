---
layout: post-with-demo
title: XBox One Controller Setup
category: game-programming-tips
permalink: /game-programming-tips/xbox-controller-setup
demoFolder: /assets/unity/bullet-dodger/demo/xbox-controller
demoName: XBoxController
demoWidth: 320
demoHeight: 180
demoTile: XBox Controller
---

### XBox Controller Setup.
This is a quick tutorial and demo of setting up XBox One Controllers for
Unity. I personally use an elite controller because they are so awesome :).

#### Useful Links
All the things I have built I have used the following links. With all of
this it becomes easier to make the quick demo of working XBone Controller
demo.

* [Mac OSX Driver](https://github.com/360Controller/360Controller/releases)
* [Triggers and Joysticks](http://answers.unity3d.com/questions/1119529/c-get-xbox-one-controller-analog-sticks-triggers-a.html)
* [Trigger Start Values](http://answers.unity3d.com/questions/440690/xbox-360-controller-on-mac-trigger-returns-0-at-st.html)
 * Both left and right triggers were returning 0 for me, so I normalize both if on Mac OSX
* [Transparency](https://docs.unity3d.com/Manual/StandardShaderMaterialParameterAlbedoColor.html)
* [Platform Dependent Compilation](https://docs.unity3d.com/Manual/PlatformDependentCompilation.html)

### XBox Controller
The things I am currently programming are single player systems which means
there is only ever one xbox controller. Therefore I am simply creating a
single Empty GameObject with the attached component XBoxController. This
Component will, on every FixedUpdate, update its public values. What this
means is that anyone can find the controller and use the values with the
following line.

{% highlight csharp %}
void Start() {
    XBoxController controller = GameObject.
        FindWithTag("XBoxController").
        GetComponent<XBoxController>();
}
{% endhighlight %}

Now I can check, on my Update, FixedUpdate, LateUpdate, whatever update, the
values of the xbox controller and react accordingly.

### Getting Started
#### Input Manager
First, the Input Manager controls all virtual axes, buttons, and joysticks.
These can be referenced via a string, such as `Vertical` or `Horizontal`.
This makes programming controls a bit easier since `Vertical` could be
fulfilled by more than one type of device.

So lets setup the Input Manager. First go to Edit > Project Settings >
Input. You may have to _adjust the size_ of the Input Manager if you do not
want to overwrite any of the current values.

All of the settings have most properties in common, here are the common properties:

{% highlight javascript %}
{
    Gravity: 0,
    Dead: 0.19, // No Reason, just went for that.
    Sensitivity: 1,
    Type: "Joystick Axis", // Yes, even for triggers
    Joy Num: "Get Motion from all Joy"
}
{% endhighlight %}

Here are all the fields that diverged:

##### Left Joystick
{% highlight javascript %}
[{
    Name: "Horizontal",
    Axis: "X axis"
}
{
    Name: "Vertical",
    Axis: "Y axis"
}]
{% endhighlight %}

##### Right Joystick
{% highlight javascript %}
[{
    Name: "HorizontalTurn",
    Axis: "3rd Axis (Joystick and Scrollwheel)"
}
{
    Name: "VerticalTurn",
    Axis: "4th axis (Joysticks)"
}]
{% endhighlight %}

##### Right Trigger
{% highlight javascript %}
{
    Name: "RightTrigger",
    Axis: "6th axis (Joysticks)"
}
{% endhighlight %}

##### Left Trigger
{% highlight javascript %}
{
    Name: "LeftTrigger",
    Axis: "5th axis (Joysticks)"
}
{% endhighlight %}

This means I only have 6 inputs in my Input Manager settings. Therefore,
Fire1 would not work (currently).

#### XBoxController.cs
The code for the xbox controller is rather simple. Every Update I check the
values of those virtual axes and update the public properties of my
controller. Pay particular attention to the precompiler `#if` statement.
This allows us to program specific logic for WebGL, which acts differently
than Mac OSX Stand alone.

{% highlight csharp %}
using UnityEngine;

public class XBoxOneController : MonoBehaviour {

	public float horizontal { get; private set; }
	public float vertical { get; private set; }
	public float horizontalTurn { get; private set; }
	public float verticalTurn { get; private set; }
	public float rightTrigger { get; private set; }
	public float leftTrigger { get; private set; }

	private bool rTriggerUsed;
	private bool lTriggerUsed;

	private DebugController debug;

	void Start() {

		// Debugging must be manually turned on by the unity editor.
		rTriggerUsed = false;
		lTriggerUsed = false;

		debug = DebugController.GetController();
	}

	void Update () {
		horizontal = Input.GetAxis("Horizontal");
		vertical = Input.GetAxis("Vertical");
		horizontalTurn = Input.GetAxis("HorizontalTurn");
		verticalTurn = Input.GetAxis("VerticalTurn");
		rightTrigger = Input.GetAxis("RightTrigger");
		leftTrigger = Input.GetAxis("LeftTrigger");

		#if UNITY_WEBGL
		_WebGL();
		#endif

		// Trigger start values have been a bit odd
		if (!rTriggerUsed) {
			if (rightTrigger != 0) {
				rTriggerUsed = true;
			} else {
				rightTrigger = -1;
			}
		}
		if (!lTriggerUsed) {
			if (leftTrigger != 0) {
				lTriggerUsed = true;
			} else {
				leftTrigger = -1;
			}
		}

		// right and left triggers tend to have a value of -1 after their first use.
		// I think it is better to normalize.
		rightTrigger = (rightTrigger + 1) / 2;
		leftTrigger = (leftTrigger + 1) / 2;

		if (debug.debug) {
			Log("Horizontal", horizontal, "Vertical", vertical,
			    "HorizontalTurn", horizontalTurn, "VerticalTurn", verticalTurn,
				"RightTrigger", rightTrigger, "LeftTrigger", leftTrigger);
		}
	}

	void Log(params object[] vals) {
		string str = "";
		for (int i = 0; i < vals.Length; i += 2) {
			str += vals[i] + " = " + vals[i + 1] + "\n";
		}

		Debug.Log(str);
	}

	private void _WebGL() {
		float hTurn = horizontalTurn;
		float vTurn = verticalTurn;
		float lTrigger = leftTrigger;

		horizontalTurn = vTurn;
		leftTrigger = hTurn;
		verticalTurn = lTrigger;
	}
}
{% endhighlight %}

### Demo
Here is a simple demo app that will use the xbox controller values to color
a black piece of material. There are no buttons considered here.
