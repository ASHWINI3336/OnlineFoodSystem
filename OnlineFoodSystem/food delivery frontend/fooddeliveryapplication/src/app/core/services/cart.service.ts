import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly API = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  addToCart(body: any, productId: number, customerId: number): Observable<any> {
    return this.http.post(`${this.API}/api/cart/${customerId}/${productId}`, body);
  }

  getCartList(): Observable<any> {
    return this.http.get(`${this.API}/api/cart/list`);
  }

  deleteCartItem(cartId: number): Observable<any> {
    return this.http.delete(`${this.API}/api/cart/${cartId}`);
  }

  updateCart(cartId: number, body: any): Observable<any> {
    return this.http.put(`${this.API}/api/cart/${cartId}`, body);
  }
}
