import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { WrapperListPostComponent } from "./wrapper-list-post/wrapper-list-post.component";
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-content-page',
  standalone: true,
  imports: [HeaderComponent, WrapperListPostComponent,RouterModule,HttpClientModule], 

  templateUrl: './content-page.component.html',
})
export class ContentPageComponent {

}
