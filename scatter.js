var margin = { top: 30, right: 270, bottom: 70, left: 50 },
    outerWidth = 1200,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var name = "Name"
	xCat = "Revenue",
    yCat = "Profit",
    rCat = "Employee",
    colorCat = "Country";

d3.csv("https://mondalutpal.github.io/fortune500.csv", function(data) {
  data.forEach(function(d) {
    d.Revenue = +d.Revenue;
    d.Profit = +d.Profit;
	d.Employee = +d.Employee;
  });

  var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.10,
      xMin = d3.min(data, function(d) { return d[xCat]; }),
      xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
      yMin = d3.min(data, function(d) { return d[yCat]; }) * 1.30,
      yMin = yMin > 0 ? 0 : yMin;

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);
  
  var formatValue = d3.format(".2s");
  

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height)
	  .tickFormat(function(d) { return formatValue(d)});

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width)
	  .tickFormat(function(d) { return formatValue(d)});

  var color = d3.scale.category20();
  
  /*
  
  By looking at the source code for that method:

d3.scale.category20 = function() {
    return d3.scale.ordinal().range(d3_category20);
};
var d3_category20 = [
  0x1f77b4, 0xaec7e8,
  0xff7f0e, 0xffbb78,
  0x2ca02c, 0x98df8a,
  0xd62728, 0xff9896,
  0x9467bd, 0xc5b0d5,
  0x8c564b, 0xc49c94,
  0xe377c2, 0xf7b6d2,
  0x7f7f7f, 0xc7c7c7,
  0xbcbd22, 0xdbdb8d,
  0x17becf, 0x9edae5
].map(d3_rgbString);
You should be able to call d3.scale.ordinal().range(...) on your own color list.
  
  */
  
  

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return name + ": " + d.Name + "</br>" + xCat + ": $" + d[xCat] + " M" + "<br>" + yCat + ": $" + d[yCat] + " M";
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 42)
      .style("text-anchor", "end")
      .text(xCat + " (" + "in $ M" + ")")
	  .style("font-weight", "bold")
	  .style("fill", "blue");

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yCat + " (" + "in $ M" + ")")
	  .style("font-weight", "bold")
	  .style("fill", "blue");

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  objects.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .classed("dot", true)
      //.attr("r", function (d) { return 6 * Math.sqrt(d[rCat] / Math.PI); })
	  .attr("r", function (d) { return Math.sqrt(d[rCat]/2000); })
      .attr("transform", transform)
      .style("fill", function(d) { return color(d[colorCat]); })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

//Set the Legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .classed("legend", true)
      .attr("transform", function(d, i) { return "translate(0," + i * 12 + ")"; });

  legend.append("circle")
      .attr("r", 3.5)
      .attr("cx", width + 20)
      .attr("fill", color);

  legend.append("text")
      .attr("x", width + 26)
      .attr("dy", ".35em")
	  .style("font-size", "11px")
	  .style("font", "sans-serif")
      .text(function(d) { return d; });


  d3.select("input").on("click", change);

  function change() {
    xCat = "Carbs";
    xMax = d3.max(data, function(d) { return d[xCat]; });
    xMin = d3.min(data, function(d) { return d[xCat]; });

    zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

    var svg = d3.select("#scatter").transition();

    svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat);

    objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
  }

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }
});