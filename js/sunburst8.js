var movieData = {
    "name": "movie",
            "children": [ {"name":"Animation",
                "children":[
                    {"name": "Lego", "size": 10},
                    {"name": "Rio 2", "size": 10},
                    {"name": "28 Hits for Laughs", "size": 10}
                ]} ,
                {"name":"Comedy",
                    "children":[
                        {"name": "Queen", "size": 10},
                        {"name": "Mr.Peabody & Sherman", "size": 10},
                        {"name": "Grand Budapest Hotel", "size": 10},
                        {"name": "Ride Along", "size": 10},
                        {"name": "Vampire Academy", "size": 10},
                        {"name": "Camp Takota", "size": 10},
                        {"name": "The Hungover Games", "size": 10},
                    ]},
                {"name":"Action",
                    "children":[
                        {"name": "300:Rise of an Empire", "size": 10},
                        {"name": "RoboCop", "size": 10},
                        {"name": "Spider-Man 2", "size": 10},
                        {"name": "Non-Stop", "size": 10},
                        {"name": "Planet of Apes:Dawn", "size": 10},
                        {"name": "Gunday", "size": 10},
                        {"name": "Come, let's love", "size": 10},
                    ]} ,
                {"name":"Mystery",
                    "children":[{"name":"Jack Ryan","size":10}]} ,
                {"name":"Crime",
                    "children":[{"name":"The Raid 2","size":10},
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
                    "children":[{"name":"Kiki's Deliv Service","size":10}]},
                {"name":"Romance",
                    "children":[{"name":"Highway","size":10},
                        {"name":"Beauty and the beast","size":10},
                        {"name":"I'm your hero","size":10}]} ,
                {"name":"Documentary",
                    "children":[{"name":"The Oscars","size":10}]},
                {"name":"Family",
                    "children":[{"name":"Swan Princess","size":10}]},
                {"name":"Adventure",
                    "children":[{"name":"Return of the 1st Avenger","size":10},
                        {"name":"TinkerBell & pirate Fairy","size":10},
                        {"name":"Justice League:War","size":10}]},
                {"name":"tv show",
                    "children": [ {"name":"RealityTV",
                        "children":[{"name": "71st GG Awards", "size": 10}]},
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
                            "children":[{"name": "2014 MTV Awards", "size": 10}]}
                        ]
                 },

            ]
};

var width = 900,
    height =900,
    radius = width /7;

partition = data => {
    const root2 = d3.hierarchy(data)
        .sum(d => d.size)
        .sort((a, b) => b.size - a.size);
    return d3.partition()
        .size([2 * Math.PI, root2.height + 1])
        (root2);
};

const root2 = partition(movieData);

format = d3.format(",d");

color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, movieData.children.length + 1));

root2.each(d => d.current = d);

arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));


var svg2 = d3.select("#sunburstContainer").append("svg")
            .attr("width", width)
            .attr("height", height);

var g2 = svg2.append("g")
    .attr("transform", `translate(${width / 2},${width / 2})`);

var path2 = g2.append("g")
            .selectAll("path")
            .data(root2.descendants().slice(1))
            .join("path")
            .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
            .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.8 : 0.6) : 0)
            .attr("d", d => arc(d.current));

path2.filter(d => d.children)
    .style("cursor", "pointer")
    .on("click", clicked);

path2.append("title")
    .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.size)}`);

var label = g2.append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .style("user-select", "none")
    .style("font-size",14)
    .selectAll("text")
    .data(root2.descendants().slice(1))
    .join("text")
    .attr("dy", "0.35em")
    .style("font-weight","bold")
    // .attr("font-size",d=>(d.y1-d.y0)*radius/6+"px")
    .attr("fill-opacity", d => +labelVisible(d.current))
    .attr("transform", d => labelTransform(d.current))
    .text(d => d.data.name);

var parent = g2.append("circle")
    .datum(root2)
    .attr("r", radius)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("click", clicked);

function clicked(p) {
    parent.datum(p.parent || root2);

    root2.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
    });

    const t = g2.transition().duration(750);

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    path2.transition(t)
        .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
        })
        .filter(function(d) {
            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        .attrTween("d", d => () => arc(d.current));

    label.filter(function(d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
    }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform(d.current));
}

function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
}

function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
}

function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
}
