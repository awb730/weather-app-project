import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject } from 'rxjs';
import { STATE_ABBREVIATIONS, ABBR_TO_STATE } from './states'

interface WeatherResponse {
    data1: {
        city: string;
    };
}

interface SuggestionResponse {
    data: {
        city: string,
        state: string
    }
};

@Injectable ({
    providedIn: "root"
})

export class WeatherService {
    private baseUrl = "http://localhost:5000/api/weather";

    constructor(private http: HttpClient) {}

    private currentWeatherSubject = new BehaviorSubject<any>(null);
    currentWeather$ = this.currentWeatherSubject.asObservable();

    searchByLocation(city: string, state: string) {
        return this.http.get(`${this.baseUrl}/search?city=${city.toLowerCase()}&state=${state.toLowerCase()}`);
    }

    setCurrentWeather(data: WeatherResponse) {
        this.currentWeatherSubject.next(data);
        return;
    }

    getCurrentWeather() {
        return this.currentWeather$;
    }

    getSuggestions(query: string) {
        return this.http.get(
            `${this.baseUrl}/suggestions?query=${query}`
        );
    }
}

@Injectable ({
    providedIn: "root"
})

export class SavedLocationsService {
    savedLocationsSubject = new BehaviorSubject<{city: string, state: string}[]>([]);
    savedLocations$ = this.savedLocationsSubject.asObservable();

    addLocation(city: string, state: string) {
        const current = this.savedLocationsSubject.value;

        const newState = STATE_ABBREVIATIONS[state.toLowerCase()];

        if (current.some(l => l.city === city && l.state === newState)) return;

        this.savedLocationsSubject.next([...current, {city: city, state: newState}]);
    }

    delLocation(city: string, state: string) {
        let current = this.savedLocationsSubject.value;
        current = current.filter(location => location.city !== city && location.state !== state);
        this.savedLocationsSubject.next(current);
    }
}


@Injectable ({
    providedIn: "root"
})
export class SearchHistoryService {
    private historySubject = new BehaviorSubject<{city: string, state: string}[]>([]);
    history$ = this.historySubject.asObservable();

    addRecentSearch(data: any) {
        const current = this.historySubject.value;

        const city = data.data?.city || data.data1?.city;
        const state = data.data?.state || "";

        if(!city) return;
        
        if(!state) {
            if (current.some(c => c.city === city)) return;
            this.historySubject.next([{city: city, state: state}, ...current]);
        } else {
            if (current.some(c => c.city === city && c.state === state)) return;
            this.historySubject.next([{city: city, state: state}, ...current]);
        }
        
    }

    getCurrentHistory() {
        return this.history$;
    }
}

// @Injectable ({
//     providedIn: "root"
// })

// export class NextLocationService {
//     private nextLocationSubject = new BehaviorSubject<string>("");
//     nextLocation$ = this.nextLocationSubject.asObservable();


// }

