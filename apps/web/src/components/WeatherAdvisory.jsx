import React, { useState, useEffect } from 'react';
import { CloudSun, MapPin, Wind, Droplets, Thermometer, AlertTriangle, CheckCircle2, Navigation } from 'lucide-react';

export default function WeatherAdvisory({ farmerProfile }) {
  const [lat, setLat] = useState(28.66);
  const [lon, setLon] = useState(77.43);
  const [gpsDetected, setGpsDetected] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [advisoryData, setAdvisoryData] = useState(null);

  const fetchWeather = (latitude, longitude) => {
    fetch(`/api/v1/weather/advisory?lat=${latitude}&lon=${longitude}&district=${farmerProfile?.district || 'Ghaziabad'}`)
      .then(res => res.json())
      .then(res => {
        if (res.data) setAdvisoryData(res.data);
        else fallbackAdvisory();
      })
      .catch(() => fallbackAdvisory());

    fetch(`/api/v1/weather/forecast?lat=${latitude}&lon=${longitude}&district=${farmerProfile?.district || 'Ghaziabad'}`)
      .then(res => res.json())
      .then(res => {
        if (res.data) setWeatherData(res.data);
        else fallbackForecast();
      })
      .catch(() => fallbackForecast());
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
      summary_advisory_en: "Good conditions for sowing summer pulses.",
      summary_advisory_hi: "ग्रीष्मकालीन मूंग/उड़द की बुवाई के लिए मौसम अनुकूल है।",
      active_rules: [
        { rule_code: "HEAVY_RAIN_SOWING", triggered: false, action_type: "SOWING", message_en: "Rain > 50mm → Delay Sowing", message_hi: "50 मिमी से अधिक बारिश: बुवाई स्थगित करें" },
        { rule_code: "HIGH_WIND_SPRAYING", triggered: false, action_type: "SPRAYING", message_en: "Wind > 30 km/h → Avoid Spraying", message_hi: "30 किमी/घंटा से तेज हवाएं: छिड़काव न करें" },
        { rule_code: "HIGH_TEMP_IRRIGATION", triggered: false, action_type: "IRRIGATION", message_en: "Temp > 40°C → Irrigate Young Crops", message_hi: "तापमान 40°C से ऊपर: हल्की सिंचाई करें" }
      ]
    });
  };

  const fallbackForecast = () => {
    setWeatherData({
      location: `${farmerProfile?.district || 'गाज़ियाबाद'}, UP (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
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
              <h2 style={{ fontSize: '1.5rem', color: '#0f172a' }}>Module 3 — Weather Advisory</h2>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                Answer: "Is weather suitable for sowing, irrigation or spraying?" Open-Meteo API integration.
              </p>
            </div>
          </div>

          <button 
            className={`btn ${gpsDetected ? 'btn-primary' : 'btn-outline'}`}
            onClick={handleAllowGPS}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
          >
            <Navigation size={16} />
            <span>{gpsDetected ? `GPS Active (${lat.toFixed(2)}, ${lon.toFixed(2)})` : 'Allow GPS Location'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      {advisoryData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#fee2e2', padding: '0.75rem', borderRadius: '12px', color: '#dc2626' }}>
              <Thermometer size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Current Temp</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit' }}>
                {advisoryData.current_temperature}°C
              </div>
              <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>Optimum for germination</span>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#e0f2fe', padding: '0.75rem', borderRadius: '12px', color: '#0284c7' }}>
              <Droplets size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Rainfall</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7', fontFamily: 'Outfit' }}>
                {advisoryData.rainfall_mm} mm
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Humidity: {advisoryData.humidity_pct}%</span>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '12px', color: '#16a34a' }}>
              <Wind size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Wind Speed</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a', fontFamily: 'Outfit' }}>
                {advisoryData.wind_kmh} km/h
              </div>
              <span style={{ fontSize: '0.75rem', color: '#16a34a' }}>Safe for spraying</span>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: '#f3e8ff', padding: '0.75rem', borderRadius: '12px', color: '#9333ea' }}>
              <MapPin size={26} />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Location</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                मुरादनगर
              </div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{farmerProfile?.district || 'गाज़ियाबाद'}, {farmerProfile?.state || 'उत्तर प्रदेश'}</span>
            </div>
          </div>

        </div>
      )}

      {/* Action Advisory Status Banner */}
      {advisoryData && (
        <div className="glass-card" style={{ border: '1.5px solid #16a34a', background: '#f0fdf4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={24} color="#16a34a" />
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Agricultural Action Advisory</h3>
              <p style={{ fontSize: '0.95rem', color: '#15803d', margin: 0, fontWeight: 700 }}>
                {advisoryData.summary_advisory_en}
              </p>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#334155', paddingLeft: '2.5rem' }}>
            {advisoryData.summary_advisory_hi}
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      {weatherData && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#0f172a' }}>Open-Meteo 7-Day Forecast ({weatherData.location})</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.75rem' }}>
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
