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

  let formattedDate = `<small>Updated</small>: ${day} ${hours}:${minutes} ${month} ${currentDate}`;

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

function searchCity(city) {
  let apiKey = "29d24da46731d2929ff30f83f29c34d7";
  let units = "metric";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(url).then(displayWeatherCondition);
}

function handleSubmit(e) {
  e.preventDefault();
  let city = document.querySelector("#city").value;
  searchCity(city);
  document.querySelector("#city").value = "";
}

let form = document.querySelector("#form");
form.addEventListener("submit", handleSubmit);

function displayFehrenheit(e) {
  e.preventDefault();
  let temp = document.querySelector("#degrees");

  celciusLink.classList.remove("active");
  fehrenheitLink.classList.add("active");

  let fehrenheitTemp = (celciusTemp * 9) / 5 + 32;
  temp.innerHTML = Math.round(fehrenheitTemp);
  unitsMetric = false;
}

function displayCelcius(e) {
  e.preventDefault();
  celciusLink.classList.add("active");
  fehrenheitLink.classList.remove("active");
  let temp = document.querySelector("#degrees");
  temp.innerHTML = Math.round(celciusTemp);
  unitsMetric = true;
}

let celciusTemp = null;

let fehrenheitLink = document.querySelector("#fehrenheit-link");
fehrenheitLink.addEventListener("click", displayFehrenheit);
// fehrenheitLink.addEventListener("click", getFehrenheitForecast);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelcius);

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="forecast__items">`;

  forecast.forEach(function (forecastDay, index) {
    let tempMax = Math.round(forecastDay.temp.max);
    let tempMin = Math.round(forecastDay.temp.min);

    // if (fehrenheitLink.classList.contains(".active")) {
    //   tempMax = Math.round((forecastDay.temp.max * 9) / 5 + 32);
    //   tempMin = Math.round((forecastDay.temp.max * 9) / 5 + 32);
    // }

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

function getForecast(coordinates) {
  let apiKey = "29d24da46731d2929ff30f83f29c34d7";
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function getFehrenheitForecast(coordinates) {
  let apiKey = "29d24da46731d2929ff30f83f29c34d7";
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let units = "imperial";
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
  let windSpeed = Math.round(response.data.wind.speed);
  let feelsLike = Math.round(response.data.main.feels_like);
  let sunrise = response.data.sys.sunrise * 1000;
  let sunset = response.data.sys.sunset * 1000;
  let date = response.data.dt * 1000;
  let highTemperature = Math.round(response.data.main.temp_max);
  let lowTemperature = Math.round(response.data.main.temp_min);
  let icon = response.data.weather[0].icon;

  celciusTemp = response.data.main.temp;

  let temperatureElement = document.querySelector("#degrees");
  temperatureElement.innerHTML = temperature;

  let cityElement = document.querySelector("#current-city");
  cityElement.innerHTML = `${city}, ${country}`;

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = description;

  let windSpeedElement = document.querySelector("#wind");
  windSpeedElement.innerHTML = `${windSpeed} km/h`;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `${humidity} %`;

  let feelsLikeElement = document.querySelector("#feelslike");
  feelsLikeElement.innerHTML = `${feelsLike}°C`;
  console.log(feelsLikeElement.innerHTML);

  // "<div class='feels__like'>Feels like<span id='feelslike'>${feelsLike} °C</span></div>";

  let sunriseElement = document.querySelector("#sunrise");
  sunriseElement.innerHTML = formatSunrise(sunrise);

  let sunsetElement = document.querySelector("#sunset");
  sunsetElement.innerHTML = formatSunset(sunset);

  let dateElement = document.querySelector(".current__date");
  dateElement.innerHTML = formatDate(date);

  let highTempElement = document.querySelector("#high-temp");
  highTempElement.innerHTML = highTemperature;

  let lowTempElement = document.querySelector("#low-temp");
  lowTempElement.innerHTML = lowTemperature;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("alt", description);
  iconElement.setAttribute("src", `images/${icon}.png`);
  iconElement.setAttribute("width", `100%`);

  if (unitsMetric === true) {
    getForecast(response.data.coord);
  } else {
    getFehrenheitForecast(response.data.coord);
  }

  // if (fehrenheitLink.classList.contains(".active")) {
  //   getFehrenheitForecast(response.data.coord);
  // } else {
  //   getForecast(response.data.coord);
  // }

  // getForecast(response.data.coord);
}
// getFehrenheitForecast(response.data.coord);

function searchLocation(position) {
  let apiKey = "29d24da46731d2929ff30f83f29c34d7";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  celciusLink.classList.add("active");
  fehrenheitLink.classList.remove("active");
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentBtn = document.querySelector("#current-btn");
currentBtn.addEventListener("click", getCurrentLocation);

let unitsMetric = true;

searchCity("Malaga");
// displayForecast();
