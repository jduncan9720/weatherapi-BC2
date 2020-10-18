var currentDate = moment().format('L');
var currentCity = ""

function firstRender() {
    $("#curNameDate").text(currentCity + ": " + currentDate)
    console.log(currentDate)
}

$("#findCity").click(function(){
    currentCity = $("#cityName").val()
    firstRender()
})