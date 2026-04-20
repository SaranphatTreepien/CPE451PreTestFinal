//! 66044768 ศรัณย์ภัทร ตรีเพียร
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
  VictoryTooltip,
} from 'victory-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ── ข้อมูลตัวอย่าง ──────────────────────────────────────────
const WEEKLY_STEPS = [
  { day: 'Mon', steps: 11000

   },
  { day: 'Tue', steps: 7500 },
  { day: 'Wed', steps: 3100 },
  { day: 'Thu', steps: 8900 },
  { day: 'Fri', steps: 6200 },
  { day: 'Sat', steps: 9800 },
  { day: 'Sun', steps: 5400 },
];

const MONTHLY_TEMP = [
  { month: 'Jan', avg: 26.1 },
  { month: 'Feb', avg: 28.4 },
  { month: 'Mar', avg: 30.2 },
  { month: 'Apr', avg: 32.5 },
  { month: 'May', avg: 33.1 },
  { month: 'Jun', avg: 31.8 },
];

// ── Props reference ────────────────────────────────────────
const PROPS_LIST = [
  { name: 'data', type: 'array', desc: 'ข้อมูลที่ใช้วาดกราฟ เช่น [{day:"Mon", steps:4200}]' },
  { name: 'x', type: 'string', desc: 'ชื่อ key ที่ใช้เป็นแกน X' },
  { name: 'y', type: 'string', desc: 'ชื่อ key ที่ใช้เป็นแกน Y (ตัวเลข)' },
  { name: 'style.data.fill', type: 'string', desc: 'สีของแท่ง bar' },
  { name: 'style.data.width', type: 'number', desc: 'ความกว้างของแต่ละแท่ง (px)' },
  { name: 'animate', type: 'object', desc: 'เพิ่ม animation เช่น { duration: 500 }' },
  { name: 'domainPadding', type: 'number', desc: 'padding รอบกราฟ ไม่ให้แท่งชิดขอบ' },
  { name: 'horizontal', type: 'boolean', desc: 'เปลี่ยนเป็น Horizontal Bar Chart' },
];

// ── Code snippets ──────────────────────────────────────────
const CODE_INSTALL = `npm install victory-native
npm install react-native-svg`;

const CODE_IMPORT = `import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
} from 'victory-native';`;

const CODE_BASIC = `<VictoryChart
  theme={VictoryTheme.material}
  domainPadding={20}
  width={350}
  height={250}
>
  <VictoryAxis />
  <VictoryAxis dependentAxis
    tickFormat={v => \`\${(v/1000).toFixed(1)}k\`}
  />
  <VictoryBar
    data={data}
    x="day"
    y="steps"
    style={{ data: { fill: '#0049e7', width: 22 } }}
    animate={{ duration: 500 }}
  />
</VictoryChart>`;

// ── Sub-components ─────────────────────────────────────────
const SectionTitle = ({ text }) => (
  <Text style={styles.sectionTitle}>{text}</Text>
);

const CodeBlock = ({ code }) => (
  <View style={styles.codeBlock}>
    <Text style={styles.codeText}>{code}</Text>
  </View>
);

const PropRow = ({ name, type, desc }) => (
  <View style={styles.propRow}>
    <View style={styles.propLeft}>
      <Text style={styles.propName}>{name}</Text>
      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>{type}</Text>
      </View>
    </View>
    <Text style={styles.propDesc}>{desc}</Text>
  </View>
);

// ── Main Screen ────────────────────────────────────────────
export default function BarChartScreen() {
  const [activeTab, setActiveTab] = useState('steps');

  const isSteps = activeTab === 'steps';
  const chartData = isSteps ? WEEKLY_STEPS : MONTHLY_TEMP;
  const xKey = isSteps ? 'day' : 'month';
  const yKey = isSteps ? 'steps' : 'avg';
  const barColor = isSteps ? '#c2b9b7' : '#f97316';
  const yFormat = isSteps
    ? v => `${(v / 1000).toFixed(1)}k`
    : v => `${v}°`;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.libraryBadge}>
          <Text style={styles.libraryText}>victory-native</Text>
        </View>
        <Text style={styles.headerTitle}>VictoryBar</Text>
        <Text style={styles.headerSub}>
          Bar Chart สำหรับ React Native — แสดงข้อมูลเชิงเปรียบเทียบด้วยแท่ง
        </Text>
      </View>

      {/* Tab selector */}
      <View style={styles.tabRow}>
        {[
          { key: 'steps', label: '📶  Weekly Steps' },
          { key: 'temp', label: '🌡  Monthly Temp' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {isSteps ? 'จำนวนก้าวเดิน (ก้าว)' : 'อุณหภูมิเฉลี่ย (°C)'}
        </Text>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={24}
          width={SCREEN_WIDTH - 48}
          height={220}
          padding={{ top: 20, bottom: 40, left: 52, right: 16 }}
        >
          <VictoryAxis
            style={{
              tickLabels: { fontSize: 11, fill: '#94a3b8' },
              axis: { stroke: '#334155' },
              grid: { stroke: 'transparent' },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={yFormat}
            style={{
              tickLabels: { fontSize: 10, fill: '#64748b' },
              axis: { stroke: '#334155' },
              grid: { stroke: '#1e3a5f', strokeDasharray: '4,4' },
            }}
          />
          <VictoryBar
            data={chartData}
            x={xKey}
            y={yKey}
            style={{
              data: {
                fill: barColor,
                width: 22,
                rx: 4,
              },
            }}
            animate={{ duration: 400, onLoad: { duration: 400 } }}
            cornerRadius={{ top: 4 }}
          />
        </VictoryChart>
      </View>

      {/* Install */}
      <View style={styles.card}>
        <SectionTitle text="1. ติดตั้ง library" />
        <CodeBlock code={CODE_INSTALL} />
      </View>

      {/* Import */}
      <View style={styles.card}>
        <SectionTitle text="2. import" />
        <CodeBlock code={CODE_IMPORT} />
      </View>

      {/* Basic usage */}
      <View style={styles.card}>
        <SectionTitle text="3. โครงสร้างพื้นฐาน" />
        <CodeBlock code={CODE_BASIC} />
        <View style={styles.noteRow}>
          <Text style={styles.noteIcon}>💡</Text>
          <Text style={styles.noteText}>
            ต้องครอบ VictoryBar ด้วย VictoryChart เสมอ เพื่อให้ได้ axis และ theme
          </Text>
        </View>
      </View>

      {/* Props table */}
      <View style={[styles.card, { marginBottom: 32 }]}>
        <SectionTitle text="4. Props หลักที่ใช้งานบ่อย" />
        {PROPS_LIST.map((p, i) => (
          <PropRow key={i} {...p} />
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },

  headerCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  libraryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0c1e3e',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 8,
  },
  libraryText: { color: '#38bdf8', fontSize: 11, fontWeight: '600' },
  headerTitle: { color: '#f1f5f9', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  headerSub: { color: '#64748b', fontSize: 13, lineHeight: 20 },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  tab: {
    flex: 1, paddingVertical: 8,
    borderRadius: 7, alignItems: 'center',
  },
  tabActive: { backgroundColor: '#0f172a' },
  tabText: { color: '#475569', fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#f1f5f9' },

  card: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  cardTitle: { color: '#64748b', fontSize: 12, fontWeight: '600', marginBottom: 8 },

  sectionTitle: {
    color: '#94a3b8', fontSize: 13, fontWeight: '700',
    marginBottom: 10, letterSpacing: 0.3,
  },

  codeBlock: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  codeText: {
    color: '#7dd3fc',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 20,
  },

  noteRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginTop: 12, backgroundColor: '#0c1e3e',
    borderRadius: 8, padding: 10,
  },
  noteIcon: { fontSize: 14, marginRight: 8 },
  noteText: { color: '#64748b', fontSize: 12, flex: 1, lineHeight: 18 },

  propRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
  },
  propLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  propName: {
    color: '#38bdf8', fontSize: 12,
    fontFamily: 'monospace', marginRight: 8,
  },
  typeBadge: {
    backgroundColor: '#1e3a5f', borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 1,
  },
  typeText: { color: '#475569', fontSize: 10, fontWeight: '600' },
  propDesc: { color: '#64748b', fontSize: 12, lineHeight: 18 },
});