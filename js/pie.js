var data=[];
var pie; 
var rate = [];
var path;
var arc;
var g2_pie;
function initializePie(){

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

}
function drawPie(baladiyye) {


    var svgdim = {
        width: $('.results').width(),
        height: $('.results').height()
    };

    d3.csv("data/ParticipationRate.csv",type, function(error, csv_data) {
        console.log(csv_data)
        console.log(data)
        rate[0] = {
            label: "Participated",
            Rate: parseFloat(data[baladiyye].Rate)
        };
        rate[1] = {
            label: "Didn't participate",
            Rate: 100 - parseFloat(data[baladiyye].Rate)
        }
        var pie_width = svgdim.width / 2;
        var pie_height = svgdim.height / 2.5;
        var radius = Math.min(pie_width, pie_height) / 2;

var color = d3.scale.ordinal()
            .range(['#F7B733', '#FC4A1A']);       


        var pie_svg = d3.select('#pie');


         arc = d3.svg.arc()
            .outerRadius(radius);


         pie = d3.layout.pie()
            .value(function(d) {
                console.log(d)
                return d.Rate;
            })
            .sort(null);

        var labelArc = d3.svg.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);

    path = pie_svg.datum(rate)
            .append("g")
            .attr('transform', 'translate(' + (pie_width / 2) +
                ',' + (pie_height / 1.5) + ')').selectAll(".piepath")
            .data(pie)
            .enter().append("path")
            .attr("class","piepath")
            .attr("fill", function(d, i) { return color(i); })
            .attr("d", arc)
             .on('mouseover', function(d) {
                pietip.show(d)

                }).on('mouseout', function(d) {

                    pietip.hide(d);
                })
            .each(function(d) { this._current = d; }); // store the initial angles

        var pietip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, -10])
            .html(function(d) {
                return "<strong>" + d.data.label + ":</strong> <span style='color:red'>" + d.data.Rate + "</span></strong>"
            })
        pie_svg.call(pietip);
       drawLegend(pie_svg,rate);
        
    });
}
function tweenPie(b) {
            var i = d3.interpolate({
                startAnglde: 1.1 * Math.PI,
                endAngle: 1.1 * Math.PI
            }, b);
            return function(t) {
                return arc(i(t));
            };
        }

function changePie(baladiyye){

    rate[0] = {
                label: "Participated",
                Rate: parseFloat(data[baladiyye].Rate)
            };
    rate[1] = {
                label: "Didn't participate",
                Rate: 100 - parseFloat(data[baladiyye].Rate)
            };
    pie.value(function(d){return d.Rate});
    //path = path.data(pie);
    path =  path.data(pie(rate)); // compute the new angles
   path.transition().duration(750).attrTween("d", tweenPie);

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
function type(d){
    data[d.City]=d;
    return d;
}