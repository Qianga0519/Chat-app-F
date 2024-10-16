import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { AllPageComponent } from "./all-page/all-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RegisterComponent, LoginComponent, AllPageComponent, RouterModule],
  templateUrl: './app.component.html',
  // styleUrl: '../assets/css/style-index.css',
})
export class AppComponent {
  title = 'chat-app';
}
