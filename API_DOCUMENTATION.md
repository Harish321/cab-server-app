# Cab Management API Documentation

## Overview
This API provides unified endpoints for managing cab-related data including trips, fuel expenses, payments, and salaries.

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### 1. GET /api/cab-data
Retrieves data for a specific cab and date based on the type parameter.

**Query Parameters:**
- `type` (required): Type of data to retrieve. Values: `trips`, `fuel`, `payments`, `salaries`
- `date` (required): Date in YYYY-MM-DD format
- `cab_number` (required): Service number of the cab
- `expense_type` (optional, only for fuel): Type of expense (defaults to 'fuel')

**Response:**
- If record exists: Returns the complete record with all fields
- If record doesn't exist: Returns empty template with all keys and null/default values

#### Examples:

**Get Trips Data:**
```bash
curl "http://localhost:3000/api/cab-data?type=trips&date=2025-01-15&cab_number=CAB001"
```

Response (existing record):
```json
{
  "id": 1,
  "cab_id": 1,
  "total_trips": 25,
  "distance_km": 150.50,
  "date": "2025-01-15",
  "created_at": "2025-01-15T10:00:00.000Z",
  "created_by": "admin",
  "updated_at": "2025-01-15T10:00:00.000Z",
  "updated_by": null
}
```

Response (no record):
```json
{
  "id": null,
  "cab_id": null,
  "total_trips": 0,
  "distance_km": 0.00,
  "date": null,
  "created_at": null,
  "created_by": null,
  "updated_at": null,
  "updated_by": null
}
```

**Get Fuel Data:**
```bash
curl "http://localhost:3000/api/cab-data?type=fuel&date=2025-01-15&cab_number=CAB001"
```

Response (existing record):
```json
{
  "id": 1,
  "cab_id": 1,
  "amount": 2500.00,
  "type": "fuel",
  "subtype": "petrol",
  "comments": "Full tank",
  "paid_by": "admin",
  "date": "2025-01-15",
  "created_at": "2025-01-15T10:00:00.000Z",
  "created_by": "admin",
  "updated_at": "2025-01-15T10:00:00.000Z",
  "updated_by": null
}
```

**Get Payments Data:**
```bash
curl "http://localhost:3000/api/cab-data?type=payments&date=2025-01-15&cab_number=CAB001"
```

**Get Salaries Data:**
```bash
curl "http://localhost:3000/api/cab-data?type=salaries&date=2025-01-15&cab_number=CAB001"
```

---

### 2. POST /api/cab-data
Creates or updates data based on the type parameter and presence of `id` field.

**Body Parameters:**
- `type` (required): Type of data. Values: `trips`, `fuel`, `payments`, `salaries`
- `cab_number` (required): Service number of the cab
- `date` (required): Date in YYYY-MM-DD format
- `id` (optional): If provided, updates existing record; otherwise creates new record
- Additional fields based on type (see examples below)

**Response:**
- Success: Returns message and created/updated data
- Error: Returns error message with appropriate status code

#### Examples:

**Create New Trip:**
```bash
curl -X POST http://localhost:3000/api/cab-data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "trips",
    "cab_number": "CAB001",
    "date": "2025-01-15",
    "total_trips": 25,
    "distance_km": 150.50,
    "created_by": "admin"
  }'
```

Response:
```json
{
  "message": "Trip created successfully",
  "data": {
    "id": 1,
    "cab_id": 1,
    "total_trips": 25,
    "distance_km": 150.50,
    "date": "2025-01-15",
    "created_by": "admin"
  }
}
```

**Update Existing Trip:**
```bash
curl -X POST http://localhost:3000/api/cab-data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "trips",
    "id": 1,
    "cab_number": "CAB001",
    "date": "2025-01-15",
    "total_trips": 30,
    "distance_km": 180.75,
    "updated_by": "admin"
  }'
```

Response:
```json
{
  "message": "Trip updated successfully",
  "data": {
    "id": 1,
    "total_trips": 30,
    "distance_km": 180.75,
    "updated_by": "admin"
  }
}
```

**Create Fuel Expense:**
```bash
curl -X POST http://localhost:3000/api/cab-data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "fuel",
    "cab_number": "CAB001",
    "date": "2025-01-15",
    "amount": 2500.00,
    "subtype": "petrol",
    "comments": "Full tank",
    "paid_by": "admin",
    "created_by": "admin"
  }'
```

**Create Payment:**
```bash
curl -X POST http://localhost:3000/api/cab-data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payments",
    "cab_number": "CAB001",
    "date": "2025-01-15",
    "amount": 15000.00,
    "created_by": "admin"
  }'
```

**Create Salary:**
```bash
curl -X POST http://localhost:3000/api/cab-data \
  -H "Content-Type: application/json" \
  -d '{
    "type": "salaries",
    "cab_number": "CAB001",
    "date": "2025-01-15",
    "amount": 8000.00,
    "paid_by": "admin",
    "created_by": "admin"
  }'
```

---

## Error Responses

**400 Bad Request:**
```json
{
  "error": "type parameter is required. Valid values: trips, fuel, payments, salaries"
}
```

**404 Not Found:**
```json
{
  "error": "Cab not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

---

## Data Models

### Trips
- `id`: Integer (auto-generated)
- `cab_id`: Integer (foreign key to cabs table)
- `total_trips`: Integer (default: 0)
- `distance_km`: Decimal (default: 0.00)
- `date`: Date
- `created_at`: Timestamp
- `created_by`: String
- `updated_at`: Timestamp
- `updated_by`: String

### Fuel/Expenses
- `id`: Integer (auto-generated)
- `cab_id`: Integer (foreign key to cabs table)
- `amount`: Decimal
- `type`: Enum ('fuel', 'service', 'others')
- `subtype`: String (optional)
- `comments`: Text (optional)
- `paid_by`: String
- `date`: Date
- `created_at`: Timestamp
- `created_by`: String
- `updated_at`: Timestamp
- `updated_by`: String

### Payments
- `id`: Integer (auto-generated)
- `cab_id`: Integer (foreign key to cabs table)
- `amount`: Decimal
- `date`: Date
- `created_at`: Timestamp
- `created_by`: String
- `updated_at`: Timestamp
- `updated_by`: String

### Salaries
- `id`: Integer (auto-generated)
- `cab_id`: Integer (foreign key to cabs table)
- `amount`: Decimal
- `paid_by`: String
- `date`: Date
- `created_at`: Timestamp
- `created_by`: String
- `updated_at`: Timestamp
- `updated_by`: String

---

## Notes
- All dates should be in `YYYY-MM-DD` format
- The API uses `cab_number` (service_number) to look up the cab_id internally
- If `id` is not provided in POST requests, a new record is created
- If `id` is provided in POST requests, the existing record is updated
- `created_by` and `updated_by` default to 'system' if not provided
