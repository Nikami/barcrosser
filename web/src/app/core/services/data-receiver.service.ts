import { Injectable } from '@angular/core';
import { db } from '../database/app-database';
import { PostDTO } from '../../../../../shared/src/dto/post.dto';

@Injectable({
  providedIn: 'root'
})
export class DataReceiverService {

  constructor() {}

  listen() {
    window.addEventListener('message', async (event: MessageEvent) => {
      // Validate origin
      const origin = event.origin;
      const isAllowedOrigin = origin === 'http://localhost:4200' || origin.includes('barcross.ru');
      
      // In dev with tampermonkey it might come from window.location.origin
      if (!isAllowedOrigin && origin !== window.location.origin) {
        return;
      }
      
      const payload = event.data;
      if (payload && payload.type === 'BARCROSSER_SYNC' && payload.payload) {
        const post: PostDTO = payload.payload;
        try {
          await db.posts.put(post);
          console.log('[DataReceiver] Saved post:', post.postId);
        } catch (error) {
          console.error('[DataReceiver] Error saving message', error);
        }
      }
    });
    
    console.log('[DataReceiver] Listening for messages...');
  }
}
