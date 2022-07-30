let celciusTemp = null;
let windSpeed = null;
let highTemperature = null;
let lowTemperature = null;
let feelsLike = null;
let coords = null;

let temperatureElement = document.querySelector("#degrees");
let cityElement = document.querySelector("#current-city");
let descriptionElement = document.querySelector("#description");
let windSpeedElement = document.querySelector("#wind");
let humidityElement = document.querySelector("#humidity");
let feelsLikeElement = document.querySelector("#feelslike");
let sunriseElement = document.querySelector("#sunrise");
let sunsetElement = document.querySelector("#sunset");
let dateElement = document.querySelector(".current__date");
let highTempElement = document.querySelector("#high-temp");
let lowTempElement = document.querySelector("#low-temp");
let iconElement = document.querySelector("#icon");

function formatDate(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "Fabruary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let date = new Date(timestamp);
  let day = days[date.getDay()];
  let month = months[date.getMonth()];
  let hours = date.getHours();
  if (hours.toString().length < 2) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes.toString().length < 2) {
    minutes = `0${minutes}`;
  }

  let currentDate = date.getDate();

  let formattedDate = `<small>Updated:</small> ${day} ${hours}:${minutes}, ${month} ${currentDate}`;

  return formattedDate;
}

function formatSunrise(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours.toString().length < 2) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes.toString().length < 2) {
    minutes = `0${minutes}`;
  }

  let formattedSunrise = `${hours}:${minutes}`;

  return formattedSunrise;
}

function formatSunset(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours.toString().length < 2) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes.toString().length < 2) {
    minutes = `0${minutes}`;
  }

  let formattedSunset = `${hours}:${minutes}`;

  return formattedSunset;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function formatForecastDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let forecastDay = date.getDate();
  let forecastMonth = date.getMonth() + 1;

  if (forecastDay.toString().length < 2) {
    forecastDay = `0${forecastDay}`;
  }

  if (forecastMonth.toString().length < 2) {
    forecastMonth = `0${forecastMonth}`;
  }

  let formattedForecastDate = `${forecastDay}.${forecastMonth}`;
  return formattedForecastDate;
}

let form = document.querySelector("#form");
form.addEventListener("submit", handleSubmit);

function displayFahrenheit(e) {
  e.preventDefault();
  let temp = document.querySelector("#degrees");

  celciusLink.classList.remove("active");
  fehrenheitLink.classList.add("active");

  let fahrenheitTempMain = Math.round((celciusTemp * 9) / 5 + 32);
  let fahrenheitTempMax = Math.round((highTemperature * 9) / 5 + 32);
  let fahrenheitTempMin = Math.round((lowTemperature * 9) / 5 + 32);
  let fahrenheitTempFeelsLike = Math.round((feelsLike * 9) / 5 + 32);

  temp.innerHTML = fahrenheitTempMain;
  feelsLikeElement.innerHTML = `${fahrenheitTempFeelsLike}°`;
  highTempElement.innerHTML = `${fahrenheitTempMax}°`;
  lowTempElement.innerHTML = `${fahrenheitTempMin}°`;

  let windSpeedFahrenheit = Math.round(windSpeed * 2.237);
  windSpeedElement.innerHTML = `${windSpeedFahrenheit} mph`;

  getForecast(coords, "imperial");
}

function displayCelcius(e) {
  e.preventDefault();
  celciusLink.classList.add("active");
  fehrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celciusTemp);
  windSpeedElement.innerHTML = `${windSpeed} m/s`;
  feelsLikeElement.innerHTML = `${feelsLike}°`;
  highTempElement.innerHTML = `${highTemperature}°`;
  lowTempElement.innerHTML = `${lowTemperature}°`;

  getForecast(coords, "metric");
}

let fehrenheitLink = document.querySelector("#fahrenheit-link");
fehrenheitLink.addEventListener("click", displayFahrenheit);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelcius);

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="forecast__title">Next 5 days forecast:</div>
  <div class="forecast__items" id="forecast">`;

  forecast.forEach(function (forecastDay, index) {
    let tempMax = Math.round(forecastDay.temp.max);
    let tempMin = Math.round(forecastDay.temp.min);

    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
  <div class="forecast__item">
            <div class="forecast__day">${formatDay(forecastDay.dt)}</div>
            <div class="forecast__date">${formatForecastDate(
              forecastDay.dt
            )}</div>
            <img class="forecast__icon"
            src="images/${forecastDay.weather[0].icon}.png" alt="${
          forecastDay.weather[0].description
        }">
        <div class="forecast__description">${
          forecastDay.weather[0].description
        }</div>
            <div class="forecast__temperature">
              <div class="forecast__temperature-high">${tempMax}°</div>
              <div class="forecast__temperature-low">${tempMin}°</div>
            </div>
            <div class="forecast__precipitation">
              Rain:
              <span class="details__value forecast__precipitation-value" id="precipitation">${Math.round(
                forecastDay.pop * 100
              )} %</span>
            </div>
          </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let units = "metric";

function getForecast(coordinates, units) {
  let apiKey = "29d24da46731d2929ff30f83f29c34d7";
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherCondition(response) {
  celciusLink.classList.add("active");
  fehrenheitLink.classList.remove("active");

  let temperature = Math.round(response.data.main.temp);
  let city = response.data.name;
  let country = response.data.sys.country;
  let description = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let sunrise = response.data.sys.sunrise * 1000;
  let sunset = response.data.sys.sunset * 1000;
  let date = response.data.dt * 1000;
  let icon = response.data.weather[0].icon;

  celciusTemp = response.data.main.temp;
  windSpeed = Math.round(response.data.wind.speed);
  highTemperature = Math.round(response.data.main.temp_max);
  lowTemperature = Math.round(response.data.main.temp_min);
  feelsLike = Math.round(response.data.main.feels_like);

  temperatureElement.innerHTML = temperature;
  cityElement.innerHTML = `${city}, ${country}`;
  descriptionElement.innerHTML = description;
  windSpeedElement.innerHTML = `${windSpeed} m/s`;
  humidityElement.innerHTML = `${humidity} %`;
  feelsLikeElement.innerHTML = `${feelsLike}°C`;
  sunriseElement.innerHTML = formatSunrise(sunrise);
  sunsetElement.innerHTML = formatSunset(sunset);
  dateElement.innerHTML = formatDate(date);
  highTempElement.innerHTML = `${highTemperature}°`;
  lowTempElement.innerHTML = `${lowTemperature}°`;

  iconElement.setAttribute("alt", description);
  iconElement.setAttribute("src", `images/${icon}.png`);
  iconElement.setAttribute("width", `100%`);

  coords = response.data.coord;
  getForecast(coords, "metric");
}

function searchLocation(position) {
  let apiKey = "29d24da46731d2929ff30f83f29c34d7";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayWeatherCondition);
}

function searchCity(city) {
  let apiKey = "29d24da46731d2929ff30f83f29c34d7";
  let units = "metric";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(displayWeatherCondition).catch(error);
}

function handleSubmit(e) {
  e.preventDefault();
  let city = document.querySelector("#city").value;

  if (city) {
    searchCity(city);
    if (!error) {
      document.querySelector("#city").value = "";
    }
  } else {
    alert(`🙌 Please enter a city`);
  }
}

function error(error) {
  let city = document.querySelector("#city").value;
  if (error) {
    alert(
      `🖍 Please check the spelling of city "${
        city.charAt(0).toUpperCase() + city.slice(1)
      }" name and type it again`
    );
    document.querySelector("#city").value = "";
  }
}

function getCurrentLocation(event) {
  event.preventDefault();
  celciusLink.classList.add("active");
  fehrenheitLink.classList.remove("active");
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentBtn = document.querySelector("#current-btn");
currentBtn.addEventListener("click", getCurrentLocation);

searchCity("Malaga");
