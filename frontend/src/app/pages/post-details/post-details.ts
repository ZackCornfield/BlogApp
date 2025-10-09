import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService, Post, Comment } from '../../services/post';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-details.html',
  styleUrls: ['./post-details.css'],
})
export class PostDetails implements OnInit {
  post: Post | null = null;
  comments: Comment[] = [];
  newComment: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private location: Location // Inject Location service
  ) {}

  ngOnInit() {
    const postId = this.route.snapshot.params['id'];
    this.loadPost(postId);
    this.loadComments(postId);
  }

  loadPost(postId: number) {
    this.postService.getPost(postId).subscribe({
      next: (data) => {
        this.post = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading post:', err);
      },
    });
  }

  loadComments(postId: number) {
    this.postService.getComments(postId, 1, 10).subscribe({
      next: (data) => {
        this.comments = data.comments;
      },
      error: (err) => {
        console.error('Error loading comments:', err);
      },
    });
  }

  onAddComment() {
    if (this.post && this.post.id !== undefined && this.newComment.trim()) {
      this.postService.addComment(this.post.id, this.newComment).subscribe({
        next: (comment) => {
          this.comments.unshift(comment); // Add the new comment to the top
          this.newComment = ''; // Clear the input
        },
        error: (err) => {
          console.error('Error adding comment:', err);
        },
      });
    }
  }

  onLike() {
    if (this.post && this.post.id !== undefined) {
      this.postService.likePost(this.post.id).subscribe({
        next: () => {
          if (this.post) {
            this.post.liked = true;
            this.post.likes = (this.post.likes || 0) + 1; // Increment like count
          }
        },
        error: (err) => {
          console.error('Error liking post:', err);
        },
      });
    }
  }

  onUnlike() {
    if (this.post && this.post.id !== undefined) {
      this.postService.unlikePost(this.post.id).subscribe({
        next: () => {
          if (this.post) {
            this.post.liked = false;
            this.post.likes = Math.max((this.post.likes || 1) - 1, 0); // Decrement like count
          }
        },
        error: (err) => {
          console.error('Error unliking post:', err);
        },
      });
    }
  }

  onBack() {
    this.location.back(); // Navigate back to the previous page
  }
}
