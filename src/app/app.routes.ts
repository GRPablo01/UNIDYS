import { Routes } from '@angular/router';
import { Connexion } from '../page/auth/connexion/connexion';
import { Inscription } from '../page/auth/inscription/inscription';
import { Accueil } from '../page/public/accueil/accueil';
import { Creation } from '../page/public/creation/creation';
import { CreerCours } from '../page/public/creer-cours/creer-cours';
import { CreerJeux } from '../page/public/creer-jeux/creer-jeux';





export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'connexion', component: Connexion },
    { path: 'inscription', component: Inscription },
    { path: 'accueil', component: Accueil },
    { path: 'creation', component: Creation },
    { path: 'creercours', component: CreerCours },
    { path: 'creerjeux', component: CreerJeux },

    
];
