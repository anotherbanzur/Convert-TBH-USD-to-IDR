const RATE_URL = "https://api.frankfurter.dev/v2/rate/USD/IDR";
const DEFAULT_RATE = 16250;
const REFRESH_ALARM = "refresh-usd-idr-rate";

async function getSettings() {
  const stored = await chrome.storage.local.get({
    enabled: true,
    rateMode: "auto",
    manualRate: DEFAULT_RATE,
    rate: DEFAULT_RATE,
    updatedAt: null
  });

  return stored;
}

async function refreshRate(force = false) {
  const settings = await getSettings();

  if (settings.rateMode !== "auto" && !force) {
    return settings;
  }

  try {
    const response = await fetch(RATE_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const rate = Number(data?.rate);
    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("Respons kurs tidak valid");
    }

    const next = {
      rate,
      updatedAt: data.date || new Date().toISOString(),
      lastError: null
    };
    await chrome.storage.local.set(next);
    return { ...settings, ...next };
  } catch (error) {
    const next = {
      lastError: error instanceof Error ? error.message : String(error)
    };
    await chrome.storage.local.set(next);
    return { ...settings, ...next };
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const settings = await getSettings();
  await chrome.storage.local.set(settings);
  await chrome.alarms.create(REFRESH_ALARM, {
    delayInMinutes: 1,
    periodInMinutes: 360
  });
  await refreshRate();
});

chrome.runtime.onStartup.addListener(async () => {
  await chrome.alarms.create(REFRESH_ALARM, {
    delayInMinutes: 1,
    periodInMinutes: 360
  });
  await refreshRate();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === REFRESH_ALARM) {
    refreshRate();
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "REFRESH_RATE") {
    return false;
  }

  refreshRate(true).then(sendResponse);
  return true;
});
