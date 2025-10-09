import { Component, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post, PostService, Comment } from '../../services/post';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  post = input<Post>();
  isEditable = input(false);
  like = output<number>();
  unlike = output<number>();
  edit = output<Post>();
  delete = output<number>();
  comments: Comment[] = [];
  newComment: string = '';

  constructor(private postService: PostService, private router: Router) {}

  onLike() {
    const post = this.post();
    if (post) {
      this.like.emit(post.id!);
    }
  }

  onUnlike() {
    const post = this.post();
    if (post) {
      this.unlike.emit(post.id!);
    }
  }

  onEdit() {
    const post = this.post();
    if (post) {
      this.edit.emit(post);
    }
  }

  onDelete() {
    const post = this.post();
    if (post) {
      this.delete.emit(post.id!);
    }
  }

  onNavigateToDetails() {
    const postId = this.post()?.id;
    if (postId) {
      this.router.navigate(['/post', postId]);
    }
  }
}
