// MAGNITUDE MAP ////////////////////


var width = 800,
    height = 500;

var projection = d3.geo.mercator()
    .center([0, 5 ])
    .scale(150)
    .rotate([-180,0]);

var svg = d3.select("#magnitude_id").append("svg")
    .attr("width", width)
    .attr("height", height);

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
        //function(d) {
        //        return d.radius;
        //    })
           .style("fill", function(d) {            // <== Add these
            if (d.country=='Nepal') {return d3.rgb('153','216','201')}  // <== Add these
            else    { return "steelblue" }          // <== Add these
        ;})
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


            .on('mouseover', function(d, i){ d3.select(this).style("fill", function(d) {            // <== Add these

                    console.log("!");
                if (d.country=='Nepal') {

                return d3.rgb('153','216','201');
            }  // <== Add these
            else
                {
                    return "red";
                 }          // <== Add these


            });
                drawbarchart("#magnitude_bar_id",d['city']);

            })
            .on('mouseout', function(d, i){ d3.select(this).style("fill", function(d) {            // <== Add these
                drawbarchart("#magnitude_bar_id",'2015 Nepal Earthquake');
                if (d.country=='Nepal') {

                return d3.rgb('153','216','201');
            }  // <== Add these
            else
                {
                    return "steelblue";
                 }
        }); })

    });


    g.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries)
            .geometries)
        .enter()
        .append("path")
        .attr("d", path)
});




// zoom and pan
//var zoom = d3.behavior.zoom()
//    .on("zoom",function() {
//        g.attr("transform","translate("+
//            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
//        g.selectAll("circle")
//            .attr("d", path.projection(projection));
//        g.selectAll("path")
//            .attr("d", path.projection(projection));
//    });
//svg.call(zoom)


// FEEDBACK MAP /////////////////////////////////////////


var fb_width = 500,
  fb_height = 350

var question_data;

d3.json("data/question_data.json", function(json) {
  question_data=json;
});

function updateQuestion() {
  question = document.querySelector('option:checked').value;
  //question_text= document.querySelector('option:checked').text;
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
  .center([86.7, 26.7])
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

d3.json("data/feedback_map_v2.geojson", function(shape) {
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


    // add legend
  	var legend = fb_svg.append("g")
  	  .attr("class", "legend")
  	  .attr("x", fb_width - 65)
  	  .attr("y", 25)
  	  .attr("height", 100)
  	  .attr("width", 100);

  	legend.selectAll('g').data(slices)
        .enter()
        .append('g')
        .each(function(d, i) {
          var g = d3.select(this);
          g.append("rect")
            .attr("x", fb_width - 65)
            .attr("y", i*25)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", "blue");

          g.append("text")
            .attr("x", w - 50)
            .attr("y", i * 25 + 8)
            .attr("height",30)
            .attr("width",100)
            .style("fill", "green")
            .text("poop");
          })
