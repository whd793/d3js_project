// BASIC MAP & LEGEND & COLOR SETTING VARIABLES----------------------------------------------------------------
var width = 600,
    height = 620,
    centered;

var envLow = "#D5E2FF",
    envMed = "#5CACEE",
    envHigh = "#10508B",
    envNa = "gray";


var envLegendData = [{
        "label": "High (20000 - 30000)",
        "color": envHigh
    },
    {
        "label": "Medium (10000 - 20000)",
        "color": envMed
    },
    {
        "label": "Low (0 - 10000)",
        "color": envLow
    },
    {
        "label": "N/A",
        "color": envNa
    }
];

var schLow = "red",
    schMed = "yellow",
    schHigh = "green",
    schNa = "gray";

var schLegendData = [{
        "label": "High",
        "color": schHigh
    },
    {
        "label": "Medium",
        "color": schMed
    },
    {
        "label": "Low",
        "color": schLow
    },
    {
        "label": "N/A",
        "color": schNa
    }
];
var visible = false;
var fvisible = false;



var projection = d3.geo.albers()
    .center([2, 54.65])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(3500)
    .translate([width / 1.4, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var smap = svg.append("g");
var margin = {
    top: 25,
    right: 35,
    bottom: 25,
    left: 80
};


// TOOLTIP ------------------------------------------------------

var tooltip = d3.select(".container").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var years = "2014";
var transp = "Car";

var widthz = 500 - margin.left - margin.right,
    heightz = 300 - margin.top - margin.bottom;

d3.select("#graphic")
    .append("svg")
    .attr("class", "graa")
    .attr("id", "graa")
    .attr("width", widthz + margin.left + margin.right)
    .attr("height", heightz + margin.top + margin.bottom)
    .append("text")
    .attr("x", widthz / 3)
    .attr("y", heightz / 1.7)
    .attr("font-size", "25pt")
    .style("fill", "lightgray")
    .text("Select a region");

d3.select("#graphictwo")
    .append("svg")
    .attr("class", "graa2")
    .attr("id", "graa2")
    .attr("width", widthz + margin.left + margin.right)
    .attr("height", heightz + margin.top + margin.bottom)
    .append("text")
    .attr("x", widthz / 3)
    .attr("y", heightz / 1.7)
    .attr("font-size", "25pt")
    .style("fill", "lightgray")
    .text("Select a region");


// FUNCTIONS CALLED ON PAGE LOAD ------------------------------------------------
plotTransportations();
showLegend("schLegend", 20, 120);
showLegend("envLegend", 20, 240);
console.log(years);
console.log(transp);

barchart();
d3.csv('json/publictransport2014.csv', function (error, datak) {
    
    smap.selectAll("path").data(datak)
    colorTran(transp);
    
colorTranBarz(transp);
});


plotAccidents();
colorAccidents();
//FUNCTIONS --------------------------------------------------------------------
// barchartdumy();
function barchart(){
    d3.select("#singlestate").remove();
    function parser(d) {
      d[transp] = +d[transp];
      //console.log(d.State_name)
      if (d.Region==d.Region)
      return d;
    }	
    function state_accept(data){
    var margin = {top: 125, right: 90, bottom: 0, left: 91},
        width = 1100 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
            
    var svg = d3.select("#state").append("svg").attr("id", "singlestate")
        .attr("width", width + margin.left + margin.right)
        .attr("height", (height+220) + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);
    
    var y = d3.scale.linear()
        .range([height, 0]);
    var flag1
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
        //.ticks(10, "%");
    var flag1;	
    x.domain(data.map(function(d) { return d.Region; }));
    y.domain([0, d3.max(data, function(d) { return d[transp] ; })]);
   
    
    var defs = svg.append("defs");

// create filter with id #drop-shadow
// height=130% so that the shadow is not clipped
var filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "110%");

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 1)
    .attr("result", "blur");

// translate output of Gaussian blur to the right and downwards with 2px
// store result in offsetBlur
filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 2)
    .attr("dy",2)
    .attr("result", "offsetBlur");

// overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important!
var feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");


     svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.Region); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d[transp]); })
          .attr("height", function(d) { return height - y(d[transp]); })
          .style("filter", "url(#drop-shadow)")
          
         
     
     svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          //.attr("transform", "rotate(-360)")
          .call(xAxis)
          .selectAll("text")
          .attr("y", 0)
          .attr("x", 9)
          .attr("dy", ".35em")
          .attr("transform", "rotate(90)")
          .style("text-anchor", "start")
        
        
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -45)
          .attr("dy", ".91em")
          .style("text-anchor", "end")
          .text("");
    
     svg.append("text")
          .attr("class", "graphtitle")
          .attr("y", -30)
          .attr("x", width/3)
          .style("text-anchor", "bottom")
          .style("font-size","30px")
          .text(years + " Transportation: " + transp);
    
     //console.log(data.Acceptance_Rate);	
    }
    
    
    d3.csv("json/publictransport"+years+".csv", parser, function(error, data) {
      state_accept(data);
     });
    
    }    
    


// FUNCTION: COLOR FOR NUMBER OF TRANSPORTATIONS (ON CLICK DROPDOWN) ----------------------

function colorTran(name) {
    var value;

    d3.selectAll("path")
        .attr("fill", function (d) {

            if (name == "Car") {

                color.domain([55, 75, 82]); //
                value = d["Car"];
            } else if (name == "Bus/coach") {

                color.domain([3.47, 6, 13]); //
                value = d["Bus/coach"];
            } else if (name == "Motorcycle") {

                color.domain([0.5, 1, 1.5]); //
                value = d["Motorcycle"];
            } else if (name == "Bicycle") {

                color.domain([2, 3.5, 5]); //
                value = d["Bicycle"];
            } else if (name == "National rail") {

                color.domain([0, 4, 12]); //
                value = d["National rail"];
            } else if (name == "Other rail") {

                color.domain([0, 0.8, 16]); //
                value = d["Other rail"];
            } else if (name == "All rail") {

                color.domain([1, 4, 35]); //
                value = d["All rail"];
            } else if (name == "Walk") {

                color.domain([8.47, 10, 13]); //
                value = d["Walk"];
            } else if (name == "Other modes") {

                color.domain([0.3, 0.9, 1.5]); //
                value = d["Other modes"];
            } else value = d.Region;

            console.log(value);
            return color(value);



        }).on("mouseover", function (d) {

            tooltip.transition()
                .duration(150)
                .style("opacity", .7);
            tooltip.html("" + d.Region + "<br>" + name + ": " + d[name] + " thousands")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("color", "white");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (d) {

  
            if (visible) {
                d3.select(".graa").remove();

                // d3.select(".graa2").remove();
                visible = false;
                // fvisible = false;

                barchartDummy(years, d.Region);
                // barchartDummyTwo("14",d.Region);

            } else {

                d3.select(".graa").remove();

                // d3.select(".graa2").remove();
                barchartDummy(years, d.Region);
                // barchartDummyTwo("14",d.Region);
                visible = true;
                // fvisible = false;
            }

            if (fvisible) {
                d3.select(".graa2").remove();

                // d3.select(".graa2").remove();
                fvisible = false;
                // fvisible = false;

                barchartDummyTwo(years,d.Region);
                // barchartDummyTwo("14",d.Region);

            } else {

                d3.select(".graa2").remove();

                // d3.select(".graa2").remove();
                barchartDummyTwo(years,d.Region);
                // barchartDummyTwo("14",d.Region);
                fvisible = true;
                // fvisible = false;
            }




        });
}


function colorTranBarz(name) {
    var value;

    d3.selectAll(".bar")
        .attr("fill", function (d) {

            if (name == "Car") {

                color.domain([55, 75, 82]); //
                value = d["Car"];
            } else if (name == "Bus/coach") {

                color.domain([3.47, 6, 13]); //
                value = d["Bus/coach"];
            } else if (name == "Motorcycle") {

                color.domain([0.5, 1, 1.5]); //
                value = d["Motorcycle"];
            } else if (name == "Bicycle") {

                color.domain([2, 3.5, 5]); //
                value = d["Bicycle"];
            } else if (name == "National rail") {

                color.domain([0, 4, 12]); //
                value = d["National rail"];
            } else if (name == "Other rail") {

                color.domain([0, 0.8, 16]); //
                value = d["Other rail"];
            } else if (name == "All rail") {

                color.domain([1, 4, 35]); //
                value = d["All rail"];
            } else if (name == "Walk") {

                color.domain([8.47, 10, 13]); //
                value = d["Walk"];
            } else if (name == "Other modes") {

                color.domain([0.3, 0.9, 1.5]); //
                value = d["Other modes"];
            } else value = d.Region;

            return color(value);



        }).on("mouseover", function (d) {

            tooltip.transition()
                .duration(150)
                .style("opacity", .7);
            tooltip.html("" + d.Region + "<br>" + name + ": " + d[name] + " thousands")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("color", "white");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
    }

function myFunction() {
    // years = document.getElementById("mySelect").value;
    // transp = document.getElementById("mySelecttwo").value;

    years = document.getElementById("myRange").value;
  var slidertwo = document.getElementById("myRangeTwo").value;


  if (slidertwo == 1) {
    transp = "Car";
} else if (slidertwo == 2) {
    transp = "Bus/coach"
} else if (slidertwo == 3){
    transp = "Motorcycle"
} else if (slidertwo == 4){
    transp = "Bicycle"
}else if (slidertwo == 5){
    transp = "National rail"
}else if (slidertwo == 6){
    transp = "Other rail"
}else if (slidertwo == 7){
    transp = "All rail"
}else if (slidertwo == 8){
    transp = "Walk"
}else if (slidertwo == 9){
    transp = "Other modes"
}
    console.log(years);
    console.log(transp);
    // console.log()


    d3.selectAll("circle").remove();
    d3.select(".graa").remove();
    d3.select(".graa2").remove();
    d3.select("#graphic")
        .append("svg")
        .attr("class", "graa")
        .attr("id", "graa")
        .attr("width", widthz + margin.left + margin.right)
        .attr("height", heightz + margin.top + margin.bottom)
        .append("text")
        .attr("x", widthz / 3)
        .attr("y", heightz / 1.7)
        .attr("font-size", "25pt")
        .style("fill", "lightgray")
        .text("Select a region");

        d3.select("#graphictwo")
        .append("svg")
        .attr("class", "graa2")
        .attr("id", "graa2")
        .attr("width", widthz + margin.left + margin.right)
        .attr("height", heightz + margin.top + margin.bottom)
        .append("text")
        .attr("x", widthz / 3)
        .attr("y", heightz / 1.7)
        .attr("font-size", "25pt")
        .style("fill", "lightgray")
        .text("Select a region");

    // d3.select(".graa2").remove();
    visible = false;
    fvisible = false;
    barchart();
    if (years == "2014") {
        d3.csv('json/publictransport2014.csv', function (error, datak) {

            smap.selectAll("path").data(datak)

           
            colorTran(transp);
            colorTranBarz(transp);

        });


    } else if (years == "2015") {
        d3.csv('json/publictransport2015.csv', function (error, datak) {

            smap.selectAll("path").data(datak)

            colorTran(transp);
            colorTranBarz(transp);
        });

    } else if (years == "2016") {
        d3.csv('json/publictransport2016.csv', function (error, datak) {

            smap.selectAll("path").data(datak)

            colorTran(transp);
            colorTranBarz(transp);
        });

    }
    showLegend("schLegend", 20, 120);
    showLegend("envLegend", 20, 240);
    plotAccidents();
    colorAccidents();
    
}


var color = d3.scale.linear()
    .range([schLow, schMed, schHigh]);

var colorValueAcc = d3.scale.linear()
    .range([envLow, envMed, envHigh]);

function colorAccidents() {
    function parser(d) {
        d.totalacc = +d.totalacc;
        //console.log(d.State_name)
        if (d.years == years)
            return d;
    }


    // if (years == "2014") {
    d3.csv("json/totalaccidents.csv", parser, function (data) {
        smap.selectAll("#school")
            .data(data)
            .attr("fill", function (d) {

                colorValueAcc.domain([5000, 12000, 24000]);
                return colorValueAcc(d.totalacc);
            });
    });

}


// DRAW MAP AND PLOT POINTS ------------------------------------------------------

function plotTransportations() {
    d3.json("json/uk2.json", function (error, counties) {
        smap.attr("id", "accidents")
            .selectAll(".state")
            .data(topojson.feature(counties, counties.objects.counties).features)
            .enter().append("path")
            .attr("class", "county")
            .attr("d", path);


    });

}

function plotAccidents() {

    function parser(d) {
        d.totalacc = +d.totalacc;
        //console.log(d.State_name)
        if (d.years == years)
            return d;
    }


    d3.csv("json/totalaccidents.csv", parser, function (data) {

        smap.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("id", "school")
            .attr("class", "school")
            .attr("class", function (d) {
                return d.label;
            })
            .attr("cx", function (d) {
                return projection([d.lon, d.lat])[0];
            })
            .attr("cy", function (d) {
                return projection([d.lon, d.lat])[1];
            })
            .attr("r", 8)
            // .style("fill", "red")	
            .style("opacity", 1)
            .on("mouseover", function (d) {
                d3.select(this)
                    .attr("r", 14);
                tooltip.transition()
                    .duration(150)
                    .style("opacity", .7);
                tooltip.html("# of accidents: " + d.totalacc)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style("color", "white");
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("r", 8);
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });;


    });
}



function barchartDummy(yea, reg) {
    if (!visible) {

        function parser(d) {
            d.tot = +d.tot;
            //console.log(d.State_name)
            if (d.label == reg && d.years == yea)
                return d;
        }
        d3.csv('json/ur.csv', parser, function (error, data) {


            var widthz = 500 - margin.left - margin.right,
                heightz = 300 - margin.top - margin.bottom;

            var svggg = d3.select("#graphic")
                .append("svg")
                .attr("class", "graa")
                .attr("id", "graa")
                .attr("width", widthz + margin.left + margin.right)
                .attr("height", heightz + margin.top + margin.bottom);

            var smap2 = svggg.append("g").attr("class", "aa")
                .attr("id", "aa").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // TOOLTIP ------------------------------------------------------

            var tooltip = d3.select(".container").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            var width = 460 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;

            var x = d3.scale.linear()
                .range([0, width])
                .domain([0, d3.max(data, function (d) {
                    return d.tot;
                })]);

            var y = d3.scale.ordinal()
                .rangeRoundBands([height, 0], .1)
                .domain(data.map(function (d) {
                    return d.urbanrural;
                }));

            //make y axis to show bar names
            var yAxis = d3.svg.axis()
                .scale(y)
                //no tick marks
                .tickSize(0)
                .orient("left");

            var gy = smap2.append("g")
                .attr("class", "y axis")
                .call(yAxis)

            var bars = smap2.selectAll(".bar")
                .data(data)
                .enter()
                .append("g")

            //append rects
            bars.append("rect")
                .attr("class", "bar")
                .attr("y", function (d) {
                    return y(d.urbanrural);
                })
                .attr("height", y.rangeBand())
                .attr("x", function (d) {
                    return y(d.tot);
                })
                .attr("width", function (d) {
                    return x(d.tot);
                })
                .style("fill", "#E59AB6");



            bars.append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("font-size", "12pt")
                .text(reg + ": Accident Urban/Rural");
            bars.append("text")
                .attr("class", "label")
                .attr("y", function (d) {
                    return y(d.urbanrural) + y.rangeBand() / 2 + 4;
                })
                .attr("x", "200")
                .text(function (d) {
                    return "Total: " + d.tot;
                });
        });
    }
}




function barchartDummyTwo(yea, reg) {
    if (!fvisible) {

        function parser(d) {
            d.tot = +d.tot;
            //console.log(d.State_name)
            if (d.label == reg && d.years == yea)
                return d;
        }
        d3.csv('json/sev.csv', parser, function (error, data) {


            var widthz = 500 - margin.left - margin.right,
                heightz = 300 - margin.top - margin.bottom;

            var svggg = d3.select("#graphictwo")
                .append("svg")
                .attr("class", "graa2")
                .attr("id", "graa2")
                .attr("width", widthz + margin.left + margin.right)
                .attr("height", heightz + margin.top + margin.bottom);

            var smap2 = svggg.append("g").attr("class", "aa")
                .attr("id", "aa").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // TOOLTIP ------------------------------------------------------

            var tooltip = d3.select(".container").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            var width = 460 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;

            var x = d3.scale.linear()
                .range([0, width])
                .domain([0, d3.max(data, function (d) {
                    return d.tot;
                })]);

            var y = d3.scale.ordinal()
                .rangeRoundBands([height, 0], .1)
                .domain(data.map(function (d) {
                    return d.sev;
                }));

            //make y axis to show bar names
            var yAxis = d3.svg.axis()
                .scale(y)
                //no tick marks
                .tickSize(0)
                .orient("left");

            var gy = smap2.append("g")
                .attr("class", "y axis")
                .call(yAxis)

            var bars = smap2.selectAll(".bar")
                .data(data)
                .enter()
                .append("g")

            //append rects
            bars.append("rect")
                .attr("class", "bar")
                .attr("y", function (d) {
                    return y(d.sev);
                })
                .attr("height", y.rangeBand())
                .attr("x", function (d) {
                    return y(d.tot);
                })
                .attr("width", function (d) {
                    return x(d.tot);
                })
                .style("fill", "#ffcd03");



            bars.append("text")
                .attr("x", 0)
                .attr("y", 0)
                .attr("font-size", "12pt")
                .text(reg + ": Accident Severity");
            bars.append("text")
                .attr("class", "label")
                .attr("y", function (d) {
                    return y(d.sev) + y.rangeBand() / 2 + 4;
                })
                .attr("x", "200")
                .text(function (d) {
                    return "Total: " + d.tot;
                });
        });
    }
}



//LEGEND START---------------------------------------------------------------------------
function showLegend(className, xOffset, yOffset) {
    if (className == "envLegend") {
        var data = schLegendData;
        var title = "# of transportations";
        var textOffset = 66;
    } else {
        var data = envLegendData;
        var title = "# of accidents";
        var textOffset = 30;

    }

    d3.selectAll("g." + className).remove();

    var legend = svg.selectAll("g." + className)
        .data(data)
        .enter().append("g")
        .attr("class", className);

    legend.append("text")
        .attr("x", xOffset)
        .attr("y", yOffset)
        .attr("font-size", "13pt")
        .text(title);

    legend.append("text")
        .attr("x", 10)
        .attr("y", 30)
        .attr("font-size", "14pt")
        .style("fill", "lightgray")
        .text("-Click or hover regions");


    legend.append("text")
    .attr("x", 10)
    .attr("y", 60)
    .attr("font-size", "14pt")
    .style("fill", "lightgray")
    .text("-Use mouse to drag or zoom");

    if (className == "envLegend") {
        legend.append("rect")
            .attr("x", xOffset)
            .attr("y", function (d, i) {
                return i * 18 + yOffset + 10;
            })
            .attr("width", 60)
            .attr("height", 18)
            .style("fill", function (d) {
                return d.color;
            });
    } else {
        legend.append("circle")
            .attr("cx", xOffset + 10)
            .attr("cy", function (d, i) {
                return i * 18 + yOffset + 18;
            })
            .attr("r", 6)
            .style("fill", function (d) {
                return d.color;
            });


    }

    legend.append("text")
        .attr("x", xOffset + textOffset)
        .attr("y", function (d, i) {
            return i * 18 + yOffset + 10;
        })
        .attr("dy", "14px")
        .text(function (d) {
            return d.label;
        });
}

// LEGEND END---------------------------------------------------------------------------

// ZOOM
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        smap.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
      
       
  });

svg.call(zoom);

