var currentDate = moment().format('L');
var currentCity = "";
var cities = [];
var cityData = localStorage.getItem("cities");
var lastCityParse = JSON.parse(cityData);
var currentLon = "";
var currentLat = "";
var cityBtn = "";
var uv = "";

$(document).ready(firstRender);

function firstRender() {

    if (JSON.parse(localStorage.getItem("cities")) == null) {
        displayCity = "Salt Lake City"
        cities.push(displayCity)
        localStorage.setItem("cities", JSON.stringify(cities))
        //$("#curNameDate").text(displayCity + " : " + currentDate)
    } else {
        displayCity = lastCityParse[lastCityParse.length - 1]
        //$("#curNameDate").text(displayCity + ": " + currentDate)
        console.log(displayCity) 
    }
    getLocation()
    renderButtons()
}

function getLocation() {
    var apiKey = "b83223f78956aa8a1f4ff4a30fa9435f"
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + displayCity + "&appid=" + apiKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        currentLon = response.coord.lon;
        currentLat = response.coord.lat;
        console.log("Latitude: " + currentLat)
        console.log("Longitude: " + currentLon)
        getWeather()
    });
}

$("#findCity").click(function (event) {
    event.preventDefault();
    if (JSON.parse(localStorage.getItem("cities")) !== null) {
        cities = JSON.parse(localStorage.getItem("cities"));
    }
    currentCity = $("#cityName").val()
    cities.push(currentCity)
    localStorage.setItem("cities", JSON.stringify(cities))

    cityData = localStorage.getItem("cities");
    lastCityParse = JSON.parse(cityData);
    firstRender();
})

function renderButtons() {
    $(".btnDiv").empty();
    for (let i = 0; i < lastCityParse.length; i++) {
        cityBtn = $('<button class="btn btn-primary cityClick">').text(lastCityParse[i])
        $(".btnDiv").append(cityBtn)
    }
}

function getWeather() {
    $("#curWeather").empty();
    $("#fiveDay").empty();
    var apiKey = "b83223f78956aa8a1f4ff4a30fa9435f"
    var queryURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + currentLat + "&lon=" + currentLon + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        uv = response.current.uvi
        var currIcon = $("<img>").addClass("current imageIcon").attr("src", "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png")
        $("#curNameDate").text(displayCity + " : " + currentDate);
        $("#curNameDate").append(currIcon);
        var temp = $("<p>").addClass("current").text("Temperature: " + ((response.current.temp - 273.15) * 1.80 + 32).toFixed(2) + " " + String.fromCharCode(8457));
        var humidity = $("<p>").addClass("current").text("Humidity: " + response.current.humidity + " %");
        var windSpeed = $("<p>").addClass("current").text("Wind Speed: " + response.current.wind_speed + " MPH");
        var uvIndex = $("<p>").addClass("current").text("UV Index: ").append("<span id=uvColor class'>" + uv + '</span>');

        $("#curWeather").append(temp, humidity, windSpeed, uvIndex);
        console.log(uv)
        console.log("Icon: " + "http://openweathermap.org/img/wn/" + response.daily[1].weather[0].icon + "@2x.png")
        console.log("Temp: " + ((response.daily[1].temp.day - 273.15) * 1.80 + 32).toFixed(2) + " f")
        console.log("Humidity: " + response.daily[1].humidity + " %")

        for (var i = 1; i <= 5; i++) {
            var epochDate = response.daily[i].dt;
            var fiveCard = $('<div class="card" style="width: 15rem;">')
            var fiveDate = $("<p>").addClass("fiveDay").text(moment.unix(epochDate).format('L'));
            var fiveIcon = $("<img>").addClass("fiveDay imageIcon").attr("src", "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png")
            var fiveTemp = $("<p>").addClass("fiveDay").text("Temperature: " + ((response.daily[i].temp.day - 273.15) * 1.80 + 32).toFixed(2) + " " + String.fromCharCode(8457));
            var fiveHumid = $("<p>").addClass("fiveDay").text("Humidity: " + response.daily[i].humidity + " %");
            
            $("#fiveDay").append($(fiveCard).append(fiveDate, fiveIcon, fiveTemp, fiveHumid));
            
       }uvColor()
    })  
}

$(".btnDiv").on("click", ".cityClick", function(event){
    event.preventDefault();
    var buttonCity = $(this).text()
    console.log(buttonCity)
    displayCity = buttonCity
    getLocation()
})

function uvColor(){
    console.log(uv)
    if (uv <= 2.99){
    $("#uvColor").addClass("uvLow")
    }if (uv > 3 && uv <= 5.99){
        $("#uvColor").addClass("uvModerate")
    }if (uv > 6){
        $("#uvColor").addClass("uvHigh")
    }
}