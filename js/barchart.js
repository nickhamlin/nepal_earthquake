
var drawbarchart=function(content,selectedcity){
    console.log("drawchart");
    d3.select(content).selectAll('svg').remove();

    console.log("inside");

var margin = {top: 40, right: 0, bottom: 30, left: 0},
    width = 800 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);
var y = d3.scale.linear()
    .range([height, 0]);
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>"+d.city + ":</span>"+
        "<span style='color:red'>" + d.intensity + "</span>";
  })

var svg_bar = d3.select(content).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg_bar.call(tip);

var tooltip = svg_bar.append("g")
  .attr("class", "tooltipbar")
  .style("display", "none");

tooltip.append("rect")
  .attr("width", 200)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 0)
  .attr("dy", "1.2em")
  .style("text-anchor", "right")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");




d3.csv("data/earthquake.csv", type, function(error, data) {
  x.domain(data.map(function(d) {
    return d.city; }));
  y.domain([0, d3.max(data, function(d) { return d.intensity; })]);

svg_bar.append("g")
    .attr("class", "y magnitude_axis")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2)
    .attr("y", -margin.left)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Intensity");

// x axis and label
svg_bar.append("g")
    .attr("class", "x magnitude_axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .append("text")
    .attr("x", width / 2)
    .attr("y", margin.bottom - 10)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("XAxis");

  svg_bar.selectAll(".rectbar")
      .data(data)
    .enter().append("rect")
      .attr("class", "rectbar")
      .attr("x", function(d) {
          return x(d.city); })
      .attr("width", 30)
      .attr("y", function(d) { return y(d.intensity); })
      .attr("height", function(d) { return height - y(d.intensity); })
      .style("fill", function(d) {
          if(d['city']==selectedcity && selectedcity!='2015 Nepal Earthquake')
        {
            return 'red';
        }
          else if(d['city']=='2015 Nepal Earthquake') {
              return d3.rgb('153', '216', '201');
          }

          else
              {
                  return 'steelblue';
              }


      })
    //.on("mouseover", function() {
    //    console.log("over");
    //    tooltip.style("display", null); })
    //  .on("mouseout", function() {
    //      console.log("out");
    //      tooltip.style("display", "none"); })
    //  .on("mousemove", function(d) {
    //      console.log("move");
    //    var xPosition = d3.mouse(this)[0] - 15;
    //    var yPosition = d3.mouse(this)[1] - 25;
    //    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
    //    tooltip.select("text").text(d.city+"-"+d.intensity);
    //  });
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)


});

function type(d) {
  d.frequency = +d.intensity;
  return d;
}



}
