d3.pcm = function() {

	var paths = [],
		selection = undefined,
		parcoords = [];

	var pcm = function(selection_) {

        selection = d3.select(selection_);

        // paths.forEach(function(path, i) {
        // 	var parcoords = d3.parcoords()("#pcm-" + i)
        // 		.data(data)
        // 		// .composite("darker")
        // 		.alpha(0.4)
        // 		.detectDimensions()
        // 		.dimensions(path)
        // 		.render()
        // 		.createAxes()
        // 		.brushMode("1D-axes")
        // 		.alphaOnBrushed(0.1);

        // 	pc.push(parcoords);
        // });

		return pcm;

	}

	/**
	 * Implementation according to:
	 * C. B. Hurley, Pairwise Display of High-Dimensional Information via
	 * Eulerian Tours and Hamiltonian Decompositions,
	 * Journal of Computational and Graphical Statistics,
	 * Bd. 19, S. 861-886, Dez. 2010.
	 */
	var hamiltonianDecompositionEven = function(n) {

	    if (n % 2) {
	    	return undefined;
	    }

	    var m = n / 2;	// no. of hamiltonian paths
	    var H = Array(m);
	    var i = m;
	    
	    // create prototype array initialised with 0's
		var tmp = Array(n);	
	    var j = n;
	    while (j--) tmp[j] = 0;
	    
	    // now initialise H
	    while (i--) {
	    	H[i] = tmp.slice();
	    }

	    var mone = [1, -1];
	    // first row of H
	    for (var j = 2; j <= n; ++j) {
	        var jj = j - 1; // adjust to zero-based indexing
	        var index = H[0][jj - 1];
	        index += mone[j % 2] * jj;
	        if (index < 0) index = n + index;  // compute negative modulus
	        index %= n;
	        H[0][jj] = index;
	    }

	    for (var k = 1; k < m; ++k) {
	        for (var j = 0; j < n; ++j) {
	            var index = (H[k - 1][j] + 1) % n;
	            H[k][j] = index;
	        }
	    }

	    return H;

	}

	computePaths = function(dimensions) {
		var n = dimensions.length;
		paths = hamiltonianDecompositionEven(n % 2 ? n - 1 : n);

		// prepend / append one dimension for odd n
		if (n % 2) {

			// because d3.parcoords.js does not support pointing to existing data
            // we now have to copy the data for all duplicated dimensions
            var key = dimensions[n - 1];
            var newKey = key + "2";

            data.forEach(function(car) {	
            	car[newKey] = car[key];
            });

            // update dimensions
            dimensions.push(newKey)

            // add indexes to hamiltonian paths
            for (var i = 0; i < paths.length; ++i) {
                paths[i].unshift(n - 1);
                paths[i].push(n);
            }

        }

        // d3.parcoords.js requires dimension names as keys, not indexes
        paths = paths.map(function(path) {
        	return path.map(function(index) {
        		return dimensions[index];
        	});
        });

	}

	pcm.data = function(data_) {
		parcoords = [];

		var dimensions = d3.keys(data_[0]);
		if (!dimensions.length) {
			return pcm;
		}
		
		computePaths(dimensions)

		selection.selectAll("div")
        	.data(paths)
          .enter()
        	.append("div")
        	.attr("class", "parcoords tutorial pcm")
			.attr("id", function(d, i) { return "pcm-" + i});

		paths.forEach(function(path, i) {
        	var pc = d3.parcoords()("#pcm-" + i)
        		.data(data_)
        		.detectDimensions()
        		.dimensions(path);

        	pc.on("brush", function(brushed) {
        		parcoords.forEach(function(p) {
        			if (p !== pc) {
        				p.brushReset();
	        			p.brushed(brushed);
	        			p.render();
        			}
        			
        		});
        	});

        	parcoords.push(pc);
        });

		pcm.resize();

		// create proxy functions
        [
        	"render", 
        	"highlight", 
        	"brush", 
        	"brushend", 
        	"axesreorder",
        	"alpha",
        	"detectDimensions",
        	"createAxes",
        	"brushMode",
        	"alphaOnBrushed"
        ]
        	.forEach(function(f) {
        		pcm[f] = function() {
        			var args = Array.prototype.slice.call(arguments);
        			parcoords.forEach(function(pc) {
        				pc[f].apply(pc, args);
        			});
        			return pcm;
        		}
    	});

        return pcm;

	}

	pcm.resize = function() {
		selection.style("height", (paths.length * $("#pcm").height()) + "px");
	}

	return pcm;
	
}

d3.csv('/data/cars.csv', function(data) {
  		
	data.forEach(function(car) {
		delete car.name;
		delete car.year;
	});

	var pcm = d3.pcm()("#pcm")
		.data(data)
		.alpha(0.1)
		.render()
		.createAxes()
		.brushMode("1D-axes")
		.alphaOnBrushed(0.1);

});