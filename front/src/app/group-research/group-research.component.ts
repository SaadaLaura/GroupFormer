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
    this.stateService.skills$.subscribe(skills => {
      if (skills !== null) {
        this.userSkills = skills;
        this.loadProjects();
      }
    });

    this.stateService.interests$.subscribe(interests => {
      if (interests !== null) {
        this.userInterests = interests;
        this.loadProjects();
      }
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe((projects: Project[]) => {
      this.projects = projects;
      this.loadProjectDetails();
    });
  }

  loadProjectDetails(): void {
    let detailsLoaded = 0;
    const totalDetailsToLoad = this.projects.length * 2; // Each project has two details to load (skills and specialties)
  
    this.projects.forEach(project => {
      this.projectService.getProjectAnnouncements(project.id).subscribe((announcements: Announcement[]) => {
        announcements.forEach(announcement => {
          const missingStudents = this.getMissingStudents(project, announcements);
          const existingDetail = this.projectDetails.find(detail => detail.announcementId === announcement.id);
  
          if (!existingDetail) {
            const projectDetail = new ProjectDetail(
              project.name,
              project.description,
              missingStudents,
              '',
              announcement.description,
              announcement.publication,
              announcement.id,
              []
            );
  
            this.projectDetails.push(projectDetail);
  
            this.announcementService.getAnnouncementSearch(announcement.id).subscribe((data: { id: number, name: string }[]) => {
              projectDetail.skills = data.map(skill => skill.name).join(', ');
              detailsLoaded++;
              this.checkDetailsLoaded(detailsLoaded, totalDetailsToLoad);
            });
  
            this.announcementService.getAnnouncementAbout(announcement.id).subscribe((data: { id: number, name: string }[]) => {
              projectDetail.specialties = data.map(subject => subject.name);
              detailsLoaded++;
              this.checkDetailsLoaded(detailsLoaded, totalDetailsToLoad);
            });
          }
        });
      });
    });
  
    this.loadMissingStudentsRange();
  }
  
  checkDetailsLoaded(detailsLoaded: number, totalDetailsToLoad: number): void {
    if (detailsLoaded === totalDetailsToLoad) {
      this.applyFilters(); // Appliquer les filtres par défaut
      this.isLoading = false;
      this.isDataLoaded = true;
      this.areFiltersApplied = true;
    }
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

  getMissingStudents(project: Project, announcements: Announcement[]): number {
    const projectSize = project.size;
    const studentCount = announcements.length;
    return projectSize - studentCount;
  }
}