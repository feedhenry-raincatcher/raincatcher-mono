import * as Promise from 'bluebird';
import { cloneDeep } from 'lodash';

import User from "./User";

class NanoStore {
  /**
   * Internal storage for in-memory store implementation, can be safely ignored
   */
  private data: User[];

  /**
   * Creates a new store instance
   * @param data Optional seed data to initialize the store with
   */
  constructor(private readonly seedData?: User[]) {
    if (seedData) {
      this.data = cloneDeep(seedData);
    }
  };

  /**
   * Returns a list of all members of the store's data
   */
  list() {
    return Promise.resolve(this.data);
  };

  /**
   * Adds a new user to the store's data
   * @param user User to add
   */
  add(user: User) {
    this.data.push(user);
    return Promise.resolve(user);
  };

  /**
   * Reset's the store's data
   */
  reset() {
    this.data = cloneDeep(this.seedData);
    return this.list();
  }
}

export default NanoStore;
