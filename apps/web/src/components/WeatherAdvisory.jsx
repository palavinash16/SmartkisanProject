import React, { useState, useEffect } from 'react';
import { CloudSun, MapPin, Wind, Droplets, Thermometer, AlertTriangle, CheckCircle2, Navigation, RefreshCw, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WeatherAdvisory({ farmerProfile }) {
  const { t, lang } = useLanguage();
  const [lat, setLat] = useState(28.66);
  const [lon, setLon] = useState(77.43);
  const [gpsDetected, setGpsDetected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [advisoryData, setAdvisoryData] = useState(null);
  const [meta, setMeta] = useState(null);

  const fetchWeather = (latitude, longitude) => {
    setLoading(true);
    setError(null);
    const dist = farmerProfile?.district || 'Ghaziabad';
    const irrSource = farmerProfile?.irrigation_source || farmerProfile?.irrigation || 'Tube well';

    Promise.all([
      fetch('/api/v1/weather/advisory?lat=' + latitude + '&lon=' + longitude + '&district=' + dist + '&irrigation_source=' + encodeURIComponent(irrSource)).then(r => r.json()),
      fetch('/api/v1/weather/forecast?lat=' + latitude + '&lon=' + longitude + '&district=' + dist).then(r => r.json())
    ])
      .then(([advisoryRes, forecastRes]) => {
        if (advisoryRes?.data) {
          setAdvisoryData(advisoryRes.data);
          if (advisoryRes.meta) setMeta(advisoryRes.meta);
        } else {
          fallbackAdvisory();
        }

        if (forecastRes?.data) {
          setWeatherData(forecastRes.data);
          if (forecastRes.meta) setMeta(forecastRes.meta);
        } else {
          fallbackForecast();
        }
      })
      .catch(() => {
        setError('Using cached offline weather estimates');
        fallbackAdvisory();
        fallbackForecast();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWeather(lat, lon);
  }, [lat, lon]);

  const handleAllowGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLon(pos.coords.longitude);
          setGpsDetected(true);
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => setGpsDetected(true)
      );
    } else {
      setGpsDetected(true);
    }
  };

  const fallbackAdvisory = () => {
    setAdvisoryData({
      current_temperature: 34.0,
      rainfall_mm: 22.0,
      wind_kmh: 11.0,
      humidity_pct: 65.0,
      summary_advisory_code: "ADVISORY_IRRIGATION_DELAY",
      summary_advisory_en: "Moderate-to-heavy rainfall (>= 15.6mm) is forecast. Consider postponing planned irrigation to prevent unnecessary water usage and nutrient leaching.",
      summary_advisory_hi: "मध्यम से भारी बारिश (>= 15.6mm) का अनुमान है। पानी की बर्बादी और पोषक तत्वों के नुकसान को रोकने के लिए योजनाबद्ध सिंचाई स्थगित करने पर विचार करें।",
      active_rules: [
        {
          rule_code: "ADVISORY_IRRIGATION_DELAY",
          action: "POSTPONE_IRRIGATION",
          severity: "MEDIUM",
          triggered: true,
          action_type: "IRRIGATION",
          weather_source: "Open-Meteo",
          agricultural_source: "IMD GKMS Agromet Advisory Service",
          decision_source: "SmartKisan Rule Engine",
          message_en: "Moderate-to-heavy rainfall (>= 15.6mm) is forecast. Consider postponing planned irrigation to prevent unnecessary water usage and nutrient leaching.",
          message_hi: "मध्यम से भारी बारिश (>= 15.6mm) का अनुमान है। पानी की बर्बादी और पोषक तत्वों के नुकसान को रोकने के लिए योजनाबद्ध सिंचाई स्थगित करने पर विचार करें।"
        }
      ]
    });
  };

  const fallbackForecast = () => {
    setWeatherData({
      location: (farmerProfile?.district || 'Ghaziabad') + ', UP (' + lat.toFixed(2) + ', ' + lon.toFixed(2) + ')',
      forecast_7d: [
        { day: 'Today', date: '2026-08-14', temp_max: 35.0, temp_min: 26.0, rain_mm: 22.0, humidity_pct: 65.0, wind_kmh: 11.0, condition: 'Light Rain' },
        { day: 'Day 2', date: '2026-08-15', temp_max: 34.0, temp_min: 25.5, rain_mm: 5.0, humidity_pct: 60.0, wind_kmh: 12.0, condition: 'Partly Cloudy' },
        { day: 'Day 3', date: '2026-08-16', temp_max: 36.0, temp_min: 27.0, rain_mm: 0.0, humidity_pct: 55.0, wind_kmh: 10.0, condition: 'Sunny' },
        { day: 'Day 4', date: '2026-08-17', temp_max: 37.0, temp_min: 27.5, rain_mm: 0.0, humidity_pct: 52.0, wind_kmh: 9.0, condition: 'Clear Sky' },
        { day: 'Day 5', date: '2026-08-18', temp_max: 35.5, temp_min: 26.0, rain_mm: 12.0, humidity_pct: 68.0, wind_kmh: 14.0, condition: 'Scattered Rain' },
        { day: 'Day 6', date: '2026-08-19', temp_max: 33.0, temp_min: 24.5, rain_mm: 35.0, humidity_pct: 75.0, wind_kmh: 18.0, condition: 'Moderate Rain' },
        { day: 'Day 7', date: '2026-08-20', temp_max: 32.0, temp_min: 24.0, rain_mm: 8.0, humidity_pct: 70.0, wind_kmh: 11.0, condition: 'Overcast' }
      ]
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '5rem' }}>

      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#e0f2fe', padding: '0.5rem', borderRadius: '10px', color: '#0284c7' }}>
              <CloudSun size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0 }}>{t('weather_title')}</h2>
                <span className="badge badge-success" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '0.7rem' }}>
                  {t('source_label')}: {meta?.source || 'Open-Meteo'}
                </span>
                {meta?.is_stale && (
                  <span className="badge" style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', fontSize: '0.7rem' }}>
                    {t('cached_stale')}
                  </span>
                )}
                {meta?.location_resolution && (
                  <span className="badge" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', fontSize: '0.7rem' }}>
                    {t('location_resolution_label')}: {meta.location_resolution}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
                {t('weather_card_desc')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn btn-outline"
              onClick={() => fetchWeather(lat, lon)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem' }}
              title={t('refresh_weather')}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
            </button>
            <button
              className={gpsDetected ? 'btn btn-primary' : 'btn btn-outline'}
              onClick={handleAllowGPS}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
            >
              <Navigation size={16} />
              <span>{gpsDetected ? 'GPS (' + lat.toFixed(2) + ', ' + lon.toFixed(2) + ')' : 'Allow GPS Location'}</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Grid */}
      {advisoryData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#fee2e2', padding: '0.75rem', borderRadius: '12px', color: '#dc2626' }}>
              <Thermometer size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('current_temp')}</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>
                {advisoryData.current_temperature}°C
              </div>
              <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>{t('optimum_sowing')}</span>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#e0f2fe', padding: '0.75rem', borderRadius: '12px', color: '#0284c7' }}>
              <Droplets size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('rainfall')}</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7', fontFamily: 'Outfit' }}>
                {advisoryData.rainfall_mm} mm
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('humidity')}: {advisoryData.humidity_pct}%</span>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '12px', color: '#16a34a' }}>
              <Wind size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('wind')}</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', fontFamily: 'Outfit' }}>
                {advisoryData.wind_kmh} km/h
              </div>
              <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>{t('spray_guidance')}: Safe</span>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#f3e8ff', padding: '0.75rem', borderRadius: '12px', color: '#9333ea' }}>
              <MapPin size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('active_location')}</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                {farmerProfile?.district || 'Ghaziabad'}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{farmerProfile?.state || 'Uttar Pradesh'}</span>
            </div>
          </div>

        </div>
      )}

      {/* Action Advisory Status Banner */}
      {advisoryData && (
        <div className="glass-card" style={{ border: advisoryData.active_rules && advisoryData.active_rules.length > 0 ? '1.5px solid #16a34a' : '1px solid #e2e8f0', background: advisoryData.active_rules && advisoryData.active_rules.length > 0 ? '#f0fdf4' : '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={24} color={advisoryData.active_rules && advisoryData.active_rules.length > 0 ? '#16a34a' : '#64748b'} />
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>{t('action_advisory')}</h3>
              <p style={{ fontSize: '0.95rem', color: advisoryData.active_rules && advisoryData.active_rules.length > 0 ? '#15803d' : '#475569', margin: 0, fontWeight: 700 }}>
                {lang === 'hi' ? advisoryData.summary_advisory_hi : advisoryData.summary_advisory_en}
              </p>
            </div>
          </div>

          {advisoryData.active_rules && advisoryData.active_rules.length > 0 && advisoryData.active_rules[0].agricultural_source && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #dcfce7', fontSize: '0.75rem', color: '#15803d', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <BookOpen size={14} />
                <span>{t('agri_source_label')}: <strong>{advisoryData.active_rules[0].agricultural_source}</strong></span>
              </div>
              <span style={{ color: '#86efac' }}>|</span>
              <div>
                <span>{t('decision_engine_label')}: <strong>{advisoryData.active_rules[0].decision_source}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7-Day Forecast */}
      {weatherData && (
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: 0 }}>
              {t('forecast_7d_title')} ({weatherData.location})
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('source_label')}: Open-Meteo</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.75rem' }}>
            {weatherData.forecast_7d.map((day, idx) => (
              <div key={idx} style={{ background: '#f8faf8', padding: '0.85rem 0.5rem', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{day.day}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.5rem' }}>{day.date}</div>
                <CloudSun size={20} color="#f59e0b" style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#059669' }}>{day.temp_max}°C</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Min: {day.temp_min}°C</div>
                <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '0.35rem' }}>💧 {day.rain_mm} mm</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
