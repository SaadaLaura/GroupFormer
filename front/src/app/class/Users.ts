export class Student {
  constructor(
    public id: number,
    public firstname: string,
    public lastname: string,
    public email: string,
    public project: Project | null,
    public skills: Skill[],
    public subject: Interest[],
    public major: string
  ) {}
}

export class Project {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public size: number,
    public missing: number,
    public deadline: Date | null,
    public members: Member[]
  ) {}
}

export class Member {
  constructor(
    public id: number,
    public firstname: string,
    public lastname: string,
    public email: string,
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