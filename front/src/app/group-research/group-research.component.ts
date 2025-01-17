import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-group-research',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './group-research.component.html',
  styleUrls: ['./group-research.component.scss']
})
export class GroupResearchComponent implements OnInit {
  projects: any[] = [];
  announcements: any[] = [];
  projectDetails: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getProjects().subscribe((projects) => {
      this.projects = projects;
      this.loadAnnouncements();
    });
  }

  loadAnnouncements(): void {
    this.apiService.getAnnouncements().subscribe((announcements) => {
      this.announcements = announcements;
      this.calculateProjectDetails();
    });
  }

  calculateProjectDetails(): void {
    this.projectDetails = this.announcements.map(announcement => {
      const project = this.projects.find(p => p.id_project === announcement.id_project);
      const missingStudents = this.getMissingStudents(project);
      return {
        projectName: this.decodeUTF8(project?.name),
        projectDescription: this.decodeUTF8(project?.description),
        missingStudents: missingStudents,
        skills: '',  // Initialiser les compétences à une chaîne vide
        announcementDescription: this.decodeUTF8(announcement.description),
        publicationDate: announcement.publication  // Ajouter la date de publication
      };
    });

    // Charger les compétences pour chaque annonce
    this.projectDetails.forEach((detail, index) => {
      this.apiService.getAnnouncementSearch(this.announcements[index].id_announcement).subscribe((data) => {
        detail.skills = data.join(', ');
      });
    });
  }

  getMissingStudents(project: any): number {
    const projectSize = project.size;
    const studentCount = this.announcements.filter(a => a.id_project === project.id_project).length;
    return projectSize - studentCount;
  }

  decodeUTF8(str: string): string {
    return decodeURIComponent(escape(str));
  }
}