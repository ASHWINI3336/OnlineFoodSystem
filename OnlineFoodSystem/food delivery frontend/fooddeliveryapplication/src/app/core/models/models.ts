export interface Product {
  productId: number;
  productname: string;
  description: string;
  image: string;
  mrpPrice: number;
  quantity: number;
  category: string;
  measurment: string;
}

export interface Cart {
  cartId: number;
  mrpPrice: number;
  quantity: number;
  customer: any;
  product: Product;
}

export interface Order {
  orderId: number;
  mrpPrice: number;
  orderStatus: string;
  orderedDate: string;
  paymentStatus: string;
  quantity: number;
  totalPrice: number;
  productname: string;
  image: string;
}

export interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
  address: string;
}

export interface Category {
  name: string;
  value: number;
  icon: string;
}

export interface WishlistItem {
  productId: number;
  addedAt: string;
}

export interface Review {
  productId: number;
  rating: number;
  comment: string;
  customerName: string;
  date: string;
}
