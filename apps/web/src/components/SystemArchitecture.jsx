import React, { useState } from 'react';
import { SRS_DOCUMENT, DATABASE_SCHEMA_SQL, OPENAPI_SPEC_YAML, ROADMAP_AND_SCALING } from '../data/docsData';
import { Cpu, Database, Code2, Rocket, ShieldCheck, DollarSign, Layers } from 'lucide-react';

export default function SystemArchitecture() {
  const [activeDocTab, setActiveDocTab] = useState('srs');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', background: 'linear-gradient(135deg, rgba(14,34,22,0.9) 0%, rgba(6,20,13,0.9) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '10px', color: '#34d399' }}>
            <Cpu size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>System Architecture & Software Specifications</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Complete CTO deliverables: SRS, PostgreSQL PostGIS Database Schemas, OpenAPI 3.0 Specs, 6-Month Roadmap, and Scaling Strategy.
            </p>
          </div>
        </div>
      </div>

      {/* Specification Sub-Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
        {[
          { id: 'srs', label: '1. SRS Document', icon: Layers },
          { id: 'db', label: '2. Database Schemas (DDL)', icon: Database },
          { id: 'api', label: '3. REST API Specs (OpenAPI)', icon: Code2 },
          { id: 'roadmap', label: '4. 6-Month Roadmap & Scaling', icon: Rocket }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDocTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDocTab(tab.id)}
              className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab 1: SRS Document */}
      {activeDocTab === 'srs' && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <span className="badge badge-success">Production Grade Deliverable</span>
            <h3 style={{ fontSize: '1.4rem', marginTop: '0.25rem' }}>{SRS_DOCUMENT.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Author: {SRS_DOCUMENT.author}</p>
          </div>

          {SRS_DOCUMENT.sections.map((sec, idx) => (
            <div key={idx} style={{ background: 'rgba(6, 20, 13, 0.7)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{sec.heading}</h4>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {sec.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-Tab 2: Database Schemas DDL */}
      {activeDocTab === 'db' && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database color="var(--primary)" /> PostgreSQL 16 + PostGIS Spatial Schema DDL
            </h3>
            <span className="badge badge-info">Spatial Indexes Enabled</span>
          </div>

          <pre style={{ 
            background: '#040d08', 
            color: '#34d399', 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-color)',
            fontFamily: 'Consolas, monospace',
            fontSize: '0.85rem',
            overflowX: 'auto',
            lineHeight: 1.5
          }}>
            {DATABASE_SCHEMA_SQL}
          </pre>
        </div>
      )}

      {/* Sub-Tab 3: REST API Specs */}
      {activeDocTab === 'api' && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code2 color="#60a5fa" /> OpenAPI 3.0 REST API Specifications
            </h3>
            <span className="badge badge-success">FastAPI Framework Compatible</span>
          </div>

          <pre style={{ 
            background: '#040d08', 
            color: '#60a5fa', 
            padding: '1.25rem', 
            borderRadius: 'var(--radius-sm)', 
            border: '1px solid var(--border-color)',
            fontFamily: 'Consolas, monospace',
            fontSize: '0.85rem',
            overflowX: 'auto',
            lineHeight: 1.5
          }}>
            {OPENAPI_SPEC_YAML}
          </pre>
        </div>
      )}

      {/* Sub-Tab 4: Roadmap & Monetization */}
      {activeDocTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 6-Month Agile Development Plan */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Rocket color="var(--accent-gold)" /> 6-Month Agile Product Roadmap
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {ROADMAP_AND_SCALING.roadmap.map((item, idx) => (
                <div key={idx} style={{ background: 'rgba(6, 20, 13, 0.7)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <span className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>{item.phase}</span>
                  <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.35rem' }}>{item.focus}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Startup Monetization & Scaling Strategy */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign color="var(--primary)" /> Monetization & B2B Scaling Strategy
            </h3>

            <div className="grid-cols-3">
              {ROADMAP_AND_SCALING.monetization.map((m, idx) => (
                <div key={idx} style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#34d399', marginBottom: '0.4rem' }}>{m.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
