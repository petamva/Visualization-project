//Width and height

var margin = { left:50, right:100, top:50, bottom:100 };
var h1 = 650 - margin.top - margin.bottom;
var	w1 = 700 - margin.left - margin.right;
var flag = true;

var colors = [ 'rgb(189, 0, 38)','rgb(254, 217, 118)' ];
//Create SVG element

var svg1 = d3.select("#ratingContainer")
    .append("svg")
    .attr("class","canvas")
    .attr("width", w1 + margin.left + margin.right)
    .attr("height", h1 + margin.top + margin.bottom);

var g1 = svg1.append("g")
    .attr("class","barchart")
    .attr("transform", "translate(" + margin.left +", " + margin.top + ")");

// --------- X Axis Label
g1.append("text")
    .attr("class","x-axis label")
    .attr("x",w1/2)
    .attr("y",h1+65)
    .attr("font-size",24)
    .attr("text-anchor","middle")
    .text("Metascore");

//---------- Y Axis Label
const yLabel = g1.append("text")
    .attr("class","y-axis label")
    .attr("x",-h1/2)
    .attr("y",-30)
    .attr("font-size",24)
    .attr("text-anchor","middle")
    .attr("transform","rotate(-90)")
    .text("Rotten tomatoes (critics)");

d3.csv("ratings.csv",function (d) {
    return {
        title : d.movie,
        metascore : parseFloat(d.metascore),
        imdb : parseFloat(d.imdb),
        tmeter : parseFloat(d.tmeter),
        audience : parseFloat(d.audience)
    };
}).then(function(data){
    console.log(data);

    var xScale = d3.scaleLinear()
        .domain([0,10])
        .rangeRound([0, w1]);

    var yScale2=d3.scaleLinear()
        .domain([0,10])
        .range([150,0]);

    var yScale = d3.scaleLinear()
        .domain([0,10])
        .range([h1, 0]);

    var    xAxis = d3.axisBottom(xScale);

    var    yAxis = d3.axisLeft(yScale);


    var xAxisGroup =    g1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h1 + ")");

    xAxisGroup.call(xAxis)
        .selectAll("text")
        .attr("font-size",10);

    var yAxisGroup =  g1.append("g")
        .attr("class", "y axis");

    yAxisGroup.call(yAxis);

    //-----Color bar

    var colorBar = svg1.append('g')
        .attr("class","colorbar")
        .attr("transform", "translate(" + 630 +
            "," + 350 + ")");

    var    yAxis2 = d3.axisRight(yScale2);

    var yAxisGroup2 =  colorBar.append("g")
        .attr("class", "y axis 2");

    yAxisGroup2.call(yAxis2);

    var grad = colorBar.append('defs')
        .append('linearGradient')
        .attr('id', 'grad')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');

    grad.selectAll('stop')
        .data(colors)
        .enter()
        .append('stop')
        .style('stop-color', function(d){ return d; })
        .attr('offset', function(d,i){
            return 100 * (i / (colors.length - 1)) + '%';
        });

    colorBar.append('rect')
        .attr('x', -20)
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', 150)
        .style('fill', 'url(#grad)');

    colorBar.append("text")
        .attr("x", 23)
        .attr("y", 75)
        .attr("font-size",18)
        .text("IMDB");

    //Create circles
    var circles = g1.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return xScale(d.metascore);
        })
        .attr("cy", function(d) {
            return yScale(d.tmeter);
        })
        .style("fill",function (d) {
            return d3.interpolateYlOrRd(d.imdb/10)
        })
        .attr("r", 5)
        .on("mouseover", function(d) {
            d3.select("#tooltip")
                .style("left", 6.5*margin.left + "px")
                .style("top", 45*margin.top + "px")
                .select("#value")
                .text(d.title);
            //Show the tooltip
            d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout", function() {
            //Hide the tooltip
            d3.select("#tooltip").classed("hidden", true);
        });

d3.select("#meta-button")
        .on("click", function() {
            flag = !flag;
            var button = d3.select(this);
            if(!flag){
                button.text("Tomatometer");

                yLabel.text("Audiences");

                g1.selectAll("circle")
                    .data(data)
                    .transition()
                    .delay(200)
                    .duration(1000)
                    .attr("cx", function(d) {
                        return xScale(d.metascore);
                    })
                    .attr("cy", function(d) {
                        return yScale(d.audience);
                    })
                    .style("fill",function (d) {
                        return d3.interpolateYlOrRd(d.imdb/10)
                    })
                    .attr("r", 5);
            }else{
                button.text("Audiences");

                yLabel.text("Rotten tomatoes (critics)");

                g1.selectAll("circle")
                    .data(data)
                    .transition()
                    .delay(200)
                    .duration(1000)
                    .attr("cx", function(d) {
                        return xScale(d.metascore);
                    })
                    .attr("cy", function(d) {
                        return yScale(d.tmeter);
                    })
                    .style("fill",function (d) {
                        return d3.interpolateYlOrRd(d.imdb/10)
                    })
                    .attr("r", 5);
            }
        });
});


