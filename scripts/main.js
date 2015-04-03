var form = document.getElementById("cityForm");

init();
//sets initial city.
function init() {
  document.getElementById('cityToSearch').value = window.localStorage.getItem('yaww');
}
form.addEventListener("submit", function (event) {
  event.preventDefault();
  var weatherContent = document.getElementById('weather-content');
  var forecastContent = document.getElementById('forecast-content');
  while (weatherContent.hasChildNodes()) {
    weatherContent.removeChild(weatherContent.lastChild);
  }
  while (forecastContent.hasChildNodes()) {
    forecastContent.removeChild(forecastContent.lastChild);
  }
  var city = document.getElementById('cityToSearch').value;

  window.localStorage.setItem('yaww', city);
  submitRequest("weatherScript", "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&callback=displayWeather");
  submitRequest("forecastScript", "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&cnt=5&callback=displayForecast");
});


function submitRequest(scriptName, url) {
  var jsonElement = document.createElement("script");
  jsonElement.setAttribute("src", url);
  jsonElement.setAttribute("id", scriptName);
  var oldJsonElement = document.getElementById(scriptName);
  var head = document.getElementsByTagName("head")[0];
  if (oldJsonElement == null) {
    head.appendChild(jsonElement);
  }
  else {
    head.replaceChild(jsonElement, oldJsonElement);
  }
}

function displayWeather(data) {
  if (data.cod !== 200) {
    alert('Can not find city');
    return;
  }
  var weatherDiv = document.getElementById('weather-content');

  var displayStack = [];

  //weather pic
  var picColumn = document.createElement('div');
  picColumn.setAttribute('class', 'col-xs-2');
  var weatherImage = new Image;
  weatherImage.src = "//openweathermap.org/img/w/" + data.weather[0].icon + '.png';
  picColumn.appendChild(weatherImage);
  weatherDiv.appendChild(picColumn);

  //weather content
  var contentColumn = document.createElement('div');
  contentColumn.setAttribute('class', 'col-xs-10');
  weatherDiv.appendChild(contentColumn);

  var city = document.createElement('h2');
  city.innerHTML = '<b>' + data.name + "</b> <span class='text-muted'> " + data.weather[0].main + "</span>";
  displayStack.push(city);

  var tempLine = document.createElement('p');
  tempLine.innerHTML = 'It is currently: <span class="badge">' + convertTemp(data.main.temp) + "&deg;</span>";
  displayStack.push(tempLine);

  var windLine = document.createElement('p');
  if (data.wind.speed > 0.5) {
    windLine.innerHTML = 'The wind is coming from ' + Math.round(data.wind.deg) + '&deg; at ' + Math.round(data.wind.speed) + ' kph';
  }
  else {
    windLine.innerHTML = "There is no wind.";
  }
  displayStack.push(windLine);

  var cloudLine = document.createElement('p');
  cloudLine.innerHTML = "the cloud cover is: " + data.clouds.all + "%, The humidity is: " + data.main.humidity + "% and the pressure is: " + data.main.pressure + "kPa";
  displayStack.push(cloudLine);

  var forecastTitle = document.createElement('h2');
  forecastTitle.innerText = "Five day forecast:";
  displayStack.push(forecastTitle);

  displayStack.forEach(function (line) {
    contentColumn.appendChild(line);
  });
}
function displayForecast(data) {


  var forecastDiv = document.getElementById('forecast-content');

  data.list.forEach(function (day) {
    var dayDiv = document.createElement('div');
    dayDiv.setAttribute('class', 'col-xs-2 well');
    var divWeather = document.createElement('p');
    divWeather.innerHTML = day.weather[0].main + " <b>" + convertTemp(day.temp.day) + "</b>";
    dayDiv.appendChild(divWeather);
    forecastDiv.appendChild(dayDiv);
  })


}

//Helper function
function convertTemp(tempToConvert) {
  return Math.round(tempToConvert - 273);
}

