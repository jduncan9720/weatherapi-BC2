var currentDate = moment().format('L');
var currentCity = "";
var currentLon = "";
var currentLat = "";

function firstRender() {
    $("#curNameDate").text(currentCity + ": " + currentDate)
    console.log(currentDate)
}

$("#findCity").click(function(event){
    event.preventDefault();
    currentCity = $("#cityName").val()
    firstRender();
    getWeather();
    
});

function getWeather() {
    var apiKey = "b83223f78956aa8a1f4ff4a30fa9435f"
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + currentCity + "&appid=" + apiKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        currentLon = response.coord.lon;
        currentLat = response.coord.lat;
        var temp = (response.main.temp - 273.15) * 1.80 + 32;
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        
        console.log("Temperature: " + temp + " f");
        console.log("Humidity: " + humidity + "%");
        console.log("Wind Speed: " + windSpeed + " MPH");
        console.log("Longitude: " + currentLon)
        console.log("Latitude: " + currentLat)
        getUV();
    })
    
};

function getUV(){
    var apiKey = "b83223f78956aa8a1f4ff4a30fa9435f"
    var queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + currentLat + "&lon=" + currentLon + "&appid=" + apiKey

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        var uvIndex = response.value
        console.log("UV Index: " + uvIndex)
        
    })
};

