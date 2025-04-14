# PolarSci API Documentation

## Overview

This document outlines the RESTful API endpoints for the PolarSci platform. All endpoints are prefixed with `/api/v1/`.

## Authentication

All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Base URL

```
https://api.polar-sci.org/v1
```

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user

## Endpoints

### Experiments

#### GET /experiments
Retrieve all experiments.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status
- `sort`: Sort field (createdAt, updatedAt)
- `order`: Sort order (asc, desc)

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
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "pages": "number"
  }
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
  },
  "metadata": {
    "location": "string",
    "environment": "string",
    "equipment": "string[]"
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
  "metadata": {},
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
    "location": "string",
    "temperature": "number",
    "humidity": "number",
    "pressure": "number"
  }
}
```

#### GET /experiments/:id/data-points
Retrieve all data points for an experiment.

**Query Parameters:**
- `startDate`: Start date filter
- `endDate`: End date filter
- `limit`: Maximum number of points
- `aggregate`: Aggregation function (avg, min, max)

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
  ],
  "aggregation": {
    "avg": "number",
    "min": "number",
    "max": "number"
  }
}
```

### Users

#### GET /users/profile
Get current user profile.

**Response:**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "string",
  "createdAt": "timestamp"
}
```

#### PUT /users/profile
Update user profile.

**Request Body:**
```json
{
  "username": "string",
  "email": "string"
}
```

### Analytics

#### GET /analytics/experiments
Get experiment analytics.

**Response:**
```json
{
  "totalExperiments": "number",
  "activeExperiments": "number",
  "completedExperiments": "number",
  "dataPointsCollected": "number",
  "averageDataPoints": "number"
}
```

## Error Responses

All error responses follow this format:

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
- 429: Too Many Requests
- 500: Internal Server Error 