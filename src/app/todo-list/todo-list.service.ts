import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { DocumentReference, CollectionReference } from '@firebase/firestore-types';
import { Observable } from 'rxjs/observable';
import { Todo, TodoMetadata } from './todo.model';

@Injectable()
export class TodoListService {
  private todoListsRef: AngularFirestoreCollection<any>;
  private currentList: AngularFirestoreCollection<Todo>;

  constructor(private db: AngularFirestore) {
    this.todoListsRef = db.collection('todo-lists');
  }

  public fetch(id: string): Observable<TodoMetadata[]> {
    if (!id) {
      throw Error('Todo list ID should be provided!');
    }

    this.currentList = this.todoListsRef.doc(id).collection<Todo>('todos', ref => ref.orderBy('created'));

    return this.currentList.stateChanges().map(actions => {
      return actions.map(a => {
        const type = a.type;
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as Todo;
        return { id, type, data };
      })
    })
  }

  public add(todo: Todo) {
    if (!this.currentList) {
      throw Error('Сurrent list reference is not installed');
    }

    // The data you're passing to the store must be an Object, not a class instance.
    // To order documents by creation date we must to store a timestamp
    this.currentList.add({ ...todo, created: firebase.firestore.FieldValue.serverTimestamp() });
  }

  public update(todo: TodoMetadata) {
    if (!this.currentList) {
      throw Error('Сurrent list reference is not installed');
    }

    this.currentList.doc(todo.id).update(todo.data);
  }

  public remove(todo: TodoMetadata) {
    if (!this.currentList) {
      throw Error('Сurrent list reference is not installed');
    }

    this.currentList.doc(todo.id).delete();
  }

  public createTodoList(): Promise<string> {
    const ref = this.todoListsRef.add({
      created: firebase.firestore.FieldValue.serverTimestamp()
    });

    return ref.then((data: DocumentReference) => {
        return data.id;
    });
  }
}
