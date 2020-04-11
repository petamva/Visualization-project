//Width and height

var margin = { left:50, right:50, top:50, bottom:100 };
var h = 500 - margin.top - margin.bottom;
var	w = 700 - margin.left - margin.right;
var flag = true;

//Create SVG element

var g2 = d3.select("#budgetProfitContainer")
                .append("svg")
                .attr("class","canvas")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("class","barchart")
                .attr("transform", "translate(" + margin.left +", " + margin.top + ")");

// --------- X Axis Label
g2.append("text")
                .attr("class","x-axis label")
                .attr("x",w/2)
                .attr("y",h+85)
                .attr("font-size",28)
                .attr("text-anchor","middle")
                .text("Genre");

//---------- Y Axis Label
var yLabel = g2.append("text")
                .attr("class","y-axis label")
                .attr("x",-h/2)
                .attr("y",-30)
                .attr("font-size",24)
                .attr("text-anchor","middle")
                .attr("transform","rotate(-90)") // !!!! because we rotate the text x and y coordinates shift !!!!
                .text("Budget ($MM)");

d3.csv("budgetProfit.csv").then(function (data) {
    data.forEach(function (d) {
        d.budget = +d.budget; // convert strings to integer
        d.profit = +d.profit;
    });
    // console.log(data);

var xScale = d3.scaleBand()
            .domain(data.map(function (d) {
                return d.genre;
            }))
            .rangeRound([0, w])
            .paddingInner(0.05);

var yScale = d3.scaleLinear()
            .domain([d3.min(data,function (d) {
                return d.budget;
            }), d3.max(data,function (d) {
                return d.budget;
            })])
            .range([h, 0]);

    var    xAxis = d3.axisBottom(xScale);

var    yAxis = d3.axisLeft(yScale);

var xAxisGroup =    g2.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + h + ")");

xAxisGroup.call(xAxis)
            .selectAll("text")
            .attr("font-size",14)
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)");

var yAxisGroup =  g2.append("g")
                        .attr("class", "y axis");

yAxisGroup.call(yAxis);

//Create bars
    var rects = g2.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) {
            return xScale(d.genre);
        })
        .attr("y", function(d) {
            return yScale(d.budget);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return h-yScale(d.budget);
        })
        .attr("fill", function(d) {
            return "rgb(0, 0," + Math.round(280-d.budget*1.5) + ")";
        })
        .on("mouseover", function() {
            d3.select(this)
                // .attr("fill", "orange");
                .attr("fill", "orange");
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition("restoreColors")
                .duration(250)
                .attr("fill",  function(d) {
                    if (!flag)
                        return "rgb(0, 0, " + Math.round(280-d.profit/2) + ")";
                    else
                        return "rgb(0, 0, " + Math.round(280-d.budget*1.5) + ")";

                })
        });

    g2.selectAll(".rectText")
        .data(data)
        .enter()
        .append("text")
        .attr("class","rectText")
        .text(function(d) {
            return d.budget;
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d) {
            return xScale(d.genre) + xScale.bandwidth() / 2;
        })
        .attr("y", function(d) {
            if(d.budget<6){
                return yScale(d.budget);
            }else
                return yScale(d.budget) + 14;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "12px")
        .attr("font-weight","bold")
        .attr("fill", function (d) {
            if(d.budget<6){
                return "black";
            }else
                return "white";
        });

d3.select("#budget-button")
        .on("click", function() {
            flag = !flag;
            var button = d3.select(this);
            if(!flag){
                button.text("Budgets");
                yScale.domain([0, d3.max(data,function (d) {
                    return d.profit;
                })]);

                yAxisGroup.transition()
                    .duration(350)
                    .call(yAxis);

                yLabel.text("Profit (%)");

                g2.selectAll("rect")
                    .data(data)
                    .transition()
                    .delay(200)  // static delay
                    // .delay(function (d,i) {
                    //     return (i/dataset.length)*1000;
                    // })
                    .duration(1000)
                    // .ease(d3.easeElasticOut)
                    // .ease(d3.easeLinear)
                    .attr("y", function(d) {
                        if (d.profit<=0)
                            return yScale(0);
                        else
                            return yScale(d.profit);
                    })
                    .attr("height", function(d) {
                        if(d.profit<=0)
                            return 0;
                        else
                            return h-yScale(d.profit);
                    })
                    .attr("fill", function(d) {
                        return "rgb(0, 0, " + Math.round(280-d.profit/2) + ")";
                    });

                g2.selectAll(".rectText")
                    .data(data)
                    .transition()
                    .delay(400)
                    // .delay(function (d,i) {
                    //     return (i/dataset.length)*1000;
                    // })
                    .duration(1500)
                    // .ease(d3.easeElasticOut)
                    // .ease(d3.easeLinear)
                    .text(function(d) {
                        return d.profit;
                    })
                    .attr("y", function(d) {
                        if((d.profit>=0)&&(d.profit<20)){
                            return yScale(d.profit);
                        }else if(d.profit<0)
                            return yScale(5);
                        else
                            return yScale(d.profit) + 14;
                    })
                    .attr("fill", function (d) {
                        if(d.profit<20&&d.profit>=0){
                            return "black";
                        }else if (d.profit<0)
                            return "red";
                        else
                            return "white";
                    });
            }else{
                button.text("Profit");
                yScale.domain([d3.min(data,function (d) {
                    return d.budget;
                }), d3.max(data,function (d) {
                    return d.budget;
                })]);

                yAxisGroup.transition()
                    .duration(350)
                    .call(yAxis);

                yLabel.text("Budget ($MM)");

                g2.selectAll("rect")
                    .data(data)
                    .transition()
                    .delay(200)  // static delay
                    // .delay(function (d,i) {
                    //     return (i/dataset.length)*1000;
                    // })
                    .duration(1000)
                    // .ease(d3.easeElasticOut)
                    // .ease(d3.easeLinear)
                    .attr("y", function(d) {
                        return yScale(d.budget);
                    })
                    .attr("height", function(d) {
                        return h-yScale(d.budget);
                    })
                    .attr("fill", function(d) {
                        return "rgb(0, 0, " + Math.round(280-d.budget*1.5) + ")";
                    });

                g2.selectAll(".rectText")
                    .data(data)
                    .transition()
                    .delay(400)
                    // .delay(function (d,i) {
                    //     return (i/dataset.length)*1000;
                    // })
                    .duration(1500)
                    // .ease(d3.easeElasticOut)
                    // .ease(d3.easeLinear)
                    .text(function(d) {
                        return d.budget;
                    })
                    .attr("y", function(d) {
                        if(d.budget<6){
                            return yScale(d.budget);
                        }else
                            return yScale(d.budget) + 14;
                    })
                    .attr("fill", function (d) {
                        if(d.budget<6){
                            return "black";
                        }else
                            return "white";
                    });

            }

        });
});

