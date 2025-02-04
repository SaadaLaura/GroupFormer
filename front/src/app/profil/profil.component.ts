import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { StateService } from '../services/state.service';
import { UsersService } from '../services/users.service';
import { AbilitiesService } from '../services/abilities.service';
import { Interest, Student, Skill, Project } from '../class/Users';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  user: Student | null = null;
  interests: Interest[] = [];
  skills: Skill[] = [];
  major: string = '';
  newInterest: string = '';
  newSkill: string = '';
  newMajor: string = '';
  hasProject: boolean = false;
  projectName: string = '';
  remainingMembers: number = 0;
  editMode: { [key: string]: boolean } = {
    interests: false,
    skills: false,
    major: false
  };
  showDropdown: { [key: string]: boolean } = {
    interests: false,
    skills: false
  };
  availableSkills: string[] = [];
  availableInterests: string[] = [];
  selectedFile: File | null = null;
  isLoading: boolean = false;
  showAlert: boolean = false; 
  importMessage: string = '';
  importSuccess: boolean = false;
  userRole: string = ''; 

  constructor(
    private router: Router,
    private stateService: StateService,
    private usersService: UsersService,
    private abilitiesService: AbilitiesService
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.usersService.getUserInfo(token).subscribe({
        next: (response: Student) => {
          this.user = response;
          this.skills = response.skills.map(skill => new Skill(skill.id, skill.name));
          this.interests = response.subject.map(subject => new Interest(subject.id, subject.name));
          this.stateService.setSkills(this.skills.map(skill => skill.name));
          this.stateService.setInterests(this.interests.map(interest => interest.name));
          this.userRole = response.role;

          if (response.project) {
            this.hasProject = true;
            this.projectName = response.project.name;
            this.remainingMembers = response.project.missing;
          }

          // Récupérer les compétences et centres d'intérêt disponibles
          this.abilitiesService.getAllSkills(token).subscribe({
            next: (skills: Skill[]) => {
              this.availableSkills = skills.map(skill => skill.name);
            },
            error: (error) => {
              console.error('An error occurred while fetching skills:', error);
            }
          });

          this.abilitiesService.getAllSubjects(token).subscribe({
            next: (subjects: Interest[]) => {
              this.availableInterests = subjects.map(subject => subject.name);
            },
            error: (error) => {
              console.error('An error occurred while fetching subjects:', error);
            }
          });
        },
        error: (error) => {
          console.error('An error occurred:', error);
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  
    this.stateService.skills$.subscribe({
      next: (skills: string[] | null) => {
        if (skills !== null) {
          this.skills = skills.map(name => new Skill(0, name));
        }
      }
    });
  
    this.stateService.interests$.subscribe({
      next: (interests: string[] | null) => {
        if (interests !== null) {
          this.interests = interests.map(name => new Interest(0, name));
        }
      }
    });
  
    // Charger les compétences et centres d'intérêt depuis le localStorage
    const storedSkills = this.stateService.getSkillsFromLocalStorage();
    if (storedSkills) {
      this.skills = storedSkills.map(name => new Skill(0, name));
    }
  
    const storedInterests = this.stateService.getInterestsFromLocalStorage();
    if (storedInterests) {
      this.interests = storedInterests.map(name => new Interest(0, name));
    }
  
    // Charger les informations du fichier depuis le localStorage
    const storedFileName = localStorage.getItem('selectedFileName');
    if (storedFileName) {
      this.selectedFile = new File([], storedFileName);
    }
  }

  toggleDropdown(field: string) {
    this.showDropdown[field] = !this.showDropdown[field];
  }

  addInterest(interest: string) {
    if (interest && !this.interests.some(i => i.name === interest)) {
      this.interests.push(new Interest(0, interest));
      this.stateService.setInterests(this.interests.map(i => i.name)); // Enregistrer les centres d'intérêt dans le localStorage
    }
    this.showDropdown['interests'] = false;
  }

  addSkill(skill: string) {
    if (skill && !this.skills.some(s => s.name === skill)) {
      this.skills.push(new Skill(0, skill));
      this.stateService.setSkills(this.skills.map(s => s.name)); // Enregistrer les compétences dans le localStorage
    }
    this.showDropdown['skills'] = false;
  }

  addMajor() {
    if (this.editMode['major']) {
      this.major = this.newMajor.trim();
      this.newMajor = '';
      this.toggleEditMode('major');
    } else {
      this.toggleEditMode('major');
    }
  }

  toggleEditMode(field: string) {
    this.editMode[field] = !this.editMode[field];
  }

  removeInterest(interest: Interest) {
    this.interests = this.interests.filter(i => i !== interest);
    this.stateService.setInterests(this.interests.map(i => i.name)); // Enregistrer les centres d'intérêt mis à jour dans le localStorage
  }

  removeSkill(skill: Skill) {
    this.skills = this.skills.filter(s => s !== skill);
    this.stateService.setSkills(this.skills.map(s => s.name)); // Enregistrer les compétences mises à jour dans le localStorage
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      localStorage.setItem('selectedFileName', this.selectedFile.name);
      this.showAlert = true;
    }
  }

  confirmAlert() {
    if (this.selectedFile) {
      this.isLoading = true;
      this.usersService.uploadStudents(this.selectedFile).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.importMessage = 'Les étudiants ont été ajoutés avec succès';
          this.importSuccess = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.importMessage = this.translateErrorMessage(error.error.message);
          this.importSuccess = false;
        }
      });
    }
    this.showAlert = false;
  }

  cancelAlert() {
    this.showAlert = false;
    this.selectedFile = null;
    localStorage.removeItem('selectedFileName');
  }

  removeSelectedFile(event: Event) {
    event.preventDefault(); // Empêche l'événement de clic par défaut
    this.selectedFile = null;
    localStorage.removeItem('selectedFileName');
  }

  private translateErrorMessage(errorMessage: string): string {
    switch (errorMessage) {
      case 'Invalid file format':
        return 'Votre fichier Excel n\'a pas le bon format';
      case 'Invalid file format. Missing required columns':
        return 'Votre fichier Excel n\'a pas le bon format, il manque une ou plusieurs colonnes';
      default:
        return 'Une erreur est survenue';
    }
  }
}