import axios from "axios";
import { AppError } from "./utils/AppError"
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const API_KEY = process.env["WEATHER_API_KEY"];

export const getWeather = async (city: string, state: string) => {
    try {
        const stateUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;
        const stateResponse = await axios.get(stateUrl);
        const stateData = stateResponse.data;

        const match = stateData.find((location: any) => 
            location.name.toLowerCase() === city.toLowerCase() && location.state.toLowerCase() === state.toLowerCase()
        );

        if (!match) {
            throw new AppError("Location not found", 404);
        }
        const { lat, lon } = match;

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`; // try an match result id by viewing documentation
        const response = await axios.get(weatherUrl);
        const data = response.data;


        return {
            city: data.name,
            state: state,
            country: data.sys.country,
            temperature: data.main.temp,
            high: data.main.temp_max,
            low: data.main.temp_min,
            feelsLike: data.main.feels_like,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            lat: lat,
            lon: lon
        };

    } catch (error: any){
        if(error.response) {
            throw new AppError (
                error.response.data.message || "Failed to fetch weather",
                error.response.status
            );
        }
        
        throw new AppError("Weather Service unavailable", 500);
    }
};

export const getCitySuggestion = async (city: string) => {
    try{
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;

        const response = await axios.get(url);
        
        const data = response.data.filter((item: any) => item.country == "US").map((item: any) => ({
            city: item.name,
            state: item.state
        }));

        return data;

    } catch(err) {
        throw new AppError("Failed to fetch suggestions", 500);
    }
}