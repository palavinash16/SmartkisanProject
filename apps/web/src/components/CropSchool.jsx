import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  PlayCircle, 
  CheckCircle2, 
  Lock, 
  Award, 
  Star, 
  Clock, 
  Users, 
  Share2, 
  ArrowLeft,
  ChevronRight,
  BookMarked
} from 'lucide-react';

const CATEGORIES = [
  { code: 'pulses', label: 'दालें', icon: '🫛' },
  { code: 'cereals', label: 'अनाज', icon: '🌾' },
  { code: 'oilseeds', label: 'तिलहन', icon: '🌼' },
  { code: 'vegetables', label: 'सब्जियां', icon: '🍅' },
  { code: 'cash', label: 'नकदी फसलें', icon: '🪵' },
];

const COURSES = [
  {
    id: 'moong',
    title: 'मूंग (समर मूंग) की संपूर्ण जानकारी',
    category: 'pulses',
    lessonsCount: 12,
    duration: '45 मिनट',
    rating: 4.7,
    reviews: '1.2K',
    progress: 60,
    lessons: [
      { id: 1, title: '1. मूंग की पहचान और प्रकार', time: '3:45', completed: true },
      { id: 2, title: '2. जलवायु और उपयुक्त समय', time: '4:10', completed: true },
      { id: 3, title: '3. भूमि की तैयारी', time: '5:20', active: true },
      { id: 4, title: '4. बीज चयन और उपचार', time: '3:30', locked: true },
      { id: 5, title: '5. बुवाई की विधि और दूरी', time: '4:25', locked: true },
      { id: 6, title: '6. खाद और पोषक तत्व प्रबंधन', time: '5:15', locked: true },
      { id: 7, title: '7. सिंचाई प्रबंधन', time: '3:40', locked: true }
    ],
    learnings: [
      'मूंग की विभिन्न किस्मों के बारे में जानकारी',
      'बीज चयन, उपचार और बुवाई की सही विधि',
      'खाद, सिंचाई और खरपतवार प्रबंधन',
      'कीट और रोगों की पहचान व नियंत्रण',
      'मूंग की पैदावार बढ़ाने की वैज्ञानिक तकनीकें',
      'काटने के बाद प्रबंधन और भंडारण'
    ]
  },
  {
    id: 'wheat',
    title: 'गेहूं की उन्नत तकनीक',
    category: 'cereals',
    lessonsCount: 15,
    duration: '52 मिनट',
    rating: 4.6,
    reviews: '980',
    progress: 30,
    lessons: [
      { id: 1, title: '1. गेहूं की प्रमुख किस्में', time: '4:00', completed: true },
      { id: 2, title: '2. खेत की तैयारी और बुवाई', time: '5:10', active: true }
    ],
    learnings: ['उन्नत किस्मों का चयन', 'CRI क्रांतिक अवस्था पर सिंचाई']
  },
  {
    id: 'tomato',
    title: 'टमाटर की वैज्ञानिक खेती',
    category: 'vegetables',
    lessonsCount: 18,
    duration: '65 मिनट',
    rating: 4.8,
    reviews: '1.6K',
    progress: 15,
    lessons: [
      { id: 1, title: '1. नर्सरी तैयार करने की विधि', time: '6:00', active: true }
    ],
    learnings: ['नर्सरी प्रबंधन', 'ड्रिप सिंचाई तकनीक']
  }
];

export default function CropSchool({ initialCourseId = 'moong' }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);

  const selectedCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '5rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(6, 20, 13, 0.95) 100%)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="badge badge-info" style={{ background: '#a855f7' }}>Module 4 — Crop School</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>फसलों की पूरी जानकारी सीखें</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', fontFamily: 'Hind, Noto Sans Devanagari, sans-serif' }}>फसल स्कूल</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              खेती, पोषण, लागत, पैदावार और बाज़ार तक ICAR कोर्स library.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: '#fff', background: 'rgba(6,20,13,0.8)', padding: '0.68rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div><strong style={{ color: '#34d399' }}>24</strong> कुल कोर्स</div>
            <div>• <strong style={{ color: '#60a5fa' }}>128</strong> वीडियो लेसन</div>
            <div>• <strong style={{ color: '#fbbf24' }}>5.2K</strong> किसान सीख रहे हैं</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 2fr', gap: '1.25rem' }}>
        
        {/* Left Column: Course Search, Categories & Catalog */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="कोर्स खोजें..." 
              className="form-control"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem', width: '100%', fontSize: '0.9rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          {/* Popular Topics / Category Pills */}
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>लोकप्रिय विषय</div>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.code}
                  onClick={() => setSelectedCategory(cat.code)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    border: selectedCategory === cat.code ? '1.5px solid #a855f7' : '1px solid var(--border-color)',
                    background: selectedCategory === cat.code ? 'rgba(168, 85, 247, 0.2)' : 'rgba(6, 20, 13, 0.6)',
                    color: selectedCategory === cat.code ? '#c084fc' : '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: मेरे कोर्स (In Progress) */}
          <div className="glass-card">
            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookMarked size={16} color="#34d399" /> मेरे चालू कोर्स (In Progress)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {COURSES.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedCourseId(c.id)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedCourseId === c.id ? 'rgba(168, 85, 247, 0.15)' : 'rgba(6, 20, 13, 0.6)',
                    border: selectedCourseId === c.id ? '1px solid #a855f7' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.85rem', color: selectedCourseId === c.id ? '#c084fc' : '#fff' }}>{c.title}</strong>
                    <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>प्रगति: {c.progress}%</span>
                  </div>

                  <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${c.progress}%`, height: '100%', background: '#34d399' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Catalog List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {COURSES.map((c) => (
              <div key={c.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '0.25rem' }}>{c.title}</h4>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.65rem' }}>
                    <span>📖 {c.lessonsCount} लेसन</span>
                    <span>⏱️ {c.duration}</span>
                    <span style={{ color: '#fbbf24' }}>⭐ {c.rating} ({c.reviews})</span>
                  </div>
                </div>

                <button 
                  className="btn btn-outline" 
                  style={{ fontSize: '0.75rem', color: '#34d399', borderColor: 'rgba(52, 211, 153, 0.4)' }}
                  onClick={() => setSelectedCourseId(c.id)}
                >
                  शुरू करें
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Active Course Reader (Screenshot 4 Style) */}
        <div className="glass-card" style={{ border: '1px solid var(--border-color)', position: 'relative' }}>
          
          {/* Hero Banner Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(6, 30, 18, 0.95) 0%, rgba(14, 48, 28, 0.9) 100%)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span className="badge badge-success">पाठ्यक्रम</span>
              <button style={{ background: 'transparent', border: 'none', color: '#fff' }}><Share2 size={16} /></button>
            </div>

            <h3 style={{ fontSize: '1.5rem', color: '#fff', fontFamily: 'Hind, Noto Sans Devanagari, sans-serif', marginBottom: '0.5rem' }}>
              {selectedCourse.title}
            </h3>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              <span style={{ color: '#fbbf24' }}>⭐ {selectedCourse.rating} ({selectedCourse.reviews} किसान)</span>
              <span>📖 {selectedCourse.lessonsCount} लेसन</span>
              <span>⏱️ {selectedCourse.duration} कुल समय</span>
              <span>🗣️ हिंदी भाषा</span>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem', fontWeight: 700 }}>
              जारी रखें (आगे बढ़ें ➔)
            </button>
          </div>

          {/* Lessons Curriculum List */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', color: '#fff' }}>पाठ्यक्रम ({selectedCourse.lessons.length} लेसन)</h4>
              <span style={{ fontSize: '0.75rem', color: '#34d399' }}>प्रगति: {selectedCourse.progress}%</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedCourse.lessons.map((les) => (
                <div 
                  key={les.id}
                  style={{
                    padding: '0.75rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: les.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 20, 13, 0.6)',
                    border: les.active ? '1.5px solid #10b981' : '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: les.active ? '#34d399' : '#fff' }}>
                    {les.completed ? (
                      <CheckCircle2 size={18} color="#34d399" />
                    ) : les.active ? (
                      <PlayCircle size={18} color="#34d399" />
                    ) : (
                      <Lock size={16} color="var(--text-muted)" />
                    )}
                    <span>{les.title}</span>
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱️ {les.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learnings Section */}
          <div style={{ background: 'rgba(6, 20, 13, 0.7)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.5rem' }}>इस कोर्स में आप सीखेंगे:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.825rem', color: '#34d399' }}>
              {selectedCourse.learnings.map((l, idx) => (
                <div key={idx}>✓ {l}</div>
              ))}
            </div>
          </div>

          {/* Quiz & Certificate Box */}
          <div style={{ background: 'rgba(5, 150, 105, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: '0.95rem', color: '#fff', display: 'block' }}>क्विज़ और प्रमाण पत्र</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>कोर्स पूरा करें और प्रमाण पत्र प्राप्त करें</span>
            </div>

            <button className="btn btn-primary" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Award size={16} /> <span>क्विज़ दें</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
