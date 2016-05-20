
function mapListener() {
    if (d3.event.target.className.baseVal != "env") {
    	destroyAll();

        d3.selectAll(".hide").each(function(d) {
            d3.select(this).attr("style", function(d) {
                var tempstyle = d3.select(this).attr("style");
                tempstyle += ";visibility:hidden";
                return tempstyle;
            })
        });
    }
    return;
}

function destroy(id) {
    d3.select(id).selectAll("*").remove();
}

function destroyAll() {
    destroy("#pie");
    destroy("#bubble");
    destroy("#hist");

}
function municipalityListener(){
    console.log("listner")
    drawPie();
    drawBubble();
    drawHistogram();

    var resultsSvg = d3.selectAll(".results");
    d3.selectAll(".hide").each(function(d) {
        d3.select(this).attr("style", function(d) {
            var tempstyle = d3.select(this).attr("style");
            tempstyle += ";visibility:visible";
            return tempstyle;
        })
    });
  
}