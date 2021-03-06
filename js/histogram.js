
  function initializeHistogram(){
    margin = {
        top: 50,
        right: 50,
        bottom: 30,
        left: 100
    };
    svgdim = {
      width: $('.results').width(),
      height: $('.results').height()
    };

    d3.select("#histdiv")
        .append("svg")
        .attr("id", "hist")
        .attr("class", "hide")
        .attr("viewBox", "0 0 " +(svgdim.width/2)+" "+ ((svgdim.height/2)-12));

    hist_width = (svgdim.width/2) / 1.5;
    hist_height = (svgdim.height/2) / 1.5;

    x = d3.scale.ordinal()
      .rangeRoundBands([0, hist_width], .1);

    y = d3.scale.linear()
      .range([hist_height, 0]);

    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5);
  hist_svg = d3.select("#hist")
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   hist_svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + hist_height + ")")
    .call(xAxis);


  }


  function drawHistogram(baladiye) {
   
    
      hist_svg.selectAll(".bar").data(data).exit().remove();



      d3.csv("data/"+baladiye+".csv", function(error, csv_data) {
          if (error) throw error;


          var totalVotes = d3.sum(csv_data, function(d) {
              return d.VoteNum;
          });
          var data = d3.nest()
              .key(function(d) {
                  return d.List;
              })
              .rollup(function(d) {
                  return d3.sum(d, function(g) {
                      return g.VoteNum;
                  });
              }).entries(csv_data);


          y.domain([0, 100]);

          x.domain(data.map(function(d) {
              return d.key;
          }));

           tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                  return "<strong>Percentage Of Votes: </strong> <span style='color:red'>" + (d.values / totalVotes * 100).toFixed(2) + "</span>"
              });

            hist_svg.select(".x").call(xAxis);


          hist_svg.select(".x").selectAll("text").attr("class","histogramLegendX")
            .attr("style","text-anchor:start")
            /*.attr("dy",function(d){
              return this.getComputedTextLength()/20+"em";
            });*/


          hist_svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Value");

          hist_svg.selectAll(".bar")
              .data(data)
              .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) {
                  return x(d.key);
              })
              .attr("width", x.rangeBand())

              .on("mouseover", tip.show)
              .on("mouseout", tip.hide)
              .attr("y",y(0))
              .attr("height",0)

              .transition().duration(1000)
              .attr("height", function(d) {
                  console.log(hist_height, y((d.values / totalVotes) * 100));
                  return hist_height - y((d.values / totalVotes) * 100);
              })
                 .attr("y", function(d) {
                  return y((d.values / totalVotes) * 100);
              }).delay(function(d,i){
                return i*500;
              });


            hist_svg.call(tip);


      });
  }

