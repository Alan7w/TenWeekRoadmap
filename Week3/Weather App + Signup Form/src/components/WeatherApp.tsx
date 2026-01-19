import { useState } from "react"
import '../styles/WeatherApp.css'

interface WeatherData {
    main?: {
        temp: number;
        humidity: number;
    };
    weather?: { description: string }[];
}

function WeatherApp() {
    const [city, setCity] = useState<string>("")

    const [weatherData, setWeatherData] = useState<WeatherData>({})
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState(null)

    // render a text input for city name
    // render a "Get Weather" button disabled if city is empty
    // on button click, fetch weather data from an API

    function fetchWeatherData () {
        console.log(city)
        setLoading(true)
        setError(null)

        const key = "fffd949bdccfa5e7ad9af7336478883f"
        const url = new URL(`https://api.openweathermap.org/data/2.5/weather`)
        url.searchParams.set("q", city)
        url.searchParams.set("appid", key)
        url.searchParams.set("units", "metric")

        fetch(url.toString())
            .then (response => {
                if (!response.ok) throw new Error(`${response}`)
                console.log(response)
                return response.json()
            })
            .then (data => {
                setWeatherData(data)
                setLoading(false)
            })
            .catch (error => {
                setError(error.message || "An error occurred while fetching weather data.");
                setLoading(false);
            })
    }

    return (
        <div className="weather-app-container">
            <h1 className="weather-app-title">Weather App</h1>
            <p className="weather-app-subtitle">Welcome to the Weather App! <br /> Stay tuned for weather updates.</p>

            <div className="weather-search-form">
                <label htmlFor="city" className="weather-search-input-label">City name:</label>
                <input 
                    className="weather-search-input"
                    id="city" 
                    name="city"
                    type="text" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                /> 
                <button 
                    onClick={fetchWeatherData} 
                    disabled={!city}
                    className={!city ? "weather-search-btn-disabled" : "weather-search-btn"}
                > 
                    Get Weather 
                </button>
            </div>

            {/* Display temperature, humidity, description */}
            {loading && <p> Loading ...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {weatherData.main && (
                <div className="weather-info">
                    <h2 className="weather-info-city"> Weather at {city}</h2>
                    <p className="weather-info-temp">Temperature: {weatherData.main.temp}°K</p>
                    <p className="weather-info-humidity">Humidity: {weatherData.main.humidity}%</p>
                    <p className="weather-info-desc">Description: {weatherData.weather && weatherData.weather[0] ? weatherData.weather[0].description : "No description available"}</p>
                </div>
            )}
        </div>
    );
}

export default WeatherApp;