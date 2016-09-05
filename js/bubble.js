  function initializeBubble(){
    svgdim = {
            width: $('.results').width(),
            height: $('.results').height()
            };

    d3.select("#testdiv")
        .attr("class", "hide empty")
        .append("svg")
        .attr("id", "bubble")
        .attr("class", "hide")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", "0 0 " +svgdim.width+" "+ (svgdim.height/2));
console.log($().width()- $('.results').width());
    legendGroup=d3.select("#testdiv").append("svg")
        .style("position", "absolute")
        .style("left", 0)
        .style("z-index", "999")
        .attr("transform","translate(0,0)")
        .append("g")
        .attr("class","bubbleLegendGroup");
    d3.select("#testdiv")
      .append("div")

      .style({
          "position":"absolute",
          "right":"10px",
          "top": ""+(svgdim.height/2)+"px",
          "z-index":"999"
      })

      .append("text")
      .attr("text-anchor", "middle")
      .style({
          "text-anchor":"middle",
          "fill": "black",
          "font-family": "Helvetica Neue, Helvetica, Arial, san-serif",
          "font-size": "20px"
      })
      .text("Scroll To Zoom")     
  }

  function drawBubble(baladiyye) {




      bubble_color = d3.scale.ordinal()
                        .range(['#007849','#F7B733', '#FC4A1A','#4ABDAC','#3366aa','#77aa77','#001100']);
              // .range(['#F59B84', '#EED2B0', '#F5B68C', '#C0EAC0', '#BDE0D1']);



      bubble_svg = d3.select("#bubble");
       bubble = d3.layout.pack()
          .sort(function(a, b) {
              return d3.ascending(parseInt(a["VoteNum"]), parseInt(b["VoteNum"]));
          })
          .size([$('#bubble').width(), $('#bubble').height()])
          .padding(1.5);




      d3.csv("data/"+baladiyye+".csv", function(error, data) {
           bubbletip = d3.tip()
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
          bubble_svg.selectAll(".bubbles").remove();


          //setup the chart
          bubbles = bubble_svg.append("g")
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
          drawBubbleLegend(data)   
      });




  }


  function drawBubbleLegend(votes){
 var  bubble_color = d3.scale.ordinal()
     .range(['#007849','#F7B733', '#FC4A1A','#4ABDAC','#3366aa','#77aa77','#001100']);
     
    


     lists=[];
 legendGroup.attr("transform","translate(0,0)");
    legendGroup.selectAll(".bubbleLegend").
    data(lists).exit().remove();
     legendGroup.selectAll(".legendText")
    .data(lists).exit().remove();
    votes.reverse()
d3.map(votes,function(d){
        if(lists.indexOf(d.list)==-1){
          console.log(d.list);
          lists.push(d.list);
          return d.list;
        }
    });
    legendGroup.selectAll(".bubbleLegend").
    data(lists).enter()
    .append("rect")
    .attr("class","bubbleLegend")
    .attr("position","absolute")
    .attr("width","10px")
    .attr("height","10px")
    .attr("y",function(d,i){
        return (i+1)+"em";
    })
    .attr("x",10)
    .attr('fill', function(d) {
        return bubble_color(d); 

    });
     legendGroup.selectAll(".legendText")
    .data(lists).enter()
    .append("text")
    .attr("class","legendText")
    .attr("style","position:absolute")
    .attr("y",function(d,i){
        return (i+1.5)+"em";
    })
    .attr("x",30)
    .text(function(d){
        return d;
    })
   

}

/*function updateBubble(baladiyye){


      d3.csv("data/"+baladiyye+".csv", function(error, data) {
        

          //convert numeric8l values from strings to numbers
          data = data.map(function(d) {

              d.name = d["CandidateName"];

              d.value = d["VoteNum"];

              d.list = d["List"];

              return d;
          });
          
          //bubbles needs very specific   format, convert data to this.
          var nodes = bubble.nodes({
              children: data
          }).
          filter(function(d) {
              return !d.children;
          });

          //setup the chart
          bubble_svg
              .selectAll(".bubble")
              .data(nodes)
              .enter().append("circle")
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
;

          //create the bubbles
         /* bubbles.append("circle")
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
              })*/




          //format the text for each bubble


          /*bubbles.append("text")
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
              })*/
              /*
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



}*/