// MAGNITUDE MAP ////////////////////


var width = 500,
    height = 400;

var projection = d3.geo.mercator()
    .center([18, 5 ])
    .scale(120)
    .rotate([-180,0])
    .translate([width / 2, height / 2]);

var svg = d3.select("#magnitude_id").append("svg")
    .attr("width", width)
    .attr("height", height);

var magBorderPath = svg.append("rect")
      .attr("height", height)
      .attr("width", width)
      .style("stroke", 'white')
      .style("fill", "none")
      .style("stroke-width", 2);

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

// load and display the World
d3.json("data/world-110m2.json", function(error, topology) {
// load and display the cities
    d3.csv("data/cities.csv", function(error, data) {
        g.selectAll("circle")
            .data(data)
            .enter()
            .append("a")
            .attr("xlink:href", function(d) {
                return "https://www.google.com/search?q="+d.city;}
            )
        .append("circle")
            .attr("cx", function(d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr('r', function(d){
                return d.radius
            })
            .attr("id",function(d){return d.id+"circle";})
           .style("fill", function(d) {            // <== Add these
            if (d.country=='Nepal') {return d3.rgb('153','216','201')}  // <== Add these
            else { return "steelblue" }          // <== Add these
              ;})

            .call(d3.helper.tooltip()
                .attr("class","tooltip")
                .text(function(data, i){
                    return ['<div class="hoverinfo">' +  data.city,
                        '<br/>Magnitude: ' +  data.intensity + ' Richter',
                        '<br/>Country: ' +  data.country + '',
                        '<br/>Date: ' +  data.date + '',
                        '</div>'].join('');}))

            .on('mouseover', function(d, i){
              var id=d.id;
              var color= "red"
              d3.select("#"+id+"bar").style("fill", color);
              d3.select(this).style("fill", color);
            })

            .on('mouseout', function(d, i){
              var id=d.id;
              var color= function(d) {if (id=='e10circle') {return d3.rgb('153','216','201')}
               else { return "steelblue" } };
              d3.select("#"+id+"bar").style("fill", color);
              d3.select(this).style("fill", color);

                })
            });


    g.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries)
            .geometries)
        .enter()
        .append("path")
        .attr("d", path)
});


// FEEDBACK MAP /////////////////////////////////////////


var fb_width = 500,
  fb_height = 350

var question_data;

d3.json("data/question_data.json", function(json) {
  question_data=json;
});

function updateQuestion() {
  question = document.querySelector('option:checked').value;
  document.getElementById("question-title").innerText = question_data[question]["text"];
  document.getElementById("question-desc").innerText = question_data[question]["description"];
  document.getElementById("question-image").src = question_data[question]["image"];
  update_all();
} ;

var fb_tooltip = d3.select("feedback")
.append("div")
.attr("class", "tiptool")
;

var fb_svg = d3.select("#map")
.append("svg")
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("viewBox", "0 0 " + fb_width + " " + fb_height)
  .attr("width", fb_width)
  .attr("height", fb_height);

  var borderPath = fb_svg.append("rect")
  .attr("height", fb_height)
  .attr("width", fb_width)
  .style("stroke", 'black')
  .style("fill", "none")
  .style("stroke-width", 1);

var fb_g = fb_svg.append("g")
  .attr("id", "country");

var fb_projection = d3.geo.mercator()
  // LONG, LAT
  .center([85.5, 27.2])
  // LONG, LAT, ROLL
  //.parallels([27.6, 28.3])
  .translate([width / 2, height / 1.5])
  .scale(7000);

var fb_path = d3.geo.path()
  .projection(fb_projection);

var slices=[.02, 1,2, 3,4,5];

// These thresholds are manually defined to make the data look good
var fb_color = d3.scale.threshold()
  .domain(slices)
  .range(["#000000", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);



  var legendData=
  [
    {"x": "1","y": "0","label":"Not at all"},
    {"x": "2","y": "1","label":"" },
    {"x": "3","y": "2","label":"Somewhat"},
    {"x": "4","y": "3","label":""},
    {"x": "5","y": "4","label":"Totally"}
  ];


  //Width and height
  var w = 170;
  var h = 100;
  var x_pos=320;
  var y_pos=-25;
  var padding=50;
  var barPadding = 1;

  var legendX = d3.scale.ordinal()
      .rangeBands([0, w]);

  var legendXAxis = d3.svg.axis().scale(legendX)
      .orient("bottom").ticks(2);


  function draw_legend(data)
  {
    // Defining X axis in the function so it can pull from data
    legendX.domain(data.map(function(d) { return d.x; }));
    // Add Axis
    fb_svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+x_pos+","+(y_pos+h)+")")
      .call(legendXAxis);

    // Create Bars
    fb_svg.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", function(d, i) {
          return x_pos+(i * (w / data.length))-17;
          })
       .attr("y", y_pos+50)
       .attr("width", w / data.length - barPadding)
       .attr("height", 50)
       .style("fill", function (d) { return fb_color(d.y) })
      ;

    // Add Data Labels
    fb_svg.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .text(function (d) {return d.label;})
      .attr("class", "label")
      .attr("x", function(d, i) {
         return x_pos+(i * (w / data.length) + (w / data.length - barPadding) / 2);
         })
      .attr("y", y_pos+45)
      .attr("text-anchor","middle")
    ;

  // end Draw function
  };

draw_legend(legendData);

d3.json("data/feedback_map_v2.geojson", function(shape) {
fb_g.append("g")
  .attr("id", "districts")
  .selectAll("path")
    .data(shape.features)
  .enter().append("path")
    .attr("id",
      function(d) {
        return d['properties']['District'];
      })
    .attr("class", "district")
    .attr("class", "active")
    .attr("d", fb_path)
    .style("fill", function (d) { return fb_color(d.properties[question]) })
    .on("mousemove", update_tooltip)
    // using mouseover for fill is less painful than css hover bc
    // svgs for district/vdc are not hierarchal in the DOM
    .on("mouseover", update_fill)
    .on("mouseout", hide_tooltip)
    ;

});

function update_tooltip(d) {
  var mouse = d3.mouse(fb_svg.node()).map( function(d) { return parseInt(d); } );
  var tooltip_content = function(){
    if(d.properties[question]==null)
      {return 'No Data Available';}
    else
      {return d.properties[question].toFixed(2);}
    };

  if (d3.select(this).classed('active')) {
    fb_tooltip
      .classed("invisible", false)
      .attr("style", "left:"+(mouse[0]+300)+"px;top:"+(mouse[1]+150)+"px")
      .html('District: <b>'+d.properties['District']+'</b><br>Avg. Response:<b>'//+d.properties[question]
      //+if(d.properties[question]=='null'){'No Data Available';} else {d.properties[question];}
      +tooltip_content()+'</b>')
  }
  };

function update_fill(d){
  if (d3.select(this).classed('active')) {
    d3.select(this).style("fill", "#ffa")
  }
  };

function update_all(){
  d3.selectAll("path.active")
    .style("fill", function (d) { return fb_color(d.properties[question]) })
  };

function hide_tooltip(d){
  fb_tooltip.classed("invisible", true);
  // let css rules determine fill color
  d3.select(this).style("fill", function (d) { return fb_color(d.properties[question]) })
  };

updateQuestion();
