
const API_KEY = '185ae82b68424ac799224927250708';
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const weatherInfo = document.getElementById('weatherInfo');
const error = document.getElementById('error');

// Weather display elements
const cityName = document.getElementById('cityName');
const currentTime = document.getElementById('currentTime');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const weatherCondition = document.getElementById('weatherCondition');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// Initialize with Seoul weather
window.addEventListener('load', () => {
  getWeatherData('Seoul');
});

async function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) {
    showError('도시명을 입력해주세요.');
    return;
  }
  
  await getWeatherData(city);
}

async function getWeatherData(city) {
  showLoading();
  
  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${city}&aqi=no&lang=ko`);
    
    if (!response.ok) {
      throw new Error('날씨 정보를 찾을 수 없습니다.');
    }
    
    const data = await response.json();
    displayWeatherData(data);
    
  } catch (err) {
    console.error('Error fetching weather data:', err);
    showError('날씨 정보를 가져올 수 없습니다. 도시명을 확인해주세요.');
  }
}

function displayWeatherData(data) {
  const { location, current } = data;
  
  // Update city name and time
  cityName.textContent = `${location.name}, ${location.country}`;
  const localTime = new Date(location.localtime);
  currentTime.textContent = formatDateTime(localTime);
  
  // Update weather information
  temperature.textContent = `${Math.round(current.temp_c)}°C`;
  weatherIcon.src = `https:${current.condition.icon}`;
  weatherIcon.alt = current.condition.text;
  weatherCondition.textContent = current.condition.text;
  feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
  humidity.textContent = `${current.humidity}%`;
  windSpeed.textContent = `${current.wind_kph} km/h`;
  visibility.textContent = `${current.vis_km} km`;
  
  showWeatherInfo();
}

function showLoading() {
  loading.classList.remove('hidden');
  weatherInfo.classList.add('hidden');
  error.classList.add('hidden');
}

function showWeatherInfo() {
  loading.classList.add('hidden');
  weatherInfo.classList.remove('hidden');
  error.classList.add('hidden');
}

function showError(message) {
  loading.classList.add('hidden');
  weatherInfo.classList.add('hidden');
  error.classList.remove('hidden');
  error.querySelector('p').textContent = message;
}

function formatDateTime(date) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  return date.toLocaleDateString('ko-KR', options);
}
