import React, { useState } from 'react';
import { PLANT_DISEASES_DB } from '../data/mockData';
import { Scan, Upload, ShieldCheck, AlertOctagon, Sparkles, RefreshCw, CheckCircle2, Leaf } from 'lucide-react';

export default function DiseaseDetector() {
  const [selectedDisease, setSelectedDisease] = useState(PLANT_DISEASES_DB[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleSimulateScan = (diseaseObj) => {
    setIsAnalyzing(true);
    setSelectedDisease(diseaseObj);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 2500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', background: 'linear-gradient(135deg, rgba(14,34,22,0.9) 0%, rgba(6,20,13,0.9) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '10px', color: '#f87171' }}>
            <Scan size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Module 6: AI Leaf Disease Scanner</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              EfficientNet-B4 Computer Vision diagnostic pipeline with organic bio-control & chemical treatment recommendations.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem' }}>
        
        {/* Leaf Upload Dropzone & Sample Images */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Upload size={18} color="#f87171" /> Upload Crop Leaf Image
          </h3>

          {/* Interactive Upload Box */}
          <label style={{ 
            border: '2px dashed var(--border-glow)', 
            borderRadius: 'var(--radius-md)', 
            padding: '2rem 1rem', 
            textAlign: 'center', 
            cursor: 'pointer',
            background: 'rgba(6, 20, 13, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'var(--transition)'
          }}>
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '0.85rem', borderRadius: '50%', color: '#f87171' }}>
              <Scan size={32} />
            </div>
            <div>
              <strong style={{ fontSize: '0.95rem', color: '#ffffff', display: 'block' }}>
                Drop image here or click to browse
              </strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supports JPG, PNG, WEBP (Max 10MB)</span>
            </div>
          </label>

          {/* Sample Disease Trigger Buttons */}
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              Test Sample Field Scans:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PLANT_DISEASES_DB.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSimulateScan(d)}
                  className="btn btn-outline"
                  style={{
                    justifyContent: 'flex-start',
                    fontSize: '0.825rem',
                    padding: '0.5rem 0.75rem',
                    borderColor: selectedDisease.id === d.id ? '#f87171' : 'var(--border-color)',
                    background: selectedDisease.id === d.id ? 'rgba(239, 68, 68, 0.12)' : 'transparent'
                  }}
                >
                  <AlertOctagon size={14} color="#f87171" />
                  <span><strong>{d.crop}:</strong> {d.diseaseName}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Diagnostic Output View */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
          
          {isAnalyzing && (
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'rgba(7, 19, 12, 0.9)', 
              backdropFilter: 'blur(8px)', 
              borderRadius: 'var(--radius-md)', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 10,
              gap: '1rem' 
            }}>
              <RefreshCw size={40} color="var(--primary)" className="pulse-active" />
              <div style={{ textAlign: 'center' }}>
                <strong style={{ fontSize: '1.2rem', color: '#fff', display: 'block' }}>
                  Running EfficientNet-B4 CNN Inference...
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Extracting feature maps & spatial lesion metrics</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <div>
              <span className="badge badge-danger" style={{ marginBottom: '0.35rem' }}>Diagnosed Disease</span>
              <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>{selectedDisease.diseaseName}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Confidence</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'Outfit' }}>
                {selectedDisease.confidence}%
              </div>
            </div>
          </div>

          {/* Leaf Bounding Box Scanner Simulation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'center', background: 'rgba(6, 20, 13, 0.7)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ position: 'relative', width: '100%', height: '120px', borderRadius: '8px', background: 'linear-gradient(135deg, #143821 0%, #07150c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <span style={{ fontSize: '3rem' }}>🍃</span>
              {/* Bounding box visual overlay */}
              <div style={{ position: 'absolute', border: '2px dashed #f87171', width: '60px', height: '60px', borderRadius: '4px', background: 'rgba(239,68,68,0.2)' }} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Affected Crop: <strong>{selectedDisease.crop}</strong></span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.2rem' }}>Severity Level: <strong style={{ color: '#f87171' }}>{selectedDisease.severity}</strong></span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.4rem', lineHeight: 1.4 }}>
                <strong>Key Symptoms:</strong> {selectedDisease.symptoms}
              </p>
            </div>
          </div>

          {/* Treatment Tabs: Organic vs Chemical */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
            {/* Organic Remedy */}
            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <Leaf size={16} /> Organic Bio-Treatment (Recommended)
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {selectedDisease.organicRemedy}
              </p>
            </div>

            {/* Chemical Remedy */}
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <AlertOctagon size={16} /> Chemical Fungicide / Treatment
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {selectedDisease.chemicalTreatment}
              </p>
            </div>

          </div>

          {/* Preventive Measures */}
          <div style={{ background: 'rgba(6, 20, 13, 0.8)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: '#34d399' }}>🛡️ Long-term Preventive Advisory:</strong> {selectedDisease.preventiveTips}
          </div>

        </div>

      </div>
    </div>
  );
}
