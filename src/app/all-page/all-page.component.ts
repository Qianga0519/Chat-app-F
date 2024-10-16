import { Component } from '@angular/core';

import { InfoPageComponent } from "./info-page/info-page.component";
import { ContentPageComponent } from "./content-page/content-page.component";

import { RouterLink, RouterModule } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { Router } from 'express';

@Component({
  selector: 'app-all-page',
  standalone: true,
  imports: [InfoPageComponent, ContentPageComponent, RouterModule, HeaderComponent, RouterLink],
  templateUrl: './all-page.component.html'
})
export class AllPageComponent {

}
