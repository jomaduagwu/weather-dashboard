// Define the API key and API URL from OpenWeatherMap
var apiKey = "d790997ca229b3abb8cc2c3ff03ae371";
var apiUrl = "https://api.openweathermap.org/data/2.5/"; 

// get references to the HTML elements
var searchForm = document.querySelector("#search-form");
var cityInput = document.querySelector("#city-input");
var searchBtn = document.querySelector("#search-btn");
var searchHistory = document.querySelector(".search-history");
var currentWeather = document.querySelector(".current-weather");
var fiveDayForecast = document.querySelector(".five-day-forecast");
var recentCities = document.querySelector(".recent-searches");
var cityList = document.querySelector(".city-list");

// add an event listener to the search form
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // get the city name from the search input
  var cityName = cityInput.value;

  // set the five day forecast url
  var openweather = `${apiUrl}weather?q=${cityName}&appid=${apiKey}&units=imperial`;

  // set a GET request to openweather and handle the response
  fetch(openweather)
    .then((response) => {
        // .then(response => response.json())
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
  
    })
    .then((data) => {

      // Extract the weather data from the API response
      var cityName = data.name;
      var date = new Date(data.dt * 1000);
      var iconCode = data.weather[0].icon;
      var temp = data.main.temp;
      var wind = data.wind.speed;
      var humidity = data.main.humidity;
     console.log(data);

      // Update the dashboard with the weather data
      currentWeather.querySelector("#city").textContent = cityName;
      currentWeather.querySelector("#date").textContent = date.toLocaleDateString();
      currentWeather.querySelector("#weather-icon").setAttribute("src", `http://openweathermap.org/img/w/${iconCode}.png`);
      currentWeather.querySelector("#temp").textContent = temp;
      currentWeather.querySelector("#wind").textContent = wind;
      currentWeather.querySelector("#humidity").textContent = humidity;

        // Use the city name to fetch the 5-day forecast for the city        
        var fiveForecast = `${apiUrl}forecast?q=${cityName}&appid=${apiKey}&units=imperial`;
        fetch(fiveForecast) 
        .then(response => response.json())

        .then(data => {
          // filter forecast to display weather at noon only for each day
          var noonForecast = data.list.filter(item => new Date(item.dt * 1000).getHours() === 12);
          
        // Update the 5-day forecast section with the relevant data
        var fiveDayForecastCardsEl = document.querySelectorAll(".five-day-forecast .card");
        for (let i = 0; i < fiveDayForecastCardsEl.length; i++) {
          var card = fiveDayForecastCardsEl[i];
          var dateEl = card.querySelector(".card-title");
          var weatherIconEl = card.querySelector(".five-day-img");
          var tempEl = card.querySelector(".five-day-temp");
          var windEl = card.querySelector(".five-day-wind");
          var humidityEl = card.querySelector(".five-day-humid");

          var forecastIndex = i * 8 + 4;
          dateEl.textContent = new Date(data.list[forecastIndex].dt * 1000).toLocaleDateString();
          weatherIconEl.src = `https://openweathermap.org/img/w/${data.list[forecastIndex].weather[0].icon}.png`;
          tempEl.textContent = data.list[forecastIndex].main.temp.toFixed(1);
          windEl.textContent = data.list[forecastIndex].wind.speed.toFixed(1);
          humidityEl.textContent = data.list[forecastIndex].main.humidity.toFixed(1);
        }
      });
    })
  .catch(error => console.error(error));      
});
      // Store the searched city in local storage
      var searchHistory= JSON.parse(localStorage.getItem("searchHistory")) || [];
      searchHistory.push(cityName);
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

      cityList.innerHTML = "";

       // Loop through the search history array and create list items to display the city names
      for (var i = 0; i < searchHistory.length; i++) {
        var cityName = searchHistory[i];
        var li = document.createElement("li");
        li.textContent = cityName;
        cityList.appendChild(li);
      }
    
     