# merged-mqtt-api-app

โปรเจคนี้รวม 2 งานไว้ในแอปเดียว และเข้าใช้งานผ่านหน้าเมนูหลัก 2 ปุ่ม

1. **MQTT** สำหรับรับ/ส่งข้อมูลผ่าน MQTT broker  
2. **API** สำหรับเรียกข้อมูลพยากรณ์อากาศจาก Open-Meteo API

## การติดตั้ง

### สิ่งที่ต้องมี
- Node.js (แนะนำ LTS)
- npm
- Expo CLI (ใช้ผ่าน `npx expo`)

### คำสั่งสร้างโปรเจคตอนแรก (ตั้งแต่ยังไม่มีโฟลเดอร์)
```bash
cd "C:\Work\2568-2\CPE451\Pretest Final"
npx create-expo-app merged-mqtt-api-app 
cd merged-mqtt-api-app
npm install react_native_mqtt @react-native-async-storage/async-storage
npm install react-native-svg victory-native
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install -D @babel/core
```

### ติดตั้งโปรเจค (ตั้งแต่เริ่มต้น)
```bash
cd "C:\Work\2568-2\CPE451\Pretest Final\merged-mqtt-api-app"
npm install
npm start
```

ถ้าต้องการรันตรงบนอุปกรณ์:
```bash
npm run android
npm run ios
```

### ติดตั้ง dependencies
ในโฟลเดอร์โปรเจคให้รัน:

```bash
npm install
```

### คำสั่งติดตั้ง lib (กรณีติดตั้งเองทีละชุด)
```bash
npm install expo react react-native
npm install react_native_mqtt @react-native-async-storage/async-storage
npm install react-native-svg victory-native
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install -D @babel/core
```

dependencies ที่ใช้อยู่ในโปรเจค:
- expo
- react
- react-native
- react_native_mqtt
- @react-native-async-storage/async-storage
- react-native-svg
- victory-native
- @react-navigation/native
- @react-navigation/bottom-tabs
- react-native-screens
- react-native-safe-area-context

devDependencies:
- @babel/core

## การรันโปรเจค

```bash
npm start
```

หรือ

```bash
npm run android
npm run ios
```

## อธิบายการทำงาน

## 1) หน้าเมนูหลัก (App.js)
- เมื่อเปิดแอปจะเห็นปุ่ม 2 ปุ่ม: **MQTT** และ **API**
- กดปุ่มไหน จะเข้าไปยังหน้าฟังก์ชันของส่วนนั้น
- ในหน้าฟังก์ชันจะมีปุ่ม **← เมนู** เพื่อกลับหน้าแรก

## 2) เมนู MQTT (components/MqttScreen.js)
- เชื่อมต่อ MQTT broker (`broker.emqx.io`) ผ่าน WebSocket
- subscribe topic เพื่อรับข้อมูลอุณหภูมิ
- แสดงกราฟและ log ข้อมูลล่าสุด
- ส่งข้อความ MQTT กลับไปยัง topic ได้จากช่อง input

## 3) เมนู API (screens/WeatherScreen.js)
- เรียกข้อมูลจาก Open-Meteo API ผ่านไฟล์ `api/weatherApi.js`
- เลือกเมืองที่ต้องการดูข้อมูล
- แสดงอากาศปัจจุบัน (อุณหภูมิ ความชื้น ลม ฝน)
- แสดงพยากรณ์ 7 วัน

## Build APK (Expo EAS) — แยกส่วนชัดเจน

### ส่วนที่ 1: ติดตั้งเครื่องมือ
```bash
npm install
npm install -g eas-cli
```

### ส่วนที่ 2: คำสั่ง Login / Logout
```bash
eas whoami
eas login
eas logout
```

### ส่วนที่ 3: ตั้งค่าโปรเจคสำหรับ EAS
```bash
eas build:configure
```

คำสั่งนี้จะสร้างไฟล์ `eas.json` อัตโนมัติ

### ส่วนที่ 4: ตั้งค่าให้ profile `preview` ออกเป็น APK
แก้ไฟล์ `eas.json` ให้มี `buildType: "apk"`:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  }
}
```

### ส่วนที่ 5: สั่ง Build APK
```bash
eas build -p android --profile preview
```

### ส่วนที่ 6: ดาวน์โหลดไฟล์ APK
- หลัง build เสร็จ ระบบจะแสดงลิงก์ดาวน์โหลดไฟล์ `.apk`
- สามารถเปิดลิงก์จากหน้า EAS Build แล้วติดตั้งลงเครื่อง Android ได้ทันที
