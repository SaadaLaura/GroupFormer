export class Project {
  constructor(
    public id_project: number,
    public name: string,
    public description: string,
    public size: number
  ) {}
}

export class Announcement {
  constructor(
    public id_announcement: number,
    public id_project: number,
    public description: string,
    public publication: string
  ) {}
}

export class ProjectDetail {
  constructor(
    public projectName: string,
    public projectDescription: string,
    public missingStudents: number,
    public skills: string,
    public announcementDescription: string,
    public publicationDate: string,
    public announcementId: number,
    public specialties: string[]
  ) {}
}