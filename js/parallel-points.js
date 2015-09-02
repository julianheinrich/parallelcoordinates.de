// // point coordinates for 5D point
// var point = [3, 7, 5, 1, 9];

// // inter-axis distance vector
// var d = [0, 1, 2, 3, 4];

// var dimensionLabels = ["dimension 1", "dimension 2", "dimension 3", "dimension 4", "dimension 5"];

// var margin = 20;
// var svgWidth = 600;
// var svgHeight = 300;
// var width = svgWidth - 2 * margin;
// var height = svgHeight - 2 * margin;

// var domain = [0, 10];

// var xScale = d3.scale.linear()
// 	.domain([Math.min.apply(this, d), Math.max.apply(this, d)])
// 	.range([margin, width]);

// // setup y
// var yScale = d3.scale.linear()
// 	.domain(domain)
// 	.range([height, margin]);

// var yAxis = d3.svg.axis()
//   	.scale(yScale)
//   	.orient("left");

// var svg = d3.select("#parallel-points")
//   .append("svg")
//   	.attr("width", svgWidth)
//   	.attr("height", svgHeight)

// svg.selectAll(".dimension")
//   	.data(d)
//   .enter().append("svg:g")
//   	.attr("class", "dimension")
//   	.attr("transform", function(d) { return "translate(" + xScale(d) + ")"; })
//   .append("svg:g")
//   	.attr("class", "axis")
//   	.attr("transform", "translate(0,0)")
//   	.each(function(d) { 
//   		d3.select(this).call(yAxis);
//   	})
//   .append("svg:text")
//   .attr({
//         "text-anchor": "middle",
//         "y": 0,
//         "transform": "translate(0,0)",
//         "x": 0,
//         "class": "label"
//       })
//   .text(function(d) { return dimensionLabels[d]});

var mappingPoints = (function() {

	var data = [
	  [3, 7, 5, 1, 9]
	];

	var pc = d3.parcoords({
		dimensionTitles: {
			0: "Dimension 1",
			1: "Dimension 2",
			2: "Dimension 3",
			3: "Dimension 4",
			4: "Dimension 5"
		}
	})("#parallel-points")
	  .data(data)
	  .detectDimensions()
	  .autoscale();

	var data2= [
	  [3, 7, 5, 1, 9],
	  [7, 1, 4, 8, 2]
	];

	var pc2 = d3.parcoords({
		dimensionTitles: {
			0: "Dimension 1",
			1: "Dimension 2",
			2: "Dimension 3",
			3: "Dimension 4",
			4: "Dimension 5"
		}
	})("#parallel-points2")
	  .data(data2)
	  .detectDimensions()
	  .autoscale()
	  .createAxes();

	var pc3 = d3.parcoords({
		dimensionTitles: {
			0: "Dimension 1",
			1: "Dimension 2",
			2: "Dimension 3",
			3: "Dimension 4",
			4: "Dimension 5"
		}
	})("#lines")
	  .data(data2)
	  .detectDimensions()
	  .autoscale()
	  .createAxes();

	// we need to assign a domain to every dimension because
	// for single values, d3.parcoords.js uses ordinal scales
	// for a dimension
	var domain = [0,1,2,3,4,5,6,7,8,9,10];

	var layout = function() {
		var aspect = 5;
		var w = $("#parallel-points").width();
		var h = w / aspect;
		
		pc.width(w);
		pc2.width(w);
		pc3.width(w);

		// BUG in d3.parcoords.js: 
		// resize resets all scales
		pc.dimensions().forEach(function(d) {
			pc.scale(d, domain);
		});

		pc.alpha(0)
		  .render()
		  .createAxes()
		  // .ticks(5)
		  .axisDots(2);

		pc2.alpha(0)
		  .commonScale()
		  .ticks(10)
		  .createAxes()
		  .render()
		  .axisDots(2);

		pc3.alpha(1)
		  .commonScale()
		  .ticks(10)
		  .createAxes()
		  .render()
		  .axisDots(2);

	};

	$(window).resize(layout);
	layout();

})();

