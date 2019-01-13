import { NgModule, Optional, SkipSelf } from '@angular/core';
import { DialogService, FirebaseTodoBackendService, TodoService } from './services';

@NgModule({
  imports: [],
  exports: [],
  providers: [
    DialogService,
    FirebaseTodoBackendService,
    TodoService,
  ],
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`Core module has already been loaded. Import Core modules in the AppModule only.`);
    }
  }
}
