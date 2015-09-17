"use strict";

function toggleClass(element, className) {
        d3.select(element)
            .classed(className, function (d, i) {
                return !d3.select(element).classed(className);
            });
    }

function hexPlot() {
    //
    //
    // Variable declaration with default values
    //
    //
    
    var _chart = {};
    var formatCount = d3.format(".0f");
    var _width = 500, _height = 500, 
        _margins = {top: 30, left: 30, right: 30, bottom: 30},
        _binSize = 20,
        _title,
        _xName, _yName,
        _dimension, _dim, _text,
        _data = [],
        _area,
        _x, _y,
        _xAxis, _yAxis,
        _xDomain, _yDomain,
        _hexbin,
        _zoom,
        _group, _dict,
        _color = ["white", "steelblue"],
        _svg, _bodyG;


    //
    //
    // Main render function
    //
    //
    
    _chart.render = function () {
        if (!_svg) {
           initializeData();

           definitions();

           initializeSkeleton();
        }

        renderBins();
    };
    
    //
    //
    // Data
    //
    //
    
    function initializeData()
    {
        // Create dict with second axis values  as key
        var temp = d3.map(_dimension.top(Infinity), function(d) { return d[_dim]; });

        // Group tags by second axis
        _group = _dimension.group();

        // Scatter data
        _group.top(Infinity).forEach(function(d, i) {
            _data.push({x: d.key, y: d.value , text: temp.get(d.key)[_text] });
        });

    }
    
    //
    //
    // Definitions
    //
    //
    
    function definitions()
    {
        // Color scale
        _color = d3.scale.linear()
            .domain([0,5])
            .range(_color)
            .interpolate(d3.interpolateLab);

        // Get X scaling
        _xDomain = d3.extent(_data, function(d) { return d.x; });

        _x = d3.scale.linear()
            .domain(_xDomain).nice()
            .range([0,quadrantWidth()]);

        
        // Get Y scaling
        _yDomain = d3.extent(_data, function(d) { return d.y; });

        _y = d3.scale.linear()
            .domain(_yDomain).nice()
            .range([quadrantHeight(),0]);

        // Hexbins
        _hexbin = d3.hexbin()
            .size([quadrantWidth(),quadrantHeight()])
            .radius(_binSize);

        // Define axis and scales
        _xAxis = d3.svg.axis()
                    .scale(_x)
                    .orient("bottom");        

        _yAxis = d3.svg.axis()
                    .scale(_y)
                    .orient("left");

        // Zoom
        _zoom = d3.behavior.zoom()
            .x(_x)
            .y(_y)
            .scaleExtent(d3.extent(_yDomain.concat(_xDomain)))
            .on("zoom", zoomed);
    }

    // 
    //
    // Basic rendering
    //
    //
    
    function initializeSkeleton()
    {
        var padding = 0;

        // SVG
        _svg = d3.select(_area).append("svg")
            .attr("height", _height)
            .attr("width", _width)
            .style("background-color", "white")
            .call(_zoom);
        
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
                .attr("id", "body-clip-hex")
                .append("rect")
                .attr("x", 0 - padding)
                .attr("y", 0)
                .attr("width", quadrantWidth() + 2 * padding)
                .attr("height", quadrantHeight());

        // create chart body
        _bodyG = _svg.append("g")
                .attr("class", "body")
                .attr("transform", "translate(" 
                        + xStart() 
                        + "," 
                        + yEnd() + ")")
                .attr("clip-path", "url(#body-clip-hex)");
    }

    //
    //
    // Render Data
    // 
    //

    function renderBins() {
        var data = _hexbin([].map.call(_group.all().filter(function(d) { return d.value > 0; }), function(d) { return scalePoint([d.key, d.value]); }));

        var dict = d3.map(_data.map(function(d) { return {point: scalePoint([d.x, d.y]), text: d.text}; }), function(d) { return d.point; });
        
        // Groups
        var bin = _bodyG.selectAll(".hexagon")
            .data(data.filter(visibiltyFilter), function(d) { return d[0]; })
            .enter()
            .append("g")
            .attr("class","hexagon");

        // Enter
        bin.append("path")
            .style("fill", function(d) { return _color(d.length); })
            .attr("d",_hexbin.hexagon(_binSize));
                //.on("mouseover",tip.show)
                //.on("mouseout", tip.hide);

        bin.append("text")
            .attr("dy", ".25em")
            .attr("y", function(d) { return d.y; })
            .attr("x", function(d) { return d.x; })
            .attr("text-anchor", "middle");

        // Update
        _bodyG.selectAll(".hexagon").select("path")
                .data(data, function(d) { return d[0]; })
                .attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; })
                .attr("d", function(d) {
                    if(d.length>1)
                    {
                        return _hexbin.hexagon(_binSize);
                    }
                    else
                    {
                        return _hexbin.hexagon(0);
                    }
                })
                .transition()
                .duration(500)
                .style("fill", function(d) { return _color(d.length); });

        _bodyG.selectAll(".hexagon").select("text")
                .data(data, function(d) { return d[0]; })
                .attr("y", function(d) { return d.y; })
                .attr("x", function(d) { return d.x; })
                .transition()
                .duration(500)
                .text(function(d) {
                    if(d.length>1)
                    {
                        d3.select(this).classed("group", true);
                        return d.length;
                    }
                    else
                    {
                        d3.select(this).classed("group", false);
                        return dict.get(d[0]).text;
                    }
                    return "Err";
                });

        // Exit
        _bodyG.selectAll(".hexagon")
            .data(data, function(d) { return d[0]; })
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
        return d3.extent(_data, function(d) { return d.x });
    }

    function getYDomain() {
        return d3.extent(_data, function(d) { return d.y });
    }

    function scalePoint(point) {
        return [_x(point[0]), _y(point[1])];
    }
    
    // Dont draw DOM elements out of vision
    function visibiltyFilter(d) {
        if(d.x < 0||d.x>quadrantWidth()) { return false; }
        if(d.y < 0||d.y>quadrantHeight()) { return false; }
        return true;
    }
    
    // Zoom functions
    function zoomed() {
      renderBins();
      _svg.select(".x.axis").call(_xAxis);
      _svg.select(".y.axis").call(_yAxis);

    }

    // Reset zoom
    function reset() {
      d3.transition().duration(750).tween("zoom", function() {
        var ix = d3.interpolate(_x.domain(), _xDomain),
            iy = d3.interpolate(_y.domain(), _yDomain);
        return function(t) {
          _zoom.x(_x.domain(ix(t))).y(_y.domain(iy(t)));
          zoomed();
        };
      });
    }

    // 
    //
    // External function
    //
    //

    _chart.updateData = function()
    {
        // Re render
        renderBins();

        // Reset zoom
        reset();
    }

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

    _chart.dimension = function (d, x, t) {
        if (arguments.length < 3) {
            return _dimension, _dim, _text;
        }
        _dimension = d;
        _dim = x;
        _text = t;
        return _chart;
    };

    _chart.area = function (a) {
        if (!arguments.length) return _area;
        _area = a;
        return _chart;
    };

    _chart.binSize = function (b) {
        if (!arguments.length) return _binSize;
        _binSize = b;
        return _chart;
    };

    return _chart;
}
