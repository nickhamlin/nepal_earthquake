//$("timeline").empty();

function wordCloud(selector) {
    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", 400)
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
    //var margin = {top: 80, right: 2, bottom: 2, left: 0},
    //    width = 500 - margin.left - margin.right,
    //    height = 480 - margin.top - margin.bottom;

//var parseDate = d3.time.format("%Y%m%d").parse;
//
//var x = d3.time.scale()
//    .range([0, width]);
//
//var y = d3.scale.linear()
//    .range([height, 0]);
//
//var color = d3.scale.category10();
//
//var xAxis = d3.svg.axis()
//    .scale(x)
//    .orient("bottom");
//
//var yAxis = d3.svg.axis()
//    .scale(y)
//    .orient("left");
//
//var line = d3.svg.line()
//    .interpolate("basis")
//    .x(function(d) { return x(d.date); })
//    .y(function(d) { return y(d.wordcounts); });
//
//var svg_timeseries = d3.select(content).append("svg")
//    .attr("width", width + margin.left + margin.right)
//    .attr("height", height + margin.top + margin.bottom)
//  .append("g")
//    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//d3.csv("data/timeseries.csv", function(error, data) {
//  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
//
//  data.forEach(function(d) {
//    d.date = parseDate(d.date);
//  });
//
//  var cities = color.domain().map(function(name) {
//    return {
//      name: name,
//      values: data.map(function(d) {
//        return {date: d.date, wordcounts: +d[name]};
//      })
//    };
//  });
//
//  x.domain(d3.extent(data, function(d) { return d.date; }));
//
//  y.domain([
//    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.wordcounts; }); }),
//    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.wordcounts; }); })
//  ]);
//
//
//
//  svg_timeseries.append("g")
//      .attr("class", "x timeline_axis")
//      .attr("transform", "translate(0," + height + ")")
//      .call(xAxis)
//      .append("text")
//      .attr("x", 6)
//      .attr("dx", ".71em")
//      .style("text-anchor", "beg")
//      .text("Months");
//
//  svg_timeseries.append("g")
//      .attr("class", "y timeline_axis")
//      .call(yAxis)
//    .append("text")
//      .attr("transform", "rotate(-90)")
//      .attr("y", 6)
//      .attr("dy", ".71em")
//      .style("text-anchor", "end")
//      .text("Word   Occurrence  Count");
//
//  var svg_words = svg_timeseries.selectAll(".wordcounts")
//      .data(cities)
//    .enter().append("g")
//      .attr("class", "wordcounts");
//
//  svg_words.append("path")
//      .attr("class", "line")
//      .attr("d", function(d) { return line(d.values); })
//      .attr("data-legend",function(d) { return d.name})
//      .style("stroke", function(d) { return color(d.name); });
//
//  svg_words.append("text")
//      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
//      .attr("transform", function(d) {
//          console.log(d.value);
//          console.log(d.value.date);
//          console.log("-----------");
//          console.log(x(d.value.date));
//          return "translate(" + x(d.value.date) + "," + y(d.value.wordcounts) + ")"; })
//      .attr("x", 3)
//      .attr("dy", ".35em")
//      .text(function(d) {
//          console.log(d.name);
//          return d.name; });
//
//
//  legend = svg_timeseries.append("g")
//    .attr("class","legend")
//    .attr("transform","translate(40,10)")
//    .style("font-size","8px")
//    .call(d3.legend)
//
//  setTimeout(function() {
//    legend
//      .style("font-size","10px")
//      .attr("data-style-padding",10)
//      .call(d3.legend)
//  },1000)
//
//});


var margin = {top: 15, right: 75, bottom: 50, left: 20},
    margin2 = { top: 215, right: 20, bottom: 10, left: 10 },
//    var margin = {top: 80, right: 2, bottom: 2, left: 0},
//        margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
//        width = 400 - margin.left - margin.right,
//        height = 480 - margin.top - margin.bottom;
//        height2 = 500 - margin2.top - margin2.bottom;

    width = 450 - margin.left - margin.right,
    height = 525 - margin.top - margin.bottom,
    height2 = 275 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

var xScale = d3.time.scale()
    .range([0, width]),

    xScale2 = d3.time.scale()
    .range([0, width]); // Duplicate xScale for brushing ref later

var yScale = d3.scale.linear()
    .range([height, 0]);

// 40 Custom DDV colors
var color = d3.scale.ordinal().range(["#85baa1", "#c19068", "#544e61", "#e3c4a4"]);


var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom"),

    xAxis2 = d3.svg.axis() // xAxis for brush slider
    .scale(xScale2)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.rating); })
    .defined(function(d) { return d.rating; });  // Hiding line value defaults of 0 for missing data

var maxY; // Defined later to update yAxis

var svg = d3.select(content).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom) //height + margin.top + margin.bottom
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create invisible rect for mouse tracking
svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0)
    .attr("id", "mouse-tracker")
    .style("fill", "white");

//for slider part-----------------------------------------------------------------------------------

var context = svg.append("g") // Brushing context box container
    .attr("transform", "translate(" + 0 + "," + 410 + ")")
    .attr("class", "context");

//append clip path for lines plotted, hiding those part out of bounds
svg.append("defs")
  .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

//end slider part-----------------------------------------------------------------------------------

d3.csv("data/timeseries.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { // Set the domain of the color ordinal scale to be all the csv headers except "date", matching a color to an issue
    return key !== "date";
  }));

  data.forEach(function(d) { // Make every date in the csv data a javascript date object format
    d.date = parseDate(d.date);
  });

  var categories = color.domain().map(function(name) { // Nest the data into an array of objects with new keys

    return {
      name: name, // "name": the csv headers except date
      values: data.map(function(d) { // "values": which has an array of the dates and ratings
        return {
          date: d.date,
          rating: +(d[name]),
          };
      }),
      visible: true // "visible": all false except for economy which is true.
    };
  });

  xScale.domain(d3.extent(data, function(d) { return d.date; })); // extent = highest and lowest points, domain is data, range is bouding box

  yScale.domain([0, 100
    //d3.max(categories, function(c) { return d3.max(c.values, function(v) { return v.rating; }); })
  ]);

  xScale2.domain(xScale.domain()); // Setting a duplicate xdomain for brushing reference later


  context.append("g") // Create brushing xAxis
      .attr("class", "x axis1")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  var contextArea = d3.svg.area() // Set attributes for area chart in brushing context graph
    .interpolate("monotone")
    .x(function(d) { return xScale2(d.date); }) // x is scaled to xScale2
    .y0(height2) // Bottom line begins at height2 (area chart not inverted)
    .y1(0); // Top line of area, 0 (area chart not inverted)

  //plot the rect as the bar at the bottom
  context.append("path") // Path is created using svg.area details
    .attr("class", "area")
    .attr("d", contextArea(categories[0].values)) // pass first categories data .values to area path generator
    .attr("fill", "#F1F1F2");


  // draw line graph
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("x", -10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Word   Occurrence  Count");

  var issue = svg.selectAll(".issue")
      .data(categories) // Select nested data and append to new svg group elements
    .enter().append("g")
      .attr("class", "issue");

  issue.append("path")
      .attr("class", "line")
      .style("pointer-events", "none") // Stop line interferring with cursor
      .attr("id", function(d) {
        return "line-" + d.name.replace(" ", "").replace("/", ""); // Give line id of line-(insert issue name, with any spaces replaced with no spaces)
      })
      .attr("d", function(d) {
        return d.visible ? line(d.values) : null; // If array key "visible" = true then draw line, if not then don't
      })
      .attr("clip-path", "url(#clip)")//use clip path to make irrelevant part invisible
      .style("stroke", function(d) { return color(d.name); });

  // draw legend
  var legendSpace = 450 / categories.length; // 450/number of issues (ex. 40)

  issue.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("x", width + (margin.right/3) - 15)
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace) - 8; })  // spacing
      .attr("fill",function(d) {
        return d.visible ? color(d.name) : "#F1F1F2"; // If array key "visible" = true then color rect, if not then make it grey
      })
      .attr("class", "legend-box")

      .on("click", function(d){ // On click make d.visible
        d.visible = !d.visible; // If array key for this data selection is "visible" = true then make it false, if false then make it true

        maxY = findMaxY(categories); // Find max Y rating value categories data with "visible"; true
        yScale.domain([0,maxY]); // Redefine yAxis domain based on highest y value of categories data with "visible"; true
        svg.select(".y.axis")
          .transition()
          .call(yAxis);

        issue.select("path")
          .transition()
          .attr("d", function(d){
            return d.visible ? line(d.values) : null; // If d.visible is true then draw line for this d selection
          })

        issue.select("rect")
          .transition()
          .attr("fill", function(d) {
          return d.visible ? color(d.name) : "#F1F1F2";
        });
      })

      .on("mouseover", function(d){

        d3.select(this)
          .transition()
          .attr("fill", function(d) { return color(d.name); });

        d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
          .transition()
          .style("stroke-width", 2.5);
      })

      .on("mouseout", function(d){

        d3.select(this)
          .transition()
          .attr("fill", function(d) {
          return d.visible ? color(d.name) : "#F1F1F2";});

        d3.select("#line-" + d.name.replace(" ", "").replace("/", ""))
          .transition()
          .style("stroke-width", 1.5);
      })

  issue.append("text")
      .attr("x", width + (margin.right/3))
      .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); })  // (return (11.25/2 =) 5.625) + i * (5.625)
      .text(function(d) { return d.name; });

  // Hover line
  var hoverLineGroup = svg.append("g")
            .attr("class", "hover-line");

  var hoverLine = hoverLineGroup // Create line with basic attributes
        .append("line")
            .attr("id", "hover-line")
            .attr("x1", 10).attr("x2", 10)
            .attr("y1", 0).attr("y2", height + 10)
            .style("pointer-events", "none") // Stop line interferring with cursor
            .style("opacity", 1e-6); // Set opacity to zero

  var hoverDate = hoverLineGroup
        .append('text')
            .attr("class", "hover-text")
            .attr("y", height - (height-40)) // hover date text position
            .attr("x", width - 150) // hover date text position
            .style("fill", "#E6E7E8");

  var columnNames = d3.keys(data[0]) //grab the key values from your first data row
                                     //these are the same as your column names
                  .slice(1); //remove the first column name (`date`);

  var focus = issue.select("g") // create group elements to house tooltip text
      .data(columnNames) // bind each column name date to each g element
    .enter().append("g") //create one <g> for each columnName
      .attr("class", "focus");

  focus.append("text") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
        .attr("class", "tooltip")
        .attr("x", width + 20) // position tooltips
        .attr("y", function (d, i) { return (legendSpace)+i*(legendSpace); }); // (return (11.25/2 =) 5.625) + i * (5.625) // position tooltips

  // Add mouseover events for hover line.
  d3.select("#mouse-tracker") // select chart plot background rect #mouse-tracker
  .on("mousemove", mousemove) // on mousemove activate mousemove function defined below
  .on("mouseout", function() {
      hoverDate
          .text(null) // on mouseout remove text for hover date

      d3.select("#hover-line")
          .style("opacity", 1e-6); // On mouse out making line invisible
  });

  function mousemove() {
      var mouse_x = d3.mouse(this)[0]; // Finding mouse x position on rect
      var graph_x = xScale.invert(mouse_x); //


      var format = d3.time.format('%b %Y'); // Format hover date text to show three letter month and full year

      hoverDate.text(format(graph_x)); // scale mouse position to xScale date and format it to show month and year

      d3.select("#hover-line") // select hover-line and changing attributes to mouse position
          .attr("x1", mouse_x)
          .attr("x2", mouse_x)
          .style("opacity", 1); // Making line visible


      var x0 = xScale.invert(d3.mouse(this)[0]), /* d3.mouse(this)[0] returns the x position on the screen of the mouse. xScale.invert function is reversing the process that we use to map the domain (date) to range (position on screen). So it takes the position on the screen and converts it into an equivalent date! */
      i = bisectDate(data, x0, 1), // use our bisectDate function that we declared earlier to find the index of our data array that is close to the mouse cursor
      /*It takes our data array and the date corresponding to the position of or mouse cursor and returns the index number of the data array which has a date that is higher than the cursor position.*/
      d0 = data[i - 1],
      d1 = data[i],
      /*d0 is the combination of date and rating that is in the data array at the index to the left of the cursor and d1 is the combination of date and close that is in the data array at the index to the right of the cursor. In other words we now have two variables that know the value and date above and below the date that corresponds to the position of the cursor.*/
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      /*The final line in this segment declares a new array d that is represents the date and close combination that is closest to the cursor. It is using the magic JavaScript short hand for an if statement that is essentially saying if the distance between the mouse cursor and the date and close combination on the left is greater than the distance between the mouse cursor and the date and close combination on the right then d is an array of the date and close on the right of the cursor (d1). Otherwise d is an array of the date and close on the left of the cursor (d0).*/

      //d is now the data row for the date closest to the mouse position

      focus.select("text").text(function(columnName){
         //because you didn't explictly set any data on the <text>
         //elements, each one inherits the data from the focus <g>

         return (d[columnName]);
      });
  };


}); // End Data callback function

  function findMaxY(data){  // Define function "findMaxY"
    var maxYValues = data.map(function(d) {
      if (d.visible){
        return d3.max(d.values, function(value) { // Return max rating value
          return value.rating; })
      }
    });
    return d3.max(maxYValues);
  }

}
