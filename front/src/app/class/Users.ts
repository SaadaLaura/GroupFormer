export class Student {
  constructor(
    public id_user: number,
    public firstname: string,
    public lastname: string,
    public skills: string,
    public researchCenter: string,
    public major: string,
    public id_project: number | null,
    public password: string,
    public role: string
  ) {}
}

export class Interest {
  constructor(
    public id: number,
    public name: string
  ) {}
}

export class Skill {
  constructor(
    public id: number,
    public name: string
  ) {}
}