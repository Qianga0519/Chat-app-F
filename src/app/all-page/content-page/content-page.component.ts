import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { WrapperListPostComponent } from "./wrapper-list-post/wrapper-list-post.component";
import { RouterModule } from '@angular/router';
import { TokenService } from '../../service/quang/token.service';

@Component({
  selector: 'app-content-page',
  standalone: true,
  imports: [HeaderComponent, WrapperListPostComponent,RouterModule], providers: [TokenService],
  templateUrl: './content-page.component.html',
})
export class ContentPageComponent {

}
