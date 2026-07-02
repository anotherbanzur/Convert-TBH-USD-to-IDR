(() => {
  const DEFAULTS = {
    enabled: true,
    rateMode: "auto",
    manualRate: 16250,
    rate: 16250
  };

  const SKIPPED_PARENTS = new Set([
    "SCRIPT",
    "STYLE",
    "NOSCRIPT",
    "TEXTAREA",
    "INPUT",
    "OPTION",
    "CODE",
    "PRE"
  ]);

  // Menangkap $0.12, $1,234.56, dan bentuk dengan spasi setelah simbol.
  const USD_PRICE = /\$\s*((?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?)/g;
  const USD_LABEL = /\bUSD\b/g;

  let settings = { ...DEFAULTS };
  let observer;
  let pendingRoots = new Set();
  let frameId = null;
  const convertedNodes = new Map();

  function activeRate() {
    const value =
      settings.rateMode === "manual" ? settings.manualRate : settings.rate;
    const rate = Number(value);
    return Number.isFinite(rate) && rate > 0 ? rate : DEFAULTS.rate;
  }

  function formatRupiah(usd) {
    const idr = Math.round(usd * activeRate());
    return `Rp${idr.toLocaleString("id-ID")}`;
  }

  function convertText(text) {
    const converted = text.replace(USD_PRICE, (_match, amount) => {
      const usd = Number(amount.replaceAll(",", ""));
      return Number.isFinite(usd) ? formatRupiah(usd) : _match;
    });

    return converted.replace(USD_LABEL, "IDR");
  }

  function shouldSkip(node) {
    const parent = node.parentElement;
    return (
      !parent ||
      SKIPPED_PARENTS.has(parent.tagName) ||
      parent.closest("[contenteditable='true']") !== null
    );
  }

  function convertTextNode(node) {
    if (shouldSkip(node) || (!node.data.includes("$") && !node.data.includes("USD"))) {
      return;
    }

    const converted = convertText(node.data);
    if (converted !== node.data) {
      convertedNodes.set(node, {
        original: node.data,
        converted
      });
      node.data = converted;
    }
  }

  function restoreOriginalPrices() {
    observer?.disconnect();

    for (const [node, record] of convertedNodes) {
      if (node.isConnected && node.data === record.converted) {
        node.data = record.original;
      }
    }

    convertedNodes.clear();
    pendingRoots.clear();
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  function convertRoot(root) {
    if (!settings.enabled) {
      return;
    }

    if (root.nodeType === Node.TEXT_NODE) {
      convertTextNode(root);
      return;
    }

    if (!(root instanceof Element) && root !== document) {
      return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      convertTextNode(node);
    }
  }

  function flushPendingRoots() {
    frameId = null;
    const roots = pendingRoots;
    pendingRoots = new Set();
    for (const root of roots) {
      convertRoot(root);
    }
  }

  function queueRoot(root) {
    pendingRoots.add(root);
    if (frameId === null) {
      frameId = requestAnimationFrame(flushPendingRoots);
    }
  }

  function startObserver() {
    observer?.disconnect();
    observer = new MutationObserver((mutations) => {
      if (!settings.enabled) {
        return;
      }

      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          const record = convertedNodes.get(mutation.target);
          if (record && mutation.target.data === record.converted) {
            continue;
          }
          if (record) {
            convertedNodes.delete(mutation.target);
          }
          queueRoot(mutation.target);
        } else {
          for (const node of mutation.addedNodes) {
            queueRoot(node);
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }

  async function loadSettings() {
    settings = await chrome.storage.local.get(DEFAULTS);
    convertRoot(document);
    startObserver();
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") {
      return;
    }

    for (const [key, change] of Object.entries(changes)) {
      settings[key] = change.newValue;
    }

    const rateChanged =
      changes.rate ||
      changes.manualRate ||
      changes.rateMode;

    if (changes.enabled?.newValue === false) {
      restoreOriginalPrices();
      startObserver();
    } else if (settings.enabled && (changes.enabled || rateChanged)) {
      restoreOriginalPrices();
      convertRoot(document);
      startObserver();
    }
  });

  loadSettings();
})();
