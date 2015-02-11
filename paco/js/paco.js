var grid;
var dataView;
var gridData;
//var data = [];
var dataView = {};
var pc;
var fileAPI = true;
var gui;

var currentFilter = {
		searchString: "",
		brushed: false
};

var globalData;
var globalDimensions;

function without(arr, item) {
	return arr.filter(function(elem) { return item.indexOf(elem) === -1; })
};

function log10(x) {
	return Math.log(x) / Math.LN10;
}

var colorMap = {};
var color = function(d) { return colorMap[d.id]; };
var createColormap = function(data, color) {
	color = (typeof color === 'undefined') ? "#000000" : color;
	data.forEach(function(d) {
		colorMap[d.id] = d3.rgb(0,0,0).toString();
	});
};

$(document).ready( function() {

	// not tested
	if (!window.File) {
		alert('The File API is not supported by your browser. Disabled file upload.');
		fileAPI = false;
	}

	$('a[href="#toggleControls"]').click(function(){
		$("#ui_section").toggle();
		$("#table_section,#pc_section").toggleClass("controls");
		layout();
	});

	pc = new d3.parcoords({webgl:true})("#pc_section")
		.margin({ top: 20, left: 0, bottom: 12, right: 0 });
	d3.csv('data/mtcars.csv', function(d) {
		globalData = d;
		createIDs(d);
		createColormap(d);
		pc
			.data(d)
			.color("black")
			.alpha(1.0)
			.variance(0.001)
			.hideAxis(["id"])
			.render()
			.createAxes()
			.reorderable()
			.brushMode("2D-strums");

		globalDimensions = pc.dimensions();

		setupVisibility();

	});

	pc.brush = "#FF0000";
	pc.blending = "source-over";
	pc.resetBrush = function() {
		createColormap(pc.data());
		pc.render();
	}

	pc.applyBrush = function() {
		var brushed = pc.brushed();
		if (brushed) {
			brushed.forEach(function(b) {
				colorMap[b.id] = pc.brush;
			});
			pc.color(color)
			.render();
		}
	};

	pc.removeBrushed = function() {
		var brushed = pc.brushed();
		if (brushed) {
			globalData = without(pc.data(), brushed);
			pc.data(data);
			pc.brushReset();
			pc.autoscale();
			pc.render();

			// dataView.beginUpdate();
			// for (i = 0; i < brushed.length; i++) {
			// 	dataView.deleteItem(brushed[i].id);
			// }
			// dataView.endUpdate();
		}
	};

	gui = new dat.GUI({ autoPlace: false });
	document.getElementById('ui_section').appendChild(gui.domElement);

	// gui.add(pc, 'search').onChange(function(searchString) {
	// 	currentFilter.searchString = searchString;
	// 	dataView.setFilterArgs(currentFilter);
	// 	dataView.refresh();
	// });


	gui.add(pc.state, 'alpha', 0.0, 1.0).onChange(function(value) {
		pc.render();
	});

	gui.add(pc.state, 'variance', 0.0, 0.1).onChange(function(value) {
		pc.variance(value).render();
	});

	pc.continuous = function() {
		if (pc.state.normalize) {
			pc.normalize(false);
			pc.composite('source-over');
		} else {
			pc.normalize(true);
			pc.composite("lighter");
		}
		pc.render();
	}

	gui.add(pc, 'continuous');

	pc.pca = function() {
		var matrix = [];
		var data = pc.data();
		var keys = [];
		data.map(function(d){
			var dd = d3.values(d);
			keys = d3.keys(d);
			d = dd.slice(0,d.length-1).map(parseFloat);
			var x = [];
			for (var i = 0; i < d.length; ++i) {
				if (!isNaN(d[i])) {
					x.push(d[i]);
					keys[i] = k[i];
				}
			}
			matrix.push(x);
		});
		var pca = new PCA();
		matrix = pca.scale(matrix,true,true);
		var newdata = pca.pca(matrix,2);
		pc.data(newdata)
		.render();
	}
	gui.add(pc, 'pca');

	// gui.add(pc.state, 'normalize').onChange(function(value) {
	// 	pc.render();
	// });

	// gui.add(pc.state, 'composite', ['source-over', 'lighter']).onChange(function(value) {
	// 	pc.render();
	// });

	var brushes = gui.addFolder('Brush');
	brushes.addColor(pc, 'brush');
	brushes.add(pc, 'applyBrush');
	brushes.add(pc, 'resetBrush');
	brushes.add(pc, 'removeBrushed');
	brushes.add(pc, 'mode', ['2D-strums', '1D-axes']).onChange(function(value) {
		pc = pc.brushMode(value);
	});

	// setup file upload
	var obj = $("#pc_section");
	obj.on('dragenter', function (e) {
		e.stopPropagation();
		e.preventDefault();
		//$(this).css('border', '2px solid #0B85A1');
	});
	obj.on('dragover', function (e) {
		e.stopPropagation();
		e.preventDefault();
	});
	obj.on('drop', function (e) {
		//$(this).css('border', '2px dotted #0B85A1');
		e.preventDefault();
		var files = e.originalEvent.dataTransfer.files;

		// load data
		loadFiles(files);
	});
	$(document).on('dragenter', function (e) {
		e.stopPropagation();
		e.preventDefault();
	});
	$(document).on('dragover', function (e) {
		e.stopPropagation();
		e.preventDefault();
		//obj.css('border', '2px dotted #0B85A1');
	});
	$(document).on('drop', function (e) {
		e.stopPropagation();
		e.preventDefault();
	});

	var layout = function() {
		var w=$(window).width();
		var h=$(window).height();

		pc.width($("#pc_section").width()).height($("#pc_section").height()).render();

		if (typeof grid !== 'undefined') {
			grid.resizeCanvas();
		}
	};

	layout();
	$(window).resize(layout);

});

		function setupGrid(data) {

			var columns = d3.keys(data[0]).map(function(row, i) {
				var col = {id: i, name: row, field: row, sortable: true, width: 200};
				return col;
			});

			var options = {
					enableCellNavigation: true,
					enableColumnReorder: false,
					forceFitColumns: true,
					enableAddRow: true
//					multiColumnSort: true
			};

			dataView = new Slick.Data.DataView({ inlineFilters: true });
			grid = new Slick.Grid("#table_section", dataView, columns, options);

			grid.onMouseEnter.subscribe(function(e, args) {
				var cell = args.grid.getCellFromEvent(e);
				item = dataView.getItem(cell.row);
				pc.highlight([item]);
			});

			grid.onMouseLeave.subscribe(function(e, args) {
				var cell = args.grid.getCellFromEvent(e);
				item = dataView.getItem(cell.row);
				pc.unhighlight([item]);
			});

			pc.on("brushend", function(d) {
				var brushed = pc.brushed();
				var ids = false;
				if (brushed) {
					ids = brushed.map(function(line) {
						return line.id;
					});
				}
				currentFilter.brushed = ids;
				dataView.setFilterArgs(currentFilter);

				dataView.refresh();

			});

			gridData = [];
			for (var i = 0; i < data.length; i++) {
				var d = data[i];
				gridData.push(d);
			}

			// wire up model events to drive the grid
			dataView.onRowCountChanged.subscribe(function (e, args) {
				grid.updateRowCount();
				grid.render();
			});

			dataView.onRowsChanged.subscribe(function (e, args) {
				grid.invalidateRows(args.rows);
				grid.render();
			});

			dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
				var isLastPage = pagingInfo.pageNum == pagingInfo.totalPages - 1;
				var enableAddRow = isLastPage || pagingInfo.pageSize == 0;
				var options = grid.getOptions();

				if (options.enableAddRow != enableAddRow) {
					grid.setOptions({enableAddRow: enableAddRow});
				}
			});


			var currentSortCmp = null;  
			grid.onSort.subscribe(function (e, args) {

				// declarations for closure
				var field = args.sortCol.field;
				var sign = args.sortAsc ? 1 : -1;
				var prevSortCmp = currentSortCmp;

				// store closure in global
				currentSortCmp = function (dataRow1, dataRow2) {

					var value1 = dataRow1[field], value2 = dataRow2[field];

					//if equal then sort in previous closure (recurs)
					if (value1 == value2 && prevSortCmp)
						return prevSortCmp(dataRow1, dataRow2);

					return (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
				};
				dataView.sort(currentSortCmp);

				grid.invalidate();
				grid.render();      
			});

			// initialize the model after all the events have been hooked up
			dataView.beginUpdate();
			dataView.setItems(gridData);
			dataView.setFilterArgs(currentFilter);
			dataView.setFilter(function(item, args) {
				if (args.brushed) {
					if (args.brushed.indexOf(item.id) !== -1) {
						return true;
					} else {
						return false;
					}
				}

				return true;
			});
			dataView.endUpdate();

		}

		function loadFiles(files) {
			if (files.length > 0) {
				var reader = new FileReader();
				var file = files[0];
				reader.onload = (function(file) { return function(e) {
					var data = (reader.result.indexOf("\t") < 0 ? d3.csv : d3.tsv).parse(reader.result);
					if (data.length > 0) {
						globalData = data;
						createIDs(data);
						createColormap(data);
						pc.clear("foreground")
							.data(data)
							.color(color)
							.detectDimensions()
							.autoscale()
							.hideAxis(["id"])
							.render()
							.reorderable()
							.createAxes();

						// setupGrid(data);
						pc.filename = file.name;
						gui.add(pc, 'filename');

						// remove previous dimensions before assigning
						// new ones
						globalDimensions.forEach(function(dim) {
							gui.remove(pc, dim);
						});
						
						globalDimensions = pc.dimensions();
						
						setupVisibility();

					} else {
						alert("no data or not in csv format!");
					}
				};})(file);
				reader.readAsText(file);
			}
		}

		setupVisibility = function() {

			globalDimensions.forEach(function(dim) {
				pc[dim] = true;
				gui.add(pc, dim).onChange(toggleVisibility);
			});
			// pc["id"] = false;
		}

		var toggleVisibility = function(value) {
			var hidden = globalDimensions.filter(function(dim) {
				return pc[dim] === false;
			});
			hidden.push("id");
			pc
				.data(globalData)
				.detectDimensions()
				.hideAxis(hidden)
				.render()
				.createAxes()
				.reorderable()


		};

		function createIDs(data) {
			if (data.length && typeof data[0].id === "undefined") {
				for (var i = 0; i < data.length; ++i) {
					data[i].id = i;
				}
			}
		}