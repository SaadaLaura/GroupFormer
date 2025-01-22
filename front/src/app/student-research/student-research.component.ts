import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { StudentService } from '../services/student.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../class/Student';

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
  isLoading: boolean = true;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.studentService.getStudents().subscribe((students: Student[]) => {
      this.students = students.filter(student => !student.id_project);
      this.filteredStudents = [...this.students];
      this.isLoading = false; 
    });
  }

  applyFilters(): void {
    this.filteredStudents = this.students.filter(student => {
      const matchesSearchTerm = student.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                student.firstName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesKeywords = this.keywords ? student.skills.toLowerCase().includes(this.keywords.toLowerCase()) : true;
      const matchesMajor = this.major ? student.major.toLowerCase().includes(this.major.toLowerCase()) : true;
      return matchesSearchTerm && matchesKeywords && matchesMajor;
    });
  }
}