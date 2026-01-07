import { Component, OnInit } from '@angular/core';
import { ProductService, ProductQuery } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { finalize } from 'rxjs';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [NgIf, NgForOf],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
})
export class ProductsListComponent {
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService
      .getProducts(this.query)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (products) => (this.products = products),
        error: () => (this.error = 'Failed to load products'),
      });
  }

  products: Product[] = [];
  loading = false;
  error: string | null = null;
  query: ProductQuery = {
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10,
  };
  onSearch(value: string): void {
    this.query.search = value;
    this.query.page = 1;
    this.loadProducts();
  }
  onSortChange(sortBy: ProductQuery['sortBy']): void {
    this.query.sortBy = sortBy;
    this.loadProducts();
  }
  nextPage(): void {
    this.query.page!++;
    this.loadProducts();
  }

  prevPage(): void {
    if (this.query.page! > 1) {
      this.query.page!--;
      this.loadProducts();
    }
  }
}
