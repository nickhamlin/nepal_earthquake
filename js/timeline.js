//$("timeline").empty();

function wordCloud(selector) {
    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", 700)
        .attr("height", 500)
        .append("g").attr("class","tagcloud")
        .attr("transform", "translate(250,250)");


    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
            .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
//                    .duration(600)
            .style("font-size", function(d) { return d.size+5 + "px"; })
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
            d3.layout.cloud().size([800, 500])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size+3; })
                .on("end", draw)
                .start();
        }
    }

}

//Prepare one of the sample sentences by removing punctuation,
// creating an array of words and computing a random size attribute.
function getWords(i) {
    var xhReq = new XMLHttpRequest();
    if(i==1) {
        // Todo: change to s3 location
        xhReq.open("GET", "data/tweet_1.json", false);
        xhReq.send(null);
    }
    else if(i==2){
        xhReq.open("GET", "data/tweet_2.json", false);
        xhReq.send(null);

    }
    else if(i==3){
        xhReq.open("GET", "data/tweet_3.json", false);
        xhReq.send(null);

    }
    else if(i==4){
        xhReq.open("GET", "data/tweet_4.json", false);
        xhReq.send(null);

    }
    else if(i==5){
        xhReq.open("GET", "data/tweet_5.json", false);
        xhReq.send(null);

    }
    else if(i==6){
        xhReq.open("GET", "data/tweet_6.json", false);
        xhReq.send(null);

    }
    else if(i==7){
        xhReq.open("GET", "data/tweet_7.json", false);
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
