# SOLID Principles - Quick Reference Guide

## 🎯 Where to Find Each Principle

---

## 1️⃣ Single Responsibility Principle (SRP)

### Backend
| File | Lines | What it Does |
|------|-------|--------------|
| `Backend/middleware/auth.js` | 4-8 | Handles ONLY authentication/authorization |
| `Backend/middleware/errorHandler.js` | 4-14 | Handles ONLY error formatting |
| `Backend/controllers/authController.js` | 5-9 | Handles ONLY auth operations |
| `Backend/models/User.js` | Entire file | Defines ONLY User data structure |
| `Backend/routes/authRoutes.js` | Entire file | Defines ONLY auth endpoints |

### Frontend
| File | Lines | What it Does |
|------|-------|--------------|
| `frontend/src/services/api.js` | 3-7 | Handles ONLY API communication |
| `frontend/src/context/AuthContext.jsx` | 5-9 | Manages ONLY auth state |
| `frontend/src/components/common/ProtectedRoute.jsx` | Entire file | Handles ONLY route protection |
| `frontend/src/components/waste/RequestForm.jsx` | Entire file | Handles ONLY waste request form |

---

## 2️⃣ Open/Closed Principle (OCP)

### Backend
| File | Lines | Example |
|------|-------|---------|
| `Backend/middleware/auth.js` | 10-14 | Can add new roles without modifying existing code |
| `Backend/middleware/errorHandler.js` | 10-14 | Can add new error types without modifying existing handlers |

```javascript
// Easy to extend:
export const newRole = authorize('newRole'); // ✅ No modification needed
```

### Frontend
| File | Lines | Example |
|------|-------|---------|
| `frontend/src/context/AuthContext.jsx` | 18-21 | ROLE_ROUTES config - add new roles easily |
| `frontend/src/services/api.js` | Throughout | Add new API endpoints without changing existing ones |

```javascript
// Easy to extend:
const ROLE_ROUTES = {
  admin: '/admin/dashboard',
  newRole: '/new/dashboard' // ✅ Just add here
};
```

---

## 3️⃣ Liskov Substitution Principle (LSP)

### Backend
| File | Lines | Example |
|------|-------|---------|
| `Backend/middleware/auth.js` | 44-48 | All middleware functions have same signature `(req, res, next)` |

```javascript
// All these are interchangeable:
router.get('/', protect, handler);
router.get('/', adminOnly, handler); // ✅ Same contract
router.get('/', authorize('admin'), handler); // ✅ Same contract
```

### Frontend
| File | Example |
|------|---------|
| `frontend/src/components/common/ProtectedRoute.jsx` | Can substitute for `<Route>` component |
| All React Components | All follow React component contract |

```javascript
// Components are substitutable:
<Route path="/dash" element={<Dashboard />} />
<ProtectedRoute path="/admin" element={<AdminDash />} /> // ✅ Same usage
```

---

## 4️⃣ Interface Segregation Principle (ISP)

### Backend
| File | Lines | Example |
|------|-------|---------|
| `Backend/middleware/auth.js` | 50-54 | Specific role middlewares instead of one generic function |

```javascript
// Routes use only what they need:
router.get('/admin', adminOnly, handler); // ✅ Only admin authorization
// Doesn't need to know about other roles
```

### Frontend
| File | Lines | Example |
|------|-------|---------|
| `frontend/src/services/api.js` | 9-13 | API separated by domain (auth, requests, announcements) |

```javascript
// Components import only what they need:
import { authAPI } from '../services/api'; // ✅ Only auth methods
// Not forced to import wasteRequestAPI, configAPI, etc.
```

---

## 5️⃣ Dependency Inversion Principle (DIP)

### Backend
| File | Lines | Example |
|------|-------|---------|
| `Backend/controllers/authController.js` | 11-15 | Depends on User model abstraction, not database |

```javascript
// Controller doesn't know about MongoDB:
const user = await User.findOne({ email }); // ✅ Abstraction
// Could be MongoDB, PostgreSQL, MySQL - controller doesn't care
```

### Frontend
| File | Lines | Example |
|------|-------|---------|
| `frontend/src/services/api.js` | 15-19 | Components depend on API interface, not axios |
| `frontend/src/context/AuthContext.jsx` | 11-15 | Components depend on useAuth hook, not context directly |

```javascript
// Components depend on abstraction:
const { user, login } = useAuth(); // ✅ Don't know implementation
// Could be using Context, Redux, Zustand - component doesn't care
```

---

## 📋 Quick Checklist: Finding SOLID in Your Code

### To Find SRP:
- ✅ Look for: Files/functions with single, clear purpose
- ✅ Check: `middleware/`, `controllers/`, `services/`, `components/`
- ✅ Comments at: Lines 4-8 in auth files

### To Find OCP:
- ✅ Look for: Configuration objects, factory functions
- ✅ Check: `authorize()` function, `ROLE_ROUTES` object
- ✅ Comments at: Lines 10-14 in auth files

### To Find LSP:
- ✅ Look for: Functions with same signature, React components
- ✅ Check: All middleware, all React components
- ✅ Comments at: Lines 44-48 in `auth.js`

### To Find ISP:
- ✅ Look for: Specific exports (adminOnly, authAPI, wasteRequestAPI)
- ✅ Check: API objects, role-specific middleware
- ✅ Comments at: Lines 50-54 in `auth.js`, Lines 9-13 in `api.js`

### To Find DIP:
- ✅ Look for: Imports of abstractions (models, hooks, API services)
- ✅ Check: Controller imports, component hooks usage
- ✅ Comments at: Lines 11-15 in `authController.js`, Lines 15-19 in `api.js`

---

## 🔍 Search Commands (for your IDE)

### Find all SOLID comments:
```
Search: "SOLID PRINCIPLE:"
```

### Find specific principles:
```
Search: "SOLID PRINCIPLE: Single Responsibility"
Search: "SOLID PRINCIPLE: Open/Closed"
Search: "SOLID PRINCIPLE: Liskov Substitution"
Search: "SOLID PRINCIPLE: Interface Segregation"
Search: "SOLID PRINCIPLE: Dependency Inversion"
```

---

## 📊 SOLID Principles Coverage

### Backend Files with Comments:
- ✅ `Backend/middleware/auth.js` - **4 principles** (SRP, OCP, LSP, ISP)
- ✅ `Backend/middleware/errorHandler.js` - **2 principles** (SRP, OCP)
- ✅ `Backend/controllers/authController.js` - **2 principles** (SRP, DIP)

### Frontend Files with Comments:
- ✅ `frontend/src/services/api.js` - **3 principles** (SRP, ISP, DIP)
- ✅ `frontend/src/context/AuthContext.jsx` - **3 principles** (SRP, DIP, OCP)

### Total:
- **5 files** with SOLID comments
- **All 5 SOLID principles** represented
- **0 functionality changes**
- **100% backward compatible**

---

## 💡 Example Usage Patterns

### Using SRP:
```javascript
// ✅ Good - Each function has one responsibility
export const protect = async (req, res, next) => { /* verify token */ };
export const authorize = (...roles) => { /* check roles */ };

// ❌ Bad - One function doing too much
export const protectAndAuthorize = async (req, res, next) => {
  /* verify token AND check roles AND log AND ... */
};
```

### Using OCP:
```javascript
// ✅ Good - Open for extension
export const adminOnly = authorize('admin');
export const managerOnly = authorize('manager'); // Easy to add

// ❌ Bad - Closed for extension
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') { /* hardcoded */ }
};
```

### Using DIP:
```javascript
// ✅ Good - Depend on abstraction
import { authAPI } from '../services/api';
await authAPI.login(credentials); // Don't know it's axios

// ❌ Bad - Depend on concrete implementation
import axios from 'axios';
await axios.post('http://localhost:5000/api/auth/login', credentials);
```

---

## 📖 Full Documentation

For detailed explanations, examples, and architecture diagrams:
- See: **SOLID_PRINCIPLES.md**

For implementation summary and changes made:
- See: **SOLID_IMPLEMENTATION_SUMMARY.md**

---

**Last Updated**: 2025-10-17  
**Quick Access**: Search "SOLID PRINCIPLE:" in your IDE to jump to comments

