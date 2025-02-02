import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { UsersService } from '../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../class/Users';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-student-research',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './student-research.component.html',
  styleUrls: ['./student-research.component.scss']
})
export class StudentResearchComponent implements OnInit {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchTerm: string = '';
  keywords: string = '';
  major: string = '';
  selectedAdaptedFilter: string = 'sans';
  isLoading: boolean = true;
  userSkills: string[] = [];
  userInterests: string[] = [];

  constructor(private usersService: UsersService, private stateService: StateService) {}

  ngOnInit(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    if (token) {
      this.stateService.skills$.subscribe(skills => {
        if (skills !== null) {
          this.userSkills = skills;
          this.loadStudents(token);
        }
      });

      this.stateService.interests$.subscribe(interests => {
        if (interests !== null) {
          this.userInterests = interests;
          this.loadStudents(token);
        }
      });
    }
  }

  loadStudents(token: string): void {
    this.usersService.getStudentsWithoutProject(token).subscribe((students: Student[]) => {
      this.students = students;
      this.applyFilters();
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    this.filteredStudents = this.students.filter(student => {
      const matchesSearchTerm = student.lastname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                student.firstname.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesKeywords = this.keywords ? student.skills.some(skill => skill.name.toLowerCase().includes(this.keywords.toLowerCase())) : true;
      
      const matchesMajor = this.major ? student.major.toLowerCase().includes(this.major.toLowerCase()) : true;

      const studentSkills = student.skills.map(skill => skill.name.toLowerCase());
      const matchesUserSkills = this.selectedAdaptedFilter === 'avec' ? this.userSkills.some(skill => studentSkills.includes(skill.toLowerCase())) : true;

      const studentInterests = student.subject.map(interest => interest.name.toLowerCase());
      const matchesUserInterests = this.selectedAdaptedFilter === 'avec' ? this.userInterests.some(interest => studentInterests.includes(interest.toLowerCase())) : true;
      
      return matchesSearchTerm && matchesKeywords && matchesMajor && matchesUserSkills && matchesUserInterests;
    });
  }

  getSkills(student: Student): string {
    return student.skills.map(skill => skill.name).join(', ');
  }

  getSubjects(student: Student): string {
    return student.subject.map(subject => subject.name).join(', ');
  }
}