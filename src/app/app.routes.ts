import { Routes } from '@angular/router';

import { Inscription } from '../page/inscription/inscription';
import { Connexion } from '../page/connexion/connexion';
import { Accueil } from '../page/accueil/accueil';


// import { Dashboard } from '../page/dashboard/dashboard';
// import { MesCours } from '../page/mes-cours/mes-cours';
// import { Modules } from '../page/modules/modules';
// import { CoursDetail } from '../page/cours-detail/cours-detail';
// import { CGU } from '../page/cgu/cgu';
// import { COOKIES } from '../page/cookies/cookies';


export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'connexion', component: Connexion},
    { path: 'inscription', component: Inscription},
    // { path: 'cgu', component: CGU},
    // { path: 'cookies', component: COOKIES},
    { path: 'accueil', component: Accueil},
    // { path: 'dashboard', component: Dashboard},
    // { path: 'cours', component: MesCours},
    // { path: 'modules', component: Modules},
    // { path: 'coursdetail/:id', component: CoursDetail},

];
