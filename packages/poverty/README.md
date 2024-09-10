# Poverty CMS

Poverty is a simple CMS for small websites. It is designed to be easy to use. It is written in Go and uses PostgreSQL as a database.

## Requirements

- Go 1.23 or later
- PostgreSQL 16 or later
- Air (for development)

## API Documentation

| Method                 | Path                       | Description                 |
| ---------------------- | -------------------------- | --------------------------- |
| [GET](#get-all)        | /api/v1/items              | Get all items               |
| [POST](#create)        | /api/v1/items              | Create a new item           |
| [PUT](#put-items)      | /api/v1/items              | Update an array of items    |
| [GET](#get-item)       | /api/v1/items/:id          | Get an item by ID           |
| [PATCH](#patch-item)   | /api/v1/items/:id          | Partially update an item    |
| [PUT](#put-item)       | /api/v1/items/:id          | Fully update an item        |
| [DELETE](#delete-item) | /api/v1/items/:id          | Delete an item              |
| [GET](#get-children)   | /api/v1/items/:id/children | Get all children of an item |

### Get All

#### Request

<details>
  <summary>Headers</summary>

| Key             | Value              |
| --------------- | ------------------ |
| `Content-Type`  | `application/json` |
| `Authorization` | `Bearer {token}`   |

</details>

#### Responses

<details>
  <summary>200 OK</summary>

```ts
Array<{
  id: string;
  title: string;
  metadata: unknown;
  content: unknown;
  parent_id: string;
  created_at: string;
  updated_at: string;
}>;
```

</details>

<details>
  <summary>401 Unauthorized</summary>

```ts
{
  error: string;
}
```

</details>

<details>
    <summary>404 Not Found</summary>
    
```ts
{
  error: string;
}
```

</details>

<details>
  <summary>500 Internal Server Error</summary>

```ts
{
  error: string;
}
```

</details>

### Create

#### Request

<details>
  <summary>Headers</summary>

| Key             | Value              |
| --------------- | ------------------ |
| `Content-Type`  | `application/json` |
| `Authorization` | `Bearer {token}`   |

</details>

<details>
  <summary>Body</summary>

```ts
{
  title: string;
  content: unknown;
  metadata?: unknown;
  parent_id?: string;
}
```

</details>

#### Responses

<details>
  <summary>201 Created</summary>

```ts
{
  id: string;
  title: string;
  metadata: unknown;
  content: unknown;
  parent_id: string;
  created_at: string;
  updated_at: string;
}
```

</details>

<details>
  <summary>400 Bad Request</summary>

```ts
{
  error: string;
}
```

</details>

<details>
  <summary>401 Unauthorized</summary>

```ts
{
  error: string;
}
```

</details>

<details>
  <summary>500 Internal Server Error</summary>

```ts
{
  error: string;
}
```

</details>

### Put Items

#### Request

<details>
  <summary>Headers</summary>

| Key             | Value              |
| --------------- | ------------------ |
| `Content-Type`  | `application/json` |
| `Authorization` | `Bearer {token}`   |

</details>

<details>
  <summary>Body</summary>

```ts
Array<{
  id: string;
  title: string;
  metadata: unknown;
  content: unknown;
  parent_id: string;
}>;
```

</details>

#### Responses

<details>
  <summary>200 OK</summary>

```ts
Array<{
  id: string;
  title: string;
  metadata: unknown;
  content: unknown;
  parent_id: string;
  created_at: string;
  updated_at: string;
}>;
```

</details>

<details>
  <summary>400 Bad Request</summary>

```ts
{
  error: string;
}
```

</details>

<details>
  <summary>401 Unauthorized</summary>

```ts
{
  error: string;
}
```

</details>

<details>
  <summary>500 Internal Server Error</summary>

```ts
{
  error: string;
}
```

</details>

### Get Item

#### Request

<details>
    <summary>Parameters</summary>

| Key  | Value    | Location |
| ---- | -------- | -------- |
| `id` | `string` | `path`   |

</details>

<details>
  <summary>Headers</summary>

| Key             | Value              |
| --------------- | ------------------ |
| `Content-Type`  | `application/json` |
| `Authorization` | `Bearer {token}`   |

</details>

#### Responses

<details>
  <summary>200 OK</summary>

```ts
{
  id: string;
  title: string;
  metadata: unknown;
  content: unknown;
  parent_id: string;
  created_at: string;
  updated_at: string;
}
```

</details>

<details>
  <summary>401 Unauthorized</summary>

```ts
{
  error: string;
}
```

</details>

<details>
    <summary>404 Not Found</summary>
    
```ts
{
  error: string;
}
```

</details>

<details>
  <summary>500 Internal Server Error</summary>

```ts
{
  error: string;
}
```

</details>

### Patch Item

#### Request

<details>
    <summary>Parameters</summary>

| Key  | Value    | Location |
| ---- | -------- | -------- |
| `id` | `string` | `path`   |

</details>

<details>
  <summary>Headers</summary>

| Key             | Value              |
| --------------- | ------------------ |
| `Content-Type`  | `application/json` |
| `Authorization` | `Bearer {token}`   |

</details>

<details>
  <summary>Body</summary>

```ts
{
  title?: string;
  metadata?: unknown;
  content?: unknown;
  parent_id?: string;
}
```

</details>

#### Responses

<details>
  <summary>200 OK</summary>

```ts
{
  id: string;
  title: string;
  metadata: unknown;
  content: unknown;
  parent_id: string;
  created_at: string;
  updated_at: string;
}
```

</details>

<details>
  <summary>400 Bad Request</summary>

```ts
{
  error: string;
}
```

</details>

<details>
  <summary>401 Unauthorized</summary>

```ts
{
  error: string;
}
```

</details>

<details>
    <summary>404 Not Found</summary>
    
```ts
{
  error: string;
}
```

</details>

<details>
  <summary>500 Internal Server Error</summary>

```ts
{
  error: string;
}
```

</details>

### Put Item

#### Request

<details>
    <summary>Parameters</summary>

| Key  | Value    | Location |
| ---- | -------- | -------- |
| `id` | `string` | `path`   |

</details>

<details>
  <summary>Headers</summary>

| Key             | Value              |
| --------------- | ------------------ |
| `Content-Type`  | `application/json` |
| `Authorization` | `Bearer {token}`   |

</details>

<details>
  <summary>Body</summary>

```ts
{
  title: string;
  metadata: unknown;
  content: unknown;
  parent_id: string;
}
```

</details>

#### Responses

<details>
  <summary>200 OK</summary>

```ts
{
  id: string;
  title: string;
  metadata: unknown;
  content: unknown;
  parent_id: string;
  created_at: string;
  updated_at: string;
}
```

</details>

<details>
  <summary>400 Bad Request</summary>

```ts
{
  error: string;
}
```

</details>

<details>
  <summary>401 Unauthorized</summary>

```ts
{
  error: string;
}
```

</details>

<details>
    <summary>404 Not Found</summary>
    
```ts
{
  error: string;
}
```

</details>

<details>
  <summary>500 Internal Server Error</summary>

```ts
{
  error: string;
}
```

</details>

### Delete Item

#### Request

<details>
    <summary>Parameters</summary>

| Key  | Value    | Location |
| ---- | -------- | -------- |
| `id` | `string` | `path`   |

</details>

<details>
  <summary>Headers</summary>

| Key             | Value              |
| --------------- | ------------------ |
| `Content-Type`  | `application/json` |
| `Authorization` | `Bearer {token}`   |

</details>

#### Responses

<details>
  <summary>200 OK</summary>

```ts
Array<{
  id: string;
  title: string;
  metadata: unknown;
  content: unknown;
  parent_id: string;
  created_at: string;
  updated_at: string;
}>;
```

An empty array is returned if the item has no children.

</details>

<details>
  <summary>401 Unauthorized</summary>

```ts
{
  error: string;
}
```

</details>

<details>
    <summary>404 Not Found</summary>
    
```ts
{
  error: string;
}
```

</details>

<details>
  <summary>500 Internal Server Error</summary>

```ts
{
  error: string;
}
```

</details>

## To Do

- Bug: Adding text as the metadata does not trigger an update on partial update
- ?: :item/children returns [] on error, is that smart?
