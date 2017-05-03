import Store from 'nano-store/types/Store';
import User from 'nano-store/types/User';
import * as redis from 'redis';
import * as Promise from 'bluebird';

function uid() {
  return require('crypto').randomBytes(16).toString('hex');
}

class RedisStore implements Store {
  private readonly seedData: User[];
  private client: redis.RedisClient;
  constructor(seedData?: User[]){
    this.client = redis.createClient();
    if (seedData) {
      seedData.forEach(this.add.bind(this));
    }
  }
  list() {
    const smembers = Promise.promisify<[number], string>(this.client.smembers);
    const hgetall = Promise.promisify<Object, string>(this.client.hgetall);
    return smembers('user:ids')
      .map(id => hgetall('user:' + id));
  }
  add(user: User) {
    user.id = user.id || uid();
    return new Promise((resolve, reject) => this.client.multi()
      .hset('user:' + user.id, 'name', user.name)
      .hset('user:' + user.id, 'address', user.address)
      .sadd('user:ids', user.id)
      .exec(err => {
        if(err) {
          return reject(err);
        }
        return resolve(user)
      }))
  }
  reset() {
    return this.list();
  }
}

export default RedisStore;
