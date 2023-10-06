import { Component } from '@angular/core';

import { Routes } from '@angular/router';
import { id } from 'date-fns/locale';
import { ArticleListComponent } from './article-list/article-list.component';






export const ArticleRoutes: Routes = [
 
  { 
    path: 'article', 
    component: ArticleListComponent ,
    data: { title: 'liste des articles', breadcrumb: 'liste des articles' }  
  
  },


]
