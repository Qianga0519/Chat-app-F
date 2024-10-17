import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AllPageComponent } from './all-page/all-page.component';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from './service/quang/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RegisterComponent,
    LoginComponent,
    AllPageComponent,
    RouterModule,
    HttpClientModule,
  ],
  providers:[TokenService],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'chat-app';
}
