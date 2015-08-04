---
title: Representing Multidimensional Points in Parallel Coordinates
category: tutorial
layout: post
---

Visualizing points in more than three dimensions seems to be impossible, because each axis needs to be orthogonal to every other axis in Cartesian coordinates. A straight-forward solution to this problem is to describe one N-dimensional point using N one-dimensional points - one for each dimension:

<div class="container-fluid">
<div class="row">
<div id="parallel-points" class="img-responsive parcoords tutorial"></div>
</div>
</div>
<link rel="stylesheet" type="text/css"
  href="{{site.baseurl}}/css/tutorial.css">
<!-- <script src="/js/pacolib.js"/> -->
<!-- <script src="/js/parallel-points.js"/> -->
<link rel="stylesheet" type="text/css"
  href="{{site.baseurl}}/paco/css/d3.parcoords.css">
<script src="{{site.baseurl}}/paco/js/d3.parcoords.js"></script>

<script>

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
	  .ticks(5)
	  .axisDots(2);
};

$(window).resize(layout);
layout();

</script>
