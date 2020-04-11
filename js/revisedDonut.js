
// var screenWidth = window.innerWidth;

var margin = {left: 20, top: 20, right: 20, bottom: 20},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg1 = d3.select("#donutContainer").append("svg")
                .attr("width", (width + margin.left + margin.right))
                .attr("height", (height + margin.top + margin.bottom))
                .append("g").attr("class", "wrapper")
                .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

var studioData = [
    {name: "Walt Disney",releases:571,gross:39.7,share:16.94},
    {name:"Warner Bros",releases:802,gross:35.6,share:15.19},
    {name:"Sony Pictures",releases:728,gross:28.8,share:12.28},
    {name:"Universal",releases:511,gross:27.5,share:11.72},
    {name:"20th Century Fox",releases:519,gross:25.85,share:11.03},
    {name:"Paramount",releases:481,gross:24.23,share:10.34}
];

//Create a color scale
var colorScale = d3.scaleLinear()
    .domain([1,3.5,6])
    .range(["#2c7bb6", "#ffffbf", "#d7191c"])
    .interpolate(d3.interpolateHcl);

//Create an arc function
var arc = d3.arc()
        .innerRadius(width*0.75/2)
        .outerRadius(width*0.75/2 + 30);

var popupArc = d3.arc()
    .innerRadius(width*0.75/2 - 5)
    .outerRadius(width*0.75/2 + 35);

//Turn the pie chart 90 degrees counter clockwise, so it starts at the left
var pie = d3.pie()
            .startAngle(-80 * Math.PI/180)
            .endAngle(-80 * Math.PI/180 + 2*Math.PI)
            .value(function(d) { return d.share; })
            .padAngle(.01)
            .sort(null);

//Create the donut slices and also the invisible arcs for the text
svg1.selectAll(".studioArcs")
    .data(pie(studioData))
    .enter().append("path")
    .attr("class", "studioArcs")
    .attr("d", arc)
    .style("fill", function(d,i) {
        return colorScale(i);
    })
    .on("mouseover", function(d) {
        d3.select(this).attr("d", function(d) {
            return popupArc(d);
        });
        var centerText = svg1.selectAll('.center').data([d]);
        centerText.enter()
            .append('text')
            .attr("class","center")
            .style("text-anchor","middle")
            .style("font-size",34)
            .style("font-weight","bold")
            .merge(centerText)
            .text( function(d) { return d.data.gross+"bn"});
    })
    .on("mouseout", function(d) {
        d3.select(this).attr("d", function (d) {
            return arc(d);
        });
        svg1.selectAll('.center').text("");
    })
    .each(function(d,i) {
        //Search pattern for everything between the start and the first capital L
        var firstArcSection = /(^.+?)L/;

        //Grab everything up to the first Line statement
        var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
        //Replace all the comma's so that IE can handle it
        newArc = newArc.replace(/,/g , " ");

        //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2)
        //flip the end and start position
        if (d.endAngle > 90 * Math.PI/180) {
            var startLoc 	= /M(.*?)A/,		//Everything between the first capital M and first capital A
                middleLoc 	= /A(.*?)0 0 1/,	//Everything between the first capital A and 0 0 1
                endLoc 		= /0 0 1 (.*?)$/;	//Everything between the first 0 0 1 and the end of the string (denoted by $)
            //Flip the direction of the arc by switching the start en end point (and sweep flag)
            //of those elements that are below the horizontal line
            var newStart = endLoc.exec( newArc )[1];
            var newEnd = startLoc.exec( newArc )[1];
            var middleSec = middleLoc.exec( newArc )[1];

            //Build up the new arc notation, set the sweep-flag to 0
            newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
        }

        //Create a new invisible arc that the text can flow along
        svg1.append("path")
            .attr("class", "hiddenStudioArcs")
            .attr("id", "studioArc"+i)
            .attr("d", newArc)
            .style("fill", "none");
    });

//Append the label names on the outside
svg1.selectAll(".studioText")
    .data(pie(studioData))
    .enter().append("text")
    .attr("class", "studioText")
    //Move the labels below the arcs for those slices with an end angle greater than 90 degrees
    .attr("dy", function(d,i) { return (d.endAngle > 90 * Math.PI/180 ? 18 : -11); })
    .append("textPath")
    .attr("startOffset","50%")
    .style("text-anchor","middle")
    .style("font-size",18)
    .style("font-weight","bold")
    .attr("xlink:href",function(d,i){return "#studioArc"+i;})
    .text(function(d){return d.data.name;});
