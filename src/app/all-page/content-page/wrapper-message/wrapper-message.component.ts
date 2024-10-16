import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { WrapperRightComponent } from "../wrapper-right/wrapper-right.component";
import { WrapperLeftComponent } from "../wrapper-left/wrapper-left.component";
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-wrapper-message',
  standalone: true,
  imports: [HeaderComponent, WrapperRightComponent, WrapperLeftComponent, FooterComponent],
  templateUrl: './wrapper-message.component.html',
})
export class WrapperMessageComponent {

}
