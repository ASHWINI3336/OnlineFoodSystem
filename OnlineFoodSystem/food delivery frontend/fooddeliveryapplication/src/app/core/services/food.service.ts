import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/models';

@Injectable({ providedIn: 'root' })
export class FoodService {
  private readonly API = 'http://localhost:8080';

  readonly categories: Category[] = [
    { name: 'Sandwich', value: 0, icon: '🥪' },
    { name: 'Veg', value: 1, icon: '🥗' },
    { name: 'Non-Veg', value: 2, icon: '🍗' },
    { name: 'Desserts', value: 3, icon: '🍰' },
    { name: 'Chinese', value: 4, icon: '🥡' },
    { name: 'Pizza', value: 5, icon: '🍕' },
    { name: 'Burger', value: 6, icon: '🍔' },
    { name: 'Momos', value: 7, icon: '🥟' },
  ];

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.API}/api/products`);
  }

  getProductsPaged(offset: number, limit: number): Observable<any> {
    return this.http.get(`${this.API}/api/products/${offset}/${limit}`);
  }

  getProductsByCategory(catId: number, offset: number, limit: number): Observable<any> {
    return this.http.get(`${this.API}/api/products/${catId}/${offset}/${limit}`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.API}/api/products/products/${id}`);
  }

  addProduct(body: any): Observable<any> {
    return this.http.post(`${this.API}/api/products/add products`, body);
  }

  updateProduct(id: number, body: any): Observable<any> {
    return this.http.put(`${this.API}/api/products/${id}`, body);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.API}/api/products/${id}`);
  }
}
