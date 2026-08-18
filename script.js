var btn = document.getElementById("search-btn");
var input = document.getElementById("city-input");
var p = document.getElementById("error");
var card = document.getElementById("weather-card");

function cityDetails(city) {
  return fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
  )
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Request failed");
      }

      return response.json();
    })
    .then(function (data) {
      if (!data.results || data.results.length === 0) {
        throw new Error("City not found");
      }

      return data;
    });
}

function weather(lat, lon) {
  return fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`,
  ).then(function (response) {
    if (!response.ok) {
      throw new Error("Weather data not found");
    }

    return response.json();
  });
}

function getWeatherCondition(code) {
  if (code === 0) {
    return {
      text: "Clear Sky",
      icon: "☀️",
    };
  } else if (code === 1 || code === 2) {
    return {
      text: "Partly Cloudy",
      icon: "🌤️",
    };
  } else if (code === 3) {
    return {
      text: "Overcast",
      icon: "☁️",
    };
  } else if (code >= 45 && code <= 48) {
    return {
      text: "Foggy",
      icon: "🌫️",
    };
  } else if (code >= 51 && code <= 57) {
    return {
      text: "Drizzle",
      icon: "🌦️",
    };
  } else if (code >= 61 && code <= 67) {
    return {
      text: "Rain",
      icon: "🌧️",
    };
  } else if (code >= 71 && code <= 77) {
    return {
      text: "Snow",
      icon: "❄️",
    };
  } else if (code >= 80 && code <= 82) {
    return {
      text: "Rain Showers",
      icon: "🌦️",
    };
  } else if (code >= 95 && code <= 99) {
    return {
      text: "Thunderstorm",
      icon: "⛈️",
    };
  } else {
    return {
      text: "Unknown",
      icon: "🌤️",
    };
  }
}

function show(cityData, weatherData) {
  var city = cityData.results[0];
  var current = weatherData.current;

  var condition = getWeatherCondition(current.weather_code);

  var newData = `
    <div class="weather-header">

      <div>
        <h2 id="city">${city.name}</h2>
        <p id="country">${city.country}</p>
      </div>

      <div class="weather-icon" id="weather-icon">
        ${condition.icon}
      </div>

    </div>


    <div class="temperature">

      <span id="temperature">
        ${current.temperature_2m}
      </span>

      <span>°C</span>

    </div>


    <p class="weather-condition" id="condition">
      ${condition.icon} ${condition.text}
    </p>


    <div class="weather-stats">

      <div class="stat">

        <span>🌡️</span>

        <div>
          <small>Feels Like</small>

          <strong id="feels-like">
            ${current.apparent_temperature}°C
          </strong>
        </div>

      </div>


      <div class="stat">

        <span>💧</span>

        <div>
          <small>Humidity</small>

          <strong id="humidity">
            ${current.relative_humidity_2m}%
          </strong>
        </div>

      </div>


      <div class="stat">

        <span>💨</span>

        <div>
          <small>Wind Speed</small>

          <strong id="wind">
            ${current.wind_speed_10m} km/h
          </strong>
        </div>

      </div>

    </div>
  `;

  card.innerHTML = newData;
}

btn.addEventListener("click", function () {
  var inputData = input.value.trim();

  if (inputData.length === 0) {
    p.innerHTML = "Enter City Name";
    card.style.display = "none";
    return;
  }

  p.innerHTML = "";
  card.style.display = "none";

  cityDetails(inputData)
    .then(function (data) {
      var lat = data.results[0].latitude;
      var lon = data.results[0].longitude;

      return weather(lat, lon).then(function (weatherData) {
        show(data, weatherData);

        card.style.display = "block";
      });
    })

    .catch(function (error) {
      p.innerHTML = error.message;

      card.style.display = "none";
    });
});
