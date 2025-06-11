# ☀️ Solar Power Plant Site Selection Optimizer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A full-stack tool using Particle Swarm Optimization (PSO) to identify optimal locations for solar power plants across Tamil Nadu. By evaluating solar irradiance, land cost, and infrastructure distance, this app helps maximize energy potential while minimizing cost and logistic constraints.

---

## 📌 Key Features

- 🌞 Location recommendation using Particle Swarm Optimization (PSO)
- 📍 Upload location dataset with latitude, longitude & factors
- ⚖️ Weight-adjustable scoring for irradiance, land cost, infra distance
- 📊 Real-time optimization with fitness score visualization
- 🗺️ Interactive Leaflet map with heatmap & site plotting
- 📥 Download selected optimal site data as CSV
- 🖥️ Full-stack app with React frontend and FastAPI backend

---

## 🛠️ Tech Stack

### Languages:
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

### Frontend:
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)

### Backend:
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)

### Optimization Algorithm:
![PSO](https://img.shields.io/badge/PSO-Optimization-orange?style=flat)

---

## 📁 Project Structure

| File/Folder                  | Description                                      |
|------------------------------|--------------------------------------------------|
| `solar-pso-frontend/`        | React frontend with map view & form inputs       |
| `solar-pso-backend/`         | FastAPI backend for PSO logic & data API         |
| `datasets/sample_sites.csv`  | Sample input dataset                             |
| `outputs/`                   | Exported optimized CSV files                     |
| `main.py` (inside backend)   | API logic & PSO integration                      |
| `app.jsx` (inside frontend)  | Main UI component                               |
| `pso.py`                     | Core PSO algorithm with fitness calculation      |
| `requirements.txt`           | Backend dependencies                             |
| `README.md`                  | Documentation file                               |

---

## 🚀 How to Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rog-mithun/Solar-Site-Optimizer.git
   cd solar-site-optimizer

2. **Start the backend (FastAPI):**
   ```bash
   cd solar-pso-backend
   pip install -r requirements.txt
   uvicorn main:app --reload

3. **Start the frontend (React):**
   ```bash
   cd ../solar-pso-frontend
   npm install
   npm start

---

## 🧪 Sample Dataset
- ![Dataset](solar-pso-backend/uploads/tamilnadu_solar_sites.csv)
- Contains: Latitude, Longitude, Irradiance, Land Cost, Infrastructure Distance
- Used as default input for testing site selection

---

## 📂 Demo & Output Samples

- ![UI](ui.png)
- ![Output](output.png)

---

## 📖 License

This project is licensed under the [MIT License](LICENSE) © 2025 Mithunsankar S.



