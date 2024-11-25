export class Exam {
  id: string;
  title: string;
  description: string;
  isObjective: boolean;
  passingScore: number;
  isActive: boolean;
  duration: number;
  enrollmentCount: number;

  constructor(
    id: string,
    title: string,
    description: string,
    isObjective: boolean,
    passingScore: number,
    isActive: boolean,
    duration: number,
    enrollmentCount: number
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isObjective = isObjective;
    this.passingScore = passingScore;
    this.isActive = isActive;
    this.duration = duration;
    this.enrollmentCount = enrollmentCount;
  }
}
