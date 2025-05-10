# 🛡️ Cyber Threat Intelligence (CTI) Dashboard

The **CTI Dashboard** is a web-based threat intelligence visualization tool that fetches real-time data from the **AlienVault OTX** (Open Threat Exchange) API. It provides normalized, filterable, and interactive insights into threat indicators such as IPs, URLs, domains, and file hashes.

---

## 🚀 Features

- 🔎 **Filterable Indicators** – Filter by type, value, or creation date  
- 📋 **Indicator Table** – View enriched threat data in a structured, scrollable table  
- 📊 **Bar Chart** – Visualize distribution of indicator types  
- 📈 **Line Chart** – Analyze indicator trends over time  
- 🌐 **Responsive UI** – Optimized for desktop and wide screens  
- ⚙️ **API Key Protection** – Uses environment variable for OTX key security  

---

## 🧱 Tech Stack

- **Frontend:** React.js  
- **Charts:** Recharts  
- **Date Picker:** react-datepicker  
- **Dropdowns:** react-select  
- **HTTP Client:** Axios  
- **Styling:** Custom CSS with modern UI components  

---

## 📦 Project Structure

```
.
├── public/
├── src/
│   ├── components/
│   │   ├── OTXFetcher.js       // Main logic for fetching, normalizing and filtering OTX data
│   │   └── Dashboard.js        // Chart and table visualizations
│   ├── App.js                  // Main app layout
│   ├── index.js                // ReactDOM rendering
│   └── index.css               // Global styles
├── .env                        // Stores your OTX API key
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cti-dashboard.git
cd cti-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

Create a `.env` file in the root of the project and add your OTX key:

```
REACT_APP_OTX_API_KEY=your_otx_api_key_here
```

### 4. Run the app

```bash
npm start
```

The dashboard will open at `http://localhost:3000`.

---

## 📌 TODO / Improvements

- Add AbuseIPDB integration 🔍  
- Export filtered data as CSV 📥  
- Add dark mode toggle 🌙  
- Paginate the table for better performance 🔄

---

## 📝 License

Built by Kenish Raghu
