import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MqttScreen from './components/MqttScreen';
import WeatherScreen from './screens/WeatherScreen';

export default function App() {
  const [activeMenu, setActiveMenu] = useState(null);

  if (activeMenu === 'mqtt') {
    return (
      <SafeAreaView style={styles.screenWrap}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setActiveMenu(null)} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← เมนู</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>MQTT</Text>
          <View style={styles.topSpacer} />
        </View>
        <View style={styles.screenContent}>
          <MqttScreen />
        </View>
      </SafeAreaView>
    );
  }

  if (activeMenu === 'api') {
    return (
      <SafeAreaView style={styles.screenWrap}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setActiveMenu(null)} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← เมนู</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>API</Text>
          <View style={styles.topSpacer} />
        </View>
        <View style={styles.screenContent}>
          <WeatherScreen />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.menuWrap}>
      <View style={styles.menuCard}>
        <Text style={styles.menuTitle}>Main Menu</Text>
        <Text style={styles.menuSubtitle}>เลือกเมนูที่ต้องการใช้งาน</Text>

        <TouchableOpacity style={styles.menuBtn} onPress={() => setActiveMenu('mqtt')}>
          <Text style={styles.menuBtnIcon}>📡</Text>
          <Text style={styles.menuBtnText}>MQTT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuBtn} onPress={() => setActiveMenu('api')}>
          <Text style={styles.menuBtnIcon}>🌤️</Text>
          <Text style={styles.menuBtnText}>API</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  menuWrap: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    padding: 20,
  },
  menuCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuTitle: {
    color: '#f1f5f9',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  menuSubtitle: {
    color: '#94a3b8',
    marginBottom: 18,
  },
  menuBtn: {
    backgroundColor: '#0b1220',
    borderWidth: 1,
    borderColor: '#1e3a5f',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBtnIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  menuBtnText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  screenWrap: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  topBar: {
    height: 56,
    backgroundColor: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  backBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#1e293b',
    borderRadius: 8,
  },
  backBtnText: {
    color: '#f1f5f9',
    fontSize: 13,
    fontWeight: '600',
  },
  topTitle: {
    color: '#f1f5f9',
    fontSize: 16,
    fontWeight: '700',
  },
  topSpacer: {
    width: 62,
  },
  screenContent: {
    flex: 1,
  },
});
