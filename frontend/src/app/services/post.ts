import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Post {
  title: string;
  content: string;
  createdAt?: Date;
  id?: number;
  likes?: number;
  commentsCount?: number;
  authorId?: number;
  liked?: boolean; // Added liked property to track if the post is liked by the user
}

export interface PostResponse {
  posts: Post[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
}

export interface Comment {
  id: number;
  content: string;
  user: { id: number; username: string };
  createdAt: Date;
}

export interface CommentResponse {
  comments: Comment[];
  totalComments: number;
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

  getPost(id: number) {
    return this.http.get<Post>(`${this.apiUrl}/${id}`, {});
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

  getComments(postId: number, page: number, limit: number) {
    return this.http.get<CommentResponse>(
      `${this.apiUrl}/${postId}/comments?page=${page}&limit=${limit}`
    );
  }

  addComment(postId: number, content: string) {
    return this.http.post<Comment>(`${this.apiUrl}/${postId}/comment`, {
      content,
    });
  }

  deleteComment(postId: number, commentId: number) {
    return this.http.delete(`${this.apiUrl}/${postId}/comment/${commentId}`);
  }
}
