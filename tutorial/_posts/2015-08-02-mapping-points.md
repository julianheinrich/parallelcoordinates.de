---
title: Introduction
category: tutorial
layout: post
---

Let's assume we want to visualize a point $$P$$ with coordinates $$P = (3, 7, 5, 1, 9)$$ in $$N = 5$$ dimensions. This would be difficult to accomplish without projecting the point to a lower-dimensional space, because we can *perceive* up to 3 dimensions only. For practical applications, however, it is useful to project our data down to two dimensions so that we can display it on paper or computer screens. Although data visualization in three dimensions is possible in principle, there are some limitations that will be discussed at another time. For now, and for the remainder of this tutorial, we will always assume that we want to visualize data on a computer screen, i.e. in two dimensions.

So how can we visualize $$P$$ in two dimensions?
A simple approach is to project our single $$N$$-dimensional point to $$N$$ *one-dimensional* points and visualize every dimension independently. 
Here I use five axes (one for each dimension) and place them in *parallel*, one after the other:

<div id="parallel-points" class="parcoords tutorial"></div>

<link rel="stylesheet" type="text/css"
  href="{{site.baseurl}}/css/tutorial.css">
<link rel="stylesheet" type="text/css"
  href="{{site.baseurl}}/paco/css/d3.parcoords.css">
<script src="{{site.baseurl}}/paco/js/d3.parcoords.js"></script>

<script>

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

	// we need to assign a domain to every dimension because
	// for single values, d3.parcoords.js uses ordinal scales
	// for a dimension
	var domain = [0,1,2,3,4,5,6,7,8,9,10];

	var layout = function() {
		var aspect = 5;
		var w = $("#parallel-points").width();
		var h = w / aspect;
		//$("#parallel-points").height(h);
		
		pc.width(w);
		//   .height(h);

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
	};

	$(window).resize(layout);
	layout();

})();

</script>
This little example constitutes our very first valid Parallel-Coordinates Plot:
On every axis, a little dot denotes the coordinate of our point $$P$$ for the respective dimension.
Alfred Inselberg calls them *indexed points (with one index)* and uses a single index to describe each of these dots, so that $$p_1=3$$, $$p_2=7$$, and so on.
Note how we use two spatial dimensions overall: the horizontal dimension conveys the actual coordinate, while the vertical dimension is used to spread out all five axes. If you think of these two dimensions as a Cartesian coordinate system with the y-axis going from bottom to top and the x-axis from left to right, then we can use this *embedding* coordinate system to address all indexed points with two coordinates: assuming that 'Dimension 1' is at horizontal position 0 and the inter-axis distance $$d$$ is one, then $$p_1 = (0, 3)$$, $$p_2 = (1, 7)$$, etc.


