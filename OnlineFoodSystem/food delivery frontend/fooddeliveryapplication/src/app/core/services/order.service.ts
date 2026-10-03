import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  placeOrder(customerId: number, cartId: number, body: any): Observable<any> {
    return this.http.post(`${this.API}/api/orders/${customerId}/${cartId}`, body);
  }

  placeOrderItem(customerId: number, body: any): Observable<any> {
    return this.http.post(`${this.API}/api/orders/addOrder/${customerId}/`, body);
  }

  getOrdersByCustomer(customerId: number): Observable<any> {
    return this.http.get(`${this.API}/api/orders/${customerId}`);
  }

  getAllOrders(): Observable<any> {
    return this.http.get(`${this.API}/api/orders/`);
  }

  deleteOrder(orderId: number): Observable<any> {
    return this.http.delete(`${this.API}/api/orders/${orderId}`);
  }

  addPayment(body: any, orderId: number, customerId: number): Observable<any> {
    return this.http.post(`${this.API}/api/payements/${orderId}/${customerId}`, body);
  }
}
