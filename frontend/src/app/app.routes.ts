import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: 'inicio',
        loadComponent: () =>
            import('./components/home/home.component').then((m) => m.HomeComponent),
    },
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
    },
    {
        path: 'catalogo',
        loadComponent: () =>
        import('./components/catalogo/catalogo.component').then(
        (m) => m.CatalogoComponent
        ),
    },
    // Dejar '**' siempre al final
    {
        path: '**',
        redirectTo: 'inicio',
        pathMatch: 'full',
    },

];
