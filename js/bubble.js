  function drawBubble(baladiyye) {
       var svgdim = {
        width: $('.results').width(),
        height: $('.results').height()
    };
       if (d3.select("#bubble")[0][0] == null) {

                d3.select("body")
                    .append("div")
                    .attr("id", "testdiv")
                    .attr("class", "hide empty")
                    .attr("style", "position:relative;top:" + svgdim.height / 2 + "px")
                    .append("svg")
                    .attr("width", svgdim.width)
                    .attr("height", svgdim.height / 2)
                    .attr("id", "bubble")
                    .attr("class", "hide")


            }
     var  bubble_color = d3.scale.ordinal()
          .range(['#F59B84', '#EED2B0', '#F5B68C', '#C0EAC0', '#BDE0D1']);



      var bubble_svg = d3.select("#bubble");
      var bubble = d3.layout.pack()
          .sort(function(a, b) {
              return d3.ascending(parseInt(a["VoteNum"]), parseInt(b["VoteNum"]));
          })
          .size([$('#bubble').width(), $('#bubble').height()])
          .padding(1.5);




      d3.csv("data/Beirut.csv", function(error, data) {
          var bubbletip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                  console.log(d);
                  return "<strong>Name: </strong> <span style='color:red'>" + d.name.split("").reverse().join("") + "</span></strong><br><strong>Number of Votes: </strong> <span style='color:red'>" + d.value + "</span></strong>";
              });

          //convert numeric8l values from strings to numbers
          data = data.map(function(d) {

              d.name = d["CandidateName"];

              d.value = d["VoteNum"];

              d.list = d["List"];

              return d;
          });

          //bubbles needs very specific format, convert data to this.
          var nodes = bubble.nodes({
              children: data
          }).
          filter(function(d) {
              return !d.children;
          });

          //setup the chart
          var bubbles = bubble_svg.append("g")
              .attr("class", "bubbleGroup")
              .attr("transform", "translate(0,0)")
              .selectAll(".bubble")
              .data(nodes)
              .enter();

          //create the bubbles
          bubbles.append("circle")
              .attr("class", "bubbles")
              .attr("r", function(d) {
                  return 0
              })
              .attr("cx", function(d) {
                  return d.x;
              })
              .attr("cy", function(d) {
                  return d.y;
              })
              .style("fill", function(d) {
                  return bubble_color(d.list);
              })
              .on("mouseover", bubbletip.show)
              .on("mouseout", bubbletip.hide)
              .attr("opacity", 0)
              .transition().attr("opacity", 100)
              .attr("r", function(d) {
                  return d.r;
              }).delay(function(d, i) {
                  return i * 30;
              })




          //format the text for each bubble


          bubbles.append("text")
              .attr("x", function(d) {
                  return d.x;
              })
              .attr("y", function(d) {
                  return d.y + 5;
              })
              .attr("text-anchor", "middle")
              .text(function(d) {
                  return d["CandidateName"].split("").reverse().join("");
              })
              .style({
                  "fill": "white",
                  "font-family": "Helvetica Neue, Helvetica, Arial, san-serif",
                  "font-size": "12px"
              })
          bubble_svg.call(bubbletip);
          bubble_svg.selectAll("text").attr("style", function(d) {
              if (this.getComputedTextLength() > d.r * 2)
                  return "visibility:hidden";
              else
                  return "fill:white; font-family:Helvetica Neue Helvetica, Arial, san-serif;font-size: 12px";



          });
          var bub = d3.select(".bubbleContainer");

          var zoombubble = d3.behavior.zoom().on("zoom", function() {
              console.log("hi")
              bubble_svg.selectAll("circle").attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
              bubble_svg.selectAll("text").attr("style", function(d) {
                  if (this.getComputedTextLength() > d.r * 2 * d3.event.scale)
                      return "visibility:hidden";
                  else {

                      bubble_svg.selectAll("text").attr("transform", "translate(" + d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
                      return "fill:white; font-family:Helvetica Neue Helvetica, Arial, san-serif;font-size:" + 12 / (d3.event.scale * 0.9) + "px";
                  }
              });
             
          }).scaleExtent([1, 1000]);

          bubble_svg.call(zoombubble);
      });




  }