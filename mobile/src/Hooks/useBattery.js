import { useState, useEffect } from 'react';

export const useBattery = () => {
  const [batteryLevel, setBatteryLevel] = useState(1);
  const [isCharging, setIsCharging] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!navigator.getBattery) {
      setSupported(false);
      return;
    }

    let batteryInstance = null;

    const updateBatteryInfo = (battery) => {
      setBatteryLevel(battery.level);
      setIsCharging(battery.charging);
    };

    navigator.getBattery().then((battery) => {
      batteryInstance = battery;
      updateBatteryInfo(battery);

      battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
      battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
    });

    return () => {
      if (batteryInstance) {
        batteryInstance.removeEventListener('levelchange', () => updateBatteryInfo(batteryInstance));
        batteryInstance.removeEventListener('chargingchange', () => updateBatteryInfo(batteryInstance));
      }
    };
  }, []);

  return { batteryLevel, isCharging, supported };
};

export default useBattery;
