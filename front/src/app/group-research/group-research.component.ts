import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AnnouncementService } from '../services/announcement.service';
import { ProjectService } from '../services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, ProjectDetail } from '../class/Project';
import { Announcement } from '../class/Announcement';

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
  specialties: string[] = [];
  missingStudentsRange: number[] = [];
  searchTerm: string = '';
  selectedSpecialty: string = '';
  selectedMissingStudents: string = '';
  keywords: string = '';
  isLoading: boolean = true;

  constructor(private projectService: ProjectService, private announcementService: AnnouncementService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.projectService.getProjects().subscribe((projects: Project[]) => {
      this.projects = projects;
      this.loadAnnouncements();
    });
  }

  loadAnnouncements(): void {
    this.announcementService.getAnnouncements().subscribe((announcements: Announcement[]) => {
      this.announcements = announcements;
      this.calculateProjectDetails();
      this.isLoading = false; // Mettre à jour isLoading ici
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

    this.projectDetails.forEach((detail, index) => {
      this.announcementService.getAnnouncementSearch(this.announcements[index].id_announcement).subscribe((data: string[]) => {
        detail.skills = data.join(', ');
      });

      this.announcementService.getAnnouncementAbout(this.announcements[index].id_announcement).subscribe((data: string[]) => {
        detail.specialties = data;
        data.forEach((subject: string) => {
          if (!this.specialties.includes(subject)) {
            this.specialties.push(subject);
          }
        });
      });
    });

    this.filteredProjectDetails = [...this.projectDetails];
    this.loadMissingStudentsRange();
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
      const matchesSpecialty = this.selectedSpecialty ? detail.specialties.includes(this.selectedSpecialty) : true;
      const matchesMissingStudents = this.selectedMissingStudents ? detail.missingStudents === +this.selectedMissingStudents : true;
      const matchesKeywords = this.keywords ? detail.projectName.toLowerCase().includes(this.keywords.toLowerCase()) ||
                                              detail.projectDescription.toLowerCase().includes(this.keywords.toLowerCase()) : true;
      return matchesSearchTerm && matchesSpecialty && matchesMissingStudents && matchesKeywords;
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