var currentDate = moment().format('L');
var currentCity = "";
var cities = [];
var defaultCity = "Salt Lake City"
var cityData = localStorage.getItem("cities");
var lastCityParse = JSON.parse(cityData);
var displayCity;
var daysAhead = 1;
var currentLat = "";
var currentLon = "";

function firstRender() {
    if (JSON.parse(localStorage.getItem("cities")) == null){
        displayCity = defaultCity
        $("#curNameDate").text(displayCity + " : " + currentDate)
        console.log(displayCity)
        getWeather()
    } else {
        displayCity = lastCityParse[lastCityParse.length - 1]
        $("#curNameDate").text(displayCity + ": " + currentDate)
        console.log(displayCity)
        getWeather()
    }
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
    

});

function getLocation() {
    var apiKey = "b83223f78956aa8a1f4ff4a30fa9435f"
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + displayCity + "&appid=" + apiKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        currentLon = response.coord.lon;
        currentLat = response.coord.lat;
        var temp = $("<p>").addClass("current").text("Temperature: " + ((response.main.temp - 273.15) * 1.80 + 32).toFixed(2) + " f");
        var humidity = $("<p>").addClass("current").text("Humidity: " + response.main.humidity + " %");
        var windSpeed = $("<p>").addClass("current").text("Wind Speed: " + response.wind.speed + " MPH");

        $("#curWeather").append(temp, humidity, windSpeed);

        // console.log("Temperature: " + temp + " f");
        // console.log("Humidity: " + humidity + "%");
        // console.log("Wind Speed: " + windSpeed + " MPH");
        console.log("Latitude: " + currentLat)
        console.log("Longitude: " + currentLon)

        getUV();
        getFive()
    })

};

function getUV() {
    var apiKey = "b83223f78956aa8a1f4ff4a30fa9435f"
    var queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + currentLat + "&lon=" + currentLon + "&appid=" + apiKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var uvIndex = $("<p>").addClass("current").text("UV Index: " + response.value);
        // console.log("UV Index: " + uvIndex)
        $("#curWeather").append(uvIndex);
    })
};

function getFive() {
    var apiKey = "b83223f78956aa8a1f4ff4a30fa9435f"
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + displayCity + "&appid=" + apiKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        for (let i = 5; i < response.list.length; i += 8) {
            // console.log("Temperature " + i + ": " + ((response.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(2)+ " f");
            var fiveDate = moment().add(daysAhead, 'days').format('L');
            //var fiveDate = $("<p>").addClass("fiveDay").text(response.list[i].clouds);
            //console.log(response.list[i].clouds.dt_txt)
            var date = $("<p>").addClass("fiveDay").text(fiveDate);
            var icon = $("<img>").addClass("fiveDay imageIcon").attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png")
            var fiveTemp = $("<p>").addClass("fiveDay").text("Temperature: " + ((response.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(2) + " f");
            var fiveHumid = $("<p>").addClass("fiveDay").text("Humidity: " + response.list[i].main.humidity + " %");
            var fiveCard = $('<div class="card" style="width: 15rem;">')
            //console.log(response.list[i].weather[0].icon)
            daysAhead++;
            $("#fiveDay").append($(fiveCard).append(date, icon, fiveTemp, fiveHumid));
        }


    })
};
