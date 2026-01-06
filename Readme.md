# Timesheet Management System

A full-stack Timesheet Management application built with **React**, **Node.js (Express)**, and **MongoDB**. This system allows users to log daily work hours, import data from Excel, and view/filter records with advanced pagination.

## 🚀 Features

### Task 1: Timesheet Entry
- **Inline Editing Grid:** Add and edit records directly in a nested grid.
- **Validation:** Strict validation to ensure total hours are between **5 and 8 hours**.
- **Excel Import:** Bulk upload records using XLSX/CSV files.
- **Sample Download:** One-click download of the required Excel template for imports.
- **Restrict Future Dates:** Date picker prevents selection of dates beyond today.

### Task 2: Data Viewer & Export
- **Advanced Filtering:** Filter by Employee Name, Company, and Date Range.
- **Pagination:** Efficient lazy loading of data from the backend using `meta` (totalRecords, totalPages).
- **Export Capabilities:** Export filtered data to **CSV** or **Excel** formats.
- **Responsive UI:** Built with **Tailwind CSS** and **Lucide Icons**.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Lucide React (Icons)
- React Hot Toast (Notifications)
- XLSX (Excel Processing)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- Multer (File Uploads)
- Dotenv (Environment Management)

---

## 📦 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/timesheet-system.git
cd timesheet-system


###  Backend Setup

1. Navigate to the backend folder (if applicable). 

2. Install dependencies:
   npm install

3. Create a .env file and add your configuration
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string

4. Start the server:


## Frontend Setup

1. Navigate to the frontend folder (if applicable). 

2. Install dependencies:
   npm install


3. Create a .env file and add your configuration
   REACT_APP_API_URL =  'Your_api_url';

4. Start the application
   npm start

