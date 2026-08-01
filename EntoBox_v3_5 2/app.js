(() => {
  'use strict';

  const STATE_KEY = 'entobox-v3-spatial-state';
  const DEMO_BG = 'assets/demo-box.svg';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const uid = () => crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const esc = (v) => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const deepClone = (o) => JSON.parse(JSON.stringify(o));
  const nowISO = () => new Date().toISOString();
  const shown = (value, fallback = '—') => String(value ?? '').trim() || fallback;

  const sizePresets = {
    xs: { label: 'XS', w: 10, h: 10 },
    s:  { label: 'S',  w: 18, h: 16 },
    m:  { label: 'M',  w: 30, h: 24 },
    l:  { label: 'L',  w: 48, h: 36 },
    xl: { label: 'XL', w: 78, h: 55 }
  };

  function specimen(data) {
    return {
      id: data.id || uid(),
      catalogNumber: data.catalogNumber || '',
      scientificName: data.scientificName || 'Unidentified specimen',
      collectionCode: data.collectionCode ?? '',
      locality: data.locality ?? '',
      recordedBy: data.recordedBy ?? '',
      eventDate: data.eventDate || '',
      identifiedBy: data.identifiedBy ?? '',
      condition: data.condition || 'Not assessed',
      notes: data.notes || '',
      preparationType: data.preparationType || 'Pinned',
      boxId: data.boxId ?? null,
      targetBoxId: data.targetBoxId ?? null,
      x: Number.isFinite(data.x) ? data.x : null,
      y: Number.isFinite(data.y) ? data.y : null,
      footprintWidthMm: Number(data.footprintWidthMm) || 30,
      footprintHeightMm: Number(data.footprintHeightMm) || 24,
      zoneId: data.zoneId || null,
      photoThumb: data.photoThumb || null,
      icon: data.icon || iconForTaxon(data.scientificName),
      updatedAt: data.updatedAt || nowISO()
    };
  }

  function iconForTaxon(name = '') {
    const n = name.toLowerCase();
    if (/papilio|moth|lepidop|butter/.test(n)) return '🦋';
    if (/bombus|apis|vespa|hymen|bee|wasp/.test(n)) return '🐝';
    if (/tachina|eristalis|dipter|fly/.test(n)) return '🪰';
    if (/odonata|libell|dragon/.test(n)) return '🪶';
    return '🪲';
  }

  function defaultState() {
    const boxA = 'box-cerambycidae';
    const boxB = 'box-diptera';
    const boxC = 'box-teaching';
    const zoneRosalia = 'zone-rosalia';
    const zoneLepturinae = 'zone-lepturinae';
    const zoneLarge = 'zone-large';
    const buildingA = 'loc-building-a';
    const room214 = 'loc-room-214';
    const cabinetC17 = 'loc-cabinet-c17';
    const drawer04 = 'loc-drawer-04';
    const cabinetD03 = 'loc-cabinet-d03';
    const drawer11 = 'loc-drawer-11';
    const buildingB = 'loc-building-b';
    const teachingLab = 'loc-teaching-lab';
    const placed = [
      specimen({catalogNumber:'ENT-CH-000184',scientificName:'Rosalia alpina',locality:'Val Müstair, GR, Switzerland',recordedBy:'S. S.',eventDate:'2026-07-18',identifiedBy:'S. S.',boxId:boxA,x:19,y:21,footprintWidthMm:42,footprintHeightMm:34,zoneId:zoneRosalia}),
      specimen({catalogNumber:'ENT-CH-000185',scientificName:'Aromia moschata',locality:'Thurauen, ZH, Switzerland',recordedBy:'A. Meier',eventDate:'2025-07-11',identifiedBy:'L. M.',boxId:boxA,x:31,y:25,footprintWidthMm:48,footprintHeightMm:32,zoneId:zoneRosalia}),
      specimen({catalogNumber:'ENT-CH-000186',scientificName:'Leptura quadrifasciata',locality:'Sihlwald, ZH, Switzerland',recordedBy:'R. Frei',eventDate:'2024-06-20',identifiedBy:'L. M.',boxId:boxA,x:57,y:18,footprintWidthMm:30,footprintHeightMm:24,zoneId:zoneLepturinae}),
      specimen({catalogNumber:'ENT-HR-000187',scientificName:'Cerambyx cerdo',locality:'Krk, Croatia',recordedBy:'UZH field course',eventDate:'2026-07-14',identifiedBy:'O. H.',boxId:boxA,x:79,y:28,footprintWidthMm:82,footprintHeightMm:52,zoneId:zoneLarge,condition:'Attention',notes:'Right antenna detached; stored in microvial.'}),
      specimen({catalogNumber:'ENT-CH-000188',scientificName:'Stictoleptura rubra',locality:'Ticino, Switzerland',recordedBy:'J. Keller',eventDate:'2023-08-06',identifiedBy:'L. M.',boxId:boxA,x:54,y:38,footprintWidthMm:28,footprintHeightMm:22,zoneId:zoneLepturinae}),
      specimen({catalogNumber:'ENT-CH-000189',scientificName:'Stenurella melanura',locality:'Pfannenstiel, ZH, Switzerland',recordedBy:'S. S.',eventDate:'2026-06-28',identifiedBy:'S. S.',boxId:boxA,x:67,y:44,footprintWidthMm:18,footprintHeightMm:16,zoneId:zoneLepturinae}),
      specimen({catalogNumber:'ENT-CH-000190',scientificName:'Rutpela maculata',locality:'Uetliberg, ZH, Switzerland',recordedBy:'R. Frei',eventDate:'2024-07-09',identifiedBy:'L. M.',boxId:boxA,x:47,y:56,footprintWidthMm:26,footprintHeightMm:22,zoneId:zoneLepturinae}),
      specimen({catalogNumber:'ENT-CH-000191',scientificName:'Prionus coriarius',locality:'Basel-Landschaft, Switzerland',recordedBy:'N. Baumann',eventDate:'2021-08-03',identifiedBy:'O. H.',boxId:boxA,x:78,y:58,footprintWidthMm:70,footprintHeightMm:48,zoneId:zoneLarge}),
      specimen({catalogNumber:'ENT-CH-000192',scientificName:'Clytus arietis',locality:'Baden, AG, Switzerland',recordedBy:'S. S.',eventDate:'2026-05-25',identifiedBy:'S. S.',boxId:boxA,x:20,y:69,footprintWidthMm:24,footprintHeightMm:20}),
      specimen({catalogNumber:'ENT-CH-000193',scientificName:'Monochamus sartor',locality:'Engadin, GR, Switzerland',recordedBy:'P. Roth',eventDate:'2018-08-12',identifiedBy:'O. H.',boxId:boxA,x:38,y:78,footprintWidthMm:72,footprintHeightMm:52,zoneId:zoneLarge}),
      specimen({catalogNumber:'ENT-CH-000200',scientificName:'Tachina fera',collectionCode:'DEMO-DIP',locality:'Zürichberg, ZH, Switzerland',recordedBy:'S. S.',eventDate:'2026-07-04',identifiedBy:'O. H.',boxId:boxB,x:30,y:34,footprintWidthMm:20,footprintHeightMm:18}),
      specimen({catalogNumber:'ENT-CH-000201',scientificName:'Eristalis tenax',collectionCode:'DEMO-DIP',locality:'Männedorf, ZH, Switzerland',recordedBy:'S. S.',eventDate:'2026-06-09',identifiedBy:'S. S.',boxId:boxB,x:55,y:46,footprintWidthMm:22,footprintHeightMm:20})
    ];
    const queue = [
      specimen({catalogNumber:'ENT-CH-000194',scientificName:'Saperda carcharias',targetBoxId:boxA,footprintWidthMm:46,footprintHeightMm:34,locality:'Thurauen, ZH',recordedBy:'A. Meier'}),
      specimen({catalogNumber:'ENT-CH-000195',scientificName:'Oberea oculata',targetBoxId:boxA,footprintWidthMm:20,footprintHeightMm:30,locality:'Reuss delta, UR',recordedBy:'R. Frei'}),
      specimen({catalogNumber:'ENT-CH-000196',scientificName:'Rhagium inquisitor',targetBoxId:boxA,footprintWidthMm:45,footprintHeightMm:30,locality:'Davos, GR',recordedBy:'E. Kunz'}),
      specimen({catalogNumber:'ENT-HR-000199',scientificName:'Xylotrechus antilope',targetBoxId:boxA,footprintWidthMm:26,footprintHeightMm:20,locality:'Krk, Croatia',recordedBy:'UZH field course'}),
      specimen({catalogNumber:'ENT-CH-000202',scientificName:'Bombus pascuorum',collectionCode:'DEMO-DIP',targetBoxId:boxB,footprintWidthMm:28,footprintHeightMm:24,locality:'Pfannenstiel, ZH',recordedBy:'A. Meier'}),
      specimen({catalogNumber:'ENT-CH-000203',scientificName:'Carabus auratus',collectionCode:'DEMO-TEACH',targetBoxId:boxC,footprintWidthMm:34,footprintHeightMm:26,locality:'Winterthur, ZH',recordedBy:'Teaching collection'})
    ];
    return {
      version: 3,
      selectedBoxId: boxA,
      preferences: { appearance:'mixed', showZones:true, showGrid:false, snap:false, zoom:100, navOpen:false, treeOpen:{} },
      collectionName: 'Demo Natural History Collection',
      locations: [
        {id:buildingA,type:'building',name:'Building A',code:'A',parentId:null,notes:''},
        {id:room214,type:'room',name:'Room 2.14',code:'2.14',parentId:buildingA,notes:''},
        {id:cabinetC17,type:'cabinet',name:'Cabinet C-17',code:'C-17',parentId:room214,notes:''},
        {id:drawer04,type:'drawer',name:'Drawer 04',code:'04',parentId:cabinetC17,notes:''},
        {id:cabinetD03,type:'cabinet',name:'Cabinet D-03',code:'D-03',parentId:room214,notes:''},
        {id:drawer11,type:'drawer',name:'Drawer 11',code:'11',parentId:cabinetD03,notes:''},
        {id:buildingB,type:'building',name:'Building B',code:'B',parentId:null,notes:''},
        {id:teachingLab,type:'room',name:'Teaching laboratory',code:'LAB',parentId:buildingB,notes:''}
      ],
      boxes: [
        {id:boxA,code:'BOX-04',name:'Box 04 · Cerambycidae',parentLocationId:drawer04,path:'Building A › Room 2.14 › Cabinet C-17 › Drawer 04',widthMm:400,heightMm:300,gridCols:16,gridRows:12,background:DEMO_BG},
        {id:boxB,code:'BOX-18',name:'Box 18 · Diptera & Hymenoptera',parentLocationId:drawer11,path:'Building A › Room 2.14 › Cabinet D-03 › Drawer 11',widthMm:400,heightMm:300,gridCols:16,gridRows:12,background:DEMO_BG},
        {id:boxC,code:'BOX-T03',name:'Box 03 · Teaching Coleoptera',parentLocationId:teachingLab,path:'Building B › Teaching laboratory',widthMm:300,heightMm:220,gridCols:12,gridRows:9,background:DEMO_BG}
      ],
      zones: [
        {id:zoneRosalia,boxId:boxA,name:'Rosalia & Aromia',code:'A',description:'Large, visually distinctive Cerambycinae.',x:5,y:6,w:39,h:33,color:0},
        {id:zoneLepturinae,boxId:boxA,name:'Lepturinae',code:'B',description:'Medium and small flower longhorns.',x:43,y:6,w:28,h:57,color:2},
        {id:zoneLarge,boxId:boxA,name:'Large-bodied taxa',code:'C',description:'Extra clearance for antennae and appendages.',x:70,y:6,w:27,h:75,color:1}
      ],
      specimens: [...placed, ...queue]
    };
  }

  let state = loadState();
  let selectedSpecimenId = null;
  let selectedZoneId = null;
  let inspectorTab = 'details';
  let placingSpecimenId = null;
  let tool = 'select';
  let dragState = null;
  let zoneDraftState = null;
  let history = [];
  let pendingImport = null;
  let currentView = 'home';
  let homeAlertsExpanded = false;

  const locationTypeMeta = {
    building:{label:'Building',icon:'▦'},
    room:{label:'Room / laboratory',icon:'□'},
    cabinet:{label:'Cabinet',icon:'▥'},
    drawer:{label:'Drawer',icon:'▤'},
    shelf:{label:'Shelf / rack',icon:'═'},
    freezer:{label:'Freezer / cold storage',icon:'❄'},
    storage:{label:'Storage area',icon:'◇'},
    custom:{label:'Custom location',icon:'·'}
  };

  function inferLocationType(label, depth = 0) {
    const value = String(label || '').toLowerCase();
    if (/building|gebäude|house|wing/.test(value)) return 'building';
    if (/room|laboratory|lab|raum/.test(value)) return 'room';
    if (/cabinet|schrank|cupboard/.test(value)) return 'cabinet';
    if (/drawer|schublade/.test(value)) return 'drawer';
    if (/shelf|rack|regal/.test(value)) return 'shelf';
    if (/freezer|cold|kühl|fridge/.test(value)) return 'freezer';
    return depth === 0 ? 'building' : 'custom';
  }

  function locationById(id) { return (state?.locations || []).find(l => l.id === id); }
  function locationAncestors(id) {
    const result = [];
    const seen = new Set();
    let current = (state?.locations || []).find(l => l.id === id);
    while (current && !seen.has(current.id)) {
      seen.add(current.id);
      result.unshift(current);
      current = (state?.locations || []).find(l => l.id === current.parentId);
    }
    return result;
  }
  function locationPath(id) { return locationAncestors(id).map(l => l.name).join(' › '); }
  function syncAllBoxPaths(target = state) {
    for (const box of target.boxes || []) {
      const parts = [];
      const seen = new Set();
      let current = (target.locations || []).find(l => l.id === box.parentLocationId);
      while (current && !seen.has(current.id)) {
        seen.add(current.id);
        parts.unshift(current.name);
        current = (target.locations || []).find(l => l.id === current.parentId);
      }
      box.path = parts.join(' › ') || 'Unassigned storage';
    }
  }
  function migrateLegacyLocations(data) {
    data.locations ||= [];
    const findChild = (parentId, name) => data.locations.find(l => (l.parentId || null) === (parentId || null) && l.name.toLowerCase() === name.toLowerCase());
    for (const box of data.boxes || []) {
      if (box.parentLocationId && data.locations.some(l => l.id === box.parentLocationId)) continue;
      const parts = String(box.path || '').split('›').map(v => v.trim()).filter(Boolean);
      let parentId = null;
      parts.forEach((name, depth) => {
        let node = findChild(parentId, name);
        if (!node) {
          node = {id:uid(),type:inferLocationType(name, depth),name,code:'',parentId,notes:''};
          data.locations.push(node);
        }
        parentId = node.id;
      });
      box.parentLocationId = parentId;
    }
    syncAllBoxPaths(data);
  }

  function normalizeState(data) {
    const fallback = defaultState();
    data.collectionName ||= fallback.collectionName;
    data.preferences ||= {};
    data.preferences.appearance ||= 'mixed';
    data.preferences.showZones ??= true;
    data.preferences.showGrid ??= false;
    data.preferences.snap ??= false;
    data.preferences.zoom ||= 100;
    data.preferences.navOpen ??= false;
    data.preferences.treeOpen ||= {};
    migrateLegacyLocations(data);
    // V3.4 keeps specimen rotation removed entirely. Existing local records are
    // migrated automatically so labels and specimen previews stay horizontal.
    (data.specimens || []).forEach(s => { if ('rotation' in s) delete s.rotation; });
    return data;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return normalizeState(defaultState());
      const parsed = JSON.parse(raw);
      if (parsed.version !== 3) return normalizeState(defaultState());
      return normalizeState(parsed);
    } catch {
      return normalizeState(defaultState());
    }
  }

  function persist(message = 'Saved locally') {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      $('#saveStateLabel').textContent = message;
      setTimeout(() => { if ($('#saveStateLabel')) $('#saveStateLabel').textContent = 'Saved locally'; }, 1200);
    } catch {
      toast('Browser storage is full. Export a backup and reduce image sizes.', 'error');
    }
  }

  function pushHistory() {
    history.push(deepClone(state));
    if (history.length > 20) history.shift();
    renderUndo();
  }

  function undo() {
    if (!history.length) return toast('Nothing to undo');
    state = history.pop();
    selectedSpecimenId = null;
    selectedZoneId = null;
    placingSpecimenId = null;
    tool = 'select';
    persist('Undo saved');
    renderAll();
    toast('Last spatial change undone');
  }

  function currentBox() {
    return state.boxes.find(b => b.id === state.selectedBoxId) || state.boxes[0];
  }
  function currentZones() { return state.zones.filter(z => z.boxId === currentBox()?.id); }
  function placedInCurrentBox() { return state.specimens.filter(s => s.boxId === currentBox()?.id && s.x != null && s.y != null); }
  function queueForCurrentBox() { return state.specimens.filter(s => !s.boxId && (!s.targetBoxId || s.targetBoxId === currentBox()?.id)); }
  function specimenById(id) { return state.specimens.find(s => s.id === id); }
  function zoneById(id) { return state.zones.find(z => z.id === id); }

  function toast(message, type = '') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    $('#toastStack').append(el);
    setTimeout(() => el.remove(), 3200);
  }

  function showModal({eyebrow='EntoBox', title, body, foot}) {
    $('#modalEyebrow').textContent = eyebrow;
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = body;
    $('#modalFoot').innerHTML = foot || '<button class="btn" data-close-modal>Close</button>';
    $('#modalBackdrop').hidden = false;
    $$('[data-close-modal]', $('#modalBackdrop')).forEach(b => b.onclick = closeModal);
  }
  function closeModal() { $('#modalBackdrop').hidden = true; $('#modalBody').innerHTML = ''; $('#modalFoot').innerHTML = ''; }

  function isUnidentified(s) {
    const name = String(s?.scientificName || '').trim().toLowerCase();
    return !name || name === 'unidentified specimen' || name === 'unidentified' || name === 'unknown';
  }

  function activeCollectionAlerts() {
    const severity = {Missing:0,Damaged:1,Attention:2};
    return state.specimens
      .filter(s => s.boxId && ['Attention','Damaged','Missing'].includes(s.condition))
      .sort((a,b) => (severity[a.condition] ?? 9) - (severity[b.condition] ?? 9) || String(a.scientificName).localeCompare(String(b.scientificName)));
  }

  function boxForSpecimen(s) {
    return state.boxes.find(box => box.id === (s?.boxId || s?.targetBoxId)) || null;
  }

  function specimenStorageLabel(s) {
    const box = boxForSpecimen(s);
    if (!box) return 'No box assigned';
    return [...storagePathParts(box), box.code].join(' › ');
  }

  function openBoxWorkspace(boxId, specimenId = null, {openNavigation=false} = {}) {
    const box = state.boxes.find(item => item.id === boxId);
    if (!box) return toast('The linked box no longer exists', 'warn');
    state.selectedBoxId = box.id;
    currentView = 'workspace';
    selectedSpecimenId = specimenId;
    selectedZoneId = null;
    placingSpecimenId = null;
    tool = 'select';
    inspectorTab = specimenId ? 'details' : inspectorTab;
    state.preferences.navOpen = !!openNavigation;
    persist();
    renderAll();
    if (specimenId) {
      requestAnimationFrame(() => {
        const selected = document.querySelector('.specimen.selected');
        selected?.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});
        selected?.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(1.16)'},{transform:'translate(-50%,-50%) scale(1)'}],{duration:700,easing:'ease-out'});
      });
      toast('Alert opened at its position in the box');
    }
  }

  function setView(view) {
    currentView = view === 'workspace' ? 'workspace' : 'home';
    if (currentView === 'home') state.preferences.navOpen = false;
    persist();
    renderAll();
  }

  function renderViewState() {
    const home = currentView === 'home';
    document.body.classList.toggle('home-mode', home);
    document.body.classList.toggle('workspace-mode', !home);
    $('#homeView').hidden = !home;
    $('#workspaceView').hidden = home;
    $('#homeBtn').classList.toggle('active', home);
    $('#homeBtn').setAttribute('aria-current', home ? 'page' : 'false');
    renderNavigationState();
  }

  function scrollHomeTo(id) {
    if (currentView !== 'home') currentView = 'home';
    renderViewState();
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}));
  }

  function openCollectionRecords(mode = 'all') {
    let records = [...state.specimens];
    let title = 'All specimen records';
    if (mode === 'unidentified') { records = records.filter(isUnidentified); title = 'Unidentified specimens'; }
    if (mode === 'unplaced') { records = records.filter(s => !s.boxId); title = 'Specimens awaiting placement'; }
    const rows = records.slice(0,250).map(s => {
      const box = boxForSpecimen(s);
      return `<tr data-home-record-id="${s.id}"><td><b>${esc(shown(s.scientificName,'Unidentified specimen'))}</b><small>${esc(shown(s.catalogNumber,'Temporary record'))}</small></td><td>${esc(s.condition)}</td><td>${esc(box ? box.code : 'Placement tray')}</td><td>${esc(box ? box.path : 'Not yet placed')}</td></tr>`;
    }).join('');
    showModal({eyebrow:'Collection overview',title,body:`<div class="home-record-summary">${records.length} record${records.length===1?'':'s'}${records.length>250?' · showing first 250':''}</div><div class="home-record-table-wrap"><table class="record-table home-record-table"><thead><tr><th>Specimen</th><th>Condition</th><th>Box</th><th>Storage path</th></tr></thead><tbody>${rows || '<tr><td colspan="4">No matching records.</td></tr>'}</tbody></table></div>`,foot:'<button class="btn" data-close-modal>Close</button>'});
    $$('[data-home-record-id]', $('#modalBody')).forEach(row => row.onclick = () => {
      const record = specimenById(row.dataset.homeRecordId);
      closeModal();
      if (record?.boxId) openBoxWorkspace(record.boxId,record.id);
      else if (record?.targetBoxId) openBoxWorkspace(record.targetBoxId,null,{openNavigation:true});
      else { currentView='workspace';state.preferences.navOpen=true;persist();renderAll();toast('Record is in the unassigned placement tray'); }
    });
  }

  function renderHome() {
    syncAllBoxPaths();
    const specimens = state.specimens || [];
    const placed = specimens.filter(s => s.boxId);
    const unplaced = specimens.filter(s => !s.boxId);
    const alerts = activeCollectionAlerts();
    const unidentified = specimens.filter(isUnidentified);
    const counts = ['Good','Attention','Damaged','Missing','Not assessed'].reduce((acc,key) => (acc[key]=specimens.filter(s => s.condition===key).length,acc),{});
    const clearPercent = specimens.length ? Math.round((specimens.length-alerts.length)/specimens.length*100) : 100;

    $('#homeCollectionName').textContent = state.collectionName || 'Natural history collection';
    $('#homeTotalSpecimens').textContent = specimens.length.toLocaleString();
    $('#homeBoxes').textContent = state.boxes.length.toLocaleString();
    $('#homeAlertsCount').textContent = alerts.length.toLocaleString();
    $('#homeUnplaced').textContent = unplaced.length.toLocaleString();
    $('#homeUnidentified').textContent = unidentified.length.toLocaleString();
    $('#homeLocations').textContent = state.locations.length.toLocaleString();
    $('#homeOpenCurrentBoxBtn').textContent = currentBox() ? `Open ${currentBox().code}` : 'Create first box';

    const healthSummary = $('#homeHealthSummary');
    healthSummary.textContent = alerts.length ? `${alerts.length} active alert${alerts.length===1?'':'s'}` : 'No active alerts';
    healthSummary.classList.toggle('has-alerts', !!alerts.length);
    $('#homeHealthVisual').innerHTML = `<div class="health-ring" style="--health-good:${clearPercent}%"><div class="health-ring-copy"><b>${clearPercent}%</b><small>without active alerts</small></div></div><div class="health-message"><strong>${alerts.length ? 'Some specimens need attention' : 'No urgent condition issues recorded'}</strong><p>${placed.length} placed · ${unplaced.length} awaiting placement · ${counts['Not assessed'] || 0} not yet condition-assessed.</p></div>`;
    $('#homeHealthBreakdown').innerHTML = [
      ['Good',counts.Good,''],['Attention',counts.Attention,'alert'],['Damaged',counts.Damaged,'alert'],['Missing',counts.Missing,'alert'],['Not assessed',counts['Not assessed'],'review']
    ].map(([label,count,klass]) => `<div class="health-state ${klass}"><b>${count}</b><span>${label}</span></div>`).join('');

    const visibleAlerts = homeAlertsExpanded ? alerts : alerts.slice(0,6);
    $('#homeShowAllAlertsBtn').hidden = alerts.length <= 6;
    $('#homeShowAllAlertsBtn').textContent = homeAlertsExpanded ? 'Show fewer' : `Show all ${alerts.length}`;
    $('#homeAlertList').innerHTML = visibleAlerts.length ? visibleAlerts.map(s => {
      const box = boxForSpecimen(s);
      const symbol = s.condition === 'Missing' ? '?' : s.condition === 'Damaged' ? '×' : '!';
      return `<button class="home-alert-item" data-home-alert-id="${s.id}" data-condition="${esc(s.condition)}"><span class="home-alert-severity">${symbol}</span><span class="home-alert-copy"><strong>${esc(shown(s.scientificName,'Unidentified specimen'))}</strong><span>${esc(shown(s.catalogNumber,'Temporary record'))} · ${esc(s.condition)}</span><small>${esc(box ? `${box.code} · ${box.path}` : 'Box not assigned')}</small></span><span class="home-alert-open">›</span></button>`;
    }).join('') : '<div class="home-empty-alerts"><div><b>Collection looks calm 🌿</b>No specimens are currently marked Attention, Damaged, or Missing.</div></div>';
    $$('[data-home-alert-id]', $('#homeAlertList')).forEach(button => button.onclick = () => {
      const s = specimenById(button.dataset.homeAlertId);
      if (s?.boxId) openBoxWorkspace(s.boxId,s.id);
    });

    const typeCounts = {};
    for (const location of state.locations) typeCounts[location.type] = (typeCounts[location.type] || 0) + 1;
    $('#homeStorageSummary').innerHTML = Object.entries(typeCounts).sort((a,b) => (locationTypeMeta[a[0]]?.label || a[0]).localeCompare(locationTypeMeta[b[0]]?.label || b[0])).map(([type,count]) => `<span class="storage-summary-chip">${storageIcon(type)} <span>${esc(storageTypeTitle(type))}</span><b>${count}</b></span>`).join('') || '<span class="storage-summary-chip">No storage locations yet</span>';
    $('#homeBoxGrid').innerHTML = state.boxes.length ? state.boxes.map(box => {
      const boxPlaced = specimens.filter(s => s.boxId === box.id).length;
      const boxQueued = specimens.filter(s => !s.boxId && s.targetBoxId === box.id).length;
      const boxAlerts = specimens.filter(s => s.boxId === box.id && ['Attention','Damaged','Missing'].includes(s.condition)).length;
      return `<button class="home-box-card" data-home-box-id="${box.id}"><span class="home-box-thumb">${esc(box.code.replace(/^BOX-?/i,''))}</span><span class="home-box-copy"><strong>${esc(box.name)}</strong><span>${esc(box.path || 'Unassigned storage')}</span><small>${box.widthMm} × ${box.heightMm} mm · ${state.zones.filter(z=>z.boxId===box.id).length} zones</small></span><span class="home-box-counts"><b>${boxPlaced} placed</b>${boxQueued?`<span>+${boxQueued} tray</span>`:''}${boxAlerts?`<span class="home-box-alert">${boxAlerts} alert${boxAlerts===1?'':'s'}</span>`:''}</span></button>`;
    }).join('') : '<div class="home-box-empty">No boxes yet. Create a storage path and your first spatial box.</div>';
    $$('[data-home-box-id]', $('#homeBoxGrid')).forEach(button => button.onclick = () => openBoxWorkspace(button.dataset.homeBoxId));
  }

  function renderAll() {
    renderHome();
    if (currentBox()) {
      renderBoxes();
      renderQueue();
      renderMap();
      renderInspector();
      renderControls();
    }
    renderUndo();
    renderViewState();
  }

  function renderNavigationState() {
    const open = currentView === 'workspace' && !!state.preferences.navOpen;
    document.body.classList.toggle('storage-open', open);
    $('#leftPanel').setAttribute('aria-hidden', String(!open));
    $('#collectionNavBtn').setAttribute('aria-expanded', String(open));
    $('#collectionNavBtn').textContent = open ? '× Collection' : '☰ Collection';
    $('#drawerBackdrop').hidden = !open;
    $('#drawerHandle').setAttribute('aria-hidden', String(open || currentView === 'home'));
  }

  function setNavigationOpen(open) {
    state.preferences.navOpen = !!open;
    persist();
    renderNavigationState();
    if (open) setTimeout(() => $('#structureSearch')?.focus({preventScroll:true}), 160);
  }

  function renderUndo() { $('#undoBtn').disabled = !history.length; }

  function storagePathParts(box) {
    const parts = locationAncestors(box?.parentLocationId).map(l => l.name);
    return parts.length ? parts : ['Unassigned storage'];
  }

  function storageIcon(type) {
    if (type === 'institution') return '◆';
    return locationTypeMeta[type]?.icon || '·';
  }

  function buildStorageTree() {
    const root = {key:'root',id:null,label:state.collectionName || 'Entomology collection',type:'institution',location:null,children:[],boxes:[]};
    const map = new Map((state.locations || []).map(location => [location.id,{key:location.id,id:location.id,label:location.name,type:location.type || 'custom',location,children:[],boxes:[]}]))
    for (const node of map.values()) {
      const parent = map.get(node.location.parentId) || root;
      parent.children.push(node);
    }
    for (const box of state.boxes || []) {
      const parent = map.get(box.parentLocationId) || root;
      parent.boxes.push(box);
    }
    const count = node => {
      node.boxCount = node.boxes.length;
      for (const child of node.children) node.boxCount += count(child);
      return node.boxCount;
    };
    count(root);
    return root;
  }

  function boxMatchesSearch(box, q) {
    return !q || [box.name,box.code,box.path].join(' ').toLowerCase().includes(q);
  }

  function nodeMatchesSearch(node, q) {
    if (!q) return true;
    if ([node.label,node.location?.code,node.type].join(' ').toLowerCase().includes(q)) return true;
    if (node.boxes.some(box => boxMatchesSearch(box,q))) return true;
    return node.children.some(child => nodeMatchesSearch(child,q));
  }

  function selectedTreeKeys() {
    const keys = new Set(['root']);
    for (const location of locationAncestors(currentBox()?.parentLocationId)) keys.add(location.id);
    return keys;
  }

  function renderTreeNode(node, q, selectedKeys, depth = 0) {
    if (!nodeMatchesSearch(node,q)) return '';
    const children = [...node.children].sort((a,b) => a.label.localeCompare(b.label));
    const matchingBoxes = node.boxes.filter(box => boxMatchesSearch(box,q));
    const branchContent = [
      ...children.map(child => renderTreeNode(child,q,selectedKeys,depth+1)),
      ...matchingBoxes.sort((a,b) => a.name.localeCompare(b.name)).map(box => {
        const placed = state.specimens.filter(s => s.boxId === box.id).length;
        const queued = state.specimens.filter(s => !s.boxId && s.targetBoxId === box.id).length;
        return `<div class="tree-box-row ${box.id === state.selectedBoxId ? 'active' : ''}">
          <button class="tree-box" data-box-id="${box.id}" title="${esc(box.path)}">
            <span class="tree-box-icon">▣</span><span class="tree-box-copy"><strong>${esc(box.name)}</strong><small>${esc(box.code)} · ${box.widthMm} × ${box.heightMm} mm</small></span><span class="tree-box-count">${placed}${queued ? `<em>+${queued}</em>` : ''}</span>
          </button>
          <button class="tree-mini-action" data-edit-box-id="${box.id}" title="Edit or move box">•••</button>
        </div>`;
      })
    ].join('');
    const open = q || selectedKeys.has(node.key) || state.preferences.treeOpen[node.key];
    const addTitle = node.id ? `Add inside ${node.label}` : 'Add to collection';
    return `<details class="tree-node tree-depth-${depth}" data-tree-key="${esc(node.key)}" ${open ? 'open' : ''}>
      <summary><span class="tree-chevron">›</span><span class="tree-node-icon">${storageIcon(node.type)}</span><span class="tree-node-label">${esc(node.label)}</span><span class="tree-node-count">${node.boxCount}</span><span class="tree-node-tools"><button class="tree-add-child" data-parent-location-id="${node.id || ''}" title="${esc(addTitle)}">＋</button>${node.id ? `<button class="tree-edit-location" data-location-id="${node.id}" title="Edit or move ${esc(node.label)}">•••</button>` : ''}</span></summary>
      <div class="tree-children">${branchContent || '<div class="tree-empty">No storage locations or boxes yet</div>'}</div>
    </details>`;
  }

  function selectBox(boxId, closeNavigation = true) {
    state.selectedBoxId = boxId;
    currentView = 'workspace';
    selectedSpecimenId = null;
    selectedZoneId = null;
    placingSpecimenId = null;
    tool = 'select';
    if (closeNavigation) state.preferences.navOpen = false;
    persist();
    renderAll();
    toast(`${currentBox().name} opened`);
  }

  function renderBoxes() {
    syncAllBoxPaths();
    const tree = buildStorageTree();
    const q = ($('#structureSearch')?.value || '').trim().toLowerCase();
    $('#storageTree').innerHTML = renderTreeNode(tree,q,selectedTreeKeys());
    $$('.tree-box').forEach(button => button.onclick = () => selectBox(button.dataset.boxId,true));
    $$('.tree-mini-action[data-edit-box-id]').forEach(button => button.onclick = event => {
      event.preventDefault();event.stopPropagation();openEditBox(state.boxes.find(b => b.id === button.dataset.editBoxId));
    });
    $$('.tree-add-child').forEach(button => button.onclick = event => {
      event.preventDefault();event.stopPropagation();openStorageCreateMenu(button.dataset.parentLocationId || null);
    });
    $$('.tree-edit-location').forEach(button => button.onclick = event => {
      event.preventDefault();event.stopPropagation();openEditLocation(locationById(button.dataset.locationId));
    });
    $$('.tree-node').forEach(details => details.ontoggle = () => {
      if (!details.dataset.treeKey) return;
      state.preferences.treeOpen[details.dataset.treeKey] = details.open;
      persist();
    });
    renderNavigationState();
  }

  function sizeKeyForSpec(s) {
    const area = s.footprintWidthMm * s.footprintHeightMm;
    if (area < 180) return 'xs';
    if (area < 420) return 's';
    if (area < 900) return 'm';
    if (area < 1900) return 'l';
    return 'xl';
  }

  function renderQueue() {
    const q = ($('#queueSearch').value || '').trim().toLowerCase();
    const queue = queueForCurrentBox().filter(s => !q || [s.catalogNumber,s.scientificName,s.locality,s.recordedBy].join(' ').toLowerCase().includes(q));
    $('#queueCount').textContent = queueForCurrentBox().length;
    $('#autoPlaceBtn').disabled = !queueForCurrentBox().length;
    $('#autoPlaceBtn').textContent = selectedZoneId ? 'Auto-place in zone' : 'Auto-place';
    $('#trayHelp').innerHTML = placingSpecimenId ? `<b>${esc(specimenById(placingSpecimenId)?.catalogNumber || '')}</b> selected. Tap the box photograph to place the pin. Press Esc to cancel.` : 'Drag the beetle handle onto the box, or press <b>Place</b> and tap the photograph.';
    if (!queue.length) {
      $('#queueList').innerHTML = `<div class="empty-state">${q ? 'No matching unplaced records.' : 'No unplaced records for this box. Import a spreadsheet or add a specimen.'}</div>`;
      return;
    }
    $('#queueList').innerHTML = queue.map(s => `<div class="queue-item ${s.id === placingSpecimenId ? 'selected' : ''}" data-queue-id="${s.id}">
      <div class="drag-handle" draggable="true" data-drag-spec="${s.id}" title="Drag onto box">${s.icon}</div>
      <div class="queue-info"><strong>${esc(shown(s.scientificName,'Unidentified specimen'))}</strong><span>${esc(shown(s.catalogNumber,'Temporary record'))}${s.locality?` · ${esc(s.locality)}`:''}</span></div>
      <div class="queue-actions"><select data-size-spec="${s.id}" title="Footprint size">${Object.entries(sizePresets).map(([k,v]) => `<option value="${k}" ${sizeKeyForSpec(s)===k?'selected':''}>${v.label}</option>`).join('')}</select><button class="place-btn" data-place-spec="${s.id}">${s.id===placingSpecimenId?'Cancel':'Place'}</button></div>
    </div>`).join('');
    $$('[data-drag-spec]').forEach(h => {
      h.ondragstart = e => {
        e.dataTransfer.setData('text/entobox-specimen', h.dataset.dragSpec);
        e.dataTransfer.effectAllowed = 'move';
      };
    });
    $$('[data-place-spec]').forEach(b => b.onclick = () => setPlacing(b.dataset.placeSpec));
    $$('[data-size-spec]').forEach(sel => sel.onchange = () => {
      const s = specimenById(sel.dataset.sizeSpec);
      const p = sizePresets[sel.value];
      pushHistory();
      s.footprintWidthMm = p.w;
      s.footprintHeightMm = p.h;
      s.updatedAt = nowISO();
      persist();
      renderQueue();
    });
  }

  function renderBoxBreadcrumb(box) {
    const locations = locationAncestors(box.parentLocationId);
    const items = [`<button data-breadcrumb-location="root">${esc(state.collectionName)}</button>`,...locations.map(location => `<span>›</span><button data-breadcrumb-location="${location.id}">${esc(location.name)}</button>`),`<span>›</span><b>${esc(box.code)}</b>`];
    $('#boxBreadcrumb').innerHTML = items.join('');
    $$('[data-breadcrumb-location]', $('#boxBreadcrumb')).forEach(button => button.onclick = () => {
      const id = button.dataset.breadcrumbLocation;
      if (id !== 'root') state.preferences.treeOpen[id] = true;
      state.preferences.navOpen = true;
      persist();
      renderBoxes();
    });
  }

  function renderControls() {
    const box = currentBox();
    if (!box) return;
    $('#currentBoxChip').textContent = box.code;
    $('#currentBoxChip').title = `${box.name} — open collection structure`;
    $('#drawerHandleLabel').textContent = box.code;
    $('#currentBoxTitle').textContent = box.name;
    renderBoxBreadcrumb(box);
    const placed = placedInCurrentBox();
    const alertCount = placed.filter(s => ['Attention','Damaged','Missing'].includes(s.condition)).length;
    $('#boxStats').textContent = `${placed.length} placed · ${currentZones().length} zones${alertCount ? ` · ${alertCount} alert${alertCount===1?'':'s'}` : ''}`;
    $$('[data-appearance]').forEach(b => b.classList.toggle('active', b.dataset.appearance === state.preferences.appearance));
    $('#showZonesToggle').checked = state.preferences.showZones;
    $('#showGridToggle').checked = state.preferences.showGrid;
    $('#snapToggle').checked = state.preferences.snap;
    $('#zoomRange').value = state.preferences.zoom;
    $('#modeIndicator').textContent = tool === 'zone' ? 'Draw a zone' : placingSpecimenId ? 'Place specimen' : 'Select & move';
    $('#newZoneBtn').classList.toggle('primary', tool === 'zone');
    $('#newZoneBtn').textContent = tool === 'zone' ? '× Cancel zone' : '▱ Draw zone';
  }

  function specimenRect(s, box = currentBox()) {
    const w = s.footprintWidthMm / box.widthMm * 100;
    const h = s.footprintHeightMm / box.heightMm * 100;
    return { x:s.x - w/2, y:s.y - h/2, w, h, cx:s.x, cy:s.y };
  }
  function intersects(a,b,margin=.15) {
    return a.x + margin < b.x + b.w && a.x + a.w - margin > b.x && a.y + margin < b.y + b.h && a.y + a.h - margin > b.y;
  }
  function collisionSet(specs) {
    const set = new Set();
    for (let i=0;i<specs.length;i++) for (let j=i+1;j<specs.length;j++) {
      if (intersects(specimenRect(specs[i]), specimenRect(specs[j]), .35)) { set.add(specs[i].id); set.add(specs[j].id); }
    }
    return set;
  }

  function renderMap() {
    const box = currentBox();
    if (!box) return;
    const stage = $('#boxStage');
    $('#boxBackground').src = box.background || DEMO_BG;
    stage.className = `box-stage appearance-${state.preferences.appearance} tool-${tool}`;
    $('#gridOverlay').classList.toggle('visible', state.preferences.showGrid);
    $('#gridOverlay').style.backgroundSize = `${100/box.gridCols}% ${100/box.gridRows}%`;
    const zoom = state.preferences.zoom / 100;
    const baseWidth = 980;
    $('#boxStageWrap').style.width = `${baseWidth * zoom}px`;
    stage.style.width = `${baseWidth * zoom}px`;

    const zones = currentZones();
    $('#zoneLayer').style.display = state.preferences.showZones ? 'block' : 'none';
    $('#zoneLayer').innerHTML = zones.map(z => `<div class="zone ${z.id===selectedZoneId?'selected':''}" data-zone-id="${z.id}" data-color="${z.color||0}" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%"><span class="zone-label">${esc(z.code || '')} · ${esc(z.name)}</span></div>`).join('');
    $$('[data-zone-id]').forEach(el => el.onpointerdown = e => {
      e.stopPropagation();
      selectedZoneId = el.dataset.zoneId;
      selectedSpecimenId = null;
      inspectorTab = 'details';
      renderAll();
    });

    const specs = placedInCurrentBox();
    const collisions = collisionSet(specs);
    $('#specimenLayer').innerHTML = specs.map(s => {
      const r = specimenRect(s, box);
      const art = s.photoThumb ? `<img src="${s.photoThumb}" alt="">` : s.icon;
      const conditionAlert = ['Attention','Damaged','Missing'].includes(s.condition);
      return `<div class="specimen ${s.id===selectedSpecimenId?'selected':''} ${collisions.has(s.id)?'overlap':''} ${conditionAlert?'condition-alert':''}" data-specimen-id="${s.id}" style="left:${s.x}%;top:${s.y}%;width:${r.w}%;height:${r.h}%;transform:translate(-50%,-50%)">
        <div class="specimen-footprint"></div><div class="specimen-art">${art}</div><div class="pin-anchor"></div>${conditionAlert?`<div class="condition-map-badge" title="${esc(s.condition)}">!</div>`:''}<div class="specimen-label">${esc(s.scientificName)} · ${esc(s.catalogNumber)}</div>
      </div>`;
    }).join('');
    bindSpecimenDrag();
  }

  function bindSpecimenDrag() {
    $$('.specimen').forEach(el => {
      el.onpointerdown = e => {
        if (tool === 'zone' || e.button !== 0) return;
        e.stopPropagation();
        const s = specimenById(el.dataset.specimenId);
        selectedSpecimenId = s.id;
        selectedZoneId = null;
        inspectorTab = 'details';
        const p = pointFromEvent(e);
        dragState = { id:s.id, startPointer:p, startX:s.x, startY:s.y, moved:false, el, before:deepClone(state) };
        el.setPointerCapture?.(e.pointerId);
        renderInspector();
      };
      el.onpointermove = e => {
        if (!dragState || dragState.id !== el.dataset.specimenId) return;
        const s = specimenById(dragState.id);
        const p = pointFromEvent(e);
        const dx = p.x - dragState.startPointer.x;
        const dy = p.y - dragState.startPointer.y;
        if (Math.abs(dx)+Math.abs(dy) > .3) dragState.moved = true;
        let x = dragState.startX + dx, y = dragState.startY + dy;
        ({x,y} = normalizedPositionFor(s,x,y));
        s.x = x; s.y = y;
        el.style.left = `${x}%`; el.style.top = `${y}%`;
      };
      el.onpointerup = e => {
        if (!dragState || dragState.id !== el.dataset.specimenId) return;
        const s = specimenById(dragState.id);
        if (dragState.moved) {
          history.push(dragState.before);
          if (history.length > 20) history.shift();
          s.zoneId = zoneAtPoint(s.x,s.y)?.id || null;
          s.updatedAt = nowISO();
          persist('Position saved');
          toast(`Placed ${s.catalogNumber}${s.zoneId ? ` in ${zoneById(s.zoneId).name}` : ''}`);
        }
        dragState = null;
        renderAll();
      };
      el.ondblclick = () => openFullRecord(el.dataset.specimenId);
    });
  }

  function pointFromEvent(e) {
    const r = $('#boxStage').getBoundingClientRect();
    return {x:clamp((e.clientX-r.left)/r.width*100,0,100), y:clamp((e.clientY-r.top)/r.height*100,0,100)};
  }

  function normalizedPositionFor(s,x,y) {
    const box = currentBox();
    const halfW = s.footprintWidthMm / box.widthMm * 50;
    const halfH = s.footprintHeightMm / box.heightMm * 50;
    if (state.preferences.snap) {
      const gx = 100/box.gridCols, gy = 100/box.gridRows;
      x = Math.round(x/gx)*gx; y = Math.round(y/gy)*gy;
    }
    return {x:clamp(x,halfW,100-halfW), y:clamp(y,halfH,100-halfH)};
  }

  function zoneAtPoint(x,y) {
    return currentZones().find(z => x>=z.x && x<=z.x+z.w && y>=z.y && y<=z.y+z.h) || null;
  }

  function setPlacing(id) {
    if (placingSpecimenId === id) {
      placingSpecimenId = null; tool = 'select';
    } else {
      placingSpecimenId = id; tool = 'place'; selectedSpecimenId = id; selectedZoneId = null; inspectorTab='details';
    }
    renderAll();
  }

  function placeSpecimenAt(id, x, y) {
    const s = specimenById(id);
    if (!s) return;
    pushHistory();
    ({x,y} = normalizedPositionFor(s,x,y));
    s.boxId = currentBox().id;
    s.targetBoxId = currentBox().id;
    s.x = x; s.y = y;
    s.zoneId = zoneAtPoint(x,y)?.id || null;
    s.updatedAt = nowISO();
    selectedSpecimenId = s.id;
    selectedZoneId = null;
    placingSpecimenId = null;
    tool = 'select';
    persist('Specimen placed');
    renderAll();
    toast(`${s.catalogNumber} placed${s.zoneId ? ` in ${zoneById(s.zoneId).name}` : ''}`);
  }

  function autoPlace() {
    const queue = queueForCurrentBox();
    if (!queue.length) return;
    const box = currentBox();
    const zone = selectedZoneId ? zoneById(selectedZoneId) : null;
    const target = zone && zone.boxId === box.id ? {x:zone.x,y:zone.y,w:zone.w,h:zone.h,zoneId:zone.id} : {x:2,y:2,w:96,h:96,zoneId:null};
    const existing = placedInCurrentBox().map(s => ({...specimenRect(s,box),id:s.id}));
    const ordered = [...queue].sort((a,b) => b.footprintWidthMm*b.footprintHeightMm - a.footprintWidthMm*a.footprintHeightMm);
    let placed = 0;
    pushHistory();
    for (const s of ordered.slice(0,250)) {
      const w = s.footprintWidthMm/box.widthMm*100;
      const h = s.footprintHeightMm/box.heightMm*100;
      let found = null;
      const step = Math.max(1.1, Math.min(w,h)/3);
      for (let cy=target.y+h/2+1; cy<=target.y+target.h-h/2-1 && !found; cy+=step) {
        for (let cx=target.x+w/2+1; cx<=target.x+target.w-w/2-1; cx+=step) {
          const r = {x:cx-w/2,y:cy-h/2,w,h};
          if (!existing.some(o => intersects(r,o,.5))) { found={cx,cy,r}; break; }
        }
      }
      if (found) {
        s.boxId=box.id;s.targetBoxId=box.id;s.x=found.cx;s.y=found.cy;s.zoneId=target.zoneId;s.updatedAt=nowISO();
        existing.push({...found.r,id:s.id}); placed++;
      }
    }
    if (!placed) { history.pop(); return toast('No collision-free space found in the selected area','warn'); }
    persist('Auto-placement saved');
    renderAll();
    toast(`${placed} specimen${placed===1?'':'s'} auto-placed${zone ? ` in ${zone.name}` : ''}${placed<queue.length ? ` · ${queue.length-placed} remain` : ''}`);
  }

  function startZoneTool() {
    placingSpecimenId = null;
    tool = tool === 'zone' ? 'select' : 'zone';
    renderAll();
  }

  function handleStagePointerDown(e) {
    if (e.target.closest('.specimen') || e.target.closest('.zone')) return;
    if (placingSpecimenId) {
      const p = pointFromEvent(e);
      placeSpecimenAt(placingSpecimenId,p.x,p.y);
      return;
    }
    if (tool === 'zone') {
      const p = pointFromEvent(e);
      zoneDraftState = {start:p,current:p,pointerId:e.pointerId};
      updateZoneDraft();
      $('#boxStage').setPointerCapture?.(e.pointerId);
      return;
    }
    selectedSpecimenId = null;
    selectedZoneId = null;
    renderInspector();
    renderMap();
  }

  function handleStagePointerMove(e) {
    if (!zoneDraftState) return;
    zoneDraftState.current = pointFromEvent(e);
    updateZoneDraft();
  }

  function handleStagePointerUp() {
    if (!zoneDraftState) return;
    const a=zoneDraftState.start,b=zoneDraftState.current;
    const rect={x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),w:Math.abs(a.x-b.x),h:Math.abs(a.y-b.y)};
    zoneDraftState=null;$('#zoneDraft').hidden=true;
    if (rect.w<3 || rect.h<3) return;
    openZoneCreation(rect);
  }

  function updateZoneDraft() {
    const a=zoneDraftState.start,b=zoneDraftState.current;
    const d=$('#zoneDraft');d.hidden=false;
    d.style.left=`${Math.min(a.x,b.x)}%`;d.style.top=`${Math.min(a.y,b.y)}%`;d.style.width=`${Math.abs(a.x-b.x)}%`;d.style.height=`${Math.abs(a.y-b.y)}%`;
  }

  function openZoneCreation(rect) {
    showModal({eyebrow:'Spatial organisation',title:'Create curatorial zone',body:`<div class="form-grid">
      <div class="field"><label>Zone name *</label><input id="zoneName" value="New taxonomic zone"></div>
      <div class="field"><label>Short code</label><input id="zoneCode" value="${String.fromCharCode(65+currentZones().length)}"></div>
      <div class="field full"><label>Description</label><textarea id="zoneDescription" placeholder="Taxon, workflow or curatorial purpose"></textarea></div>
      <div class="field"><label>Visual colour</label><select id="zoneColor"><option value="0">Teal</option><option value="1">Amber</option><option value="2">Violet</option><option value="3">Rose</option></select></div>
      <div class="detail-cell"><span>Area</span><b>${rect.w.toFixed(1)}% × ${rect.h.toFixed(1)}%</b></div>
    </div>`,foot:'<button class="btn" data-close-modal>Cancel</button><button class="btn primary" id="saveZoneBtn">Create zone</button>'});
    $('#saveZoneBtn').onclick=()=>{
      const name=$('#zoneName').value.trim();if(!name)return toast('Enter a zone name','warn');
      pushHistory();
      const z={id:uid(),boxId:currentBox().id,name,code:$('#zoneCode').value.trim(),description:$('#zoneDescription').value.trim(),color:+$('#zoneColor').value,...rect};
      state.zones.push(z);selectedZoneId=z.id;selectedSpecimenId=null;tool='select';persist();closeModal();renderAll();toast('Zone created');
    };
  }

  function renderInspector() {
    $$('.inspector-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.inspectorTab===inspectorTab));
    if (inspectorTab === 'zones') return renderZoneList();
    if (inspectorTab === 'records') return renderRecords();
    const s = selectedSpecimenId ? specimenById(selectedSpecimenId) : null;
    const z = selectedZoneId ? zoneById(selectedZoneId) : null;
    if (s) return renderSpecimenInspector(s);
    if (z) return renderZoneInspector(z);
    return renderBoxInspector();
  }

  function renderSpecimenInspector(s) {
    const art=s.photoThumb?`<img src="${s.photoThumb}" alt="">`:s.icon;
    const zone=s.zoneId?zoneById(s.zoneId):null;
    $('#inspectorBody').innerHTML=`<div class="detail-hero"><div class="detail-art">${art}</div><h2>${esc(shown(s.scientificName,'Unidentified specimen'))}</h2><p>${esc(shown(s.catalogNumber,'Temporary record'))}</p></div>
      <div class="detail-grid"><div class="detail-cell"><span>Locality</span><b>${esc(shown(s.locality))}</b></div><div class="detail-cell"><span>Collector</span><b>${esc(shown(s.recordedBy))}</b></div><div class="detail-cell"><span>Event date</span><b>${esc(shown(s.eventDate))}</b></div><div class="detail-cell"><span>Identified by</span><b>${esc(shown(s.identifiedBy))}</b></div><div class="detail-cell"><span>Placement</span><b>${s.boxId?`${s.x.toFixed(1)}%, ${s.y.toFixed(1)}%`:'Unplaced'}</b></div><div class="detail-cell"><span>Zone</span><b>${esc(zone?.name||'None')}</b></div></div>
      <div class="field-row"><div class="field"><label>Footprint width (mm)</label><input type="number" id="detailW" value="${s.footprintWidthMm}" min="2" max="200"></div><div class="field"><label>Footprint height (mm)</label><input type="number" id="detailH" value="${s.footprintHeightMm}" min="2" max="200"></div></div>
      <div class="field"><label>Zone assignment</label><select id="detailZone"><option value="">No zone</option>${currentZones().map(x=>`<option value="${x.id}" ${x.id===s.zoneId?'selected':''}>${esc(x.code)} · ${esc(x.name)}</option>`).join('')}</select></div>
      <div class="field"><label>Condition</label><select id="detailCondition"><option ${s.condition==='Not assessed'?'selected':''}>Not assessed</option><option ${s.condition==='Good'?'selected':''}>Good</option><option ${s.condition==='Attention'?'selected':''}>Attention</option><option ${s.condition==='Damaged'?'selected':''}>Damaged</option><option ${s.condition==='Missing'?'selected':''}>Missing</option></select></div>
      <div class="field"><label>Notes</label><textarea id="detailNotes">${esc(s.notes)}</textarea></div>
      <input type="file" id="specimenPhotoInput" accept="image/*" hidden>
      <div class="action-stack"><button class="btn primary" id="saveSpecimenSpatial">Save spatial details</button><button class="btn" id="editRecordBtn">✎ Edit catalogue data</button><button class="btn" id="uploadSpecimenPhoto">▧ ${s.photoThumb?'Replace':'Add'} specimen photo</button><button class="btn" id="openRecordBtn">Open complete record</button>${s.boxId?'<button class="btn" id="returnToTrayBtn">↩ Return to placement tray</button>':''}<button class="btn danger" id="deleteSpecimenBtn">Delete specimen</button></div>`;
    $('#saveSpecimenSpatial').onclick=()=>{
      pushHistory();
      s.footprintWidthMm=clamp(+$('#detailW').value||30,2,200);s.footprintHeightMm=clamp(+$('#detailH').value||24,2,200);s.zoneId=$('#detailZone').value||null;s.condition=$('#detailCondition').value;s.notes=$('#detailNotes').value.trim();s.updatedAt=nowISO();
      if(s.boxId&&s.x!=null){const p=normalizedPositionFor(s,s.x,s.y);s.x=p.x;s.y=p.y;}
      persist();renderAll();toast('Specimen updated');
    };
    $('#editRecordBtn').onclick=()=>openEditSpecimenRecord(s);
    $('#uploadSpecimenPhoto').onclick=()=>$('#specimenPhotoInput').click();
    $('#specimenPhotoInput').onchange=async e=>{if(!e.target.files[0])return;pushHistory();s.photoThumb=await compressImage(e.target.files[0],720,720,.82,'contain');s.updatedAt=nowISO();persist();renderAll();toast('Specimen photo added');};
    $('#openRecordBtn').onclick=()=>openFullRecord(s.id);
    if($('#returnToTrayBtn'))$('#returnToTrayBtn').onclick=()=>{pushHistory();s.targetBoxId=s.boxId;s.boxId=null;s.x=null;s.y=null;s.zoneId=null;s.updatedAt=nowISO();persist();selectedSpecimenId=s.id;renderAll();toast('Specimen returned to placement tray');};
    $('#deleteSpecimenBtn').onclick=()=>{if(!confirm(`Delete ${s.catalogNumber}?`))return;pushHistory();state.specimens=state.specimens.filter(x=>x.id!==s.id);selectedSpecimenId=null;persist();renderAll();toast('Specimen deleted');};
  }

  function renderZoneInspector(z) {
    const count=state.specimens.filter(s=>s.boxId===z.boxId&&s.zoneId===z.id).length;
    $('#inspectorBody').innerHTML=`<div class="detail-hero"><div class="detail-art" style="font-size:40px">▱</div><h2>${esc(z.name)}</h2><p>${esc(z.code||'Zone')} · ${count} specimens</p></div>
      <div class="field"><label>Zone name</label><input id="editZoneName" value="${esc(z.name)}"></div><div class="field"><label>Short code</label><input id="editZoneCode" value="${esc(z.code||'')}"></div><div class="field"><label>Description</label><textarea id="editZoneDescription">${esc(z.description||'')}</textarea></div>
      <div class="detail-grid"><div class="detail-cell"><span>Position</span><b>${z.x.toFixed(1)}%, ${z.y.toFixed(1)}%</b></div><div class="detail-cell"><span>Size</span><b>${z.w.toFixed(1)}% × ${z.h.toFixed(1)}%</b></div></div>
      <div class="action-stack"><button class="btn primary" id="saveZoneDetails">Save zone</button><button class="btn" id="autoPlaceZone">Auto-place queue in this zone</button><button class="btn danger" id="deleteZone">Delete zone</button></div>`;
    $('#saveZoneDetails').onclick=()=>{pushHistory();z.name=$('#editZoneName').value.trim()||z.name;z.code=$('#editZoneCode').value.trim();z.description=$('#editZoneDescription').value.trim();persist();renderAll();toast('Zone updated');};
    $('#autoPlaceZone').onclick=()=>{selectedZoneId=z.id;autoPlace();};
    $('#deleteZone').onclick=()=>{if(!confirm(`Delete zone “${z.name}”? Specimens will remain in place.`))return;pushHistory();state.specimens.filter(s=>s.zoneId===z.id).forEach(s=>s.zoneId=null);state.zones=state.zones.filter(x=>x.id!==z.id);selectedZoneId=null;persist();renderAll();toast('Zone deleted');};
  }

  function renderBoxInspector() {
    const box=currentBox();const placed=placedInCurrentBox().length,queued=queueForCurrentBox().length;
    $('#inspectorBody').innerHTML=`<div class="detail-hero"><div class="detail-art" style="font-size:50px">📦</div><h2>${esc(box.name)}</h2><p>${esc(box.path)}</p></div>
      <div class="detail-grid"><div class="detail-cell"><span>Dimensions</span><b>${box.widthMm} × ${box.heightMm} mm</b></div><div class="detail-cell"><span>Mapped</span><b>${placed} specimens</b></div><div class="detail-cell"><span>Placement tray</span><b>${queued} records</b></div><div class="detail-cell"><span>Zones</span><b>${currentZones().length}</b></div></div>
      <p style="font-size:12px;line-height:1.55;color:var(--muted)">The red point is the physical pin anchor. The oval is an approximate footprint, so large antennae, wings and labels can occupy different amounts of space without forcing the collection into rigid cells.</p>
      <div class="action-stack"><button class="btn primary" id="inspectorImport">⇧ Import Excel / CSV</button><button class="btn" id="inspectorPhoto">▧ Replace box photograph</button><button class="btn" id="editBoxBtn">Edit box dimensions</button></div>`;
    $('#inspectorImport').onclick=()=>$('#importFileInput').click();$('#inspectorPhoto').onclick=()=>$('#boxPhotoInput').click();$('#editBoxBtn').onclick=()=>openEditBox(box);
  }

  function renderZoneList() {
    const zones=currentZones();
    $('#inspectorBody').innerHTML=`<div class="section-head"><div><div class="eyebrow">Curatorial organisation</div><h2>Zones</h2></div><button class="icon-btn" id="zoneTabAdd">＋</button></div><div class="zone-list">${zones.length?zones.map(z=>`<div class="zone-card ${z.id===selectedZoneId?'active':''}" data-zone-card="${z.id}"><strong>${esc(z.code||'')} · ${esc(z.name)}</strong><p>${esc(z.description||'No description')} · ${state.specimens.filter(s=>s.zoneId===z.id).length} specimens</p></div>`).join(''):'<div class="empty-state">No zones yet. Draw one directly on the box photograph.</div>'}</div>`;
    $('#zoneTabAdd').onclick=startZoneTool;
    $$('[data-zone-card]').forEach(c=>c.onclick=()=>{selectedZoneId=c.dataset.zoneCard;selectedSpecimenId=null;inspectorTab='details';renderAll();});
  }

  function renderRecords() {
    const records=state.specimens.filter(s=>s.boxId===currentBox().id||(!s.boxId&&(!s.targetBoxId||s.targetBoxId===currentBox().id)));
    $('#inspectorBody').innerHTML=`<input class="input record-filter" id="recordFilter" placeholder="Filter records…"><table class="record-table"><thead><tr><th>ID</th><th>Taxon</th><th>Location</th></tr></thead><tbody id="recordRows"></tbody></table>`;
    const draw=()=>{const q=($('#recordFilter').value||'').toLowerCase();$('#recordRows').innerHTML=records.filter(s=>!q||`${s.catalogNumber} ${s.scientificName} ${s.locality}`.toLowerCase().includes(q)).map(s=>`<tr data-record-id="${s.id}"><td>${esc(shown(s.catalogNumber,'Temporary record'))}</td><td><i>${esc(shown(s.scientificName,'Unidentified specimen'))}</i></td><td>${s.boxId?(s.zoneId?esc(zoneById(s.zoneId)?.code||'Placed'):'Placed'):'Tray'}</td></tr>`).join('');$$('[data-record-id]').forEach(r=>r.onclick=()=>{selectedSpecimenId=r.dataset.recordId;selectedZoneId=null;inspectorTab='details';renderAll();});};
    $('#recordFilter').oninput=draw;draw();
  }

  function openFullRecord(id) {
    const s=specimenById(id);if(!s)return;
    showModal({eyebrow:'Specimen record',title:shown(s.scientificName,'Unidentified specimen'),body:`<div class="detail-grid">
      <div class="detail-cell"><span>Catalogue number</span><b>${esc(shown(s.catalogNumber,'Temporary record'))}</b></div><div class="detail-cell"><span>Collection</span><b>${esc(shown(s.collectionCode))}</b></div>
      <div class="detail-cell"><span>Locality</span><b>${esc(shown(s.locality))}</b></div><div class="detail-cell"><span>Collector</span><b>${esc(shown(s.recordedBy))}</b></div>
      <div class="detail-cell"><span>Event date</span><b>${esc(shown(s.eventDate))}</b></div><div class="detail-cell"><span>Identified by</span><b>${esc(shown(s.identifiedBy))}</b></div>
      <div class="detail-cell"><span>Condition</span><b>${esc(s.condition)}</b></div><div class="detail-cell"><span>Preparation</span><b>${esc(s.preparationType)}</b></div>
      <div class="detail-cell"><span>Physical box</span><b>${esc(state.boxes.find(b=>b.id===s.boxId)?.name||'Unplaced')}</b></div><div class="detail-cell"><span>Zone</span><b>${esc(zoneById(s.zoneId)?.name||'None')}</b></div>
    </div><div class="field"><label>Notes</label><div style="font-size:13px;line-height:1.6">${esc(shown(s.notes,'No notes'))}</div></div>`,foot:'<button class="btn" data-close-modal>Close</button><button class="btn primary" id="editFromFullRecord">Edit record</button>'});
    $('#editFromFullRecord').onclick=()=>{closeModal();openEditSpecimenRecord(s);};
  }

  function openAddSpecimen() {
    if (!currentBox()) { toast('Create or open a specimen box first','warn'); setNavigationOpen(true); return; }
    let pendingPhoto=null;
    showModal({eyebrow:'Catalogue & placement',title:'Add specimen',body:`
      <div class="optional-record-note"><strong>A photo is enough to begin.</strong><span>Every catalogue field is optional. You can place the specimen now and complete its identification later.</span></div>
      <div class="form-grid">
      <div class="field"><label>Catalogue number <em>optional</em></label><input id="addCatalog" placeholder="Leave blank for a temporary record ID"><small>A temporary ID is created automatically when this is empty.</small></div>
      <div class="field"><label>Scientific name <em>optional</em></label><input id="addTaxon" placeholder="Unidentified specimen"><small>Identification can be added or changed at any time.</small></div>
      <div class="field"><label>Locality <em>optional</em></label><input id="addLocality"></div><div class="field"><label>Recorded by <em>optional</em></label><input id="addCollector"></div>
      <div class="field"><label>Event date <em>optional</em></label><input type="date" id="addDate"></div><div class="field"><label>Identified by <em>optional</em></label><input id="addIdentifier"></div>
      <div class="field"><label>Size preset</label><select id="addSize">${Object.entries(sizePresets).map(([k,v])=>`<option value="${k}" ${k==='m'?'selected':''}>${v.label} · ${v.w} × ${v.h} mm</option>`).join('')}</select></div><div class="field"><label>Condition</label><select id="addCondition"><option selected>Not assessed</option><option>Good</option><option>Attention</option><option>Damaged</option></select></div>
      <div class="field full photo-first-field"><label>Specimen photo <em>optional</em></label><input type="file" id="addPhoto" accept="image/*"><small>You can create a photo-only record and fill the rest in later.</small></div><div class="field full"><label>Notes <em>optional</em></label><textarea id="addNotes"></textarea></div>
    </div>`,foot:'<button class="btn" data-close-modal>Cancel</button><button class="btn" id="addToTray">Add to tray</button><button class="btn primary" id="addAndPlace">Add & place</button>'});
    $('#addPhoto').onchange=async e=>{if(e.target.files[0])pendingPhoto=await compressImage(e.target.files[0],720,720,.82,'contain');};
    const create=()=>{
      let cat=$('#addCatalog').value.trim();
      const typedCatalogue=Boolean(cat);
      if(!cat)cat=nextTemporaryNumber();
      if(state.specimens.some(s=>String(s.catalogNumber||'').toLowerCase()===cat.toLowerCase())){toast(typedCatalogue?'Catalogue number already exists':'Could not create a unique temporary ID','warn');return null;}
      const p=sizePresets[$('#addSize').value];
      return specimen({catalogNumber:cat,scientificName:$('#addTaxon').value.trim()||'Unidentified specimen',locality:$('#addLocality').value.trim(),recordedBy:$('#addCollector').value.trim(),eventDate:$('#addDate').value,identifiedBy:$('#addIdentifier').value.trim(),condition:$('#addCondition').value,notes:$('#addNotes').value.trim(),targetBoxId:currentBox().id,footprintWidthMm:p.w,footprintHeightMm:p.h,photoThumb:pendingPhoto});
    };
    $('#addToTray').onclick=()=>{const s=create();if(!s)return;pushHistory();state.specimens.push(s);selectedSpecimenId=s.id;persist();closeModal();renderAll();toast('Specimen added to placement tray');};
    $('#addAndPlace').onclick=()=>{const s=create();if(!s)return;pushHistory();state.specimens.push(s);selectedSpecimenId=s.id;placingSpecimenId=s.id;tool='place';persist();closeModal();renderAll();toast('Tap the box to place the specimen');};
  }

  function nextCatalogNumber() {
    const nums=state.specimens.map(s=>+(String(s.catalogNumber||'').match(/ENT-CH-(\d+)$/)||[])[1]).filter(Number.isFinite);
    return `ENT-CH-${String((Math.max(0,...nums)+1)).padStart(6,'0')}`;
  }

  function nextTemporaryNumber() {
    const nums=state.specimens.map(s=>+(String(s.catalogNumber||'').match(/^TEMP-(\d+)$/)||[])[1]).filter(Number.isFinite);
    let n=Math.max(0,...nums)+1;
    let candidate=`TEMP-${String(n).padStart(6,'0')}`;
    while(state.specimens.some(s=>s.catalogNumber===candidate)){n+=1;candidate=`TEMP-${String(n).padStart(6,'0')}`;}
    return candidate;
  }

  function openEditSpecimenRecord(s) {
    let replacementPhoto=null;
    showModal({eyebrow:'Editable specimen record',title:'Complete or revise information',body:`
      <div class="optional-record-note"><strong>No taxonomic field is required.</strong><span>Keep the record as unidentified until a determination is available.</span></div>
      <div class="form-grid">
        <div class="field"><label>Catalogue number <em>optional</em></label><input id="editCatalog" value="${esc(s.catalogNumber)}"></div>
        <div class="field"><label>Scientific name <em>optional</em></label><input id="editTaxon" value="${esc(s.scientificName==='Unidentified specimen'?'':s.scientificName)}" placeholder="Unidentified specimen"></div>
        <div class="field"><label>Collection code <em>optional</em></label><input id="editCollectionCode" value="${esc(s.collectionCode)}"></div>
        <div class="field"><label>Locality <em>optional</em></label><input id="editLocality" value="${esc(s.locality)}"></div>
        <div class="field"><label>Recorded by <em>optional</em></label><input id="editCollector" value="${esc(s.recordedBy)}"></div>
        <div class="field"><label>Event date <em>optional</em></label><input type="date" id="editDate" value="${esc(s.eventDate)}"></div>
        <div class="field"><label>Identified by <em>optional</em></label><input id="editIdentifier" value="${esc(s.identifiedBy)}"></div>
        <div class="field"><label>Condition</label><select id="editCondition">${['Not assessed','Good','Attention','Damaged','Missing'].map(v=>`<option ${s.condition===v?'selected':''}>${v}</option>`).join('')}</select></div>
        <div class="field full"><label>Replace specimen photo <em>optional</em></label><input type="file" id="editPhoto" accept="image/*"><small>Leave empty to keep the current photograph.</small></div>
        <div class="field full"><label>Notes <em>optional</em></label><textarea id="editNotes">${esc(s.notes)}</textarea></div>
      </div>`,foot:'<button class="btn" data-close-modal>Cancel</button><button class="btn primary" id="saveCatalogueRecord">Save record</button>'});
    $('#editPhoto').onchange=async e=>{if(e.target.files[0])replacementPhoto=await compressImage(e.target.files[0],720,720,.82,'contain');};
    $('#saveCatalogueRecord').onclick=()=>{
      let cat=$('#editCatalog').value.trim()||nextTemporaryNumber();
      if(state.specimens.some(other=>other.id!==s.id&&String(other.catalogNumber||'').toLowerCase()===cat.toLowerCase()))return toast('Catalogue number already exists','warn');
      pushHistory();
      s.catalogNumber=cat;s.scientificName=$('#editTaxon').value.trim()||'Unidentified specimen';s.collectionCode=$('#editCollectionCode').value.trim();s.locality=$('#editLocality').value.trim();s.recordedBy=$('#editCollector').value.trim();s.eventDate=$('#editDate').value;s.identifiedBy=$('#editIdentifier').value.trim();s.condition=$('#editCondition').value;s.notes=$('#editNotes').value.trim();if(replacementPhoto)s.photoThumb=replacementPhoto;s.icon=iconForTaxon(s.scientificName);s.updatedAt=nowISO();persist();closeModal();renderAll();toast('Specimen record updated');
    };
  }

  function storageTypeTitle(type) { return locationTypeMeta[type]?.label || 'Storage location'; }

  function nextBoxCode() {
    const used = new Set(state.boxes.map(b => String(b.code || '').toUpperCase()));
    let n = state.boxes.length + 1;
    while (used.has(`BOX-${String(n).padStart(2,'0')}`)) n++;
    return `BOX-${String(n).padStart(2,'0')}`;
  }

  function descendantLocationIds(locationId) {
    const result = new Set();
    const walk = id => (state.locations || []).filter(l => l.parentId === id).forEach(child => {
      if (result.has(child.id)) return;
      result.add(child.id);walk(child.id);
    });
    walk(locationId);
    return result;
  }

  function orderedLocationRows() {
    const result = [];
    const visit = (parentId, depth) => {
      (state.locations || []).filter(l => (l.parentId || null) === (parentId || null)).sort((a,b) => a.name.localeCompare(b.name)).forEach(location => {
        result.push({location,depth});visit(location.id,depth+1);
      });
    };
    visit(null,0);
    return result;
  }

  function pickerPathHtml(selectedId) {
    const parts = locationAncestors(selectedId);
    return `<div class="path-picker-current"><span class="path-chip root">◆ ${esc(state.collectionName)}</span>${parts.map(location => `<span class="path-arrow">›</span><span class="path-chip">${storageIcon(location.type)} ${esc(location.name)}</span>`).join('')}</div>`;
  }

  function renderLocationPicker(container, selectedId, onSelect, {excludeIds=new Set(),allowRoot=true,help='Choose where this item lives in the collection.'}={}) {
    const draw = (query='') => {
      const q = query.trim().toLowerCase();
      const rows = orderedLocationRows().filter(({location}) => !excludeIds.has(location.id) && (!q || [location.name,location.code,storageTypeTitle(location.type),locationPath(location.id)].join(' ').toLowerCase().includes(q)));
      container.innerHTML = `${pickerPathHtml(selectedId)}
        <div class="path-picker-help">${esc(help)}</div>
        <input class="input path-picker-search" placeholder="Find a building, room, cabinet…" value="${esc(query)}">
        <div class="path-picker-list">
          ${allowRoot ? `<button type="button" class="path-choice ${selectedId == null ? 'selected' : ''}" data-location-choice=""><span class="path-choice-icon">◆</span><span><strong>${esc(state.collectionName)}</strong><small>Collection root</small></span><i>Choose</i></button>` : ''}
          ${rows.map(({location,depth}) => `<button type="button" class="path-choice ${selectedId === location.id ? 'selected' : ''}" data-location-choice="${location.id}" style="--location-depth:${depth}"><span class="path-choice-icon">${storageIcon(location.type)}</span><span><strong>${esc(location.name)}</strong><small>${esc(storageTypeTitle(location.type))}${location.code ? ` · ${esc(location.code)}` : ''}</small></span><i>Choose</i></button>`).join('') || '<div class="path-picker-empty">No matching locations</div>'}
        </div>`;
      const search = $('.path-picker-search',container);
      search.oninput = () => draw(search.value);
      $$('[data-location-choice]',container).forEach(button => button.onclick = () => {
        selectedId = button.dataset.locationChoice || null;
        onSelect(selectedId);
        draw(search.value);
      });
    };
    draw('');
  }

  function currentSuggestedParent() {
    return currentBox()?.parentLocationId || null;
  }

  function sensibleParentForType(type,requestedId) {
    if (type === 'building') return null;
    if (type === 'custom' || type === 'storage' || type === 'box') return requestedId || null;
    const preferred = {
      room:['building'],
      cabinet:['room','building','storage','custom'],
      drawer:['cabinet','storage','custom'],
      shelf:['cabinet','room','storage','custom'],
      freezer:['room','building','storage','custom']
    }[type] || [];
    const chain = locationAncestors(requestedId).reverse();
    return chain.find(location => preferred.includes(location.type))?.id || requestedId || null;
  }

  function openStorageCreateMenu(parentId = currentSuggestedParent()) {
    const parent = locationById(parentId);
    const context = parent ? `The current context is ${parent.name}; EntoBox will suggest the nearest sensible parent for each level.` : `Add a new level at the root of ${state.collectionName}.`;
    const cards = [
      ['building','▦','Building','A separate building, wing, or facility'],
      ['room','□','Room or laboratory','A room, teaching laboratory, or collection room'],
      ['cabinet','▥','Cabinet','A cabinet, cupboard, or compactor unit'],
      ['drawer','▤','Drawer','A drawer inside a cabinet'],
      ['shelf','═','Shelf or rack','A shelf, rack position, or storage bay'],
      ['freezer','❄','Cold storage','A freezer, refrigerator, or cold room'],
      ['custom','◇','Other location','Create a custom level for your collection'],
      ['box','▣','Specimen box','Create a spatial specimen box and start working in it']
    ];
    showModal({eyebrow:'Collection structure',title:'What would you like to add?',body:`<div class="storage-create-intro">Build the hierarchy at the level of detail your collection actually uses. You can skip levels—for example, a box may live directly inside a room.<br><b>${esc(context)}</b></div><div class="storage-create-grid">${cards.map(([type,icon,title,copy]) => `<button class="storage-create-card ${type==='box'?'featured':''}" data-create-storage="${type}"><span>${icon}</span><strong>${title}</strong><small>${copy}</small></button>`).join('')}</div>`,foot:'<button class="btn" data-close-modal>Cancel</button>'});
    $$('[data-create-storage]').forEach(button => button.onclick = () => {
      const type = button.dataset.createStorage;
      const suggestedParent = sensibleParentForType(type,parentId);
      if (type === 'box') openNewBox(suggestedParent);
      else openNewLocation(type,suggestedParent);
    });
  }

  function openNewLocation(type='custom',initialParentId=null) {
    let parentId = initialParentId || null;
    const meta = locationTypeMeta[type] || locationTypeMeta.custom;
    const defaults = {building:'New building',room:'New room',cabinet:'New cabinet',drawer:'New drawer',shelf:'New shelf',freezer:'New cold storage',storage:'New storage area',custom:'New location'};
    showModal({eyebrow:'Storage hierarchy',title:`Create ${meta.label.toLowerCase()}`,body:`<div class="form-grid storage-form"><div class="field"><label>Name *</label><input id="newLocationName" value="${defaults[type] || 'New location'}"></div><div class="field"><label>Code <em>optional</em></label><input id="newLocationCode" placeholder="e.g. C-17"></div><div class="field full"><label>Location type</label><select id="newLocationType">${Object.entries(locationTypeMeta).map(([key,value]) => `<option value="${key}" ${key===type?'selected':''}>${value.label}</option>`).join('')}</select></div><div class="field full"><label>Place inside</label><div id="newLocationParentPicker" class="location-picker"></div></div><div class="field full"><label>Notes <em>optional</em></label><textarea id="newLocationNotes" placeholder="Access restrictions, room details, climate information…"></textarea></div></div>`,foot:'<button class="btn" data-close-modal>Cancel</button><button class="btn primary" id="createLocationBtn">Create location</button>'});
    renderLocationPicker($('#newLocationParentPicker'),parentId,id => parentId=id,{help:'Select the parent level. Choose the collection root for a top-level location.'});
    $('#createLocationBtn').onclick = () => {
      const name = $('#newLocationName').value.trim();
      if (!name) return toast('Location name is required','warn');
      const selectedType = $('#newLocationType').value;
      pushHistory();
      const location = {id:uid(),type:selectedType,name,code:$('#newLocationCode').value.trim(),parentId,notes:$('#newLocationNotes').value.trim()};
      state.locations.push(location);
      currentView = 'workspace';
      state.preferences.treeOpen[parentId || 'root'] = true;
      state.preferences.treeOpen[location.id] = true;
      syncAllBoxPaths();persist();closeModal();renderAll();setNavigationOpen(true);toast(`${storageTypeTitle(selectedType)} created`);
    };
  }

  function openNewBox(initialParentId = currentSuggestedParent()) {
    let parentId = initialParentId || null;
    showModal({eyebrow:'Storage hierarchy',title:'Create spatial box',body:`<div class="form-grid storage-form"><div class="field"><label>Box name *</label><input id="newBoxName" value="New entomology box"></div><div class="field"><label>Box code *</label><input id="newBoxCode" value="${nextBoxCode()}"></div><div class="field"><label>Physical width (mm)</label><input type="number" id="newBoxW" value="400"></div><div class="field"><label>Physical height (mm)</label><input type="number" id="newBoxH" value="300"></div><div class="field full"><label>Place box inside</label><div id="newBoxParentPicker" class="location-picker"></div></div></div>`,foot:'<button class="btn" data-close-modal>Cancel</button><button class="btn primary" id="createBoxBtn">Create and open box</button>'});
    renderLocationPicker($('#newBoxParentPicker'),parentId,id => parentId=id,{help:'Choose the room, cabinet, drawer, shelf, or other storage location containing this box.'});
    $('#createBoxBtn').onclick=()=>{
      const name=$('#newBoxName').value.trim(),code=$('#newBoxCode').value.trim();
      if(!name||!code)return toast('Name and code are required','warn');
      if(state.boxes.some(box => String(box.code).toLowerCase() === code.toLowerCase())) return toast('Box code already exists','warn');
      pushHistory();
      const b={id:uid(),name,code,parentLocationId:parentId,path:'',widthMm:clamp(+$('#newBoxW').value||400,100,1200),heightMm:clamp(+$('#newBoxH').value||300,80,900),gridCols:16,gridRows:12,background:DEMO_BG};
      state.boxes.push(b);syncAllBoxPaths();state.selectedBoxId=b.id;currentView='workspace';state.preferences.navOpen=false;selectedSpecimenId=null;selectedZoneId=null;persist();closeModal();renderAll();toast('Box created and opened');
    };
  }

  function openEditLocation(location) {
    if (!location) return;
    let parentId = location.parentId || null;
    const excluded = descendantLocationIds(location.id);excluded.add(location.id);
    showModal({eyebrow:'Storage hierarchy',title:`Edit ${storageTypeTitle(location.type).toLowerCase()}`,body:`<div class="form-grid storage-form"><div class="field"><label>Name *</label><input id="editLocationName" value="${esc(location.name)}"></div><div class="field"><label>Code <em>optional</em></label><input id="editLocationCode" value="${esc(location.code || '')}"></div><div class="field full"><label>Location type</label><select id="editLocationType">${Object.entries(locationTypeMeta).map(([key,value]) => `<option value="${key}" ${key===location.type?'selected':''}>${value.label}</option>`).join('')}</select></div><div class="field full"><label>Move inside</label><div id="editLocationParentPicker" class="location-picker"></div></div><div class="field full"><label>Notes <em>optional</em></label><textarea id="editLocationNotes">${esc(location.notes || '')}</textarea></div></div>`,foot:'<button class="btn danger-ghost" id="deleteLocationBtn">Delete</button><span class="modal-spacer"></span><button class="btn" data-close-modal>Cancel</button><button class="btn primary" id="saveLocationBtn">Save location</button>'});
    renderLocationPicker($('#editLocationParentPicker'),parentId,id => parentId=id,{excludeIds:excluded,help:'Moving a location also moves every nested cabinet, drawer, box, and specimen with it.'});
    $('#saveLocationBtn').onclick = () => {
      const name = $('#editLocationName').value.trim();if(!name)return toast('Location name is required','warn');
      pushHistory();location.name=name;location.code=$('#editLocationCode').value.trim();location.type=$('#editLocationType').value;location.parentId=parentId;location.notes=$('#editLocationNotes').value.trim();syncAllBoxPaths();persist();closeModal();renderAll();toast('Storage location updated');
    };
    $('#deleteLocationBtn').onclick = () => {
      const childCount=state.locations.filter(l=>l.parentId===location.id).length;
      const boxCount=state.boxes.filter(b=>b.parentLocationId===location.id).length;
      if(childCount||boxCount)return toast(`Move or delete ${childCount+boxCount} nested item${childCount+boxCount===1?'':'s'} first`,'warn');
      if(!confirm(`Delete ${location.name}?`))return;
      pushHistory();state.locations=state.locations.filter(l=>l.id!==location.id);syncAllBoxPaths();persist();closeModal();renderAll();toast('Storage location deleted');
    };
  }

  function openEditBox(box) {
    if (!box) return;
    let parentId = box.parentLocationId || null;
    showModal({eyebrow:'Spatial calibration',title:'Edit or move box',body:`<div class="form-grid storage-form"><div class="field"><label>Box name</label><input id="editBoxName" value="${esc(box.name)}"></div><div class="field"><label>Code</label><input id="editBoxCode" value="${esc(box.code)}"></div><div class="field"><label>Width (mm)</label><input type="number" id="editBoxW" value="${box.widthMm}"></div><div class="field"><label>Height (mm)</label><input type="number" id="editBoxH" value="${box.heightMm}"></div><div class="field"><label>Grid columns</label><input type="number" id="editGridCols" value="${box.gridCols}"></div><div class="field"><label>Grid rows</label><input type="number" id="editGridRows" value="${box.gridRows}"></div><div class="field full"><label>Move box inside</label><div id="editBoxParentPicker" class="location-picker"></div></div></div>`,foot:'<button class="btn danger-ghost" id="deleteBoxBtn">Delete box</button><span class="modal-spacer"></span><button class="btn" data-close-modal>Cancel</button><button class="btn primary" id="saveBoxBtn">Save box</button>'});
    renderLocationPicker($('#editBoxParentPicker'),parentId,id => parentId=id,{help:'Choose a new parent location. The specimen coordinates inside the box will not change.'});
    $('#saveBoxBtn').onclick=()=>{
      const code=$('#editBoxCode').value.trim()||box.code;
      if(state.boxes.some(other=>other.id!==box.id&&String(other.code).toLowerCase()===code.toLowerCase()))return toast('Box code already exists','warn');
      pushHistory();box.name=$('#editBoxName').value.trim()||box.name;box.code=code;box.widthMm=clamp(+$('#editBoxW').value||box.widthMm,100,1200);box.heightMm=clamp(+$('#editBoxH').value||box.heightMm,80,900);box.gridCols=clamp(+$('#editGridCols').value||16,2,50);box.gridRows=clamp(+$('#editGridRows').value||12,2,50);box.parentLocationId=parentId;syncAllBoxPaths();persist();closeModal();renderAll();toast('Box updated');
    };
    $('#deleteBoxBtn').onclick=()=>{
      const records=state.specimens.filter(s=>s.boxId===box.id||s.targetBoxId===box.id).length;
      const zones=state.zones.filter(z=>z.boxId===box.id).length;
      if(records||zones)return toast(`This box still contains ${records} record${records===1?'':'s'} and ${zones} zone${zones===1?'':'s'}`,'warn');
      if(!confirm(`Delete ${box.name}?`))return;
      pushHistory();state.boxes=state.boxes.filter(b=>b.id!==box.id);state.selectedBoxId=state.boxes[0]?.id||null;persist();closeModal();renderAll();toast('Box deleted');
    };
  }

  async function compressImage(file,maxW,maxH,quality=.82,fit='cover') {
    const url=URL.createObjectURL(file);
    try{
      const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=url;});
      const scale=Math.min(maxW/img.width,maxH/img.height,1);const w=Math.max(1,Math.round(img.width*scale)),h=Math.max(1,Math.round(img.height*scale));const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.fillStyle='#f4ead8';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);return c.toDataURL('image/jpeg',quality);
    } finally { URL.revokeObjectURL(url); }
  }

  async function handleBoxPhoto(file) {
    if(!file)return;pushHistory();const box=currentBox();box.background=await compressImage(file,1800,1400,.80,'cover');persist('Box photograph saved');renderAll();toast('Box photograph added');
  }

  function exportBackup() {
    const blob=new Blob([JSON.stringify({...state,exportedAt:nowISO()},null,2)],{type:'application/json'});downloadBlob(blob,`entobox-v3-4-backup-${new Date().toISOString().slice(0,10)}.json`);toast('Backup downloaded');
  }
  function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}

  function detectHeaderIndex(rows) {
    const scored = rows.slice(0, 30).map((row, index) => {
      const values = row.map(v => String(v ?? '').trim()).filter(Boolean);
      const textLike = values.filter(v => Number.isNaN(Number(v))).length;
      const known = values.filter(v => {
        const n = normaliseHeader(v);
        return Object.values(importSynonyms).some(list => list.includes(n));
      }).length;
      return { index, score: known * 8 + textLike * 1.2 + Math.min(values.length, 12) - index * .05 };
    }).filter(x => (rows[x.index] || []).filter(v => String(v ?? '').trim()).length >= 2);
    scored.sort((a,b) => b.score - a.score);
    return scored[0]?.index ?? rows.findIndex(r => r.filter(x => String(x ?? '').trim()).length >= 2);
  }

  function cleanHeaderRow(row) {
    const seen = new Map();
    return row.map((h, i) => {
      const base = String(h ?? '').trim() || `Column ${i + 1}`;
      const count = (seen.get(base) || 0) + 1;
      seen.set(base, count);
      return count === 1 ? base : `${base} (${count})`;
    });
  }

  function prepareRows(rawRows, headerIndex) {
    if (!rawRows?.length) throw new Error('No rows found');
    const index = clamp(Number(headerIndex) || 0, 0, rawRows.length - 1);
    const headers = cleanHeaderRow(rawRows[index] || []);
    const rows = rawRows.slice(index + 1)
      .filter(r => r.some(x => String(x ?? '').trim() !== ''))
      .map(vals => Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? ''])));
    return { headers, rows, headerIndex:index };
  }

  function parseDelimited(text) {
    const first=text.split(/\r?\n/)[0]||'';const delim=(first.match(/\t/g)||[]).length>(first.match(/,/g)||[]).length?'\t':',';const rawRows=[];let row=[],cell='',quote=false;
    for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quote&&text[i+1]==='"'){cell+='"';i++;}else quote=!quote;}else if(c===delim&&!quote){row.push(cell);cell='';}else if((c==='\n'||c==='\r')&&!quote){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);rawRows.push(row);row=[];cell='';}else cell+=c;}
    row.push(cell);if(row.some(x=>String(x).trim()!==''))rawRows.push(row);
    const headerIndex=detectHeaderIndex(rawRows);
    return {rawRows, ...prepareRows(rawRows, headerIndex)};
  }

  async function parseXlsx(arrayBuffer) {
    if(!('DecompressionStream' in window))throw new Error('This browser cannot unpack .xlsx files. Use CSV or a recent Chromium/Safari browser.');
    const entries=await unzipEntries(arrayBuffer);const decoder=new TextDecoder('utf-8');const text=name=>entries[name]?decoder.decode(entries[name]):'';
    const shared=[];const sharedXml=text('xl/sharedStrings.xml');if(sharedXml){const doc=new DOMParser().parseFromString(sharedXml,'application/xml');for(const si of [...doc.getElementsByTagNameNS('*','si')])shared.push([...si.getElementsByTagNameNS('*','t')].map(t=>t.textContent||'').join(''));}
    const sheetName=Object.keys(entries).filter(n=>/^xl\/worksheets\/sheet\d+\.xml$/.test(n)).sort()[0];if(!sheetName)throw new Error('No worksheet found in this Excel file');const doc=new DOMParser().parseFromString(text(sheetName),'application/xml');const rawRows=[];
    for(const rowNode of [...doc.getElementsByTagNameNS('*','row')]){const row=[];const excelRow=Math.max(1,Number(rowNode.getAttribute('r'))||rawRows.length+1);while(rawRows.length<excelRow-1)rawRows.push([]);for(const c of [...rowNode.getElementsByTagNameNS('*','c')]){const ref=c.getAttribute('r')||'';const letters=(ref.match(/[A-Z]+/i)||['A'])[0].toUpperCase();let col=0;for(const ch of letters)col=col*26+ch.charCodeAt(0)-64;col-=1;const type=c.getAttribute('t');let value='';if(type==='inlineStr'){value=[...c.getElementsByTagNameNS('*','t')].map(t=>t.textContent||'').join('');}else{const v=c.getElementsByTagNameNS('*','v')[0]?.textContent??'';if(type==='s')value=shared[+v]??'';else if(type==='b')value=v==='1';else if(v!==''&&!Number.isNaN(Number(v)))value=Number(v);else value=v;}row[col]=value;}rawRows[excelRow-1]=row;}
    const headerIndex=detectHeaderIndex(rawRows);
    return {rawRows, ...prepareRows(rawRows, headerIndex)};
  }

  async function unzipEntries(arrayBuffer) {
    const view=new DataView(arrayBuffer);const bytes=new Uint8Array(arrayBuffer);let eocd=-1;for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--){if(view.getUint32(i,true)===0x06054b50){eocd=i;break;}}if(eocd<0)throw new Error('Invalid .xlsx ZIP structure');const count=view.getUint16(eocd+10,true);let pos=view.getUint32(eocd+16,true);const out={};const decoder=new TextDecoder('utf-8');
    for(let i=0;i<count;i++){if(view.getUint32(pos,true)!==0x02014b50)break;const method=view.getUint16(pos+10,true),compressedSize=view.getUint32(pos+20,true),nameLen=view.getUint16(pos+28,true),extraLen=view.getUint16(pos+30,true),commentLen=view.getUint16(pos+32,true),localOffset=view.getUint32(pos+42,true);const name=decoder.decode(bytes.slice(pos+46,pos+46+nameLen));const localNameLen=view.getUint16(localOffset+26,true),localExtraLen=view.getUint16(localOffset+28,true),start=localOffset+30+localNameLen+localExtraLen;const compressed=bytes.slice(start,start+compressedSize);let data;if(method===0)data=compressed;else if(method===8){const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'));data=new Uint8Array(await new Response(stream).arrayBuffer());}else throw new Error(`Unsupported Excel compression method ${method}`);out[name]=data;pos+=46+nameLen+extraLen+commentLen;}
    return out;
  }

  const importFields=[
    ['catalogNumber','Catalogue number'],['scientificName','Scientific name'],['collectionCode','Collection code'],['locality','Locality'],['recordedBy','Collector / recorded by'],['eventDate','Event date'],['identifiedBy','Identified by'],['sizeClass','Size class'],['footprintWidthMm','Footprint width (mm)'],['footprintHeightMm','Footprint height (mm)'],['condition','Condition'],['notes','Notes']
  ];
  const importSynonyms={catalogNumber:['catalognumber','cataloguenumber','specimenid','specimennumber','occurrenceid','id'],scientificName:['scientificname','taxon','species','name','genus','specificepithet','subspecies','infraspecificepithet'],collectionCode:['collectioncode','collection'],locality:['locality','verbatimlocality','location'],recordedBy:['recordedby','collector','collectors'],eventDate:['eventdate','collectiondate','date'],identifiedBy:['identifiedby','identifier','detby'],sizeClass:['sizeclass','size'],footprintWidthMm:['footprintwidthmm','widthmm','specimenwidthmm'],footprintHeightMm:['footprintheightmm','heightmm','specimenheightmm'],condition:['condition','status'],notes:['notes','remarks','occurrenceremarks']};
  const taxonPartHeaders=['genus','subgenus','species','specificepithet','subspecies','infraspecificepithet','variety','form'];
  function normaliseHeader(s){return String(s).toLowerCase().replace(/[^a-z0-9]/g,'');}
  function autoScientificNameMap(headers){
    const exact=headers.find(h=>['scientificname','taxon'].includes(normaliseHeader(h)));
    if(exact)return [exact];
    const parts=headers.filter(h=>taxonPartHeaders.includes(normaliseHeader(h)));
    if(parts.length)return parts;
    const fallback=headers.find(h=>['species','name'].includes(normaliseHeader(h)));
    return fallback?[fallback]:[];
  }
  function autoMap(headers){
    const map={};
    for(const [field] of importFields){
      if(field==='scientificName'){map[field]=autoScientificNameMap(headers);continue;}
      map[field]=headers.find(h=>(importSynonyms[field]||[]).includes(normaliseHeader(h)))||'';
    }
    return map;
  }

  async function loadSpreadsheet(file) {
    try{
      let parsed;if(file.name.toLowerCase().endsWith('.xlsx'))parsed=await parseXlsx(await file.arrayBuffer());else parsed=parseDelimited(await file.text());pendingImport={fileName:file.name,...parsed,mapping:autoMap(parsed.headers)};openImportMapping();
    }catch(e){toast(e.message||'Could not read spreadsheet','error');}
  }

  function previewRowsHtml(p) {
    const total=p.rawRows.length;
    const start=clamp(p.headerIndex-2,0,Math.max(0,total-1));
    const end=Math.min(total,start+7);
    const maxCols=Math.min(10,Math.max(1,...p.rawRows.slice(start,end).map(r=>r.length)));
    const rows=p.rawRows.slice(start,end);
    return `<div class="sheet-preview-wrap"><table class="sheet-preview"><thead><tr><th class="row-number"></th>${Array.from({length:maxCols},(_,i)=>`<th>${String.fromCharCode(65+i)}</th>`).join('')}</tr></thead><tbody>${rows.map((row,offset)=>{const realIndex=start+offset;return `<tr class="${realIndex===p.headerIndex?'chosen-header':''}" data-preview-row="${realIndex}" title="Use row ${realIndex+1} as column names"><th class="row-number">${realIndex+1}</th>${Array.from({length:maxCols},(_,i)=>`<td>${esc(row[i]??'')}</td>`).join('')}</tr>`;}).join('')}</tbody></table></div>`;
  }

  function headerRowOptions(p) {
    return p.rawRows.slice(0,Math.min(40,p.rawRows.length)).map((row,index)=>{
      const sample=row.map(v=>String(v??'').trim()).filter(Boolean).slice(0,3).join(' · ') || 'empty row';
      return `<option value="${index}" ${index===p.headerIndex?'selected':''}>Row ${index+1} — ${esc(sample.slice(0,75))}</option>`;
    }).join('');
  }

  function setImportHeaderRow(index) {
    const p=pendingImport;if(!p)return;
    const prepared=prepareRows(p.rawRows,index);
    p.headerIndex=prepared.headerIndex;p.headers=prepared.headers;p.rows=prepared.rows;p.mapping=autoMap(p.headers);
    openImportMapping();
  }

  function scientificNameChoicesHtml(p){
    const selected=new Set(Array.isArray(p.mapping.scientificName)?p.mapping.scientificName:[]);
    return `<div class="multi-column-picker" id="scientificNamePicker">${p.headers.map((h,index)=>`<label class="column-choice ${selected.has(h)?'selected':''}"><input type="checkbox" data-scientific-column value="${esc(h)}" ${selected.has(h)?'checked':''}><span><b>${String.fromCharCode(65+Math.min(index,25))}</b>${esc(h)}</span></label>`).join('')}</div><div class="combined-name-preview" id="scientificNamePreview">${scientificNamePreviewHtml(p)}</div>`;
  }

  function combineMappedColumns(row,columns){return (columns||[]).map(h=>String(row[h]??'').trim()).filter(Boolean).join(' ').replace(/\s+/g,' ').trim();}

  function scientificNamePreviewHtml(p){
    const columns=Array.isArray(p.mapping.scientificName)?p.mapping.scientificName:[];
    if(!columns.length)return '<span>No columns selected — imported records remain unidentified.</span>';
    const examples=p.rows.slice(0,3).map(row=>combineMappedColumns(row,columns)).filter(Boolean);
    return `<span>Combined in spreadsheet order:</span><strong>${examples.length?examples.map(esc).join(' · '):'No values in the preview rows'}</strong>`;
  }

  function mappingControlHtml(p,field){
    if(field==='scientificName')return scientificNameChoicesHtml(p);
    return `<select data-map-field="${field}"><option value="">Not mapped</option>${p.headers.map(h=>`<option value="${esc(h)}" ${p.mapping[field]===h?'selected':''}>${esc(h)}</option>`).join('')}</select>`;
  }

  function openImportMapping() {
    const p=pendingImport;if(!p)return;
    showModal({eyebrow:'Spreadsheet placement workflow',title:'Preview and map imported columns',body:`
      <div class="import-summary"><b>${esc(p.fileName)}</b> · ${p.rows.length} data rows · records will enter the placement tray for <b>${esc(currentBox().name)}</b>.</div>
      <section class="import-step"><div class="import-step-head"><div><span class="step-number">1</span><b>Choose the row containing column names</b><small>EntoBox has selected one automatically. Change it only when necessary.</small></div><select id="headerRowSelect" aria-label="Header row">${headerRowOptions(p)}</select></div>${previewRowsHtml(p)}</section>
      <section class="import-step"><div class="import-step-head"><div><span class="step-number">2</span><b>Match spreadsheet columns to EntoBox fields</b><small>Every mapping is optional. Scientific name can be assembled from several columns, such as Genus + species + subspecies.</small></div></div><div class="mapping-grid">${importFields.map(([field,label])=>`<label>${esc(label)}${field==='scientificName'?'<small>Choose one or several columns</small>':''}</label><span>→</span><div class="mapping-control ${field==='scientificName'?'wide-control':''}">${mappingControlHtml(p,field)}</div>`).join('')}</div></section>
      <div class="import-note">Only the first worksheet is used. Rows above the selected header are ignored. All mappings are optional. Missing catalogue numbers receive temporary IDs; records without taxonomic data remain “Unidentified specimen”.</div>`,foot:'<button class="btn" data-close-modal>Cancel</button><button class="btn primary" id="commitSpreadsheetImport">Import to placement tray</button>'});
    $('#headerRowSelect').onchange=e=>setImportHeaderRow(+e.target.value);
    $$('[data-preview-row]').forEach(row=>row.onclick=()=>setImportHeaderRow(+row.dataset.previewRow));
    $$('[data-map-field]').forEach(control=>control.onchange=()=>p.mapping[control.dataset.mapField]=control.value);
    $$('[data-scientific-column]').forEach(control=>control.onchange=()=>{
      const chosen=p.headers.filter(h=>$$('[data-scientific-column]').some(x=>x.value===h&&x.checked));
      p.mapping.scientificName=chosen;
      $$('.column-choice').forEach(label=>label.classList.toggle('selected',label.querySelector('input').checked));
      $('#scientificNamePreview').innerHTML=scientificNamePreviewHtml(p);
    });
    $('#commitSpreadsheetImport').onclick=commitSpreadsheetImport;
  }

  function mapped(row,field){
    const mapping=pendingImport.mapping[field];
    if(Array.isArray(mapping))return combineMappedColumns(row,mapping);
    return mapping?row[mapping]:'';
  }
  function excelDateToISO(v){if(typeof v==='number'&&v>1000&&v<100000){const d=new Date(Math.round((v-25569)*86400*1000));return Number.isNaN(d.getTime())?'':d.toISOString().slice(0,10);}return String(v??'').trim();}
  function commitSpreadsheetImport() {
    const rows=pendingImport.rows;let added=0,generated=0;pushHistory();
    for(const row of rows){
      let cat=String(mapped(row,'catalogNumber')??'').trim();if(!cat){cat=nextTemporaryNumber();generated++;}
      while(state.specimens.some(s=>String(s.catalogNumber||'').toLowerCase()===cat.toLowerCase()))cat=`${cat}-D${Math.floor(Math.random()*900+100)}`;
      const sizeKey=String(mapped(row,'sizeClass')||'m').trim().toLowerCase();const preset=sizePresets[sizeKey]||sizePresets.m;const w=Number(mapped(row,'footprintWidthMm'))||preset.w,h=Number(mapped(row,'footprintHeightMm'))||preset.h;
      state.specimens.push(specimen({catalogNumber:cat,scientificName:String(mapped(row,'scientificName')||'Unidentified specimen').trim(),collectionCode:String(mapped(row,'collectionCode')||'').trim(),locality:String(mapped(row,'locality')||'').trim(),recordedBy:String(mapped(row,'recordedBy')||'').trim(),eventDate:excelDateToISO(mapped(row,'eventDate')),identifiedBy:String(mapped(row,'identifiedBy')||'').trim(),condition:String(mapped(row,'condition')||'Not assessed').trim(),notes:String(mapped(row,'notes')||'').trim(),targetBoxId:currentBox().id,footprintWidthMm:w,footprintHeightMm:h}));added++;
    }
    pendingImport=null;persist();closeModal();renderAll();toast(`${added} records imported to the placement tray${generated?` · ${generated} temporary IDs generated`:''}`);
  }

  // Main UI bindings
  $('#homeBtn').onclick=()=>setView('home');
  $('#homeBrand').onclick=()=>setView('home');
  $('#homeOpenCurrentBoxBtn').onclick=()=>currentBox()?openBoxWorkspace(currentBox().id):openStorageCreateMenu(null);
  $('#homeManageStorageBtn').onclick=()=>{currentView='workspace';state.preferences.navOpen=true;persist();renderAll();};
  $('#homeOpenStructureBtn').onclick=()=>{currentView='workspace';state.preferences.navOpen=true;persist();renderAll();};
  $('#homeCreateStorageBtn').onclick=()=>openStorageCreateMenu(null);
  $('#homeShowAllAlertsBtn').onclick=()=>{homeAlertsExpanded=!homeAlertsExpanded;renderHome();};
  $$('[data-home-jump]').forEach(button=>button.onclick=()=>{
    const target=button.dataset.homeJump;
    if(target==='alerts')return scrollHomeTo('homeAlertsSection');
    if(target==='boxes')return scrollHomeTo('homeOverviewSection');
    if(target==='storage'){currentView='workspace';state.preferences.navOpen=true;persist();return renderAll();}
    if(target==='specimens')return openCollectionRecords('all');
    if(target==='unidentified')return openCollectionRecords('unidentified');
    if(target==='unplaced')return openCollectionRecords('unplaced');
  });
  $('#collectionNavBtn').onclick=()=>setNavigationOpen(!state.preferences.navOpen);
  $('#currentBoxChip').onclick=()=>setNavigationOpen(true);
  $('#drawerHandle').onclick=()=>setNavigationOpen(true);
  $('#closeCollectionNavBtn').onclick=()=>setNavigationOpen(false);
  $('#drawerBackdrop').onclick=()=>setNavigationOpen(false);
  $('#structureSearch').oninput=renderBoxes;
  $('#undoBtn').onclick=undo;
  $('#exportBtn').onclick=exportBackup;
  $('#addSpecimenBtn').onclick=openAddSpecimen;
  $('#newBoxBtn').onclick=()=>openStorageCreateMenu(currentSuggestedParent());
  $('#importBtn').onclick=()=>$('#importFileInput').click();
  $('#queueSearch').oninput=renderQueue;
  $('#autoPlaceBtn').onclick=autoPlace;
  $('#boxPhotoBtn').onclick=()=>$('#boxPhotoInput').click();
  $('#newZoneBtn').onclick=startZoneTool;
  $('#fitBtn').onclick=()=>{state.preferences.zoom=100;persist();renderAll();};
  $('#boxPhotoInput').onchange=e=>{handleBoxPhoto(e.target.files[0]);e.target.value='';};
  $('#importFileInput').onchange=e=>{if(e.target.files[0])loadSpreadsheet(e.target.files[0]);e.target.value='';};
  $('#modalClose').onclick=closeModal;
  $('#modalBackdrop').onclick=e=>{if(e.target===$('#modalBackdrop'))closeModal();};
  $$('[data-appearance]').forEach(b=>b.onclick=()=>{state.preferences.appearance=b.dataset.appearance;persist();renderAll();});
  $('#showZonesToggle').onchange=e=>{state.preferences.showZones=e.target.checked;persist();renderAll();};
  $('#showGridToggle').onchange=e=>{state.preferences.showGrid=e.target.checked;persist();renderAll();};
  $('#snapToggle').onchange=e=>{state.preferences.snap=e.target.checked;persist();renderAll();};
  $('#zoomRange').oninput=e=>{state.preferences.zoom=+e.target.value;persist();renderMap();renderControls();};
  $$('.inspector-tabs button').forEach(b=>b.onclick=()=>{inspectorTab=b.dataset.inspectorTab;renderInspector();});
  $('#boxStage').onpointerdown=handleStagePointerDown;
  $('#boxStage').onpointermove=handleStagePointerMove;
  $('#boxStage').onpointerup=handleStagePointerUp;
  $('#boxStage').ondragover=e=>{e.preventDefault();$('#boxStage').classList.add('drag-target');e.dataTransfer.dropEffect='move';};
  $('#boxStage').ondragleave=e=>{if(!$('#boxStage').contains(e.relatedTarget))$('#boxStage').classList.remove('drag-target');};
  $('#boxStage').ondrop=e=>{e.preventDefault();$('#boxStage').classList.remove('drag-target');const id=e.dataTransfer.getData('text/entobox-specimen');if(id){const p=pointFromEvent(e);placeSpecimenAt(id,p.x,p.y);}};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){placingSpecimenId=null;tool='select';zoneDraftState=null;$('#zoneDraft').hidden=true;renderAll();}if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();undo();}});

  renderAll();
  if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
