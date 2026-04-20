import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { WeatherService, SearchHistoryService } from '../app.services';
import { debounceTime, switchMap } from "rxjs";


@Component({
  selector: 'app-search',  
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './search.page.html',
  styleUrl: './search.page.css'
})

export class SearchPage implements OnInit {
  protected searchHistory: any[][] = []
  protected suggestions: any[] = [];
  searchControl = new FormControl('');

  constructor(
    private weatherService: WeatherService, 
    private historyService: SearchHistoryService,
    private router: Router
  ) {}

  selectSuggestion(sugg: any) {
    const city = sugg.city;
    const state = sugg.state;
    this.suggestions = [];
    this.searchWeather(city, state);
    this.searchControl.setValue(`${city}, ${state}`, { emitEvent: false });
  }

  searchWeather(city: string, state: string) {
    this.weatherService.searchByLocation(city, state).subscribe((data1: any) => {
      if (data1.success === true) {
        this.weatherService.setCurrentWeather(data1);
        this.historyService.addRecentSearch({
          data: { city: city, state: state }
        });
      }

      this.router.navigate(['/']);
    });
  }

  updateSuggestions() {
    this.searchControl.valueChanges.pipe(debounceTime(200), switchMap((val) => this.weatherService.getSuggestions(val || ''))).subscribe((res: any) => {
      this.suggestions = res.data || [];
    });
  }

  backHome() {
    this.router.navigate(["/"]);
  }

  ngOnInit() {
    this.updateSuggestions();
    this.historyService.getCurrentHistory().subscribe(history => {
      this.searchHistory = history.map(entry => [entry.city, entry.state]);
    })
  }
}