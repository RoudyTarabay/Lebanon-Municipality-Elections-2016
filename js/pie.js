function drawPie(baladiyye) {


    var svgdim = {
        width: $('.results').width(),
        height: $('.results').height()
    };

    d3.select("#pieContainer")
        .attr("class","hide")
        .append("svg")
        .attr("id", "pie")
        .attr("class", "pie hide")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "0 0 " +(svgdim.width/2)+" "+ (svgdim.height/2));

    d3.csv("data/ParticipationRate.csv", function(error, csv_data) {
        var rate = [];
        rate[0] = {
            label: "Participated",
            Rate: parseFloat(csv_data[0].Rate)
        };
        rate[1] = {
            label: "Didn't participate",
            Rate: 100 - parseFloat(csv_data[0].Rate)
        }
        var pie_width = svgdim.width / 2;
        var pie_height = svgdim.height / 2.5;
        var radius = Math.min(pie_width, pie_height) / 2;

var color = d3.scale.ordinal()
            .range(['#F7B733', '#FC4A1A']);
        /*var color = d3.scale.ordinal()
            .range(['#00CCCC', '#0099FF']);*/
        /*var hovercolor = d3.scale.ordinal()
            .range(['#0099CC', '#0066FF']);*/



        var pie_svg = d3.select('#pie');


        var arc = d3.svg.arc()
            .outerRadius(radius);


        var pie = d3.layout.pie()
            .value(function(d) {
                console.log(d)
                return d.Rate;
            })
            .sort(null);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

        var g2_pie = pie_svg.selectAll(".pathgroup")
            .data(pie(rate))
            .enter().append("g")
            .attr("class", "pathgroup")
            .attr('transform', 'translate(' + (pie_width / 2) +
                ',' + (pie_height / 1.5) + ')');


        var path = g2_pie
            .append('path')
            .attr("class","piepath")
            .attr('style', 'stroke:grey;cursor:pointer')
            .on('mouseover', function(d) {
                pietip.show(d)

                }).on('mouseout', function(d) {

                    pietip.hide(d);
                    d3.select(this).attr('fill', function(d) {
                        return color(d.data.label);

                    });

                })


        .attr('fill', function(d, i) {
                return color(d.data.label);
            }) // UPDATED (removed semicolon)
            .each(function(d) {
                this._current = d;
            })

        .transition()
            .duration(2000)
            .attrTween("d", tweenPie);


        var pietip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>" + d.data.label + ":</strong> <span style='color:red'>" + d.data.Rate + "</span></strong>"
            })
        g2_pie.call(pietip);
        drawLegend(pie_svg,rate);
        function tweenPie(b) {
            var i = d3.interpolate({
                startAngle: 1.1 * Math.PI,
                endAngle: 1.1 * Math.PI
            }, b);
            return function(t) {
                return arc(i(t));
            };
        }
    });



}

function drawLegend(pie_svg,rate){

var color = d3.scale.ordinal()
            .range(['#F7B733', '#FC4A1A']);
    var legendGroup=d3.select("#pieContainer").append("svg")
        .style("position", "absolute")
        .style("z-index", "999")
        .style("left", "0")
        .attr("transform","translate(0,0)")
        .append("g")
        .attr("class","pieLegendGroup");


    legendGroup.selectAll(".pieLegend").
    data(rate).enter()
    .append("rect")
    .attr("position","absolute")
    .attr("width","10px")
    .attr("height","10px")
    .attr("y",function(d,i){
        return (i+1)+"em";
    })
    .attr("x",10)
    .attr('fill', function(d) {
        return color(d.label);

    });
     legendGroup.selectAll(".pieLegend").
    data(rate).enter()
    .append("text")
    .attr("style","position:absolute")
    .attr("y",function(d,i){
        return (i+1.5)+"em";
    })
    .attr("x",30)
    .text(function(d){
        return d.label;
    })

    legendGroup.attr("transform","translate(0,0)");


}
