# Virtual Herbal Garden (AYUSH)

Starter architecture for a full-stack web app that showcases medicinal plants from **Ayurveda, Yoga & Naturopathy, Unani, Siddha, and Homeopathy**, with a simple AI chatbot for herbal queries.

## High-level structure
```
/workspace/Kailas
├── backend
│   ├── package.json
│   ├── .env.example
│   └── src
│       ├── config
│       ├── controllers
│       ├── data
│       ├── models
│       ├── routes
│       ├── services
│       └── server.js
└── frontend
    ├── package.json
    └── src
        ├── components
        ├── services
        ├── App.jsx
        ├── main.jsx
        └── styles.css
```

## Key files
- **backend/src/server.js**: Express app bootstrap with routes, CORS, and JSON parsing.
- **backend/src/config/db.js**: MongoDB connection helper.
- **backend/src/models/Plant.js**: Mongoose model for medicinal plants.
- **backend/src/controllers/plantController.js**: Read-only endpoints for listing and fetching plant details.
- **backend/src/controllers/chatbotController.js**: Minimal OpenAI-backed chat endpoint.
- **backend/src/services/openaiClient.js**: Small wrapper for OpenAI SDK.
- **backend/src/data/seedPlants.js**: Seed data for initial plants across AYUSH systems.
- **frontend/src/App.jsx**: Main layout with list, detail, and chatbot sections.
- **frontend/src/components/**: Reusable UI modules (PlantList, PlantDetail, Chatbot).
- **frontend/src/services/api.js**: Frontend API client for backend endpoints.

## Getting started
1. Configure backend environment variables in `backend/.env` (see `.env.example`).
2. Install dependencies and run servers:
   - Backend: `npm install` then `npm run dev` from `backend/`.
   - Frontend: `npm install` then `npm run dev` from `frontend/`.

> Note: This is a starter scaffold. Add authentication, admin CRUD, and advanced AI flows as you grow.
