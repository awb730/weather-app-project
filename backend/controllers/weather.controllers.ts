import { getWeather, getCitySuggestion } from "../weather.services"
import { Request, Response, NextFunction } from "express";

export const findWeather = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const {city} = req.query;
        const {state} = req.query
        
        if(!city) {
            return next(new Error("City is Required"));
        }

        if(!state) {
            return next(new Error("State is Required"));
        }
        
        const data1 = await getWeather(city as string, state as string);
    
        return res.status(200).json({success: true, data1});

    } catch(err) {
        next(err);
    }    
};

export const getSuggestions = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { query } = req.query;

        if(!query) {
            return res.status(400).json({message: "Query is required"});
        }

        const results = await getCitySuggestion(query as string);

        res.status(200).json({success: true, data: results})

    } catch (err: any) {
        next(err);
    }
}

// export const searchByCondition = (req: Request, res: Response) => {
//     const {condition} = req.query;

//     let data = await getWeatherByCity()

//     if (condition) {
//         data = data.filter(place => condition.toLowerCase() === place.condition)
//         return res.status(200).json(data);
//     }
//     return res.status(404).json({"success": false, "msg": "There is no location with this condition at this moment."})
// }


