---
title: The Point-Line Duality
category: tutorial
layout: post
---

The point-line duality {% cite inselberg_plane_1985 %} is the most fundamental concept for parallel coordinates, as it provides the basis for mapping patterns from Cartesian to parallel coordinates and vice versa. The duality consists of two parts:

1. points in Cartesian coordinates are mapped to lines in parallel coordinates and
2. points in parallel coordinates are represented by lines in Cartesian coordinates.

The first part of the duality is straight-forward: mapping a point from Cartesian to parallel coordinates is a matter of locating the vertical position of the point-coordinates on the respective axes in parallel coordinates. The line that connects these two points is the line (in parallel coordinates) that represents a point (in Cartesian coordinates). To see how this works, add points to the Cartesian coordinate system on the left and see their *dual lines* appear in the parallel coordinate system on the right:

<link rel="stylesheet" type="text/css"
  href="{{site.baseurl}}/css/tutorial.css">
<style>

#cartesian {
  /*float: left;*/
  margin-right: 20px;
}

#parallel {
  /*float: right;*/
  margin-left: 20px;
}

</style>

<div id="container">
  <!-- <div id="cartesian"></div> -->
  <!-- <div id="parallel"></div> -->
</div>

<script type="text/javascript" src="{{site.baseurl}}/js/point_line_duality.js"></script>


####References

{% bibliography --cited %}