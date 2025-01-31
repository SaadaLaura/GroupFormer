export class Project {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public size: number,
    public deadline: string
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