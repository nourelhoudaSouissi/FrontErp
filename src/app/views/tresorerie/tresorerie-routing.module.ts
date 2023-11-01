import {  Routes } from '@angular/router';
import { EncaissementComponent } from './encaissement/encaissement.component';
import { DecaissementComponent } from './decaissement/decaissement.component';
import { DecaissementPopUpComponent } from './decaissement/decaissement-pop-up/decaissement-pop-up.component';
import { EncaissementPopUpComponent } from './encaissement/encaissement-pop-up/encaissement-pop-up.component';
import { TresorerieListComponent } from './tresorerie-list/tresorerie-list/tresorerie-list.component';

export const TresorerieRoutes: Routes = [

{
  path: "encaissement",
  component: EncaissementComponent,
  data: { title: 'Encaissement', breadcrumb: 'Encaissement' }  
},
{
  path: "decaissement",
  component: DecaissementComponent,
  data: { title: 'Decaissement', breadcrumb: 'Decaissement' }  
},
{
  path: "caisse",
  component: TresorerieListComponent,
  data: { title: 'Caisse', breadcrumb: 'Caisse' }  
},
{
  path: "ADD",
  component: DecaissementPopUpComponent,
},
{
  path: "ajouter",
  component: EncaissementPopUpComponent,
},

];
export class TresorerieRoutingModule { }
