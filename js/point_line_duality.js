
// dimensions for svg
var svgWidth = 600;
var svgHeight = 300;

// dimensions for individual coordinate systems
var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = svgWidth/2 - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

var domain = [0, 10];
var points = [];

var click = function() {
   // Ignore the click event if it was suppressed
  if (d3.event.defaultPrevented) return;

  var c = d3.mouse(this);
  var x1 = c[0];
  var x2 = c[1];
  
  points.push([xScale.invert(x1), xScale.invert(x2)]);
  update();
}

// create a parallel coordinates system by specifying
// the axis-spacing vector [left axis, right axis]
var d = d3.scale.linear()
  .domain([0, 1]).
  range([margin.left, width]);

// setup x
var xScale = d3.scale.linear()
  .domain(domain)
  .range([0, width]);

var xAxis = d3.svg.axis()
  .scale(xScale)
  .orient("bottom");

// setup y
var yScale = d3.scale.linear()
.domain(domain)
.range([height,0]);

var yAxisLeft = d3.svg.axis()
  .scale(yScale)
  .orient("left");

var yAxisRight = d3.svg.axis()
  .scale(yScale)
  .orient("right");

// svg container
var svg = d3.select("#container")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// cartesian coordinates
var sampleSVG = svg.append("g")
  .attr("class", "cartesian")
  .style("pointer-events", "all") // capture events bubbling up
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
sampleSVG.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height +")")
  .call(xAxis);  

sampleSVG.append("g")
  .attr("class", "y axis")
  .call(yAxisLeft);

// append dummy rect to capture click events
sampleSVG.append("rect")
  .attr("class", "capture-click")
  .style('visibility', 'hidden')
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", width)
  .attr("height", height)
  .on("click", click);

// parallel coordinates
var lineSVG = svg.append("g")
  .attr("class", "parallel")
  .attr("transform", "translate(" + (width + margin.left + margin.right) + "," + margin.top + ")");

lineSVG.append("g")
  .attr("class", "y axis left")
  .attr("transform", "translate(" + margin.left + ",0)")
  .call(yAxisLeft); 

lineSVG.append("g")
  .attr("class", "y axis right")
  .attr("transform", "translate(" + width + ",0)")
  .call(yAxisRight); 

var drag = d3.behavior.drag()
            .on("drag", dragmove);

function dragmove(d) {
  var x = d3.event.x;
  var y = d3.event.y;
  d[0] = xScale.invert(x);
  d[1] = yScale.invert(height - y);
  update();
}

function update() {
  var aspect = svgWidth/svgHeight;
  var targetWidth = $("#container").width();

  svgWidth = targetWidth
  svgHeight = targetWidth / aspect;

  width = svgWidth/2 - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom

  xScale.range([0, width]);
  yScale.range([height, 0]);
  d.range([margin.left, width]);

  sampleSVG.select('.x.axis')
    .attr("transform", "translate(0," + height +")")
    .call(xAxis);  

  sampleSVG.select('.y.axis')
    .call(yAxisLeft);

  sampleSVG.select('rect.capture-click')
    .attr("width", width)
    .attr("height", height);

  lineSVG.attr("transform", "translate(" + (width + margin.left + margin.right) + "," + margin.top + ")");

  lineSVG.select('.y.axis.right')
    .attr("transform", "translate(" + width + ",0)");

  lineSVG.select('.y.axis.left')
    .call(yAxisLeft);  

  lineSVG.select('.y.axis.right')
    .call(yAxisRight);

  svg.attr("width", svgWidth)
    .attr("height", svgHeight);

  // var parallel = d3.select("#parallel svg")
  //   .attr("width", svgWidth)
  //   .attr("height", svgHeight);

  circles = sampleSVG.selectAll(".dot")
    .data(points);

  circles.enter()
      .append("circle")
      .attr("class", "enter");

  circles
      .style("stroke", "gray")
      .style("fill", "gray")  
      .attr("r", 4)
      .attr("class", "dot")
      .style("cursor", "pointer")
      .attr("cx", function(d) { return xScale(d[0]); })
      .attr("cy", function(d) { return height - yScale(d[1]); })
      .call(drag);

  lines = lineSVG.selectAll(".line").data(points);
  lines.enter()
    .append("line")
    .attr("class", "enter");

  lines
    .style("stroke", "gray")
    .attr("class", "line")
    .attr("x1", d(0))
    .attr("y1", function(d) { return yScale(d[0]); })
    .attr("x2", d(1))
    .attr("y2", function(d) { return height - yScale(d[1]); });  // same as yScale(yScale.invert(x2))

}

$(document).ready(function() {

  $(window).resize(update);
  update();

});

