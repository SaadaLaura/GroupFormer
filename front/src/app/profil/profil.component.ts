import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  password: string = 'GroupFormer';
  interests: string[] = [];
  skills: string[] = [];
  major: string = '';
  newInterest: string = '';
  newSkill: string = '';
  newMajor: string = '';
  hasGroup: string = ''; // Valeur par défaut
  hasProjectTopic: string = '';
  showPassword: boolean = false;
  editMode: { [key: string]: boolean } = {
    password: false,
    interests: false,
    skills: false,
    major: false
  };

  constructor(private stateService: StateService) {}

  ngOnInit() {
    this.stateService.hasGroup$.subscribe(hasGroup => {
      if (hasGroup !== null) {
        this.hasGroup = hasGroup;
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleEditMode(field: string) {
    if (field === 'major' && !this.editMode['major']) {
      this.newMajor = this.major; // Copier la valeur actuelle de major dans newMajor
    }
    this.editMode[field] = !this.editMode[field];
  }

  addInterest() {
    if (this.editMode['interests']) {
      const newInterests = this.newInterest.split(',').map(interest => interest.trim()).filter(interest => interest);
      this.interests.push(...newInterests);
      this.newInterest = '';
      this.toggleEditMode('interests');
    } else {
      this.toggleEditMode('interests');
    }
  }

  addSkill() {
    if (this.editMode['skills']) {
      const newSkills = this.newSkill.split(',').map(skill => skill.trim()).filter(skill => skill);
      this.skills.push(...newSkills);
      this.newSkill = '';
      this.toggleEditMode('skills');
    } else {
      this.toggleEditMode('skills');
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

  onGroupChange() {
    if (this.hasGroup === 'non') {
      this.hasProjectTopic = '';
    }
    this.stateService.setHasGroup(this.hasGroup);
  }

  removeInterest(interest: string) {
    this.interests = this.interests.filter(i => i !== interest);
  }

  removeSkill(skill: string) {
    this.skills = this.skills.filter(s => s !== skill);
  }
}