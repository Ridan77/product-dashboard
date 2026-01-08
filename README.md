# Product Management Dashboard (Angular)

Frontend take-home assignment – Product Management Dashboard  

---

## Overview

This project is a small Angular application for managing products in an e-commerce catalog.  
It demonstrates everyday frontend decision-making, Angular best practices, reactive forms, RxJS usage, and clean separation between UI and data access.

The application includes:
- Product list with search, sorting, and pagination
- Create and edit product flows
- Reactive forms with validation
- Clear loading, error, and empty states
- A mocked API boundary using `json-server`

---

## Tech Stack

- **Angular** (standalone components)
- **TypeScript**
- **RxJS**
- **Angular Material**
- **json-server** (mock backend)
- **HttpClient**
- **Jasmine / Karma** (testing)

---

## Features

### Product List
- Search with debounce
- Sorting (name / price / creation date)
- Pagination with total page calculation
- Loading, error, and empty states
- Navigation to edit product

### Product Create / Edit
- Single reusable reactive form
- Strongly typed product model
- Field-level validation with user feedback
- Create and update flows
- Disabled submit while invalid or saving

### Architecture
- Feature-based folder structure
- Clear API/service boundary
- Strong typing (no `any` in business logic)
- Readable RxJS pipelines
- Standalone Angular components

---

## Project Structure
```plaintext

src/app/
├── products/
│   ├── models/
│   │   └── product.model.ts
│   ├── services/
│   │   └── product.service.ts
│   ├── pages/
│   │   ├── products-list/
│   │   │   ├── products-list.component.ts
│   │   │   ├── products-list.component.html
│   │   │   └── products-list.component.css
│   │   └── product-form/
│   │       ├── product-form.component.ts
│   │       ├── product-form.component.html
│   │       └── product-form.component.css
│   └── products.routes.ts
```



## Product Model



The product model is intentionally realistic but concise:
```plaintext

export interface Product {
  id: number
  name: string
  description: string
  price: number
  currency: 'USD' | 'EUR' | 'ILS'
  category: string
  stock: number
  isActive: boolean
  createdAt: number
  updatedAt: number
}
```
## API & Data Layer

The application treats data access as an API boundary.

# Mock Backend

The project uses json-server with a db.json file.

Supported features:

Pagination via _start/_end

Sorting via _sort / _order

Search via q

Total count via X-Total-Count response header

# ProductService

Responsible for all HTTP communication

Maps UI query state to API parameters

Returns typed observables

Keeps components thin and declarative

# Routes

Route	Description
/products	Products list
/products/new	Create product
/products/:id	Edit product

Create and edit routes share the same form component, differentiated by route parameters.

## Forms & Validation

Reactive Forms

Required and minimum-length validations

Numeric validations for price and stock

Disabled submit when invalid

Inline validation messages

Clear saving and error feedback

## State & UX Handling

Loading indicators during API calls

Error banners on failed requests

Empty state when no products match filters

Disabled pagination buttons when unavailable

## Running the Project
Prerequisites

Node.js (v18+ recommended)

Angular CLI

Install dependencies
```bash
npm install
```
### Development Mode (Single Command)

To simplify local development, the project uses the `concurrently` package to run both the Angular app and the mock API at the same time:

```bash
npm run dev
```

Open:
http://localhost:4200

## Design & Technical Decisions

Standalone components were used 

Reactive Forms were chosen for explicit validation and testability.

RxJS operators are kept readable and minimal (e.g. debounce, distinctUntilChanged).

API boundary is enforced via a single service.

No global state library was introduced to keep scope aligned with assignment size.