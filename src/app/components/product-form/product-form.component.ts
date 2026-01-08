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
import {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFormValues
} from '../../models/product.model'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button'

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
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
  existingProduct?: Product

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      currency: ['USD', Validators.required],
      category: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
    })

    const idParam = this.route.snapshot.paramMap.get('id')
    if (idParam) {
      this.isEditMode = true
      this.productId = Number(idParam)
      this.form.disable()
      this.loadProduct(this.productId)
    }
  }
  loadProduct(id: number): void {
    this.loading = true
    this.productService
      .getProduct(id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (product) => {
          this.existingProduct = product
          this.form.patchValue(product)
          this.form.enable()
        },
        error: () => (this.error = 'Failed to load product'),
      })
  }
  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    if (this.isEditMode && !this.existingProduct) {
      return
    }
    this.loading = true
    this.error = null
    const now = Date.now()
    const formValues = this.form.value as ProductFormValues

    const product: ProductCreate | ProductUpdate = this.isEditMode
     ? {
      ...this.existingProduct!,
      ...formValues,
      updatedAt: now,
    }
  : {
      ...formValues,
      createdAt: now,
      updatedAt: now,
    }

    const request$ = this.isEditMode
      ? this.productService.updateProduct(product as ProductUpdate)
      : this.productService.createProduct(product as ProductCreate)

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
