# TamTemuExpress API - Dokumentacja

Pełna dokumentacja REST API dla sklepu internetowego TamTemuExpress.

**Base URL:** `http://localhost:3001/api`

---

## 📋 Spis treści

1. [Autoryzacja](#-autoryzacja)
2. [Produkty](#-produkty)
3. [Opinie](#-opinie)
4. [Koszyk](#-koszyk)
5. [Zamówienia](#-zamówienia)
6. [Panel Admina](#-panel-admina)
7. [Kody błędów](#-kody-błędów)

---

## 🔐 Autoryzacja

Większość endpointów wymaga tokena JWT w nagłówku:

```
Authorization: Bearer <accessToken>
```

### POST `/auth/register`

Rejestracja nowego użytkownika.

**Request Body:**
```json
{
  "firstName": "Jan",
  "lastName": "Kowalski",
  "email": "jan@example.com",
  "password": "haslo123"
}
```

**Response (201 Created):**
```json
{
  "message": "Użytkownik zarejestrowany",
  "user": {
    "id": 5,
    "email": "jan@example.com",
    "firstName": "Jan",
    "lastName": "Kowalski",
    "role": "user"
  }
}
```

---

### POST `/auth/login`

Logowanie użytkownika.

**Request Body:**
```json
{
  "email": "admin@shop.com",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@shop.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }
}
```

**Konta testowe:**
| Email | Hasło | Rola |
|-------|-------|------|
| admin@shop.com | admin123 | Administrator |
| user1@shop.com | user123 | Użytkownik |

---

### POST `/auth/refresh`

Odświeżenie access tokena.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### POST `/auth/logout`

Wylogowanie użytkownika. **Wymaga autoryzacji.**

**Response (200 OK):**
```json
{
  "message": "Wylogowano"
}
```

---

### GET `/auth/me`

Pobierz dane zalogowanego użytkownika. **Wymaga autoryzacji.**

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "admin@shop.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

---

## 📦 Produkty

### GET `/products`

Lista wszystkich produktów.

**Query Parameters:**
| Parametr | Typ | Opis |
|----------|-----|------|
| category | string | Filtruj po kategorii |
| search | string | Szukaj w nazwie |

**Przykłady:**
```
GET /products
GET /products?category=electronics
GET /products?search=jacket
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Fjallraven - Foldsack No. 1 Backpack",
    "price": 109.95,
    "description": "Your perfect pack for everyday use...",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/81...",
    "rating": 4.5,
    "ratingCount": 120,
    "stock": 50
  }
]
```

---

### GET `/products/:id`

Szczegóły pojedynczego produktu.

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Fjallraven - Foldsack No. 1 Backpack",
  "price": 109.95,
  "description": "Your perfect pack for everyday use...",
  "category": "men's clothing",
  "image": "https://fakestoreapi.com/img/81...",
  "rating": 4.5,
  "ratingCount": 120,
  "stock": 50
}
```

---

### GET `/products/categories`

Lista dostępnych kategorii.

**Response (200 OK):**
```json
[
  "electronics",
  "jewelery",
  "men's clothing",
  "women's clothing"
]
```

---

## ⭐ Opinie

### GET `/reviews/product/:id`

Opinie o produkcie.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 2,
    "productId": 1,
    "rating": 5,
    "comment": "Świetny produkt!",
    "createdAt": "2024-01-10T12:00:00.000Z",
    "firstName": "Jan",
    "lastName": "Kowalski"
  }
]
```

---

### POST `/reviews`

Dodaj opinię. **Wymaga autoryzacji.**

**Request Body:**
```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Polecam każdemu!"
}
```

**Response (201 Created):**
```json
{
  "id": 5,
  "userId": 2,
  "productId": 1,
  "rating": 5,
  "comment": "Polecam każdemu!"
}
```

> ⚠️ Użytkownik może dodać tylko 1 opinię na produkt.

---

### PUT `/reviews/:id`

Edytuj opinię. **Wymaga autoryzacji (właściciel).**

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Zaktualizowana opinia"
}
```

---

### DELETE `/reviews/:id`

Usuń opinię. **Wymaga autoryzacji (właściciel lub admin).**

**Response (200 OK):**
```json
{
  "message": "Opinia usunięta"
}
```

---

## 🛒 Koszyk

### GET `/cart`

Pobierz zawartość koszyka. **Wymaga autoryzacji.**

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "productId": 1,
    "quantity": 2,
    "title": "Fjallraven Backpack",
    "price": 109.95,
    "image": "https://..."
  }
]
```

---

### POST `/cart`

Dodaj produkt do koszyka. **Wymaga autoryzacji.**

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 1
}
```

---

### PUT `/cart/:id`

Zmień ilość produktu w koszyku. **Wymaga autoryzacji.**

**Request Body:**
```json
{
  "quantity": 3
}
```

---

### DELETE `/cart/:id`

Usuń produkt z koszyka. **Wymaga autoryzacji.**

---

### DELETE `/cart`

Wyczyść cały koszyk. **Wymaga autoryzacji.**

---

## 📋 Zamówienia

### GET `/orders`

Historia zamówień użytkownika. **Wymaga autoryzacji.**

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "total": 219.90,
    "status": "completed",
    "createdAt": "2024-01-10T12:00:00.000Z",
    "itemCount": 2
  }
]
```

---

### GET `/orders/:id`

Szczegóły zamówienia. **Wymaga autoryzacji.**

**Response (200 OK):**
```json
{
  "id": 1,
  "total": 219.90,
  "status": "completed",
  "createdAt": "2024-01-10T12:00:00.000Z",
  "items": [
    {
      "productId": 1,
      "title": "Fjallraven Backpack",
      "quantity": 2,
      "price": 109.95,
      "image": "https://..."
    }
  ]
}
```

---

### POST `/orders`

Złóż zamówienie (z zawartości koszyka). **Wymaga autoryzacji.**

**Response (201 Created):**
```json
{
  "id": 5,
  "total": 219.90,
  "status": "pending",
  "createdAt": "2024-01-10T12:00:00.000Z"
}
```

---

## 👑 Panel Admina

### GET `/admin/reviews`

Lista wszystkich opinii. **Wymaga autoryzacji (admin).**

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "productId": 1,
    "productTitle": "Fjallraven Backpack",
    "userId": 2,
    "firstName": "Jan",
    "lastName": "Kowalski",
    "rating": 5,
    "comment": "Świetny produkt!",
    "createdAt": "2024-01-10T12:00:00.000Z"
  }
]
```

---

### GET `/admin/users`

Lista użytkowników. **Wymaga autoryzacji (admin).**

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "email": "admin@shop.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## ❌ Kody błędów

| Kod | Opis |
|-----|------|
| 400 | Błędne dane wejściowe |
| 401 | Brak autoryzacji / nieprawidłowy token |
| 403 | Brak uprawnień |
| 404 | Zasób nie znaleziony |
| 409 | Konflikt (np. email już istnieje) |
| 500 | Błąd serwera |

**Przykład odpowiedzi błędu:**
```json
{
  "message": "Nieprawidłowy email lub hasło"
}
```

---

📝 **Wersja:** 1.0.0  
📅 **Ostatnia aktualizacja:** Styczeń 2024
