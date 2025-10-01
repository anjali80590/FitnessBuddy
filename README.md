# 🏋️‍♀️ Fitness Dashboard  
### https://img.shields.io/badge/Live-Demo-green)](https://fitnesssbuddyy.netlify.app
  

### 📖 Introduction  
The **Fitness Dashboard** is a personal fitness tracking application that helps users **manage workouts, monitor BMI, set fitness goals, and track progress over time**. It also includes **Dark Mode** and **Responsive Design** for the best user experience.  

---

### 🧩 Project Type
**Fullstack**  
- **Frontend:** React, Redux, TailwindCSS  
- **Backend:** Firebase Firestore  
- **Authentication:** Firebase Auth   

---

### 🌐 Deployed App
- **Frontend**: [https://fitnesssbuddyy.netlify.app](https://fitnesssbuddyy.netlify.app)  
- **Backend**: Firebase Firestore  
- **Database**: Firebase Firestore  

---

### ✅ Features  
- 🔐 **User Authentication** (Firebase)  
- 👤 **Profile Management**  
  - Height, Weight, Target Weight  
  - Weekly Workout Goal  
  - **BMI Calculation** (Current & Target)  
- 🏃 **Workout Tracking**  
  - Add, Edit, Delete Workouts  
  - Calculate calories burned  
- 📊 **Weekly Progress Bar**  
- 🔍 **Search & Filter Workouts**  
- 🔗 **Share Progress** (Sharable Link)  
- 🌙 **Dark Mode** support  
- 🔄 Real-time updates with Firestore  
- 📱 Fully **Responsive Design**  
- 🔔 **Toast Notifications** for actions  

---

### Directory Strcuture 📁
```
fitnessbuddy/
├── node_modules/
├── public/
├── src/
│   ├── components/           # Reusable UI components
│   ├── context/              # Global context/state providers
│   ├── pages/                # All route-level pages
│   ├── redux/                # Redux store and slices
│   ├── App.css               # App-level styles
│   ├── App.js                # Main App component
│   ├── App.test.js           # App test file
│   ├── firebase.js           # Firebase configuration
│   ├── index.css             # Global CSS
│   ├── index.js              # Entry point
│   ├── logo.svg              # App logo
│   ├── reportWebVitals.js    # Performance measuring
│   ├── setupTests.js         # Jest test setup
├── package.json
├── README.md
```

---


### 🧠 Design Decisions / Assumptions

- Firebase is used to handle user authentication and real-time data syncing.
- TailwindCSS is used for rapid, responsive, and consistent UI development.
- BMI is calculated using the standard formula and displayed in the profile.
- Weekly progress is shown via a dynamic progress bar based on goal.
- Calories burned are estimated based on predefined workout types & MET values.
- App is optimized for mobile-first responsiveness and user experience.

---

### ⚡ Installation & Getting Started  

### ✅ 1. Clone the Repository  
```bash
git clone https://github.com/anjali80590/Fitnessbuddy.git
cd Fitnessbuddy
```

### ✅ 2. Install Dependencies
```bash 
npm install 
```

### ✅ 3. Start the Development Server
```bash 
npm start 
```
