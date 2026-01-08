import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, map, catchError, throwError } from 'rxjs'
import { Product, ProductCreate, ProductUpdate } from '../models/product.model'
import { environment } from '../../environments/environment'

export interface ProductQuery {
  search?: string
  category?: string
  sortBy?: 'name' | 'price' | 'createdAt'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface ProductsResponse {
  items: Product[]
  totalCount: number
}

export interface ApiError {
  message: string
  status?: number
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`

  constructor(private http: HttpClient) {}

  private buildParams(query: ProductQuery): HttpParams {
    const page = Math.max(1, query.page ?? 1)
    const limit = Math.max(1, query.limit ?? 10)

    let params = new HttpParams()
      .set('_start', ((page - 1) * limit).toString())
      .set('_end', (page * limit).toString())

    if (query.search?.trim()) {
      params = params.set('q', query.search.trim())
    }

    if (query.category) {
      params = params.set('category', query.category)
    }

    if (query.sortBy) {
      params = params.set('_sort', query.sortBy)
      params = params.set('_order', query.order ?? 'asc')
    }

    return params
  }

  getProducts(query: ProductQuery): Observable<ProductsResponse> {
    const params = this.buildParams(query)
    return this.http
      .get<Product[]>(this.apiUrl, {
        params,
        observe: 'response',
      })
      .pipe(
        map((response) => ({
          items: response.body ?? [],
          totalCount: Number(response.headers.get('X-Total-Count') ?? 0),
        })),
        catchError((err) => this.mapHttpError(err))
      )
  }

  getProduct(id: number): Observable<Product> {
    return this.http
      .get<Product>(`${this.apiUrl}/${id}`)
      .pipe(catchError((err) => this.mapHttpError(err)))
  }

  createProduct(product: ProductCreate): Observable<Product> {
    return this.http
      .post<Product>(this.apiUrl, product)
      .pipe(catchError((err) => this.mapHttpError(err)))
  }

  updateProduct(product: ProductUpdate): Observable<Product> {
    return this.http
      .put<Product>(`${this.apiUrl}/${product.id}`, product)
      .pipe(catchError((err) => this.mapHttpError(err)))
  }

  private mapHttpError(error: unknown): Observable<never> {
    if (error instanceof HttpErrorResponse) {
      return throwError(
        () =>
          ({
            message:
              error.status === 0
                ? 'Unable to reach server'
                : error.error?.message || 'Request failed',
            status: error.status,
          } satisfies ApiError)
      )
    }

    return throwError(
      () =>
        ({
          message: 'Unexpected error occurred',
        } satisfies ApiError)
    )
  }
}
