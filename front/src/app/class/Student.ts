export class Student {
  constructor(
    public id_user: number,
    public firstName: string,
    public lastName: string,
    public skills: string,
    public researchCenter: string,
    public major: string,
    public id_project: number | null
  ){}
}