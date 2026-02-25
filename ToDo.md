# ToDo — Known Issues & Improvements

> A running list of bugs, enhancements, and technical debt to address.

---

## 🐛 Bugs

### 1. Organization Switching Causes Intermittent 404

- **Where:** Employer Dashboard — switching between organizations
- **Steps to reproduce:**
  1. Sign in and navigate to the Employer Dashboard.
  2. Switch to a different organization from the sidebar.
  3. The page immediately shows a **404 Not Found** error.
  4. Navigate back to the home page and re-select the organization — it now loads correctly.
- **Expected:** Switching organizations should seamlessly load the selected organization's dashboard without any 404 error.
- **Suspected cause:** The route or middleware may not be re-evaluating the active organization context fast enough, leading to a stale or missing `orgId` during the transition.
- **Priority:** High

---

## ✨ Enhancements

_No enhancements logged yet._

---

## 🧹 Technical Debt

_No technical debt items logged yet._
