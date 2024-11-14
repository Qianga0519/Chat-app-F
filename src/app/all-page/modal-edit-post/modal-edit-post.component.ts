import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-edit-post',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './modal-edit-post.component.html',
  styleUrl: './modal-edit-post.component.css'
})
export class ModalEditPostComponent {

}
