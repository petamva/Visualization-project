
var width = 1000,
    height = 700;

var data = { nodes: [{ genre: "Genre"},
            { genre: "Drama",target: [0, 1], count: 802,group: 0 },
            { genre: "Comedy", target: [0, 1, 2],count: 637,group: 0 },
            { genre: "Thriller", target: [0, 4,5],count: 371,group: 0 },
            { genre: "Action", target: [0, 10,14],count: 347 ,group: 0},
            { genre: "Romance",target: [0, 1,2,3,4,5,6], count: 239,group: 0 },
            { genre: "Adventure", target: [0, 15,16,17,18],count: 225 ,group: 0},
            { genre: "Crime", target: [0, 4,5,6,7],count: 194,group: 1 },
            { genre: "Science Fiction",target: [0,9,10,11,12], count: 160,group: 1 },
            { genre: "Horror",target: [0, 7,8,9], count: 183,group: 1 },
            { genre: "Family", target: [0, 4,2,8,19],count: 115 ,group: 1},
            { genre: "Fantasy", target: [0, 3,6,9],count: 109 ,group: 1},
            { genre: "Mystery",target: [0, 12,13,14,15,16], count: 85 ,group: 1},
            { genre: "Documentary",target: [0, 15], count: 39 ,group: 2},
            { genre: "Western",target: [0, 1,10,19,15], count: 31 ,group: 2},
            { genre: "Foreign",target: [0, 4,8,9], count: 2 ,group: 2},
            { genre: "Animation",target: [0, 1,3,5,7,9,13,15], count: 61 ,group: 2},
            { genre: "History",target: [0, 7,9,14,3], count: 60 ,group: 2},
            { genre: "Music",target: [0, 18,19,5,6], count: 54 ,group: 2},
            { genre: "War", target: [0, 8,9,7,6,14],count: 44,group: 2 }]
};

var radiusScale = d3.scaleSqrt() // <--New!
                    .domain([0, d3.max(data.nodes, function(d) { return d.count; })])
                    .range([20, 70]); // <--New!

var links = [];

for (var i = 0; i < data.nodes.length; i++){
    if (data.nodes[i].target !== undefined){
        for ( var x = 0; x < data.nodes[i].target.length; x++ )
            links.push({source: data.nodes[i], target: data.nodes[data.nodes[i].target[x]]});
    }
}


var colors = d3.scaleSequential(d3.interpolateTurbo).domain([0,19]);

// var nodes = [], labels = [],
//     foci = [{x: 0, y: 250}, {x: 400, y: 250}, {x: 200, y: 250}];

//.attr("domflag", '');

var force = d3.forceSimulation(data.nodes)
            .force("charge", d3.forceManyBody().strength(-100))
            .force("collide",d3.forceCollide().radius(60))
            .force("link", d3.forceLink(links).distance(50))
            .force("center", d3.forceCenter().x(width/2).y(height/2));

var svg1 = d3.select("#forceContainer")
            .append("svg")
            .attr("class","canvas")
            .attr("width", width)
            .attr("height", height);

var edges = svg1.selectAll("line")
            .data(links)
            .enter()
            .append("line")
            .style("stroke", "#ccc")
            .style("stroke-width", 1);


//Create nodes as circles


var nodes = svg1.selectAll("circle")
                .data(data.nodes)
                .enter()
                .append("g")
                .attr("class","node")
                .call(d3.drag()  //Define what to do on drag events
                .on("start", dragStarted)
                .on("drag", dragging)
                .on("end", dragEnded));

nodes.append("circle")
                // .attr("class","circle")
                .attr("r", function (d) {
                    if (d.count === undefined){
                        return 30;
                    }else
                        return radiusScale(d.count);
                })
                .style("fill", function(d, i) {
                    if (i>0){
                        return colors(i);
                    }else
                        return '#fff';
                })
                .attr('strokewidth', function(d,i){
                    if ( i > 0 ) {
                        return '1';
                    } else {
                        return '3';
                    }
                })
                .attr('stroke', function(d,i){
                    if ( i > 0 ) {
                        return 'black';
                    } else {
                        return 'black';
                    }
                });

nodes.append("text")
                .attr("class","labels")
                .text(function(d) { return d.genre })
                .attr("fill",function (d,i) {
                    if (i>0){
                        return "white";
                    }else
                        return "black";
                })
                .style("font-size", function(d,i) {
                    if (i>0){
                        return Math.min(2*radiusScale(d.count), (2*radiusScale(d.count)-9) / this.getComputedTextLength()*16) + "px";
                    }else
                        return Math.min(2*30, (2*30-8) / this.getComputedTextLength()*16) + "px";
                })
                .style("font-weight","bold")
                .attr("dy", ".35em")
                .attr("text-anchor","middle");


force.on("tick", function() {

    edges.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    nodes.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; });

    nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
});

//Define drag event functions
function dragStarted(d) {
    if (!d3.event.active) force.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragging(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragEnded(d) {
    if (!d3.event.active) force.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

