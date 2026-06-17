const controls = [
  { id: "CC7.2", name: "Monitoring and detection" },
  { id: "CC7.3", name: "Incident evaluation" },
  { id: "CC7.4", name: "Incident response" },
  { id: "CC7.5", name: "Remediation" },
  { id: "A1.2", name: "Availability and recovery" },
  { id: "CC6.1", name: "Logical access" },
  { id: "CC9.2", name: "Risk mitigation" }
];

const defaultEvents = [
  {
    minute: 0,
    phase: "Detection",
    title: "Endpoint alert on finance workstation",
    summary: "EDR reports suspicious PowerShell behavior and rapid file rename activity on one workstation.",
    prompt: "Who triages the alert, what evidence is collected, and what threshold triggers incident declaration?",
    controls: ["CC7.2", "CC7.3"]
  },
  {
    minute: 12,
    phase: "Escalation",
    title: "Shared drive reports encrypted files",
    summary: "A finance manager reports that files on a shared drive now have an unfamiliar extension.",
    prompt: "Does the team declare a security incident? Who becomes incident commander, and how are roles assigned?",
    controls: ["CC7.3", "CC7.4"]
  },
  {
    minute: 22,
    phase: "Containment",
    title: "Lateral movement indicator",
    summary: "Authentication logs show the affected user account connecting to two file servers and a backup console.",
    prompt: "What containment actions are authorized, and how does the team avoid destroying forensic evidence?",
    controls: ["CC6.1", "CC7.4", "CC9.2"]
  },
  {
    minute: 35,
    phase: "Recovery",
    title: "Backup status is uncertain",
    summary: "The latest backup job succeeded, but no one has confirmed whether the backup repository is isolated from the attack.",
    prompt: "What must be validated before restore, and who approves recovery sequencing?",
    controls: ["A1.2", "CC7.4"]
  },
  {
    minute: 48,
    phase: "Communications",
    title: "Customer success asks for talking points",
    summary: "Customer-facing teams are hearing rumors about downtime and ask whether they can acknowledge an incident.",
    prompt: "Who owns internal, customer, legal, and executive communications? What evidence supports the message?",
    controls: ["CC7.4", "CC9.2"]
  },
  {
    minute: 60,
    phase: "Decision",
    title: "Ransom note appears",
    summary: "The attacker demands payment within 72 hours and claims they copied customer data.",
    prompt: "How does the team evaluate ransom, legal obligations, cyber insurance, data exposure, and executive approval?",
    controls: ["CC7.3", "CC7.4", "CC9.2"]
  },
  {
    minute: 75,
    phase: "Closure",
    title: "Post-incident evidence package",
    summary: "Leadership asks what the organization can show auditors about response effectiveness and remediation.",
    prompt: "What artifacts are retained, what gaps become action items, and how will remediation be tracked to closure?",
    controls: ["CC7.5", "A1.2", "CC9.2"]
  }
];

const bcdrEvents = [
  {
    minute: 0,
    phase: "Activation",
    title: "Regional cloud service disruption",
    summary: "A major cloud provider region hosting customer-facing systems reports widespread availability issues. Monitoring shows elevated errors and failed health checks.",
    prompt: "Who declares a business continuity event, what severity is assigned, and which recovery plan is activated?",
    controls: ["A1.2", "CC7.2", "CC7.3"]
  },
  {
    minute: 10,
    phase: "Assessment",
    title: "Customer portal unavailable",
    summary: "Customer-facing teams report that clients cannot access a critical portal. Support volume is increasing and status page ownership is unclear.",
    prompt: "How is customer impact assessed, who owns communications, and what evidence confirms service impact?",
    controls: ["A1.2", "CC7.3", "CC7.4"]
  },
  {
    minute: 20,
    phase: "Continuity",
    title: "Manual workaround requested",
    summary: "Operations asks whether teams can use an approved manual process while primary systems are unavailable.",
    prompt: "Which manual procedures are authorized, how are approvals documented, and what data integrity risks must be controlled?",
    controls: ["A1.2", "CC6.1", "CC9.2"]
  },
  {
    minute: 32,
    phase: "Failover",
    title: "Failover decision point",
    summary: "Engineering can fail over to a secondary environment, but the recovery point is 45 minutes old and validation is incomplete.",
    prompt: "Who approves failover, what recovery time and recovery point objectives apply, and what validation is required before customer traffic moves?",
    controls: ["A1.2", "CC7.4", "CC9.2"]
  },
  {
    minute: 45,
    phase: "Third Party",
    title: "Vendor status remains ambiguous",
    summary: "The cloud provider posts a generic update but does not provide a clear restoration estimate. Leadership asks whether contractual or customer commitments are affected.",
    prompt: "How are vendor updates monitored, who evaluates contractual obligations, and what evidence is retained for third-party risk review?",
    controls: ["CC9.2", "A1.2"]
  },
  {
    minute: 60,
    phase: "Recovery",
    title: "Service restored with data reconciliation needed",
    summary: "Primary services are returning, but transaction reconciliation is required before declaring full recovery.",
    prompt: "What checks prove recovery is complete, who signs off, and how are discrepancies tracked to closure?",
    controls: ["A1.2", "CC7.4", "CC7.5"]
  },
  {
    minute: 75,
    phase: "Post-Event",
    title: "After-action review and improvement plan",
    summary: "Executives request a concise summary of downtime, decisions, communications, control performance, and remediation items.",
    prompt: "What artifacts are retained, which continuity gaps become action items, and how will leadership track remediation?",
    controls: ["CC7.5", "A1.2", "CC9.2"]
  }
];

const defaultRunbook = {
  id: "bedroc-ransomware-response",
  name: "Bedroc Ransomware Response",
  description: "A practical SOC 2 tabletop runbook for ransomware detection, escalation, containment, communications, recovery, and remediation.",
  objective: "Validate ransomware detection, escalation, containment, communication, backup recovery, and SOC 2 evidence capture.",
  events: defaultEvents
};

const bcdrRunbook = {
  id: "bedroc-business-continuity-disaster-recovery",
  name: "Business Continuity and Disaster Recovery Tabletop Exercise",
  description: "A business continuity and disaster recovery tabletop focused on cloud service disruption, continuity workarounds, failover decisions, customer communications, recovery validation, and after-action improvement.",
  objective: "Validate business continuity activation, disaster recovery decision-making, communication ownership, failover approval, recovery validation, vendor monitoring, and evidence capture.",
  events: bcdrEvents
};

const defaultRunbooks = [defaultRunbook, bcdrRunbook];

const runbookStorageKey = "soc2-tabletop-runbooks";
const appSettingsStorageKey = "soc2-tabletop-app-settings";
const runbookSchema = "bedroc-soc2-tabletop-runbook/v1";
const defaultAppLogoSource = "assets/built-on-white.png";
const defaultDocumentLogoSource = "assets/bedroc-logo-grey.png";
const defaultAppSettings = {
  organizationName: "Bedroc",
  logoDataUrl: "",
  appLogoDataUrl: "",
  documentLogoDataUrl: "",
  paletteId: "bedroc",
  customPalette: {
    bg: "#f2f0ea",
    surface: "#fbfaf6",
    header: "#191816",
    text: "#201f1c",
    primary: "#9b6040",
    accent: "#737f6f"
  },
  requireEvidenceBeforeCompletion: true,
  coverageEventWeight: 30,
  coverageEvidenceWeight: 20
};
const colorPalettes = {
  bedroc: {
    name: "Bedroc Classic",
    colors: ["#f2f0ea", "#191816", "#737f6f", "#9b6040"],
    vars: {
      "--bg": "#f2f0ea",
      "--surface": "#fbfaf6",
      "--surface-strong": "#ebe7dd",
      "--ink": "#070706",
      "--charcoal": "#191816",
      "--text": "#201f1c",
      "--muted": "#746f65",
      "--stone": "#7c766a",
      "--line": "#d7d0c3",
      "--accent": "#737f6f",
      "--accent-strong": "#545f50",
      "--rust": "#9b6040",
      "--gold": "#b98a45",
      "--warn": "#9b6040",
      "--risk": "#a33d36",
      "--ok": "#5c7654",
      "--shadow": "0 14px 38px rgba(25, 24, 22, 0.11)"
    }
  },
  signal: {
    name: "Signal Blue",
    colors: ["#eef3f6", "#17242b", "#3f7585", "#aa6b3c"],
    vars: {
      "--bg": "#eef3f6",
      "--surface": "#fbfcfb",
      "--surface-strong": "#dfe9ec",
      "--ink": "#081113",
      "--charcoal": "#17242b",
      "--text": "#1c2529",
      "--muted": "#647078",
      "--stone": "#6e7d82",
      "--line": "#ccd9dd",
      "--accent": "#3f7585",
      "--accent-strong": "#285767",
      "--rust": "#aa6b3c",
      "--gold": "#c39b4f",
      "--warn": "#aa6b3c",
      "--risk": "#a13f3c",
      "--ok": "#4f7b5c",
      "--shadow": "0 14px 38px rgba(23, 36, 43, 0.12)"
    }
  },
  graphite: {
    name: "Graphite Green",
    colors: ["#eeeee8", "#202522", "#4f765f", "#8f653a"],
    vars: {
      "--bg": "#eeeee8",
      "--surface": "#fbfaf4",
      "--surface-strong": "#e3e3d9",
      "--ink": "#090b0a",
      "--charcoal": "#202522",
      "--text": "#202522",
      "--muted": "#6f746d",
      "--stone": "#74796f",
      "--line": "#d1d2c8",
      "--accent": "#4f765f",
      "--accent-strong": "#365943",
      "--rust": "#8f653a",
      "--gold": "#b58b43",
      "--warn": "#8f653a",
      "--risk": "#9c3f3a",
      "--ok": "#4f765f",
      "--shadow": "0 14px 38px rgba(32, 37, 34, 0.12)"
    }
  },
  ember: {
    name: "Ember Copper",
    colors: ["#f4efe8", "#241f1b", "#6f7464", "#b55f3c"],
    vars: {
      "--bg": "#f4efe8",
      "--surface": "#fffaf3",
      "--surface-strong": "#eadfd2",
      "--ink": "#0c0907",
      "--charcoal": "#241f1b",
      "--text": "#28221d",
      "--muted": "#756d63",
      "--stone": "#83796d",
      "--line": "#d9cbbd",
      "--accent": "#6f7464",
      "--accent-strong": "#525948",
      "--rust": "#b55f3c",
      "--gold": "#bf8a3d",
      "--warn": "#b55f3c",
      "--risk": "#a33d36",
      "--ok": "#5f7b53",
      "--shadow": "0 14px 38px rgba(36, 31, 27, 0.12)"
    }
  }
};

let runbooks = [];
let appSettings = { ...defaultAppSettings };
let adminRunbookId = defaultRunbook.id;
let adminEventIndex = 0;

const $ = (selector) => document.querySelector(selector);

function init() {
  loadRunbooks();
  loadAppSettings();
  populateRunbookControlOptions();
  bindEvents();
  renderRunbookAdmin();
  renderAppSettings();
}

function bindEvents() {
  document.querySelectorAll(".admin-nav-item").forEach((button) => {
    button.addEventListener("click", () => activateAdminSection(button.dataset.adminSection));
  });
  $("#newRunbook").addEventListener("click", createRunbook);
  $("#duplicateRunbook").addEventListener("click", duplicateRunbook);
  $("#deleteRunbook").addEventListener("click", deleteRunbook);
  $("#saveRunbook").addEventListener("click", saveAdminRunbook);
  $("#saveRunbookTop").addEventListener("click", saveAdminRunbook);
  $("#addRunbookEvent").addEventListener("click", addAdminEvent);
  $("#deleteRunbookEvent").addEventListener("click", deleteAdminEvent);
  $("#adminEventForm").addEventListener("submit", saveAdminEvent);
  $("#exportRunbook").addEventListener("click", exportAdminRunbook);
  $("#importRunbook").addEventListener("click", () => $("#importRunbookFile").click());
  $("#importRunbookFile").addEventListener("change", importRunbookFile);
  $("#saveBrandingSettings").addEventListener("click", saveBrandingSettings);
  $("#saveBrandingSettingsTop").addEventListener("click", saveBrandingSettings);
  $("#colorPalette").addEventListener("change", () => {
    appSettings.paletteId = $("#colorPalette").value;
    syncCustomPaletteFields();
    persistAppSettings();
    applyColorPalette();
    renderCustomPaletteFields();
    renderPalettePreview();
    $("#brandingSettingsNotice").textContent = "Color palette saved.";
  });
  ["customBg", "customSurface", "customHeader", "customText", "customPrimary", "customAccent"].forEach((id) => {
    $(`#${id}`).addEventListener("input", () => {
      appSettings.paletteId = "custom";
      $("#colorPalette").value = "custom";
      appSettings.customPalette = readCustomPaletteFields();
      persistAppSettings();
      applyColorPalette();
      renderCustomPaletteFields();
      renderPalettePreview();
      $("#brandingSettingsNotice").textContent = "Custom palette saved.";
    });
  });
  $("#appLogoUpload").addEventListener("change", (event) => importLogoFile(event, "app"));
  $("#documentLogoUpload").addEventListener("change", (event) => importLogoFile(event, "document"));
  $("#resetAppLogo").addEventListener("click", () => resetLogo("app"));
  $("#resetDocumentLogo").addEventListener("click", () => resetLogo("document"));
  $("#saveExerciseSettings").addEventListener("click", saveExerciseSettings);
  $("#saveExerciseSettingsTop").addEventListener("click", saveExerciseSettings);

  ["adminRunbookName", "adminRunbookDescription", "adminRunbookObjective"].forEach((id) => {
    $(`#${id}`).addEventListener("input", syncAdminRunbookFields);
  });
}

function activateAdminSection(section) {
  document.querySelectorAll(".admin-nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.adminSection === section);
  });
  document.querySelectorAll(".admin-section").forEach((panel) => {
    panel.hidden = panel.id !== `admin-section-${section}`;
    panel.classList.toggle("active", panel.id === `admin-section-${section}`);
  });
}

function loadRunbooks() {
  const saved = localStorage.getItem(runbookStorageKey);
  if (!saved) {
    runbooks = defaultRunbooks.map(cloneRunbook);
    persistRunbooks();
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    runbooks = Array.isArray(parsed) && parsed.length ? parsed.map(normalizeRunbook) : defaultRunbooks.map(cloneRunbook);
  } catch {
    runbooks = defaultRunbooks.map(cloneRunbook);
  }

  defaultRunbooks.forEach((defaultItem) => {
    if (!runbooks.some((runbook) => runbook.id === defaultItem.id)) {
      runbooks.push(cloneRunbook(defaultItem));
    }
  });
  adminRunbookId = runbooks[0].id;
  persistRunbooks();
}

function persistRunbooks() {
  localStorage.setItem(runbookStorageKey, JSON.stringify(runbooks));
}

function loadAppSettings() {
  const saved = localStorage.getItem(appSettingsStorageKey);
  if (!saved) {
    persistAppSettings();
    return;
  }

  try {
    appSettings = normalizeAppSettings(JSON.parse(saved));
  } catch {
    appSettings = { ...defaultAppSettings };
  }
  persistAppSettings();
}

function persistAppSettings() {
  localStorage.setItem(appSettingsStorageKey, JSON.stringify(appSettings));
}

function normalizeAppSettings(settings) {
  return {
    organizationName: settings?.organizationName || defaultAppSettings.organizationName,
    logoDataUrl: settings?.logoDataUrl || "",
    appLogoDataUrl: settings?.appLogoDataUrl || "",
    documentLogoDataUrl: settings?.documentLogoDataUrl || settings?.logoDataUrl || "",
    paletteId: settings?.paletteId === "custom" || colorPalettes[settings?.paletteId] ? settings.paletteId : defaultAppSettings.paletteId,
    customPalette: normalizeCustomPalette(settings?.customPalette),
    requireEvidenceBeforeCompletion: settings?.requireEvidenceBeforeCompletion !== false,
    coverageEventWeight: normalizePercent(settings?.coverageEventWeight, defaultAppSettings.coverageEventWeight),
    coverageEvidenceWeight: normalizePercent(settings?.coverageEvidenceWeight, defaultAppSettings.coverageEvidenceWeight)
  };
}

function renderAppSettings() {
  $("#organizationName").value = appSettings.organizationName;
  populatePaletteSelect();
  $("#colorPalette").value = appSettings.paletteId;
  syncCustomPaletteFields();
  $("#requireEvidenceBeforeCompletion").checked = appSettings.requireEvidenceBeforeCompletion;
  $("#coverageEventWeight").value = appSettings.coverageEventWeight;
  $("#coverageEvidenceWeight").value = appSettings.coverageEvidenceWeight;
  applyColorPalette();
  renderCustomPaletteFields();
  renderPalettePreview();
  renderLogoPreview();
  renderAdminBranding();
  $("#brandingSettingsNotice").textContent = "Branding changes apply to this browser's tabletop workspace.";
  $("#exerciseSettingsNotice").textContent = "Completion policies apply the next time the exercise page is opened or refreshed.";
}

function renderLogoPreview() {
  $("#appLogoPreview").src = getAppLogoSource();
  $("#documentLogoPreview").src = getDocumentLogoSource();
}

function renderAdminBranding() {
  const logoSrc = getAppLogoSource();
  document.querySelectorAll(".brand-lockup img").forEach((image) => {
    image.src = logoSrc;
    image.alt = appSettings.organizationName || defaultAppSettings.organizationName;
  });
}

function getAppLogoSource() {
  return appSettings.appLogoDataUrl || defaultAppLogoSource;
}

function getDocumentLogoSource() {
  return appSettings.documentLogoDataUrl || appSettings.logoDataUrl || defaultDocumentLogoSource;
}

function populatePaletteSelect() {
  const select = $("#colorPalette");
  select.innerHTML = "";
  Object.entries(colorPalettes).forEach(([id, palette]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = palette.name;
    select.appendChild(option);
  });
  const customOption = document.createElement("option");
  customOption.value = "custom";
  customOption.textContent = "Custom palette";
  select.appendChild(customOption);
}

function renderPalettePreview() {
  const palette = getActivePalette();
  $("#palettePreview").innerHTML = palette.colors.map((color) => `<span style="background: ${color}"></span>`).join("");
}

function applyColorPalette() {
  const palette = getActivePalette();
  Object.entries(palette.vars).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });
}

function getActivePalette() {
  if (appSettings.paletteId === "custom") return buildCustomPalette(appSettings.customPalette);
  return colorPalettes[appSettings.paletteId] || colorPalettes[defaultAppSettings.paletteId];
}

function buildCustomPalette(customPalette) {
  const custom = normalizeCustomPalette(customPalette);
  return {
    name: "Custom palette",
    colors: [custom.bg, custom.header, custom.accent, custom.primary],
    vars: {
      "--bg": custom.bg,
      "--surface": custom.surface,
      "--surface-strong": mixWithWhite(custom.surface, 0.88),
      "--ink": "#070706",
      "--charcoal": custom.header,
      "--text": custom.text,
      "--muted": mixWithWhite(custom.text, 0.42),
      "--stone": mixWithWhite(custom.text, 0.5),
      "--line": mixWithWhite(custom.text, 0.82),
      "--accent": custom.accent,
      "--accent-strong": shadeColor(custom.accent, -22),
      "--rust": custom.primary,
      "--gold": shadeColor(custom.primary, 16),
      "--warn": custom.primary,
      "--risk": "#a33d36",
      "--ok": "#5c7654",
      "--shadow": `0 14px 38px ${hexToRgba(custom.header, 0.12)}`
    }
  };
}

function renderCustomPaletteFields() {
  $("#customPaletteFields").hidden = appSettings.paletteId !== "custom";
}

function syncCustomPaletteFields() {
  const custom = normalizeCustomPalette(appSettings.customPalette);
  $("#customBg").value = custom.bg;
  $("#customSurface").value = custom.surface;
  $("#customHeader").value = custom.header;
  $("#customText").value = custom.text;
  $("#customPrimary").value = custom.primary;
  $("#customAccent").value = custom.accent;
}

function readCustomPaletteFields() {
  return normalizeCustomPalette({
    bg: $("#customBg").value,
    surface: $("#customSurface").value,
    header: $("#customHeader").value,
    text: $("#customText").value,
    primary: $("#customPrimary").value,
    accent: $("#customAccent").value
  });
}

function saveBrandingSettings() {
  appSettings.organizationName = $("#organizationName").value.trim() || defaultAppSettings.organizationName;
  appSettings.paletteId = $("#colorPalette").value === "custom" || colorPalettes[$("#colorPalette").value] ? $("#colorPalette").value : defaultAppSettings.paletteId;
  appSettings.customPalette = readCustomPaletteFields();
  persistAppSettings();
  applyColorPalette();
  renderCustomPaletteFields();
  renderPalettePreview();
  renderLogoPreview();
  renderAdminBranding();
  $("#brandingSettingsNotice").textContent = "Branding saved.";
}

function normalizeCustomPalette(customPalette) {
  const fallback = defaultAppSettings.customPalette;
  return {
    bg: normalizeHex(customPalette?.bg, fallback.bg),
    surface: normalizeHex(customPalette?.surface, fallback.surface),
    header: normalizeHex(customPalette?.header, fallback.header),
    text: normalizeHex(customPalette?.text, fallback.text),
    primary: normalizeHex(customPalette?.primary, fallback.primary),
    accent: normalizeHex(customPalette?.accent, fallback.accent)
  };
}

function normalizeHex(value, fallback) {
  const text = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(text) ? text : fallback;
}

function mixWithWhite(hex, amount) {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel) => Math.round(channel + (255 - channel) * amount);
  return rgbToHex(mix(r), mix(g), mix(b));
}

function shadeColor(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const adjust = (channel) => Math.max(0, Math.min(255, Math.round(channel + (255 * percent / 100))));
  return rgbToHex(adjust(r), adjust(g), adjust(b));
}

function hexToRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex, "#000000").slice(1);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16)
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function saveExerciseSettings() {
  appSettings.requireEvidenceBeforeCompletion = $("#requireEvidenceBeforeCompletion").checked;
  appSettings.coverageEventWeight = normalizePercent($("#coverageEventWeight").value, defaultAppSettings.coverageEventWeight);
  appSettings.coverageEvidenceWeight = normalizePercent($("#coverageEvidenceWeight").value, defaultAppSettings.coverageEvidenceWeight);
  $("#coverageEventWeight").value = appSettings.coverageEventWeight;
  $("#coverageEvidenceWeight").value = appSettings.coverageEvidenceWeight;
  persistAppSettings();
  $("#exerciseSettingsNotice").textContent = "Exercise settings saved.";
}

function normalizePercent(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function importLogoFile(event, logoType) {
  const [file] = event.target.files;
  if (!file) return;

  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    alert("Choose a PNG, JPEG, or WebP image for the logo.");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    if (logoType === "app") {
      appSettings.appLogoDataUrl = reader.result;
    } else {
      appSettings.documentLogoDataUrl = reader.result;
      appSettings.logoDataUrl = "";
    }
    persistAppSettings();
    renderLogoPreview();
    renderAdminBranding();
    $("#brandingSettingsNotice").textContent = `${logoType === "app" ? "App header" : "Document"} logo uploaded and saved.`;
    event.target.value = "";
  });
  reader.readAsDataURL(file);
}

function resetLogo(logoType) {
  if (logoType === "app") {
    appSettings.appLogoDataUrl = "";
  } else {
    appSettings.documentLogoDataUrl = "";
    appSettings.logoDataUrl = "";
  }
  persistAppSettings();
  renderLogoPreview();
  renderAdminBranding();
  $("#brandingSettingsNotice").textContent = `Default ${logoType === "app" ? "app" : "document"} logo restored.`;
}

function populateRunbookControlOptions() {
  const select = $("#adminEventControls");
  select.innerHTML = "";
  controls.forEach((control) => {
    const option = document.createElement("option");
    option.value = control.id;
    option.textContent = `${control.id} - ${control.name}`;
    select.appendChild(option);
  });
}

function renderRunbookAdmin() {
  renderAdminRunbookList();
  renderAdminRunbookFields();
  renderAdminEventList();
  renderAdminEventForm();
  updateRunbookAdminNotice();
}

function renderAdminRunbookList() {
  $("#runbookCount").textContent = runbooks.length;
  const list = $("#adminRunbookList");
  list.innerHTML = "";
  runbooks.forEach((runbook) => {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.toggle("active", runbook.id === adminRunbookId);
    button.innerHTML = `<strong>${escapeHtml(runbook.name)}</strong><span>${runbook.events.length} event(s)</span>`;
    button.addEventListener("click", () => {
      adminRunbookId = runbook.id;
      adminEventIndex = 0;
      renderRunbookAdmin();
    });
    list.appendChild(button);
  });
}

function renderAdminRunbookFields() {
  const runbook = getAdminRunbook();
  $("#adminRunbookName").value = runbook.name;
  $("#adminRunbookDescription").value = runbook.description;
  $("#adminRunbookObjective").value = runbook.objective;
}

function renderAdminEventList() {
  const runbook = getAdminRunbook();
  const list = $("#adminEventList");
  list.innerHTML = "";
  runbook.events.forEach((event, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.toggle("active", index === adminEventIndex);
    button.innerHTML = `<strong>T+${escapeHtml(event.minute)} ${escapeHtml(event.title)}</strong><span>${escapeHtml(event.phase)} | ${event.controls.join(", ")}</span>`;
    button.addEventListener("click", () => {
      adminEventIndex = index;
      renderAdminEventList();
      renderAdminEventForm();
    });
    list.appendChild(button);
  });
}

function renderAdminEventForm() {
  const runbook = getAdminRunbook();
  if (!runbook.events.length) {
    runbook.events.push(createBlankEvent());
    adminEventIndex = 0;
  }
  const event = runbook.events[adminEventIndex] || runbook.events[0];
  $("#adminEventMinute").value = event.minute;
  $("#adminEventPhase").value = event.phase;
  $("#adminEventTitle").value = event.title;
  $("#adminEventSummary").value = event.summary;
  $("#adminEventPrompt").value = event.prompt;
  Array.from($("#adminEventControls").options).forEach((option) => {
    option.selected = event.controls.includes(option.value);
  });
  $("#deleteRunbookEvent").disabled = runbook.events.length <= 1;
}

function saveAdminRunbook() {
  syncAdminRunbookFields();
  saveCurrentAdminEvent();
  const runbook = getAdminRunbook();
  sortRunbookEvents(runbook);
  persistRunbooks();
  renderRunbookAdmin();
  $("#runbookAdminNotice").textContent = "Runbook saved.";
}

function saveAdminEvent(event) {
  event.preventDefault();
  syncAdminRunbookFields();
  saveCurrentAdminEvent();
  persistRunbooks();
  renderAdminRunbookList();
  renderAdminEventList();
  $("#runbookAdminNotice").textContent = "Scenario event saved.";
}

function syncAdminRunbookFields() {
  const runbook = getAdminRunbook();
  runbook.name = $("#adminRunbookName").value.trim() || "Untitled runbook";
  runbook.description = $("#adminRunbookDescription").value.trim();
  runbook.objective = $("#adminRunbookObjective").value.trim();
  persistRunbooks();
  renderAdminRunbookList();
  updateRunbookAdminNotice();
}

function saveCurrentAdminEvent() {
  const runbook = getAdminRunbook();
  const selectedControls = Array.from($("#adminEventControls").selectedOptions).map((option) => option.value);
  runbook.events[adminEventIndex] = normalizeEvent({
    minute: Number($("#adminEventMinute").value || 0),
    phase: $("#adminEventPhase").value.trim() || "Exercise",
    title: $("#adminEventTitle").value.trim() || "Untitled event",
    summary: $("#adminEventSummary").value.trim(),
    prompt: $("#adminEventPrompt").value.trim(),
    controls: selectedControls.length ? selectedControls : ["CC7.4"]
  });
}

function createRunbook() {
  const runbook = normalizeRunbook({
    id: makeId("runbook"),
    name: "New Runbook",
    description: "",
    objective: "Validate incident response roles, decisions, communications, recovery, and evidence capture.",
    events: [createBlankEvent()]
  });
  runbooks.push(runbook);
  adminRunbookId = runbook.id;
  adminEventIndex = 0;
  persistRunbooks();
  renderRunbookAdmin();
}

function duplicateRunbook() {
  const source = getAdminRunbook();
  const copy = cloneRunbook(source);
  copy.id = makeId("runbook");
  copy.name = `${source.name} Copy`;
  runbooks.push(copy);
  adminRunbookId = copy.id;
  adminEventIndex = 0;
  persistRunbooks();
  renderRunbookAdmin();
}

function deleteRunbook() {
  if (runbooks.length <= 1) {
    alert("At least one runbook is required.");
    return;
  }
  const runbook = getAdminRunbook();
  if (!confirm(`Delete runbook "${runbook.name}"?`)) return;
  runbooks = runbooks.filter((item) => item.id !== runbook.id);
  adminRunbookId = runbooks[0].id;
  adminEventIndex = 0;
  persistRunbooks();
  renderRunbookAdmin();
}

function addAdminEvent() {
  const runbook = getAdminRunbook();
  runbook.events.push(createBlankEvent());
  adminEventIndex = runbook.events.length - 1;
  persistRunbooks();
  renderAdminEventList();
  renderAdminEventForm();
}

function deleteAdminEvent() {
  const runbook = getAdminRunbook();
  if (runbook.events.length <= 1) return;
  runbook.events.splice(adminEventIndex, 1);
  adminEventIndex = Math.max(0, adminEventIndex - 1);
  persistRunbooks();
  renderAdminEventList();
  renderAdminEventForm();
}

function exportAdminRunbook() {
  saveAdminRunbook();
  const runbook = getAdminRunbook();
  downloadJson({
    schema: runbookSchema,
    exportedAt: new Date().toISOString(),
    runbook
  }, `${slugify(runbook.name)}-runbook.json`);
}

function importRunbookFile(event) {
  const [file] = event.target.files;
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const payload = JSON.parse(reader.result);
      if (payload.schema !== runbookSchema || !payload.runbook) throw new Error("Unsupported runbook file.");
      const imported = normalizeRunbook(payload.runbook);
      imported.id = makeId("runbook");
      imported.name = `${imported.name} Imported`;
      runbooks.push(imported);
      adminRunbookId = imported.id;
      adminEventIndex = 0;
      persistRunbooks();
      renderRunbookAdmin();
    } catch (error) {
      alert(`Unable to import runbook: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  });
  reader.readAsText(file);
}

function updateRunbookAdminNotice() {
  $("#runbookAdminNotice").textContent = "Changes are stored as runbook templates for future exercises. Active exercise snapshots are not changed retroactively.";
}

function getAdminRunbook() {
  return runbooks.find((runbook) => runbook.id === adminRunbookId) || runbooks[0];
}

function normalizeRunbook(runbook) {
  return {
    id: runbook.id || makeId("runbook"),
    name: runbook.name || "Untitled runbook",
    description: runbook.description || "",
    objective: runbook.objective || "",
    events: Array.isArray(runbook.events) && runbook.events.length ? runbook.events.map(normalizeEvent) : [createBlankEvent()]
  };
}

function normalizeEvent(event) {
  return {
    minute: Number.isFinite(Number(event.minute)) ? Number(event.minute) : 0,
    phase: event.phase || "Exercise",
    title: event.title || "Untitled event",
    summary: event.summary || "",
    prompt: event.prompt || "",
    controls: Array.isArray(event.controls) && event.controls.length ? event.controls : ["CC7.4"]
  };
}

function createBlankEvent() {
  return {
    minute: 0,
    phase: "Exercise",
    title: "New scenario event",
    summary: "",
    prompt: "",
    controls: ["CC7.4"]
  };
}

function cloneRunbook(runbook) {
  return normalizeRunbook(JSON.parse(JSON.stringify(runbook)));
}

function sortRunbookEvents(runbook) {
  runbook.events.sort((a, b) => a.minute - b.minute);
  adminEventIndex = Math.min(adminEventIndex, runbook.events.length - 1);
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function slugify(value) {
  return String(value || "bedroc-tabletop")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "bedroc-tabletop";
}

function downloadJson(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
