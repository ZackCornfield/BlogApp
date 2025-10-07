import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Post {
  title: string;
  content: string;
  createdAt?: Date;
  id?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get<Post[]>(`${this.apiUrl}`, {});
  }

  addPost(post: Partial<Post>) {
    return this.http.post<Post>(`${this.apiUrl}`, post);
  }

  updatePost(id: any, post: { content: string }) {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post);
  }

  deletePost(id: any) {
    return this.http.delete(`${this.apiUrl}/${id}`, {});
  }
}
