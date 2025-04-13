async function getWeather(cityFromHistory = null) {
  const city = cityFromHistory || document.getElementById('cityInput').value.trim();
  if (!city) return alert("Please enter a city name");

  const apiKey = 'your_new_apikey';#add your OPENWEATHERMAP_API_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  document.getElementById('loading').style.display = 'block';
  document.getElementById('weatherResult').innerHTML = '';

  try {
    const response = await fetch(url);
    const data = await response.json();
    document.getElementById('loading').style.display = 'none';

    if (data.cod !== 200) throw new Error(data.message);

    const localTime = new Date(data.dt * 1000).toLocaleString();

    document.getElementById('weatherResult').innerHTML = `
      <h2>${data.name}</h2>
      <p><strong>Time:</strong> ${localTime}</p>
      <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Condition:</strong> ${data.weather[0].description}</p>
      <img src="https://api.openweathermap.org/data/2.5/weather?q=CityName&appid=YOUR_API_KEY&units=metric">
    `;

    updateHistory(city);

  } catch (err) {
    document.getElementById('weatherResult').innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
    document.getElementById('loading').style.display = 'none';
  }
}

function updateHistory(city) {
  let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  if (!history.includes(city)) {
    history.unshift(city);
    if (history.length > 5) history.pop(); // max 5 items
    localStorage.setItem('weatherHistory', JSON.stringify(history));
  }
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = '';
  history.forEach(city => {
    const li = document.createElement('li');
    li.innerText = city;
    li.onclick = () => getWeather(city);
    historyList.appendChild(li);
  });
}

// Load history on page load
window.onload = renderHistory;
