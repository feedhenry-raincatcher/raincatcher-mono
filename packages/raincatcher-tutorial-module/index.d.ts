import { User } from 'nano-store';
import * as core from "express-serve-static-core";
import * as events from "events";

/**
 * Events emmited by the router as stuff happens
 */
export interface RouterEvents extends events.EventEmitter{
  /**
   * List endpoint has been hit
   * @param listOfUsers The list of users
   */
  on(event: 'list', handler: (listOfUsers: [User]) => any)
  
  /**
   * Create endpoint has been hit
   * @param createdUser The created user
   */
  on(event: 'create', handler: (createdUser: User) => any)
}

export interface Router extends core.Router {
  events: RouterEvents
}
export function setUpEventRouter(): Router;