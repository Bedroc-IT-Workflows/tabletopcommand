const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../outputs/app.js'), 'utf8').replace(/init\(\);\s*$/, '');

function app() {
  let now = 0;
  const elements = new Map();
  const context = vm.createContext({
    Date: class extends Date {
      constructor(...args) { super(...(args.length ? args : [now])); }
      static now() { return now; }
    },
    document: { querySelector: (selector) => {
      if (!elements.has(selector)) elements.set(selector, {});
      return elements.get(selector);
    } },
    localStorage: { setItem() {} },
    confirm: () => true
  });
  vm.runInContext(source, context);
  const run = (code) => vm.runInContext(code, context);
  run(`renderAll = () => {}; renderEvidenceDependentViews = () => {};
    populateRunbookSelect = () => {}; activateTab = () => {};
    state.startedAt = new Date(0).toISOString();
    state.sessionRunbook = cloneRunbook(defaultRunbook);`);
  return { run, at: (seconds) => { now = seconds * 1000; }, elements };
}

test('repeated pauses freeze time and preserve historical event elapsed times', () => {
  const { run, at } = app();
  at(10); run('toggleExercisePause()');
  at(70); assert.equal(run('getElapsedSeconds()'), 10);
  run('toggleExercisePause()');
  at(80); assert.equal(run('getElapsedSeconds()'), 20);
  run('toggleExercisePause()');
  at(100); run('toggleExercisePause()');
  at(110); assert.equal(run('getElapsedSeconds()'), 30);
  assert.equal(run('calculateElapsedSeconds(5000)'), 5);
  assert.equal(run('calculateElapsedSeconds(40000)'), 10);
  assert.equal(run('calculateElapsedSeconds(75000)'), 15);
  assert.equal(run('state.evidence.filter(e => e.evidence === "Exercise pause record").length'), 4);
});

test('paused scenarios block reveal and completion and show resume controls', () => {
  const { run, at, elements } = app();
  at(10); run('toggleExercisePause(); revealInject(0); completeExercise(); renderSetupRunbookMeta()');
  assert.equal(run('state.revealed.length'), 0);
  assert.equal(run('state.completedAt'), null);
  assert.equal(elements.get('#pauseExercise').textContent, 'Resume exercise');
  assert.equal(elements.get('#pauseNotice').hidden, false);
  at(20); run('toggleExercisePause(); revealInject(0); renderSetupRunbookMeta()');
  assert.equal(run('state.revealed.length'), 1);
  assert.equal(elements.get('#pauseExercise').textContent, 'Pause exercise');
  assert.equal(elements.get('#pauseNotice').hidden, true);
});

test('JSON restoration keeps an open pause frozen and older saves default to no pauses', () => {
  const { run, at } = app();
  at(10); run('toggleExercisePause(); globalThis.saved = JSON.parse(JSON.stringify({ state }))');
  at(500); run('restoreScenario(saved)');
  assert.equal(run('isExercisePaused()'), true);
  assert.equal(run('getElapsedSeconds()'), 10);
  run('toggleExercisePause()');
  at(510); assert.equal(run('getElapsedSeconds()'), 20);
  run('delete saved.state.pauses; restoreScenario(saved)');
  assert.equal(run('isExercisePaused()'), false);
  assert.equal(run('getElapsedSeconds()'), 510);
});

test('completion excludes pauses, stays frozen, and cannot be paused again', () => {
  const { run, at } = app();
  at(10); run('toggleExercisePause()');
  at(70); run('toggleExercisePause(); state.revealed = getActiveEvents().map((_, i) => i); appSettings.requireEvidenceBeforeCompletion = false');
  at(90); run('completeExercise()');
  at(200); assert.equal(run('getElapsedSeconds()'), 30);
  run('toggleExercisePause(); renderSetupRunbookMeta()');
  assert.equal(run('state.pauses.length'), 1);
  assert.equal(run('isExercisePaused()'), false);
});

test('draft scenarios cannot pause', () => {
  const { run } = app();
  run('state.startedAt = null; toggleExercisePause()');
  assert.equal(run('state.pauses.length'), 0);
});
