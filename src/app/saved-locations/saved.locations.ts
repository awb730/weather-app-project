import { Component, signal } from '@angular/core';
import { SavedLocationsService, WeatherService } from '../app.services'
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'
import { STATE_ABBREVIATIONS, ABBR_TO_STATE } from '../states'

@Component({
    selector: "app-saved",
    imports: [CommonModule, RouterModule],
    templateUrl: './saved.locations.html',
    styleUrl: './saved.locations.css'
})


export class SavedLocationsPage {
    constructor(private savedService: SavedLocationsService, private weatherService: WeatherService, private router: Router){}

    savedLocations: {city: string, state: string}[] = []
    isSaved = signal(false);

    deleteLocation(city: string, state: string) {
        this.savedService.delLocation(city, state);
        if (this.savedLocations.length === 0) {
                this.isSaved.set(false);
            } else {
                this.isSaved.set(true);
            }
    }

    search(city: string, state: string) {
        const newState = ABBR_TO_STATE[state];
        this.weatherService.searchByLocation(city, newState).subscribe((data1: any) => {
            if (data1.success === true) {
                this.weatherService.setCurrentWeather(data1);
            }
            this.router.navigate(['/']);
        });
    }

    backHome() {
        this.router.navigate(["/"]);
    }

    ngOnInit() {
        this.savedService.savedLocations$.subscribe(list => {
            this.savedLocations = list;
            if (this.savedLocations.length === 0) {
                this.isSaved.set(false);
            } else {
                this.isSaved.set(true);
            }
        })
    }
}