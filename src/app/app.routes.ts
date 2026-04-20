import { Routes } from '@angular/router';
import { MainPage } from "./main-page/main.page";
import { SearchPage } from "./search-page/search.page"
import { SavedLocationsPage } from "./saved-locations/saved.locations"

export const routes: Routes = [
    {path: "", component: MainPage},
    {path: "search", component: SearchPage},
    {path: "saved", component: SavedLocationsPage}
];
