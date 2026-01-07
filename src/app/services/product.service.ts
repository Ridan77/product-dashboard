import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface ProductQuery {
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price' | 'createdAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(query: ProductQuery): Observable<Product[]> {
  let params = new HttpParams();

  // Filtering
  if (query.search) params = params.set('q', query.search);
  if (query.category) params = params.set('category', query.category);

  // Sorting
  if (query.sortBy) {
    params = params.set('_sort', query.sortBy);
    params = params.set('_order', query.order ?? 'asc');
  }

  // Pagination (OFFSET-BASED — json-server safe)
  if (query.page !== undefined && query.limit !== undefined) {
    const start = (query.page - 1) * query.limit;
    const end = start + query.limit;

    params = params.set('_start', start.toString());
    params = params.set('_end', end.toString());
  }

  return this.http.get<Product[]>(this.apiUrl, { params });
}

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }
}
