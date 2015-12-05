//$("timeline").empty();

function wordCloud(selector) {
    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", 600)
        .attr("height", 400)
        .append("g").attr("class","tagcloud")
        .attr("transform", "translate(250,250)");

    var color = d3.scale.linear()
            .domain([0,1,2,3,4,5,6,10,15,20,100])
            .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);



    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
            .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return color(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
//                    .duration(600)
            .style("font-size", function(d) { return d.size+1 + "px"; })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
            .style('fill-opacity', 1e-6)
            .attr('font-size', 1)
            .remove();
    }


    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function(words) {
            d3.layout.cloud().size([450, 400])
                .words(words)
                .padding(5)
                .font("Impact")
                .fontSize(function(d) { return d.size+1; })
                .on("end", draw)
                .start();
        }
    }

}

//Prepare one of the sample sentences by removing punctuation,
// creating an array of words and computing a random size attribute.
function getWords(i) {
    var xhReq = new XMLHttpRequest();
    if(i==4) {
        // Todo: change to s3 location
        xhReq.open("GET", "data/tweet_1.json", false);
        xhReq.send(null);
    }
    else if(i==5){
        xhReq.open("GET", "data/tweet_2.json", false);
        xhReq.send(null);

    }
    else if(i==6){
        xhReq.open("GET", "data/tweet_3.json", false);
        xhReq.send(null);

    }
    else if(i==7){
        xhReq.open("GET", "data/tweet_4.json", false);
        xhReq.send(null);

    }
    else if(i==8){
        xhReq.open("GET", "data/tweet_5.json", false);
        xhReq.send(null);

    }
    else if(i==9){
        xhReq.open("GET", "data/tweet_6.json", false);
        xhReq.send(null);

    }
    else if(i==10){
        xhReq.open("GET", "data/tweet_7.json", false);
        xhReq.send(null);

    }
    else {
        xhReq.open("GET", "data/tweet_3.json", false);
        xhReq.send(null);

    }

    var json_data = JSON.parse(xhReq.responseText);
    var data=json_data.data;
    console.log(data);
    return data;

}

//This method tells the word cloud to redraw with a new set of words.
//In reality the new words would probably come from a server request,
// user input or some other source.
function showNewWords(vis, i) {


    vis.update(getWords(i))
//        setTimeout(function() { showNewWords(vis, i + 1)}, 2000)
}

//Create a new instance of the word cloud visualisation.
var myWordCloud = wordCloud('timeline');
//Start cycling through the demo data
//Start cycling through the demo data
updateHeight(4);
d3.select("#nHeight").on("input", function() {
    updateHeight(+this.value);

});

function updateHeight(nHeight) {
    // adjust the text on the range slider
    d3.select("#nHeight-value").text(nHeight);
    d3.select("#nHeight").property("value", nHeight);
    console.log(nHeight);
    showNewWords(myWordCloud,nHeight);
    // update the rectangle height
}


// Timeseries

drawtimeline=function(content) {
    var margin = {top: 80, right: 2, bottom: 2, left: 0},
        width = 400 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.wordcounts); });

var svg_timeseries = d3.select(content).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/timeseries.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });

  var cities = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.date, wordcounts: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.date; }));

  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.wordcounts; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.wordcounts; }); })
  ]);

  svg_timeseries.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg_timeseries.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Word Count");

  var svg_words = svg_timeseries.selectAll(".wordcounts")
      .data(cities)
    .enter().append("g")
      .attr("class", "wordcounts");

  svg_words.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .attr("data-legend",function(d) { return d.name})
      .style("stroke", function(d) { return color(d.name); });

  svg_words.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.wordcounts) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });


  legend = svg_timeseries.append("g")
    .attr("class","legend")
    .attr("transform","translate(40,10)")
    .style("font-size","8px")
    .call(d3.legend)

  setTimeout(function() {
    legend
      .style("font-size","10px")
      .attr("data-style-padding",10)
      .call(d3.legend)
  },1000)

});

}