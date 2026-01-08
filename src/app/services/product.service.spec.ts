import { TestBed } from '@angular/core/testing'
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing'
import { HttpErrorResponse } from '@angular/common/http'
import { ProductService, ProductQuery } from './product.service'
import { Product } from '../models/product.model'

describe('ProductService', () => {
  let service: ProductService
  let httpMock: HttpTestingController

  const apiUrl = 'http://localhost:3000/products'

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    })

    service = TestBed.inject(ProductService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should fetch products with correct query params and map totalCount', () => {
    const query: ProductQuery = {
      search: 'mouse',
      category: 'Accessories',
      sortBy: 'price',
      order: 'asc',
      page: 2,
      limit: 5,
    }

    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Mouse',
        description: 'Wireless mouse',
        price: 25,
        currency: 'USD',
        category: 'Accessories',
        stock: 10,
        isActive: true,
        createdAt: 1000,
        updatedAt: 1000,
      },
    ]

    service.getProducts(query).subscribe((res) => {
      expect(res.items.length).toBe(1)
      expect(res.totalCount).toBe(42)
    })

    const req = httpMock.expectOne((request) => {
      return (
        request.url === apiUrl &&
        request.params.get('_start') === '5' &&
        request.params.get('_end') === '10' &&
        request.params.get('q') === 'mouse' &&
        request.params.get('category') === 'Accessories' &&
        request.params.get('_sort') === 'price' &&
        request.params.get('_order') === 'asc'
      )
    })

    expect(req.request.method).toBe('GET')

    req.flush(mockProducts, {
      headers: { 'X-Total-Count': '42' },
    })
  })

  it('should map HttpErrorResponse to ApiError', () => {
    service.getProducts({}).subscribe({
      next: () => fail('Expected error'),
      error: (err) => {
        expect(err.message).toBe('Server error')
        expect(err.status).toBe(500)
      },
    })

    const req = httpMock.expectOne((request) => {
      return request.url === apiUrl
    })

    req.flush(
      { message: 'Server error' },
      {
        status: 500,
        statusText: 'Server Error',
      }
    )
  })

  it('should handle network errors gracefully', () => {
    service.getProducts({}).subscribe({
      next: () => fail('Expected error'),
      error: (err) => {
        expect(err.message).toBe('Unable to reach server')
        expect(err.status).toBe(0)
      },
    })

    const req = httpMock.expectOne((request) => request.url === apiUrl)

    req.error(new ProgressEvent('error'))
  })
})
