import { Routes } from '@angular/router';
import { Connexion } from '../page/connexion/connexion';
import { Inscription } from '../page/inscription/inscription';
import { AccueilA } from '../page/page-user/admin/accueil-a/accueil-a';
import { AccueilP } from '../page/page-user/prof/accueil-p/accueil-p';
import { AccueilE } from '../page/page-user/eleve/accueil-e/accueil-e';
import { AproposE } from '../page/page-user/eleve/apropos-e/apropos-e';
import { MonEspaceE } from '../page/page-user/eleve/monespace-e/monespace-e';
import { AproposP } from '../page/page-user/prof/apropos-p/apropos-p';
import { MonespaceP } from '../page/page-user/prof/monespace-p/monespace-p';
import { InformationE } from '../page/page-user/eleve/information-e/information-e';
import { CoursDetailP } from '../component-page/Prof/page-monespace/cours-detail-p/cours-detail-p';
import { ClasseCPP } from '../page/page-user/prof/classe-cp/classe-cp';
import { ClasseCPE } from '../page/page-user/eleve/classe-cp/classe-cp';
import { CoursDetailE} from '../component-page/Eleve/page-cour/cours-detail-e/cours-detail-e';
import { User } from '../page/page-user/admin/user/user';
import { Cours } from '../page/page-user/admin/cours/cours';
import { ClassementG } from '../page/page-user/prof/classement-g/classement-g';
import { ClassementGE } from '../page/page-user/eleve/classement-g/classement-g';
import { CoursdetailP } from '../component-page/Prof/page-cour/cours-detail-p/cours-detail-p';
import { CGU } from '../page/cgu/cgu';


export const routes: Routes = [
  {path: 'connexion', component: Connexion },
  {path: '', redirectTo: 'connexion', pathMatch: 'full' },
  {path: 'inscription', component: Inscription },
  {path: 'cgu',component: CGU},

  
  // route page admin
  {path: 'accueilA', component: AccueilA},
  {path: 'userA', component: User},
  {path: 'coursA', component: Cours},



  // route page prof
  {path: 'accueilP', component: AccueilP},
  {path: 'aproposP', component: AproposP},
  {path: 'monespaceP', component: MonespaceP},
  {path: 'coursdetail/:id', component: CoursdetailP},
  {path: 'coursP', component: ClasseCPP},
  {path: 'classementP', component: ClassementG},


  // route page eleve
  {path: 'accueilE', component: AccueilE},
  {path: 'aproposE', component: AproposE},
  {path: 'monespaceE', component: MonEspaceE},
  {path: 'classementE', component: ClassementGE},

  {path: 'InfoE', component: InformationE},
  {path: 'coursE', component: ClasseCPE},
  {path: 'coursdetailE/:id', component: CoursDetailE}

];

