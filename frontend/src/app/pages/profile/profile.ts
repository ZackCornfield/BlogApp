import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  providers: [DatePipe],
})
export class Profile implements OnInit, OnDestroy {
  isLoading: boolean = true;
  user: { username: string; password?: string; createdAt: Date } = {
    username: '',
    password: '',
    createdAt: new Date(),
  };
  recentActivity: {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
  }[] = [];
  apiUrl = 'http://localhost:3000/api';
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.isLoading = true;
    // Fetch user profile
    this.http.get(`${this.apiUrl}/users`).subscribe({
      next: (data: any) => {
        this.user = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        this.isLoading = false;
      },
    });

    // Fetch recent activities
    this.http.get(`${this.apiUrl}/users/recent-activities`).subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.recentActivity = data;
        }
      },
      error: (error) =>
        console.error('Error fetching recent activities:', error),
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(profileForm: any) {
    if (profileForm.valid) {
      const updateData: any = {
        username: this.user.username,
      };
      if (this.user.password) {
        updateData.password = this.user.password;
      }

      this.http.put(`${this.apiUrl}/users`, updateData).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        },
      });
    }
  }
}
