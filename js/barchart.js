
var drawbarchart=function(content,selectedcity){
    console.log("drawchart");
    d3.select(content).selectAll('svg').remove();

    console.log("inside");

var margin = {top: 40, right: 50, bottom: 30, left:0};
var width = 500 - margin.left - margin.right;
var label_offset=150;
var chart_width=width-label_offset //150 is the padding to make room for the y axis labels
var height = 300 - margin.top - margin.bottom;
/*
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>"+d.city + ":</span>"+
        "<span style='color:red'>" + d.intensity + "</span>";
  })
*/
var svg_bar = d3.select(content).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

/*svg_bar.call(tip);

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
*/

d3.csv("data/cities.csv", type,
function(error, data) {

  var x = d3.scale.linear()
      .domain([0,d3.max(data, function(d) { return d.intensity; })])
      .range([0, chart_width]);

  var y = d3.scale.ordinal()
      .domain(data.map(function(d) {return d.city; }))
      .rangeRoundBands([0, height], .1);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

// y axis and label
svg_bar.append("g")
    .attr("class", "y magnitude_axis")
    .call(yAxis)
    .attr("transform", "translate("+label_offset+"," + 0 + ")");

// x axis and label
svg_bar.append("g")
    .attr("class", "x magnitude_axis")
    .call(xAxis)
    .attr("transform", "translate("+label_offset+"," + height + ")")
    .append("text")
    .attr("x", chart_width / 2)
    .attr("y", margin.bottom - 10)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Richter Scale Intensity");

// Add bars
  svg_bar.selectAll(".rectbar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "rectbar")
      .attr("x",150)
      .attr("y", function(d) {return y(d.city); })
      .attr("width", function(d) { return x(d.intensity); })
      .attr("height", 20)
      .attr("id",function(d){return d.id+"bar";})
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
      .call(d3.helper.tooltip()
          .attr("class","tooltip")
          .text(function(data, i){
              return ['<div class="hoverinfo">' +  data.city,
                  '<br/>Magnitude: ' +  data.intensity + ' Richter',
                  '<br/>Country: ' +  data.country + '',
                  '<br/>Date: ' +  data.date + '',
                  '</div>'].join('');}))

      .on('mouseover', function (d){
          var id=d.id;
          d3.select("#"+id+"circle").style("fill","red")
          d3.select(this).style("fill","red")
        })

      .on('mouseout', function (d){
          var id=d.id+"circle";
          var color= function(d) {if (id=='e10circle') {return d3.rgb('153','216','201')}
           else { return "steelblue" } };
          d3.select("#"+id).style("fill", color);
          d3.select(this).style("fill", color);
        });
});

  function type(d) {
    d.frequency = +d.intensity;
    return d;
  };



};// end of top-level function
