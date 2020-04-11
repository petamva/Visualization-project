
var movieData = {
    "name": "2014",
    "children": [
        {   "name": "movie",
            "children": [ {"name":"Animation",
                "children":[
                    {"name": "Lego", "size": 10},
                    {"name": "Rio 2", "size": 10},
                    {"name": "Twenty-Eight Hits for Laughs", "size": 10}
                ]} ,
                {"name":"Comedy",
                    "children":[
                        {"name": "Queen", "size": 10},
                        {"name": "Mr. Peabody & Sherman", "size": 10},
                        {"name": "Grand Budapest Hotel", "size": 10},
                        {"name": "Ride Along", "size": 10},
                        {"name": "Vampire Academy", "size": 10},
                        {"name": "Camp Takota", "size": 10},
                        {"name": "The Hungover Games", "size": 10},
                    ]},
                {"name":"Action",
                    "children":[
                        {"name": "300: Rise of an Empire", "size": 10},
                        {"name": "RoboCop", "size": 10},
                        {"name": "Spider-Man 2: Rise of Electro", "size": 10},
                        {"name": "Non-Stop", "size": 10},
                        {"name": "Planet of the Apes: Dawn", "size": 10},
                        {"name": "Gunday", "size": 10},
                        {"name": "Come, let's love", "size": 10},
                    ]} ,
                {"name":"Mystery",
                    "children":[{"name":"Jack Ryan: Shadow Recruit","size":10}]} ,
                {"name":"Crime",
                    "children":[{"name":"The Raid 2: Berandal","size":10},
                        {"name":"Killers","size":10},
                        {"name":"Reasonable Doubt","size":10}]} ,
                {"name":"Drama",
                    "children":[{"name":"Need for Speed","size":10},
                        {"name":"Winter's Tale","size":10},
                        {"name":"Pompei 3D","size":10},
                        {"name":"The Search","size":10},
                        {"name":"God's Not Dead","size":10},
                        {"name":"Turks & Caicos","size":10},
                        {"name":"Son of God","size":10},
                        {"name":"The Ninth Cloud","size":10}]} ,
                {"name":"Fantasy",
                    "children":[{"name":"Kiki's Delivery Service","size":10}]},
                {"name":"Romance",
                    "children":[{"name":"Highway","size":10},
                        {"name":"Beauty and the Beast","size":10},
                        {"name":"I am your hero","size":10}]} ,
                {"name":"Documentary",
                    "children":[{"name":"The Oscars","size":10}]},
                {"name":"Family",
                    "children":[{"name":"Swan Princess: A Royal Family Tale","size":10}]},
                {"name":"Adventure",
                    "children":[{"name":"The Return of the First Avenger","size":10},
                        {"name":"TinkerBell and the Pirate Fairy","size":10},
                        {"name":"Justice League: War","size":10}]}
            ]
        },
        {"name": "tv show",
            "children": [ {"name":"RealityTV",
                "children":[{"name": "71st Golden Globe Awards", "size": 10}]},
                {"name":"Crime",
                    "children":[{"name": "Gomorra", "size": 10}]},
                {"name":"Mystery",
                    "children":[{"name": "True Detective", "size": 10}]},
                {"name":"Fantasy",
                    "children":[{"name": "Resurrection", "size": 10}]},
                {"name":"Action",
                    "children":[{"name": "Intelligence", "size": 10}]} ,
                {"name":"SciFi",
                    "children":[{"name": "Helix", "size": 10},
                        {"name": "The After", "size": 10}]} ,
                {"name":"Drama",
                    "children":[{"name": "Fargo", "size": 10}]} ,
                {"name":"Comedy",
                    "children":[{"name": "Taxi Brooklyn", "size": 10},
                        {"name": "Popeye the Sailor", "size": 10}]} ,
                {"name":"Music",
                    "children":[{"name": "2014 MTV Movie Awards", "size": 10}]}

            ]

        }
    ]
};

// Set the dimensions and margins of the diagram
var margin = {top: 20, right: 90, bottom: 30, left: 90},
    width1 = 960 - margin.left - margin.right,
    height1 = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg3 = d3.select("#treeContainer").append("svg")
    .attr("width", width1 + margin.right + margin.left)
    .attr("height", height1 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("
        + margin.left + "," + margin.top + ")");

var i = 0,
    duration = 750,
    root3;

// declares a tree layout and assigns the size
var treemap = d3.tree().size([height1, width1]);

// Assigns parent, children, height, depth
root3 = d3.hierarchy(movieData, function(d) { return d.children; });
root3.x0 = height1 / 2;
root3.y0 = 0;

// Collapse after the second level
root3.children.forEach(collapse);

update(root3);

// Collapse the node and all it's children
function collapse(d) {
    if(d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null
    }
}

function update(source) {

    // Assigns the x and y position for the nodes
    var movieData = treemap(root3);

    // Compute the new tree layout.
    var nodes = movieData.descendants(),
        links = movieData.descendants().slice(1);

    // Normalize for fixed-depth.
    nodes.forEach(function(d){ d.y = d.depth * 180});

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = svg3.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

    // Add Circle for the nodes
    nodeEnter.append('circle')
        .attr('class', 'node')
        .attr('r', 1e-6)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    // Add labels for the nodes
    nodeEnter.append('text')
        .attr("dy", ".35em")
        .attr("x", function(d) {
            return d.children || d._children ? -13 : 13;
        })
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) { return d.data.name; });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
        .attr('r', 10)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        })
        .attr('cursor', 'pointer');

    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle')
        .attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
        .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = svg3.selectAll('path.link')
        .data(links, function(d) { return d.id; });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
        });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
        .duration(duration)
        .attr('d', function(d){ return diagonal(d, d.parent) });

    // Remove any exiting links
    var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d){
        d.x0 = d.x;
        d.y0 = d.y;
    });

    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {

        path3 = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`;

        return path3
    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
}
