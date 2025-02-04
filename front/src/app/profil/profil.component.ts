import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { StateService } from '../services/state.service';
import { UsersService } from '../services/users.service';
import { AbilitiesService } from '../services/abilities.service';
import { Interest, Student, Skill } from '../class/Users';
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
  newMajor: string = '';
  hasProject: boolean = false;
  projectName: string = '';
  missingMembers: number = 0;
  editMode: { [key: string]: boolean } = {
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
          this.skills = response.skills.map((skill, index) => new Skill(index + 1, skill.name)); // Initialiser les IDs à partir de 1
          this.interests = response.subject.map((subject, index) => new Interest(index + 1, subject.name)); // Initialiser les IDs à partir de 1
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

    //enregistre les compétences dans le local storage
    this.stateService.skills$.subscribe({
      next: (skills: string[] | null) => {
        if (skills !== null) {
          this.skills = skills.map((name, index) => new Skill(index + 1, name)); // Initialiser les IDs à partir de 1
        }
      }
    });
    //enregistre les centres d'intérets dans le local storage
    this.stateService.interests$.subscribe({
      next: (interests: string[] | null) => {
        if (interests !== null) {
          this.interests = interests.map((name, index) => new Interest(index + 1, name)); // Initialiser les IDs à partir de 1
        }
      }
    });

    // Charger les compétences et centres d'intérêt depuis le localStorage
    const storedSkills = this.stateService.getSkillsFromLocalStorage();
    if (storedSkills) {
      this.skills = storedSkills.map((name, index) => new Skill(index + 1, name)); // Initialiser les IDs à partir de 1
    }

    const storedInterests = this.stateService.getInterestsFromLocalStorage();
    if (storedInterests) {
      this.interests = storedInterests.map((name, index) => new Interest(index + 1, name)); // Initialiser les IDs à partir de 1
    }

    // Charger les informations du fichier depuis le localStorage
    const storedFileName = localStorage.getItem('selectedFileName');
    if (storedFileName) {
      this.selectedFile = new File([], storedFileName);
    }
  }

  // Basculer l'affichage du menu déroulant pour le champ spécifié
  toggleDropdown(field: string) {
    this.showDropdown[field] = !this.showDropdown[field];
  }

  addInterest(interest: Interest) {
    const token = localStorage.getItem('token');
    if (interest && !this.interests.some(i => i.id === interest.id) && token) {
      this.usersService.addInterestToStudent(token, interest).subscribe({
        next: () => {
          this.interests.push(interest);
          this.stateService.setInterests(this.interests.map(i => i.name)); // Enregistrer les centres d'intérêt dans le localStorage
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du centre d\'intérêt:', error);
        }
      });
    }
    this.showDropdown['interests'] = false;
  }

  removeInterest(interest: Interest) {
    const token = localStorage.getItem('token');
    if (token) {
      this.usersService.removeInterestFromStudent(token, interest).subscribe({
        next: (response) => {
          if (response.removed_subjects && response.removed_subjects.length > 0) {
            this.interests = this.interests.filter(i => i.id !== interest.id);
            this.stateService.setInterests(this.interests.map(i => i.name)); // Enregistrer les centres d'intérêt mis à jour dans le localStorage
            if (this.interests.length === 0) {
              console.log('No interests left.'); // Journal de débogage
            }
          } else {
            console.error('Erreur lors de la suppression du centre d\'intérêt: Aucun centre d\'intérêt supprimé');
          }
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du centre d\'intérêt:', error);
        }
      });
    }
  }

  addSkill(skill: Skill) {
    const token = localStorage.getItem('token');
    if (skill && !this.skills.some(s => s.id === skill.id) && token) {
      this.usersService.addSkillToStudent(token, skill).subscribe({
        next: () => {
          this.skills.push(skill);
          this.stateService.setSkills(this.skills.map(s => s.name)); // Enregistrer les compétences dans le localStorage
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de la compétence:', error);
        }
      });
    }
    this.showDropdown['skills'] = false;
  }

  removeSkill(skill: Skill) {
    const token = localStorage.getItem('token');
    if (token) {
      this.usersService.removeSkillFromStudent(token, skill).subscribe({
        next: (response) => {
          if (response.removed_skills && response.removed_skills.length > 0) {
            this.skills = this.skills.filter(s => s.id !== skill.id);
            this.stateService.setSkills(this.skills.map(s => s.name)); // Enregistrer les compétences mises à jour dans le localStorage
            if (this.skills.length === 0) {
              console.log('No skills left.'); // Journal de débogage
            }
          } else {
            console.error('Erreur lors de la suppression de la compétence: Aucune compétence supprimée');
          }
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la compétence:', error);
        }
      });
    }
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

 // Basculer le mode édition pour le champ spécifié 
  toggleEditMode(field: string) {
    this.editMode[field] = !this.editMode[field];
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