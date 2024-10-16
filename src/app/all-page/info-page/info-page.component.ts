import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ModalEditPostComponent } from "../modal-edit-post/modal-edit-post.component";
import { ModalCreatePostComponent } from "../modal-create-post/modal-create-post.component";

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [HeaderComponent, ModalEditPostComponent, ModalCreatePostComponent],
  templateUrl: './info-page.component.html',
  styleUrl: './info-page.component.css'
})
export class InfoPageComponent {

}
