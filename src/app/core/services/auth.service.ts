import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  phone: string;
  otp: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'dairy_token';
  private readonly USER_KEY = 'dairy_user';

  private isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // ================= LOGIN =================

  login(req: LoginRequest): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/Auth/login`, req)
      .pipe(
        tap(res => {

          if (!res.success || !res.token) {
            throw new Error('Invalid credentials');
          }

          localStorage.setItem(this.TOKEN_KEY, res.token);

          localStorage.setItem(
            this.USER_KEY,
            JSON.stringify({
              username: req.username
            })
          );

          this.isLoggedIn$.next(true);

        })
      );

  }

  // ================= REGISTER =================

  register(userData: any): Observable<ApiResponse> {

    return this.http.post<ApiResponse>(
      `${environment.apiUrl}/Auth/register`,
      userData
    );

  }

  // ================= SEND OTP =================

  sendOtp(phoneNumber: string): Observable<ApiResponse> {

    return this.http.post<ApiResponse>(
      `${environment.apiUrl}/Auth/send-otp`,
      {
        phoneNumber: phoneNumber
      }
    );

  }

  // ================= RESET PASSWORD =================

  resetPassword(data: ResetPasswordRequest): Observable<ApiResponse> {

    return this.http.post<ApiResponse>(
      `${environment.apiUrl}/Auth/reset-password`,
      data
    );

  }

  // ================= LOGOUT =================

  logout(): void {

    localStorage.removeItem(this.TOKEN_KEY);

    localStorage.removeItem(this.USER_KEY);

    this.isLoggedIn$.next(false);

    this.router.navigate(['/login']);

  }

  // ================= TOKEN =================

  getToken(): string | null {

    return localStorage.getItem(this.TOKEN_KEY);

  }

  isAuthenticated(): boolean {

    return this.hasToken();

  }

  isAuthenticated$(): Observable<boolean> {

    return this.isLoggedIn$.asObservable();

  }

  getUser(): { username: string } | null {

    const user = localStorage.getItem(this.USER_KEY);

    return user ? JSON.parse(user) : null;

  }

  private hasToken(): boolean {

    return !!localStorage.getItem(this.TOKEN_KEY);

  }

}