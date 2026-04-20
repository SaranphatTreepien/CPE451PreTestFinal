import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import Svg, {
  Polyline,
  Circle,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Polygon,
} from 'react-native-svg';
import init from 'react_native_mqtt';
import AsyncStorage from '@react-native-async-storage/async-storage';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpiry: 1000 * 3600 * 8,
  enableCache: true,
  reconnect: true,
  sync: {},
});

// ─── broker.emqx.io ใช้ port 8083 (WebSocket, ไม่มี SSL) ───────────────────
// react_native_mqtt ใช้ WebSocket เท่านั้น ห้ามใช้ port 1883 (TCP)
// port 8083 = ws://  (useSSL: false)
// port 8084 = wss:// (useSSL: true)
const BROKER_HOST = 'broker.emqx.io';
const BROKER_PORT = 8083;          // ← WebSocket port (ไม่ใช่ 1883)
const TOPIC = 'spu/demo/temp';
const MAX_VALUES = 10;

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 32;
const CHART_HEIGHT = 210;

export default function MqttScreen() {
  const [status, setStatus] = useState('disconnected');
  const [inputValue, setInputValue] = useState('');
  const [temperatures, setTemperatures] = useState([]);
  const [receivedLog, setReceivedLog] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    connectMQTT();
    return () => {
      try {
        if (clientRef.current && clientRef.current.isConnected()) {
          clientRef.current.disconnect();
        }
      } catch (_) {}
    };
  }, []);

  const connectMQTT = () => {
    try {
      const clientId = 'rn_' + Math.random().toString(16).substr(2, 8);

      // Paho.MQTT.Client(host, port, path, clientId)
      // path ต้องเป็น '/mqtt' สำหรับ broker.emqx.io
      const client = new Paho.MQTT.Client(BROKER_HOST, BROKER_PORT, '/mqtt', clientId);

      client.onConnectionLost = (res) => {
        setStatus('disconnected');
        console.log('Connection lost:', res.errorMessage);
      };

      client.onMessageArrived = (message) => {
        const value = parseFloat(message.payloadString);
        if (!isNaN(value)) {
          const now = new Date();
          const timeStr = [
            now.getHours().toString().padStart(2, '0'),
            now.getMinutes().toString().padStart(2, '0'),
            now.getSeconds().toString().padStart(2, '0'),
          ].join(':');

          setTemperatures(prev => [...prev, { value, time: timeStr }].slice(-MAX_VALUES));
          setReceivedLog(prev =>
            [`${timeStr} | ${message.destinationName}: ${value}`, ...prev].slice(0, MAX_VALUES)
          );
        }
      };

      client.connect({
        onSuccess: () => {
          setStatus('connected');
          client.subscribe(TOPIC);
          clientRef.current = client;
          console.log('MQTT connected');
        },
        onFailure: (err) => {
          setStatus('disconnected');
          console.log('MQTT connect failed:', err.errorMessage);
          Alert.alert('Connection Failed', err.errorMessage || 'Unknown error');
        },
        useSSL: false,          // port 8083 ไม่ใช้ SSL
        timeout: 10,            // รอ 10 วินาที
        keepAliveInterval: 30,
        cleanSession: true,
      });
    } catch (e) {
      console.log('connectMQTT error:', e);
      setStatus('disconnected');
    }
  };

  const sendMessage = () => {
    if (!clientRef.current || !clientRef.current.isConnected()) {
      Alert.alert('Error', 'Not connected to broker');
      return;
    }
    try {
      const msg = new Paho.MQTT.Message(inputValue);
      msg.destinationName = TOPIC;
      clientRef.current.send(msg);
      setInputValue('');
    } catch (e) {
      Alert.alert('Send Error', e.message);
    }
  };

  // ─── Line Chart ─────────────────────────────────────────────────────────────
  const renderLineChart = () => {
    if (temperatures.length < 2) {
      return (
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>Waiting for data...</Text>
        </View>
      );
    }

    const values = temperatures.map(t => t.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;
    const padX = 48;
    const padY = 18;
    const innerW = CHART_WIDTH - padX - 12;
    const innerH = CHART_HEIGHT - padY * 2;

    const getX = i => padX + (i / (temperatures.length - 1)) * innerW;
    const getY = v => padY + innerH - ((v - minVal) / range) * innerH;

    const linePoints = temperatures.map((t, i) => `${getX(i)},${getY(t.value)}`).join(' ');

    const areaPoints =
      `${getX(0)},${padY + innerH} ` +
      temperatures.map((t, i) => `${getX(i)},${getY(t.value)}`).join(' ') +
      ` ${getX(temperatures.length - 1)},${padY + innerH}`;

    const yLabels = [0, 1, 2, 3, 4].map(i => {
      const v = minVal + (range * i) / 4;
      return { label: v.toFixed(1), y: getY(v) };
    });

    return (
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#38bdf8" stopOpacity="0.25" />
            <Stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {yLabels.map((item, i) => (
          <React.Fragment key={i}>
            <Line x1={padX} y1={item.y} x2={CHART_WIDTH - 8} y2={item.y}
              stroke="#1e3a5f" strokeWidth="1" />
            <SvgText x={padX - 6} y={item.y + 4} fontSize="10" fill="#64748b" textAnchor="end">
              {item.label}
            </SvgText>
          </React.Fragment>
        ))}

        {temperatures.map((t, i) =>
          i % 2 === 0 ? (
            <SvgText key={i} x={getX(i)} y={CHART_HEIGHT - 3}
              fontSize="9" fill="#475569" textAnchor="middle">
              {t.time.slice(3)}
            </SvgText>
          ) : null
        )}

        <Polygon points={areaPoints} fill="url(#areaGrad)" />

        <Polyline points={linePoints} fill="none" stroke="#38bdf8"
          strokeWidth="2" strokeLinejoin="round" />

        {temperatures.map((t, i) => {
          const isLast = i === temperatures.length - 1;
          return (
            <React.Fragment key={i}>
              {isLast && (
                <Circle cx={getX(i)} cy={getY(t.value)} r="8"
                  fill="#f97316" opacity="0.2" />
              )}
              <Circle cx={getX(i)} cy={getY(t.value)} r={isLast ? 5 : 3.5}
                fill={isLast ? '#f97316' : '#38bdf8'}
                stroke="#0f172a" strokeWidth="1.5" />
              {isLast && (
                <SvgText x={getX(i)} y={getY(t.value) - 10}
                  fontSize="11" fill="#f97316" textAnchor="middle" fontWeight="bold">
                  {t.value}°C
                </SvgText>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    );
  };

  const isConnected = status === 'connected';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      <View style={styles.statusRow}>
        <View style={[styles.dot, isConnected ? styles.dotOn : styles.dotOff]} />
        <Text style={[styles.statusText, isConnected ? styles.statusOn : styles.statusOff]}>
          MQTT Status: {status}
        </Text>
        <Text style={styles.brokerInfo}>  {BROKER_HOST}:{BROKER_PORT}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Publish to {TOPIC}</Text>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="เช่น 28 หรือ {'temp':28}"
          placeholderTextColor="#334155"
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.sendBtn, !isConnected && styles.sendBtnDisabled]}
          onPress={sendMessage}
          disabled={!isConnected}
        >
          <Text style={styles.sendBtnText}>▶  SEND MQTT MESSAGE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Temperature ล่าสุด {MAX_VALUES} ค่า</Text>
          {temperatures.length > 0 && (
            <Text style={styles.currentVal}>
              {temperatures[temperatures.length - 1].value}°C
            </Text>
          )}
        </View>
        {renderLineChart()}
      </View>

      <View style={[styles.card, { marginBottom: 32 }]}>
        <Text style={styles.cardTitle}>Received ล่าสุด {MAX_VALUES} รายการ</Text>
        {receivedLog.length === 0 ? (
          <Text style={styles.placeholderText}>No data received yet</Text>
        ) : (
          receivedLog.map((log, i) => (
            <Text key={i} style={[styles.logText, i === 0 && styles.logLatest]}>
              {log}
            </Text>
          ))
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  statusRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: 14, paddingVertical: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  dotOn: { backgroundColor: '#22c55e' },
  dotOff: { backgroundColor: '#ef4444' },
  statusText: { fontSize: 13, fontWeight: '600' },
  statusOn: { color: '#22c55e' },
  statusOff: { color: '#ef4444' },
  brokerInfo: { color: '#334155', fontSize: 11, marginLeft: 4 },
  card: {
    backgroundColor: '#1e293b', borderRadius: 14,
    padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: '#1e3a5f',
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  cardLabel: { color: '#475569', fontSize: 11, marginBottom: 8, fontWeight: '600', letterSpacing: 0.5 },
  cardTitle: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  currentVal: { color: '#f97316', fontSize: 18, fontWeight: 'bold' },
  input: {
    backgroundColor: '#0f172a', color: '#f1f5f9',
    borderRadius: 8, padding: 12, marginBottom: 10,
    borderWidth: 1, borderColor: '#1e3a5f', fontSize: 14,
  },
  sendBtn: { backgroundColor: '#1d4ed8', borderRadius: 8, padding: 14, alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: '#1e3a5f', opacity: 0.6 },
  sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13, letterSpacing: 0.8 },
  chartPlaceholder: { height: 200, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#334155', fontSize: 13 },
  logText: {
    color: '#475569', fontSize: 12, paddingVertical: 3,
    fontFamily: 'monospace', borderBottomWidth: 1, borderBottomColor: '#0f172a',
  },
  logLatest: { color: '#38bdf8' },
});