import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { NgIf } from '@angular/common'
import { ProductService } from '../../services/product.service'
import { finalize } from 'rxjs'
import { Product } from '../../models/product.model'

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup
  loading = false
  error: string | null = null
  isEditMode = false
  productId?: number

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD', Validators.required],
      category: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
    })

    const idParam = this.route.snapshot.paramMap.get('id')
    if (idParam) {
      this.isEditMode = true
      this.productId = Number(idParam)
      this.loadProduct(this.productId)
    }
  }
  loadProduct(id: number): void {
    this.loading = true
    this.productService
      .getProduct(id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (product) => this.form.patchValue(product),
        error: () => (this.error = 'Failed to load product'),
      })
  }
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      console.log('not valid form')

      return
    }

    this.loading = true
    this.error = null

    const product: Product = {
      ...this.form.value,
      id: this.productId ?? Date.now(), //The id should be the date ??
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    const request$ = this.isEditMode
      ? this.productService.updateProduct(product)
      : this.productService.createProduct(product)

    request$.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => (this.error = 'Failed to save product'),
    })
  }
  getImageUrl(name: string): string {
    return `https://robohash.org/${encodeURIComponent(
      name
    )}?set=set1&size=200x200`
  }
}
