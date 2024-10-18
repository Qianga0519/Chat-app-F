import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ModalEditPostComponent } from "../modal-edit-post/modal-edit-post.component";
import { ModalCreatePostComponent } from "../modal-create-post/modal-create-post.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [HeaderComponent, ModalEditPostComponent, ModalCreatePostComponent,HttpClientModule],
templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.css'
})
export class InfoPageComponent {

}
