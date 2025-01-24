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
  announcements: Announcement[] = [];
  projectDetails: ProjectDetail[] = [];
  filteredProjectDetails: ProjectDetail[] = [];
  missingStudentsRange: number[] = [];
  searchTerm: string = '';
  selectedMissingStudents: string = '';
  keywords: string = '';
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
      this.loadAnnouncements();
    });
  }

  loadAnnouncements(): void {
    this.announcementService.getAnnouncements().subscribe((announcements: Announcement[]) => {
      this.announcements = announcements;
      this.calculateProjectDetails();
    });
  }

  calculateProjectDetails(): void {
    this.projectDetails = this.announcements.map(announcement => {
      const project = this.projects.find(p => p.id_project === announcement.id_project);
      const missingStudents = project ? this.getMissingStudents(project) : 0;
      return new ProjectDetail(
        this.decodeUTF8(project?.name || ''),
        this.decodeUTF8(project?.description || ''),
        missingStudents,
        '',
        this.decodeUTF8(announcement.description || ''),
        announcement.publication || '',
        announcement.id_announcement,
        []
      );
    });

    let detailsLoaded = 0;
    this.projectDetails.forEach((detail, index) => {
      this.announcementService.getAnnouncementSearch(this.announcements[index].id_announcement).subscribe((data: string[]) => {
        detail.skills = data.join(', ');
        detailsLoaded++;
        this.checkDetailsLoaded(detailsLoaded);
      });

      this.announcementService.getAnnouncementAbout(this.announcements[index].id_announcement).subscribe((data: string[]) => {
        detail.specialties = data;
        detailsLoaded++;
        this.checkDetailsLoaded(detailsLoaded);
      });
    });

    this.loadMissingStudentsRange();
  }

  checkDetailsLoaded(detailsLoaded: number): void {
    if (detailsLoaded === this.projectDetails.length * 2) {
      this.applyInitialFilter();
      this.isLoading = false;
      this.isDataLoaded = true;
      this.areFiltersApplied = true;
    }
  }

  applyInitialFilter(): void {
    this.filteredProjectDetails = this.projectDetails.filter(detail => {
      const detailSkills = detail.skills.split(', ').map(skill => skill.toLowerCase());
      const matchesSkills = this.userSkills.some(skill => detailSkills.includes(skill.toLowerCase()));
      const detailInterests = detail.specialties.map(interest => interest.toLowerCase());
      const matchesInterests = this.userInterests.some(interest => detailInterests.includes(interest.toLowerCase()));
      return matchesSkills && matchesInterests;
    });
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
                                              detail.projectDescription.toLowerCase().includes(this.keywords.toLowerCase()) : true;
      const detailSkills = detail.skills.split(', ').map(skill => skill.toLowerCase());
      const matchesUserSkills = this.userSkills.some(skill => detailSkills.includes(skill.toLowerCase()));
      const detailInterests = detail.specialties.map(interest => interest.toLowerCase());
      const matchesUserInterests = this.userInterests.some(interest => detailInterests.includes(interest.toLowerCase()));
      return matchesSearchTerm && matchesMissingStudents && matchesKeywords && matchesUserSkills && matchesUserInterests;
    });
  }

  getMissingStudents(project: Project): number {
    const projectSize = project.size;
    const studentCount = this.announcements.filter(a => a.id_project === project.id_project).length;
    return projectSize - studentCount;
  }

  decodeUTF8(str: string | undefined): string {
    return str ? decodeURIComponent(escape(str)) : '';
  }
}