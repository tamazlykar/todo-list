import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { DocumentReference } from '@firebase/firestore-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendTodo, FirebaseTodo, Todo } from '../model';


@Injectable()
export class FirebaseTodoBackendService {
  private todoListsRef: AngularFirestoreCollection<any>;
  private currentList: AngularFirestoreCollection<FirebaseTodo>;

  constructor(db: AngularFirestore) {
    this.todoListsRef = db.collection('todo-lists');
  }

  public fetch(listId: string): Observable<BackendTodo[]> {
    if (!listId) {
      return;
    }
    this.initializeCurrentList(listId);

    return this.currentList.stateChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as FirebaseTodo;
          return {
            id: a.payload.doc.id,
            changeType: a.type,
            title: data.title,
            isCompleted: data.isCompleted,
          };
        });
      })
    );
  }

  public create(title: string) {
    if (!this.currentList) {
      return;
    }

    // To order documents by creation date we must to store a timestamp
    const data = {
      title,
      isCompleted: false,
      created: firebase.firestore.FieldValue.serverTimestamp(),
    };
    this.currentList.add(data);
  }

  public update(todo: Todo) {
    if (!this.currentList) {
      return;
    }

    const {id, ...todoData } = todo;
    this.currentList.doc(id).update(todoData);
  }

  public delete(id: string) {
    if (!this.currentList) {
      return;
    }

    this.currentList.doc(id).delete();
  }

  public createList(): Promise<string> {
    const ref = this.todoListsRef.add({
      created: firebase.firestore.FieldValue.serverTimestamp()
    });

    return ref.then((data: DocumentReference) => {
      return data.id;
    });
  }

  private initializeCurrentList(listId: string) {
    this.currentList = this.todoListsRef.doc(listId).collection<FirebaseTodo>('todos', ref => ref.orderBy('created'));
  }
}
