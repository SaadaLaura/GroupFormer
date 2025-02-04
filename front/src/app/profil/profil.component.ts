import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { StateService } from '../services/state.service';
import { UsersService } from '../services/users.service';
import { AbilitiesService } from '../services/abilities.service';
import { Interest, Student, Skill, Project } from '../class/Users';
import { AnnouncementService } from '../services/announcement.service';
import { Announcement } from '../class/Announcement';

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
  missingMembers: number = 0;
  editMode: { [key: string]: boolean } = {
    interests: false,
    skills: false,
    major: false
  };
  showDropdown: { [key: string]: boolean } = {
    interests: false,
    skills: false,
    announcementSkills: false,
    announcementSubjects: false
  };
  availableSkills: Skill[] = [];
  availableInterests: Interest[] = [];
  selectedFile: File | null = null;
  isLoading: boolean = false;
  showAlert: boolean = false; 
  importMessage: string = '';
  importSuccess: boolean = false;
  userRole: string = ''; 

  alertMessage: string = '';
  alertAction: (() => void) | null = null;

  // Variables pour l'annonce
  showAnnouncementPopup: boolean = false;
  announcementTitle: string = '';
  announcementDescription: string = '';
  selectedSkills: Skill[] = [];
  selectedSubjects: Interest[] = [];
  isFormValid: boolean = false;
  isSubmitting: boolean = false;
  announcementSuccessMessage: string = '';
  announcements: Announcement[] = [];

  constructor(
    private router: Router,
    private stateService: StateService,
    private usersService: UsersService,
    private abilitiesService: AbilitiesService,
    private announcementService: AnnouncementService
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
            this.missingMembers = response.project.missing;
            this.loadAnnouncements(response.project.id);
          }

          // Récupérer les compétences et centres d'intérêt disponibles
          this.abilitiesService.getAllSkills(token).subscribe({
            next: (skills: Skill[]) => {
              this.availableSkills = skills;
            },
            error: (error) => {
              console.error('An error occurred while fetching skills:', error);
            }
          });

          this.abilitiesService.getAllSubjects(token).subscribe({
            next: (subjects: Interest[]) => {
              this.availableInterests = subjects;
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

  addInterest(interest: Interest) {
    if (interest && !this.interests.some(i => i.id === interest.id)) {
      this.interests.push(interest);
      this.stateService.setInterests(this.interests.map(i => i.name)); // Enregistrer les centres d'intérêt dans le localStorage
    }
    this.showDropdown['interests'] = false;
  }

  addSkill(skill: Skill) {
    if (skill && !this.skills.some(s => s.id === skill.id)) {
      this.skills.push(skill);
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
    if (this.alertAction) {
      this.alertAction();
    }
    this.showAlert = false;
    this.alertAction = null;
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

  // Méthode pour afficher l'alerte de confirmation
  showAlertWithAction(message: string, action: () => void) {
    this.alertMessage = message;
    this.alertAction = action;
    this.showAlert = true;
  }

  // Méthode pour supprimer une annonce avec confirmation
  deleteAnnouncement(announcementId: number) {
    const token = localStorage.getItem('token');
    if (token) {
      this.showAlertWithAction('Voulez-vous vraiment supprimer cette annonce ?', () => {
        this.announcementService.deleteAnnouncement(token, announcementId).subscribe({
          next: (response) => {
            this.announcements = this.announcements.filter(a => a.id !== announcementId);
          },
          error: (error) => {
            console.error('Erreur lors de la suppression de l\'annonce:', error);
          }
        });
      });
    } else {
      console.error('Token non trouvé');
    }
  }

  // Méthode pour confirmer l'ajout de l'annonce
  confirmAnnouncement() {
    this.isSubmitting = true;
    const newAnnouncement = {
      title: this.announcementTitle,
      description: this.announcementDescription,
      skills: this.selectedSkills.map(skill => skill.id), // Utiliser les IDs des compétences
      subjects: this.selectedSubjects.map(subject => subject.id) // Utiliser les IDs des centres d'intérêt
    };
    const token = localStorage.getItem('token');
  
    if (token) {
      this.announcementService.createAnnouncement(token, newAnnouncement).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.announcementSuccessMessage = 'Votre annonce a été ajoutée avec succès';
          this.loadAnnouncements(this.user?.project?.id); // Recharger les annonces après ajout
          setTimeout(() => {
            this.announcementSuccessMessage = '';
            this.closeAnnouncementPopup();
          }, 3000);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Erreur lors de la création de l\'annonce:', error);
        }
      });
    } else {
      console.error('Token non trouvé');
      this.isSubmitting = false;
    }
  
    this.showAlert = false;
    this.closeAnnouncementPopup(); // Fermer le popup après confirmation
  }

  // Méthode pour afficher l'alerte de confirmation pour l'ajout d'une annonce
  submitAnnouncement() {
    if (this.isFormValid) {
      this.showAlertWithAction('Voulez-vous vraiment ajouter cette annonce ?', this.confirmAnnouncement.bind(this));
    }
  }

  // Méthodes pour gérer l'annonce
  openAnnouncementPopup() {
    this.showAnnouncementPopup = true;
  }

  closeAnnouncementPopup() {
    this.showAnnouncementPopup = false;
    this.resetAnnouncementForm();
  }

  checkFormValidity() {
    this.isFormValid = this.announcementTitle.trim().length > 0;
  }

  resetAnnouncementForm() {
    this.announcementTitle = '';
    this.announcementDescription = '';
    this.selectedSkills = [];
    this.selectedSubjects = [];
    this.isFormValid = false;
  }

  addSelectedSkill(skill: Skill) {
    if (!this.selectedSkills.includes(skill)) {
      this.selectedSkills.push(skill);
    }
    this.showDropdown['announcementSkills'] = false;
  }

  removeSelectedSkill(skill: Skill) {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
  }

  addSelectedSubject(subject: Interest) {
    if (!this.selectedSubjects.includes(subject)) {
      this.selectedSubjects.push(subject);
    }
    this.showDropdown['announcementSubjects'] = false;
  }

  removeSelectedSubject(subject: Interest) {
    this.selectedSubjects = this.selectedSubjects.filter(s => s !== subject);
  }

  // Méthode pour charger les annonces du projet
  loadAnnouncements(projectId: number | undefined) {
    if (projectId) {
      const token = localStorage.getItem('token');
      if (token) {
        this.announcementService.getProjectAnnouncements(token, projectId).subscribe({
          next: (announcements: Announcement[]) => {
            this.announcements = announcements;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des annonces:', error);
          }
        });
      } else {
        console.error('Token non trouvé');
      }
    }
  }
}