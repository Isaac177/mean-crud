import { Component } from '@angular/core';
import {WeatherService} from "../weather.service";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  standalone: true,
  styleUrls: ['./weather.component.css'],
  imports: [
    CommonModule, FormsModule, NgIf, NgForOf,  MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule
  ]
})
export class WeatherComponent {
  city: string | undefined;
  weatherData: any;

  constructor(private weatherService: WeatherService) {
  }

  getWeather(): void {
    if (this.city) {
      this.weatherService.getWeather(this.city).subscribe(
        data => this.weatherData = data,
        error => console.error('Error:', error)
      );
    } else {
      console.error('City is not defined');
    }
  }
}
