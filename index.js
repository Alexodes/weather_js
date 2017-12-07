const API_KEY = 'f31832d3fe9ef993f69d694097fefe73';
const ELEMENT_SEARCH_BUTTON = document.querySelector('button');
const ELEMENT_SEARCHED_CITY = document.querySelector('#city');

const ELEMENT_LOADING_TEXT = document.querySelector('#load');
const ELEMENT_WEATHER_BOX = document.querySelector('#weather');

const ELEMENT_WEATHER_CITY = ELEMENT_WEATHER_BOX.firstElementChild;
const ELEMENT_WEATHER_DESCRIPTION = document.querySelector('#weatherDescription');
const ELEMENT_WEATHER_TEMPERATURE = ELEMENT_WEATHER_BOX.lastElementChild;

ELEMENT_SEARCH_BUTTON.addEventListener('click', searchWeather);
ELEMENT_LOADING_TEXT.style.display = 'none';
ELEMENT_WEATHER_BOX.style.display = 'none';

class WeatherData {
    constructor(cityName, description) {
        this.cityName = cityName;
        this.description = description;
        this.temperature = '';
    }
}

const WEATHER_PROXY_HANDLER = {
    get: function(target, property) {
        return Reflect.get(target, property);
    },
    set: function(target, property, value) {
        const newValue = (value * 1.8 + 32).toFixed(2) + 'F.';
        return Reflect.set(target, property, newValue);
    }
};

class Http {
    static fetchData(url) {
        return new Promise((resolve, reject) => {
            const HTTP = new XMLHttpRequest();
            HTTP.open('GET', url);
            HTTP.onreadystatechange = function() {
                if (HTTP.readyState == XMLHttpRequest.DONE && HTTP.status == 200) {
                    const RESPONSE_DATA = JSON.parse(HTTP.responseText);
                    resolve(RESPONSE_DATA);
                } else if (HTTP.readyState == XMLHttpRequest.DONE) {
                    console.log('jo');
                    reject('Something went wrong');
                }
            };
            HTTP.send();
        });
    }
}

function searchWeather() {
    const CITY_NAME = ELEMENT_SEARCHED_CITY.value.trim();
    if(CITY_NAME.length == 0) {
        return alert('Please, enter the city name');
    }
    ELEMENT_LOADING_TEXT.style.display = 'block';    

    const URL = `http://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&units=metric&appid=${API_KEY}`;

    Http.fetchData(URL)
        .then(responseData => {
            const WEATHER_DATA = new WeatherData(CITY_NAME, responseData.weather[0].description.toUpperCase());
            const WEATHER_PROXY = new Proxy(WEATHER_DATA, WEATHER_PROXY_HANDLER);
            WEATHER_PROXY.temperature = responseData.main.temp;
            updateWeather(WEATHER_PROXY);
        })
        .catch(error => alert(error));
}

function updateWeather(weatherData) {
    ELEMENT_WEATHER_CITY.textContent = weatherData.cityName;
    ELEMENT_WEATHER_DESCRIPTION.textContent = weatherData.description; 
    ELEMENT_WEATHER_TEMPERATURE.textContent = weatherData.temperature;   
     
    ELEMENT_LOADING_TEXT.style.display = 'none';    
    ELEMENT_WEATHER_BOX.style.display = 'block';
}