const url = 'https://api.openweathermap.org/data/2.5/';
const apiKey = '4d60c471880adcd33e3bd6b49078048c';

const setQuery = (e) => {
    if (e.keyCode === 13) {
        getResult(searchBar.value);
    }
};

const getResult = async (cityName) => {
    try {
        let currentWeatherResponse = await fetch(`${url}weather?q=${cityName}&appid=${apiKey}&units=metric&lang=tr`);
        let forecastResponse = await fetch(`${url}forecast?q=${cityName}&appid=${apiKey}&units=metric&lang=tr`);
        
        if (!currentWeatherResponse.ok || !forecastResponse.ok) {
            throw new Error('Hava durumu verileri alınamadı.');
        }
        
        let currentWeatherData = await currentWeatherResponse.json();
        let forecastData = await forecastResponse.json();

        displayResult(currentWeatherData, forecastData);
    } catch (error) {
        console.error(error);
    }
};

const displayResult = (currentWeather, forecast) => {
    let city = document.querySelector('.city');
    let temp = document.querySelector('.temp');
    let gg = document.querySelector('.desc');
    let minmax = document.querySelector('.min-max');
    let forecastData = document.querySelector('.forecast-data');

    city.innerText = `${currentWeather.name}, ${currentWeather.sys.country}`;
    temp.innerText = `${Math.round(currentWeather.main.temp)}°C`;
    gg.innerText = currentWeather.weather[0].description;
    minmax.innerText = `${Math.round(currentWeather.main.temp_min)}°C / ${Math.round(currentWeather.main.temp_max)}°C`;

    const filteredForecast = {};
    forecast.list.forEach(forecastItem => {
        const forecastDate = new Date(forecastItem.dt * 1000);
        const forecastDateStr = forecastDate.toLocaleDateString('tr-TR', { year: 'numeric', month: 'numeric', day: 'numeric' });

        if (!filteredForecast[forecastDateStr]) {
            filteredForecast[forecastDateStr] = forecastItem;
        }
    });

    forecastData.innerHTML = ''; // Önceki tahminleri temizle
    Object.values(filteredForecast).forEach(forecastItem => {
        const forecastDate = new Date(forecastItem.dt * 1000);
        const forecastDateStr = forecastDate.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
        const forecastTemp = Math.round(forecastItem.main.temp);
        const forecastDesc = forecastItem.weather[0].description;

        const forecastHtml = `<div class="forecast-item">
                                <p>${forecastDateStr}</p>
                                <p>${forecastTemp}°C</p>
                                <p>${forecastDesc}</p>
                              </div>`;
        forecastData.innerHTML += forecastHtml;
    });
};

const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('keypress', setQuery);

// Kaydırma olayını önlemek için
document.addEventListener('touchmove', function(event) {
    event.preventDefault();
}, { passive: false });
