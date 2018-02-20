import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { DocumentReference, CollectionReference } from '@firebase/firestore-types';
import { Observable } from 'rxjs/observable';
import { Todo, TodoId } from './todo.model';

@Injectable()
export class TodoListService {
  private todoListsRef: AngularFirestoreCollection<any>;
  private currentList: AngularFirestoreCollection<Todo>;

  constructor(private db: AngularFirestore) {
    this.todoListsRef = db.collection('todo-lists');
  }

  public fetch(id: string): Observable<TodoId[]> {
    if (!id) {
      throw Error('Todo list ID should be provided!');
    }

    this.currentList = this.todoListsRef.doc(id).collection<Todo>('todos', ref => ref.orderBy('created', 'desc'));

    return this.currentList.snapshotChanges().map(actions => {
      return actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as Todo;
        return { id, ...data };
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

  public update(todo: TodoId) {
    if (!this.currentList) {
      throw Error('Сurrent list reference is not installed');
    }

    const id = todo.id;
    delete todo.id;

    this.currentList.doc(id).update({ ...todo });
  }

  public remove(todo: TodoId) {
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
