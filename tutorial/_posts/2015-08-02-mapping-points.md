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

This little example constitutes our very first valid Parallel-Coordinates Plot:
On every axis, a little dot denotes the coordinate of our point $$P$$ for the respective dimension.
From this plot, we can *read* the coordinates of $$P$$ from the vertical position of all five dots.
<!-- Alfred Inselberg calls them *indexed points (with one index)* and uses a single index to describe each of these dots, so that $$p_1=3$$, $$p_2=7$$, and so on. -->
Note how we use two spatial dimensions overall: the vertical dimension conveys the actual coordinate, while the horizontal dimension is used to spread out all five axes. <!-- If you think of these two dimensions as a Cartesian coordinate system with the y-axis going from bottom to top and the x-axis from left to right, then we can use this *embedding* coordinate system to address all indexed points with two coordinates: assuming that 'Dimension 1' is at horizontal position 0 and the inter-axis distance $$d$$ is one, then $$p_1 = (0, 3)$$, $$p_2 = (1, 7)$$, etc. -->

Okay, so now we can visualize a single five-dimensional point with five one-dimensional points. What if we wanted to add another point to the visualization? Well, we simply repeat the above procedure and end up with two times five points:

<div id="parallel-points2" class="parcoords tutorial"></div>

On every axis, we can now see two dots, one for each of our two five-dimensional points. But which of the dots belong to the same point? From this visualization, we can't tell, because their is no *visual* cue that indicates the relationship between the position of a dot and the point-coordinate it represents. Note that this is a key difference to Cartesian coordinates, where the position of a dot uniquely identifies all coordinates of the point it represents.

A straight-forward way to solve this issue would be to use a second visual channel, such as color, to indicate which point a dot belongs to. While this a totally valid approach, it suffers from the fact that humans can not effectively distinguish many colors (I believe it was around 12). A better way to visually *connect* the dots is by drawing a straight line between adjacent pairs of points:

<div id="lines" class="parcoords tutorial"></div>

This results in $$N-1$$ line segments (or a single polygonal line) crossing all five dimensions at the respective coordinates for each point. This type of parallel-coordinates plot is what most people refer to when they talk about parallel coordinates.

This introductory post demonstrates two of the fundamentals ideas of parallel coordinates: 

1. **axes are drawn in parallel**.
2. **points are represented by lines**.

In contrast to Cartesian coordinates, where axes are layed out orthogonally, the idea to place them in parallel is what makes parallel coordinates *scalable* with the number of dimensions: in principle, we can visualize as many dimensions as we like, as we never run out of space for more axes. In practice, however, there are some issues arising from this layout that will be discussed in an extra post (such as chosing the order of axes).

Representing points with lines is only part of the story, and we will see in a later post that a *duality* between points and lines in Cartesian and parallel coordinates can be established.

<script src="{{site.baseurl}}/js/parallel-points.js"></script>