import { Component } from '@angular/core';

import { InfoPageComponent } from './info-page/info-page.component';

import { RouterLink, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { Router } from 'express';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ContentPageComponent } from './content-page/content-page.component';

@Component({
  selector: 'app-all-page',
  standalone: true,
  imports: [
    InfoPageComponent,
    ContentPageComponent,
    RouterModule,
    HeaderComponent,
    RouterLink,
    HttpClientModule,
  ],
  templateUrl: './all-page.component.html',
})
export class AllPageComponent {}
