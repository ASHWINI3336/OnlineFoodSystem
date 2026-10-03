import { Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CustomerLoginComponent } from './pages/auth/customer-login/customer-login.component';
import { CustomerRegisterComponent } from './pages/auth/customer-register/customer-register.component';
import { AdminLoginComponent } from './pages/auth/admin-login/admin-login.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './pages/auth/change-password/change-password.component';
import { CustomerHomeComponent } from './pages/customer/home/customer-home.component';
import { CustomerCartComponent } from './pages/customer/cart/customer-cart.component';
import { CustomerOrdersComponent } from './pages/customer/orders/customer-orders.component';
import { CustomerPaymentComponent } from './pages/customer/payment/customer-payment.component';
import { WishlistComponent } from './pages/customer/wishlist/wishlist.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminAddFoodComponent } from './pages/admin/add-food/admin-add-food.component';
import { AdminFoodListComponent } from './pages/admin/food-list/admin-food-list.component';
import { AdminOrderListComponent } from './pages/admin/order-list/admin-order-list.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'about-us', component: AboutComponent },
  { path: 'contact-us', component: ContactComponent },
  { path: 'customer-login', component: CustomerLoginComponent },
  { path: 'customer-register', component: CustomerRegisterComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  {
    path: 'customer',
    children: [
      { path: 'home', component: CustomerHomeComponent },
      { path: 'cart', component: CustomerCartComponent },
      { path: 'order', component: CustomerOrdersComponent },
      { path: 'payment/:orderId/:totalPrice', component: CustomerPaymentComponent },
      { path: 'wishlist', component: WishlistComponent },
    ]
  },
  {
    path: 'admin',
    children: [
      { path: 'home', component: AdminDashboardComponent },
      { path: 'addproduct', component: AdminAddFoodComponent },
      { path: 'listproduct', component: AdminFoodListComponent },
      { path: 'order-list', component: AdminOrderListComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
