import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MainTableComponent} from "./main-table/main-table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'metrans-demo';
}
