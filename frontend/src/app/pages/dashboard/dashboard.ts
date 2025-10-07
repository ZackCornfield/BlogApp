import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Post, PostService } from '../../services/post';
import { PostComponent } from '../../components/post/post.component';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, CommonModule, PostComponent],
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
    this.postService.getPosts(1, 10).subscribe({
      next: (data) => {
        this.posts = data.posts; // Extract the posts array from the response
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

  editPost(updatedPost: Post) {
    this.postService.updatePost(updatedPost.id, updatedPost).subscribe({
      next: () => {
        const index = this.posts.findIndex((p) => p.id === updatedPost.id);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
        this.closeEditPostModal();
      },
      error: (err) => {
        console.error('Error editing post: ', err);
      },
    });
  }

  likePost(postId: number) {
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
