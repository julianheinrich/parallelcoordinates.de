---
title: Point-Line Duality
layout: default
---

The point-line duality is fundamental to parallel coordinates, as it provides the basis for the mapping of patterns from Cartesian to parallel coordinates and vice versa.

<style>

.axis text {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

#cartesian {
  float: left;
  margin-right: 20px;
}

#parallel {
  float: left;
  margin-left: 20px;
}

</style>

<div id="cartesian" style="float:left;margin-right:20px;"></div>
<div id="parallel" style="float:left;margin-right:20px;"></div>

  <script type="text/javascript">

    var margin = {top: 20, right: 20, bottom: 30, left: 20},
      width = 300 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    var domain = [0, 10];

    // setup x
    var xScale = d3.scale.linear()
      .domain(domain)
      .range([0,width]);
  
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
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .on("click", click)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
    var lineSVG = d3.select("#parallel")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
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
    .attr("class", "y axis")
    .attr("transform", "translate("+margin.left+",0)")
    .call(yAxisLeft); 

    lineSVG.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate("+width+",0)")
    .call(yAxisRight); 

    function click() {
      /** 
       * we describe a point in 2D with homogeneous coordinates (c10/c11, c20/c22, 1)
       * using two linearly independent linear equations:
       * 
       * (1) c11 * x1 = c10
       * (2) c22 * x2 = c20
       *
       * such that x1 = c10/c11 and x2 = c20/c22.
       * Given a point (x1, x2) in 2D we set c11 = c22 = 1
       * such that x1 = c10 and x2 = c20.
       */
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
          .attr("r", 5)
          .attr("class", "dot")
          .style("cursor", "pointer")
          .call(drag);

      // create a parallel coordinates system by specifying
      // the axis-spacing vector
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

        point.data([line]);
    }

    var drag = d3.behavior.drag()
                .on("drag", dragmove);

    function dragmove(d) {
      var x = d3.event.x;
      var y = d3.event.y;
      d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
      d.attr("y1", yScale(xScale.invert(x)))
          .attr("y2", y);


    }
  </script>