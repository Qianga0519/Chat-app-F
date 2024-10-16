import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WrapperListPostComponent } from './wrapper-list-post/wrapper-list-post.component';
import { WrapperDetailPostComponent } from './wrapper-detail-post/wrapper-detail-post.component';
import { WrapperSearchComponent } from './wrapper-search/wrapper-search.component';
import { WrapperMessageComponent } from './wrapper-message/wrapper-message.component';
import { WrapperNotificationsComponent } from './wrapper-notifications/wrapper-notifications.component';


export const routesPageContent: Routes = [
  { 
    path: '',
    children: [
      {path: '', component: WrapperListPostComponent},
      {path: 'detail', component: WrapperDetailPostComponent},
      {path: 'message', component: WrapperMessageComponent},
      {path: 'search', component: WrapperSearchComponent},
      {path: 'notifications', component: WrapperNotificationsComponent}
    ]
  }
];

