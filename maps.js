// MAGNITUDE MAP ////////////////////

var width = 1000,
    height = 500;

var projection = d3.geo.mercator()
    .center([0, 5 ])
    .scale(150)
    .rotate([-180,0]);

var svg = d3.select("magnitude").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

// load and display the World
d3.json("world-110m2.json", function(error, topology) {
// load and display the cities
    d3.csv("cities.csv", function(error, data) {
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
        //function(d) {
        //        return d.radius;
        //    })
            .style("fill", "red")
            .call(d3.helper.tooltip()
                .text(function(data, i){
                    return ['<div class="hoverinfo">' +  data.city,
                        '<br/>Magnitude: ' +  data.intensity + ' Richter',
                        '<br/>Country: ' +  data.country + '',
                        '<br/>Date: ' +  data.date + '',
                        '</div>'].join('');

                }))
                    //console.log(d.city);
                    //console.log(d.lat);


            .on('mouseover', function(d, i){ d3.select(this).style({fill: 'skyblue'}); })
            .on('mouseout', function(d, i){ d3.select(this).style({fill: 'red'}); })

    });





    g.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries)
            .geometries)
        .enter()
        .append("path")
        .attr("d", path)
});




// zoom and pan
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        g.attr("transform","translate("+
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("circle")
            .attr("d", path.projection(projection));
        g.selectAll("path")
            .attr("d", path.projection(projection));
    });
svg.call(zoom)




// FEEDBACK MAP /////////////////////////////////////////


var fb_width = 960,
  fb_height = 500,
  centered,
  district,
  vdc;

var question = document.querySelector('input[name = "question"]:checked').value;
console.log(question);

function updateQuestion() {
  question = document.querySelector('input[name = "question"]:checked').value;
  console.log(question);
  update_all();
} ;

var fb_tooltip = d3.select("feedback")
.append("div")
.attr("class", "tiptool");

var fb_svg = d3.select("#map")
.append("svg")
  .attr("preserveAspectRatio", "xMidYMid")
  .attr("viewBox", "0 0 " + fb_width + " " + fb_height)
  .attr("width", fb_width)
  .attr("height", fb_height);

fb_svg.append("rect")
  .attr("class", "background")
  .attr("width", fb_width)
  .attr("height", fb_height);

var fb_g = fb_svg.append("g")
  .attr("id", "country");

var fb_projection = d3.geo.mercator()
  // LONG, LAT
  .center([85.33, 27.70])
  // LONG, LAT, ROLL
  //.parallels([27.6, 28.3])
  .translate([width / 2, height / 1.5])
  .scale(4500);

var fb_path = d3.geo.path()
  .projection(fb_projection);

// These thresholds are manually defined to make the data look good
var color = d3.scale.threshold()
  .domain([.02, 1, 1.5, 2, 2.5,3])
  .range(["#000000", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);

d3.json("data/feedback_map.geojson", function(shape) {
fb_g.append("g")
  .attr("id", "districts")
  .selectAll("path")
    .data(shape.features)
  .enter().append("path")
    .attr("id",
      function(d) {
        // d['properties']['id']=d['properties']['NAME_3'];
        // d['properties']['level']='district';
        return d['properties']['District'];
      })
    .attr("class", "district")
    .attr("class", "active")
    .attr("d", fb_path)
    .style("fill", function (d) { return color(d.properties[question]) })
    .on("mousemove", update_tooltip)
    // using mouseover for fill is less painful than css hover bc
    // svgs for district/vdc are not hierarchal in the DOM
    .on("mouseover", update_fill)
    .on("mouseout", hide_tooltip)
    ;

});

function update_tooltip(d) {
  var prop;
  if (d.properties['VDC_NAME']) {
    prop = 'VDC_NAME';
  }
  if (d.properties['District']) {
    prop = 'District';
  }
  var mouse = d3.mouse(fb_svg.node()).map( function(d) { return parseInt(d); } );
  var display = d.properties[prop];

  if (d3.select(this).classed('active')) {
    fb_tooltip
      .classed("invisible", false)
      .attr("style", "left:"+(mouse[0])+"px;top:"+(mouse[1]+50)+"px")
      .html(d.properties['District']+'<br>'+d.properties[question]) //MOD VERSION
  }
  };

function update_fill(d){
  if (d3.select(this).classed('active')) {
    d3.select(this).style("fill", "#ffa")
  }
  };

function update_all(){
  d3.selectAll("path.active")
    .style("fill", function (d) { return color(d.properties[question]) })
  };

function hide_tooltip(d){
  fb_tooltip.classed("invisible", true);
  // let css rules determine fill color
  d3.select(this).style("fill", function (d) { return color(d.properties[question]) })
  };
