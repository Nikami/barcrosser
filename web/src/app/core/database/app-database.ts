import Dexie, { Table } from 'dexie';
import { PostDTO } from '../../../../../shared/src/dto/post.dto';

export class AppDatabase extends Dexie {
  posts!: Table<PostDTO, string>; // postId is string

  constructor() {
    super('BarCrosserDatabase');
    
    this.version(1).stores({
      posts: 'postId, date', // Primary key and indexed props
    });
  }
}

export const db = new AppDatabase();
