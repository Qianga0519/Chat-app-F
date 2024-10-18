import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,HttpClientModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

}
