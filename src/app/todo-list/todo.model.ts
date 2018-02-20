export class Todo {
  title: string;
  isCompleted: boolean;
  created: any;

  constructor(title: string) {
    this.title = title;
    this.isCompleted = false;
  }
}

export interface TodoId extends Todo {
  id: string;
}
