
var svgWidth = 300;
var svgHeight = 300;

var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

var domain = [0, 10];
var points = [];

var click = function() {
   // Ignore the click event if it was suppressed
  if (d3.event.defaultPrevented) return;

  var c = d3.mouse(this);
  var x1 = c[0] - margin.left;
  var x2 = c[1] - margin.top;
  
  //drawSample(xScale.invert(x1), yScale.invert(x2));
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

var sampleSVG = d3.select("#cartesian")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .on("click", click)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
var lineSVG = d3.select("#parallel")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

sampleSVG.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height +")")
  .call(xAxis);  

sampleSVG.append("g")
  .attr("class", "y axis")
  .call(yAxisLeft);

lineSVG.append("g")
  .attr("class", "y axis left")
  .attr("transform", "translate("+margin.left+",0)")
  .call(yAxisLeft); 

lineSVG.append("g")
  .attr("class", "y axis right")
  .attr("transform", "translate("+width+",0)")
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
  var targetWidth = $("#parallel").parent().width() * 0.4;

  svgWidth = targetWidth
  svgHeight = targetWidth / aspect;

  width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom

  xScale.range([0, width]);
  yScale.range([height, 0]);
  d.range([margin.left, width]);

  sampleSVG.select('.x.axis')
    .attr("transform", "translate(0," + height +")")
    .call(xAxis);  

  sampleSVG.select('.y.axis')
    .call(yAxisLeft);

  lineSVG.select('.y.axis.right')
    .attr("transform", "translate("+width+",0)");

  lineSVG.select('.y.axis.left')
    .call(yAxisLeft);  

  lineSVG.select('.y.axis.right')
    .call(yAxisRight);

  var cartesian = d3.select("#cartesian svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var parallel = d3.select("#parallel svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

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

