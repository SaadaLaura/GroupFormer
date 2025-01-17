import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfilComponent } from './profil/profil.component';
import { StudentResearchComponent } from './student-research/student-research.component';
import { GroupResearchComponent } from './group-research/group-research.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirection par défaut vers home
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profil', component: ProfilComponent },
    { path: 'student-research', component: StudentResearchComponent},
    { path: 'group-research', component: GroupResearchComponent}
];
