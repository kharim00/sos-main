# JWT Token Implementation Guide for SOS API

## 1. Install JWT Package

```bash
npm install jsonwebtoken
```

## 2. Update Your Auth Controller

Replace your `src/controller/auth.js` with token generation:

```javascript
import User from "../database/models/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// Register new user
export const register = async (req, res) => {
  try {
    const { password, ...userData } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({
      success: false,
      message: "Error registering user",
      error: error.errors ? error.errors.map((err) => err.message) : error.message,
      details: error.errors || error.original || null,
    });
  }
};

// Login user - WITH TOKEN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" } // Token expires in 24 hours
    );

    res.json({
      success: true,
      message: "Login successful",
      token: token, // Return token here
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};
```

## 3. Create Authentication Middleware

Create `src/middleware/auth.js`:

```javascript
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "No token provided",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }
    
    req.user = decoded; // Attach user info to request
    next();
  });
};
```

## 4. Update Your Routes to Use Middleware

Example - `src/routes/users.js`:

```javascript
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/user.js";

const router = express.Router();

// All user routes require token
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserById);
router.post("/", verifyToken, createUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
```

## 5. Update .env File

Add to your `.env`:

```
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE=24h
```

## 6. Update Your Main Index.js

```javascript
import express from "express";
import "dotenv/config";
import sequelize from "./src/config/db.js";
import cors from "cors";
import usersRouter from "./src/routes/users.js";
import appointmentsRouter from "./src/routes/appointments.js";
import doctorAvailabilityRouter from "./src/routes/doctorAvailability.js";
import notificationsRouter from "./src/routes/notifications.js";
import authRouter from "./src/routes/auth.js";
import doctorRouter from "./src/routes/doctor.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/doctor-availability", doctorAvailabilityRouter);
app.use("/api/notifications", notificationsRouter);

// Health check endpoint (no auth required)
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Your database is running 🔥`);
      console.log(`\nAPI Endpoints:`);
      console.log(`  POST   http://localhost:${PORT}/api/auth/register`);
      console.log(`  POST   http://localhost:${PORT}/api/auth/login (returns token)`);
      console.log(`  GET/POST   http://localhost:${PORT}/api/users (requires token)`);
      console.log(`  GET/POST   http://localhost:${PORT}/api/doctors (requires token)`);
      console.log(`  GET/POST   http://localhost:${PORT}/api/appointments (requires token)`);
      console.log(`  GET/POST   http://localhost:${PORT}/api/doctor-availability (requires token)`);
      console.log(`  GET/POST   http://localhost:${PORT}/api/notifications (requires token)`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });
```

## 7. Postman Workflow (Now with Token Support)

### Step 1: Register User
```
POST {{baseUrl}}/{{api_version}}/auth/register
Body:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "patient",
  "location": "New York"
}
```

### Step 2: Login (Gets Token)
```
POST {{baseUrl}}/{{api_version}}/auth/login
Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": { ... }
}
```

✅ **Postman automatically saves token to environment variable**

### Step 3: Use Token in Requests
```
GET {{baseUrl}}/{{api_version}}/users
Headers:
  Authorization: Bearer {{token}}

✅ Token automatically added by Postman pre-request script
```

## 8. Test Token Flow in Postman

1. **Import** `postman/collections/SOS_API_Complete.json`
2. **Select** "Local Development" environment
3. **Run** Health Check → Register → Login → Access User Endpoints
4. Watch token automatically captured and reused in subsequent requests

## 9. Troubleshooting

| Error | Solution |
|-------|----------|
| `No token provided` | Make sure you logged in and token was saved |
| `Token is invalid or expired` | Log in again to get a fresh token |
| `Cannot find module 'jsonwebtoken'` | Run `npm install jsonwebtoken` |
| `JWT_SECRET undefined` | Add JWT_SECRET to `.env` file |

## 10. Security Tips

✅ **DO:**
- Keep `JWT_SECRET` in `.env` (never commit to git)
- Use HTTPS in production
- Set short expiration times (24h shown, but 15m is better for access tokens)
- Implement refresh tokens for long-lived sessions

❌ **DON'T:**
- Hardcode secrets in code
- Use weak secrets
- Store tokens in localStorage without HTTPS
- Send tokens in URLs (use Authorization header only)

## 11. Optional: Refresh Token Implementation

For production, implement refresh tokens:

```javascript
// Generate both access and refresh tokens
const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

// Send both in response
res.json({
  success: true,
  accessToken: accessToken,
  refreshToken: refreshToken,
  data: userInfo
});
```

Create `/api/auth/refresh` endpoint to get new access token using refresh token.

---

**Next Steps:**
1. ✅ Install jsonwebtoken
2. ✅ Update auth.js with token generation
3. ✅ Create auth middleware
4. ✅ Protect routes with middleware
5. ✅ Add JWT_SECRET to .env
6. ✅ Test in Postman
7. ✅ Implement refresh tokens (optional)
