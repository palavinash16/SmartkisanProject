import React from 'react';
import { 
  Sprout, 
  Store, 
  CloudSun, 
  BookOpen, 
  Calculator, 
  Megaphone, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Sun, 
  Droplets, 
  Wind,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function PWAHome({ farmerProfile, setActiveTab }) {
  const farmerName = farmerProfile?.farmerName || 'राम सिंह';
  const district = farmerProfile?.district || 'गाज़ियाबाद';
  const state = farmerProfile?.state || 'उत्तर प्रदेश';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '5rem' }}>
      
      {/* 1. Hero Greeting Banner (Photo Background matching Screenshot) */}
      <div style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(5,75,45,0.75) 100%), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '1.75rem 1.25rem 1.25rem 1.25rem'
      }}>
        
        {/* Top Text overlay */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Hind, Noto Sans Devanagari, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.6)', marginBottom: '0.2rem' }}>
            नमस्ते {farmerName} जी! 👋
          </h2>
          <p style={{ fontSize: '1rem', color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.5)', margin: 0, fontWeight: 500 }}>
            आज का दिन शुभ हो!
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', color: '#ffffff', fontSize: '0.8rem', marginTop: '0.5rem', border: '1px solid rgba(255,255,255,0.3)' }}>
            <MapPin size={14} color="#34d399" />
            <span>{district}, {state}</span>
          </div>
        </div>

        {/* Floating Weather Summary Card inside Hero */}
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CloudSun size={40} color="#f59e0b" />
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, fontFamily: 'Outfit' }}>
                  32°C
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>हल्की धूप</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
              <div>
                <span>अधिकतम</span>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.85rem' }}>34°C</strong>
              </div>
              <div>
                <span>न्यूनतम</span>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.85rem' }}>24°C</strong>
              </div>
              <div>
                <span>वर्षा की संभावना</span>
                <strong style={{ display: 'block', color: '#0284c7', fontSize: '0.85rem' }}>20%</strong>
              </div>
              <div>
                <span>हवा</span>
                <strong style={{ display: 'block', color: '#059669', fontSize: '0.85rem' }}>12 km/h</strong>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('weather-advisory')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#059669',
                fontSize: '0.825rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
            >
              <span>पूरा मौसम देखें</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* 2. Quick Action Grid (6 Soft Pastel Cards matching Screenshot) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '0.75rem'
      }}>
        
        {/* Card 1: Gap Crop Engine (Light Green) */}
        <button 
          onClick={() => setActiveTab('gap-crop')}
          style={{
            background: '#e6f4ea',
            border: '1px solid #c8e6c9',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ background: '#ffffff', padding: '0.65rem', borderRadius: '14px', color: '#059669', boxShadow: '0 2px 8px rgba(5,150,105,0.15)' }}>
            <Sprout size={24} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>गैप फसल सुझाव</span>
        </button>

        {/* Card 2: Mandi Live Prices (Light Blue) */}
        <button 
          onClick={() => setActiveTab('mandi-prices')}
          style={{
            background: '#e0f2fe',
            border: '1px solid #bae6fd',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ background: '#ffffff', padding: '0.65rem', borderRadius: '14px', color: '#0284c7', boxShadow: '0 2px 8px rgba(2,132,199,0.15)' }}>
            <Store size={24} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>मंडी भाव देखें</span>
        </button>

        {/* Card 3: Weather Advisory (Light Peach/Orange) */}
        <button 
          onClick={() => setActiveTab('weather-advisory')}
          style={{
            background: '#ffedd5',
            border: '1px solid #fed7aa',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ background: '#ffffff', padding: '0.65rem', borderRadius: '14px', color: '#ea580c', boxShadow: '0 2px 8px rgba(234,88,12,0.15)' }}>
            <CloudSun size={24} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>मौसम जानकारी</span>
        </button>

        {/* Card 4: Crop School (Light Purple) */}
        <button 
          onClick={() => setActiveTab('crop-school')}
          style={{
            background: '#f3e8ff',
            border: '1px solid #e9d5ff',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ background: '#ffffff', padding: '0.65rem', borderRadius: '14px', color: '#9333ea', boxShadow: '0 2px 8px rgba(147,51,234,0.15)' }}>
            <BookOpen size={24} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>फसल स्कूल</span>
        </button>

        {/* Card 5: Profit Predictor / Cost Calculator (Light Teal) */}
        <button 
          onClick={() => setActiveTab('my-field')}
          style={{
            background: '#ccfbf1',
            border: '1px solid #99f6e4',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ background: '#ffffff', padding: '0.65rem', borderRadius: '14px', color: '#0d9488', boxShadow: '0 2px 8px rgba(13,148,136,0.15)' }}>
            <Calculator size={24} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>लागत कैलकुलेटर</span>
        </button>

        {/* Card 6: Agri Advisory (Light Lime) */}
        <button 
          onClick={() => setActiveTab('weather-advisory')}
          style={{
            background: '#ecfccb',
            border: '1px solid #d9f99d',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ background: '#ffffff', padding: '0.65rem', borderRadius: '14px', color: '#65a30d', boxShadow: '0 2px 8px rgba(101,163,13,0.15)' }}>
            <Megaphone size={24} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>कृषि सलाह</span>
        </button>

      </div>

      {/* 3. Grid Row: Today's Mandi Prices & Weather Forecast Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        
        {/* Today's Mandi Prices Box */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Store size={20} color="#059669" /> आज के मंडी भाव
            </h3>
            <button 
              onClick={() => setActiveTab('mandi-prices')}
              style={{ background: 'transparent', border: 'none', color: '#059669', fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <span>और देखें</span> <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="#059669" />
            <span>{district}, {state} (अंतिम अपडेट: 14 Aug 2026)</span>
          </div>

          {/* Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.2fr 1fr', fontSize: '0.75rem', color: '#64748b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.35rem', fontWeight: 600 }}>
              <span>फसल</span>
              <span>मंडी</span>
              <span style={{ textAlign: 'right' }}>नवीनतम भाव (₹/क्विंटल)</span>
              <span style={{ textAlign: 'right' }}>अपडेटेड</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.2fr 1fr', fontSize: '0.875rem', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px #f1f5f9 solid' }}>
              <span style={{ color: '#0f172a', fontWeight: 700 }}>🌾 गेहूं</span>
              <span style={{ color: '#64748b' }}>गाज़ियाबाद APMC</span>
              <strong style={{ textAlign: 'right', color: '#059669', fontFamily: 'Outfit' }}>2,350</strong>
              <span style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>14 Aug</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.2fr 1fr', fontSize: '0.875rem', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px #f1f5f9 solid' }}>
              <span style={{ color: '#0f172a', fontWeight: 700 }}>🫘 मूंग (हरा)</span>
              <span style={{ color: '#64748b' }}>हापुड़ APMC</span>
              <strong style={{ textAlign: 'right', color: '#059669', fontFamily: 'Outfit' }}>6,950</strong>
              <span style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>14 Aug</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.2fr 1fr', fontSize: '0.875rem', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px #f1f5f9 solid' }}>
              <span style={{ color: '#0f172a', fontWeight: 700 }}>🧆 चना</span>
              <span style={{ color: '#64748b' }}>मेरठ APMC</span>
              <strong style={{ textAlign: 'right', color: '#059669', fontFamily: 'Outfit' }}>5,480</strong>
              <span style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>13 Aug</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 1.2fr 1fr', fontSize: '0.875rem', alignItems: 'center', padding: '0.45rem 0' }}>
              <span style={{ color: '#0f172a', fontWeight: 700 }}>🌾 धान (साधारण)</span>
              <span style={{ color: '#64748b' }}>हापुड़ APMC</span>
              <strong style={{ textAlign: 'right', color: '#059669', fontFamily: 'Outfit' }}>2,210</strong>
              <span style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>14 Aug</span>
            </div>
          </div>

          <button 
            className="btn btn-outline" 
            style={{ width: '100%', fontSize: '0.875rem' }}
            onClick={() => setActiveTab('mandi-prices')}
          >
            सभी मंडी भाव देखें
          </button>
        </div>

        {/* Weather Forecast Box */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CloudSun size={20} color="#0284c7" /> मौसम पूर्वानुमान
            </h3>
            <button 
              onClick={() => setActiveTab('weather-advisory')}
              style={{ background: 'transparent', border: 'none', color: '#059669', fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <span>और देखें</span> <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CloudSun size={38} color="#f59e0b" />
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>32°C</div>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>हल्की धूप</span>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              <div>अधिकतम: <strong style={{ color: '#0f172a' }}>34°C</strong></div>
              <div>न्यूनतम: <strong style={{ color: '#0f172a' }}>24°C</strong></div>
              <div>आर्द्रता: <strong style={{ color: '#0284c7' }}>58%</strong></div>
            </div>
          </div>

          {/* 5 Day Forecast Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#f8faf8', padding: '0.6rem 0.25rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>शनि</div>
              <CloudSun size={18} color="#f59e0b" style={{ margin: '0.25rem auto' }} />
              <strong style={{ fontSize: '0.75rem', color: '#0f172a', display: 'block' }}>34°/24°</strong>
            </div>

            <div style={{ background: '#f8faf8', padding: '0.6rem 0.25rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>रवि</div>
              <CloudSun size={18} color="#f59e0b" style={{ margin: '0.25rem auto' }} />
              <strong style={{ fontSize: '0.75rem', color: '#0f172a', display: 'block' }}>33°/24°</strong>
            </div>

            <div style={{ background: '#f8faf8', padding: '0.6rem 0.25rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>सोम</div>
              <CloudSun size={18} color="#f59e0b" style={{ margin: '0.25rem auto' }} />
              <strong style={{ fontSize: '0.75rem', color: '#0f172a', display: 'block' }}>32°/24°</strong>
            </div>

            <div style={{ background: '#f8faf8', padding: '0.6rem 0.25rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>मंगल</div>
              <CloudSun size={18} color="#f59e0b" style={{ margin: '0.25rem auto' }} />
              <strong style={{ fontSize: '0.75rem', color: '#0f172a', display: 'block' }}>31°/23°</strong>
            </div>

            <div style={{ background: '#f8faf8', padding: '0.6rem 0.25rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>बुध</div>
              <CloudSun size={18} color="#f59e0b" style={{ margin: '0.25rem auto' }} />
              <strong style={{ fontSize: '0.75rem', color: '#0f172a', display: 'block' }}>32°/24°</strong>
            </div>
          </div>

          <button 
            className="btn btn-outline" 
            style={{ width: '100%', fontSize: '0.875rem' }}
            onClick={() => setActiveTab('weather-advisory')}
          >
            विस्तृत मौसम जानकारी देखें ➔
          </button>
        </div>

      </div>

      {/* 4. आपके लिए गैप फसल सुझाव Section */}
      <div className="glass-card" style={{ border: '1.5px solid #059669', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sprout size={22} color="#059669" /> आपके लिए गैप फसल सुझाव
          </h3>
          <button 
            onClick={() => setActiveTab('my-field')}
            style={{ background: 'transparent', border: 'none', color: '#059669', fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <span>और देखें</span> <ArrowRight size={14} />
          </button>
        </div>

        {/* Input status pills bar */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.825rem', color: '#475569', background: '#f8faf8', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
          <div>🌾 पिछली फसल: <strong style={{ color: '#059669' }}>गेहूं</strong></div>
          <div>⏱️ उपलब्ध दिन: <strong style={{ color: '#059669' }}>68 दिन</strong></div>
          <div>🚰 सिंचाई सुविधा: <strong style={{ color: '#059669' }}>ट्यूबवेल</strong></div>
        </div>

        {/* Crop Recommendation Details Card */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '1.25rem', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Moong Crop Image */}
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: 'var(--shadow-sm)'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80" 
                alt="Moong Pulse"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-success">सर्वोत्तम सुझाव</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>अवधि: 60-65 दिन</span>
              </div>

              <h4 style={{ fontSize: '1.4rem', color: '#0f172a', fontFamily: 'Hind, Noto Sans Devanagari, sans-serif', marginBottom: '0.35rem' }}>
                मूंग (समर मूंग)
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.825rem', color: '#16a34a', fontWeight: 600 }}>
                <div>✓ आपके 68 दिन के गैप के लिए उपयुक्त</div>
                <div>✓ कम पानी की आवश्यकता</div>
                <div>✓ मौसम अनुकूल</div>
                <div>✓ अच्छा बाजार भाव (हापुड़ APMC ₹6,950/क्विंटल)</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', background: '#f0fdf4', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>संभावित लाभ (प्रति एकड़):</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', fontFamily: 'Outfit', marginBottom: '0.75rem' }}>
              ₹22,000 - ₹30,000
            </div>
            <button 
              className="btn btn-outline" 
              style={{ width: '100%', fontSize: '0.85rem' }}
              onClick={() => setActiveTab('my-field')}
            >
              पूरा विवरण देखें
            </button>
          </div>

        </div>

      </div>

      {/* 5. कृषि समाचार और अलर्ट Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        
        {/* Heat Wave Alert Card */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              <Sun size={18} /> <span>हीट वेव अलर्ट</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0 }}>
              अगले 2 दिनों तक तापमान अधिक रहेगा। पूरी जानकारी पढ़ें।
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('weather-advisory')}
            style={{ background: 'transparent', border: 'none', color: '#b45309', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <span>पूरी जानकारी</span> <ArrowRight size={13} />
          </button>
        </div>

        {/* Govt Scheme Card */}
        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0369a1', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              <Megaphone size={18} /> <span>सरकारी योजना</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0 }}>
              पीएम किसान सम्मान निधि की 14वीं किस्‍त जारी। विवरण देखें।
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('crop-school')}
            style={{ background: 'transparent', border: 'none', color: '#0369a1', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <span>विवरण देखें</span> <ArrowRight size={13} />
          </button>
        </div>

        {/* Crop Advisory Card */}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              <Sprout size={18} /> <span>फसल सलाह</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#334155', margin: 0 }}>
              मूंग की बुवाई के लिए अगले 3 दिन उपयुक्त हैं। सलाह पढ़ें।
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('crop-school')}
            style={{ background: 'transparent', border: 'none', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textAlign: 'left', marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <span>सलाह पढ़ें</span> <ArrowRight size={13} />
          </button>
        </div>

      </div>

    </div>
  );
}
