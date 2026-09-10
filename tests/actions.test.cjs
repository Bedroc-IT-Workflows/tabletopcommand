const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../outputs/app.js'), 'utf8').replace(/init\(\);\s*$/, '');
function app() {
  const fields = new Map();
  const element = () => ({value: '', innerHTML: '', reset() {}, focus() {}, appendChild() {}});
  const storage = new Map();
  const ctx = vm.createContext({document: {
    querySelector: key => { if (!fields.has(key)) fields.set(key, element()); return fields.get(key); },
    createElement: element
  }, localStorage: {setItem: (k,v) => storage.set(k,v), getItem: k => storage.get(k)}});
  vm.runInContext(source, ctx);
  const run = s => vm.runInContext(s, ctx);
  run('renderAll=()=>{}; renderActions=()=>{}; renderTimeline=()=>{}; renderReport=()=>{}; populateRunbookSelect=()=>{}; activateTab=()=>{}; state.sessionRunbook=cloneRunbook(defaultRunbook)');
  return {run, fields};
}
test('legacy JSON actions load, edit in place, and retain status, timestamp and legacy data on save', () => {
  const {run} = app();
  run(`restoreScenario({state:{actions:[{title:'Old action',owner:'Former participant',due:'2026-12-01',status:'Closed',time:'2026-09-01T12:00:00Z',relatedEventIndex:0}]}});
    editAction(0); updateAction(editingAction,'Updated action','New owner',{index:1,title:'Next event'});`);
  const action = JSON.parse(run('JSON.stringify(state.actions[0])'));
  assert.equal(action.title,'Updated action');
  assert.equal(action.owner,'New owner');
  assert.equal(action.status,'Closed');
  assert.equal(action.time,'2026-09-01T12:00:00Z');
  assert.equal(action.due,'2026-12-01');
  assert.equal(action.relatedEventIndex,1);
  assert.ok(action.editedAt);
  assert.equal(run('JSON.parse(localStorage.getItem(scenarioStorageKey)).state.actions[0].due'),'2026-12-01');
  assert.equal(run('state.actions.length'),1);
});
test('new actions need no date and cancel leaves an existing action unchanged', () => {
  const {run,fields} = app();
  run(`addAction('Follow up','Owner',{index:0,title:'Event'}); editAction(0)`);
  assert.equal(fields.get('#saveAction').textContent,'Save action');
  fields.get('#actionTitle').value='Unsaved';
  run('resetActionForm()');
  assert.equal(run('state.actions[0].title'),'Follow up');
  assert.equal(run('Object.hasOwn(state.actions[0],"due")'),false);
  assert.equal(run('editingAction'),null);
  assert.equal(fields.get('#cancelActionEdit').hidden,true);
});
test('loading another exercise clears editing and stale edits cannot change its actions', () => {
  const {run} = app();
  run(`addAction('Original','Owner'); editAction(0); globalThis.previous=editingAction;
    restoreScenario({state:{actions:[{title:'Imported',owner:'Owner',status:'Open'}]}});
    updateAction(previous,'Wrong edit','Owner');`);
  assert.equal(run('editingAction'),null);
  assert.equal(run('state.actions[0].title'),'Imported');
});
