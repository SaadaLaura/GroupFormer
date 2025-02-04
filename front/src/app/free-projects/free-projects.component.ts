import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ProjectService } from '../services/project.service';
import { UsersService } from '../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../class/Project';
import { Student } from '../class/Users';

@Component({
  selector: 'app-free-projects',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './free-projects.component.html',
  styleUrls: ['./free-projects.component.scss']
})
export class FreeProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  searchTerm: string = '';
  keywords: string = '';
  selectedAdaptedFilter: string = 'sans';
  isLoading: boolean = true;
  isDataLoaded: boolean = false;
  isInitialLoadEmpty: boolean = false;
  isSortedAscending: boolean = true;
  userRole: string = '';
  showAddProjectPopup: boolean = false;
  newProject: Project = new Project(0, '', '', 0, '', [], []);
  showMessage: boolean = false;
  message: string = '';
  messageType: string = '';
  isFormValid: boolean = false;
  isEditMode: boolean = false;
  editProjectId: number | null = null;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertAction: () => void = () => {};

  constructor(private projectService: ProjectService, private usersService: UsersService) {}

  ngOnInit(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    if (token) {
      this.loadUserInfo(token);
      this.loadProjects(token);
    }
  }

  loadUserInfo(token: string): void {
    this.usersService.getUserInfo(token).subscribe({
      next: (user: Student) => {
        this.userRole = user.role;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des informations utilisateur', error);
      }
    });
  }

  loadProjects(token: string): void {
    this.projectService.getProjectsWithoutStudents(token).subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
        this.isInitialLoadEmpty = projects.length === 0;
        this.applyFilters();
        this.isLoading = false;
        this.isDataLoaded = true;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des projets', error);
      }
    });
  }

  applyFilters(): void {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearchTerm = project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                project.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesKeywords = this.keywords ? project.name.toLowerCase().includes(this.keywords.toLowerCase()) ||
                                              project.description.toLowerCase().includes(this.keywords.toLowerCase()) : true;
      return matchesSearchTerm && matchesKeywords;
    });
  }

  sortProjectsByName(): void {
    this.isSortedAscending = !this.isSortedAscending;
    this.filteredProjects.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return this.isSortedAscending ? -1 : 1;
      }
      if (nameA > nameB) {
        return this.isSortedAscending ? 1 : -1;
      }
      return 0;
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ajoute 1 pour obtenir le mois correct
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  openAddProjectPopup(): void {
    this.isEditMode = false;
    this.newProject = new Project(0, '', '', 0, '', [], []);
    this.showAddProjectPopup = true;
  }

  openEditProjectPopup(project: Project): void {
    this.isEditMode = true;
    this.editProjectId = project.id;
    this.newProject = { ...project };
    this.showAddProjectPopup = true;
  }

  closeAddProjectPopup(): void {
    this.showAddProjectPopup = false;
  }

  checkRequiredFields(): void {
    this.isFormValid = this.newProject.name.trim() !== '' && this.newProject.size > 0 && this.newProject.description.trim() !== '';
  }

  confirmAddOrEditProject(): void {
    this.alertMessage = `Voulez-vous vraiment ${this.isEditMode ? 'modifier' : 'ajouter'} ce projet ?`;
    this.alertAction = () => this.executeAddOrEditProject();
    this.showAlert = true;
  }

  executeAddOrEditProject(): void {
    this.showAddProjectPopup = false;
    this.showMessage = true;
    this.message = `${this.isEditMode ? 'Modification' : 'Ajout'} du projet`;
    this.messageType = 'loading';

    const token = localStorage.getItem('token');
    if (token) {
      const projectObservable = this.isEditMode
        ? this.projectService.updateProject(token, this.editProjectId!, this.newProject)
        : this.projectService.addProject(token, this.newProject);

      projectObservable.subscribe({
        next: () => {
          this.message = `Le projet a bien été ${this.isEditMode ? 'modifié' : 'ajouté'}`;
          this.messageType = 'success';
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
          this.loadProjects(token);
        },
        error: (error) => {
          this.message = `Erreur : ${error.message}`;
          this.messageType = 'error';
          setTimeout(() => {
            this.showMessage = false;
          }, 5000);
        }
      });
    }
    this.showAlert = false;
  }

  confirmDeleteProject(projectId: number): void {
    this.alertMessage = 'Voulez-vous vraiment supprimer ce projet ?';
    this.alertAction = () => this.executeDeleteProject(projectId);
    this.showAlert = true;
  }

  executeDeleteProject(projectId: number): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.projectService.deleteProject(token, projectId).subscribe({
        next: () => {
          this.message = 'Le projet a bien été supprimé';
          this.messageType = 'success';
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
          this.loadProjects(token);
        },
        error: (error) => {
          this.message = `Erreur : ${error.message}`;
          this.messageType = 'error';
          setTimeout(() => {
            this.showMessage = false;
          }, 5000);
        }
      });
    }
    this.showAlert = false;
  }

  confirmJoinProject(projectId: number): void {
    this.alertMessage = 'Voulez-vous vraiment rejoindre ce projet ?';
    this.alertAction = () => this.executeJoinProject(projectId);
    this.showAlert = true;
  }

  executeJoinProject(projectId: number): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.projectService.joinProject(token, projectId).subscribe({
        next: () => {
          this.message = 'Vous avez rejoint le projet avec succès';
          this.messageType = 'success';
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
          this.loadProjects(token);
        },
        error: (error) => {
          this.message = `Erreur : ${error.message}`;
          this.messageType = 'error';
          setTimeout(() => {
            this.showMessage = false;
          }, 5000);
        }
      });
    }
    this.showAlert = false;
  }

  confirmAlert(): void {
    this.alertAction();
  }

  cancelAlert(): void {
    this.showAlert = false;
  }
}