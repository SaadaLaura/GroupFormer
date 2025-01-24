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
  password: string = '';
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
        this.studentService.getStudentById(userId).subscribe(student => {
          this.password = student.password;
          this.stateService.setPassword(student.password);
        });

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

    this.stateService.password$.subscribe(password => {
      if (password !== null) {
        this.password = password;
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
      this.stateService.setInterests(this.interests); // Enregistrer les centres d'intérêt dans le localStorage
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
      this.stateService.setSkills(this.skills); // Enregistrer les compétences dans le localStorage
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
    this.stateService.setInterests(this.interests); // Enregistrer les centres d'intérêt mis à jour dans le localStorage
  }

  removeSkill(skill: string) {
    this.skills = this.skills.filter(s => s !== skill);
    this.stateService.setSkills(this.skills); // Enregistrer les compétences mises à jour dans le localStorage
  }
}