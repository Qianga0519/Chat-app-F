import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-create-post',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './modal-create-post.component.html',
  styleUrl: './modal-create-post.component.css'
})
export class ModalCreatePostComponent {

}
