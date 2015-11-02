var width = 960,
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

