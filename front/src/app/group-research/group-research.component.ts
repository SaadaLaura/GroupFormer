import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AnnouncementService } from '../services/announcement.service';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, ProjectDetail } from '../class/Project';
import { Announcement } from '../class/Announcement';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-group-research',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './group-research.component.html',
  styleUrls: ['./group-research.component.scss']
})
export class GroupResearchComponent implements OnInit {
  projects: Project[] = [];
  projectDetails: ProjectDetail[] = [];
  filteredProjectDetails: ProjectDetail[] = [];
  missingStudentsRange: number[] = [];
  searchTerm: string = '';
  selectedMissingStudents: string = '';
  keywords: string = '';
  selectedAdaptedFilter: string = 'sans';
  isLoading: boolean = true;
  isDataLoaded: boolean = false;
  areFiltersApplied: boolean = false;
  userSkills: string[] = [];
  userInterests: string[] = [];

  constructor(
    private projectService: ProjectService,
    private announcementService: AnnouncementService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');
    if (token) {
      this.stateService.skills$.subscribe(skills => {
        if (skills !== null) {
          this.userSkills = skills;
          this.loadProjects(token);
        }
      });

      this.stateService.interests$.subscribe(interests => {
        if (interests !== null) {
          this.userInterests = interests;
          this.loadProjects(token);
        }
      });
    }
  }

  loadProjects(token: string): void {
    this.projectService.getProjects(token).subscribe((projects: Project[]) => {
      this.projects = projects;
      this.loadProjectDetails();
    });
  }

  loadProjectDetails(): void {
    this.projectDetails = this.projects.map(project => {
      const announcements = project.announcements;
      return announcements.map(announcement => {
        const missingStudents = project.size - project.members.length;
        return new ProjectDetail(
          project.name,
          project.description,
          missingStudents,
          announcement.skills.map(skill => skill.name).join(', '),
          announcement.description,
          this.formatDate(announcement.publication),
          announcement.id,
          announcement.subjects.map(subject => subject.name)
        );
      });
    }).flat();

    this.loadMissingStudentsRange();
    this.applyFilters();
    this.isLoading = false;
    this.isDataLoaded = true;
    this.areFiltersApplied = true;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  loadMissingStudentsRange(): void {
    const maxMissingStudents = Math.max(...this.projectDetails.map(detail => detail.missingStudents));
    this.missingStudentsRange = Array.from({ length: maxMissingStudents }, (_, i) => i + 1);
  }

  applyFilters(): void {
    this.filteredProjectDetails = this.projectDetails.filter(detail => {
      const matchesSearchTerm = detail.projectName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                detail.projectDescription.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                detail.announcementDescription.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesMissingStudents = this.selectedMissingStudents ? detail.missingStudents === +this.selectedMissingStudents : true;
      const matchesKeywords = this.keywords ? detail.projectName.toLowerCase().includes(this.keywords.toLowerCase()) ||
                                              detail.projectDescription.toLowerCase().includes(this.keywords.toLowerCase()) ||
                                              detail.announcementDescription.toLowerCase().includes(this.keywords.toLowerCase()) : true;
      const detailSkills = detail.skills.split(', ').map(skill => skill.toLowerCase());
      const matchesUserSkills = this.selectedAdaptedFilter === 'avec' ? this.userSkills.some(skill => detailSkills.includes(skill.toLowerCase())) : true;
      const detailInterests = detail.specialties.map(interest => interest.toLowerCase());
      const matchesUserInterests = this.selectedAdaptedFilter === 'avec' ? this.userInterests.some(interest => detailInterests.includes(interest.toLowerCase())) : true;
      return matchesSearchTerm && matchesMissingStudents && matchesKeywords && matchesUserSkills && matchesUserInterests;
    });
  }
}