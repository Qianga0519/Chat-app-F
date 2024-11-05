import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-wrapper-left',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './wrapper-left.component.html',
})
export class WrapperLeftComponent {

}
