// margin and radius
//var margin = {top: 20, right: 20, bottom: 20, left: 20},
//var margin = {top: 30, right: 110, bottom: 10, left: 250},
var margin = {top: 30, right: 20, bottom: 10, left: 40},
    width = 600 - margin.right - margin.left, //width = 690
    height = 450 - margin.top - margin.bottom //height = 460
    radius = height/2;


  //var color = d3.scale.category20();
//  var color = d3.schemeCategory20;

var color = d3.scaleOrdinal()
    .range(d3.schemeCategory20)

//Which is the same of:
//var myScale = d3.scaleOrdinal(d3.schemeCategory20)


 /*   var color = d3.scaleOrdinal()
         .range(["#66b3ff", "#4da6ff", "#3399ff", 
                "#1a8cff", "#0080ff", "#0073e6", 
             	"#0066cc", "#0059b3", "#004d99", 
             	"#004080","#2c83c9","#2ba6e8"]);
*/	

// Setting color codes as per schemeCategory20;
/*	var color = d3.scaleOrdinal()
         .range(["#66b3ff", "#4da6ff", "#3399ff", 
                "#1a8cff", "#0080ff", "#0073e6", 
             	"#0066cc", "#0059b3", "#004d99", 
             	"#004080","#2c83c9","#2ba6e8"]);
		
				
				"#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78",
				"#2ca02c", "#98df8a", "#d62728", "#ff9896",
				"#9467bd", "#c5b0d5", "#8c564b", "#c49c94",
				"#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7",
				"#bcbd22", "#dbdb8d", "#17becf", "#9edae5"
*/


// arc generator
    var arc = d3.arc()
         .outerRadius(radius - 10)
         .innerRadius(100);

     var labelArc = d3.arc()
           .outerRadius(radius - 50)
           .innerRadius(radius - 50);   
// pie generator
         var pie = d3.pie()
             .sort(null)
             .value(function(d) { return d.count; });


// define svg
//var svg = d3.select("body").append("svg")
var svg = d3.select("#svgHolder").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");


// import data
    d3.csv("https://mondalutpal.github.io/country_wise_count10.csv", function(error, data) {
        if (error) throw error;

        // parse the data
        data.forEach(function(d) {
            d.count = +d.count;
            d.country = d.country;
        });

// append g elements (arc)
         var g = svg.selectAll(".arc")
             .data(pie(data))
             .enter().append("g")
             .attr("class","arc");

// append the path of the arc
       g.append("path")
          .attr("d", arc)
          .style("fill", function(d) {return color(d.data.country); })
          .transition()
          .ease(d3.easeLinear)
          .duration(2000)
          .attrTween("d", pieTween);
    
// append the text(labels)

//var labelling =  

g.append("text")
     .transition()
     .ease(d3.easeLinear)
     .duration(2000)
     .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")";})
     .attr("dy", ".35em")
     .text(function(d) {return d.data.country + " : " + d.data.count;} )


   
/*
//For Additional text
var svg1 = d3.select("body")
    .attr("width", "200")
    .attr("height", "300")
    .append("g")
    .attr("transform", "translate("700","200")")
	.text("This is additional text");
*/

	});







/* Try to put the labels with the same angle as the midangle
labelling.transition()
.attr("transform", "rotate(-90)");
*/


    function pieTween(b) {
        b.innerRadius = 0;
        var i = d3.interpolate({ startAngle: 0, endAngle: 0}, b);
        return function(t) { return arc(i(t));};
    };