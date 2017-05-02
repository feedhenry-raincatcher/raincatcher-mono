import * as Promise from 'bluebird';
import { cloneDeep } from 'lodash';

const seedData = [
  {
    id: 'user1id',
    name: 'user1',
    address: 'Some Lane, Some Street, Some Country'
  }
]

let data: User[] = cloneDeep(seedData);

function list() {
  return Promise.resolve(data);
};

function add(user: User) {
  data.push(user);
  return Promise.resolve(user);
};

function reset() {
  data = cloneDeep(seedData);
  return list();
}

export = {
  list, add, reset
};