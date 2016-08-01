var window_width = $(window).width(),
    window_height = $(window).height();

function drawMap() {
    d3.select("#overlay")
    .on("click",mapListener);
    var mapsvg = d3.select("#mapContainer").append("svg")
        .attr("id", "mapsvg")
        .on("click", mapListener)
          .attr("viewBox", "0 0 " + window_width + " " + window_height )
        .attr("preserveAspectRatio", "xMinYMin");


    d3.json("Coordinates/2009_districts.json", function(error, Lebanon) {
        if (error) throw error;

        var projection = d3.geo.mercator()
            .scale(window_width*12)
            .center([36, 34])

        .translate([window_width / 2, window_height / 2]);

        var map_path = d3.geo.path()
            .projection(projection);

        var map_g = mapsvg.selectAll(".subunit-boundary")
            .data(Lebanon.features)
            .enter().append("g").attr("class", "districtContainer");

        map_g.append("path")
            .attr("d", map_path)
            .attr("fill-opacity", 0)
            .transition().duration(3000)
            .attr("fill-opacity", 1)
            .attr("class", function(d, i) {
                return "subunit-boundary " + i
            })
            .attr("id", function(d, i) {
                return "province" + i
            })

        drawDistrictNames(map_g, map_path);
        drawMunicipalities(mapsvg,map_g,map_path,projection);
        addMapLegend(mapsvg);
    });

}
function addMapLegend(mapsvg){
    d3.select("#mapContainer").append("div")
    .attr("style","position:relative;width:20%;height:30%;")
    .attr("id","divContainer")
    .append("i")
    .attr("id","envelopLegend")
      .attr("class", "fa fa-envelope")
      .attr("style","color:#F7B733;margin:2%")
    d3.select("#divContainer").append("h4")
    .attr("style", function(){
            return "font-size:0.8vw;position:relative;margin:2%; top:-10%;padding-left:1.3em"})
    .html(" Municipality, click for election info");
    d3.select("#divContainer").append("h4")
        .attr("style", "position:relative;margin:2%;font-size:0.8vw;")
        .html("Tip: Scroll to Zoom");
  
}

function drawMunicipalities(mapsvg,map_g,map_path, projection) {
    d3.json("Coordinates/baladiyetCoordinates.json", function(error, city) {
        console.log(city)
        mapsvg.selectAll(".env").data(city)
            .enter().append('g').attr('class', 'fontawesomeContainer')
            .append("text")
            .attr("font-family", "FontAwesome")
            .attr("class", "env")
            .on("click", function(d){
                console.log(d.City)
                municipalityListener(d.City)})
            .text(function(d) {
                return '\uf0e0';
            })
            .attr("transform", function(d, i) {
                return "translate(" + projection([d["Coordinates"][0], d["Coordinates"][1]]) + ")";
            })

            makeZoomable(mapsvg,map_g,map_path,projection)

    });


}

function makeZoomable(mapsvg,map_g,map_path,projection){

        var zoom = d3.behavior.zoom().on("zoom", function() {
            mapsvg.selectAll('.fontawesomeContainer').attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");

            map_g.attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
            //g.selectAll("circle")
            //.attr("r", nodeRadius / d3.event.scale);
            map_g.selectAll("path")
                .style('stroke-width', 0.5 / d3.event.scale)
                .attr("d", map_path.projection(projection));

            mapsvg.selectAll(".env").attr("style", function() {
                if (d3.event.scale != 1)
                    return "font-size:" + (12 / d3.event.scale) + 1 + "px";
            })

        }).scaleExtent([1, 1000]);

        mapsvg.call(zoom);
}
function drawDistrictNames(map_g, map_path) {
    map_g.append("text")
        .attr("font-size", "0.5vw")
        .attr("class", "districtName")
        .attr("transform", function(d) {
            if (d.properties.DISTRICT == "Zgharta")
                return "translate(" + map_path.centroid(d) + ") rotate(45)";
            else if (d.properties.DISTRICT.indexOf("Marja") >= 0)
                return "translate(" + map_path.centroid(d) + ") rotate(-25)";
            else if (d.properties.DISTRICT.indexOf("Jezzine") >= 0)
                return "translate(" + map_path.centroid(d) + ") rotate(25)";
            else
                return "translate(" + map_path.centroid(d) + ")";
        })
        .text(function(d) {

            if (d.properties.DISTRICT.indexOf("Beirut") < 0 && d.properties.DISTRICT.indexOf("Saida") < 0)
                return d.properties.DISTRICT
        })

    .attr("dx", function(d) {
            var disName = d.properties.DISTRICT;

            if (disName.indexOf("Miniyeh") >= 0)
                return "0.5em"
        })
        .attr("dy", function(d) {
            var disName = d.properties.DISTRICT;
            if (disName == "Zgharta" || disName == "Batroun")
                return "0.5em";
            else
                return "0em"
        })

    map_g.append("line")
        .attr("x1", function(d) {
            if (d.properties.DISTRICT.indexOf("Beirut-one") >= 0 || d.properties.DISTRICT.indexOf("Saida") >= 0)
                return map_path.centroid(d)[0];

        })
        .attr("y1", function(d) {
            if (d.properties.DISTRICT.indexOf("Beirut-one") >= 0 || d.properties.DISTRICT.indexOf("Saida") >= 0)
                return map_path.centroid(d)[1];

        })
        .attr("x2",
            function(d, i) {
                if (d.properties.DISTRICT.indexOf("Beirut-one") >= 0 || d.properties.DISTRICT.indexOf("Saida") >= 0)
                    return map_path.centroid(d)[0] - 30;

            })


    .attr("y2", function(d, i) {
            if (d.properties.DISTRICT.indexOf("Beirut-one") >= 0 || d.properties.DISTRICT.indexOf("Saida") >= 0) {

                return map_path.centroid(d)[1];

            }

        })
        .attr("style", "stroke:black;stroke-width:1");

    map_g.append("text")
        .attr("font-size", "0.5vw")
        .attr("class", "districtName")
        .text(function(d) {
            if (d.properties.DISTRICT.indexOf("Beirut-three") >= 0 || d.properties.DISTRICT.indexOf("Saida") >= 0) {
                if (d.properties.DISTRICT.indexOf("Beirut-three") >= 0)
                    return "Beirut"
                return d.properties.DISTRICT;
            }
        })
        .attr("transform", function(d, i) {
            if (d.properties.DISTRICT.indexOf("Beirut") >= 0 || d.properties.DISTRICT.indexOf("Saida") >= 0) {
                var xt = map_path.centroid(d)[0] - 60;
                var yt = map_path.centroid(d)[1] + Math.pow(-1, i) * 20;
                if (d.properties.DISTRICT.indexOf("three") < 0 && d.properties.DISTRICT.indexOf("Saida") < 0)
                    yt = map_path.centroid(d)[1] + Math.pow(-1, i) * 20;
                else {
                    yt = map_path.centroid(d)[1];
                }


                return "translate(" + xt + "," + yt + ")";
            }
        })
}