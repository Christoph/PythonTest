"use strict";

// 
//
// Utility functions
//
//

function toggleClass(element, className) {
        d3.select(element)
            .classed(className, function (d, i) {
                return !d3.select(element).classed(className);
            });
    }

function classElementsIn(element, className, compareObjs) {
    toggleClass(element, className);

    var current = d3.select(element).data()[0];

    d3.selectAll(compareObjs)
        .filter(function(d) { return d == current; })
        [0].forEach(function(d,i,k) { toggleClass(d,className); });
}

//
//
// Chart functions
//
//

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
                .attr("class", "bar")
                .on("click", function(d) {
                    classElementsIn(this, "highlight", "text._0");
                    /*
                    toggleClass(this, "highlight");

                    var current = d3.select(this).data()[0]

                    d3.selectAll("text._0")
                        .filter(function(d) { 
                            return d == current; })
                        [0].forEach(function(d,i,k) {
                        toggleClass(d,"highlight");
                    })
                    */
                });

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

function histogram() {
    //
    //
    // Variable declaration
    //
    //
    
    var _chart = {};

    var _width = 600, _height = 250,
        _margins = {top: 30, left: 70, right: 50, bottom: 40},
        _colors = d3.scale.category10(),
        _title,
        _x, _y,
        _xAxis, _yAxis,
        _xName, _yName,
        _svg,
        _group,
        _bins,
        _ticks,
        _dimension,
        _filter, 
        _chartDiv,
        _reloadAll,
        _hist,
        _histOccu,
        _xHist,
        _isNumeric,
        _useDomain, _useProperty, _useFilter, _filtered,
        _brush, _gBrush,
        _bodyG;
    
    // A formatter for counts.
    var _formatCount = d3.format(",.0f");

    //
    //
    // Main render function
    //
    //
    
    _chart.render = function () {
        if (!_svg) {
            chooseType();

            initializeData();

            definitions();

            initialzeSkeleton();
        }

        renderBars();
    };
 
    //
    //
    // Choose bin type
    //
    //
    
    function chooseType()
    {
        if(_isNumeric == true)
        {
            _useDomain = getXDomain;
            _useProperty = "key";
            _useFilter = filterNumeric;

        }
        else
        {
            _useDomain = getXOccurenceDomain;
            _useProperty = "value";
            _useFilter = filterText;
        }
    }

    //
    //
    // Data
    //
    //
    
    function initializeData()
    {
        // Crossfilter
        _group = _filter.group();
    }

    //
    //
    // Definitions
    //
    //
    
    function definitions()
    {
        // Get X scaling
        _x = d3.scale.linear()
            .domain(_useDomain()).nice()
            .range([0, quadrantWidth()]);

        // Get hist bin scaling
        _xHist = d3.scale.linear()
            .domain(getXDomain())
            .range([0, quadrantWidth()]);

        // Histogram bins
        _ticks = _x.ticks(_bins);

        // Generate histogram data
        _hist = d3.layout.histogram()
                .bins(_ticks)
                (_group.top(Infinity).map(function(d) { return d[_useProperty]; }));
            
        // Get Y scaling
         _y = d3.scale.linear()
        .domain(getYDomain())
        .range([quadrantHeight(), 0]);   

        // Define axis
        _xAxis = d3.svg.axis()
                    .scale(_x)
                    .orient("bottom");        

        _yAxis = d3.svg.axis()
                    .scale(_y)
                    .orient("left");
    }

    // 
    //
    // Basic rendering
    //
    //
    
    function initialzeSkeleton()
    {
        var padding = 5;

        // SVG
        _svg = d3.select(_chartDiv).append("svg")
                .attr("height", _height)
                .attr("width", _width)
                .style("background-color", "white")
                .attr("class", "chart")
                .on("brush", _reloadAll);

        // title
        _svg.append("text")
            .attr("class", "title")
            .attr("text-anchor", "middle")
            .attr("x",(_width/2))
            .attr("y", 20)
            .text(_title);

        // x axis
        _svg.append("g")
                .attr("class", "x axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yStart() + ")";
                })
                .call(_xAxis);

        // x axis label
        _svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x",(_width/2))
            .attr("y", _height - 5)
            .text("["+_xName+"]");

        // y axis
        _svg.append("g")
                .attr("class", "y axis")
                .attr("transform", function () {
                    return "translate(" + xStart() + "," + yEnd() + ")";
                })
                .call(_yAxis);

        // y axis label
        _svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "middle")
            .attr("x",-(_height/2))
            .attr("y", 5)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("["+_yName+"]");

        // body clip
        _svg.append("defs")
                .append("clipPath")
                .attr("id", "body-clip")
                .append("rect")
                .attr("x", 0 - 1.5 * padding)
                .attr("y", 0)
                .attr("width", quadrantWidth() + 3 * padding)
                .attr("height", quadrantHeight());

        // create chart body
        _bodyG = _svg.append("g")
                .attr("class", "body")
                .attr("transform", "translate(" 
                        + xStart() 
                        + "," 
                        + yEnd() + ")")
                .attr("clip-path", "url(#body-clip)");
        
        // create bars
        var bar = _bodyG.selectAll(".bar")
            .data(_hist)
            .enter()
            .append("g")
            .attr("class","bar")
            .attr("transform", function(d) { return "translate("+_x(d.x)+","+_y(0)+")"; });

        bar.append("rect");

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", -12)
            .attr("text-anchor", "middle");

        // create brush
        _brush = d3.svg.brush()
            .x(_x)
            .on("brushend", brushended);

        _gBrush = _bodyG.append("g")
            .attr("class", "brush")
            .call(_brush)
            .call(_brush.event);

        _gBrush.selectAll("rect")
            .attr("rx", 5)
            .attr("height", quadrantHeight())
            .attr("y", 1);

        _gBrush.selectAll(".resize").append("path").attr("d", resizePath);
    }
    
    //
    //
    // Render Data
    // 
    //

    function renderBars() {
        // Update histogram data
        _hist = d3.layout.histogram()
                .bins(_ticks)
                (_group.top(Infinity).filter(function(d) { return d.value>0; }).map(function(d) { return d[_useProperty]; }));
        
        // Update
        var bar = _bodyG.selectAll(".bar")
            .data(_hist)
            .transition()
            .duration(500)
            .attr("transform", function(d) { return "translate("+_x(d.x)+","+_y(d.y)+")"; });

        bar.select("rect")
            .attr("x", 1)
            .attr("width", _x(_hist[0].dx) - 1)
            .attr("height", function(d) { return yStart() - _y(d.y); });
            
        bar.select("text")
            .attr("x", _x(_hist[0].dx) / 2)
            .text(function(d) { return _formatCount(d.y); });

        // Exit
        _bodyG.selectAll(".bar")
            .data(_hist)
            .exit()
            .remove();
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
        return d3.extent(_group.top(Infinity), function(d) { return d.key; });
    }

    function getXOccurenceDomain() {
        return d3.extent(_group.top(Infinity), function(d) { return d.value; });
    }

    function getYDomain() {
        var max = d3.max(_hist, function(d) { return d.y; });
        return [0,max+(max/10)];
    }

    // Creates the nice drag handle
    function resizePath(d) {
        var e = +(d == "e"),
            x = e ? 1 : -1,
            y = quadrantHeight() / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
      }

    // Histogram bin size round function
    function round(number, increment, offset) {
        return Math.ceil((number - offset) / increment ) * increment + offset;
    }

    // Brush functions
    function brushended() {
      if (!d3.event.sourceEvent) return; // only transition after input

      var inc = _ticks[1]-_ticks[0];
      var xDomain = _x.domain();

      var extent0 = _brush.extent(),
          extent1 = extent0.map(function(d) { 
              return round(d,inc,xDomain[0]) 
          });

      // Add increment to max because _filter.range is [x,y)
      if(extent1[1] >= xDomain[1]) extent1[1] = xDomain[1]+0.0000001;

      // If selection is empty, clear filter
      if ((extent1[1] - extent1[0]) < inc) {
          extent1[1] = extent1[0];
        _brush.clear();
        _filter.filterAll();
        _reloadAll();
      }
      else
      {
        // Filter
        _useFilter(extent1);        

        // Rerender everything except this chart
        _reloadAll();
      }

      // Transition
      d3.select(this).transition()
          .call(_brush.extent(extent1))
          .call(_brush.event);
    }

    // Numeric filter
    function filterNumeric(extent1)
    {
        _filter.filter(extent1);
    }

    // Text filter
    function filterText(extent1)
    {
        
        _filtered = [].map.call(_group.all().filter(function(d) { return d.value >= extent1[0] && d.value < extent1[1] }), function(d) { return d.key; })

        _filter.filter(function(d) {
              return _filtered.indexOf(d) > -1;
        });
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

    _chart.bins = function (b) {
        if (!arguments.length) return _bins;
        _bins = b;
        return _chart;
    };

    _chart.dimension = function (d,f) {
        if (arguments.length<2) return _dimension, _filter;
        _dimension = d;
        _filter = f;
        return _chart;
    };

    _chart.reloadAll = function (f) {
        if (!arguments.length) return _reloadAll;
        _reloadAll = f;
        return _chart;
    };

    _chart.area = function (a) {
        if (!arguments.length) return _chartDiv;
        _chartDiv = a;
        return _chart;
    };

    _chart.axisNames = function (a,b) {
        if (arguments.length<2) return _xName, _yName;
        _xName = a;
        _yName = b;
        return _chart;
    };

    _chart.title = function (t) {
        if (!arguments.length) return _title;
        _title = t;
        return _chart;
    };

    _chart.isNumeric = function (t) {
        if (!arguments.length) return _isNumeric;
        _isNumeric = t;
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
    numberOfDataPoint = 500;

var data = [];

// Fill up data 
for (var i = 0; i < numberOfSeries; ++i)
    data.push(d3.range(numberOfDataPoint).map(function (i) {
        return {x: randomData(), y: randomData(), text: i};
    }));

// Create chart objects
//var scatter = scatterPlotChart("#scatter");
//var bar = barChart("#bar1");


// fill up charts with data
/*
data.forEach(function (series) {
    scatter.addSeries(series);
});

bar.setSeries(data[0]);
// Render charts
scatter.render();
bar.render();
*/

// Import data
d3.csv("tags_final.csv")
.row(function(d) {
    return { id: +d.ID, tagName: d.TagName, importance: +d.Importance , songName: d.SongName};
})
.get(function(error, tags) {
    //Due to the asyncronity of d3.import, the data is only available within this function
    //
    // START
    //
    //
    
    // 
    //
    // Data
    //
    //
    
    // Crossfilter 
    var cf = crossfilter(tags);
    
    //  By name crossfilter and mapping
    var byName = cf.dimension(function(d) { return d.tagName; });
    var filterByName = cf.dimension(function(d) { return d.tagName; });

    var byImportance = cf.dimension(function(d) { return d.importance; });
    var filterByImportance = cf.dimension(function(e) { return e.importance; });

    //
    //
    // Visualizition
    //
    //
    
    // Create variables
    var hex = hexPlot()
        .area("#hex")
        .height(600)
        .width(600)
        .dimension(byImportance,"importance", "tagName")
        .binSize(25);

    var hist1 = histogram()
        .area("#hist1")
        .height(250)
        .width(600)
        .isNumeric(true)
        .dimension(byImportance,filterByImportance)
        .reloadAll(renderAll)
        .bins(20)
        .axisNames("Importance", "#")
        .title("Importance Histogram");

    var hist2 = histogram()
        .area("#hist2")
        .height(250)
        .width(600)
        .isNumeric(false)
        .dimension(byName,filterByName)
        .reloadAll(renderAll)
        .bins(10)
        .axisNames("Occurrence", "#")
        .title("Occurrence Histogram");

   function renderAll()
   {
        // Render
        hex.render();
        hist1.render();
        hist2.render();
   }

   renderAll();

    //
    //
    // END
});
