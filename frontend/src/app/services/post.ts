import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Post {
  title: string;
  content: string;
  createdAt?: Date;
  id?: number;
  likes?: number;
  authorId?: number;
  liked?: boolean; // Added liked property to track if the post is liked by the user
}

export interface PostResponse {
  posts: Post[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  getPosts(page: number, limit: number) {
    return this.http.get<PostResponse>(
      `${this.apiUrl}?page=${page}&limit=${limit}`,
      {}
    );
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

  likePost(postId: number) {
    return this.http.post(`${this.apiUrl}/${postId}/like`, {});
  }

  unlikePost(postId: number) {
    return this.http.post(`${this.apiUrl}/${postId}/unlike`, {});
  }
}
