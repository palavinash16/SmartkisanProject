// SmartKisan Enterprise Documentation & Architecture Deliverables

export const SRS_DOCUMENT = {
  title: "Software Requirement Specification (SRS) v1.0",
  project: "SmartKisan - AI-Powered Farmer Decision Intelligence Platform",
  author: "Chief Technology Officer & Lead Solutions Architect",
  sections: [
    {
      heading: "1. Scope & System Vision",
      content: `SmartKisan is an enterprise-grade AI decision intelligence system designed for 120+ million small and marginal Indian farmers. The platform acts as a digital agronomist and profit advisor, answering crucial questions regarding crop selection, risk optimization, multi-dialect voice interaction, scheme intelligence, and crop disease diagnosis.`
    },
    {
      heading: "2. Functional Requirements by Module",
      content: `
- **FR-1 (Gap Crop Engine)**: The system shall calculate multi-constraint optimization for 30–90 day land gaps, returning top 3 crop recommendations with profit estimates, investment breakdown, and risk index.
- **FR-2 (Profit Predictor Engine)**: The system shall compare XGBoost, Random Forest, LightGBM, and Deep Neural Networks to forecast yield (Quintals/acre), cost breakdown, and net profit with >90% confidence bounds.
- **FR-3 (AI Voice Assistant)**: The system shall process audio input in 6 regional Indian languages (Hindi, Bhojpuri, Awadhi, Punjabi, Marathi, Bengali) using STT → LLM Context Injector → TTS with <1.8s round-trip latency.
- **FR-4 (Government Scheme Intelligence Engine)**: The system shall execute a hybrid Rule Engine + PGVector RAG model to match farmer attributes against 1,200+ government scheme PDF documents.
- **FR-5 (Weather Decision Engine)**: The system shall convert raw meteorological forecast streams into actionable farming advisories (spray warnings, irrigation schedules, harvest timing).
- **FR-6 (Disease Detection Engine)**: The system shall accept leaf images via web/mobile and return disease classification using EfficientNet-B4 CNN with bounding box overlays, severity scores, and treatment plans.
`
    },
    {
      heading: "3. Non-Functional Requirements",
      content: `
- **Performance**: API response times < 250ms for relational queries; voice latency < 1.8 seconds; CNN image inference < 600ms.
- **Scalability**: Designed to handle 50,000 requests per second during peak sowing seasons using Kubernetes HPA & Redis cache.
- **Security**: OAuth2 with JWT tokens, AES-256 encryption at rest, TLS 1.3 in transit, strict RBAC, and PIPEDA/DPDP Act 2023 compliance for farmer privacy.
`
    }
  ]
};

export const DATABASE_SCHEMA_SQL = `
-- SmartKisan Enterprise PostgreSQL + PostGIS Database Schema (DDL)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Farmers Master Table
CREATE TABLE farmers (
    farmer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'hi',
    state VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    sub_district VARCHAR(50),
    village VARCHAR(50),
    farmer_category VARCHAR(20) CHECK (farmer_category IN ('SMALL', 'MARGINAL', 'MEDIUM', 'LARGE')),
    annual_income NUMERIC(12, 2),
    location GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Land Holdings Table
CREATE TABLE land_holdings (
    land_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(farmer_id) ON DELETE CASCADE,
    land_area_acres NUMERIC(8, 2) NOT NULL,
    soil_type VARCHAR(30) NOT NULL, -- Alluvial, Black, Loamy, etc.
    soil_ph NUMERIC(3, 1),
    nitrogen_level NUMERIC(6, 2),
    phosphorus_level NUMERIC(6, 2),
    potassium_level NUMERIC(6, 2),
    irrigation_type VARCHAR(30) CHECK (irrigation_type IN ('CANAL', 'BOREWELL', 'RAIN_FED', 'DRIP', 'SPRINKLER')),
    boundary_polygon GEOMETRY(Polygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Gap Crop Recommendations Table
CREATE TABLE gap_crop_recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(farmer_id),
    land_id UUID REFERENCES land_holdings(land_id),
    available_days INT NOT NULL,
    previous_crop VARCHAR(50),
    recommended_crop VARCHAR(50) NOT NULL,
    estimated_investment NUMERIC(10, 2),
    estimated_revenue NUMERIC(10, 2),
    estimated_profit NUMERIC(10, 2),
    risk_score INT CHECK (risk_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Disease Reports Table
CREATE TABLE disease_reports (
    report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(farmer_id),
    crop_type VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    disease_detected VARCHAR(100) NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    severity_level VARCHAR(20),
    organic_treatment TEXT,
    chemical_treatment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-performance spatial & text queries
CREATE INDEX idx_farmers_location ON farmers USING GIST(location);
CREATE INDEX idx_land_boundary ON land_holdings USING GIST(boundary_polygon);
CREATE INDEX idx_farmers_phone ON farmers(phone_number);
`;

export const OPENAPI_SPEC_YAML = `
openapi: 3.0.3
info:
  title: SmartKisan Core Microservices API
  version: 1.0.0
  description: Production REST APIs for SmartKisan AI Farmer Intelligence Platform.
paths:
  /api/v1/recommendations/gap-crop:
    post:
      summary: Generate Gap Crop Recommendations
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                state: { type: string, example: "Uttar Pradesh" }
                district: { type: string, example: "Gorakhpur" }
                available_days: { type: integer, example: 60 }
                soil_type: { type: string, example: "Alluvial" }
                irrigation_status: { type: string, example: "BOREWELL" }
                land_size_acres: { type: number, example: 2.5 }
      responses:
        '200':
          description: Successful AI Recommendation
          content:
            application/json:
              schema:
                type: object
                properties:
                  top_crop: { type: string, example: "Summer Moong" }
                  expected_profit: { type: number, example: 49075 }
                  risk_index: { type: integer, example: 18 }

  /api/v1/diseases/diagnose:
    post:
      summary: Computer Vision Plant Disease Scanner
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file: { type: string, format: binary }
                crop_hint: { type: string, example: "Tomato" }
      responses:
        '200':
          description: Diagnosis Complete
          content:
            application/json:
              schema:
                type: object
                properties:
                  disease: { type: string, example: "Early Blight (Alternaria solani)" }
                  confidence: { type: number, example: 98.1 }
                  remedy_organic: { type: string }
                  remedy_chemical: { type: string }
`;

export const ROADMAP_AND_SCALING = {
  roadmap: [
    { phase: "Month 1-2", focus: "Core Architecture & Data Ingestion", details: "Set up PostgreSQL PostGIS, ingestion pipelines for IMD weather and Agmarknet Mandi rates, build synthetic soil dataset." },
    { phase: "Month 3-4", focus: "ML Models & Voice Assistant", details: "Train XGBoost yield predictor, fine-tune EfficientNet-B4 disease CNN, deploy Whisper + Gemini RAG voice pipeline." },
    { phase: "Month 5", focus: "Frontend Dashboard & Pilot Testing", details: "Deploy React web app & PWA, pilot with 5,000 smallholder farmers in UP and Bihar." },
    { phase: "Month 6+", focus: "Production Scaling & Monetization", details: "Scale Kubernetes clusters to 50k QPS, launch B2B Agritech API licensing & FPO subscription model." }
  ],
  monetization: [
    { title: "Freemium B2C for Farmers", desc: "Core voice assistant, weather advisories, and basic scheme matching are 100% FREE for farmers." },
    { title: "B2B Agritech API Licensing", desc: "Monetize crop disease detection APIs, hyper-local micro-weather advisories, and yield prediction models for Seed, Fertilizer, and Crop Insurance companies." },
    { title: "FPO & Co-operative Enterprise SaaS", desc: "Subscribed dashboard for Farmer Producer Organizations (FPOs) to track aggregated yield, bulk buying, and direct market linkage." }
  ]
};
