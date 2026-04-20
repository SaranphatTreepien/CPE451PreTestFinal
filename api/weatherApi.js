export const CITIES = [
  { name: 'กรุงเทพฯ', lat: 13.7563, lon: 100.5018 },
  { name: 'เชียงใหม่', lat: 18.7883, lon: 98.9853 },
  { name: 'ขอนแก่น', lat: 16.4419, lon: 102.836 },
  { name: 'ภูเก็ต', lat: 7.8804, lon: 98.3923 },
  { name: 'ชลบุรี', lat: 13.3622, lon: 100.9847 },
  { name: 'หาดใหญ่', lat: 7.0086, lon: 100.4747 },
];

export const fetchWeather = async (lat, lon) => {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum` +
    `&timezone=Asia%2FBangkok&forecast_days=7`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('โหลดข้อมูลไม่ได้');
  return res.json();
};

export const weatherLabel = (code) => {
  if (code === 0) return { label: 'แจ่มใส', icon: '☀️' };
  if (code <= 2) return { label: 'มีเมฆบางส่วน', icon: '⛅' };
  if (code <= 3) return { label: 'มีเมฆมาก', icon: '☁️' };
  if (code <= 48) return { label: 'มีหมอก', icon: '🌫️' };
  if (code <= 55) return { label: 'ฝนละออง', icon: '🌦️' };
  if (code <= 65) return { label: 'ฝนตก', icon: '🌧️' };
  if (code <= 77) return { label: 'หิมะ', icon: '❄️' };
  if (code <= 82) return { label: 'ฝนหนัก', icon: '⛈️' };
  return { label: 'พายุ', icon: '⛈️' };
};

export const dayName = (dateStr) => {
  const days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  const d = new Date(dateStr);
  return days[d.getDay()];
};
