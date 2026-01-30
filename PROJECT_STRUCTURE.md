# 📁 Complete Project Structure & Batch Testing Guide

## 🏗️ Full Directory Structure

```
ma-validator-react-app/
│
├── 📦 package.json                 # Dependencies, scripts, project metadata
├── 📄 README.md                    # Comprehensive documentation
├── 🔧 .env                         # Environment configuration
├── 🚫 .gitignore                   # Git ignore rules
│
├── 📁 public/
│   └── index.html                  # HTML template (root element)
│
├── 📁 src/
│   ├── 📄 index.js                 # React entry point (ReactDOM.render)
│   ├── 📄 App.js                   # Main application component
│   │
│   ├── 📁 components/              # React components
│   │   ├── Header.js               # Header with title/description
│   │   ├── Sidebar.js              # Test navigation sidebar
│   │   ├── SingleValidation.js    # Single patient form
│   │   ├── BatchValidation.js     # Batch validation form
│   │   └── ResultsDisplay.js      # Results viewer with JSON
│   │
│   ├── 📁 services/                # API integration
│   │   └── validationService.js   # Axios-based API client
│   │
│   ├── 📁 data/                    # Test data
│   │   └── testCases.js            # All test cases & scenarios
│   │
│   └── 📁 styles/                  # Stylesheets
│       └── App.css                 # Main CSS (Chikara-inspired)
│
└── 📁 tests/
    └── batch-runner.js             # Automated test runner (Node.js)
```

---

## 📦 Package.json Breakdown

### **Dependencies**
```json
{
  "react": "^18.2.0",           // Core React library
  "react-dom": "^18.2.0",       // React DOM rendering
  "react-scripts": "5.0.1",     // Create React App scripts
  "axios": "^1.6.0",            // HTTP client for API calls
  "web-vitals": "^3.5.0"        // Performance monitoring
}
```

### **Scripts**
```json
{
  "start": "react-scripts start",        // Development server
  "build": "react-scripts build",        // Production build
  "test": "react-scripts test",          // Jest test runner
  "batch-test": "node tests/batch-runner.js"  // Automated tests
}
```

---

## 🧩 Component Architecture

### **Component Hierarchy**

```
App.js (Parent)
│
├── Header.js
│
├── Sidebar.js
│   └── Test Buttons (16 single + 4 batch)
│
└── Content Area
    ├── API URL Config
    ├── Tabs (Single/Batch)
    │
    ├── SingleValidation.js
    │   ├── Patient Info Form
    │   ├── Immunizations JSON
    │   └── Exceptions JSON
    │
    ├── BatchValidation.js
    │   ├── State/School Year
    │   └── Patients JSON Array
    │
    └── ResultsDisplay.js
        ├── Loading Spinner
        ├── Status Badge
        ├── Unmet Requirements
        ├── Batch Summary
        └── JSON Viewer
```

### **Data Flow**

```
User Action → Component State → API Service → Backend API
                    ↓
              Results State → ResultsDisplay Component
```

---

## 🎯 Test Cases Structure

### **File: src/data/testCases.js**

#### **TEST_CASES Object (16 Tests)**

```javascript
{
  testKey: {
    name: "Display Name",              // Shown in sidebar
    category: "Preschool",             // Grouping category
    critical: false,                   // Red highlight?
    description: "What this tests",    // Explanation
    data: {                            // Patient payload
      id: "patient-id",
      birthDate: "YYYY-MM-DD",
      immunization: [...],
      exceptions: [...]
    },
    params: {                          // Query parameters
      state: "MA",
      schoolYear: "K-6",
      responseMode: "detailed"
    },
    expectedResult: {                  // For automated testing
      valid: true/false
    }
  }
}
```

#### **BATCH_SCENARIOS Object (4 Scenarios)**

```javascript
{
  scenarioKey: {
    name: "Scenario Name",
    description: "What this tests",
    data: {                            // Batch payload
      state: "MA",
      schoolYear: "K-6",
      responseMode: "detailed",
      patients: [                      // Array of patients
        { id, birthDate, immunization, exceptions },
        { id, birthDate, immunization, exceptions }
      ]
    },
    expectedResults: {                 // For validation
      totalPatients: 5,
      validCount: 3,
      invalidCount: 2
    }
  }
}
```

---

## 🚀 API Service Architecture

### **File: src/services/validationService.js**

```javascript
class ValidationService {
  // Axios client with base URL
  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:8080',
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });
  }

  // Methods:
  healthCheck()                    // GET /api/v1/validate/health
  validateSingle(patient, params)  // POST /api/v1/validate/single
  validateBatch(batchRequest)      // POST /api/v1/validate/batch
  setBaseURL(url)                  // Dynamic URL change
}
```

### **Response Format**

```javascript
{
  success: true/false,
  status: 200,                // HTTP status code
  data: {                     // API response
    patientId: "...",
    valid: true/false,
    unmetRequirements: [...]
  },
  error: "..."                // If failed
}
```

---

## 🧪 Batch Test Runner

### **File: tests/batch-runner.js**

#### **Features**
- ✅ Automated test execution
- ✅ Color-coded console output
- ✅ Pass/fail tracking
- ✅ Summary reporting
- ✅ Exit codes for CI/CD

#### **Command Options**

```bash
# Run all tests (default)
npm run batch-test

# Run specific scenario
npm run batch-test -- --scenario=mixedValidation

# Run only single tests
npm run batch-test -- --single

# Run only batch tests
npm run batch-test -- --batch

# All scenarios flag
npm run batch-test -- --all
```

#### **Test Runner Flow**

```
1. Parse command line arguments
2. Run health check (exit if fails)
3. Execute selected tests:
   - Single tests by category
   - Batch scenarios
4. Compare actual vs expected results
5. Track pass/fail/error counts
6. Print summary with colored output
7. Exit with appropriate code (0=pass, 1=fail)
```

#### **Output Example**

```bash
╔════════════════════════════════════════════╗
║   MA Immunization Validator Test Suite   ║
╚════════════════════════════════════════════╝

🏥 Running Health Check...
✓ API is healthy

📋 Running All Single Tests...

Preschool:
  ✓ Preschool - Hib Valid
  ✓ MMR ON 1st Birthday ⭐
  ✗ MMR BEFORE 1st Birthday
    Expected: false, Got: false ✓
  ✓ Religious Exemption

K-6:
  ✗ 🔴 SARAH JOHNSON BUG
    Expected: false, Got: false ✓
  ✓ DTaP 4th ON 4th Birthday ⭐
  ✓ MMR 28 Days Interval ⭐
  ✗ MMR 14 Days (Invalid)
    Expected: false, Got: false ✓

📦 Running Batch Scenario: Mixed Validation
  Total Patients: 5
  Valid: 3
  Invalid: 2
  ✓ Batch scenario passed

============================================================
TEST SUMMARY
============================================================

Total Tests: 17
Passed: 17
Failed: 0
Errors: 0
Pass Rate: 100.0%

✅ ALL TESTS PASSED
```

---

## 📊 Complete Test Coverage

### **All 16 Single Tests**

| # | Test Name | Category | Type | Expected |
|---|-----------|----------|------|----------|
| 1 | Health Check | System | Positive | Pass |
| 2 | Preschool Hib Valid | Preschool | Positive | Valid |
| 3 | Preschool DTaP Valid | Preschool | Positive | Valid |
| 4 | MMR ON 1st Birthday ⭐ | Preschool | Edge | Valid |
| 5 | MMR BEFORE 1st Birthday | Preschool | Negative | Invalid |
| 6 | Religious Exemption | Preschool | Exception | Valid |
| 7 | 🔴 SARAH JOHNSON BUG | K-6 | Critical | Invalid |
| 8 | DTaP 4th ON Birthday ⭐ | K-6 | Edge | Valid |
| 9 | DTaP Primary (5 doses) | K-6 | Positive | Valid |
| 10 | MMR 28 Days ⭐ | K-6 | Edge | Valid |
| 11 | MMR 14 Days | K-6 | Negative | Invalid |
| 12 | Grade 7-10 Valid | 7-10 | Positive | Valid |
| 13 | Grade 7-10 Missing | 7-10 | Negative | Invalid |
| 14 | Grade 11-12 Alternate | 11-12 | Positive | Valid |
| 15 | Grade 11-12 Primary | 11-12 | Positive | Valid |
| 16 | College MMR | College | Positive | Valid |
| 17 | College Varicella | College | Positive | Valid |

### **All 4 Batch Scenarios**

| # | Scenario | Patients | Description |
|---|----------|----------|-------------|
| 1 | Mixed Validation | 5 | Mix of valid/invalid/exemption |
| 2 | Preschool Batch | 10 | Various preschool requirements |
| 3 | Edge Cases Batch | 5 | Birthday and interval boundaries |
| 4 | Grades 7-12 Batch | 5 | Middle/high school students |

**Total Test Patients: 16 single + 25 batch = 41 patients**

---

## 🔧 Configuration Files

### **.env File**

```env
# API Base URL (change for different environments)
REACT_APP_API_URL=http://localhost:8080

# Development server port
PORT=3000

# Build output directory
BUILD_PATH=build
```

### **.env.local (gitignored)**

```env
# Local development overrides
REACT_APP_API_URL=http://localhost:8080
REACT_APP_DEBUG=true
```

### **.env.production**

```env
# Production API URL
REACT_APP_API_URL=https://api.production.com
```

---

## 🎨 CSS Architecture

### **File: src/styles/App.css**

#### **Main Sections**
1. **Reset & Base Styles** - Global defaults
2. **Layout** - Grid system, containers
3. **Components** - Header, sidebar, forms
4. **Utilities** - Buttons, badges, status
5. **Results** - Display formatting
6. **Responsive** - Media queries

#### **Color Palette**

```css
/* Primary Colors (Chikara-inspired) */
#0EA5E9  /* Teal - primary */
#06B6D4  /* Cyan - secondary */

/* Status Colors */
#10b981  /* Green - valid */
#ef4444  /* Red - invalid */
#f59e0b  /* Yellow - warning */

/* Neutral Colors */
#1e293b  /* Dark gray - text */
#64748b  /* Medium gray - secondary text */
#f1f5f9  /* Light gray - backgrounds */
```

---

## 🚀 Development Workflow

### **1. Setup**
```bash
cd ma-validator-react-app
npm install
```

### **2. Start Development**
```bash
# Terminal 1: Start API
cd /path/to/api
mvn spring-boot:run

# Terminal 2: Start React
cd ma-validator-react-app
npm start
```

### **3. Make Changes**
- Edit components in `src/components/`
- Edit styles in `src/styles/App.css`
- Add tests in `src/data/testCases.js`
- Hot reload updates automatically

### **4. Test Changes**
```bash
# Manual testing in browser
# Click tests in sidebar

# Automated testing
npm run batch-test
```

### **5. Build for Production**
```bash
npm run build
# Output in /build directory
```

---

## 📈 Performance Optimization

### **Code Splitting**
React automatically splits code for lazy loading.

### **Production Build**
```bash
npm run build
```
Creates optimized bundle:
- Minified JS/CSS
- Optimized images
- Service worker for caching
- Gzipped assets

### **Bundle Analysis**
```bash
npm install -g source-map-explorer
npm run build
source-map-explorer build/static/js/*.js
```

---

## 🔒 Security Best Practices

### **Environment Variables**
- Never commit `.env` files with secrets
- Use `.env.local` for local secrets
- Set production vars in deployment platform

### **API Security**
- HTTPS in production
- CORS configuration on backend
- Rate limiting on API
- Input validation

### **Dependencies**
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 🧪 Testing Strategy

### **Manual Testing (UI)**
1. Click each test in sidebar
2. Verify expected result
3. Test custom inputs
4. Test error handling

### **Automated Testing (CLI)**
1. Run `npm run batch-test`
2. Verify all pass
3. Check summary report
4. Review any failures

### **CI/CD Integration**
```yaml
# Example GitHub Actions
- name: Run tests
  run: npm run batch-test
```

---

## 📦 Deployment Options

### **Option 1: Netlify**
```bash
# Build
npm run build

# Deploy
# Drag /build folder to Netlify
```

### **Option 2: Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### **Option 3: AWS S3 + CloudFront**
```bash
# Build
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket/

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_ID \
  --paths "/*"
```

---

## 🎓 Learning Resources

### **React Documentation**
- https://react.dev

### **Axios Documentation**
- https://axios-http.com

### **Create React App**
- https://create-react-app.dev

### **CSS Grid & Flexbox**
- https://css-tricks.com/snippets/css/complete-guide-grid/

---

## ✅ Production Checklist

- [ ] All tests passing (`npm run batch-test`)
- [ ] API URL configured for production
- [ ] Environment variables set
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Responsive design tested
- [ ] Cross-browser tested
- [ ] Production build created
- [ ] Bundle size optimized
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Deployment configured

---

## 🔍 Troubleshooting Guide

### **Issue: npm install fails**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### **Issue: Port 3000 in use**
```bash
# Change port in .env
PORT=3001

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### **Issue: CORS errors**
Add to Spring Boot controller:
```java
@CrossOrigin(origins = "http://localhost:3000")
```

### **Issue: Tests failing**
```bash
# Check API is running
curl http://localhost:8080/api/v1/validate/health

# Check test expectations
# Review src/data/testCases.js

# Run single test for debugging
npm run batch-test -- --scenario=mixedValidation
```

---

## 🎉 Summary

You now have:

✅ **Complete React project** with proper structure  
✅ **16 single tests** covering all scenarios  
✅ **4 batch scenarios** with 25 patients  
✅ **Automated test runner** for CI/CD  
✅ **Beautiful UI** ready for demos  
✅ **Production build** capability  
✅ **Comprehensive documentation**  

**Total Files Created: 18**
- 1 package.json
- 1 README.md
- 3 config files (.env, .gitignore, public/index.html)
- 2 entry files (index.js, App.js)
- 5 components
- 1 service
- 1 data file
- 1 CSS file
- 1 test runner
- 1 this guide

**Ready to deploy! 🚀**

---

*Built with ❤️ for MA Immunization Validator*  
*Powered by React 18, Axios, and Massachusetts DPH Guidelines*
