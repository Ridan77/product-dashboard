import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProductFormComponent } from './product-form.component'
import { ProductService } from '../../services/product.service'
import { Router, ActivatedRoute } from '@angular/router'
import { of } from 'rxjs'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'


describe('ProductFormComponent', () => {
  let component: ProductFormComponent
  let fixture: ComponentFixture<ProductFormComponent>
  let productService: jasmine.SpyObj<ProductService>
  let router: jasmine.SpyObj<Router>

  beforeEach(async () => {
    productService = jasmine.createSpyObj('ProductService', [
      'createProduct',
      'updateProduct',
      'getProduct',
    ])
    router = jasmine.createSpyObj('Router', ['navigate'])

    productService.createProduct.and.returnValue(of({} as any))

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent,NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null, // create mode
              },
            },
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should mark form as invalid when required fields are empty', () => {
    component.form.patchValue({
      name: '',
      description: '',
      price: null,
      stock: null,
    })

    expect(component.form.invalid).toBeTrue()
  })

  it('should mark form as valid when required fields are filled', () => {
    component.form.patchValue({
      name: 'Keyboard',
      description: 'Mechanical keyboard',
      price: 100,
      stock: 5,
      currency: 'USD',
    })

    expect(component.form.valid).toBeTrue()
  })

  it('should not submit when form is invalid', () => {
    component.form.patchValue({
      name: '',
      description: '',
    })

    component.submit()

    expect(productService.createProduct).not.toHaveBeenCalled()
  })
})
