import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Presentation Controller',
    loadComponent: () =>
      import('./components/controller.component').then((m) => m.ControllerComponent),
  },
  {
    path: 'present-view',
    title: 'Stage Display - Presenter',
    loadComponent: () =>
      import('./components/presentation-view/presentation-view.component').then(
        (m) => m.PresentationViewComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
