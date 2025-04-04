# PolarSci API Documentation

## Overview

This document outlines the RESTful API endpoints for the PolarSci platform. All endpoints are prefixed with `/api/v1/`.

## Authentication

All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Experiments

#### GET /experiments
Retrieve all experiments.

**Response:**
```json
{
  "experiments": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "status": "string",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

#### POST /experiments
Create a new experiment.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "parameters": {
    "key": "value"
  }
}
```

#### GET /experiments/:id
Retrieve a specific experiment.

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "status": "string",
  "dataPoints": [],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Data Points

#### POST /experiments/:id/data-points
Add a new data point to an experiment.

**Request Body:**
```json
{
  "value": "number",
  "timestamp": "timestamp",
  "metadata": {
    "key": "value"
  }
}
```

#### GET /experiments/:id/data-points
Retrieve all data points for an experiment.

**Response:**
```json
{
  "dataPoints": [
    {
      "id": "string",
      "value": "number",
      "timestamp": "timestamp",
      "metadata": {}
    }
  ]
}
```

### User Management

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

#### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Token Management

#### GET /tokens/balance
Get user's token balance.

**Response:**
```json
{
  "balance": "number",
  "currency": "PSCI"
}
```

#### POST /tokens/transfer
Transfer tokens to another user.

**Request Body:**
```json
{
  "recipient": "string",
  "amount": "number"
}
```

## Error Responses

All endpoints may return the following error responses:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

Common error codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per minute per user. The following headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
``` 