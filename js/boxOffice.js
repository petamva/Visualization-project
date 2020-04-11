
var margin = { left:100, right:100, top:75, bottom:75 };
var h = 500 - margin.top - margin.bottom;
var	w = 800 - margin.left - margin.right;


//Create SVG element

var svg2 = d3.select("#boxOfficeContainer")
            .append("svg")
            .attr("class","canvas")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom);

var g2 =svg2.append("g")
            .attr("class","boxOfficeChart")
            .attr("transform", "translate(" + margin.left +", " + margin.top + ")");

// --------- X Axis Label
svg2.append("text")
                .attr("class","x-axis label")
                .attr("x",400)
                .attr("y",475)
                .attr("font-size",22)
                // .attr("font-style","italic")
                .attr("text-anchor","middle")
                .text("Year");

//---------- Y Axis Left Label
var yLabelLeft = svg2.append("text")
                .attr("class","left y-axis label")
                .attr("x",-h/1.5)
                .attr("y",25)
                .attr("font-size",22)
                // .attr("font-style","italic")
                .attr("text-anchor","middle")
                .attr("transform","rotate(-90)")
                .text("Tickets sold");

//---------- Y Axis Right Label

var yLabelRight = svg2.append("text")
                .attr("class","right y-axis label")
                .attr("x",-h/1.5)
                .attr("y",780)
                .attr("font-size",22)
                // .attr("font-style","italic")
                .attr("text-anchor","middle")
                .attr("transform","rotate(-90)")
                .text("Box Office");

var legend = g2.append("g");

var splitLines = [[2,12],[1.5,9],[1,6],[0.5,3]];

splitLines.forEach(function(d,i){
    var splitLine = legend.append("g")
        .attr("transform", "translate(0, " + i*h/4 + ")");

    splitLine.append("line")
        .attr("x1", 0)
        .attr("x2", w)
        .attr("y1", 0)
        .attr("y2", 0)
        .attr("stroke-width",1)
        .attr("stroke","grey");

    splitLine.append("text")
        .attr("x", -25)
        .attr("y", 3)
        .attr("text-anchor","middle")
        .text(d[0]+"bn");

    splitLine.append("text")
        .attr("x", w+25)
        .attr("y", 3)
        .attr("text-anchor","middle")
        .text("$"+d[1]+"bn");

});

d3.tsv("boxOffice.tsv",function (d) {
    return {
        year : Date.parse(d.Year),
        tickets : parseFloat(d.Tickets_Sold),
        boxOffice : parseFloat(d.Box_Office)
    };
}).then(function(data) {
    console.log(data);

    var xScale = d3.scaleTime()
        .domain([Date.parse(1994),Date.parse(2021)])
                // .domain([d3.min( data, function(d) { return d.year; }),
                //     d3.max( data, function(d) { return d.year; })])
                .rangeRound([0, w]);


    var yScaleLeft = d3.scaleLinear()
                .domain([0,2])
                .range([h, 0]);

    var yScaleRight = d3.scaleLinear()
                .domain([0,12])
                .range([h, 0]);

    var    xAxis = d3.axisBottom(xScale);

    var xAxisGroup =    g2.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + h + ")");

    xAxisGroup.call(xAxis);

    //Define line generator
    var boxOffice = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScaleRight(d.boxOffice); });

    var tickets = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScaleLeft(d.tickets); });
//Create line
    g2.append("path")
        .datum(data)
        .attr("class", "box office line")
        .attr("id", "blueLine")
        .attr("d", boxOffice)
        .attr("stroke","blue")
        .attr("stroke-width",2)
        .attr("fill","none");

    g2.append("path")
        .datum(data)
        .attr("class", "ticket line")
        .attr("id", "redLine")
        .attr("d", tickets)
        .attr("stroke","red")
        .attr("stroke-width",2)
        .attr("fill","none");

//-----Legends

    var blueLegend = svg2.append("g")
        .attr("class","blueLegend")
        .attr("transform", "translate(" + 100 +
            "," + 10 + ")");

    blueLegend.append("text")
        .attr("text-anchor", "start")
        .attr("x",70)
        .attr("y",5)
        .style("fill", "blue")
//         .on("click", function(){
// // determine if current line is visible
//             var active = blueLine.active ? false : true,
//                 newOpacity = active ? 0 : 1;
// // hide or show the elements
//             d3.select("#redLine").style("opacity", newOpacity);
// // update whether or not the elements are active
//             blueLine.active = active;
//         })
        .on("mouseover",function () {
            d3.select("#redLine").style("opacity",0)
        })
        .on("mouseout",function(){
            d3.select("#redLine").style("opacity",1)
        })
        .text("Box-office");

    blueLegend.append("line")
        .attr("x1", 10)
        .attr("x2", 68)
        .attr("y1", 2)
        .attr("y2", 2)
        .attr("stroke-width",2)
        .attr("stroke","blue");

    var redLegend = svg2.append("g")
        .attr("class","redLegend")
        .attr("transform", "translate(" + 100 +
            "," + 35 + ")");

    redLegend.append("text")
        .attr("text-anchor", "start")
        .attr("x",70)
        .attr("y",5)
        .style("fill", "red")
//         .on("click", function(){
// // determine if current line is visible
//             var active = redLine.active ? false : true,
//                 newOpacity = active ? 0 : 1;
// // hide or show the elements
//             d3.select("#blueLine").style("opacity", newOpacity);
// // update whether or not the elements are active
//             redLine.active = active;
//         })
        .on("mouseover",function () {
            d3.select("#blueLine").style("opacity",0)
        })
        .on("mouseout",function(){
            d3.select("#blueLine").style("opacity",1)
        })
        .text("Tickets");

    redLegend.append("line")
        .attr("x1", 10)
        .attr("x2", 68)
        .attr("y1", 2)
        .attr("y2", 2)
        .attr("stroke-width",2)
        .attr("stroke","red");


});