# Postman Setup Guide - SOS Medical App API

## Quick Start Checklist

- [ ] Server running on `http://localhost:5000`
- [ ] Environment variables configured
- [ ] Global variables set up
- [ ] Pre-request scripts enabled
- [ ] Tests configured for key endpoints

---

## 1. Initial Setup

### Start Your Server
```bash
npm install
npm run dev
```
Expected output:
```
Server is running on http://localhost:5000
Your database is running 🔥🔥🔥...
```

---

## 2. Create Environment File in Postman

### Option A: Manual Setup in Postman UI

1. **Open Postman** → Click **Environments** (left sidebar)
2. **Create a new environment** named `Local Development`
3. **Add these variables:**

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `baseUrl` | `http://localhost:5000` | `http://localhost:5000` |
| `api_version` | `api` | `api` |
| `userId` | `1` | `1` |
| `doctorId` | `1` | `1` |
| `appointmentId` | `1` | `1` |
| `token` | `` | `` |

4. **Save the environment**

### Option B: JSON Format (Save & Import)

Create `postman/environments/Local_Development.json`:

```json
{
  "name": "Local Development",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "type": "default",
      "enabled": true
    },
    {
      "key": "api_version",
      "value": "api",
      "type": "default",
      "enabled": true
    },
    {
      "key": "userId",
      "value": "1",
      "type": "default",
      "enabled": true
    },
    {
      "key": "doctorId",
      "value": "1",
      "type": "default",
      "enabled": true
    },
    {
      "key": "appointmentId",
      "value": "1",
      "type": "default",
      "enabled": true
    },
    {
      "key": "token",
      "value": "",
      "type": "default",
      "enabled": true
    }
  ]
}
```

---

## 3. Global Setup

In **Postman Globals** (`workspace.globals.yaml` or UI):

```yaml
values:
  - key: timestamp
    value: 
    type: default
  - key: response_time
    value: 
    type: default
```

---

## 4. Update Collection URLs

All requests should use:
```
{{baseUrl}}/{{api_version}}/[endpoint]
```

Example:
- `GET {{baseUrl}}/{{api_version}}/users`
- `POST {{baseUrl}}/{{api_version}}/auth/login`
- `GET {{baseUrl}}/{{api_version}}/users/{{userId}}`

---

## 5. Pre-Request Scripts

Add this to requests that need authentication:

```javascript
// Pre-request Script for Auth-Required Endpoints
if (pm.environment.get("token")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("token")
    });
}
```

---

## 6. Test Scripts

### For Login Endpoint (POST /api/auth/login)
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response contains token", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("token");
    pm.environment.set("token", jsonData.token);
});

pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});
```

### For GET Endpoints
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is an array or object", function () {
    pm.response.to.have.jsonBody();
});

pm.test("Response time < 1000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});
```

### For POST Endpoints
```javascript
pm.test("Status code is 201 or 200", function () {
    pm.expect([200, 201]).to.include(pm.response.code);
});

pm.test("Response has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
});
```

---

## 7. Request Order (Testing Flow)

Test requests in this order:

1. **Health Check**: `GET {{baseUrl}}/{{api_version}}/health`
2. **Register User**: `POST {{baseUrl}}/{{api_version}}/auth/register`
3. **Login**: `POST {{baseUrl}}/{{api_version}}/auth/login` (saves token)
4. **Get Users**: `GET {{baseUrl}}/{{api_version}}/users`
5. **Get Doctors**: `GET {{baseUrl}}/{{api_version}}/doctors`
6. **Create Appointment**: `POST {{baseUrl}}/{{api_version}}/appointments`
7. **Other CRUD operations**

---

## 8. Sample Request Bodies

### Register User
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "patient"
}
```

### Login
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Appointment
```json
{
  "userId": 1,
  "doctorId": 1,
  "appointmentDate": "2024-12-25",
  "startTime": "10:00",
  "endTime": "11:00",
  "reason": "General Checkup"
}
```

---

## 9. Troubleshooting

| Issue | Solution |
|-------|----------|
| **Connection refused** | Ensure server is running: `npm run dev` |
| **Port already in use** | Change PORT in `.env` or kill process on port 5000 |
| **CORS errors** | Add CORS middleware to `index.js` |
| **401 Unauthorized** | Make sure token is set after login |
| **Empty response** | Check server logs for errors |
| **Database error** | Run: `npm run db:sync` to sync database |

### Add CORS if needed (in index.js):
```javascript
import cors from 'cors';
app.use(cors());
```

---

## 10. Best Practices

✅ **DO:**
- Use environment variables for URLs and tokens
- Add tests to each request
- Run collection tests together using Collection Runner
- Keep sensitive data in environment (never in code)
- Use meaningful request names

❌ **DON'T:**
- Hardcode URLs in requests
- Store tokens in plain text in collection
- Skip error testing
- Mix development and production endpoints

---

## 11. Running Collection Tests

1. Click **Collection Runner** (or Ctrl+Alt+C)
2. Select your collection and environment
3. **Run** → Tests execute sequentially
4. View results and logs in **Test Results** tab

---

## 12. Export/Import Collection

### Export Current Collection:
`Postman UI` → Collections → (Right-click) → **Export** → Save as JSON

### Import to Share:
`File` → `Import` → Select JSON file

---

## API Endpoints Quick Reference

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | User login (returns token) |
| GET | `/api/users` | ✅ | Get all users |
| GET | `/api/users/{id}` | ✅ | Get user by ID |
| POST | `/api/users` | ✅ | Create user |
| PUT | `/api/users/{id}` | ✅ | Update user |
| DELETE | `/api/users/{id}` | ✅ | Delete user |
| GET | `/api/doctors` | ✅ | Get all doctors |
| GET | `/api/appointments` | ✅ | Get all appointments |
| POST | `/api/appointments` | ✅ | Create appointment |
| GET | `/api/doctor-availability` | ✅ | Get doctor availability |
| GET | `/api/notifications` | ✅ | Get notifications |
| GET | `/api/health` | ❌ | Health check |

---

## Next Steps

1. ✅ Set up the environment in Postman
2. ✅ Add all endpoints to your collection
3. ✅ Add test scripts to key requests
4. ✅ Test the complete workflow: Register → Login → CRUD operations
5. ✅ Run collection tests to validate all endpoints
6. ✅ Export and share collection with team

---

**Last Updated**: April 2024
**API Version**: 1.0.0
