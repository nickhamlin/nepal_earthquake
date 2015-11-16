var width = 960,
    height = 500,
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

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tiptool");
/*
var controls = d3.select("body")
  .append("div")
  .attr("class", "controls")
    .append("a")
      .attr("id", "reset")
      .attr("class", "invisible")
      .attr("href", "#")
      .text("reset")
      .on("click", click_reset);
*/
var svg = d3.select("#map")
  .append("svg")
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g")
    .attr("id", "country");

var projection = d3.geo.mercator()
    // LONG, LAT
    .center([85.33, 27.70])
    // LONG, LAT, ROLL
    //.parallels([27.6, 28.3])
    .translate([width / 2, height / 1.5])
    .scale(4500);

var path = d3.geo.path()
    .projection(projection);

// These thresholds are manually defined to make the data look good
var color = d3.scale.threshold()
    .domain([.02, 1, 1.5, 2, 2.5,3])
    .range(["#000000", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);

d3.json("feedback.geojson", function(shape) {
  g.append("g")
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
      .attr("d", path)
      .style("fill", function (d) { return color(d.properties[question]) })
      .on("mousemove", update_tooltip)
      // using mouseover for fill is less painful than css hover bc
      // svgs for district/vdc are not hierarchal in the DOM
      .on("mouseover", update_fill)
      .on("mouseout", hide_tooltip)
      //.on("click", click_district)
      ;

});

// preload vdcs
/*
d3.json("nepal_vdc.json", function(error, shape) {
  g.append("g")
    .attr("id", "vdcs")
    .attr("class", "invisible")
    .selectAll("path")
      .data(shape.features)
    .enter()
      .append("path")
        .attr("id", function(d) {d['properties']['id']=d['properties']['VDC_NAME']; d['properties']['level']='vdc'; return d.properties['VDC_NAME']; })
        .attr("class", function(d) {
            return "vdc lighten " + d.properties['VDC_NAME'];
          })
        .attr("d", path)
    .on("mousemove", update_tooltip)
    .on("mouseover", update_fill)
    .on("mouseout", hide_tooltip);
});

function update_vdcs(xyz) {
  g.selectAll(["#districts"]).classed("invisible", true);
  g.select("#vdcs").classed("invisible", false);
  g.selectAll(".vdc")
    .attr("class", function(v) {
      if (v.properties['DIST_NAME'] == district.properties['NAME_3']) {
        return "vdc active " + v.properties['DIST_NAME'];
      } else {
        return "vdc lighten " + v.properties['DIST_NAME'];
      }})
  zoom(xyz);
}


function click_district(d) {
  vdc = null;
  tooltip.classed("invisible", true)
  controls.classed("invisible", false)
  if (district) {
    g.selectAll("#" + district.properties['NAME_3']).style('display', null);
  }
  if (d && district !== d) {
    var xyz = get_xyz(d);
    district = d;
    if (d['properties']['level']  == 'district') {
      update_vdcs(xyz);
    } else {
      zoom(xyz);
    }
  } else {
    var xyz = [width / 2, height / 2, 1];
    district = null;
    zoom(xyz);
  }
}

*/
/*
function click_reset(d) {
    vdc = null;
    district = null;
    controls.classed("invisible", true)
    g.selectAll(["#districts", "#vdcs"]).classed("active", false)
    g.selectAll("#districts").classed('invisible', false)
    g.selectAll(["#vdcs"]).classed('invisible', true)
    var xyz = [width / 2, height / 1.5, 1];
    zoom(xyz);
}
*/
/*
function zoom(xyz) {
  g.transition()
    .duration(1250)
    .attr("transform", "translate(" + projection.translate() + ")scale(" + xyz[2] + ")translate(-" + xyz[0] + ",-" + xyz[1] + ")")
    .selectAll(["#districts", "#vdcs"])
    .style("stroke-width", 1.0 / xyz[2] + "px")
}

function get_xyz(d) {
  var bounds = path.bounds(d);
  var w_scale = (bounds[1][0] - bounds[0][0]) / width;
  var h_scale = (bounds[1][1] - bounds[0][1]) / height;
  var z = .96 / Math.max(w_scale, h_scale);
  var x = (bounds[1][0] + bounds[0][0]) / 2;
  var y = (bounds[1][1] + bounds[0][1]) / 2 + (height / z / 6);
  return [x, y, z];
}
*/
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
