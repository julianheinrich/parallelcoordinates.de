
var svgWidth = 300;
var svgHeight = 300;

var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

var domain = [0, 10];

var click = function() {
   // Ignore the click event if it was suppressed
  if (d3.event.defaultPrevented) return;

  var c = d3.mouse(this);
  var x1 = c[0] - margin.left;
  var x2 = c[1] - margin.top;
  
  var point = sampleSVG.append("circle")
      // .data([{x1:x1, x2:x2}])
      .style("stroke", "gray")
      .style("fill", "gray")  
      .attr("transform", "translate(" + x1 + "," + x2 + ")")
      .attr("r", 4)
      .attr("class", "dot")
      .style("cursor", "pointer")
      .call(drag);

  // create a parallel coordinates system by specifying
  // the axis-spacing vector [left axis, right axis]
  var d = [margin.left, width];
  // var pc = paco(d);

  // create a 1-flat (a point) in
  // N=2 dimensional space from c.
  // This creates a set of coefficients as
  // described above (c11, c10, c22, c20)
  // var point = paco.flat(1, 2, c);

  // get coordinates of points on the axes
  // (indexed points with one index), then
  // draw a line segment connecting these points
  // ip = pc.ip(point);
  // ip = paco.ip(x1, x2, d);

  var line = lineSVG.append("line")
    .style("stroke", "gray")
    .attr("x1", d[0])
    .attr("y1", yScale(xScale.invert(x1)))
    .attr("x2", d[1])
    .attr("y2", x2);  // same as yScale(yScale.invert(x2))

    // add the line as data to the point to make it accessible in dragmove
    point.data([line]);
}

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
  //.attr("viewBox", "0 0 " + svgWidth + " " + svgHeight)
  //.attr("preserveAspectRatio", "xMidYMid meet")
  .on("click", click)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
var lineSVG = d3.select("#parallel")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  //.attr("viewBox", "0 0 " + svgWidth + " " + svgHeight)
  //.attr("preserveAspectRatio", "xMidYMid meet")
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
  d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
  d.attr("y1", yScale(xScale.invert(x)))
      .attr("y2", y);
}

function layout() {
  var aspect = svgWidth/svgHeight;
  var targetWidth = $("#parallel").parent().width() * 0.4;

  svgWidth = targetWidth
  svgHeight = targetWidth / aspect;

  width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom

  xScale.range([0, width]);
  yScale.range([height, 0]);

  sampleSVG.select('.x.axis')
    .attr("transform", "translate(0," + height +")")
    .call(xAxis);  

  sampleSVG.select('.y.axis')
    .call(yAxisLeft);


  lineSVG.select('.y.axis.left')
    .call(yAxisLeft);  

  lineSVG.select('.y.axis.right')
    .call(yAxisRight);

  // var cartesian = $("#cartesian svg");
  // cartesian.attr("width", w);
  // cartesian.attr("height", h);
  // cartesian.on("click", click);

  // var parallel = $("#parallel svg");
  // parallel.attr("width", w);
  // parallel.attr("height", h);

}

$(document).ready(function() {

  //$(window).resize(layout);
  //layout();

});

