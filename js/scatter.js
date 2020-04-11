//Width and height

var margin = { left:60, right:175, top:50, bottom:100 };
var hei = 600 - margin.top - margin.bottom;
var	wid = 800 - margin.left - margin.right;


//Create SVG element

var svg3 = d3.select("#allContainer")
            .append("svg")
            .attr("class","canvas")
            .attr("width", wid + margin.left + margin.right)
            .attr("height", hei + margin.top + margin.bottom);

var g3 = svg3.append("g")
            .attr("class","barchart")
            .attr("transform", "translate(" + margin.left +", " + margin.top + ")");

g3.append("clipPath")
            .attr("id", "chart-area")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", wid )
            .attr("height", hei);

// --------- X Axis Label
g3.append("text")
            .attr("class","x-axis label")
            .attr("x",wid/2)
            .attr("y",hei+45)
            .attr("font-size",24)
            .attr("text-anchor","middle")
            .text("Rating");

//---------- Y Axis Label
var yLabel2 = g3.append("text")
            .attr("class","y-axis label")
            .attr("x",-hei/2)
            .attr("y",-40)
            .attr("font-size",24)
            .attr("text-anchor","middle")
            .attr("transform","rotate(-90)")
            .text("Profit ($MM)");

d3.csv("dataClean.csv",function (d) {
    return {
            title : d.original_title,
            rating : parseFloat(d.vote_average),
            profit : parseFloat(d.profit),
            genre : d.genre,
            budget : parseFloat(d.budget),
            release : new Date(d.release_date)
    };
}).then(function(data) {
    console.log(data);

    dataFiltered = data.filter(function(d){
        return (d.release.getFullYear() >= 2014 && d.release.getFullYear() < 2017) && (d.rating>=3.5) && (d.profit>0);
        });

    var xScale = d3.scaleLinear()
        .domain([3.5, d3.max(dataFiltered,function (d) {
            return d.rating;
        })])
        .rangeRound([0, wid]);

    var yScale = d3.scaleLinear()
        .domain([0, 800])
        .range([hei, 0]);

    var radiusScale = d3.scaleSqrt() // <--New!
                .domain([0, d3.max(dataFiltered, function(d) {return d.budget; })])
                .range([2, 30]); // <--New!

    // var color = d3.scaleOrdinal(d3.interpolateRainbow);

    var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, 17));

    var    xAxis = d3.axisBottom(xScale);

    var    yAxis = d3.axisLeft(yScale);


    var xAxisGroup =    g3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + hei + ")");

    xAxisGroup.call(xAxis)
        .selectAll("text")
        .attr("font-size",10);

    var yAxisGroup =  g3.append("g")
        .attr("class", "y axis");

    yAxisGroup.call(yAxis);

//Create circles
    g3.append("g")
                .attr("id", "circles")
                .attr("clip-path", "url(#chart-area)")
                .selectAll("circle")
                .data(dataFiltered)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return xScale(d.rating);
                })
                .attr("cy", function(d) {
                    return yScale(d.profit);
                })
                .style("fill",function (d) {
                    return color(d.genre)
                })
                .attr("opacity",0.8)
                .attr("r", function (d) {
                    return radiusScale(d.budget);
                });

    d3.selectAll("#yearButton")
        .on("change", function () {
            t = d3.transition()
                .duration(500);

            year = +d3.select(this).node().value;

            genre = d3.select("#genreButton").node().value;

            dataNew = filterData(dataFiltered);

            var circles = g3.selectAll("circle")
                .data(dataNew);

            circles.exit()
                .remove();

            circles.enter()
                .append("circle")
                .merge(circles)
                .transition(t)
                .attr("clip-path", "url(#chart-area)")
                .attr("cx", function(d) {
                    return xScale(d.rating);
                })
                .attr("cy", function(d) {
                    return yScale(d.profit);
                })
                .style("fill",function (d) {
                    return color(d.genre)
                })
                .attr("opacity",0.8)
                .attr("r", function (d) {
                    return radiusScale(d.budget);
                });

        });

    d3.selectAll("#genreButton")
        .on("change", function () {

            genre = d3.select(this).node().value;

            year = +d3.select("#yearButton").node().value;

            dataNew = filterData(dataFiltered);

            var circles = g3.selectAll("circle")
                .data(dataNew);

            circles.exit()
                .remove();

            circles.enter()
                .append("circle")
                .merge(circles)
                .attr("clip-path", "url(#chart-area)")
                .attr("cx", function(d) {
                    return xScale(d.rating);
                })
                .attr("cy", function(d) {
                    return yScale(d.profit);
                })
                .style("fill",function (d) {
                    return color(d.genre)
                })
                .attr("opacity",0.8)
                .attr("r", function (d) {
                    return radiusScale(d.budget);
                });

        });
    var legends = svg3.append("g")
        .attr("class","legends")
        .attr("transform", "translate(" + (wid+1.8*margin.left)+", " + (hei/2+margin.top) + ")");

    legends.append("text")
        .attr("x",10)
        .attr("y",15)
        .style("text-anchor","middle")
        .style("color","black")
        .text("Budget");

    legends.append("circle")
        .attr("class","legendCircles")
        .attr("cx",1.3*margin.left)
        .attr("cy",-60)
        .attr("r",radiusScale(0))
        .attr("fill","none")
        .style("stroke","black")
        .style("stroke-width",1);

    legends.append("circle")
        .attr("class","legendCircles")
        .attr("cx",1.3*margin.left)
        .attr("cy",-35)
        .attr("r",radiusScale(d3.max(dataFiltered, function(d) {return d.budget; })/4))
        .attr("fill","none")
        .style("stroke","black")
        .style("stroke-width",1);

    legends.append("text")
        .attr("x",1.3*margin.left)
        .attr("y",-30)
        .style("text-anchor","middle")
        .style("color","black")
        .text("70");


    legends.append("circle")
        .attr("class","legendCircles")
        .attr("cx",1.3*margin.left)
        .attr("cy",10)
        .attr("r",radiusScale(d3.max(dataFiltered, function(d) {return d.budget; })/2))
        .attr("fill","none")
        .style("stroke","black")
        .style("stroke-width",1);

    legends.append("text")
        .attr("x",1.3*margin.left)
        .attr("y",15)
        .style("text-anchor","middle")
        .style("color","black")
        .text("140");

    legends.append("circle")
        .attr("class","legendCircles")
        .attr("cx",1.3*margin.left)
        .attr("cy",70)
        .attr("r",radiusScale(d3.max(dataFiltered, function(d) {return d.budget; })))
        .attr("fill","none")
        .style("stroke","black")
        .style("stroke-width",1);

    legends.append("text")
        .attr("x",1.3*margin.left)
        .attr("y",75)
        .style("text-anchor","middle")
        .style("color","black")
        .text("280");

});

function filterData(data){
    return data.filter(function(d){
        if (year===0 && genre==="all")
            return true;
        else if (year===0 && genre!=="all")
            return (d.genre===genre);
        else if (year!==0 && genre==="all")
            return (d.release.getFullYear() >= year) && (d.release.getFullYear() < year+1);
        else
            return ((d.release.getFullYear() >= year) && (d.release.getFullYear() < year+1)&&(d.genre===genre));
    });
}
