window.addEventListener('resize',resizeEverything,true)

function resizeEverything(){
    $("#results").css({
    "margin": "2%",
    "width": "90%",
    "height": "90%"
});
    $("#pieContainer").css({
        "margin": "2%",
        "width": $('#results').width()/2,
    "height": $('#results').height()/2
});

    $("#histdiv").css({
    "margin": "2%",
    "width": $('#results').width()/2,
    "height": $('#results').height()/2,
    "left": $('#results').width()/2 +12
});
$("#hist").attr("viewBox", "0 0 " +($('#results').width/2)+" "+ (($('#results').height/2))) 

    $("#testdiv").css({
    "margin": "2%",
    "width": $('#results').width(),
    "height": $('#results').height()/2
});
}
function showOverlay(){
    console.log("bol");
    d3.select("#overlay").attr("style","visibility:visible");
}
function hideOverlay(){

    d3.select("#overlay").attr("style","visibility:hidden");
}
function mapListener() {
    if (d3.event.target.className.baseVal != "env" || d3.event.target.id.baseVal == "overlay") {
    	destroyAll();
        hideOverlay();

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
    showOverlay();
    var resultsSvg = d3.selectAll(".results");
    d3.selectAll(".hide").each(function(d) {
        d3.select(this).attr("style", function(d) {
            var tempstyle = d3.select(this).attr("style");
            tempstyle += ";visibility:visible";
            return tempstyle;
        })
    });
  
}