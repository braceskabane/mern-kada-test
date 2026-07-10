# Bulletin App - Backend

Backend application for Bulletin App built with Express.js, MongoDB, and Pug templating engine.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Template Engine**: Pug
- **Authentication**: JWT (3 methods)
- **Password Hashing**: bcryptjs

## Project Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── passport.js        # Passport.js strategies (Local + JWT)
├── controllers/
│   ├── authController.js   # API auth controller (JSON response)
│   ├── pugController.js    # Pug page controller (cookie + passport)
│   └── pugAuthController.js # Pug page controller (bearer token)
├── middleware/
│   ├── auth.js             # JWT cookie middleware
│   ├── bearerAuth.js       # JWT Bearer token middleware
│   └── passport.js         # Passport JWT middleware
├── models/
│   ├── Auth.js             # User model
│   └── Post.js             # Post model
├── routes/
│   ├── authRoutes.js       # API auth routes (/api/*)
│   ├── postRoutes.js       # API post routes (/api/posts/*)
│   ├── pugRoutes.js        # Pug routes (cookie + passport)
│   └── pugAuthRoutes.js    # Pug routes (bearer token)
├── views/
│   ├── layout.pug          # Base layout
│   ├── post/               # Post views
│   └── user/               # Auth views
├── server.js               # App entry point
└── .env                    # Environment variables
```

## Authentication Methods

This project implements **3 different JWT authentication approaches** to demonstrate different patterns:

---

### Method 1: Cookie-Based JWT

> File reference: `middleware/auth.js`, `controllers/pugController.js`

**How it works:**
- Token is stored in HTTP-only cookie (`res.cookie("token", token)`)
- Token is automatically sent with every request (browser handles it)
- Middleware reads token from `req.cookies.token`

**Token storage**: Browser cookie (HTTP-only, SameSite=Strict)

**Flow:**
```
Login → Server creates JWT → Sets cookie → Browser auto-sends cookie on next request
                                              ↓
                                    Middleware reads req.cookies.token
```

**Middleware functions:**
| Function | Behavior |
|----------|----------|
| `protect` | Block request → redirect to `/login` if no token |
| `getUser` | Non-blocking → attach user to `res.locals.user` if token exists |

**Used on routes:**
| Route | Middleware | Purpose |
|-------|-----------|---------|
| `GET /posts` | `getUser` (app-level) | Show posts, nav adapts to auth status |
| `GET /posts/add` | `protect` | Block unauthenticated users |
| `POST /posts/add` | `protect` | Block unauthenticated users |
| `GET /post/:id/edit` | `protect` | Block unauthenticated users |
| `GET /post/:id/delete` | `protect` | Block unauthenticated users |

**Features:**
- Secure: HTTP-only cookies can't be accessed by JavaScript
- Automatic: Browser sends cookie automatically, no manual header needed
- XSS protection: Cookie not accessible via `document.cookie`

---

### Method 2: Passport.js (Local + JWT Strategy)

> File reference: `config/passport.js`, `middleware/passport.js`, `controllers/pugController.js`

**How it works:**
- Uses Passport.js with two strategies:
  - **LocalStrategy**: Validates email/password from form submission
  - **JwtStrategy**: Validates JWT from cookie on protected routes
- Token stored in HTTP-only cookie (same as Method 1)
- Passport manages authentication state

**Token storage**: Browser cookie (HTTP-only)

**Flow:**
```
Login Form → Passport LocalStrategy validates credentials
                ↓
         Server creates JWT → Sets cookie
                ↓
Protected Route → Passport JwtStrategy reads cookie → Attaches user to req
```

**Middleware functions:**
| Function | Behavior |
|----------|----------|
| `authenticateJWT` | App-level → attach user to `res.locals.user` if token valid (non-blocking) |
| `ensureAuthenticated` | Block request → redirect to `/login` if not authenticated |
| `ensureGuest` | Block request → redirect to `/` if already logged in |

**Used on routes:**
| Route | Middleware | Purpose |
|-------|-----------|---------|
| All routes | `authenticateJWT` (app-level) | Populate `res.locals.user` for views |
| `GET /posts/add` | `ensureAuthenticated` | Block unauthenticated users |
| `POST /posts/add` | `ensureAuthenticated` | Block unauthenticated users |
| `GET /post/:id/edit` | `ensureAuthenticated` | Block unauthenticated users |
| `GET /post/:id/delete` | `ensureAuthenticated` | Block unauthenticated users |

**Features:**
- Strategy pattern: Easy to swap authentication methods
- Modular: Passport plugins for different auth providers
- Serialize/deserialize: Supports session-based auth if needed
- Callback-based: Flexible authentication flow control

---

### Method 3: Bearer Token (Authorization Header)

> File reference: `middleware/bearerAuth.js`, `controllers/pugAuthController.js`

**How it works:**
- Token is displayed on screen after login/register
- User must manually copy token and store it
- Token is sent via `Authorization: Bearer <token>` header
- On protected page, JavaScript reads token from page and sends with requests

**Token storage**: Client-side (displayed on page, stored in JS variable)

**Flow:**
```
Login Form → Server validates credentials → Creates JWT → Renders token on page
                                                              ↓
User copies token → Stored in JS variable / localStorage
                          ↓
Protected Route → Browser sends Authorization header → Middleware validates
```

**Middleware functions:**
| Function | Behavior |
|----------|----------|
| `bearerAuth` | Block request → redirect to `/login-bearer` if no valid Bearer token |
| `attachUserFromBearer` | Non-blocking → attach user to `res.locals.user` if token exists |

**Used on routes:**
| Route | Middleware | Purpose |
|-------|-----------|---------|
| `GET /register-bearer` | None | Public register page |
| `POST /register-bearer` | None | Process registration, show token |
| `GET /login-bearer` | None | Public login page |
| `POST /login-bearer` | None | Process login, show token |
| `GET /dashboard-bearer` | `bearerAuth` | Protected dashboard, requires Bearer token |

**Features:**
- Explicit: User controls when to send token
- API-friendly: Same pattern used for REST API authentication
- Stateless: No cookie needed, works across different domains
- Testable: Easy to test with tools like Postman or curl

---

## Comparison Table

| Feature | Cookie JWT | Passport JWT | Bearer Token |
|---------|-----------|--------------|--------------|
| Token storage | HTTP-only cookie | HTTP-only cookie | Authorization header |
| Auto-send | Yes | Yes | No (manual) |
| XSS safe | Yes | Yes | No (if stored in JS) |
| CSRF safe | Needs protection | Needs protection | Yes |
| API friendly | No | No | Yes |
| Setup complexity | Low | Medium | Low |
| Package deps | jsonwebtoken | passport + strategies | jsonwebtoken |
| Use case | Web apps | Web apps (scalable) | API + mobile |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas or local MongoDB

### Installation

```bash
npm install
```

### Environment Variables

Create `.env` file:

```
PORT=5002
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
JWT_SECRET=your-secret-key-here
```

### Run Development

```bash
npm run dev
```

### Available Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/` | GET | Public | Home page |
| `/posts` | GET | Public | List all posts |
| `/register` | GET/POST | Public | Register (cookie JWT) |
| `/login` | GET/POST | Public | Login (cookie JWT) |
| `/logout` | GET | Protected | Clear cookie, redirect |
| `/posts/add` | GET/POST | Protected | Add post (Passport) |
| `/post/:id/edit` | GET/POST | Protected | Edit post (Passport) |
| `/post/:id/delete` | GET | Protected | Delete post (Passport) |
| `/register-bearer` | GET/POST | Public | Register (bearer token) |
| `/login-bearer` | GET/POST | Public | Login (bearer token) |
| `/dashboard-bearer` | GET | Protected | Dashboard (bearer token) |
| `/api/*` | POST | API | API auth endpoints |
| `/api/posts/*` | CRUD | API | API post endpoints |

## License

ISC
