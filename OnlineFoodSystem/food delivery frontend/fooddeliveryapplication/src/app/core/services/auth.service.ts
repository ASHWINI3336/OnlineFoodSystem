import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Customer } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8080';

  customerToken = signal<string | null>(localStorage.getItem('token'));
  customerName = signal<string | null>(localStorage.getItem('userName'));
  adminToken = signal<string | null>(localStorage.getItem('admin'));
  adminName = signal<string | null>(localStorage.getItem('adminName'));

  isCustomerLoggedIn = computed(() => !!this.customerToken());
  isAdminLoggedIn = computed(() => !!this.adminToken());

  constructor(private http: HttpClient, private router: Router) {}

  // --- Customer Auth ---
  customerSignUp(body: any): Observable<any> {
    return this.http.post(`${this.API}/api/customers/register`, body);
  }

  customerLogin(body: any): Observable<any> {
    return this.http.post(`${this.API}/api/customers/login`, body);
  }

  setCustomerSession(customer: any): void {
    const id = customer.customerId?.toString() || '';
    const name = customer.firstName || '';
    localStorage.setItem('token', id);
    localStorage.setItem('userName', name);
    this.customerToken.set(id);
    this.customerName.set(name);
  }

  customerLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.customerToken.set(null);
    this.customerName.set(null);
    this.router.navigate(['/']);
  }

  getCustomerById(id: any): Observable<any> {
    return this.http.get(`${this.API}/api/customers/customer/${id}`);
  }

  updateCustomer(body: any): Observable<any> {
    return this.http.put(`${this.API}/api/customers/customer/${body?.customerId}`, body);
  }

  forgotPassword(body: any): Observable<any> {
    return this.http.post(`${this.API}/api/customers/forgotpassword`, body);
  }

  changePassword(cid: any, password: any): Observable<any> {
    return this.http.post(`${this.API}/api/customers/${cid}/${password}`, {});
  }

  // --- Admin Auth ---
  adminLogin(body: any): Observable<any> {
    return this.http.post(`${this.API}/api/admin/login`, body);
  }

  setAdminSession(admin: any): void {
    const id = admin.adminId?.toString() || '';
    const name = admin.adminName || 'Admin';
    localStorage.setItem('admin', id);
    localStorage.setItem('adminName', name);
    this.adminToken.set(id);
    this.adminName.set(name);
  }

  adminLogout(): void {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminName');
    this.adminToken.set(null);
    this.adminName.set(null);
    this.router.navigate(['/']);
  }
}
