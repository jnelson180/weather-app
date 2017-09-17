// fetch does not work correctly if user has uBlock Origin or similar ad block enabled (Chrome) so using cors-anywhere
let locationText = document.getElementById("locationText");
let switchButton = document.getElementById("switchButton");
let weatherIcon = document.getElementById("weatherIcon");
let weatherText = document.getElementById("weatherText");
let now = Math.round((new Date()).getTime() / 1000);
let loc = {
  lat: null,
  long: null
};

const getLocation = () => {
  fetch("https://cors-anywhere.herokuapp.com/https://freegeoip.net/json/")
    .then(response => {
      return response.json();
    })
    .then(res => {
    console.log(res);
      locationText.innerHTML = res.city + ", " + res.region_code;
      loc = {
        lat: res.latitude,
        long: res.longitude
      };
      getWeather(loc.lat, loc.long);
      return res;
    })
    .catch(error => {
      throw error;
    });
};

const getWeather = (lat, long) => {
  var weather = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/6f89427b1c6a6fbb4870390ccf05f460/" + lat + "," + long;
  fetch(weather)
    .then(response => {
      return response.json();
    })
    .then(res => {
      console.log(res);
      printWeather(res);
    })
    .catch(error => {
      throw error;
    });
};

const printWeather = data => {
  //imperial measurements below
  tempi = Math.round(data.currently.temperature) + " °F";
  flike = Math.round(data.currently.apparentTemperature) + " °F";
  cloudCover = Number(Math.round(data.currently.cloudCover * 100)) + "%";
  conditionsi = data.currently.summary;
  humidityi = Math.round(data.currently.humidity * 100);
  windi = Math.round(data.currently.windSpeed) + " MPH";
  //metric measurements below --
  tempm = Math.round((Number(data.currently.temperature) - 32) * 5 / 9) + " °C";
  flikem =
    Math.round((Number(data.currently.apparentTemperature) - 32) * 5 / 9) +
    " °C";
  windm = Math.round(Number(data.currently.windSpeed) * 1.609344) + " km/H";

  let icon = "";
  let bg = "";
  let baseUrl = "https://jnelson180.github.io/weather/img/";
  
  // change background image and icon displayed depending on weather conditions
  switch (true) {
    case data.currently.icon == "clear-day":
      icon = "01d";
      bg = "clear.jpg";
      break;
    case data.currently.icon == "partly-cloudy-day" ||
      data.currently.icon == "cloudy":
      icon = "03d";
      bg = "cloudy.jpg";
      break;
    case data.currently.icon == "rain":
      icon = "10d";
      bg = "rain.jpg";
      break;
    case data.currently.icon == "thunderstorm":
      icon = "11d";
      bg = "lightning.jpg";
      break;
    case data.currently.icon == "snow":
      icon = "13d";
      bg = "snow.jpg";
      break;
    case data.currently.icon == "fog":
      icon = "50d";
      bg = "foggy.jpg";
      break;
    default:
      bg = "clear.jpg"
      break;
  }

  let today = data.daily.data[0];
  let tomorrow = data.daily.data[1];
  let sunset = now >= today.sunsetTime && now <= tomorrow.sunriseTime ? true : false;
  !sunset ? document.body.style.color = "#000" : document.body.style.color = "#fff"
  
  let overlay = !sunset ?  "linear-gradient(rgba(255,255,255,1), rgba(255,255,255,.6)), " : "linear-gradient(rgba(0,0,0,1), rgba(0,0,0,.2)), ";
  let background = overlay + "url(https://jnelson180.github.io/weather/img/" + bg + ")";
  document.body.style.background = background;

  document.getElementById("weatherIcon").innerHTML = "<img src='https://openweathermap.org/img/w/" + icon + ".png' height='50px'  width='50px'/>";
  document.getElementById("weatherText").innerHTML = `
    <table id="weatherTable">
      <tr>
        <td>Temperature</td>
        <td>${tempi}</td>
      </tr>
      <tr>
        <td>Feels Like</td>
        <td>${flike}</td>
      </tr>
      <tr>
        <td>Conditions</td>
        <td>${conditionsi}</td>
      </tr>
      <tr>
        <td>Cloud Cover</td>
        <td>${cloudCover}</td>
      </tr>
      <tr>
        <td>Humidity</td>
        <td>${humidityi}%</td>
      </tr>
      <tr>
        <td>Wind</td>
        <td>${windi}</td>
      </tr>
    </table>
  `;
  
  document.getElementById('loading').style.display = "none";
  document.getElementById('loaded').style.display = "block";
};

const toggleState = item => {
  console.log(item);
  if (item.class === "on") {
    item.class = "off";
    document.getElementById("weatherTable").rows[0].cells[1].innerHTML = "" + tempi + "";
    document.getElementById("weatherTable").rows[1].cells[1].innerHTML = "" + flike + "";
    document.getElementById("weatherTable").rows[5].cells[1].innerHTML = "" + windi + "";
    document.getElementById("btn").value = "°C, km/H";
  } else {
    item.class = "on";
    document.getElementById("btn").value = "°F, MPH";
    document.getElementById("weatherTable").rows[0].cells[1].innerHTML = "" + tempm + "";
    document.getElementById("weatherTable").rows[1].cells[1].innerHTML = "" + flikem + "";
    document.getElementById("weatherTable").rows[5].cells[1].innerHTML = "" + windm + "";
  }
};

// handle switching from farenheit to celsius
switchButton.addEventListener('click', () => {
  toggleState(switchButton)
});

getLocation();
