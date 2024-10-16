import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { WrapperRightComponent } from "../wrapper-right/wrapper-right.component";
import { WrapperLeftComponent } from "../wrapper-left/wrapper-left.component";
import { ModalEditPostComponent } from "../../modal-edit-post/modal-edit-post.component";
import { ModalCreatePostComponent } from "../../modal-create-post/modal-create-post.component";
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-wrapper-list-post',
  standalone: true,
  imports: [HeaderComponent, WrapperRightComponent, WrapperLeftComponent, ModalEditPostComponent, ModalCreatePostComponent, FooterComponent],
  templateUrl: './wrapper-list-post.component.html',
})
export class WrapperListPostComponent {

}
