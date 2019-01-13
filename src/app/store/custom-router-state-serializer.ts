import { RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

/**
 * The RouterStateSerializer takes the current RouterStateSnapshot
 * and returns any pertinent information needed. The snapshot contains
 * all information about the state of the router at the given point in time.
 * The entire snapshot is complex and not always needed. In this case, you only
 * need the URL and query parameters from the snapshot in the store. Other items could be
 * returned such as route parameters and static route data.
 *
 * NOTE: To use the time-travelling debugging in the Devtools with router-store,
 * you must return an object containing a url property when using the routerReducer.
 */

export interface RouterState {
  url: string;
  listId: string;
}

export class CustomRouterStateSerializer implements RouterStateSerializer<RouterState> {
  serialize(routerState: RouterStateSnapshot): RouterState {
    const firstChild = routerState.root.firstChild;
    const listId = firstChild && firstChild.paramMap.get('listId');

    return {
      listId,
      url: routerState.url,
    };
  }
}
