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
    {
        path: 'register',
        loadComponent: () =>
        import('./components/register/register.component').then(
        (m) => m.RegisterComponent
        ),
    },
    {
        path: 'login',
        loadComponent: () =>
        import('./components/login/login.component').then(
        (m) => m.LoginComponent
        ),
    },
    {
        path: 'contact',
        loadComponent: () =>
        import('./components/contact/contact.component').then(
        (m) => m.ContactComponent
        ),
    },
    {
        path: 'abautus',
        loadComponent: () =>
        import('./components/abaut-us/abaut-us.component').then(
        (m) => m.AbautUsComponent
        ),
    },
    {
        path: 'restore',
        loadComponent: () =>
        import('./components/restore/restore.component').then(
        (m) => m.RestoreComponent
        ),
    },
    {
        path: 'shopping-cart',
        loadComponent: () =>
        import('./components/shopping-cart/shopping-cart.component').then(
        (m) => m.ShoppingCartComponent
        ),
    },
    {
        path: 'admin-product',
        loadComponent: () =>
        import('./components/admin-product-panel/admin-product-panel.component').then(
        (m) => m.AdminProductPanelComponent
        ),
    },
    // Dejar '**' siempre al final
    {
        path: '**',
        redirectTo: 'inicio',
        pathMatch: 'full',
    },

];
