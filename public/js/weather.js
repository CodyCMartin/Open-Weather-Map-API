const api_key = '&APPID=b1af91d530051e40aac009fe8af49895'
const searchBtn = document.querySelector('#searchbutton')
const searchBtnForecast = document.querySelector('#searchbuttonforecast')
const weather = document.querySelector('#weather')
const searchBox = document.querySelector('#searchbox')

const checkLocation = (forecastOption) => {
    weather.innerHTML = ''
    weather.style.display = 'none'
    let location = searchBox.value
    if (location != '' && location != undefined) {
        if (forecastOption == 'current') {
            getWeather(location)
        } else if (forecastOption == 'forecast')
            getWeatherForecast(location)
    }
}

const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const getWeather = (location) => {
    let url = ''
    let output = ''

    if (isNumeric(location)) {
        url = `https://api.openweathermap.org/data/2.5/weather?zip=${location}&units=imperial${api_key}`
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial${api_key}`
    }

    console.log(url)

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.cod != '404') {
                // Converting the current pressure from psf to psi
                let currentPressure_Psi = (data.main.pressure / 144)
                // Getting the wind direction in degrees
                let windDirection = data.wind.deg
                // Dealing with spaces in user search to build Google Maps url
                let searchUrl = encodeURIComponent(data.name)

                // Converting wind direction degrees into plain text direction as read from a compass
                if (windDirection >= 1 && windDirection <= 89) {
                    windDirection = "NE"
                } else if (windDirection >= 91 && windDirection <= 179) {
                    windDirection = "SE"
                } else if (windDirection >= 181 && windDirection <= 269) {
                    windDirection = "SW"
                } else if (windDirection >= 271 && windDirection <= 359) {
                    windDirection = "NW"
                } else if (windDirection == 360) {
                    windDirection = "N"
                } else if (windDirection == 90) {
                    windDirection = "E"
                } else if (windDirection == 180) {
                    windDirection = "S"
                } else if (windDirection == 270) {
                    windDirection = "W"
                }


                // Appending data points to output string
                // Using toFixed() to limit output displayed 
                // Getting icon to represent current weather and setting alt text for it
                output += `<h2>${data.name}</h2>`
                output += `<h4>${data.weather[0].description.toUpperCase()}</h4>`
                output += `<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="A ${data.weather[0].description} icon" width="100" height="100">`
                output += `<div>Current Temperature: ${data.main.temp.toFixed(1)} &#730F</div>`
                output += `<div>Current Humidity: ${data.main.humidity.toFixed(1)}&#37;</div>`
                output += `<div>Feels Like: ${data.main.feels_like.toFixed(1)} &#730F</div>`
                output += `<div>High Temperature: ${data.main.temp_max.toFixed(1)}&#730F</div>`
                output += `<div>Low Temperature: ${data.main.temp_min.toFixed(1)} &#730F</div>`
                output += `<div>Wind Speed: ${data.wind.speed.toFixed(1)} MPH ${windDirection}</div>`
                output += `<div>Pressure: ${currentPressure_Psi.toFixed(2)} PSI</div><br>`
                output += `<a href="https://www.google.com/maps/search/?api=1&query=${searchUrl}" class="badge badge-primary" target="_blank" >Open Map</a>`


            } else {
                output = `<p>No weather available for that location or search format wasn't correct. Please try again.</p>`
            }
            // Lets show it in our html
            weather.style.display = "block"
            weather.innerHTML = output

        })

}

// get weather forecast for a location
const getWeatherForecast = (location) => {
    let url = ''
    let output = ''
    let current_date = ''
    let new_date = ''

    // do we have a location or a zip code?
    if (isNumeric(location)) {
        url = `https://api.openweathermap.org/data/2.5/forecast?zip=${location}&units=imperial${api_key}`
    } else {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=imperial${api_key}`
    }

    console.log(url)

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // show the data you got back from fetch
            console.log(data)
            if (data.cod != '404') {
                // how many days?
                console.log(data.list.length)

                output += `<h2>Forecast for ${data.city.name}</h2>`
                for (let i = 0; i < data.list.length; i++) {
                    current_date = data.list[i].dt_txt.substring(0, 10);
                    if (new_date == '') {
                        new_date = current_date
                        shortDate = moment(data.list[i].dt_txt).format("dddd")
                        output += `<div><h3>${shortDate}</h3></div>`
                    }

                    if (current_date !== new_date) {
                        shortDate = moment(data.list[i].dt_txt).format("dddd")
                        output += `<div><h3>${shortDate}</h3></div>`
                        new_date = current_date
                    }

                    output += `<div class="hourly">`
                    shortTime = moment(data.list[i].dt_txt).format("hh mm a")
                    output += `<div>${shortTime}</div>`
                    output += `<div>Temperature: ${data.list[i].main.temp_min}</div>`
                    output += `<div>Humidity: ${data.list[i].main.humidity}</div>`
                    output += `<div>${data.list[i].weather[0].description}</div>`
                    let icon = data.list[i].weather[0].icon;
                    icon = `<img src="https://openweathermap.org/img/w/${icon}.png" />`
                    output += icon
                    output += `</div>`
                }
            } else {
                output = `<p>No weather available for that location or search format wasn't correct. Please try again.</p>`
            } // end if
            // display results
            weather.style.display = "block"
            weather.innerHTML = output
        })
} // end getWeatherForecast

// Event Listeners
searchBtn.addEventListener('click', () => {
    checkLocation('current')
})
searchBtnForecast.addEventListener('click', () => {
    checkLocation('forecast')
})