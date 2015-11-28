// Set our margins
var margin = {
    top: 20,
    right: 170,
    bottom: 30,
    left: 30
    },
    width = 960 - margin.left - margin.right, //we may want to play with the size on this later
    height = 500 - margin.top - margin.bottom;

// Our X scale
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2); //had to expand padding to get lines to show up

// Our Y scale
var y = d3.scale.linear()
    .rangeRound([height, 0]);

// Our color bands
var color = d3.scale.ordinal()
    .range([ "#99C68E", "#C77E36", "#EAEAEA", "#43BFC7", "#357EC7"]);

// Use our X scale to set a bottom axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// Smae for our left axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

// Add our chart to the document
var svg = d3.select("response").append("svg") //changed to "response" container
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var lineSvg = svg.append("g");

var focus = svg.append("g")
    .style("display", "none");

// Fetch data
d3.csv("data/NepalTotalFundingMatrixPos.csv", function (data) {
    // Make sure our numbers are really numbers
    data.forEach(function (d) {
        d.Cash = +d.Cash;
        d.Labor = +d.Labor;
        d.MedicalAid = +d.MedicalAid;
        d.NonFoodItems = +d.NonFoodItems;
        d.Shelter = +d.Shelter;
        });

    //console.log(data[0]);

    // Use our values to set our color bands
    color.domain(d3.keys(data[0]).filter(function (key) {
        return (key !== "year" && key !== "TotalFunding");
        }));

    data.forEach(function (d) {
        var y0 = 0;
        d.types = color.domain().map(function (name) {
            return {
                name: name,
                y0: y0,
                y1: y0 += +d[name]
            };
        });
        d.total = d.types[d.types.length - 1].y1;
        });

    //console.log(data[12]);  //prints first record in console

    // Our X domain is our set of years
    x.domain(data.map(function (d) {
        return d.year;
        }));

    // Our Y domain is from zero to our highest total
    y.domain([0, 450000000]);

     svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.7em")
          .attr("dy", "-.7em")
          .attr("transform", "rotate(-90)" );

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Cumulative Aid Distributed (USD)");

    var year = svg.selectAll(".year")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function (d) {
        return "translate(" + x(d.year) + ",0)";
        });

    year.selectAll("rect")
        .data(function (d) {
        return d.types;
        })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function (d) {
        return y(d.y1);
        })
        .attr("height", function (d) {
        return y(d.y0) - y(d.y1);
        })
        .style("fill", function (d) {
        return color(d.name);
        });


    var area = d3.svg.area()  //make sure there is white fill under value line
        .x(function(d) { return x(d.year); })
        .y0(function(d) { return y(d.total); })
        .y1(function(d) { return y(d.TotalFunding); });

    var valueline = d3.svg.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(d.TotalFunding); });

    lineSvg.append("path")  //make sure there is white fill under value line
            .datum(data)
            .attr("class", "area")
            .attr("class", "response") //added to avoid path style conflicts
            .attr("d", area);

    lineSvg.append("path")      // Add the valueline path.
        .attr("class", "line")
        .attr("class", "response") //added to avoid path style conflicts
        .style("stroke", "#3B3B3B")
        .attr("d", valueline(data));


    lineSvg.append("text")
        .attr("transform", "translate(" + (width-115) + "," + (y(data[121].TotalFunding)-10) + ")")
        .attr("dy", ".5em")
        .attr("text-anchor", "start")
        .style("fill", "#3B3B3B")
        .style("font", "11px helvetica")
        .text("Total Funding Pledged");


    var legend = svg.selectAll(".legend")
        .data(color.domain().slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", 40)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", 60)
        .attr("y", 13)
        .style("font", "11px helvetica")
        .text(function (d) {
        return d;
        });


   // append the x line
    focus.append("line")
        .attr("class", "x")
        .style("stroke", "#3B3B3B")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("y1", 0)
        .attr("y2", height);

    // append the y line
    focus.append("line")
        .attr("class", "y")
        .style("stroke", "#3B3B3B")
        .style("stroke-dasharray", "3,3")
        .style("opacity", 0.5)
        .attr("x1", width)
        .attr("x2", width);

    // append the circle at the intersection
    focus.append("circle")
        .attr("class", "y")
        .style("fill", "none")
        .style("stroke", "#3B3B3B")
        .attr("r", 4);


    // place the date at the intersection
    focus.append("text")
        .attr("class", "y3")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 1)
        .attr("dx", 8)
        .attr("dy", "1em");
    focus.append("text")
        .attr("class", "y4")
        .attr("dx", 8)
        .attr("dy", "1em")
        .style("font", "11px georgia")
        .style("font-weight", "bold")
        .style("fill", "#202020");

    // place the value at the intersection
    focus.append("text")
        .attr("class", "y1")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 1)
        .attr("dx", 8)
        .attr("dy", "2.6em");
    focus.append("text")
        .attr("class", "y2")
        .attr("dx", 8)
        .attr("dy", "2.6em")
        .style("font", "11px georgia")
        .style("fill", "#202020");

    // place the Cash value at the intersection
    focus.append("text")
        .attr("class", "y5")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 1)
        .attr("dx", 8)
        .attr("dy", "4.2em");
    focus.append("text")
        .attr("class", "y6")
        .attr("dx", 8)
        .attr("dy", "4.2em")
        .style("font", "11px georgia")
        .style("fill", "#202020");

    // place the Labor value at the intersection
    focus.append("text")
        .attr("class", "y7")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 1)
        .attr("dx", 8)
        .attr("dy", "5.8em");
    focus.append("text")
        .attr("class", "y8")
        .attr("dx", 8)
        .attr("dy", "5.8em")
        .style("font", "11px georgia")
        .style("fill", "#202020");

    // place the Medical Aid value at the intersection
    focus.append("text")
        .attr("class", "y9")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 1)
        .attr("dx", 8)
        .attr("dy", "7.4em");
    focus.append("text")
        .attr("class", "y10")
        .attr("dx", 8)
        .attr("dy", "7.4em")
        .style("font", "11px georgia")
        .style("fill", "#202020");

    // place the Non Food Items value at the intersection
    focus.append("text")
        .attr("class", "y11")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 1)
        .attr("dx", 8)
        .attr("dy", "9.1em");
    focus.append("text")
        .attr("class", "y12")
        .attr("dx", 8)
        .attr("dy", "9.1em")
        .style("font", "11px georgia")
        .style("fill", "#202020");

    // place the Shelter value at the intersection
    focus.append("text")
        .attr("class", "y13")
        .style("stroke", "white")
        .style("stroke-width", "3.5px")
        .style("opacity", 1)
        .attr("dx", 8)
        .attr("dy", "10.9em");
    focus.append("text")
        .attr("class", "y14")
        .attr("dx", 8)
        .attr("dy", "10.9em")
        .style("font", "11px georgia")
        .style("fill", "#202020");


    // append the rectangle to capture mouse
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var i = d3.mouse(this)[0]
            var leftEdges = x.range();
            var width = x.rangeBand();
            var j;
            for(j=0; i > (leftEdges[j] + width); j++) {}
                //do nothing, just increment j until case fails
            d = data[j];


        focus.select("circle.y")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")");

        focus.select("text.y1")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Total Funding: $" + Math.round(d.TotalFunding/1000000) + " M");

        focus.select("text.y2")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Total Funding: $" + Math.round(d.TotalFunding/1000000) + " M");

        focus.select("text.y3")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Date: " + d.year);

        focus.select("text.y4")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Date: " + d.year);

        focus.select("text.y5")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Cash Aid: $" + Math.round(d.Cash/100000)/10 + " M");

        focus.select("text.y6")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Cash Aid: $" + Math.round(d.Cash/100000)/10 + " M");

        focus.select("text.y7")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Labor Aid: $" + Math.round(d.Labor/100000)/10 + " M");

        focus.select("text.y8")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Labor Aid: $" + Math.round(d.Labor/100000)/10 + " M");

        focus.select("text.y9")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Medical Aid: $" + Math.round(d.MedicalAid/100000)/10 + " M");

        focus.select("text.y10")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Medical Aid: $" + Math.round(d.MedicalAid/100000)/10 + " M");

        focus.select("text.y11")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Non Food Item Aid: $" + Math.round(d.NonFoodItems/100000)/10 + " M");

        focus.select("text.y12")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Non Food Item Aid: $" + Math.round(d.NonFoodItems/100000)/10 + " M");

        focus.select("text.y13")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Shelter Aid: $" + Math.round(d.Shelter/100000)/10 + " M");

        focus.select("text.y14")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
            .text("Shelter Aid: $" + Math.round(d.Shelter/100000)/10 + " M");

        focus.select(".x")
            .attr("transform",
                  "translate(" + x(d.year) + "," +
                                 y(d.TotalFunding) + ")")
                       .attr("y2", height - y(d.TotalFunding));

        focus.select(".y")
            .attr("transform",
                  "translate(" + width * -1 + "," +
                                 y(d.TotalFunding) + ")")
                       .attr("x2", width + width);
    }

});
