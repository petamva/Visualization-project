
var margin = { left:50, right:50, top:50, bottom:100 };
var h = 500 - margin.top - margin.bottom;
var	w = 700 - margin.left - margin.right;

//Create SVG element

var svg3 = d3.select("#releasesContainer")
            .append("svg")
            .attr("class","canvas")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom);

var g3 =    svg3.append("g")
            .attr("class","releasesChart")
            .attr("transform", "translate(" + margin.left +", " + margin.top + ")");

// --------- X Axis Label
g3.append("text")
                .attr("class","x-axis label")
                .attr("x",w/2)
                .attr("y",h+50)
                .attr("font-size",24)
                .attr("text-anchor","middle")
                .text("Year");

//---------- Y Axis Label
var yLabel = g3.append("text")
                .attr("class","y-axis label")
                .attr("x",-h/2)
                .attr("y",-33)
                .attr("font-size",24)
                .attr("text-anchor","middle")
                .attr("transform","rotate(-90)")
                .text("Releases");


d3.tsv("studios.tsv",function (d) {
    return {
        year : new Date(d.Year),
        big6 : parseInt(d.Total_Major_6),
        other : parseInt(d.Total_Other_Studios)
    };
}).then(function(data) {
        console.log(data);

    var xScale = d3.scaleTime()
        .domain([d3.min( data, function(d) { return d.year; }),
                d3.max( data, function(d) { return d.year; })])
        .rangeRound([0, w]);


    var yScale = d3.scaleLinear()
        .domain([0,d3.max( data, function(d) { return d.big6; })+25])
        .range([h, 0]);

    var    xAxis = d3.axisBottom(xScale);
                    // .tickSize(10);
                    // .tickSizeOuter(10);
                    // .tickSizeInner(value);

    var    yAxis = d3.axisLeft(yScale);

    var xAxisGroup =    g3.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + h + ")");

    xAxisGroup.call(xAxis)
                    .selectAll("text")
                    .attr("font-size",10);

    var yAxisGroup =  g3.append("g")
                    .attr("class", "y axis");

    yAxisGroup.call(yAxis);

    //Define line generator
    var bigStudios = d3.line()
                .x(function(d) { return xScale(d.year); })
                .y(function(d) { return yScale(d.big6); });

    var restStudios = d3.line()
                    .x(function(d) { return xScale(d.year); })
                    .y(function(d) { return yScale(d.other); });

    g3.selectAll(".bigStudioDots")
        .data(data)
        .enter().append("circle")
        .attr("class","bigStudioDots")
        .attr("r", 5)
        .attr("cx", function(d) { return xScale(d.year); })
        .attr("cy", function(d) { return yScale(d.big6); })
        .style("fill","blue")
        .on("mouseover",function (d) {
            d3.select(this).attr("r",15)
                .style("stroke","blue")
                .style("fill","lightblue");

                g3.append("text")
                    .attr("id", "tooltip")
                    .attr("text-anchor", "left")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "13px")
                    .attr("font-weight", "bold")
                    .attr("fill", "black")
                    .attr("x", function(){
                        return xScale(d.year)-15
                    })
                    .attr("y", function(){
                        return yScale(d.big6)-30
                    })
                    .append('svg:tspan')
                    .text(function() { return "Year:" + d.year.getFullYear(); })
                    .append('svg:tspan')
                    .attr('x', function(){
                        return xScale(d.year)-15
                    })
                    .attr('dy', 12)
                    .text(function() { return "Releases:" + d.big6; });
        })
        .on("mouseout",function () {
            d3.select(this).attr("r",5)
                .style("stroke","none")
                .style("fill","blue");
            d3.select("#tooltip").remove();
        });

    g3.selectAll(".restStudioDots")
        .data(data)
        .enter().append("circle")
        .attr("class","restStudioDots")
        .attr("r", 5)
        .attr("cx", function(d) { return xScale(d.year); })
        .attr("cy", function(d) { return yScale(d.other); })
        .style("fill","red")
        .on("mouseover",function (d) {
            d3.select(this).attr("r",15)
                .style("stroke","red")
                .style("fill","pink");

            g3.append("text")
                .attr("id", "tooltip")
                .attr("text-anchor", "left")
                .attr("font-family", "sans-serif")
                .attr("font-size", "13px")
                .attr("font-weight", "bold")
                .attr("fill", "black")
                .attr("x", function(){
                    return xScale(d.year)-15
                })
                .attr("y", function(){
                    return yScale(d.other)-30
                })
                .append('svg:tspan')
                .text(function() { return "Year:" + d.year.getFullYear(); })
                .append('svg:tspan')
                .attr('x', function(){
                    return xScale(d.year)-15
                })
                .attr('dy', 12)
                .text(function() { return "Releases:" + d.other; });
        })
        .on("mouseout",function () {
            d3.select(this).attr("r",5)
                .style("stroke","none")
                .style("fill","red");
            d3.select("#tooltip").remove();
        });

//Create line
    g3.append("path")
                .datum(data)
                .attr("class", "line big6")
                .attr("d", bigStudios)
                .attr("stroke","blue")
                .attr("stroke-width",2)
                .attr("fill","none");



    g3.append("path")
                .datum(data)
                .attr("class", "line restStudios")
                .attr("d", restStudios)
                .attr("stroke","red")
                .attr("stroke-width",2)
                .attr("fill","none");

    //-----Legends

    var blueLeg = svg3.append("g")
        .attr("class","blueLegend")
        .attr("transform", "translate(" + 500 +
            "," + 50 + ")");

    blueLeg.append("text")
        .attr("text-anchor", "start")
        .attr("x",72)
        .attr("y",5)
        .style("fill", "blue")
        .text("Big 6");

    blueLeg.append("line")
        .attr("x1", 10)
        .attr("x2", 68)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke-width",2)
        .attr("stroke","blue");

    var redLeg = svg3.append("g")
        .attr("class","redLegend")
        .attr("transform", "translate(" + 500 +
            "," + 75 + ")");

    redLeg.append("text")
        .attr("text-anchor", "start")
        .attr("x",72)
        .attr("y",5)
        .style("fill", "red")
        .text("Rest studios");

    redLeg.append("line")
        .attr("x1", 10)
        .attr("x2", 68)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke-width",2)
        .attr("stroke","red");

});