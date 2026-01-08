import { Component, DestroyRef, OnInit } from '@angular/core'
import {
  ProductService,
  ProductQuery,
  ProductsResponse,
} from '../../services/product.service'
import { Product } from '../../models/product.model'
import { NgForOf, NgIf } from '@angular/common'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
})
export class ProductsListComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}
  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(700), //  wait 700ms
        distinctUntilChanged(), //  ignore same value
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((value) => {
        this.query.search = value ?? ''
        this.query.page = 1
        this.loadProducts()
      })

    this.loadProducts()
  }

  loadProducts(): void {
    this.loading = true
    this.error = null

    this.productService
      .getProducts(this.query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          ;(this.products = res.items),
            (this.totalCount = res.totalCount),
            console.log(this.products),
            (this.hasNext =
              this.query.page! * this.query.limit! < this.totalCount)
        },
        error: () => (this.error = 'Failed to load products'),
      })
  }

  searchControl = new FormControl('')
  products: Product[] = []
  totalCount: number = 0
  loading = false
  error: string | null = null

  query: ProductQuery = {
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 4,
  }
  hasNext = false

  onSortChange(sortBy: ProductQuery['sortBy']): void {
    this.query.sortBy = sortBy
    this.query.page = 1
    this.loadProducts()
  }
  nextPage(): void {
    this.query.page!++
    this.loadProducts()
  }

  prevPage(): void {
    if (this.query.page! > 1) {
      this.query.page!--
      this.loadProducts()
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / (this.query.limit ?? 1))
  }
  getImageUrl(name: string): string {
    return `https://robohash.org/${encodeURIComponent(
      name
    )}?set=set1&size=200x200`
  }

  editProduct(productId: number) {
    this.router.navigate(['/products', productId])
  }

  createProduct() {
    this.router.navigate(['/products/new'])
  }
}
