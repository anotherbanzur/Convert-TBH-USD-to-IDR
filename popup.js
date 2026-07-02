const DEFAULTS = {
  enabled: true,
  rateMode: "auto",
  manualRate: 16250,
  rate: 16250,
  updatedAt: null,
  lastError: null
};

const enabled = document.querySelector("#enabled");
const manualRate = document.querySelector("#manualRate");
const manualField = document.querySelector("#manualField");
const activeRate = document.querySelector("#activeRate");
const rateStatus = document.querySelector("#rateStatus");
const refreshButton = document.querySelector("#refresh");
const notice = document.querySelector("#notice");
const modeInputs = [...document.querySelectorAll("[name='rateMode']")];

let settings = { ...DEFAULTS };

function rupiah(value) {
  return `Rp${Math.round(Number(value)).toLocaleString("id-ID")}`;
}

function render() {
  enabled.checked = settings.enabled;
  manualRate.value = settings.manualRate;

  for (const input of modeInputs) {
    input.checked = input.value === settings.rateMode;
  }

  const isManual = settings.rateMode === "manual";
  manualField.classList.toggle("disabled", !isManual);
  refreshButton.hidden = isManual;

  const rate = isManual ? settings.manualRate : settings.rate;
  activeRate.textContent = rupiah(rate);

  if (isManual) {
    rateStatus.textContent = "Kurs manual";
  } else if (settings.updatedAt) {
    const date = new Date(settings.updatedAt);
    rateStatus.textContent = Number.isNaN(date.getTime())
      ? `Data ${settings.updatedAt}`
      : `Diperbarui ${date.toLocaleDateString("id-ID")}`;
  } else {
    rateStatus.textContent = "Menggunakan kurs bawaan";
  }

  notice.textContent = settings.lastError
    ? `Pembaruan gagal; kurs tersimpan tetap dipakai (${settings.lastError}).`
    : "";
}

async function save(values) {
  settings = { ...settings, ...values };
  await chrome.storage.local.set(values);
  render();
}

enabled.addEventListener("change", () => {
  save({ enabled: enabled.checked });
});

for (const input of modeInputs) {
  input.addEventListener("change", () => {
    if (input.checked) {
      save({ rateMode: input.value });
    }
  });
}

manualRate.addEventListener("change", () => {
  const value = Number(manualRate.value);
  if (Number.isFinite(value) && value > 0) {
    save({ manualRate: value });
  } else {
    manualRate.value = settings.manualRate;
  }
});

refreshButton.addEventListener("click", async () => {
  refreshButton.disabled = true;
  refreshButton.textContent = "Memperbarui…";

  try {
    settings = await chrome.runtime.sendMessage({ type: "REFRESH_RATE" });
  } catch (error) {
    settings.lastError = error instanceof Error ? error.message : String(error);
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = "Perbarui kurs sekarang";
    render();
  }
});

chrome.storage.local.get(DEFAULTS).then((stored) => {
  settings = stored;
  render();
});
