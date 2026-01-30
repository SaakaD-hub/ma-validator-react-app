# 🏥 MA Immunization Validator - React Frontend

> **Production-ready testing interface for Massachusetts Department of Public Health immunization validation**

A beautiful, professional React application for testing the MA Immunization Validator API with pre-loaded test cases, batch validation, and comprehensive reporting.

![React Version](https://img.shields.io/badge/React-18.2.0-blue)
![Node Version](https://img.shields.io/badge/Node-14%2B-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Test Cases](#-test-cases)
- [Batch Testing](#-batch-testing)
- [API Configuration](#-api-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🎯 **Pre-Loaded Test Cases**
- **16 comprehensive single-patient tests** covering all grade levels
- **4 batch validation scenarios** with multiple patients
- One-click test loading from sidebar
- Organized by category (Preschool, K-6, Grades 7-10, 11-12, College)

### 🎨 **Beautiful UI**
- Chikara Health Records-inspired design
- Teal/turquoise gradient interface
- Professional healthcare look
- Fully responsive (mobile, tablet, desktop)

### 🚀 **Powerful Testing**
- Single patient validation
- Batch validation (multiple patients)
- Real-time results display
- Color-coded validation status
- Detailed unmet requirements breakdown

### 🔧 **Developer-Friendly**
- Automated batch test runner
- Command-line test execution
- Comprehensive test coverage reporting
- Easy API configuration

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 14+ installed
- Java Spring Boot API running on `http://localhost:8080`
- npm or yarn package manager

### **Installation**

```bash
# 1. Navigate to project directory
cd ma-validator-react-app

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Open browser
# The app will automatically open at http://localhost:3000
```

**That's it! You're ready to test!** 🎉

---

## 📁 Project Structure

```
ma-validator-react-app/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Header.js           # Header component
│   │   ├── Sidebar.js          # Test navigation sidebar
│   │   ├── SingleValidation.js # Single patient form
│   │   ├── BatchValidation.js  # Batch validation form
│   │   └── ResultsDisplay.js   # Results viewer
│   ├── services/
│   │   └── validationService.js # API client
│   ├── data/
│   │   └── testCases.js        # All test cases & scenarios
│   ├── styles/
│   │   └── App.css             # Main stylesheet
│   ├── App.js                  # Main app component
│   └── index.js                # Entry point
├── tests/
│   └── batch-runner.js         # Automated test runner
├── package.json                # Dependencies & scripts
├── .env                        # Environment configuration
└── README.md                   # This file
```

---

## 🎯 Available Scripts

### **Development**

```bash
# Start development server (hot reload enabled)
npm start

# Access at http://localhost:3000
```

### **Production Build**

```bash
# Create optimized production build
npm run build

# Output in /build directory
```

### **Automated Testing**

```bash
# Run all tests (single + batch)
npm run batch-test

# Run only single tests
npm run batch-test -- --single

# Run only batch tests
npm run batch-test -- --batch

# Run specific batch scenario
npm run batch-test -- --scenario=mixedValidation

# Available scenarios:
#   - mixedValidation
#   - preschoolBatch
#   - edgeCasesBatch
#   - grade7to12Batch
```

### **Test Runner Output Example**

```
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
  ✓ Religious Exemption

K-6:
  ✗ 🔴 SARAH JOHNSON BUG
  ✓ DTaP 4th ON 4th Birthday ⭐
  ✓ MMR 28 Days Interval ⭐
  ✗ MMR 14 Days (Invalid)

============================================================
TEST SUMMARY
============================================================

Total Tests: 16
Passed: 13
Failed: 3
Errors: 0
Pass Rate: 81.3%

✅ ALL TESTS PASSED
```

---

## 🧪 Test Cases

### **Pre-Loaded Single Tests (16)**

#### **System (1)**
- ✅ Health Check - Verify API is running

#### **Preschool (5)**
- ✅ Hib Valid - 1 dose satisfies requirement
- ✅ DTaP Valid - 4 doses for preschool
- ⭐ MMR ON 1st Birthday - Edge case: dose exactly on birthday
- ❌ MMR BEFORE 1st Birthday - Negative test: dose too early
- ✅ Religious Exemption - 0 doses + valid exemption

#### **K-6 (5)**
- 🔴 **SARAH JOHNSON BUG** - Critical: 4th dose before 4th birthday
- ⭐ DTaP 4th ON 4th Birthday - Edge case: dose exactly on birthday
- ✅ DTaP Primary - 5 doses meets requirement
- ⭐ MMR 28 Days Interval - Edge case: exactly 28 days
- ❌ MMR 14 Days Invalid - Negative test: insufficient interval

#### **Grades 7-10 (2)**
- ✅ Tdap + MenACWY Valid - Both vaccines after 10th birthday
- ❌ Missing MenACWY - Negative test: incomplete vaccination

#### **Grades 11-12 (2)**
- ✅ Alternate Valid - 1 dose after 16th birthday
- ✅ Primary Valid - 2 doses meets requirement

#### **College (2)**
- ✅ MMR Valid - 2 doses with proper interval
- ✅ Varicella Valid - 2 doses for college

---

## 📦 Batch Testing

### **Pre-Loaded Batch Scenarios (4)**

#### **1. Mixed Validation**
- **5 patients** with mix of valid/invalid results
- Tests: primary requirement, alternate, exemption, edge cases
- **Expected:** 3 valid, 2 invalid

#### **2. Preschool Batch**
- **10 preschool students** with various compliance levels
- All vaccine types covered
- Tests medical exemptions and multiple requirements

#### **3. Edge Cases Batch**
- **5 critical edge cases**
- Birthday boundaries (on, before)
- Interval boundaries (28 days, 27 days)
- **Expected:** 3 valid, 2 invalid

#### **4. Grades 7-12 Batch**
- **5 middle/high school students**
- Tests Tdap and MenACWY requirements
- Before/after 10th birthday scenarios

### **Batch Test Structure**

```javascript
{
  "state": "MA",
  "schoolYear": "K-6",
  "responseMode": "detailed",
  "patients": [
    {
      "id": "patient-001",
      "birthDate": "2019-01-01",
      "immunization": [...]
    },
    {
      "id": "patient-002",
      "birthDate": "2019-01-01",
      "immunization": [...]
    }
  ]
}
```

---

## ⚙️ API Configuration

### **Default Configuration**

The app connects to `http://localhost:8080` by default.

### **Change API URL (UI)**

1. Start the app
2. Enter new URL in "API Base URL" field
3. All requests will use new URL

### **Change API URL (Environment)**

Edit `.env` file:

```env
REACT_APP_API_URL=https://your-api-server.com
```

Restart the development server.

### **Change API URL (Test Runner)**

```bash
API_URL=https://your-api-server.com npm run batch-test
```

---

## 🛠️ Development

### **Adding New Test Cases**

Edit `src/data/testCases.js`:

```javascript
export const TEST_CASES = {
  // ... existing tests
  
  myNewTest: {
    name: "My New Test",
    category: "K-6",
    description: "Description of what this tests",
    data: {
      id: "my-test-001",
      birthDate: "2019-01-01",
      immunization: [
        { vaccineCode: "DTaP", occurrenceDateTime: "2019-03-01" }
      ]
    },
    params: { 
      state: "MA", 
      schoolYear: "K-6", 
      responseMode: "detailed" 
    },
    expectedResult: { valid: true }
  }
};
```

### **Adding New Batch Scenarios**

Edit `src/data/testCases.js`:

```javascript
export const BATCH_SCENARIOS = {
  // ... existing scenarios
  
  myScenario: {
    name: "My Scenario",
    description: "Description",
    data: {
      state: "MA",
      schoolYear: "K-6",
      responseMode: "detailed",
      patients: [
        { id: "p1", birthDate: "2019-01-01", immunization: [...] },
        { id: "p2", birthDate: "2019-01-01", immunization: [...] }
      ]
    },
    expectedResults: {
      totalPatients: 2,
      validCount: 1,
      invalidCount: 1
    }
  }
};
```

### **Modifying Styles**

Edit `src/styles/App.css`:

```css
/* Change primary color */
.header h1 {
  color: #YOUR_COLOR;
}

/* Change gradient background */
body {
  background: linear-gradient(135deg, #COLOR1 0%, #COLOR2 100%);
}
```

---

## 🚀 Deployment

### **Build for Production**

```bash
# Create optimized production build
npm run build

# Output in /build directory
```

### **Deploy to Static Hosting**

The build folder can be deployed to:
- **Netlify:** Drag & drop `/build` folder
- **Vercel:** Connect Git repo
- **AWS S3:** Upload `/build` contents
- **GitHub Pages:** Use `gh-pages` package

### **Environment Variables for Production**

Create `.env.production`:

```env
REACT_APP_API_URL=https://your-production-api.com
```

---

## 🐛 Troubleshooting

### **Problem: "Failed to fetch" Error**

**Cause:** API server is not running or wrong URL

**Solution:**
1. Start your Spring Boot API: `mvn spring-boot:run`
2. Verify API is running: `curl http://localhost:8080/api/v1/validate/health`
3. Check API URL in the UI matches your server

### **Problem: "Connection refused"**

**Cause:** Server not running on port 8080 or firewall blocking

**Solution:**
1. Check server logs
2. Verify port 8080 is not in use: `lsof -i :8080`
3. Try different port in `.env`

### **Problem: JSON Parse Error**

**Cause:** Invalid JSON in immunizations/exceptions field

**Solution:**
1. Use double quotes `"` not single quotes `'`
2. No trailing commas
3. Use pre-loaded examples first
4. Validate JSON: https://jsonlint.com

### **Problem: CORS Errors**

**Cause:** API not allowing requests from React app

**Solution:**
Add to Spring Boot `@CrossOrigin` annotation:

```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ValidationController {
  // ...
}
```

### **Problem: Batch Tests Failing**

**Cause:** API not handling batch requests

**Solution:**
1. Verify `/api/v1/validate/batch` endpoint exists
2. Check batch request payload structure
3. Review API logs for errors

---

## 📊 Test Coverage

### **By Category**
- Preschool: 5 tests
- K-6: 5 tests  
- Grades 7-10: 2 tests
- Grades 11-12: 2 tests
- College: 2 tests
- **Total Single Tests: 16**

### **By Type**
- Positive tests (should pass): 10
- Negative tests (should fail): 4
- Edge cases (boundary): 5
- Exemptions: 1
- **Batch scenarios: 4 (33 total patients)**

### **Coverage Areas**
- ✅ Date-based conditions (on/after birthday)
- ✅ Interval-based conditions (28 days)
- ✅ Alternate requirements
- ✅ Primary requirements
- ✅ Medical exemptions
- ✅ Religious exemptions
- ✅ Multiple vaccines per grade
- ✅ Edge case boundaries

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

---

## 🎓 Support

For questions or issues:
- Check Troubleshooting section above
- Review test cases in `src/data/testCases.js`
- Verify API is running and healthy
- Check browser console for errors

---

## 🌟 Key Features Summary

| Feature | Description |
|---------|-------------|
| 🎯 **16 Pre-loaded Tests** | All edge cases covered |
| 📦 **4 Batch Scenarios** | 33 total patients |
| 🎨 **Beautiful UI** | Chikara-inspired design |
| 🚀 **One-Click Testing** | No configuration needed |
| 🔧 **Automated Runner** | Command-line batch testing |
| 📱 **Fully Responsive** | Works on all devices |
| ✅ **Production-Ready** | Build and deploy today |

---

## 🎉 Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Start API server: `mvn spring-boot:run`
- [ ] Start React app: `npm start`
- [ ] Click "Health Check" in sidebar
- [ ] Click "🔴 SARAH JOHNSON BUG"
- [ ] Click "Validate Patient"
- [ ] See it fail (correct!)
- [ ] Change date to `2023-01-01`
- [ ] See it pass (correct!)
- [ ] Run batch tests: `npm run batch-test`
- [ ] Build for production: `npm run build`

**You're all set!** 🚀

---

*Built for Saakad's 2026 MA Immunization Validator Project*  
*Powered by Massachusetts Department of Public Health Guidelines*
