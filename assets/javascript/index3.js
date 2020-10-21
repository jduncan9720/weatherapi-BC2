var currentDate = moment().format('L');
var currentCity = "";
var cities = [];
var cityData = localStorage.getItem("cities");
var lastCityParse = JSON.parse(cityData);
var currentLon = "";
var currentLat = "";
var cityBtn = "";

function firstRender() {

    if (JSON.parse(localStorage.getItem("cities")) == null) {
        displayCity = "Salt Lake City"
        cities.push(displayCity)
        localStorage.setItem("cities", JSON.stringify(cities))
        $("#curNameDate").text(displayCity + " : " + currentDate)
    } else {
        displayCity = lastCityParse[lastCityParse.length - 1]
        $("#curNameDate").text(displayCity + ": " + currentDate)
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
        cityBtn = $('<button class="cityClick">').text(lastCityParse[i])
        $(".btnDiv").append(cityBtn)
    }
}

function getWeather() {
    $("#curWeather").empty();
    var apiKey = "b83223f78956aa8a1f4ff4a30fa9435f"
    var queryURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + currentLat + "&lon=" + currentLon + "&appid=" + apiKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        var temp = $("<p>").addClass("current").text("Temperature: " + ((response.current.temp - 273.15) * 1.80 + 32).toFixed(2) + " f");
        var humidity = $("<p>").addClass("current").text("Humidity: " + response.current.humidity + " %");
        var windSpeed = $("<p>").addClass("current").text("Wind Speed: " + response.current.wind_speed + " MPH");
        var uvIndex = $("<p>").addClass("current").text("UV Index: " + response.current.uvi);

        $("#curWeather").append(temp, humidity, uvIndex, windSpeed);
    })
}



