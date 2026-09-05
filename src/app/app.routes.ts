import { Routes } from '@angular/router';
import { ControllerComponent } from './components/controller.component';
import { PresentationViewComponent } from './components/presentation-view/presentation-view.component';

export const routes: Routes = [
  { path: '', component: ControllerComponent },
  { path: 'present-view', component: PresentationViewComponent },
  { path: '**', redirectTo: '' },
];
