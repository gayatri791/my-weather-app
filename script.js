const searchButton = document.getElementById('search');
const cityInput = document.getElementById('city');
const weatherInfo = document.getElementById('weather-info');
const loading = document.getElementById('loading');

const apiKey = '5b5f2203c799646f99c6b4282080002e'; // Your OpenWeatherMap API key

// Create clouds
const createClouds = () => {
    const cloudContainer = document.querySelector('.clouds');
    for (let i = 0; i < 3; i++) {
        let cloud = document.createElement('div');
        cloud.classList.add('cloud');
        if (i === 0) {
            cloud.classList.add('cloud-one');
        } else if (i === 1) {
            cloud.classList.add('cloud-two');
        } else {
            cloud.classList.add('cloud-three');
        }
        cloudContainer.appendChild(cloud);
    }
};
createClouds();

// Weather condition-based styling
const setWeatherClass = (condition) => {
    if (condition.includes('clear')) {
        document.body.classList.add('sunny');
        document.body.classList.remove('rainy', 'cloudy');
    } else if (condition.includes('rain')) {
        document.body.classList.add('rainy');
        document.body.classList.remove('sunny', 'cloudy');
    } else {
        document.body.classList.add('cloudy');
        document.body.classList.remove('sunny', 'rainy');
    }
};

searchButton.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    loading.style.display = 'block';
    weatherInfo.innerHTML = ''; // Clear previous results

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === 200) {
            const temp = data.main.temp;
            const description = data.weather[0].description;
            const icon = data.weather[0].icon;
            const windSpeed = data.wind.speed;
            const humidity = data.main.humidity;
            const pressure = data.main.pressure;
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            weatherInfo.innerHTML = `
                <h2>${city}</h2>
                <p>${temp}°C</p>
                <p>${description}</p>
                <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather icon" />
                <p>Wind Speed: ${windSpeed} m/s</p>
                <p>Humidity: ${humidity}%</p>
                <p>Pressure: ${pressure} hPa</p>
                <p>Sunrise: ${sunrise}</p>
                <p>Sunset: ${sunset}</p>
            `;
            setWeatherClass(description);
        } else {
            weatherInfo.innerHTML = `<p>City not found</p>`;
            document.body.classList.remove('sunny', 'rainy', 'cloudy');
        }
    } catch (error) {
        weatherInfo.innerHTML = `<p>Error fetching data</p>`;
    } finally {
        loading.style.display = 'none';
    }
});
