var currentDate = moment().format('L');
var currentCity = "Salt Lake City"


function firstRender() {
    $("#curNameDate").text(currentCity + ": " + currentDate)
    console.log(currentDate)
}