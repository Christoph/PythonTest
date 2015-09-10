"use strict";

function barChart(chartDiv) {
    var _chart = {};

    var _width = 600, _height = 250,
            _margins = {top: 30, left: 30, right: 30, bottom: 30},
            _xDomain = [-1,10], _yDomain = [0,10],
            _data = [],
            _colors = d3.scale.category10(),
            _svg,
            _bodyG;

    //
    //
    // Define axis and scales
    //
    //

    var _x = d3.scale.linear()
        .domain(_xDomain)
        .range([0, quadrantWidth()]);

    var _y = d3.scale.linear()
        .domain(_yDomain)
        .range([quadrantHeight(), 0]);

    var _xAxis = d3.svg.axis()
                .scale(_x)
                .orient("bottom");        

    var _yAxis = d3.svg.axis()
                .scale(_y)
                .orient("left");

    //
    //
    // Main render function
    //
    //
    
    _chart.render = function () {
        if (!_svg) {
            _svg = d3.select(chartDiv).append("svg")
                    .attr("height", _height)
                    .attr("width", _width)
                    .style("background-color", "white");

            renderAxes(_svg);

            defineBodyClip(_svg);
        }

        renderBody(_svg);
    };

    function renderBody(svg) {
        if (!_bodyG)
            _bodyG = svg.append("g")
                    .attr("class", "body")
                    .attr("transform", "translate(" 
                            + xStart() 
                            + "," 
                            + yEnd() + ")")
                    .attr("clip-path", "url(#body-clip-bar1)");

        renderBars();
    };
    
    // 
    //
    // Axis render method
    //
    //

    function renderAxes(svg) {
        var axesG = svg.append("g")
                .attr("class", "axes");

        axesG.append("g")
                .attr("class", "x axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yStart() + ")";
                })
                .call(_xAxis);

        axesG.append("g")
                .attr("class", "y axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yEnd() + ")";
                })
                .call(_yAxis);
    }

    //
    //
    // Clipping function
    //
    //

    function defineBodyClip(svg) {
        var padding = 5;

        svg.append("defs")
                .append("clipPath")
                .attr("id", "body-clip-bar1")
                .append("rect")
                .attr("x", 0 - padding)
                .attr("y", 0)
                .attr("width", quadrantWidth() + 2 * padding)
                .attr("height", quadrantHeight());
    }

    //
    //
    // Render Data
    // 
    //

    function renderBars() {
        var padding = 2; 

        _bodyG.selectAll("rect.bar")
                    .data(_data)
                .enter()
                .append("rect")
                .attr("class", "bar");

        _bodyG.selectAll("rect.bar")
                    .data(_data)                    
                .transition()
                .attr("x", function (d) { 
                    return _x(d.x);
                })
                .attr("y", function (d) { 
                    return _y(d.y);
                })
                .attr("height", function (d) { 
                    return yStart() - _y(d.y); 
                })
                .attr("width", function(d){
                    return Math.floor(quadrantWidth() / _data.length) - padding;
                });
    }

    //
    //
    // Internal Functions
    //
    //

    function xStart() {
        return _margins.left;
    }

    function yStart() {
        return _height - _margins.bottom;
    }

    function xEnd() {
        return _width - _margins.right;
    }

    function yEnd() {
        return _margins.top;
    }

    function quadrantWidth() {
        return _width - _margins.left - _margins.right;
    }

    function quadrantHeight() {
        return _height - _margins.top - _margins.bottom;
    }

    function getDomains() {
        var xmax = d3.max(_data, function(d) {
            return d.x;
            });

        var ymax = d3.max(_data, function(d) {
            return d.y;
            });

        var xmin = d3.min(_data, function(d) {
            return d.x;
            });

        var ymin = d3.min(_data, function(d) {
            return d.y;
            });

        _xDomain = [Math.floor(xmin),Math.ceil(xmax)+1];
        _yDomain = [Math.floor(ymin),Math.ceil(ymax)];

        _x.domain(_xDomain);
        _y.domain(_yDomain);
    }

    // 
    //
    // External function
    //
    //

    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function (h) {
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };

    _chart.margins = function (m) {
        if (!arguments.length) return _margins;
        _margins = m;
        return _chart;
    };

    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };

    _chart.x = function (x) {
        if (!arguments.length) return _x;
        _x = x;
        return _chart;
    };

    _chart.y = function (y) {
        if (!arguments.length) return _y;
        _y = y;
        return _chart;
    };

    _chart.setSeries = function (series) {
        _data = series;
        
        getDomains();

        return _chart;
    };

    return _chart;
}


function scatterPlotChart(chartDiv) {
    //
    //
    // Variable Definition
    //
    //
    
    var _chart = {};

    var _width = 500, _height = 500,
            _margins = {top: 30, left: 30, right: 30, bottom: 30},
            _xDomain = [0,10], _yDomain = [0,10],
            _data = [],
            _colors = d3.scale.category10(),
            _svg,
            _button,
            _bodyG;

    //
    //
    // Define axis and scales
    //
    //

    var _x = d3.scale.linear()
        .domain(_xDomain)
        .range([0, quadrantWidth()]);

    var _y = d3.scale.linear()
        .domain(_yDomain)
        .range([quadrantHeight(), 0]);

    var _xAxis = d3.svg.axis()
                .scale(_x)
                .orient("bottom");        

    var _yAxis = d3.svg.axis()
                .scale(_y)
                .orient("left");
 
    // 
    //
    // Main render function
    //
    //
    
    _chart.render = function () {
        if (!_svg) {
            _svg = d3.select(chartDiv).append("svg")
                    .attr("height", _height)
                    .attr("width", _width)
                    .style("background-color","white")
                    .call(zoom)
                    .call(tip);

            renderAxes(_svg);

            defineBodyClip(_svg);

            // Create the reset button
            _svg.append("rect")
                .attr("class","resetButton")
                .attr("x",_width-48)
                .attr("y",5)
                .attr("width",43)
                .attr("height",25)
                .attr("rx",5);
                
            _svg.append("text")
                .attr("class","resetButton")
                .attr("x",_width-45)
                .attr("y",23)
                .text("Reset");

            mapResetButton();

        }

        renderBody(_svg);
    };


    function renderBody(svg) {
        if (!_bodyG)
            _bodyG = svg.append("g")
                    .attr("class", "body")                    
                    .attr("transform", "translate(" 
                        + xStart() + "," 
                        + yEnd() + ")") 
                    .attr("clip-path", "url(#body-clip-scatter)");

        renderText();
    }
    
    // 
    //
    // Axis render method
    //
    //

    function renderAxes(svg) {
        var axesG = svg.append("g")
                .attr("class", "axes");

        axesG.append("g")
                .attr("class", "x axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yStart() + ")";
                })
                .call(_xAxis);

        axesG.append("g")
                .attr("class", "y axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yEnd() + ")";
                })
                .call(_yAxis);
    }

    //
    //
    // Cliping function
    //
    //

    function defineBodyClip(svg) {
        var padding = 0;

        svg.append("defs")
                .append("clipPath")
                .attr("id", "body-clip-scatter")
                .append("rect")
                .attr("x", 0 - padding)
                .attr("y", 0)
                .attr("width", quadrantWidth() + 2 * padding)
                .attr("height", quadrantHeight());
    }
   
    //
    //
    // Render the data
    //
    //
    
    function renderPoints() { 
        _data.forEach(function (list, i) {
            _bodyG.selectAll("circle._" + i)
                    .data(list)
                    .enter()
                    .append("circle")
                    .attr("class", "circle _" + i);

            _bodyG.selectAll("circle._" + i)
                    .data(list)
                        .style("stroke","blue")
                        .style("fill","blue")
                    .transition() 
                        .attr("transform", function(d){
                            return "translate(" + _x(d.x) + "," + _y(d.y) + ")"; })
                        .attr("r",5);
        });
    }

    function renderText() { 
        _data.forEach(function (list, i) {
            // Enter
            _bodyG.selectAll("text._" + i)
                    .data(list)
                    .enter()
                    .append("text")
                    .attr("class", "text _" + i)
                    .on("mouseover",tip.show)
                    .on("mouseout", tip.hide);

            // Update
            _bodyG.selectAll("text._" + i)
                    .data(list)
                    .style("fill",_colors(i))
                    .transition() 
                        .attr("transform", function(d){ return "translate(" + _x(d.x) + "," + _y(d.y) + ")"; })
                        .text(function (d) { return d.text });

            // Exit
        });
    }

    //
    //
    // Button functionality
    //
    //
    
    // Reset Button
    function mapResetButton() {
        d3.select("text.resetButton")
            .on("click",reset)
            .on("mouseover", function (d) {
                d3.select("rect.resetButton")
                    .style("fill","lightblue")
            })
            .on("mouseout", function (d) {
                d3.select("rect.resetButton")
                    .style("fill","none")
            });
    }

    //
    //
    // Tooltip
    //
    //
     
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>X:</strong> <span style='color:red'>" + d.x + "</span>" + "<strong>Y:</strong> <span style='color:blue'>" + d.y + "</span>";
      })
    
    //
    //
    // Zoom functions
    //
    //
    
    var zoom = d3.behavior.zoom()
        .x(_x)
        .y(_y)
        .scaleExtent(_xDomain)
        .on("zoom", zoomed);

    function zoomed() {
      renderText();
      _svg.select(".x.axis").call(_xAxis);
      _svg.select(".y.axis").call(_yAxis);

    }

    function reset() {
      d3.transition().duration(750).tween("zoom", function() {
        var ix = d3.interpolate(_x.domain(), _xDomain),
            iy = d3.interpolate(_y.domain(), _yDomain);
        return function(t) {
          zoom.x(_x.domain(ix(t))).y(_y.domain(iy(t)));
          zoomed();
        };
      });
    }

    //
    //
    // Internal function
    //
    //
    
    function xStart() {
        return _margins.left;
    }

    function yStart() {
        return _height - _margins.bottom;
    }

    function xEnd() {
        return _width - _margins.right;
    }

    function yEnd() {
        return _margins.top;
    }

    function quadrantWidth() {
        return _width - _margins.left - _margins.right;
    }

    function quadrantHeight() {
        return _height - _margins.top - _margins.bottom;
    }

    function getDomains(series) {
        var xmax = d3.max(_data, function(d) {
            return d3.max(d, function(e) {
                return e.x;
            });
        });

        var ymax = d3.max(_data, function(d) {
            return d3.max(d, function(e) {
                return e.y;
            });
        });

        var xmin = d3.min(_data, function(d) {
            return d3.min(d, function(e) {
                return e.x;
            });
        });

        var ymin = d3.min(_data, function(d) {
            return d3.min(d, function(e) {
                return e.y;
            });
        });

        _xDomain = [Math.floor(xmin),Math.ceil(xmax)];
        _yDomain = [Math.floor(ymin),Math.ceil(ymax)];

        _x.domain(_xDomain);
        _y.domain(_yDomain);
    }

    //
    //
    // External functions
    //
    //
    
    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function (h) {
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };

    _chart.margins = function (m) {
        if (!arguments.length) return _margins;
        _margins = m;
        return _chart;
    };

    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };

    _chart.addSeries = function (series) {
        _data.push(series);

        getDomains();

        return _chart;
    };

    return _chart;
}

function histogram(_data, chartDiv) {
    //
    //
    // Variable declaration
    //
    //
    
    var _chart = {};

    var _width = 600, _height = 250,
            _margins = {top: 30, left: 30, right: 30, bottom: 30},
            _colors = d3.scale.category10(),
            _svg,
            _bodyG;
    
    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    //
    //
    // Definitions
    //
    //
    
    console.log(_data);

    // Get X scaling
    var _x = d3.scale.linear()
        .domain(getXDomain())
        .range([0, quadrantWidth()]);
    
    // Generate histogram
    var _hist = d3.layout.histogram()
            .bins(_x.ticks(10))
            ([].map.call(_data, function(d) { return d.y; }));
        
    console.log(_hist);

    // Get Y scaling
    var _y = d3.scale.linear()
    .domain(getYDomain())
    .range([quadrantHeight(), 0]);

    //
    //
    // Define axis and scales
    //
    //

    var _xAxis = d3.svg.axis()
                .scale(_x)
                .orient("bottom");        

    var _yAxis = d3.svg.axis()
                .scale(_y)
                .orient("left");

    //
    //
    // Main render function
    //
    //
    
    _chart.render = function () {
        if (!_svg) {
            _svg = d3.select(chartDiv).append("svg")
                    .attr("height", _height)
                    .attr("width", _width)
                    .style("background-color", "white");

            renderAxes(_svg);

            defineBodyClip(_svg);

            renderBody(_svg);
        }

        renderBars();
    };

    // 
    //
    // Basic rendering
    //
    //
    
    function renderAxes(svg) {
        var axesG = svg.append("g")
                .attr("class", "axes");

        axesG.append("g")
                .attr("class", "x axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yStart() + ")";
                })
                .call(_xAxis);

        axesG.append("g")
                .attr("class", "y axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yEnd() + ")";
                })
                .call(_yAxis);
    }

    function defineBodyClip(svg) {
        var padding = 5;

        svg.append("defs")
                .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                .attr("x", 0 - padding)
                .attr("y", 0)
                .attr("width", quadrantWidth() + 2 * padding)
                .attr("height", quadrantHeight());
    }

    function renderBody(svg) {
        if (!_bodyG)
            _bodyG = svg.append("g")
                    .attr("class", "body")
                    .attr("transform", "translate(" 
                            + xStart() 
                            + "," 
                            + yEnd() + ")")
                    .attr("clip-path", "url(#body-clip)");
    };

    //
    //
    // Render Data
    // 
    //

    function renderBars() {

        // Enter
        var bar = _bodyG.selectAll(".bar")
            .data(_hist)
            .enter()
            .append("g")
            .attr("class","bar")
            .attr("transform", function(d) { return "translate("+_x(d.x)+","+_y(d.y)+")"; });

        bar.append("rect")
            .attr("x", 1)
            .attr("width", _x(_hist[0].dx) - 1)
            .attr("height", function(d) { return yStart() - _y(d.y); });

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", -12)
            .attr("x", _x(_hist[0].dx) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return formatCount(d.y); });
    }

    //
    //
    // Internal Functions
    //
    //

    function xStart() {
        return _margins.left;
    }

    function yStart() {
        return _height - _margins.bottom;
    }

    function xEnd() {
        return _width - _margins.right;
    }

    function yEnd() {
        return _margins.top;
    }

    function quadrantWidth() {
        return _width - _margins.left - _margins.right;
    }

    function quadrantHeight() {
        return _height - _margins.top - _margins.bottom;
    }

    function getXDomain() {
        var xmax = d3.max(_data, function(d) {
            return d.x;
            });

        var xmin = d3.min(_data, function(d) {
            return d.x;
            });

        return [Math.floor(xmin),Math.ceil(xmax)];
    }

    function getYDomain() {
        var ymax = d3.max(_hist, function(d) {
            return d.y;
            });

        return [0,Math.ceil(ymax)+1];
    }


    // 
    //
    // External function
    //
    //

    _chart.width = function (w) {
        if (!arguments.length) return _width;
        _width = w;
        return _chart;
    };

    _chart.height = function (h) {
        if (!arguments.length) return _height;
        _height = h;
        return _chart;
    };

    _chart.margins = function (m) {
        if (!arguments.length) return _margins;
        _margins = m;
        return _chart;
    };

    _chart.colors = function (c) {
        if (!arguments.length) return _colors;
        _colors = c;
        return _chart;
    };

    return _chart;
}
//
//
//
// Execution
//
//
//

// Random function
function randomData() {
    return Math.random() * 9;
}

// Variable declaration
var numberOfSeries = 1,
    numberOfDataPoint = 50;

var data = [];
var data_bar1 = [];

// Fill up data 
for (var i = 0; i < numberOfSeries; ++i)
    data.push(d3.range(numberOfDataPoint).map(function (i) {
        return {x: randomData(), y: randomData(), text: i};
    }));

data_bar1 = d3.range(numberOfDataPoint).map(function (i) {
    return {x: i, y: randomData()};
});

// Create chart objects
var scatter = scatterPlotChart("#scatter");
var bar = barChart("#bar1");
var hist = histogram(data[0], "#hist1");

// fill up charts with data
data.forEach(function (series) {
    scatter.addSeries(series);
});

bar.setSeries(data_bar1);

// Render charts
scatter.render();
bar.render();
hist.render();
