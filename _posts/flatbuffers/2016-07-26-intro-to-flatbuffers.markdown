---
layout: post
title: Intro to Flatbuffers
category: flatbuffers
permalink: /flatbuffers/intro
---

## Flatbuffers --- Why?

I started web development in 2010.  Yeah, I know, I started when times were easy.  The days of IE8+, jQuery was all the rage, and PHP was hotter than a pistol.  During my time developing I questioned so many of the practices: "Why am I using PHP?", "Who uses IE7?", and "Why is jQuery so awesome?".  But one thing that never crossed my mind is "why JSON?"  JSON was ubiquitous and human readable.  In fact, I had my first white paper accept during my time in academia about [JSON](http://www.cs.montana.edu/izurieta/pubs/IzurietaCAINE2009.pdf).  Yeah, the paper sucked, but none the less, JSON was awesome!  So for the rest of my career, up until this year, I have never considered anything but the all mighty JSON.  But then it happened... my friend, [Guy](https://github.com/michaelbpaulson/following)\*, explained to me why he does not JSON.  Of course my natural reaction was...

> "Are you suggesting XML?" - Me  
> "XML?" - Guy

After a 15 second conversation about real life, you know, adult things, I quickly realized I am a fool!  

This is the motivation for explaining what [Flatbuffers](https://github.com/google/flatbuffers) are and why they are amazingly cool.  So this will be a series of articles that rely as much as possible on data, and little as possible on feelings.  You know, practical science shit.

### Before you flatbuffer

Before you flatbuffer it is best you understand JSON and how its parsed and sent over the wire.  The following is from [JSON.org](http://www.json.org).

> **JSON** (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write. It is easy for machines to parse and generate. It is based on a subset of the JavaScript Programming Language, Standard ECMA-262 3rd Edition - December 1999. JSON is a text format that is completely language independent but uses conventions that are familiar to programmers of the C-family of languages, including C, C++, C#, Java, JavaScript, Perl, Python, and many others. These properties make JSON an ideal data-interchange language.

This series of articles is me disagreeing with the above statement.  Well, not the whole statement, really just the last part.

> These properties make JSON an ideal data-interchange language.

This first article is meant to introduce flatbuffers, what they are, and the high level algorithm used.  From there I'll be making a set of comparisons of there runtime.  All experiments will be done in node.

#### Why JSON?

JSON is quite simple and it looks just like Javascript!  Lets give a small example.

{% highlight javascript %}
const video = {
    title: 'Stranger Things',
    rating: 5.0,
    synopsis: 'Refusing to believe Will is dead, Joyce tries to connect with her son. The boys give Eleven a makeover. Nancy and Jonathan form an unlikely alliance.'
};
{% endhighlight %}

The above code is a Javascript variable named `video`.  To make this into valid json, the following function is applied `const json = JSON.stringify(video)`.  That string is valid JSON!  Then the binary contents of the string are sent across the wire to a receiver where the json is converted from bytes on the wire to a Javascript string to a tree (Javascript Object).

### Intro to flatbuffers

At this point you are probably thinking "why are we talking about JSON"?  To understand why flatbuffers are so awesome you first must understand what happens when working with JSON.  To recap...  

* Some object structure has to be converted from a class or map into a string.
* When receiving json, that string needs to be converted back into an object.
  * Yes, the entire structure, at once.

The above points are extremely simplified and hide even more about why flatbuffers are awesome ([Zero Copy](https://en.wikipedia.org/wiki/Zero-copy)), but its not our concern for now.

#### How it works by understanding arrays

To understand flatbuffers lets take the previously mentioned `video` object and transform it.  Instead of listing the keys and values in a map, let us just put each one of the values into an array.

{% highlight javascript %}
// For sake of readability I have replaced the synopsis with '...'
const video = ['Stranger Things', 5.0, '...'];
{% endhighlight %}

Now that we have this `array` of data, we need a way to understand it.  Lets hand generate some bindings.

{% highlight javascript %}
const Video = function Video(data) {
    this.data = data;
};

Video.prototype = {
    title() {
        return this.data[0];
    },

    rating() {
        return this.data[1];
    },

    synopsis() {
        return this.data[2];
    }
};
{% endhighlight %}

The video array can now be understood through an interface.  Now lets expand this example.  So for me to get out the rating of video I would do the following.  

{% highlight javascript %}

getDataFromSource(function cb(data) {
    const video = new Video(data);
    console.log('Here is my title', video.title());
});

{% endhighlight %}

Let us expand our example from a single array representing a single video to a single array representing `N` videos. How would this change our interface?  Lets rewrite the interface to consider the array is filled with many movies.

{% highlight javascript %}
const Video = function Video(data, offset) {
    this.data = data;
    this.offset = offset;
};

Video.prototype = {
    title() {
        return this.data[this.offset];
    },

    rating() {
        return this.data[this.offset + 1];
    },

    synopsis() {
        return this.data[this.offset + 2];
    }
};
{% endhighlight %}

The offset is required to know where in the array buffer to start from.  From there it is simple addition to get to the values.

So now you have the idea.  Arrays.  But instead of arrays think `Uint8Array` or contiguous memory blocks.  In the end, what makes flatbuffers so powerful is the ability to point to memory and say you are a `Video`.  There is no need to parse the entire block to read a single field.  This becomes increasingly more powerful with larger payloads.

### Conclusion

In the end I hope that I have convinced you to at least check out flatbuffers.  Even if its just for fun.  There is a world where JSON is off.  And its a really performant world.

\* - Guy:  I had no idea I was following him on github.  But then I realized he is the only person I follow.  I think I'll keep that for the foreseeable future.
