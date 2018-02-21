export class Todo {
  title: string;
  isCompleted: boolean;
  created: any;

  constructor(title: string) {
    this.title = title;
    this.isCompleted = false;
  }
}

export interface TodoMetadata {
  id: string;
  type: ChangeType;
  data: Todo;
}

export type ChangeType = 'added' | 'removed' | 'modified';

export const ChangeType = {
  added: 'added' as ChangeType,
  removed: 'removed' as ChangeType,
  modified: 'modified' as ChangeType
};
