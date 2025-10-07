import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Post, PostService } from '../../services/post';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  isLoading: boolean = true;
  posts: Post[] = [];
  newPost: Partial<Post> = { title: '', content: '' };
  isAddPostModalOpen: boolean = false;
  isEditPostModalOpen: boolean = false;
  editingPost: Partial<Post> = {};

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading posts: ', err);
      },
    });
  }

  addPost(form: NgForm) {
    if (form.valid) {
      this.postService.addPost(this.newPost).subscribe({
        next: (post) => {
          this.posts.push(post);
          form.reset();
        },
        error: (err) => {
          console.error('Error adding post: ', err);
        },
      });
    }
  }

  deletePost(postId: number) {
    if (confirm('Are you sure you want to delete this post')) {
      this.postService.deletePost(postId).subscribe({
        next: () => {
          this.posts = this.posts.filter((p: any) => p.id !== postId);
        },
        error: (err) => {
          console.error('Error deleting post: ', err);
        },
      });
    }
  }

  openAddPostModal() {
    this.isAddPostModalOpen = true;
  }

  closeAddPostModal() {
    this.isAddPostModalOpen = false;
  }

  openEditPostModal(post: Post) {
    this.editingPost = { ...post };
    this.isEditPostModalOpen = true;
  }

  closeEditPostModal() {
    this.isEditPostModalOpen = false;
  }

  updatePost(form: NgForm) {
    if (form.valid && this.editingPost.id) {
      const updateData = { content: this.editingPost.content || '' };
      this.postService.updatePost(this.editingPost.id, updateData).subscribe({
        next: () => {
          const index = this.posts.findIndex(
            (p) => p.id === this.editingPost.id
          );
          if (index !== -1) {
            this.posts[index] = {
              ...this.editingPost,
              content: updateData.content,
            } as Post;
          }
          this.closeEditPostModal();
        },
        error: (err) => {
          console.error('Error updating post: ', err);
        },
      });
    }
  }
}
