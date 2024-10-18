import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { WrapperLeftComponent } from "../wrapper-left/wrapper-left.component";
import { WrapperRightComponent } from "../wrapper-right/wrapper-right.component";
import { ModalEditPostComponent } from "../../modal-edit-post/modal-edit-post.component";
import { ModalCreatePostComponent } from "../../modal-create-post/modal-create-post.component";
import { FooterComponent } from "../../footer/footer.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-wrapper-search',
  standalone: true,
  imports: [HttpClientModule,HeaderComponent, WrapperLeftComponent, WrapperRightComponent, ModalEditPostComponent, ModalCreatePostComponent, FooterComponent],
  templateUrl: './wrapper-search.component.html',
  styleUrl: './wrapper-search.component.css'
})
export class WrapperSearchComponent {

}
