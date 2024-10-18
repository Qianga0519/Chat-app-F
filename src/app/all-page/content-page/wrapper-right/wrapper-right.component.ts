import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-wrapper-right',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './wrapper-right.component.html',
  styleUrl: './wrapper-right.component.css'
})
export class WrapperRightComponent {

}
