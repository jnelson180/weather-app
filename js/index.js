function getMobileOperatingSystem() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function() {
      console.log('other- navigator.geolocation');
      return 'other';
    }, function() {
      alert("Geolocation not supported by browser. Using IP based location instead.");
      return 'mobile';
    });

  } else {

    /* */
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    var ua = navigator.userAgent;

    if (!!window.chrome && (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i) || (/Chrome/i.test(ua)))) {
      console.log('Mobile browser (or Chrome) detected .');
      return 'mobile';
    } else {
      console.log('other');
      return 'other';
    }
  }
}

// call to function to initialize test... getMobileOperatingSystem();
var curOs = getMobileOperatingSystem();

//alert('Mobile browser detected; if statement initialized');
// console.log('Mobile browser detected; if statement initialized');

$.getJSON("https://freegeoip.net/json?callback=?", function(data) {
  var lat8tud = data.latitude;
  var long8tud = data.longitude;
  console.log(lat8tud);
  document.getElementById("deftex").innerHTML = 'in ' + data.city + ", " + data.region_name;

  function getWeather(callback) {

    var weather =
      'https://api.darksky.net/forecast/6f89427b1c6a6fbb4870390ccf05f460/' + lat8tud + ',' + long8tud + '?callback=?';
    console.log(weather);

    $.ajax({
      dataType: 'json',
      url: weather,
      success: callback
    });
  }
  getWeather(function(data) {

    console.log(data);

    //imperial measurements below

    tempi = Math.round(data.currently.temperature) + " °F";
    flike = Math.round(data.currently.apparentTemperature) + " °F";
    cloudCover = Number(Math.round((data.currently.cloudCover)*100)) + "%";
    conditionsi = data.currently.summary;
    humidityi = Math.round(data.currently.humidity*100);
    windi = Math.round(data.currently.windSpeed) + " MPH";
    //metric measurements below -- 
    tempm = Math.round((Number(data.currently.temperature) - 32) * 5 / 9) + " °C";
    flikem = Math.round((Number(data.currently.apparentTemperature) - 32) * 5 / 9) + " °C";
    console.log(tempm);
    windm = Math.round((Number(data.currently.windSpeed) * 1.609344)) + " km/H";
    console.log(windm);

     var ampm;
    (function() {
      var nowHour = new Date().getHours();
      if (nowHour > 17 || nowHour < 6) {
        ampm = 'pm';
        return;
      }
      ampm = 'am';
      return;
    })();
    
    
    switch (true) {
      case (data.currently.icon == 'clear-day'):
        var icon = '01d';
        $("body").css("background-image", "url('http://jakenelson.comxa.com/weather/img/clear.jpg')");
        break;
      case (data.currently.icon == 'partly-cloudy-day'):
        var icon = '03d';
        console.log("Few Clouds");
        $("body").css("background-image", "url('http://jakenelson.comxa.com/weather/img/cloudy.jpg')");
        break;
      case (data.currently.icon == 'cloudy' && ampm == 'am'):
        console.log("Broken Clouds");
        var icon = '03d';
        $("body").css("background-image", "url('http://jakenelson.comxa.com/weather/img/cloudy.jpg')");
        break;
      case (data.currently.icon == 'rain'):
        var icon = '10d';
        console.log("Rain Showers");
        $("body").css("background-image", "url('http://jakenelson.comxa.com/weather/img/rain.jpg')");
        break;
      case (data.currently.icon == 'thunderstorm'):
        var icon = '11d';
        console.log("Thunderstorm");
        $("body").css("background-image", "url('http://jakenelson.comxa.com/weather/img/lightning.jpg')");
        break;
      case (data.currently.icon == 'wind' && ampm == 'am'):
        var icon = '03d';
        console.log("Windy");
        $("body").css("background-image", "url('http://jakenelson.comxa.com/weather/img/clear.jpg')");
        break;
      case (data.currently.icon == 'snow'):
        var icon = '13d';
        console.log("Snow");
        $("body").css("background-image", "url('http://jakenelson.comxa.com/weather/img/snow.jpg')");
        break;
      case (data.currently.icon == 'fog'):
        var icon = '50d';
        console.log("Mist");
        $("body").css("background-image", "url('http://jakenelson.comxa.com/weather/img/foggy.jpg')");
        break;

        // nighttime cases
        
      case (data.currently.icon == 'clear-night'):
        var icon = '01n';
        console.log("Clear Skies");
        $("body").css("background-image", "url('http://jakenelson.comxa.com/weather/img/nightclear.jpg')");
        break;
      case (data.currently.icon.indexOf('cloudy') >= 0):
        var icon = '03n';
        console.log("Few Clouds");
        $("body").css("background-image", "url('http://jakenelson.comxa.com/weather/img/nightcloudy.jpg')");
        break;
      case (data.currently.icon == 'wind' && ampm == 'pm'):
        var icon = '01n';
        console.log("Windy");
        $("body").css("background-image", "url('http://jakenelson.comxa.com/weather/img/nightclear.jpg')");
        break;
    }
    /*
      if (data.currently.apparentTemperature <= 32) {
        $("#maindiv").css("background-image", "url('http://jakenelson.comxa.com/weather/img/frosty.jpg')");
      }
    */
    document.getElementById("weatherTxt").innerHTML = "<img src='https://openweathermap.org/img/w/" + icon + ".png' height='50px'  width='50px'/>" + 
      '<table width="90%" align="center" id="wetable" class="tableCaps"><tr><td>Temperature</td>' + "<td>" + tempi +
      "</td></tr><br/><tr><td>Feels Like</td><td>" + flike + "</td></tr><tr><td>Conditions</td>" + "<td>" + conditionsi + "</td></tr>" + "<tr><td>Cloud Cover</td><td>" + cloudCover + "</td></tr><tr><td>Humidity</td>" + "<td>" + humidityi + "%</td></tr><br/>" + "<tr><td>Wind</td>" + "<td>" + windi + "</td></tr></table>";
  });

  function toggleState(item) {
    if (item.class == "on") {
      item.class = "off";
      document.getElementById('wetable').rows[0].cells[1].innerHTML = '' + tempi + '';
      document.getElementById('wetable').rows[1].cells[1].innerHTML = '' + flike + '';
      document.getElementById('wetable').rows[5].cells[1].innerHTML = '' + windi + '';
      document.getElementById('btn').value = 'Click to Convert to Metric (°C, km/H)';
    } else {
      item.class = "on";
      document.getElementById('btn').value = 'Click to Convert to Imperial (°F, MPH)';
      document.getElementById('wetable').rows[0].cells[1].innerHTML = '' + tempm + '';
      document.getElementById('wetable').rows[1].cells[1].innerHTML = '' + flikem + '';
      document.getElementById('wetable').rows[5].cells[1].innerHTML = '' + windm + '';
    }
  }
  document.getElementById('swiButton').innerHTML = '<input type="button" id="btn" value="Click to Convert to Metric (°C, km/H)" class="off"  />';
  $("#swiButton").click(function() {
    toggleState(btn)
  });
document.getElementById('foot').innerHTML = '<a href="https://darksky.net/poweredby">Powered by Dark Sky</a>'
});