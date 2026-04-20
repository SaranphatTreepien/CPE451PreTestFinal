import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CITIES, dayName, fetchWeather, weatherLabel } from '../api/weatherApi';

export default function WeatherScreen() {
  const [data, setData] = useState(null);
  const [city, setCity] = useState(CITIES[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (selectedCity) => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchWeather(selectedCity.lat, selectedCity.lon);
      setData(result);
    } catch (e) {
      setError('โหลดข้อมูลไม่ได้ ลองใหม่อีกครั้ง');
    }
    setLoading(false);
  };

  useEffect(() => {
    load(city);
  }, []);

  const selectCity = (selectedCity) => {
    setCity(selectedCity);
    load(selectedCity);
  };

  const cur = data?.current;
  const daily = data?.daily;
  const weather = weatherLabel(cur?.weather_code ?? 0);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#0B1120" barStyle="light-content" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>🌤 พยากรณ์อากาศ</Text>
          <Text style={styles.source}>ข้อมูล: Open-Meteo API</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityRow}>
          {CITIES.map((c) => (
            <TouchableOpacity
              key={c.name}
              onPress={() => selectCity(c)}
              style={[styles.cityBtn, city.name === c.name && styles.cityBtnActive]}
            >
              <Text style={[styles.cityTxt, city.name === c.name && styles.cityTxtActive]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#4FC3F7" />
            <Text style={styles.loadTxt}>กำลังโหลด...</Text>
          </View>
        )}

        {error !== '' && !loading && (
          <View style={styles.center}>
            <Text style={styles.errTxt}>{error}</Text>
            <TouchableOpacity onPress={() => load(city)} style={styles.retryBtn}>
              <Text style={styles.retryTxt}>ลองใหม่</Text>
            </TouchableOpacity>
          </View>
        )}

        {!loading && data && (
          <>
            <View style={styles.card}>
              <Text style={styles.cityName}>{city.name}</Text>
              <Text style={styles.bigIcon}>{weather.icon}</Text>
              <Text style={styles.bigTemp}>{Math.round(cur?.temperature_2m ?? 0)}°C</Text>
              <Text style={styles.condition}>{weather.label}</Text>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statIcon}>💧</Text>
                  <Text style={styles.statVal}>{cur?.relative_humidity_2m ?? '--'}%</Text>
                  <Text style={styles.statLbl}>ความชื้น</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statIcon}>🌬️</Text>
                  <Text style={styles.statVal}>{Math.round(cur?.wind_speed_10m ?? 0)}</Text>
                  <Text style={styles.statLbl}>ลม km/h</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statIcon}>☔</Text>
                  <Text style={styles.statVal}>{(cur?.precipitation ?? 0).toFixed(1)}</Text>
                  <Text style={styles.statLbl}>ฝน มม.</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>📅 พยากรณ์ 7 วัน</Text>
            <View style={[styles.card, { marginBottom: 32 }]}>
              {daily?.time?.map((t, i) => {
                const dailyWeather = weatherLabel(daily.weather_code[i]);
                return (
                  <View key={t} style={[styles.dayRow, i < daily.time.length - 1 && styles.dayBorder]}>
                    <Text style={styles.dayName}>{i === 0 ? 'วันนี้' : dayName(t)}</Text>
                    <Text style={styles.dayIcon}>{dailyWeather.icon}</Text>
                    <Text style={styles.dayLabel}>{dailyWeather.label}</Text>
                    <View style={styles.dayTemps}>
                      <Text style={styles.dayHigh}>{Math.round(daily.temperature_2m_max[i])}°</Text>
                      <Text style={styles.dayLow}> / {Math.round(daily.temperature_2m_min[i])}°</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const BG = '#0B1120';
const CARD = '#151E30';
const ACC = '#4FC3F7';
const TXT = '#FFFFFF';
const SUB = 'rgba(255,255,255,0.55)';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  scroll: { flex: 1 },
  header: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 8 },
  appTitle: { fontSize: 22, fontWeight: '700', color: TXT },
  source: { fontSize: 11, color: SUB, marginTop: 2 },
  cityRow: { paddingHorizontal: 16, paddingVertical: 12 },
  cityBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: CARD,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cityBtnActive: { borderColor: ACC, backgroundColor: '#0D2137' },
  cityTxt: { color: SUB, fontSize: 14 },
  cityTxtActive: { color: ACC, fontWeight: '700' },
  center: { alignItems: 'center', paddingVertical: 48 },
  loadTxt: { color: ACC, marginTop: 12, fontSize: 15 },
  errTxt: { color: '#FF6B6B', fontSize: 15, textAlign: 'center' },
  retryBtn: {
    marginTop: 16,
    backgroundColor: ACC,
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  retryTxt: { color: '#000', fontWeight: '700' },
  card: { marginHorizontal: 16, marginBottom: 16, backgroundColor: CARD, borderRadius: 20, padding: 20 },
  cityName: { fontSize: 18, fontWeight: '700', color: TXT, textAlign: 'center' },
  bigIcon: { fontSize: 72, textAlign: 'center', marginVertical: 8 },
  bigTemp: { fontSize: 64, fontWeight: '200', color: TXT, textAlign: 'center' },
  condition: { fontSize: 18, color: SUB, textAlign: 'center', marginBottom: 24 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 16,
  },
  stat: { alignItems: 'center', flex: 1 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
  statIcon: { fontSize: 22 },
  statVal: { fontSize: 18, fontWeight: '700', color: TXT, marginTop: 4 },
  statLbl: { fontSize: 11, color: SUB, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: TXT, paddingHorizontal: 20, marginBottom: 8 },
  dayRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 8 },
  dayBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  dayName: { width: 44, fontSize: 14, color: TXT, fontWeight: '600' },
  dayIcon: { fontSize: 20, width: 28 },
  dayLabel: { flex: 1, fontSize: 13, color: SUB },
  dayTemps: { flexDirection: 'row' },
  dayHigh: { fontSize: 14, fontWeight: '700', color: TXT },
  dayLow: { fontSize: 14, color: SUB },
});
