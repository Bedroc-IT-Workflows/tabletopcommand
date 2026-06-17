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
const emptyRunbook = {
  id: "",
  name: "Incident Tabletop",
  description: "",
  objective: "",
  events: []
};

const state = {
  startedAt: null,
  completedAt: null,
  completedDurationSeconds: null,
  selectedRunbookId: "",
  sessionRunbook: null,
  participants: [],
  revealed: [],
  evidence: [],
  actions: [],
  reportHtml: "",
  reportEdited: false
};

let runbooks = [];
let adminRunbookId = defaultRunbook.id;
let adminEventIndex = 0;

const scenarioSchema = "bedroc-soc2-tabletop-scenario/v1";
const runbookSchema = "bedroc-soc2-tabletop-runbook/v1";
const scenarioStorageKey = "soc2-tabletop-state";
const runbookStorageKey = "soc2-tabletop-runbooks";
const appSettingsStorageKey = "soc2-tabletop-app-settings";
const splashEnteredStorageKey = "soc2-tabletop-splash-entered";
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

const $ = (selector) => document.querySelector(selector);
let appSettings = { ...defaultAppSettings };

async function init() {
  loadAppSettings();
  renderBranding();
  bindSplashEvents();
  const authReady = await initializeAuth();
  if (!authReady) return;

  $("#exerciseDate").valueAsDate = new Date();
  loadRunbooks();
  restore();
  ensureStateShape();
  populateControls();
  populateRunbookSelect();
  renderAll();
  bindEvents();
  renderEntryExperience();
  window.addEventListener("pageshow", syncAppSettingsFromStorage);
  setInterval(updateTimer, 1000);
}

function bindSplashEvents() {
  $("#enterAppButton").addEventListener("click", enterWorkspace);
}

function renderEntryExperience() {
  if (sessionStorage.getItem(splashEnteredStorageKey) === "true") {
    showWorkspace();
    return;
  }
  $("#splashPage").hidden = false;
  $("#appHeader").hidden = true;
  $("#exercisePage").hidden = true;
}

function enterWorkspace() {
  sessionStorage.setItem(splashEnteredStorageKey, "true");
  showWorkspace();
}

function showWorkspace() {
  $("#splashPage").hidden = true;
  $("#appHeader").hidden = false;
  $("#exercisePage").hidden = false;
}

function syncAppSettingsFromStorage() {
  loadAppSettings();
  renderBranding();
}

function bindEvents() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tab));
  });

  $("#startExercise").addEventListener("click", () => {
    if (!state.startedAt) {
      const runbook = getSelectedTemplate();
      if (!runbook) {
        alert("Select a runbook before starting the exercise.");
      return;
    }
      state.sessionRunbook = cloneRunbook(runbook);
      state.startedAt = new Date().toISOString();
      logEvidence(`Exercise started using runbook: ${state.sessionRunbook.name}.`, "Facilitator", "CC7.4", "Runbook snapshot", getEventReference(0));
    }
    persist();
    renderAll();
  });
  $("#completeExercise").addEventListener("click", completeExercise);

  $("#resetExercise").addEventListener("click", () => {
    if (!confirm("Reset this tabletop exercise? This clears local exercise data but keeps saved runbook templates.")) return;
    localStorage.removeItem(scenarioStorageKey);
    location.reload();
  });

  $("#runbookSelect").addEventListener("change", () => {
    if (state.startedAt) {
      populateRunbookSelect();
      return;
    }
    state.selectedRunbookId = $("#runbookSelect").value;
    const runbook = getSelectedTemplate();
    $("#objective").value = runbook ? runbook.objective : "";
    state.revealed = [];
    state.reportEdited = false;
    state.reportHtml = "";
    persist();
    renderAll();
  });

  $("#addParticipant").addEventListener("click", addParticipant);
  $("#cancelParticipantEdit").addEventListener("click", resetParticipantForm);
  $("#participantName").addEventListener("keydown", (event) => {
    if (event.key === "Enter") addParticipant();
  });

  $("#decisionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const text = $("#decisionText").value.trim();
    if (!text) return;
    const relatedEvent = getRelatedEventFromForm("decision");
    if (!relatedEvent) {
      alert("Select the scenario event this evidence relates to.");
      return;
    }
    const editingIndex = $("#editingEvidenceIndex").value;
    if (editingIndex !== "") {
      updateEvidence(Number(editingIndex), text, getSelectedOwner("decisionOwner"), $("#decisionControl").value, $("#decisionEvidence").value.trim(), relatedEvent);
    } else {
      logEvidence(text, getSelectedOwner("decisionOwner"), $("#decisionControl").value, $("#decisionEvidence").value.trim(), relatedEvent);
    }
    resetEvidenceForm();
  });
  $("#cancelEvidenceEdit").addEventListener("click", resetEvidenceForm);
  $("#decisionRelatedEventSelect").addEventListener("change", () => syncRelatedEventFromSelect("decision"));
  $("#actionRelatedEventSelect").addEventListener("change", () => syncRelatedEventFromSelect("action"));

  $("#actionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const relatedEvent = getRelatedEventFromForm("action");
    if (!relatedEvent) {
      alert("Select the scenario event this action relates to.");
      return;
    }
    addAction($("#actionTitle").value.trim(), getSelectedOwner("actionOwner"), $("#actionDue").value, relatedEvent);
    $("#actionForm").reset();
    resetActionRelatedEvent();
  });

  $("#addManualEvidence").addEventListener("click", () => {
    activateTab("evidence");
    resetEvidenceForm();
    $("#decisionRelatedEventSelect").focus();
  });
  $("#copyReport").addEventListener("click", copyReport);
  $("#regenerateReport").addEventListener("click", regenerateReport);
  $("#printReport").addEventListener("click", printReport);
  $("#reportDocument").addEventListener("input", saveReportEditorContent);
  $("#reportBlockFormat").addEventListener("change", (event) => {
    applyReportCommand("formatBlock", event.target.value);
    event.target.value = "P";
  });
  document.querySelectorAll(".editor-command").forEach((button) => {
    button.addEventListener("click", () => applyReportCommand(button.dataset.command));
  });
  $("#printTimeline").addEventListener("click", printTimeline);
  $("#saveScenario").addEventListener("click", downloadScenario);
  $("#loadScenario").addEventListener("click", () => $("#loadScenarioFile").click());
  $("#loadScenarioFile").addEventListener("change", loadScenarioFile);

  ["exerciseName", "facilitator", "exerciseDate", "objective"].forEach((id) => {
    $(`#${id}`).addEventListener("input", () => {
      persist();
      renderReport();
    });
  });

}

async function initializeAuth() {
  bindAuthEvents();

  if (window.location.protocol === "file:") {
    showAuthenticatedUser("Local development");
    return true;
  }

  try {
    const response = await fetch("/.auth/me", {
      credentials: "include",
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
      showAuthGate("Sign in is required to continue.");
      return false;
    }

    const payload = await response.json();
    const principal = Array.isArray(payload.clientPrincipal) ? payload.clientPrincipal[0] : payload.clientPrincipal;
    if (!principal) {
      showAuthGate("Sign in is required to continue.");
      return false;
    }

    showAuthenticatedUser(principal.userDetails || principal.userId || "Bedroc employee");
    return true;
  } catch {
    showAuthGate("Hosted SSO is not available. Use Azure Static Web Apps or App Service authentication for Entra ID.");
    return false;
  }
}

function bindAuthEvents() {
  $("#signInButton").addEventListener("click", signIn);
  $("#signOutButton").addEventListener("click", signOut);
}

function showAuthGate(message) {
  $("#authGateMessage").textContent = message;
  $("#authGate").hidden = false;
}

function showAuthenticatedUser(name) {
  $("#authGate").hidden = true;
  $("#userName").textContent = name;
  $("#userBadge").hidden = false;
}

function signIn() {
  window.location.href = `/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(window.location.href)}`;
}

function signOut() {
  window.location.href = `/.auth/logout?post_logout_redirect_uri=${encodeURIComponent(window.location.origin)}`;
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
  persistRunbooks();
}

function persistRunbooks() {
  localStorage.setItem(runbookStorageKey, JSON.stringify(runbooks));
}

function loadAppSettings() {
  const saved = localStorage.getItem(appSettingsStorageKey);
  if (!saved) return;

  try {
    appSettings = normalizeAppSettings(JSON.parse(saved));
  } catch {
    appSettings = { ...defaultAppSettings };
  }
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

function populateControls() {
  const select = $("#decisionControl");
  select.innerHTML = "";
  controls.forEach((control) => {
    const option = document.createElement("option");
    option.value = control.id;
    option.textContent = `${control.id} - ${control.name}`;
    select.appendChild(option);
  });
}

function populateRunbookControlOptions() {
  const select = $("#adminEventControls");
  if (!select) return;
  select.innerHTML = "";
  controls.forEach((control) => {
    const option = document.createElement("option");
    option.value = control.id;
    option.textContent = `${control.id} - ${control.name}`;
    select.appendChild(option);
  });
}

function populateRunbookSelect() {
  const select = $("#runbookSelect");
  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select a runbook";
  select.appendChild(placeholder);
  runbooks.forEach((runbook) => {
    const option = document.createElement("option");
    option.value = runbook.id;
    option.textContent = runbook.name;
    select.appendChild(option);
  });
  select.value = state.selectedRunbookId;
  select.disabled = Boolean(state.startedAt);
}

function renderInjects() {
  const list = $("#injectList");
  const template = $("#injectTemplate");
  const events = getActiveEvents();
  list.innerHTML = "";

  if (!events.length) {
    const empty = document.createElement("article");
    empty.className = "inject-card";
    empty.innerHTML = `
      <div class="inject-topline">
        <span class="inject-time">No runbook selected</span>
        <span class="inject-phase">Setup</span>
      </div>
      <h3>Select a runbook to begin</h3>
      <p class="inject-summary">Choose a runbook in Exercise Setup to load scenario events for this tabletop.</p>
    `;
    list.appendChild(empty);
    return;
  }

  events.forEach((inject, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const revealed = state.revealed.includes(index);
    node.classList.toggle("revealed", revealed);
    node.querySelector(".inject-time").textContent = `T+${inject.minute} min`;
    node.querySelector(".inject-phase").textContent = inject.phase;
    node.querySelector("h3").textContent = inject.title;
    node.querySelector(".inject-summary").textContent = revealed ? inject.summary : "Scenario event is hidden until the facilitator reveals it.";
    node.querySelector(".prompt-box").textContent = revealed ? inject.prompt : "Reveal this event when the team reaches this point in the scenario.";

    const tags = node.querySelector(".control-tags");
    inject.controls.forEach((controlId) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = controlId;
      tags.appendChild(tag);
    });

    const revealButton = node.querySelector(".reveal-button");
    revealButton.textContent = revealed ? "Revealed" : "Reveal";
    revealButton.disabled = revealed || Boolean(state.completedAt);
    revealButton.addEventListener("click", () => revealInject(index));

    const decisionButton = node.querySelector(".decision-button");
    decisionButton.disabled = !revealed;
    decisionButton.title = revealed ? "Log decision" : "Reveal this event before logging a decision";
    decisionButton.addEventListener("click", () => {
      activateTab("evidence");
      $("#decisionText").value = `Decision for ${inject.title}: `;
      setRelatedEventForForm("decision", index, inject.title);
      $("#decisionOwner").focus();
    });

    const gapButton = node.querySelector(".gap-button");
    gapButton.disabled = !revealed;
    gapButton.title = revealed ? "Create action" : "Reveal this event before creating an action";
    gapButton.addEventListener("click", () => {
      activateTab("actions");
      $("#actionTitle").value = `Gap from ${inject.title}: `;
      setRelatedEventForForm("action", index, inject.title);
      $("#actionOwner").focus();
    });

    list.appendChild(node);
  });
}

function revealInject(index) {
  if (state.completedAt) return;
  if (!state.startedAt) {
    const runbook = getSelectedTemplate();
    state.sessionRunbook = cloneRunbook(runbook);
    state.startedAt = new Date().toISOString();
  }
  if (!state.revealed.includes(index)) state.revealed.push(index);
  const inject = getActiveEvents()[index];
  logEvidence(`Scenario event revealed: ${inject.title}. Prompt: ${inject.prompt}`, "Facilitator", inject.controls[0] || "CC7.4", "Scenario timeline", getEventReference(index));
  persist();
  renderAll();
}

function completeExercise() {
  const events = getActiveEvents();
  if (!state.startedAt || state.completedAt) return;
  if (!events.length || state.revealed.length < events.length) {
    alert("Reveal all scenario events before completing the exercise.");
    return;
  }
  const missingEvidence = getEventsMissingRequiredEvidence();
  if (appSettings.requireEvidenceBeforeCompletion && missingEvidence.length) {
    alert(`Evidence is required before completion.\n\nAdd at least one participant-entered evidence entry for:\n- ${missingEvidence.map((event) => event.title).join("\n- ")}`);
    activateTab("evidence");
    return;
  }
  const checklist = [
    "All intended scenario events revealed",
    "Key decisions captured",
    "Evidence log reviewed",
    "Remediation actions assigned",
    "Report generated or reviewed"
  ].join("\n- ");
  if (!confirm(`Complete this exercise?\n\nPlease confirm:\n- ${checklist}`)) return;

  const completedAt = new Date();
  state.completedDurationSeconds = calculateElapsedSeconds(completedAt.getTime());
  state.completedAt = completedAt.toISOString();
  state.reportEdited = false;
  state.reportHtml = "";
  logEvidence(`Exercise completed. Duration: ${formatDuration(state.completedDurationSeconds)}. Evidence entries: ${state.evidence.length}. Open actions: ${state.actions.filter((action) => action.status === "Open").length}.`, "Facilitator", "CC7.5", "Exercise completion record", getEventReference(Math.max(0, events.length - 1)));
  persist();
  renderAll();
}

function addParticipant() {
  const name = $("#participantName").value.trim();
  if (!name) return;
  const editingIndex = $("#editingParticipantIndex").value;
  if (editingIndex !== "") {
    state.participants[Number(editingIndex)] = { name, role: $("#participantRole").value };
  } else {
    state.participants.push({ name, role: $("#participantRole").value });
  }
  resetParticipantForm();
  persist();
  renderParticipants();
  renderEvidence();
  renderActions();
  renderTimeline();
  renderReport();
}

function renderParticipants() {
  $("#participantCount").textContent = state.participants.length;
  const list = $("#participantList");
  list.innerHTML = "";
  state.participants.forEach((participant, index) => {
    const item = document.createElement("li");
    item.className = "compact-item";
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(participant.name)}</strong>
        <span>${escapeHtml(participant.role)}</span>
      </div>
      <div class="item-actions">
        <button class="edit-participant icon-action" type="button" aria-label="Edit participant" title="Edit participant">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
          </svg>
        </button>
        <button class="delete-participant icon-action danger-icon" type="button" aria-label="Delete participant" title="Delete participant">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M3 6h18"></path>
            <path d="M8 6V4h8v2"></path>
            <path d="M19 6l-1 14H6L5 6"></path>
            <path d="M10 11v5"></path>
            <path d="M14 11v5"></path>
          </svg>
        </button>
      </div>
    `;
    item.querySelector(".edit-participant").addEventListener("click", () => editParticipant(index));
    item.querySelector(".delete-participant").addEventListener("click", () => deleteParticipant(index));
    list.appendChild(item);
  });
  populateOwnerPicklists();
}

function editParticipant(index) {
  const participant = state.participants[index];
  if (!participant) return;
  $("#editingParticipantIndex").value = index;
  $("#participantName").value = participant.name;
  $("#participantRole").value = participant.role;
  $("#addParticipant").textContent = "Save";
  $("#cancelParticipantEdit").hidden = false;
  $("#participantName").focus();
}

function deleteParticipant(index) {
  const participant = state.participants[index];
  if (!participant) return;
  if (!confirm(`Delete participant "${participant.name}"? Existing evidence and actions will keep their recorded owner text.`)) return;
  state.participants.splice(index, 1);
  resetParticipantForm();
  persist();
  renderParticipants();
  renderEvidence();
  renderActions();
  renderTimeline();
  renderReport();
}

function resetParticipantForm() {
  $("#editingParticipantIndex").value = "";
  $("#participantName").value = "";
  $("#participantRole").selectedIndex = 0;
  $("#addParticipant").textContent = "Add";
  $("#cancelParticipantEdit").hidden = true;
}

function populateOwnerPicklists(extraOwner = "") {
  ["decisionOwner", "actionOwner"].forEach((id) => {
    const select = $(`#${id}`);
    if (!select) return;
    const currentValue = select.value || extraOwner;
    select.innerHTML = "";

    const unassigned = document.createElement("option");
    unassigned.value = "";
    unassigned.textContent = state.participants.length ? "Select participant" : "No participants added";
    select.appendChild(unassigned);

    state.participants.forEach((participant) => {
      const option = document.createElement("option");
      option.value = participant.name;
      option.textContent = `${participant.name} (${participant.role})`;
      select.appendChild(option);
    });

    if (currentValue && !state.participants.some((participant) => participant.name === currentValue)) {
      const option = document.createElement("option");
      option.value = currentValue;
      option.textContent = `${currentValue} (not in participant list)`;
      select.appendChild(option);
    }

    select.value = currentValue;
  });
}

function getSelectedOwner(id) {
  return $(`#${id}`).value || "Unassigned";
}

function logEvidence(text, owner, control, evidence, relatedEvent = null) {
  state.evidence.unshift({
    time: new Date().toISOString(),
    text,
    owner,
    control,
    evidence: evidence || "Not recorded",
    relatedEventIndex: relatedEvent?.index ?? null,
    relatedEventTitle: relatedEvent?.title || ""
  });
  persist();
  renderEvidence();
  renderTimeline();
  renderCoverage();
  renderReport();
}

function renderEvidence() {
  const list = $("#evidenceLog");
  list.innerHTML = "";
  state.evidence.forEach((entry, index) => {
    const item = document.createElement("article");
    item.className = "log-item";
    item.innerHTML = `
      <strong>${escapeHtml(entry.text)}</strong>
      <div class="log-meta">
        <span>${formatTime(entry.time)}</span>
        <span>Owner: ${escapeHtml(entry.owner)}</span>
        <span>Control: ${escapeHtml(entry.control)}</span>
        <span>Evidence: ${escapeHtml(entry.evidence)}</span>
      </div>
      <div class="item-actions">
        <button class="edit-evidence icon-action" type="button" aria-label="Edit evidence" title="Edit evidence">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
          </svg>
        </button>
        <button class="delete-evidence icon-action danger-icon" type="button" aria-label="Delete evidence" title="Delete evidence">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M3 6h18"></path>
            <path d="M8 6V4h8v2"></path>
            <path d="M19 6l-1 14H6L5 6"></path>
            <path d="M10 11v5"></path>
            <path d="M14 11v5"></path>
          </svg>
        </button>
      </div>
    `;
    item.querySelector(".edit-evidence").addEventListener("click", () => editEvidence(index));
    item.querySelector(".delete-evidence").addEventListener("click", () => deleteEvidence(index));
    list.appendChild(item);
  });
}

function editEvidence(index) {
  const entry = state.evidence[index];
  if (!entry) return;
  $("#editingEvidenceIndex").value = index;
  $("#decisionText").value = entry.text;
  populateOwnerPicklists(entry.owner);
  const relatedIndex = getRelatedEventIndex(entry, getActiveEvents());
  populateRelatedEventPicklists(relatedIndex);
  $("#decisionOwner").value = entry.owner;
  setRelatedEventForForm("decision", relatedIndex, entry.relatedEventTitle || getActiveEvents()[relatedIndex]?.title || "");
  $("#decisionControl").value = entry.control;
  $("#decisionEvidence").value = entry.evidence === "Not recorded" ? "" : entry.evidence;
  $("#saveEvidenceButton").textContent = "Save evidence";
  $("#cancelEvidenceEdit").hidden = false;
  $("#decisionText").focus();
}

function updateEvidence(index, text, owner, control, evidence, relatedEvent) {
  if (!state.evidence[index]) return;
  state.evidence[index] = {
    ...state.evidence[index],
    editedAt: new Date().toISOString(),
    text,
    owner,
    control,
    evidence: evidence || "Not recorded",
    relatedEventIndex: relatedEvent?.index ?? null,
    relatedEventTitle: relatedEvent?.title || ""
  };
  persist();
  renderEvidence();
  renderTimeline();
  renderCoverage();
  renderReport();
}

function deleteEvidence(index) {
  const entry = state.evidence[index];
  if (!entry) return;
  if (!confirm("Delete this evidence entry?")) return;
  state.evidence.splice(index, 1);
  resetEvidenceForm();
  persist();
  renderEvidence();
  renderTimeline();
  renderCoverage();
  renderReport();
}

function resetEvidenceForm() {
  $("#decisionForm").reset();
  populateOwnerPicklists();
  populateRelatedEventPicklists();
  $("#decisionControl").selectedIndex = 0;
  $("#editingEvidenceIndex").value = "";
  $("#decisionRelatedEventIndex").value = "";
  $("#decisionRelatedEventTitle").value = "";
  $("#saveEvidenceButton").textContent = "Log evidence";
  $("#cancelEvidenceEdit").hidden = true;
}

function resetActionRelatedEvent() {
  $("#actionRelatedEventIndex").value = "";
  $("#actionRelatedEventTitle").value = "";
  populateRelatedEventPicklists();
}

function addAction(title, owner, due, relatedEvent = null) {
  if (!title) return;
  state.actions.unshift({
    time: new Date().toISOString(),
    title,
    owner: owner || "Unassigned",
    due: due || "No due date",
    status: "Open",
    relatedEventIndex: relatedEvent?.index ?? null,
    relatedEventTitle: relatedEvent?.title || ""
  });
  persist();
  renderActions();
  renderTimeline();
  renderReport();
}

function getRelatedEventFromForm(type) {
  syncRelatedEventFromSelect(type);
  const indexField = type === "decision" ? $("#decisionRelatedEventIndex") : $("#actionRelatedEventIndex");
  const titleField = type === "decision" ? $("#decisionRelatedEventTitle") : $("#actionRelatedEventTitle");
  if (!indexField.value && !titleField.value) return null;
  return {
    index: indexField.value === "" ? null : Number(indexField.value),
    title: titleField.value
  };
}

function populateRelatedEventPicklists(selectedIndex = "") {
  ["decision", "action"].forEach((type) => {
    const select = type === "decision" ? $("#decisionRelatedEventSelect") : $("#actionRelatedEventSelect");
    if (!select) return;
    const currentValue = selectedIndex !== "" && selectedIndex !== null && selectedIndex !== undefined ? String(selectedIndex) : select.value;
    select.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select scenario event";
    select.appendChild(placeholder);

    getActiveEvents().forEach((event, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = `T+${event.minute} ${event.title}`;
      select.appendChild(option);
    });

    select.value = currentValue;
    syncRelatedEventFromSelect(type);
  });
}

function setRelatedEventForForm(type, index, title) {
  const select = type === "decision" ? $("#decisionRelatedEventSelect") : $("#actionRelatedEventSelect");
  const indexField = type === "decision" ? $("#decisionRelatedEventIndex") : $("#actionRelatedEventIndex");
  const titleField = type === "decision" ? $("#decisionRelatedEventTitle") : $("#actionRelatedEventTitle");
  if (select) select.value = index === null || index === undefined ? "" : String(index);
  indexField.value = index === null || index === undefined ? "" : String(index);
  titleField.value = title || "";
}

function syncRelatedEventFromSelect(type) {
  const select = type === "decision" ? $("#decisionRelatedEventSelect") : $("#actionRelatedEventSelect");
  if (!select) return;
  const index = select.value === "" ? null : Number(select.value);
  const event = index === null ? null : getActiveEvents()[index];
  setRelatedEventForForm(type, index, event?.title || "");
}

function getEventReference(index) {
  const event = getActiveEvents()[index];
  if (!event) return null;
  return { index, title: event.title };
}

function renderActions() {
  const list = $("#actionList");
  list.innerHTML = "";
  state.actions.forEach((action, index) => {
    const item = document.createElement("article");
    item.className = "action-item";
    item.innerHTML = `
      <strong>${escapeHtml(action.title)}</strong>
      <span>Owner: ${escapeHtml(action.owner)} | Due: ${escapeHtml(action.due)} | Status: ${escapeHtml(action.status)}</span>
      <div class="inject-actions">
        <button data-action="${index}">${action.status === "Open" ? "Mark closed" : "Reopen"}</button>
      </div>
    `;
    item.querySelector("button").addEventListener("click", () => {
      state.actions[index].status = state.actions[index].status === "Open" ? "Closed" : "Open";
      persist();
      renderActions();
      renderTimeline();
      renderReport();
    });
    list.appendChild(item);
  });
}

function renderTimeline() {
  const events = getActiveEvents();
  const list = $("#timelineList");
  const summary = $("#timelineSummary");
  if (!list || !summary) return;

  const revealedCount = state.revealed.length;
  const openActions = state.actions.filter((action) => action.status === "Open").length;
  const relatedEvidence = state.evidence.filter((entry) => getRelatedEventIndex(entry, events) !== null);
  const relatedActions = state.actions.filter((action) => getRelatedEventIndex(action, events) !== null);
  renderTimelinePrintHeader();

  $("#timelineCount").textContent = events.length + relatedEvidence.length + relatedActions.length;
  summary.innerHTML = `
    <div><strong>${events.length}</strong><span>Runbook events</span></div>
    <div><strong>${revealedCount}</strong><span>Revealed</span></div>
    <div><strong>${relatedEvidence.length + relatedActions.length}</strong><span>Linked activity</span></div>
    <div><strong>${state.completedAt ? formatDuration(state.completedDurationSeconds) : openActions}</strong><span>${state.completedAt ? "Duration" : "Open actions"}</span></div>
  `;

  list.innerHTML = "";
  events.forEach((event, index) => {
    const eventEvidence = state.evidence.filter((entry) => getRelatedEventIndex(entry, events) === index);
    const eventActions = state.actions.filter((action) => getRelatedEventIndex(action, events) === index);
    const node = document.createElement("article");
    const revealed = state.revealed.includes(index);
    node.className = `timeline-item event ${revealed ? "complete" : "pending"}`;
    node.innerHTML = `
      <div class="timeline-marker" aria-hidden="true"></div>
      <div class="timeline-content">
        <div class="timeline-topline">
          <span>T+${escapeHtml(event.minute)} min | ${escapeHtml(event.controls.join(", "))}</span>
          <span class="status-pill">${escapeHtml(event.phase)}</span>
        </div>
        <h3>${escapeHtml(event.title)}</h3>
        <p>${escapeHtml(event.summary || "No detail recorded.")}</p>
        ${buildTimelineActivity(eventEvidence, eventActions)}
      </div>
    `;
    list.appendChild(node);
  });

}

function renderTimelinePrintHeader() {
  const header = $("#timelinePrintHeader");
  if (!header) return;
  const { runbook } = getReportData();
  const organizationName = getOrganizationName();
  header.innerHTML = `
    <div>
      <p class="eyebrow">Incident timeline</p>
      <h1>${escapeHtml(organizationName)} ${escapeHtml(runbook.name)}</h1>
      <div class="timeline-print-meta">
        <span>Generated: <strong>${escapeHtml(formatTime(new Date().toISOString()))}</strong></span>
      </div>
    </div>
    <img src="${escapeHtml(getDocumentLogoSource())}" alt="${escapeHtml(organizationName)}" />
  `;
}

function buildTimelineActivity(evidenceItems, actionItems) {
  if (!evidenceItems.length && !actionItems.length) {
    return `<div class="timeline-activity empty">No evidence or actions documented for this event.</div>`;
  }

  const activity = [
    ...evidenceItems.map((entry) => ({
      type: "Evidence",
      time: entry.time,
      meta: `${formatTime(entry.time)} | ${entry.owner} | ${entry.control}`,
      text: entry.text
    })),
    ...actionItems.map((action) => ({
      type: "Action",
      time: action.time,
      meta: `${action.time ? formatTime(action.time) : "Time not recorded"} | ${action.owner} | ${action.status}`,
      text: action.title
    }))
  ].sort((a, b) => getTimeValue(a.time) - getTimeValue(b.time));

  const activityHtml = activity.map((item) => `
    <li>
      <strong>${escapeHtml(item.type)}</strong>
      <span>${escapeHtml(item.meta)}</span>
      <p>${escapeHtml(item.text)}</p>
    </li>
  `).join("");

  return `<ul class="timeline-activity">${activityHtml}</ul>`;
}

function getTimeValue(value) {
  const timestamp = new Date(value || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : Number.MAX_SAFE_INTEGER;
}

function getRelatedEventIndex(item, events) {
  if (Number.isInteger(item.relatedEventIndex) && events[item.relatedEventIndex]) return item.relatedEventIndex;
  if (item.relatedEventTitle) {
    const match = events.findIndex((event) => event.title === item.relatedEventTitle);
    if (match >= 0) return match;
  }
  return null;
}

function printTimeline() {
  renderTimeline();
  const originalTitle = document.title;
  document.title = " ";
  document.body.classList.add("print-timeline");
  window.print();
  window.setTimeout(() => {
    document.body.classList.remove("print-timeline");
    document.title = originalTitle;
  }, 300);
}

function printReport() {
  saveReportEditorContent();
  document.body.classList.add("print-report");
  window.print();
  window.setTimeout(() => document.body.classList.remove("print-report"), 300);
}

function renderCoverage() {
  const wrapper = $("#controlCoverage");
  const events = getActiveEvents();
  const eventWeight = appSettings.coverageEventWeight;
  const evidenceWeight = appSettings.coverageEvidenceWeight;
  wrapper.innerHTML = "";
  controls.forEach((control) => {
    const eventCoverage = events.filter((event, index) => event.controls.includes(control.id) && state.revealed.includes(index)).length;
    const evidenceCoverage = state.evidence.filter((entry) => entry.control === control.id).length;
    const score = Math.min(100, (eventCoverage * eventWeight) + (evidenceCoverage * evidenceWeight));
    const item = document.createElement("div");
    item.className = "coverage-item";
    item.innerHTML = `
      <strong>${control.id}</strong>
      <span>${control.name} | ${score}% covered</span>
      <div class="coverage-meter"><div style="width: ${score}%"></div></div>
    `;
    wrapper.appendChild(item);
  });
}

function renderSetupRunbookMeta() {
  const runbook = getActiveRunbook();
  if (!state.startedAt && !state.selectedRunbookId) {
    $("#selectedRunbookMeta").textContent = "No runbook selected. Choose a runbook before starting the exercise.";
    $("#startExercise").textContent = "Select runbook to start";
    $("#startExercise").disabled = true;
    return;
  }
  const mode = state.startedAt ? "Locked session snapshot" : "Template";
  const completionText = state.completedAt ? ` | Completed ${formatTime(state.completedAt)} | Duration ${formatDuration(state.completedDurationSeconds)}` : "";
  $("#selectedRunbookMeta").textContent = `${mode}: ${runbook.name} | ${runbook.events.length} scenario event(s).${completionText}`;
  $("#startExercise").textContent = state.completedAt ? "Exercise complete" : state.startedAt ? "Exercise active" : "Start exercise";
  $("#startExercise").disabled = Boolean(state.startedAt);
  renderCompletionPanel();
}

function renderCompletionPanel() {
  const panel = $("#completionPanel");
  const events = getActiveEvents();
  const ready = Boolean(state.startedAt && !state.completedAt && events.length && state.revealed.length >= events.length);
  panel.hidden = !ready;
  if (!ready) return;

  const missingEvidence = getEventsMissingRequiredEvidence();
  const button = $("#completeExercise");
  const message = $("#completionPanelMessage");
  const evidenceRequired = appSettings.requireEvidenceBeforeCompletion;
  button.disabled = evidenceRequired && missingEvidence.length > 0;
  message.textContent = evidenceRequired && missingEvidence.length
    ? `${missingEvidence.length} scenario event(s) still need participant-entered evidence before closing.`
    : "All scenario events have been revealed. Review decisions, evidence, and actions before closing the exercise.";
}

function renderAppTitle() {
  const runbook = getActiveRunbook();
  $("#appTitle").textContent = runbook.name || "Incident Tabletop";
}

function renderBranding() {
  const organizationName = getOrganizationName();
  const logoSrc = getAppLogoSource();
  applyColorPalette();
  document.querySelectorAll(".brand-lockup img, .auth-card img, .splash-nav img").forEach((image) => {
    image.src = logoSrc;
    image.alt = organizationName;
  });
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

function renderReport() {
  if (!state.reportEdited || !state.reportHtml) {
    state.reportHtml = buildReportHtml();
  }
  $("#reportDocument").innerHTML = state.reportHtml;
  $("#exerciseStatus").textContent = state.completedAt ? "Complete" : state.startedAt ? "Active" : "Draft";
}

function saveReportEditorContent() {
  state.reportEdited = true;
  state.reportHtml = $("#reportDocument").innerHTML;
  persist();
}

function applyReportCommand(command, value = null) {
  $("#reportDocument").focus();
  document.execCommand(command, false, value);
  saveReportEditorContent();
}

function regenerateReport() {
  if (state.reportEdited && !confirm("Regenerate the report from exercise data? This will replace your manual report edits.")) return;
  state.reportEdited = false;
  state.reportHtml = buildReportHtml();
  persist();
  renderReport();
}

function getReportData() {
  const name = $("#exerciseName").value || "Bedroc Ransomware Response Tabletop";
  const date = $("#exerciseDate").value || new Date().toISOString().slice(0, 10);
  const facilitator = $("#facilitator").value || "Not recorded";
  const objective = $("#objective").value || "Not recorded";
  const runbook = getActiveRunbook();
  const events = getActiveEvents();

  return { name, date, facilitator, objective, runbook, events };
}

function buildReportHtml() {
  const { name, date, facilitator, objective, runbook, events } = getReportData();
  const status = state.startedAt ? "Active exercise" : "Draft";
  const displayStatus = state.completedAt ? "Complete" : status;
  const source = getRunbookSourceLabel();
  const organizationName = getOrganizationName();

  return `
    <header class="report-cover">
      <img class="report-logo" src="${escapeHtml(getDocumentLogoSource())}" alt="${escapeHtml(organizationName)}" />
      <p class="eyebrow">SOC 2 tabletop report</p>
      <h1>${escapeHtml(organizationName)} ${escapeHtml(runbook.name)}</h1>
      <div class="report-meta-grid">
        <div><span>Prepared for</span><strong>${escapeHtml(organizationName)}</strong></div>
        <div><span>Date</span><strong>${escapeHtml(date)}</strong></div>
        <div><span>Facilitator</span><strong>${escapeHtml(facilitator)}</strong></div>
        <div><span>Status</span><strong>${escapeHtml(displayStatus)}</strong></div>
        <div><span>Duration</span><strong>${escapeHtml(state.completedAt ? formatDuration(state.completedDurationSeconds) : "In progress")}</strong></div>
        <div><span>Runbook</span><strong>${escapeHtml(runbook.name)}</strong></div>
        <div><span>Runbook source</span><strong>${escapeHtml(source)}</strong></div>
      </div>
    </header>

    <section class="report-section">
      <h2>Objective</h2>
      <p>${escapeHtml(objective)}</p>
    </section>

    <section class="report-section">
      <h2>Participants</h2>
      ${buildReportList(state.participants, (participant) => `<strong>${escapeHtml(participant.name)}</strong><span>${escapeHtml(participant.role)}</span>`, "No participants recorded")}
    </section>

    <section class="report-section">
      <h2>Scenario Timeline</h2>
      ${buildReportList(events, (event, index) => {
        const revealStatus = state.revealed.includes(index) ? "Revealed" : "Not revealed";
        return `<strong>T+${escapeHtml(event.minute)} ${escapeHtml(event.title)}</strong><span>${escapeHtml(revealStatus)} | ${escapeHtml(event.controls.join(", "))}</span>`;
      }, "No scenario events recorded")}
    </section>

    <section class="report-section">
      <h2>Decision and Evidence Log</h2>
      ${buildReportList(state.evidence, (entry) => `<strong>${escapeHtml(entry.text)}</strong><span>${escapeHtml(formatTime(entry.time))} | ${escapeHtml(entry.control)} | Owner: ${escapeHtml(entry.owner)} | Evidence: ${escapeHtml(entry.evidence)}</span>`, "No evidence logged")}
    </section>

    <section class="report-section">
      <h2>SOC 2 Control Coverage</h2>
      ${buildReportList(controls, (control) => {
        const count = state.evidence.filter((entry) => entry.control === control.id).length;
        return `<strong>${escapeHtml(control.id)} ${escapeHtml(control.name)}</strong><span>${count} evidence item(s)</span>`;
      }, "No control coverage recorded")}
    </section>

    <section class="report-section">
      <h2>Remediation Tracker</h2>
      ${buildReportList(state.actions, (action) => `<strong>${escapeHtml(action.title)}</strong><span>Owner: ${escapeHtml(action.owner)} | Due: ${escapeHtml(action.due)} | Status: ${escapeHtml(action.status)}</span>`, "No remediation actions recorded")}
    </section>

    <section class="report-section">
      <h2>Facilitator Notes</h2>
      <ul class="report-list">
        <li><strong>Incident authority</strong><span>Confirm incident commander authority and backup restore approval path.</span></li>
        <li><strong>Evidence retention</strong><span>Retain chat transcripts, tickets, alert details, meeting notes, and executive communications as supporting evidence.</span></li>
        <li><strong>Follow-up</strong><span>Review open remediation items in the next risk or security governance meeting.</span></li>
      </ul>
    </section>
  `;
}

function buildReportText() {
  const { name, date, facilitator, objective, runbook, events } = getReportData();
  const organizationName = getOrganizationName();
  const participantLines = state.participants.length ? state.participants.map((p) => `- ${p.name} (${p.role})`).join("\n") : "- No participants recorded";
  const eventLines = events.map((event, index) => `- T+${event.minute} ${event.title} [${state.revealed.includes(index) ? "Revealed" : "Not revealed"}] (${event.controls.join(", ")})`).join("\n");
  const evidenceLines = state.evidence.length ? state.evidence.map((entry) => `- ${formatTime(entry.time)} | ${entry.control} | ${entry.owner} | ${entry.text} | Evidence: ${entry.evidence}`).join("\n") : "- No evidence logged";
  const actionLines = state.actions.length ? state.actions.map((action) => `- ${action.title} | Owner: ${action.owner} | Due: ${action.due} | Status: ${action.status}`).join("\n") : "- No remediation actions recorded";
  const controlLines = controls.map((control) => `- ${control.id} ${control.name}: ${state.evidence.filter((entry) => entry.control === control.id).length} evidence item(s)`).join("\n");
  return `${name}

Prepared for: ${organizationName}
Date: ${date}
Facilitator: ${facilitator}
Status: ${state.startedAt ? "Active exercise" : "Draft"}
Completed: ${state.completedAt ? formatTime(state.completedAt) : "Not completed"}
Duration: ${state.completedAt ? formatDuration(state.completedDurationSeconds) : "In progress"}
Runbook: ${runbook.name}
Runbook source: ${getRunbookSourceLabel()}

Objective
${objective}

Participants
${participantLines}

Scenario Timeline
${eventLines}

Decision and Evidence Log
${evidenceLines}

SOC 2 Control Coverage
${controlLines}

Remediation Tracker
${actionLines}`;
}

function buildReportList(items, template, emptyText) {
  if (!items.length) return `<p class="report-empty">${escapeHtml(emptyText)}</p>`;
  return `<ul class="report-list">${items.map((item, index) => `<li>${template(item, index)}</li>`).join("")}</ul>`;
}

function getRunbookSourceLabel() {
  if (state.sessionRunbook) return "Locked session snapshot";
  if (state.selectedRunbookId) return "Selected runbook template";
  return "No runbook selected";
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
  populateRunbookSelect();
  renderAll();
  renderRunbookAdmin();
  $("#runbookAdminNotice").textContent = "Runbook saved.";
}

function saveAdminEvent(event) {
  event.preventDefault();
  syncAdminRunbookFields();
  saveCurrentAdminEvent();
  persistRunbooks();
  populateRunbookSelect();
  renderAll();
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
  populateRunbookSelect();
  renderAdminRunbookList();
  renderSetupRunbookMeta();
  renderAppTitle();
  renderReport();
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
  if (state.startedAt && state.selectedRunbookId === runbook.id) {
    alert("This runbook was used to start the active exercise. Reset the exercise before deleting it.");
    return;
  }
  if (!confirm(`Delete runbook "${runbook.name}"?`)) return;
  runbooks = runbooks.filter((item) => item.id !== runbook.id);
  if (state.selectedRunbookId === runbook.id) state.selectedRunbookId = runbooks[0].id;
  adminRunbookId = state.selectedRunbookId;
  adminEventIndex = 0;
  persistRunbooks();
  populateRunbookSelect();
  renderAll();
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
  const payload = {
    schema: runbookSchema,
    exportedAt: new Date().toISOString(),
    runbook
  };
  downloadJson(payload, `${slugify(runbook.name)}-runbook.json`);
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
      populateRunbookSelect();
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
  const notice = state.startedAt
    ? "The active exercise is using a locked runbook snapshot. Template edits will apply to future exercises."
    : "Choose a runbook before starting. Starting the exercise locks a snapshot for the audit record.";
  $("#runbookAdminNotice").textContent = notice;
}

function copyReport() {
  const html = getReportEditorHtml();
  const text = $("#reportDocument").innerText || buildReportText();
  if (window.ClipboardItem) {
    navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" })
      })
    ]);
    return;
  }
  navigator.clipboard.writeText(text);
}

function getReportEditorHtml() {
  const editor = $("#reportDocument");
  return editor.innerHTML || state.reportHtml || buildReportHtml();
}

function downloadScenario() {
  const scenario = {
    schema: scenarioSchema,
    exportedAt: new Date().toISOString(),
    formState: getFormState(),
    state
  };
  downloadJson(scenario, `${slugify($("#exerciseName").value || "bedroc-ransomware-tabletop")}-scenario.json`);
}

function loadScenarioFile(event) {
  const [file] = event.target.files;
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const scenario = JSON.parse(reader.result);
      if (scenario.schema !== scenarioSchema) throw new Error("Unsupported scenario file.");
      restoreScenario(scenario);
    } catch (error) {
      alert(`Unable to load scenario: ${error.message}`);
    } finally {
      event.target.value = "";
    }
  });
  reader.readAsText(file);
}

function restoreScenario(scenario) {
  const loadedState = {
    startedAt: null,
    completedAt: null,
    completedDurationSeconds: null,
    selectedRunbookId: "",
    sessionRunbook: null,
    participants: [],
    revealed: [],
    evidence: [],
    actions: [],
    reportHtml: "",
    reportEdited: false
  };
  Object.assign(loadedState, scenario.state || {});
  loadedState.participants = Array.isArray(loadedState.participants) ? loadedState.participants : [];
  loadedState.revealed = Array.isArray(loadedState.revealed) ? loadedState.revealed : [];
  loadedState.evidence = Array.isArray(loadedState.evidence) ? loadedState.evidence : [];
  loadedState.actions = Array.isArray(loadedState.actions) ? loadedState.actions : [];
  loadedState.completedAt = loadedState.completedAt || null;
  loadedState.completedDurationSeconds = Number.isFinite(Number(loadedState.completedDurationSeconds)) ? Number(loadedState.completedDurationSeconds) : null;
  loadedState.reportHtml = typeof loadedState.reportHtml === "string" ? loadedState.reportHtml : "";
  loadedState.reportEdited = Boolean(loadedState.reportEdited);
  loadedState.sessionRunbook = loadedState.sessionRunbook ? normalizeRunbook(loadedState.sessionRunbook) : null;
  Object.assign(state, loadedState);
  ensureStateShape();

  Object.entries(scenario.formState || {}).forEach(([key, value]) => {
    const field = $(`#${key}`);
    if (field) field.value = value;
  });

  persist();
  populateRunbookSelect();
  renderAll();
  activateTab("runbook");
}

function activateTab(id) {
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === id));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === id));
  if (id === "report") renderReport();
}

function updateTimer() {
  if (!state.startedAt) {
    $("#elapsedTime").textContent = "00:00";
    return;
  }
  $("#elapsedTime").textContent = formatDuration(getElapsedSeconds());
}

function getElapsedSeconds() {
  if (!state.startedAt) return 0;
  if (state.completedAt && Number.isFinite(Number(state.completedDurationSeconds)) && Number(state.completedDurationSeconds) > 0) {
    return Number(state.completedDurationSeconds);
  }
  const end = state.completedAt ? new Date(state.completedAt).getTime() : Date.now();
  return calculateElapsedSeconds(end);
}

function calculateElapsedSeconds(endTime = Date.now()) {
  if (!state.startedAt) return 0;
  const startedTime = new Date(state.startedAt).getTime();
  if (!Number.isFinite(startedTime) || !Number.isFinite(endTime)) return 0;
  return Math.max(0, Math.floor((endTime - startedTime) / 1000));
}

function formatDuration(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderAll() {
  renderBranding();
  populateRunbookSelect();
  populateRelatedEventPicklists();
  renderAppTitle();
  renderSetupRunbookMeta();
  renderInjects();
  renderParticipants();
  renderEvidence();
  renderActions();
  renderTimeline();
  renderCoverage();
  renderReport();
  updateTimer();
}

function persist() {
  const formState = getFormState();
  localStorage.setItem(scenarioStorageKey, JSON.stringify({ state, formState }));
}

function getFormState() {
  return {
    exerciseName: $("#exerciseName").value,
    facilitator: $("#facilitator").value,
    exerciseDate: $("#exerciseDate").value,
    objective: $("#objective").value
  };
}

function restore() {
  const saved = localStorage.getItem(scenarioStorageKey);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed.state || {});
    Object.entries(parsed.formState || {}).forEach(([key, value]) => {
      const field = $(`#${key}`);
      if (field) field.value = value;
    });
  } catch {
    localStorage.removeItem(scenarioStorageKey);
  }
}

function ensureStateShape() {
  state.selectedRunbookId = state.selectedRunbookId || "";
  if (!state.startedAt) state.selectedRunbookId = "";
  if (state.selectedRunbookId && !runbooks.some((runbook) => runbook.id === state.selectedRunbookId)) {
    state.selectedRunbookId = "";
  }
  state.participants = Array.isArray(state.participants) ? state.participants : [];
  state.revealed = Array.isArray(state.revealed) ? state.revealed : [];
  state.evidence = Array.isArray(state.evidence) ? state.evidence : [];
  state.actions = Array.isArray(state.actions) ? state.actions : [];
  state.completedAt = state.completedAt || null;
  state.completedDurationSeconds = Number.isFinite(Number(state.completedDurationSeconds)) ? Number(state.completedDurationSeconds) : null;
  if (state.startedAt && state.completedAt && (!state.completedDurationSeconds || state.completedDurationSeconds <= 0)) {
    state.completedDurationSeconds = calculateElapsedSeconds(new Date(state.completedAt).getTime());
  }
  state.reportHtml = typeof state.reportHtml === "string" ? state.reportHtml : "";
  state.reportEdited = Boolean(state.reportEdited);
  state.sessionRunbook = state.sessionRunbook ? normalizeRunbook(state.sessionRunbook) : null;
}

function getSelectedTemplate() {
  if (!state.selectedRunbookId) return null;
  return runbooks.find((runbook) => runbook.id === state.selectedRunbookId) || null;
}

function getActiveRunbook() {
  return state.sessionRunbook || getSelectedTemplate() || emptyRunbook;
}

function getActiveEvents() {
  return getActiveRunbook().events;
}

function getOrganizationName() {
  return appSettings.organizationName || defaultAppSettings.organizationName;
}

function getAppLogoSource() {
  return appSettings.appLogoDataUrl || defaultAppLogoSource;
}

function getDocumentLogoSource() {
  return appSettings.documentLogoDataUrl || appSettings.logoDataUrl || defaultDocumentLogoSource;
}

function isParticipantEnteredEvidence(entry) {
  return !["Scenario timeline", "Runbook snapshot", "Exercise completion record"].includes(entry.evidence);
}

function getEventsMissingRequiredEvidence() {
  const events = getActiveEvents();
  return events.filter((event, index) => {
    if (!state.revealed.includes(index)) return false;
    return !state.evidence.some((entry) => getRelatedEventIndex(entry, events) === index && isParticipantEnteredEvidence(entry));
  });
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

function normalizePercent(value, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(100, Math.round(number)));
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

function getAdminRunbook() {
  return runbooks.find((runbook) => runbook.id === adminRunbookId) || runbooks[0];
}

function normalizeRunbook(runbook) {
  return {
    id: runbook.id || makeId("runbook"),
    name: runbook.name || "Untitled runbook",
    description: runbook.description || "",
    objective: runbook.objective || "",
    events: Array.isArray(runbook.events) && runbook.events.length
      ? runbook.events.map(normalizeEvent)
      : [createBlankEvent()]
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

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
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
