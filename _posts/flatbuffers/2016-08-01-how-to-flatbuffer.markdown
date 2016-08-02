---
layout: post
title: Working with FlatBuffers
category: flatbuffers
permalink: /flatbuffers/how-to-flatbuffers
---

### Working with FlatBuffers

In the [previous article](/flatbuffers/intro) we discussed the basics of the flatbuffers algorithm and how it de/serializes.  Now its time to get practical.  Let's start constructing our own flatbuffer schema, build the data, and work with the data from a remote source.

### FlatBuffers Schema

Lets build Netflix!  All of the code I'll be building here and in all examples will be found in my [flatbuffers-benchmarks](https://github.com/michaelbpaulson/flatbuffers-benchmarks) repo.  For the sake of readability, I'll reduce the amount of code to a minimal amount.  For more examples of schema's and usage check out the test directory of [Google FlatBuffers](https://github.com/google/flatbuffers).

It is simple to think of Netflix as a (L)ist (O)f (L)ist (O)f (M)ovie (O)bjects, `Lolomo`.  I know, I know, Netflix is not comprised of only movies, but this acronym, Lolomo, has been around for quite some time, long enough where this was true.  So lets build the Lolomo structure.  A `Lolomo` will contain an `id`, which is a `string`, and a list of `Row`s.  `Row`s will contain a `title`, `id`, and a list of videos.  `Video`s contain a set of fields such as title, rating, maturity, runningTime, yearCreated, etc. etc.  `Video`s is where most of the code was abbreviated.


{% highlight bash %}
# lolomo.fbs
# Check out the javascript tests in the google/flatbuffer or my src/ in
# michaelbpaulson/flatbuffers-benchmarks

namespace Netflix;

# Lets define things in reverse order.  Starting with Video.
table Video {
    id:int;
    title:string;
    synopsis:string;
    isOriginal:bool = false;
}

# The lo in Lolomo
table Row {
    title:string;
    id:string;

    # The brackets denote that this is a vector of Video objects.
    # You can think of a vector as an array
    videos:[Video];
}

# The Lo in Lolomo
table Lolomo {
    id:string;
    rows:[Row];
}

# Lastly, we define a root_type, which is Lolomo.
root_type Lolomo;

{% endhighlight %}

### Time to build

Now that we have our schema, its time to generate our bindings.  First we need to build the flatbuffers project to get `flatc`, the flatbuffers compiler.  This is pretty simple on OSX.  In short, to build should come down to executing two commands: `cmake -G "Unix Makefiles" && make`.  There may be some env variables to export or xcode tool something or other to download, but overall, really straight forward.  Once you have the executable `flatc` then you can generate the bindings.  As of now, JavaScript is not fully featured, but should work for most cases.

{% highlight bash %}
# Build the bindings
cd ~/folder/to/where/you/want/bindings/to/be

# If you wish to be able to mutate values after building, then add the --gen-mutable flag
flatc --js --gen-mutable ./path/to/lolomo.fbs
{% endhighlight %}

Now we should have `lolomo_generated.js` file which contain bindings for the lolomo schema.

### Building FBS Structures in JS

I am not the biggest fan of how flatbuffers are constructed.  They must be constructed from the bottom-up which can be difficult for novice programmers.  So to construct a flatbuffer object, the following order must be taken:

* Construct all non scalar values.  
  * `string`s, `vector`s, and `Table`s.
* Construct the object.

So to construct the `Row` object we must do the following:

* Initialize the `string` id.
* Create each `Video` in the `videos` list keeping track of the `offset` that comes from each.
* Construct the `Video` vector.
* Start construction (`startRow()`) of the `Row` object and feed it the offsets created from the `id` and `Video`'s vector.
* Complete (`endRow()`)`Row` object

If you are like me then its best to see a code example.  First lets create the `Video` constructor function since its our easiest object to create.  `Video` construction only requires a `builder` object (explained later) and the `videoObject`.

{% highlight javascript %}
const Netflix = require('./lolomo_generated').Netflix;
const Lolomo = Netflix.Lolomo;
const Row = Netflix.Row;
const Video = Netflix.Video;

function constructVideo(builder, videoObject) {

    // As stated above, lets first construct the string values.
    const titleOffset = builder.createString(videoObject.title);
    const synopsisOffset = builder.createString(videoObject.title);

    // Since we do not have any other non-scalar children, we can start the video object.
    Video.startVideo(builder);
    Video.addId(builder, video.id);
    Video.addTitle(builder, titleOffset);
    Video.addSynopsis(builder, synopsisOffset);
    Video.addIsOriginal(builder, video.isOriginal);

    return Video.endVideo(builder);
}

{% endhighlight %}

The first thing you may notice is that we return what comes out of `Video.endVideo` function.  This is the offset to the video.  We need that offset to be stored in the list we will create when creating the `Row` object.  If you remember the array example from my previous post, you can think of the value coming out of `endVideo` to be the location in the `Uint8array` where the video exists.

The `Row` constructor is a bit more complicated as it has a `Vector<Video>`.

{% highlight javascript %}

function constructRow(builder, rowObject) {

    // As stated above, lets first construct the string values.
    const titleOffset = builder.createString(rowObject.title);
    const idOffset = builder.createString(rowObject.id);

    // now we need to create the Video array of indices.
    const videos = rowObject.videos;
    const videoIndices = [];
    for (let i = 0; i < videos.length; ++i) {
        videoIndices.push(constructVideo(builder, videos[i]));
    }

    // We take our list of video indices and create
    // our video vector.
    const videosIndex = Row.createVideosVector(builder, videoIndices);

    // Now we start our row object.
    Row.startRow(builder);
    Row.addTitle(builder, titleOffset);
    Row.addId(builder, idOffset);
    Row.addVideos(builder, videosIndex);

    // Return the Row index.  Much like the video indices,
    // a list of row indices will need to be created.
    return Row.endRow(builder);
}

{% endhighlight %}

Alright!  Our construction from the bottom up is almost complete.  The last thing we need to do is construct the `Lolomo`.  This will consist of a vector of `Row` objects and the `id`.

{% highlight javascript %}

function constructLolomo(lolomo) {

    // A builder object allocates memory and performs the
    // writing of the binary data to an underlying ByteBuffer.
    // If you have an educated guess to the size of your
    // buffer, then there is a significant performance improvement.
    // For now, I'll pass in 1 since the builder knows how to
    // increase memory when needed.
    const builder = new flatbuffers.Builder(1);

    const idOffset = builder.createString(lolomo.id);

    // Construct the list of row indices (offsets).
    const rows = lolomo.rows;
    const rowIndices = [];
    for (let i = 0; i < rows.length; ++i) {
        rowIndices.push(constructRow(builder, rows[i]));
    }

    // We take our list of video indices and create
    // our video vector.
    const rowsIndex = Lolomo.createRowsVector(builder, rowIndices);

    Lolomo.startLolomo(builder);
    Lolomo.addId(builder, idOffset);
    Lolomo.addRows(builder, rowsIndex);

    const lolomoIndex = Lolomo.endLolomo(builder);

    // Now we do something different.  Since our Lolomo is the
    // root object we need to finish this buffer.  At this
    // point we can return the Uint8Array that represents this
    // flatbuffer.
    Lolomo.finishLolomoBuffer(builder, lolomoIndex);

    return builder.asUint8Array();
}

{% endhighlight %}

We are done.  This is the hardest part of working with flatbuffers. The construction code.  All items must be constructed from the bottom up, which can be tricky the first time.  This is why I am concerned over the `Usability` of flatbuffers, but the concern is pretty minimal.  Construction code needs to be created once and the everyday developer will not need to touch it.

### Receiving Data and working with FBS in Node

Now that we can construct our `Lolomo` lets send it over the wire.  I'll assume that `getData()` is a function that takes a `callback`, and the `callback` will be called with a Uint8Array.  From there, it is simple to construct the flatbuffers bindings.


{% highlight javascript %}

getData(function onData(data) {
    // Construct the byte buffer.
    const buffer = new flatbuffers.ByteBuffer(data);

    // Now we can construct our Lolomo object.
    const lolomo = Lolomo.getRootAsLolomo(buffer);
});

{% endhighlight %}

At this point, working with the `lolomo` object is simple, the schema is the API.  Lets `console.log` the first video's `title` in the last rows.  Now remember, we have simply pointed to a block of memory and called it a `Lolomo`.  We have not done any deserialization, except for the indices required to get to the first video, and the length of the `Row` vector.  

{% highlight javascript %}

... getData ...
const lastRowIdx = lolomo.rowsLength() - 1;
const lastRow = lolomo.rows(lastRowIdx);

const firstVideo lastRow.videos(0);
const title = firstVideo.title();

console.log(title); // Stranger Things

{% endhighlight %}

### What is next?

The next article will be directed towards performance.  More specifically the performance of serialization of these two.  Hopefully after that, we will break down the cost of memory.
