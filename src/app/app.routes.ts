import { Routes } from '@angular/router';
import { Connexion } from '../page/auth/connexion/connexion';
import { Inscription } from '../page/auth/inscription/inscription';
import { Accueil } from '../page/public/accueil/accueil';
import { Creation } from '../page/public/creation/creation';
import { CreerCours } from '../page/public/creer-cours/creer-cours';
import { CreerJeux } from '../page/public/creer-jeux/creer-jeux';
import { Jeux } from '../page/public/jeux/jeux';
import { JeuMemorie1 } from '../page/public/jeu-memorie1/jeu-memorie1';
import { JeuQcm1} from '../page/public/jeu-qcm1/jeu-qcm1';
import { JeuPuzzle1 } from '../page/public/jeu-puzzle1/jeu-puzzle1';
import { JeuPhrase1 } from '../page/public/jeu-phrase1/jeu-phrase1';






export const routes: Routes = [
    { path: '', component: Connexion },
    { path: 'connexion', component: Connexion },
    { path: 'inscription', component: Inscription },
    { path: 'accueil', component: Accueil },
    { path: 'creation', component: Creation },
    { path: 'creercours', component: CreerCours },
    { path: 'creerjeux', component: CreerJeux },
    { path: 'jeux', component: Jeux },
    { path: 'jeumemory/:id', component: JeuMemorie1 },
    { path: 'jeuqcm/:id', component: JeuQcm1 },
    { path: 'jeupuzzle/:id', component: JeuPuzzle1 },
    { path: 'jeuphrase/:id', component: JeuPhrase1 },
    
];
