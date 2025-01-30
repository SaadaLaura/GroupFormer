import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { StateService } from '../services/state.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  interests: string[] = [];
  skills: string[] = [];
  major: string = '';
  newInterest: string = '';
  newSkill: string = '';
  newMajor: string = '';
  hasGroup: string = ''; // Valeur par défaut
  hasProjectTopic: string = '';
  editMode: { [key: string]: boolean } = {
    interests: false,
    skills: false,
    major: false
  };
  showDropdown: { [key: string]: boolean } = {
    interests: false,
    skills: false
  };
  availableSkills: string[] = ['frontend', 'backend', 'VR'];
  availableInterests: string[] = ['IT', 'Data', 'IA'];

  constructor(
    private route: ActivatedRoute,
    private stateService: StateService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.stateService.hasGroup$.subscribe(hasGroup => {
      if (hasGroup !== null) {
        this.hasGroup = hasGroup;
      }
    });

    this.route.params.subscribe(params => {
      const userId = +params['id'];
      if (userId) {
        this.studentService.getStudentSkills(userId).subscribe(skills => {
          this.skills = skills;
          this.stateService.setSkills(skills);
        });

        this.studentService.getStudentInterests(userId).subscribe(interests => {
          this.interests = interests;
          this.stateService.setInterests(interests);
        });
      }
    });

    this.stateService.skills$.subscribe(skills => {
      if (skills !== null) {
        this.skills = skills;
      }
    });

    this.stateService.interests$.subscribe(interests => {
      if (interests !== null) {
        this.interests = interests;
      }
    });

    // Charger les compétences et centres d'intérêt depuis le localStorage
    const storedSkills = this.stateService.getSkillsFromLocalStorage();
    if (storedSkills) {
      this.skills = storedSkills;
    }

    const storedInterests = this.stateService.getInterestsFromLocalStorage();
    if (storedInterests) {
      this.interests = storedInterests;
    }
  }

  toggleDropdown(field: string) {
    this.showDropdown[field] = !this.showDropdown[field];
  }

  addInterest(interest: string) {
    if (interest && !this.interests.includes(interest)) {
      this.interests.push(interest);
      this.stateService.setInterests(this.interests); // Enregistrer les centres d'intérêt dans le localStorage
    }
    this.showDropdown['interests'] = false;
  }

  addSkill(skill: string) {
    if (skill && !this.skills.includes(skill)) {
      this.skills.push(skill);
      this.stateService.setSkills(this.skills); // Enregistrer les compétences dans le localStorage
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

  onGroupChange() {
    if (this.hasGroup === 'non') {
      this.hasProjectTopic = '';
    }
    this.stateService.setHasGroup(this.hasGroup);
  }

  removeInterest(interest: string) {
    this.interests = this.interests.filter(i => i !== interest);
    this.stateService.setInterests(this.interests); // Enregistrer les centres d'intérêt mis à jour dans le localStorage
  }

  removeSkill(skill: string) {
    this.skills = this.skills.filter(s => s !== skill);
    this.stateService.setSkills(this.skills); // Enregistrer les compétences mises à jour dans le localStorage
  }
}