import { Component } from '@angular/core';
import { WeatherService, SavedLocationsService } from '../app.services'
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { take } from "rxjs";
import { STATE_ABBREVIATIONS } from '../states'

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './main.page.html',
  styleUrl: './main.page.css'
})

export class MainPage {
  constructor(
    private weatherService: WeatherService, 
    private router: Router, 
    private savedService: SavedLocationsService
  ) {}

  Math = Math;
  protected currCity: string = "";
  protected currState: string = "";
  protected temperature: number = 0;
  protected high: number = 0;
  protected low: number = 0;
  protected condition: string = "";
  protected humidity: number = 0;
  protected currentWeatherIndex: number = -1;
  protected isSaved: boolean = false;
  
  goToSearch() {
    this.router.navigate(["/search"]);
  }

  goToSavedLocations() {
    this.router.navigate(["/saved"])
  }

  pausecomp(millis: number) {
      var date = new Date();
      var curDate = null;
      do { curDate = new Date(); }
      while(curDate.getTime() - date.getTime() < millis);
  }


  saveLocation() {
    this.isSaved = false;
    this.weatherService.currentWeather$.pipe(take(1)).subscribe(data => {
      if(data == undefined) return;
      
      this.savedService.addLocation(data.data1.city, data.data1.state);
      
      const currentCity = data.data1.city
      const currentState = data.data1.state
      this.savedService.savedLocations$.subscribe(locations => {
        this.currentWeatherIndex = locations.indexOf({city: currentCity, state: currentState});
      });
    });

    this.isSaved = true;
  }

  delSaveNoti() {
    this.isSaved = false;
  }

nextLocation() {
    const locations = this.savedService.savedLocationsSubject.value;
    
    if (!locations || locations.length === 0) return;

    this.currentWeatherIndex = (this.currentWeatherIndex + 1) % locations.length;
    const { city, state } = locations[this.currentWeatherIndex];

    this.weatherService.searchByLocation(city, state).subscribe((cityData: any) => {
        this.weatherService.setCurrentWeather(cityData);
    });
}

  ngOnInit(){
    this.weatherService.getCurrentWeather().subscribe((data: any) => {
      if(data) {
        this.currCity = data.data1.city;
        this.currState = STATE_ABBREVIATIONS[data.data1.state];
        this.temperature = data.data1.temperature;
        this.high =  data.data1.high;
        this.low =  data.data1.low;
        this.condition = data.data1.description;
        this.humidity = data.data1.humidity;

        const currentCity = data.data1.city;
        this.savedService.savedLocations$.subscribe(locations => {
          this.currentWeatherIndex = locations.indexOf(currentCity);
        });
      } else {
        this.weatherService.searchByLocation("New York", "New York").subscribe((initData: any) => {
          this.weatherService.setCurrentWeather(initData);
          this.currCity = initData.data1.city;
          this.currState = STATE_ABBREVIATIONS[initData.data1.state];
          this.temperature = initData.data1.temperature;
          this.high =  initData.data1.high;
          this.low =  initData.data1.low;
          this.condition = initData.data1.description;
          this.humidity = initData.data1.humidity;
        })
      }
    })
  }
}
