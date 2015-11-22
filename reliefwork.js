/**
 * Created by nick on 11/22/15.
 */



var width = 800,
    height = 500,
    centered,
    district
    ;
var question = document.querySelector('input[name = "question"]:checked').value;


function updateQuestion() {
    question = document.querySelector('input[name = "question"]:checked').value;
    update_all();
} ;

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tiptool");

var projection = d3.geo.mercator()
    // LONG, LAT
    .center([85.33, 27.70])
    // LONG, LAT, ROLL
    //.parallels([27.6, 28.3])
    .translate([width / 2, height / 1.5])
    .scale(4500);

var svg = d3.select("reliefwork")
  .append("svg")
    .attr("width", width)
    .attr("height", height);


var g = svg.append("g")
    .attr("id", "country");

var path = d3.geo.path()
    .projection(projection);

// These thresholds are manually defined to make the data look good
var color = d3.scale.threshold()
    .domain([.02, 1, 1.5, 2, 2.5,3])
    .range(["#000000", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);

d3.json("test.geojson", function(shape) {
  g.append("g")
    .attr("id", "districts")
    .selectAll("path")
      .data(shape.features)
    .enter().append("path")
      .attr("id",
        function(d) {
          console.log(d['properties']['District']);
          return d['properties']['District'];
        })
      .attr("class", "district")
      .attr("class", "active")
      .attr("d", path)
      .style("fill", function (d) {
        console.log(d.properties[question]);
        return color(d.properties[question]) })
      //.on("mousemove", update_tooltip)
      //// using mouseover for fill is less painful than css hover bc
      //// svgs for district/vdc are not hierarchal in the DOM
      //.on("mouseover", update_fill)
      //.on("mouseout", hide_tooltip)
      ////.on("click", click_district)
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
  var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
  var display = d.properties[prop];

  if (d3.select(this).classed('active')) {
    tooltip
      .classed("invisible", false)
      .attr("style", "left:"+(mouse[0]+15)+"px;top:"+(mouse[1]+20)+"px")
      .html(d.properties['District']+'<br>'+d.properties[question]) //MOD VERSION
  }
};

function update_fill(d){
  if (d3.select(this).classed('active')) {
    d3.select(this).style("fill", "#ffa")
  }
};

function update_all(){
  d3.selectAll("path")
    .style("fill", function (d) { return color(d.properties[question]) })
  };

function hide_tooltip(d){
  tooltip.classed("invisible", true);
  // let css rules determine fill color
  d3.select(this).style("fill", function (d) { return color(d.properties[question]) })
};