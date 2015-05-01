var grid;
var dataView;
var gridData;
//var data = [];
var dataView = {};
var pc;
var fileAPI = true;
var gui;
//var globalData;
var globalDimensions;
var colorMap = {};

var currentFilter = {
		searchString: "",
		brushed: false
};

function without(arr, item) {
	return arr.filter(function(elem) { return item.indexOf(elem) === -1; })
};

function log10(x) {
	return Math.log(x) / Math.LN10;
}

var color = function(d) { return colorMap[d.id]; };
var createColormap = function(data, color) {
	color = (typeof color === 'undefined') ? "#000000" : color;
	data.forEach(function(d) {
		colorMap[d.id] = d3.rgb(0,0,0).toString();
	});
};

$(document).ready( function() {

	// http://codereview.stackexchange.com/questions/66363/toggle-item-inside-a-bootstrap-dropdown-menu
	$('#brushing-menu a').click(function(e) {
		if(/strums/.test(this.id)) {
			$('#brushing-menu').addClass('strums');
		} else {
			$('#brushing-menu').removeClass('strums');
		}
		$('#brushing-text').text($(this).text());
	});

	$('#axis-menuitem').click(function(e) {
		pc.brushMode('1D-axes-multi');
	});
	
	$('#strums-menuitem').click(function(e) {
		pc.brushMode('2D-strums');
	});
	
	// not tested
	if (!window.File) {
		alert('The File API is not supported by your browser. Disabled file upload.');
		fileAPI = false;
	}

	pc = new d3.parcoords({webgl:false})("#pc_section")
	.margin({ top: 20, left: 50, bottom: 12, right: 0 });
	d3.csv('data/mtcars.csv', function(d) {
		loadData(d);
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
		pc
		.width($("#pc_section").width())
		.height($("#pc_section").height())
		.render();
	};

	$(window).resize(layout);

});

function loadData(data) {
//	globalData = data;
	createIDs(data);
	createColormap(data);
	pc
	.data(data)
	.color(color)
	.detectDimensions()
	.autoscale()
	.hideAxis(["id"])
	.render()
	.createAxes()
	.brushMode("1D-axes-multi")
	.shadows()
	.reorderable();

	// setupGrid(data);

	// remove previous dimensions before assigning
	// new ones

	globalDimensions = pc.dimensions();

	setupVisibility();
}

function loadFiles(files) {
	if (files.length > 0) {
		var reader = new FileReader();
		var file = files[0];
		reader.onload = (function(file) { return function(e) {
			var data = (reader.result.indexOf("\t") < 0 ? d3.csv : d3.tsv).parse(reader.result);
			if (data.length > 0) {
				loadData(data);
			} else {
				alert("no data or not in csv format!");
			}
		};})(file);
		reader.readAsText(file);
		$("#status_filename").text(file.name);
	}
}

setupVisibility = function() {

	globalDimensions.forEach(function(dim) {
		pc[dim] = true;
//		gui.add(pc, dim).onChange(toggleVisibility);
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