function drawPie(baladiyye) {


    var svgdim = {
        width: $('.results').width(),
        height: $('.results').height()
    };
    console.log(svgdim)
    if (d3.select("#pie")[0][0] == null) {
        d3.select("body")
            .append("svg")
            .attr("id", "pie")
            .attr("class", "pie hide")
            .attr("width", svgdim.width / 2)
            .attr("height", svgdim.height / 2);
    }
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
        var pie_height = svgdim.height / 2;
        var radius = Math.min(pie_width, pie_height) / 2;

        var color = d3.scale.ordinal()
            .range(['#00CCCC', '#0099FF']);
        var hovercolor = d3.scale.ordinal()
            .range(['#0099CC', '#0066FF']);



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
                ',' + (pie_height / 2) + ')');


        var path = g2_pie
            .append('path')
            .attr('style', 'stroke:grey;cursor:pointer')
            .on('mouseover', function(d) {
                d3.select(this).attr('fill', function(d, i) {
                    return hovercolor(d.data.label);

                }).on('mouseout', function(d) {

                    pietip.hide(d);
                    d3.select(this).attr('fill', function(d) {
                        return color(d.data.label);

                    });

                });

                pietip.show(d)
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
        g2_pie
            .append("text")
            .attr("class", "pielabels")
            .text(function(d) {
                console.log(d)
                return d.data.label;
            })
            .attr("transform",
                function(d) {
                    return "translate(" + labelArc.centroid(d) + ")";
                });

        var pietip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>" + d.data.label + ":</strong> <span style='color:red'>" + d.data.Rate + "</span></strong>"
            })
        g2_pie.call(pietip);

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