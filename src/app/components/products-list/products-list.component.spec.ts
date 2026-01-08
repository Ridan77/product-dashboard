import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ProductsListComponent } from './products-list.component'
import { ProductService } from '../../services/product.service'
import { of } from 'rxjs'
import { Router } from '@angular/router'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

describe('ProductsListComponent', () => {
  let component: ProductsListComponent
  let fixture: ComponentFixture<ProductsListComponent>
  let productService: jasmine.SpyObj<ProductService>
  let router: jasmine.SpyObj<Router>

  beforeEach(async () => {
    productService = jasmine.createSpyObj('ProductService', ['getProducts'])
    router = jasmine.createSpyObj('Router', ['navigate'])

    productService.getProducts.and.returnValue(
      of({
        items: [],
        totalCount: 0,
      })
    )

    await TestBed.configureTestingModule({
      imports: [ProductsListComponent, NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductsListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should load products on init', () => {
    expect(productService.getProducts).toHaveBeenCalled()
  })

  it('should reset page and reload when category changes', () => {
    component.query.page = 3

    component.onCategoryChange('Audio')

    expect(component.query.page).toBe(1)
    expect(component.query.category).toBe('Audio')
    expect(productService.getProducts).toHaveBeenCalled()
  })

  it('should go to next page and reload products', () => {
    component.query.page = 1
    component.totalCount = 10
    component.query.limit = 4

    component.nextPage()

    expect(component.query.page).toBe(2)
    expect(productService.getProducts).toHaveBeenCalled()
  })
})
