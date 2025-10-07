import { Component, signal, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../services/post';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
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
}
