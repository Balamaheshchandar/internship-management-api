# Internship Management REST API

A beginner-friendly REST API built with **Node.js, Express, and SQLite**. It supports CRUD operations, input validation, pagination, search, and sample seed data.

> The included sample internships are fictional demo records. Replace them with the official supplied dataset if your internship reviewer expects those exact records.

## 1. Requirements
- Node.js 18 or newer
- npm
- Postman or curl (optional, for testing)

## 2. Setup on Windows 11

Open this project folder in VS Code, then open Terminal:

```bash
npm install
copy .env.example .env
npm run seed
npm run dev
```

The API starts at `http://localhost:3000`.

To start without auto-reload, use `npm start`.

## 3. API endpoints

Base URL: `http://localhost:3000/api/internships`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/internships` | List internships |
| GET | `/api/internships/:id` | Get one internship |
| POST | `/api/internships` | Create an internship |
| PUT | `/api/internships/:id` | Update an internship |
| DELETE | `/api/internships/:id` | Delete an internship |

### Pagination and filtering
`GET /api/internships?page=1&limit=10`

Optional filters:
- `search=flutter` searches title, company, and location.
- `active=true` or `active=false` filters active status.
- Maximum page size is 100.

Example:
```bash
curl "http://localhost:3000/api/internships?page=1&limit=5&search=developer"
```

### Create example
Send `POST /api/internships` with `Content-Type: application/json`:

```json
{
  "title": "Backend Developer Intern",
  "company": "Example Technologies",
  "location": "Coimbatore, Tamil Nadu",
  "mode": "Hybrid",
  "employment_type": "Internship",
  "description": "Build and test REST APIs.",
  "skills": ["Node.js", "Express", "SQL"],
  "stipend": "₹8,000/month",
  "application_url": "https://example.com/apply",
  "duration": "3 months",
  "is_active": true
}
```

### Update example
Send `PUT /api/internships/1` with any subset of editable fields, for example:

```json
{ "stipend": "₹10,000/month", "is_active": true }
```

### Delete example
```bash
curl -X DELETE "http://localhost:3000/api/internships/1"
```

## 4. Response format

Success:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Frontend Developer Intern",
    "company": "BrightWeb Labs"
  }
}
```

Paginated list:
```json
{
  "success": true,
  "data": [],
  "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}
```

Validation error (HTTP 400):
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the supplied data",
    "details": ["title is required and must be a non-empty string"]
  }
}
```

Other status codes:
- `201 Created` — record created
- `200 OK` — read, update, delete successful
- `400 Bad Request` — invalid JSON or validation failure
- `404 Not Found` — record or route does not exist
- `500 Internal Server Error` — unexpected server error

## 5. Database

SQLite database file: `data/internships.db`. It is created automatically on first run. The schema is in `src/config/database.js`; seed data is in `data/seed-records.json`.

To reset the local database, stop the server, delete `data/internships.db` and its `-shm` / `-wal` files if present, then run `npm run seed` again.

## 6. Project structure

```text
internship-management-api/
├── data/
│   └── seed-records.json
├── src/
│   ├── config/database.js
│   ├── controllers/internships.js
│   ├── database/seed.js
│   ├── middleware/errors.js
│   └── routes/internships.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## 7. Push to GitHub

Create a **public** repository named `internship-management-api`, then run these commands in the project folder:

```bash
git init
git add .
git commit -m "Build internship management REST API"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/internship-management-api.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. Do not upload `.env` or `node_modules`.

## 8. Task checklist

- [x] Define internship data model and JSON response format
- [x] Implement list, detail, create, update, and delete endpoints
- [x] Validate required fields, mode, skills, URL, and unknown fields
- [x] Return consistent status codes and error format
- [x] Add pagination and search
- [x] Include SQLite persistence and seed data
- [x] Add setup instructions and API examples

## 9. Before submission

1. Run the setup commands and verify the API locally.
2. Test each endpoint in Postman.
3. Confirm the repository is public and README is visible.
4. Submit the GitHub repository URL to the internship board.

**Note:** This project is a ready-to-run starter implementation. Run it and test it on your computer before submitting; do not claim that it has been deployed or independently verified on your machine.
