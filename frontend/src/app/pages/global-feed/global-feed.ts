import { Component, OnInit } from '@angular/core';
import { PostService, Post } from '../../services/post';
import { PostComponent } from '../../components/post/post.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-feed',
  standalone: true,
  imports: [CommonModule, PostComponent],
  templateUrl: './global-feed.html',
  styleUrls: ['./global-feed.css'],
})
export class GlobalFeed implements OnInit {
  posts: Post[] = [];
  isLoading: boolean = true;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts(page: number = 1) {
    this.isLoading = true;
    this.postService.getAllPosts(page, 10).subscribe({
      next: (data) => {
        this.posts = data.posts;
        this.currentPage = data.currentPage;
        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.isLoading = false;
      },
    });
  }

  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadPosts(this.currentPage + 1);
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.loadPosts(this.currentPage - 1);
    }
  }

  likePost(postId: number) {
    console.log('Liking post with ID: ', postId); // Debug log
    this.postService.likePost(postId).subscribe({
      next: () => {
        const post = this.posts.find((p) => p.id === postId);
        if (post) {
          post.likes = (post.likes || 0) + 1;
          post.liked = true; // Update the liked property to true
        }
      },
      error: (err: any) => {
        console.error('Error liking post: ', err);
      },
    });
  }

  unlikePost(postId: number) {
    this.postService.unlikePost(postId).subscribe({
      next: () => {
        const post = this.posts.find((p) => p.id === postId);
        console.log(
          `Post likes before unliking: ${post?.likes}, liked status: ${post?.liked}`
        ); // Debug log
        if (post && post.likes && post.likes > 0) {
          post.likes -= 1;
          post.liked = false; // Update the liked property to false
          console.log('Liked status after unliking: ', post.liked); // Debug log
        }
      },
      error: (err: any) => {
        console.error('Error unliking post: ', err);
      },
    });
  }
}
