import { Interest, Skill } from "./Users";

export class Announcement {
  constructor(
    public id: number,
    public description: string,
    public publication: string,
    public title: string,
    public skills:Skill[],
    public subjects: Interest[]
  ) {}
}