import { useState } from "react"
import Input from './ui/Input'
import Button from './ui/Button'
import WeatherAppSkeleton from "./WeatherAppSkeleton"

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
    const [error, setError] = useState<string | null>(null)

    function fetchWeatherData() {
        console.log(city)
        setLoading(true)
        setError(null)

        const key = import.meta.env.VITE_OPENWEATHER_API_KEY
        const url = new URL(`https://api.openweathermap.org/data/2.5/weather`)
        url.searchParams.set("q", city)
        url.searchParams.set("appid", key)
        url.searchParams.set("units", "metric")

        fetch(url.toString())
            .then(response => {
                if (!response.ok) throw new Error(`${response}`)
                console.log(response)
                return response.json()
            })
            .then(data => {
                setWeatherData(data)
                setLoading(false)
            })
            .catch(error => {
                setError(error.message || "An error occurred while fetching weather data.");
                setLoading(false);
            })
    }

    return (
        <div className="max-w-md mx-auto mt-8 px-4">
            <div className="bg-gradient-to-br from-sample-500 to-sample-700 rounded-2xl shadow-2xl p-8 text-white relative">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 bg-white/10 rounded-full"></div>
                
                <div className="relative z-10 text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Weather App</h1>
                    <p className="text-sample-100 text-sm">
                        Welcome to the Weather App! <br />
                        Stay tuned for weather updates.
                    </p>
                </div>

                <div className="relative z-10 space-y-4 mb-6">
                    <Input 
                        label="City name:" 
                        id="city" 
                        type="text" 
                        value={city} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                        placeholder="Enter city name..."
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key == "Enter") {
                                fetchWeatherData();
                                setWeatherData({});
                            }
                        }}
                        onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.placeholder = ""}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => e.target.placeholder = "Enter city name..."}
                        className="bg-white/20 border-white/30 text-white text-center placeholder:text-white/70 focus:border-white focus:ring-white/30"
                    /> 
                    <Button 
                        onClick={() => { fetchWeatherData(); setWeatherData({}); }} 
                        disabled={!city || loading}
                        variant="outlined"
                        size="medium"
                        className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50"
                    > 
                        {loading ? "Loading..." : "Get Weather"}
                    </Button>
                </div>

                {error && (
                    <div className="relative z-10 bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-4">
                        <p className="text-red-100 text-sm font-medium">Failed to fetch weather data: {error}</p>
                    </div>
                )}

                {loading && <WeatherAppSkeleton />}

                {weatherData.main && (
                    <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-center mb-4">
                            Weather in {city}
                        </h2>
                        
                        <div className="grid gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold">
                                    {Math.round(weatherData.main.temp)}°C
                                </div>
                                <div className="text-sample-100 text-sm">Temperature</div>
                            </div>
                            
                            <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                                <span className="text-sample-100">Humidity:</span>
                                <span className="font-semibold">{weatherData.main.humidity}%</span>
                            </div>
                            
                            <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                                <span className="text-sample-100">Description:</span>
                                <span className="font-semibold capitalize">
                                    {weatherData.weather && weatherData.weather[0] ? 
                                        weatherData.weather[0].description : 
                                        "No description available"
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WeatherApp