import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'calendar', pathMatch: 'full' },
    {
        path: '',
        loadComponent: () => import('./public/layout/layout').then(m => m.Layout),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./public/login/login').then(m => m.Login)
            },
            {
                path: 'register',
                loadComponent: () => import('./public/register/register').then(m => m.Register)
            }
        ],
    },
    {
        path: '',
        loadComponent: () => import('./private/layout/layout').then(m => m.Layout),
        children: [
            { path: '', redirectTo: 'calendar', pathMatch: 'full' },
            {
                path: 'calendar',
                loadComponent: () => import('./private/calendar/calendar').then(m => m.Calendar)
            },
            {
                path: 'list',
                loadComponent: () => import('./private/list/list').then(m => m.List)
            },
            {
                path: 'user',
                loadComponent: () => import('./private/user/user').then(m => m.User)
            },
            {
                path: 'admin',
                loadComponent: () => import('./private/admin/admin').then(m => m.Admin),
                children: [
                    {
                        path: 'agenda',
                        loadComponent: () => import('./private/admin-agenda/admin-agenda').then(m => m.AdminAgenda)
                    },
                    {
                        path: 'users',
                        loadComponent: () => import('./private/admin-users/admin-users').then(m => m.AdminUsers)
                    }
                ],
            },
        ]
    },
];
