import { useState } from "react"

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

        const key = import.meta.env.VITE_OPENWEATHER_API_KEY
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
    <div>
        <h1>Weather App</h1>
        <p>Welcome to the Weather App!</p>
        <p>Stay tuned for weather updates.</p>

        City name: <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)}/> 
        <button onClick={fetchWeatherData} disabled={!city}> Get Weather </button>

        {/* Display temperature, humidity, description */}
        {loading && <p> Loading ...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {weatherData.main && (
            <div>
                <h2> Weather at {city}</h2>
                <p>Temperature: {weatherData.main.temp}°K</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Description: {weatherData.weather && weatherData.weather[0] ? weatherData.weather[0].description : "No description available"}</p>
            </div>
        )}
    </div>
    );
}

export default WeatherApp;