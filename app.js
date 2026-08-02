(() => {
  'use strict';

  const APP_VERSION = '4.5.0-beta';
  const STATE_KEY = 'entobox-v4-beta-state';
  const LEGACY_STATE_KEY = 'entobox-v3-spatial-state';
  const PRE_IMPORT_KEY = 'entobox-v4-pre-import-backup';
  const HAD_SAVED_STATE_AT_LAUNCH = (() => { try { return !!(localStorage.getItem(STATE_KEY) || localStorage.getItem(LEGACY_STATE_KEY)); } catch { return false; } })();
  const DEMO_BG = 'assets/demo-box.svg';
  const BLANK_BG = 'assets/blank-box.svg';
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
      placementStatus: data.placementStatus || 'active',
      preferredZoneId: data.preferredZoneId || null,
      createdAt: data.createdAt || nowISO(),
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
      version: 4,
      selectedBoxId: boxA,
      preferences: { appearance:'mixed', showZones:true, showGrid:false, snap:false, zoom:100, navOpen:false, treeOpen:{}, editMode:'browse', queueFilter:'active', queueView:'compact', gettingStartedHidden:false },
      collectionName: 'Demo Natural History Collection',
      collectionCode: 'DEMO',
      meta: { isDemo:true, createdAt:nowISO(), tourCompleted:false, hasOpenedBox:false, hasExportedBackup:false, importedOnce:false, lastSavedAt:null },
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


  function emptyState({collectionName='My Entomology Collection', collectionCode=''} = {}) {
    return {
      version: 4,
      selectedBoxId: null,
      preferences: { appearance:'mixed', showZones:true, showGrid:false, snap:false, zoom:100, navOpen:false, treeOpen:{}, editMode:'browse', queueFilter:'active', queueView:'compact', gettingStartedHidden:false },
      collectionName: String(collectionName || '').trim() || 'My Entomology Collection',
      collectionCode: String(collectionCode || '').trim(),
      meta: { isDemo:false, createdAt:nowISO(), tourCompleted:true, hasOpenedBox:false, hasExportedBackup:false, importedOnce:false, lastSavedAt:null },
      locations: [],
      boxes: [],
      zones: [],
      specimens: []
    };
  }

  let welcomePending = !HAD_SAVED_STATE_AT_LAUNCH;
  let modalLocked = false;

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
  let selectedAlertId = null;
  let selectedQueueIds = new Set();
  let tourStep = -1;
  let spacePressed = false;
  let panState = null;
  let visibleQueueIds = [];
  let setupWizardDraft = null;

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
    data.version = 4;
    data.collectionName ||= fallback.collectionName;
    data.collectionCode ??= '';
    data.meta ||= {};
    data.meta.isDemo ??= /^Demo\b/i.test(data.collectionName);
    data.meta.createdAt ||= nowISO();
    data.meta.tourCompleted ??= !data.meta.isDemo;
    data.meta.hasOpenedBox ??= false;
    data.meta.hasExportedBackup ??= false;
    data.meta.importedOnce ??= false;
    data.meta.lastSavedAt ||= null;
    data.preferences ||= {};
    data.preferences.appearance ||= 'mixed';
    data.preferences.showZones ??= true;
    data.preferences.showGrid ??= false;
    data.preferences.snap ??= false;
    data.preferences.zoom ||= 100;
    data.preferences.navOpen ??= false;
    data.preferences.treeOpen ||= {};
    data.preferences.editMode ||= 'browse';
    data.preferences.queueFilter ||= 'active';
    data.preferences.queueView ||= 'compact';
    data.preferences.gettingStartedHidden ??= false;
    data.locations ||= [];
    data.boxes ||= [];
    data.zones ||= [];
    data.specimens = (data.specimens || []).map(raw => specimen(raw));
    data.alerts ||= [];
    data.activity ||= [];
    data.trash ||= {specimens:[],zones:[],boxes:[],locations:[]};
    for (const key of ['specimens','zones','boxes','locations']) data.trash[key] ||= [];
    migrateLegacyLocations(data);
    (data.specimens || []).forEach(s => { if ('rotation' in s) delete s.rotation; });
    // Migrate older condition-only warnings into explicit, resolvable alerts.
    const linked = new Set(data.alerts.filter(a => a.specimenId && a.status !== 'resolved').map(a => a.specimenId));
    for (const s of data.specimens) {
      if (['Attention','Damaged','Missing'].includes(s.condition) && !linked.has(s.id)) {
        data.alerts.push({
          id:uid(), specimenId:s.id, boxId:s.boxId || s.targetBoxId || null,
          type:s.condition === 'Missing' ? 'Missing' : s.condition === 'Damaged' ? 'Damage' : 'Needs inspection',
          severity:s.condition === 'Missing' ? 'critical' : s.condition === 'Damaged' ? 'high' : 'medium',
          status:'open', title:s.condition === 'Missing' ? 'Specimen not found' : s.condition === 'Damaged' ? 'Specimen damage recorded' : 'Condition requires attention',
          description:s.notes || `${s.condition} condition recorded for this specimen.`, reportedAt:s.updatedAt || nowISO(), resolvedAt:null, resolutionNote:'', source:'condition'
        });
      }
    }
    if (!data.selectedBoxId || !data.boxes.some(b => b.id === data.selectedBoxId)) data.selectedBoxId = data.boxes[0]?.id || null;
    syncAllBoxPaths(data);
    return data;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STATE_KEY) || localStorage.getItem(LEGACY_STATE_KEY);
      if (!raw) return normalizeState(defaultState());
      const parsed = JSON.parse(raw);
      if (![3,4].includes(parsed.version)) return normalizeState(defaultState());
      return normalizeState(parsed);
    } catch {
      return normalizeState(defaultState());
    }
  }

  function savedTimeLabel() {
    const value = state?.meta?.lastSavedAt;
    if (!value) return 'Saved locally';
    const date = new Date(value);
    return `Saved locally · ${date.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;
  }

  function persist(message = '') {
    try {
      state.meta ||= {};
      state.meta.lastSavedAt = nowISO();
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      const label = $('#saveStateLabel');
      if (label) label.textContent = message || savedTimeLabel();
      if (message) setTimeout(() => { const current=$('#saveStateLabel'); if (current) current.textContent=savedTimeLabel(); }, 1300);
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

  function showModal({eyebrow='EntoBox', title, body, foot, locked=false}) {
    modalLocked = !!locked;
    $('#modalEyebrow').textContent = eyebrow;
    $('#modalTitle').textContent = title;
    $('#modalBody').innerHTML = body;
    $('#modalFoot').innerHTML = foot === undefined ? '<button class="btn" data-close-modal>Close</button>' : foot;
    $('#modalClose').hidden = modalLocked;
    $('#modalBackdrop').hidden = false;
    $$('[data-close-modal]', $('#modalBackdrop')).forEach(b => b.onclick = () => closeModal());
  }
  function closeModal(force=false) {
    if (modalLocked && !force) return;
    modalLocked = false;
    $('#modalClose').hidden = false;
    $('#modalBackdrop').hidden = true;
    $('#modalBody').innerHTML = '';
    $('#modalFoot').innerHTML = '';
  }

  function isUnidentified(s) {
    const name = String(s?.scientificName || '').trim().toLowerCase();
    return !name || name === 'unidentified specimen' || name === 'unidentified' || name === 'unknown';
  }

  function alertById(id) { return (state.alerts || []).find(a => a.id === id); }

  function activeCollectionAlerts() {
    const rank = {critical:0,high:1,medium:2,low:3};
    return (state.alerts || []).filter(a => a.status !== 'resolved').sort((a,b) => (rank[a.severity] ?? 9) - (rank[b.severity] ?? 9) || String(b.reportedAt||'').localeCompare(String(a.reportedAt||'')));
  }

  function boxForAlert(alert) {
    const specimen = alert?.specimenId ? specimenById(alert.specimenId) : null;
    return state.boxes.find(box => box.id === (alert?.boxId || specimen?.boxId || specimen?.targetBoxId)) || null;
  }

  function boxForSpecimen(s) {
    return state.boxes.find(box => box.id === (s?.boxId || s?.targetBoxId)) || null;
  }

  function specimenStorageLabel(s) {
    const box = boxForSpecimen(s);
    if (!box) return 'No box assigned';
    return [...storagePathParts(box), box.code].join(' › ');
  }

  function recordActivity(type, specimenId, message, details={}) {
    state.activity ||= [];
    state.activity.unshift({id:uid(),type,specimenId:specimenId||null,message,details,at:nowISO()});
    if (state.activity.length > 1500) state.activity.length = 1500;
  }

  function activityForSpecimen(specimenId) {
    return (state.activity || []).filter(item => item.specimenId === specimenId).slice(0,30);
  }

  function syncConditionAlertForSpecimen(s) {
    state.alerts ||= [];
    const open = state.alerts.find(a => a.specimenId === s.id && a.status !== 'resolved' && a.source === 'condition');
    if (['Attention','Damaged','Missing'].includes(s.condition)) {
      const type = s.condition === 'Missing' ? 'Missing' : s.condition === 'Damaged' ? 'Damage' : 'Needs inspection';
      const severity = s.condition === 'Missing' ? 'critical' : s.condition === 'Damaged' ? 'high' : 'medium';
      const title = s.condition === 'Missing' ? 'Specimen not found' : s.condition === 'Damaged' ? 'Specimen damage recorded' : 'Condition requires attention';
      if (open) Object.assign(open,{boxId:s.boxId||s.targetBoxId||null,type,severity,title,description:s.notes||open.description,reportedAt:open.reportedAt||nowISO()});
      else state.alerts.push({id:uid(),specimenId:s.id,boxId:s.boxId||s.targetBoxId||null,type,severity,status:'open',title,description:s.notes||`${s.condition} condition recorded for this specimen.`,reportedAt:nowISO(),resolvedAt:null,resolutionNote:'',source:'condition'});
    } else if (open) {
      open.status='resolved';open.resolvedAt=nowISO();open.resolutionNote='Automatically resolved when specimen condition changed to '+s.condition;
    }
  }

  function createAlert({specimenId=null,boxId=null,type='Needs inspection',severity='medium',title='',description=''}) {
    const specimen = specimenId ? specimenById(specimenId) : null;
    const alert = {id:uid(),specimenId,boxId:boxId||specimen?.boxId||specimen?.targetBoxId||null,type,severity,status:'open',title:title||type,description:description||'',reportedAt:nowISO(),resolvedAt:null,resolutionNote:'',source:'manual'};
    state.alerts.push(alert);
    recordActivity('alert',specimenId,`Alert created: ${alert.title}`,{alertId:alert.id,type:alert.type,severity:alert.severity});
    return alert;
  }

  function openBoxWorkspace(boxId, specimenId = null, {openNavigation=false} = {}) {
    const box = state.boxes.find(item => item.id === boxId);
    if (!box) return toast('The linked box no longer exists', 'warn');
    state.selectedBoxId = box.id;
    state.meta.hasOpenedBox = true;
    currentView = 'workspace';
    selectedSpecimenId = specimenId;
    selectedZoneId = null;
    placingSpecimenId = null;
    tool = 'select';
    inspectorTab = specimenId ? 'details' : inspectorTab;
    state.preferences.navOpen = !!openNavigation;
    persist();
    renderAll();
    requestAnimationFrame(() => {
      fitBoxToScreen();
      if (specimenId) setTimeout(() => locateSelectedSpecimen(true), 90);
    });
  }

  function setView(view) {
    currentView = ['workspace','alerts'].includes(view) ? view : 'home';
    if (currentView !== 'workspace') state.preferences.navOpen = false;
    persist();
    renderAll();
  }

  function openAlertsCenter(alertId=null) {
    currentView='alerts';
    selectedAlertId=alertId || selectedAlertId || activeCollectionAlerts()[0]?.id || state.alerts?.[0]?.id || null;
    state.preferences.navOpen=false;
    persist();
    renderAll();
  }

  function renderViewState() {
    const home = currentView === 'home';
    const workspace = currentView === 'workspace';
    const alerts = currentView === 'alerts';
    document.body.classList.toggle('home-mode', home);
    document.body.classList.toggle('workspace-mode', workspace);
    document.body.classList.toggle('alerts-mode', alerts);
    $('#homeView').hidden = !home;
    $('#workspaceView').hidden = !workspace;
    $('#alertsView').hidden = !alerts;
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

  function gettingStartedTasks() {
    const placed = state.specimens.filter(s=>s.boxId).length;
    return [
      {id:'storage',label:'Create storage',copy:'Add a building, room, cabinet, or use the collection root.',done:state.locations.length>0,action:()=>openStorageCreateMenu(null)},
      {id:'box',label:'Create a box',copy:'Make the first spatial specimen box.',done:state.boxes.length>0,action:()=>openNewBox(currentSuggestedParent())},
      {id:'records',label:'Add records',copy:'Add a specimen or import a spreadsheet.',done:state.specimens.length>0,action:()=>currentBox()?openAddSpecimen():openStorageCreateMenu(null)},
      {id:'placement',label:'Place a specimen',copy:'Map at least one physical pin position.',done:placed>0,action:()=>currentBox()?openBoxWorkspace(currentBox().id,null,{openNavigation:true}):openStorageCreateMenu(null)},
      {id:'backup',label:'Download backup',copy:'Protect the local browser workspace.',done:!!state.meta.hasExportedBackup,action:exportBackup}
    ];
  }

  function renderGettingStarted() {
    const panel=$('#gettingStartedPanel');
    panel.hidden=!!state.preferences.gettingStartedHidden;
    const tasks=gettingStartedTasks();
    const done=tasks.filter(t=>t.done).length;
    $('#gettingStartedCount').textContent=`${done} of ${tasks.length}`;
    $('#gettingStartedProgress').style.width=`${done/tasks.length*100}%`;
    $('#gettingStartedTasks').innerHTML=tasks.map(t=>`<button class="getting-task ${t.done?'done':''}" data-start-task="${t.id}"><span class="getting-task-mark">${t.done?'✓':'○'}</span><span><strong>${esc(t.label)}</strong><small>${esc(t.copy)}</small></span></button>`).join('');
    $$('[data-start-task]', $('#gettingStartedTasks')).forEach(button=>button.onclick=()=>tasks.find(t=>t.id===button.dataset.startTask)?.action());
  }

  function renderHome() {
    syncAllBoxPaths();
    const specimens = state.specimens || [];
    const placed = specimens.filter(s => s.boxId);
    const unplaced = specimens.filter(s => !s.boxId && s.placementStatus !== 'skipped');
    const alerts = activeCollectionAlerts();
    const unidentified = specimens.filter(isUnidentified);
    const counts = ['Good','Attention','Damaged','Missing','Not assessed'].reduce((acc,key) => (acc[key]=specimens.filter(s => s.condition===key).length,acc),{});
    const affectedSpecimens = new Set(alerts.map(a=>a.specimenId).filter(Boolean)).size;
    const clearPercent = specimens.length ? Math.round((specimens.length-affectedSpecimens)/specimens.length*100) : 100;

    $('#homeCollectionName').textContent = state.collectionName || 'Natural history collection';
    const isDemoWorkspace=!!state.meta?.isDemo;
    $('#homeModeBadge').textContent=isDemoWorkspace?'Demo workspace':'Your collection';
    $('#homeModeBadge').classList.toggle('demo',isDemoWorkspace);
    $('#homeStartOwnBtn').hidden=!isDemoWorkspace;
    $('#homeTotalSpecimens').textContent = specimens.length.toLocaleString();
    $('#homeBoxes').textContent = state.boxes.length.toLocaleString();
    $('#homeAlertsCount').textContent = alerts.length.toLocaleString();
    $('#homeUnplaced').textContent = unplaced.length.toLocaleString();
    $('#homeUnidentified').textContent = unidentified.length.toLocaleString();
    $('#homeLocations').textContent = state.locations.length.toLocaleString();
    $('#homeOpenCurrentBoxBtn').textContent = currentBox() ? `Open ${currentBox().code}` : 'Create first box';
    renderGettingStarted();

    const healthSummary = $('#homeHealthSummary');
    healthSummary.textContent = alerts.length ? `${alerts.length} active alert${alerts.length===1?'':'s'}` : 'No active alerts';
    healthSummary.classList.toggle('has-alerts', !!alerts.length);
    $('#homeHealthVisual').innerHTML = `<div class="health-ring" style="--health-good:${clearPercent}%"><div class="health-ring-copy"><b>${clearPercent}%</b><small>without active alerts</small></div></div><div class="health-message"><strong>${alerts.length ? 'Some collection items need attention' : 'No urgent collection-care issues recorded'}</strong><p>${placed.length} placed · ${unplaced.length} awaiting placement · ${counts['Not assessed'] || 0} not yet condition-assessed.</p></div>`;
    $('#homeHealthBreakdown').innerHTML = [
      ['Good',counts.Good,''],['Attention',counts.Attention,'alert'],['Damaged',counts.Damaged,'alert'],['Missing',counts.Missing,'alert'],['Not assessed',counts['Not assessed'],'review']
    ].map(([label,count,klass]) => `<div class="health-state ${klass}"><b>${count}</b><span>${label}</span></div>`).join('');

    const visibleAlerts = homeAlertsExpanded ? alerts : alerts.slice(0,6);
    $('#homeShowAllAlertsBtn').hidden = alerts.length <= 6;
    $('#homeShowAllAlertsBtn').textContent = homeAlertsExpanded ? 'Show fewer' : `Open alerts centre · ${alerts.length}`;
    $('#homeAlertList').innerHTML = visibleAlerts.length ? visibleAlerts.map(alert => {
      const specimen=alert.specimenId?specimenById(alert.specimenId):null;
      const box=boxForAlert(alert);
      const symbol=alert.type==='Missing'?'?':alert.type==='Damage'?'×':'!';
      return `<button class="home-alert-item" data-home-alert-id="${alert.id}" data-condition="${esc(alert.type)}"><span class="home-alert-severity">${symbol}</span><span class="home-alert-copy"><strong>${esc(alert.title)}</strong><span>${esc(specimen?shown(specimen.scientificName,'Unidentified specimen'):box?.name||'Collection alert')} · ${esc(alert.severity)}</span><small>${esc(box ? `${box.code} · ${box.path}` : 'Location not assigned')}</small></span><span class="home-alert-open">›</span></button>`;
    }).join('') : '<div class="home-empty-alerts"><div><b>Collection looks calm 🌿</b>No unresolved collection-care alerts are recorded.</div></div>';
    $$('[data-home-alert-id]', $('#homeAlertList')).forEach(button => button.onclick = () => openAlertsCenter(button.dataset.homeAlertId));

    const typeCounts = {};
    for (const location of state.locations) typeCounts[location.type] = (typeCounts[location.type] || 0) + 1;
    $('#homeStorageSummary').innerHTML = Object.entries(typeCounts).sort((a,b) => (locationTypeMeta[a[0]]?.label || a[0]).localeCompare(locationTypeMeta[b[0]]?.label || b[0])).map(([type,count]) => `<span class="storage-summary-chip">${storageIcon(type)} <span>${esc(storageTypeTitle(type))}</span><b>${count}</b></span>`).join('') || '<span class="storage-summary-chip">No storage locations yet</span>';
    $('#homeBoxGrid').innerHTML = state.boxes.length ? state.boxes.map(box => {
      const boxPlaced = specimens.filter(s => s.boxId === box.id).length;
      const boxQueued = specimens.filter(s => !s.boxId && s.targetBoxId === box.id && s.placementStatus!=='skipped').length;
      const boxAlerts = alerts.filter(a => boxForAlert(a)?.id===box.id).length;
      return `<button class="home-box-card" data-home-box-id="${box.id}"><span class="home-box-thumb">${esc(box.code.replace(/^BOX-?/i,''))}</span><span class="home-box-copy"><strong>${esc(box.name)}</strong><span>${esc(box.path || 'Unassigned storage')}</span><small>${box.widthMm} × ${box.heightMm} mm · ${state.zones.filter(z=>z.boxId===box.id).length} zones</small></span><span class="home-box-counts"><b>${boxPlaced} placed</b>${boxQueued?`<span>+${boxQueued} tray</span>`:''}${boxAlerts?`<span class="home-box-alert">${boxAlerts} alert${boxAlerts===1?'':'s'}</span>`:''}</span></button>`;
    }).join('') : '<div class="home-box-empty">No boxes yet. Use the setup wizard or create a storage path and your first spatial box.</div>';
    $$('[data-home-box-id]', $('#homeBoxGrid')).forEach(button => button.onclick = () => openBoxWorkspace(button.dataset.homeBoxId));
  }

  function filteredAlerts() {
    const q=($('#alertsSearch')?.value||'').trim().toLowerCase();
    const status=$('#alertsStatusFilter')?.value||'open';
    const type=$('#alertsTypeFilter')?.value||'all';
    const severity=$('#alertsSeverityFilter')?.value||'all';
    return (state.alerts||[]).filter(alert=>{
      const specimen=alert.specimenId?specimenById(alert.specimenId):null;
      const box=boxForAlert(alert);
      const hay=[alert.title,alert.description,alert.type,alert.severity,specimen?.scientificName,specimen?.catalogNumber,box?.name,box?.code,box?.path].join(' ').toLowerCase();
      return (!q||hay.includes(q))&&(status==='all'||alert.status===status)&&(type==='all'||alert.type===type)&&(severity==='all'||alert.severity===severity);
    }).sort((a,b)=>String(b.reportedAt||'').localeCompare(String(a.reportedAt||'')));
  }

  function renderAlertsCenter() {
    if (!$('#alertsList')) return;
    const alerts=filteredAlerts();
    if (!alerts.some(a=>a.id===selectedAlertId)) selectedAlertId=alerts[0]?.id||null;
    $('#alertsFilterCount').textContent=`${alerts.length} alert${alerts.length===1?'':'s'}`;
    $('#alertsList').innerHTML=alerts.length?alerts.map(alert=>{
      const specimen=alert.specimenId?specimenById(alert.specimenId):null;
      const box=boxForAlert(alert);
      return `<button class="alert-list-item ${alert.id===selectedAlertId?'active':''}" data-alert-id="${alert.id}" data-severity="${esc(alert.severity)}" data-status="${esc(alert.status)}"><span class="alert-list-severity">${alert.type==='Missing'?'?':alert.type==='Damage'?'×':'!'}</span><span class="alert-list-copy"><strong>${esc(alert.title)}</strong><span>${esc(alert.type)} · ${esc(specimen?shown(specimen.scientificName,'Unidentified specimen'):box?.name||'Collection')}</span><small>${esc(box?`${box.code} · ${box.path}`:'Location not assigned')}</small></span><span class="alert-status-pill">${esc(alert.status)}</span></button>`;
    }).join(''):'<div class="alert-detail-empty"><div><b>No matching alerts</b>Try another filter or create a new collection-care alert.</div></div>';
    $$('[data-alert-id]', $('#alertsList')).forEach(button=>button.onclick=()=>{selectedAlertId=button.dataset.alertId;renderAlertsCenter();});
    renderAlertDetail(alertById(selectedAlertId));
  }

  function renderAlertDetail(alert) {
    const panel=$('#alertDetailPanel');
    if(!alert){panel.innerHTML='<div class="alert-detail-empty"><div><b>Select an alert</b>Its description, exact storage path, and resolution controls will appear here.</div></div>';return;}
    const specimen=alert.specimenId?specimenById(alert.specimenId):null;
    const box=boxForAlert(alert);
    panel.innerHTML=`<div class="alert-detail-header"><span class="alert-detail-icon">${alert.type==='Missing'?'?':alert.type==='Damage'?'×':'!'}</span><div><div class="eyebrow">${esc(alert.type)} · ${esc(alert.severity)}</div><h2>${esc(alert.title)}</h2><p>${esc(specimen?`${shown(specimen.scientificName,'Unidentified specimen')} · ${shown(specimen.catalogNumber,'Temporary record')}`:box?.name||'Collection-level alert')}</p></div><span class="alert-status-pill">${esc(alert.status)}</span></div>
      <section class="alert-detail-section"><h3>What was reported</h3><p>${esc(shown(alert.description,'No description was supplied.'))}</p></section>
      <section class="alert-detail-section"><h3>Physical context</h3><div class="alert-meta-grid"><div class="alert-meta-cell"><span>Box</span><b>${esc(box?`${box.code} · ${box.name}`:'Not assigned')}</b></div><div class="alert-meta-cell"><span>Storage path</span><b>${esc(box?.path||'Not assigned')}</b></div><div class="alert-meta-cell"><span>Reported</span><b>${esc(new Date(alert.reportedAt).toLocaleString())}</b></div><div class="alert-meta-cell"><span>Specimen</span><b>${esc(specimen?shown(specimen.scientificName,'Unidentified specimen'):'Box / collection alert')}</b></div></div></section>
      ${alert.status==='resolved'?`<section class="alert-detail-section"><h3>Resolution</h3><div class="resolution-note"><b>${esc(alert.resolutionNote||'Resolved without a note')}</b><br>${esc(alert.resolvedAt?new Date(alert.resolvedAt).toLocaleString():'')}</div></section>`:''}
      <div class="alert-detail-actions">${box?'<button class="btn primary" id="alertOpenLocation">Open exact location</button>':''}<button class="btn" id="alertResolveToggle">${alert.status==='resolved'?'Reopen alert':'Mark resolved'}</button><button class="btn" id="alertEditBtn">Edit alert</button></div>`;
    if($('#alertOpenLocation'))$('#alertOpenLocation').onclick=()=>openBoxWorkspace(box.id,specimen?.boxId?specimen.id:null);
    $('#alertResolveToggle').onclick=()=>alert.status==='resolved'?reopenAlert(alert):openResolveAlert(alert);
    $('#alertEditBtn').onclick=()=>openAlertForm(alert);
  }

  function openResolveAlert(alert) {
    showModal({eyebrow:'Collection care',title:'Resolve alert',body:`<div class="field"><label>Resolution note</label><textarea id="resolutionNote" placeholder="What was checked, repaired, moved, or confirmed?"></textarea></div><div class="import-note">The alert remains in the history and can be reopened later.</div>`,foot:'<button class="btn" data-close-modal>Cancel</button><button class="btn primary" id="confirmResolveAlert">Mark resolved</button>'});
    $('#confirmResolveAlert').onclick=()=>{pushHistory();alert.status='resolved';alert.resolvedAt=nowISO();alert.resolutionNote=$('#resolutionNote').value.trim();recordActivity('alert-resolved',alert.specimenId,`Alert resolved: ${alert.title}`,{alertId:alert.id,note:alert.resolutionNote});persist('Alert resolved');closeModal();renderAll();toast('Alert marked resolved');};
  }

  function reopenAlert(alert) { pushHistory();alert.status='open';alert.resolvedAt=null;alert.resolutionNote='';recordActivity('alert-reopened',alert.specimenId,`Alert reopened: ${alert.title}`,{alertId:alert.id});persist('Alert reopened');renderAll();toast('Alert reopened'); }

  function openAlertForm(existing=null,{specimenId=null,boxId=null}={}) {
    const alert=existing;
    let linkedSpecimenId=alert?.specimenId||specimenId||'';
    let linkedBoxId=alert?.boxId||boxId||specimenById(linkedSpecimenId)?.boxId||currentBox()?.id||'';
    const specimenOptions=state.specimens.slice(0,1000).map(s=>`<option value="${s.id}" ${s.id===linkedSpecimenId?'selected':''}>${esc(shown(s.scientificName,'Unidentified specimen'))} · ${esc(shown(s.catalogNumber,'Temporary record'))}</option>`).join('');
    const boxOptions=state.boxes.map(b=>`<option value="${b.id}" ${b.id===linkedBoxId?'selected':''}>${esc(b.code)} · ${esc(b.name)}</option>`).join('');
    showModal({eyebrow:'Collection care',title:alert?'Edit alert':'Create alert',body:`<div class="form-grid"><div class="field"><label>Category</label><select id="alertType">${['Pest risk','Damage','Missing','Loose label','Needs inspection','Other'].map(v=>`<option ${alert?.type===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="field"><label>Severity</label><select id="alertSeverity">${['low','medium','high','critical'].map(v=>`<option ${alert?.severity===v?'selected':''}>${v}</option>`).join('')}</select></div><div class="field full"><label>Specimen <em>optional</em></label><select id="alertSpecimen"><option value="">No specimen — box or collection alert</option>${specimenOptions}</select></div><div class="field full"><label>Box <em>optional</em></label><select id="alertBox"><option value="">No box assigned</option>${boxOptions}</select></div><div class="field full"><label>Title</label><input id="alertTitle" value="${esc(alert?.title||'')}"></div><div class="field full"><label>Description</label><textarea id="alertDescription">${esc(alert?.description||'')}</textarea></div></div>`,foot:`<button class="btn" data-close-modal>Cancel</button><button class="btn primary" id="saveAlertBtn">${alert?'Save alert':'Create alert'}</button>`});
    $('#alertSpecimen').onchange=e=>{const s=specimenById(e.target.value);if(s?.boxId)$('#alertBox').value=s.boxId;};
    $('#saveAlertBtn').onclick=()=>{const type=$('#alertType').value;const title=$('#alertTitle').value.trim()||type;const data={specimenId:$('#alertSpecimen').value||null,boxId:$('#alertBox').value||null,type,severity:$('#alertSeverity').value,title,description:$('#alertDescription').value.trim()};pushHistory();if(alert){Object.assign(alert,data);recordActivity('alert-edited',data.specimenId,`Alert updated: ${title}`,{alertId:alert.id});}else{selectedAlertId=createAlert(data).id;}persist('Alert saved');closeModal();openAlertsCenter(selectedAlertId);toast(alert?'Alert updated':'Alert created');};
  }

  function renderAll() {
    renderHome();
    renderAlertsCenter();
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
    $('#drawerHandle').setAttribute('aria-hidden', String(open || currentView !== 'workspace'));
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
    requestAnimationFrame(() => fitBoxToScreen());
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

  function queuePassesFilter(s,filter) {
    if(filter==='active')return s.placementStatus!=='skipped';
    if(filter==='skipped')return s.placementStatus==='skipped';
    if(filter==='unidentified')return isUnidentified(s);
    if(filter==='identified')return !isUnidentified(s);
    if(filter==='with-photo')return !!s.photoThumb;
    if(filter==='without-photo')return !s.photoThumb;
    return true;
  }

  function renderQueue() {
    const all=queueForCurrentBox();
    const q=($('#queueSearch').value||'').trim().toLowerCase();
    const filter=state.preferences.queueFilter||'active';
    const queue=all.filter(s=>queuePassesFilter(s,filter)&&(!q||[s.catalogNumber,s.scientificName,s.locality,s.recordedBy].join(' ').toLowerCase().includes(q)));
    visibleQueueIds=queue.map(s=>s.id);
    selectedQueueIds=new Set([...selectedQueueIds].filter(id=>all.some(s=>s.id===id)));
    const active=all.filter(s=>s.placementStatus!=='skipped');
    const skipped=all.filter(s=>s.placementStatus==='skipped');
    const placed=state.specimens.filter(s=>s.boxId===currentBox()?.id).length;
    $('#queueCount').textContent=active.length;
    $('#trayPlacedCount').textContent=placed;
    $('#trayRemainingCount').textContent=active.length;
    $('#traySkippedCount').textContent=skipped.length;
    $('#queueFilter').value=filter;
    $$('[data-queue-view]').forEach(b=>b.classList.toggle('active',b.dataset.queueView===state.preferences.queueView));
    $('#queueSelectAll').checked=queue.length>0&&queue.every(s=>selectedQueueIds.has(s.id));
    $('#queueSelectAll').indeterminate=queue.some(s=>selectedQueueIds.has(s.id))&&!queue.every(s=>selectedQueueIds.has(s.id));
    $('#bulkZoneSelect').innerHTML=`<option value="">Any zone</option>${currentZones().map(z=>`<option value="${z.id}">${esc(z.code||'')} · ${esc(z.name)}</option>`).join('')}`;
    const bulk=$('#queueBulkBar');bulk.hidden=!selectedQueueIds.size;$('#queueSelectedCount').textContent=selectedQueueIds.size;
    const arranging=state.preferences.editMode==='arrange';
    $('#trayHelp').innerHTML=placingSpecimenId?`<b>${esc(specimenById(placingSpecimenId)?.catalogNumber||'')}</b> selected. Tap the box photograph to place the pin. Press Esc to cancel.`:arranging?'Drag the beetle handle onto the box, or press <b>Place</b> and tap the photograph.':'Browse mode prevents accidental placement. Switch to <b>Arrange</b> when you are ready to map specimens.';
    if(!queue.length){$('#queueList').innerHTML=`<div class="empty-state">${q||filter!=='active'?'No matching placement records.':'No active unplaced records for this box. Import a spreadsheet or add a specimen.'}</div>`;return;}
    $('#queueList').innerHTML=queue.map(s=>`<div class="queue-item ${state.preferences.queueView} ${s.id===placingSpecimenId?'selected':''} ${selectedQueueIds.has(s.id)?'selected':''} ${s.placementStatus==='skipped'?'skipped':''}" data-queue-id="${s.id}">
      <input class="queue-select" type="checkbox" data-queue-select="${s.id}" ${selectedQueueIds.has(s.id)?'checked':''} aria-label="Select ${esc(shown(s.scientificName,'specimen'))}">
      <div class="drag-handle ${!arranging||s.placementStatus==='skipped'?'disabled':''}" draggable="${arranging&&s.placementStatus!=='skipped'}" data-drag-spec="${s.id}" title="${arranging?'Drag onto box':'Switch to Arrange to place'}">${s.photoThumb?`<img src="${s.photoThumb}" alt="">`:s.icon}</div>
      <div class="queue-info"><strong>${esc(shown(s.scientificName,'Unidentified specimen'))}${s.placementStatus==='skipped'?'<span class="skip-badge">Skipped</span>':''}</strong><span>${esc(shown(s.catalogNumber,'Temporary record'))}${s.locality?` · ${esc(s.locality)}`:''}</span><div class="queue-extra">${esc(shown(s.recordedBy,'Collector not recorded'))} · ${esc(shown(s.eventDate,'Date not recorded'))}<br>${s.photoThumb?'Photo attached':'No photo'} · ${s.footprintWidthMm} × ${s.footprintHeightMm} mm</div></div>
      <div class="queue-actions"><select data-size-spec="${s.id}" title="Footprint size">${Object.entries(sizePresets).map(([k,v])=>`<option value="${k}" ${sizeKeyForSpec(s)===k?'selected':''}>${v.label}</option>`).join('')}</select><button class="place-btn" data-place-spec="${s.id}" ${!arranging||s.placementStatus==='skipped'?'disabled':''}>${s.id===placingSpecimenId?'Cancel':'Place'}</button></div>
    </div>`).join('');
    $$('[data-queue-select]').forEach(input=>input.onchange=()=>{input.checked?selectedQueueIds.add(input.dataset.queueSelect):selectedQueueIds.delete(input.dataset.queueSelect);renderQueue();});
    $$('[data-drag-spec]').forEach(h=>{h.ondragstart=e=>{if(!arranging||specimenById(h.dataset.dragSpec)?.placementStatus==='skipped'){e.preventDefault();return;}e.dataTransfer.setData('text/entobox-specimen',h.dataset.dragSpec);e.dataTransfer.effectAllowed='move';};});
    $$('[data-place-spec]').forEach(b=>b.onclick=()=>setPlacing(b.dataset.placeSpec));
    $$('[data-size-spec]').forEach(sel=>sel.onchange=()=>{const item=specimenById(sel.dataset.sizeSpec),preset=sizePresets[sel.value];pushHistory();item.footprintWidthMm=preset.w;item.footprintHeightMm=preset.h;item.updatedAt=nowISO();recordActivity('size',item.id,`Footprint set to ${preset.label}`,{width:preset.w,height:preset.h});persist('Footprint saved');renderQueue();});
  }

  function applyBulkSize() {
    const key=$('#bulkSizeSelect').value;if(!key)return;const preset=sizePresets[key];pushHistory();for(const id of selectedQueueIds){const s=specimenById(id);if(!s)continue;s.footprintWidthMm=preset.w;s.footprintHeightMm=preset.h;s.updatedAt=nowISO();recordActivity('size',s.id,`Footprint set to ${preset.label}`,{width:preset.w,height:preset.h});}persist('Bulk size saved');$('#bulkSizeSelect').value='';renderQueue();toast(`Size ${preset.label} applied to ${selectedQueueIds.size} records`);
  }

  function skipSelectedQueue() {
    if(!selectedQueueIds.size)return;pushHistory();for(const id of selectedQueueIds){const s=specimenById(id);if(!s)continue;s.placementStatus=s.placementStatus==='skipped'?'active':'skipped';s.updatedAt=nowISO();recordActivity('placement-skip',s.id,s.placementStatus==='skipped'?'Placement skipped for now':'Returned to active placement queue');}selectedQueueIds.clear();persist('Placement queue updated');renderAll();toast('Selected records moved out of the active placement queue');
  }

  function finishPlacementSession() {
    const all=state.specimens.filter(s=>s.targetBoxId===currentBox()?.id||s.boxId===currentBox()?.id);
    const placed=all.filter(s=>s.boxId===currentBox()?.id).length,remaining=all.filter(s=>!s.boxId&&s.placementStatus!=='skipped').length,skipped=all.filter(s=>!s.boxId&&s.placementStatus==='skipped').length;
    showModal({eyebrow:'Placement session',title:'Session summary',body:`<div class="health-breakdown"><div class="health-state"><b>${placed}</b><span>Placed</span></div><div class="health-state review"><b>${remaining}</b><span>Remain</span></div><div class="health-state"><b>${skipped}</b><span>Skipped</span></div></div><div class="import-note">Unplaced and skipped records stay safely in the placement tray. You can continue this session at any time.</div>`,foot:'<button class="btn" data-close-modal>Continue working</button><button class="btn primary" id="finishToHomeBtn">Finish and open Home</button>'});
    $('#finishToHomeBtn').onclick=()=>{selectedQueueIds.clear();closeModal();setView('home');toast('Placement session saved');};
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
    const box=currentBox();if(!box)return;
    $('#currentBoxChip').textContent=box.code;$('#currentBoxChip').title=`${box.name} — open collection structure`;$('#drawerHandleLabel').textContent=box.code;$('#currentBoxTitle').textContent=box.name;renderBoxBreadcrumb(box);
    const placed=placedInCurrentBox();const alertCount=activeCollectionAlerts().filter(a=>boxForAlert(a)?.id===box.id).length;
    $('#boxStats').textContent=`${placed.length} placed · ${currentZones().length} zones${alertCount?` · ${alertCount} alert${alertCount===1?'':'s'}`:''}`;
    $$('[data-appearance]').forEach(b=>b.classList.toggle('active',b.dataset.appearance===state.preferences.appearance));
    $$('[data-edit-mode]').forEach(b=>b.classList.toggle('active',b.dataset.editMode===state.preferences.editMode));
    $('#showZonesToggle').checked=state.preferences.showZones;$('#showGridToggle').checked=state.preferences.showGrid;$('#snapToggle').checked=state.preferences.snap;$('#zoomRange').value=state.preferences.zoom;$('#zoomLabel').textContent=`${Math.round(state.preferences.zoom)}%`;
    const arranging=state.preferences.editMode==='arrange';
    $('#newZoneBtn').disabled=!arranging;$('#boxPhotoBtn').disabled=!arranging;$('#snapToggle').disabled=!arranging;
    $('.control-strip').classList.toggle('arrange-active',arranging);$('.control-strip').classList.toggle('browse-active',!arranging);
    const label=tool==='zone'?'Draw a zone':placingSpecimenId?'Place specimen':arranging?'Arrange safely':'Browse safely';
    $('#modeIndicator').textContent=label;$('#modeIndicator').classList.toggle('arrange',arranging);
    $('#newZoneBtn').classList.toggle('primary',tool==='zone');$('#newZoneBtn').textContent=tool==='zone'?'× Cancel zone':'▱ Draw zone';
    $('#locateSelectedBtn').disabled=!selectedSpecimenId;
    $('#saveStateLabel').textContent=savedTimeLabel();
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
    const box=currentBox();if(!box)return;const stage=$('#boxStage');$('#boxBackground').src=box.background||BLANK_BG;
    stage.className=`box-stage appearance-${state.preferences.appearance} tool-${tool} ${state.preferences.editMode}-mode`;
    $('#gridOverlay').classList.toggle('visible',state.preferences.showGrid);$('#gridOverlay').style.backgroundSize=`${100/box.gridCols}% ${100/box.gridRows}%`;
    const zoom=state.preferences.zoom/100,baseWidth=980;$('#boxStageWrap').style.width=`${baseWidth*zoom}px`;stage.style.width=`${baseWidth*zoom}px`;
    const zones=currentZones();$('#zoneLayer').style.display=state.preferences.showZones?'block':'none';$('#zoneLayer').innerHTML=zones.map(z=>`<div class="zone ${z.id===selectedZoneId?'selected':''}" data-zone-id="${z.id}" data-color="${z.color||0}" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%"><span class="zone-label">${esc(z.code||'')} · ${esc(z.name)}</span></div>`).join('');
    $$('[data-zone-id]').forEach(el=>el.onpointerdown=e=>{e.stopPropagation();selectedZoneId=el.dataset.zoneId;selectedSpecimenId=null;inspectorTab='details';renderAll();});
    const specs=placedInCurrentBox(),collisions=collisionSet(specs),alertSpecimens=new Set(activeCollectionAlerts().map(a=>a.specimenId));
    $('#specimenLayer').innerHTML=specs.map(s=>{const r=specimenRect(s,box),art=s.photoThumb?`<img src="${s.photoThumb}" alt="">`:s.icon,conditionAlert=alertSpecimens.has(s.id);return `<div class="specimen ${s.id===selectedSpecimenId?'selected':''} ${collisions.has(s.id)?'overlap':''} ${conditionAlert?'condition-alert':''}" data-specimen-id="${s.id}" style="left:${s.x}%;top:${s.y}%;width:${r.w}%;height:${r.h}%;transform:translate(-50%,-50%)"><div class="specimen-footprint"></div><div class="specimen-art">${art}</div><div class="pin-anchor"></div>${conditionAlert?'<div class="condition-map-badge" title="Open collection alert">!</div>':''}<div class="specimen-label">${esc(shown(s.scientificName,'Unidentified specimen'))} · ${esc(shown(s.catalogNumber,'Temporary record'))}</div></div>`;}).join('');
    bindSpecimenDrag();renderMinimap();requestAnimationFrame(updateMinimapViewport);
  }

  function bindSpecimenDrag() {
    $$('.specimen').forEach(el=>{
      el.onpointerdown=e=>{
        if(tool==='zone'||e.button!==0)return;e.stopPropagation();const s=specimenById(el.dataset.specimenId);selectedSpecimenId=s.id;selectedZoneId=null;inspectorTab='details';
        if(state.preferences.editMode!=='arrange'){renderInspector();renderMap();return;}
        const p=pointFromEvent(e);dragState={id:s.id,startPointer:p,startX:s.x,startY:s.y,moved:false,el,before:deepClone(state)};el.setPointerCapture?.(e.pointerId);renderInspector();
      };
      el.onpointermove=e=>{if(!dragState||dragState.id!==el.dataset.specimenId||state.preferences.editMode!=='arrange')return;const s=specimenById(dragState.id),p=pointFromEvent(e),dx=p.x-dragState.startPointer.x,dy=p.y-dragState.startPointer.y;if(Math.abs(dx)+Math.abs(dy)>.3)dragState.moved=true;let x=dragState.startX+dx,y=dragState.startY+dy;({x,y}=normalizedPositionFor(s,x,y));s.x=x;s.y=y;el.style.left=`${x}%`;el.style.top=`${y}%`;};
      el.onpointerup=()=>{if(!dragState||dragState.id!==el.dataset.specimenId)return;const s=specimenById(dragState.id);if(dragState.moved){history.push(dragState.before);if(history.length>20)history.shift();s.zoneId=zoneAtPoint(s.x,s.y)?.id||null;s.updatedAt=nowISO();recordActivity('move',s.id,`Moved within ${currentBox().code}`,{x:s.x,y:s.y,zoneId:s.zoneId});persist('Position saved');toast(`Position saved${s.zoneId?` · ${zoneById(s.zoneId).name}`:''}`);}dragState=null;renderAll();};
      el.ondblclick=()=>openFullRecord(el.dataset.specimenId);
    });
  }

  function renderMinimap(){const box=currentBox();if(!box)return;const surface=$('#minimapSurface');surface.style.backgroundImage=`url("${box.background||BLANK_BG}")`;$('#minimapZones').innerHTML=state.preferences.showZones?currentZones().map(z=>`<div class="minimap-zone" style="left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%"></div>`).join(''):'';$('#minimapSpecimens').innerHTML=placedInCurrentBox().map(s=>`<div class="minimap-dot ${s.id===selectedSpecimenId?'selected':''}" style="left:${s.x}%;top:${s.y}%"></div>`).join('');}

  function updateMinimapViewport(){const scroll=$('#canvasScroll'),stage=$('#boxStage'),vp=$('#minimapViewport');if(!scroll||!stage||!vp)return;const sr=scroll.getBoundingClientRect(),br=stage.getBoundingClientRect();const left=clamp((sr.left-br.left)/br.width*100,0,100),top=clamp((sr.top-br.top)/br.height*100,0,100),width=clamp(sr.width/br.width*100,4,100),height=clamp(sr.height/br.height*100,4,100);vp.style.left=`${left}%`;vp.style.top=`${top}%`;vp.style.width=`${Math.min(width,100-left)}%`;vp.style.height=`${Math.min(height,100-top)}%`;}

  function setCanvasView(left, top, {behavior='auto'}={}) {
    const scroll = $('#canvasScroll');
    if (!scroll) return;
    const maxLeft = Math.max(0, scroll.scrollWidth - scroll.clientWidth);
    const maxTop = Math.max(0, scroll.scrollHeight - scroll.clientHeight);
    scroll.scrollTo({left:clamp(left,0,maxLeft), top:clamp(top,0,maxTop), behavior});
  }

  function centerBoxInView({behavior='auto'}={}) {
    const scroll=$('#canvasScroll'),stage=$('#boxStage');
    if(!scroll||!stage) return;
    const left = stage.offsetLeft + stage.clientWidth/2 - scroll.clientWidth/2;
    const top = stage.offsetTop + stage.clientHeight/2 - scroll.clientHeight/2;
    setCanvasView(left, top, {behavior});
    requestAnimationFrame(updateMinimapViewport);
  }

  function canPanCanvas() {
    const scroll = $('#canvasScroll');
    if (!scroll) return false;
    return scroll.scrollWidth > scroll.clientWidth + 4 || scroll.scrollHeight > scroll.clientHeight + 4;
  }

  function setZoom(value,{centre=true}={}){
    const scroll=$('#canvasScroll'),stage=$('#boxStage'),old=state.preferences.zoom;
    const focusX=scroll&&stage?clamp((scroll.scrollLeft+scroll.clientWidth/2-stage.offsetLeft)/(stage.clientWidth||1),0,1):.5;
    const focusY=scroll&&stage?clamp((scroll.scrollTop+scroll.clientHeight/2-stage.offsetTop)/(stage.clientHeight||1),0,1):.5;
    state.preferences.zoom=clamp(Math.round(value/5)*5,50,300);
    persist('Zoom saved');
    renderMap();renderControls();
    requestAnimationFrame(()=>{
      const newStage=$('#boxStage');
      if(scroll&&newStage&&centre&&old!==state.preferences.zoom){
        const left = newStage.offsetLeft + newStage.clientWidth*focusX - scroll.clientWidth/2;
        const top = newStage.offsetTop + newStage.clientHeight*focusY - scroll.clientHeight/2;
        setCanvasView(left, top, {behavior:'auto'});
      }
      updateMinimapViewport();
    });
  }

  function fitBoxToScreen(){
    const scroll=$('#canvasScroll');
    if(!scroll)return;
    const baseW=980,baseH=735;
    const availableW=Math.max(320,scroll.clientWidth-28),availableH=Math.max(250,scroll.clientHeight-28);
    const zoom=Math.min(availableW/baseW,availableH/baseH)*100;
    setZoom(zoom,{centre:false});
    requestAnimationFrame(()=>centerBoxInView({behavior:'auto'}));
  }

  function locateSelectedSpecimen(animate=false){const s=selectedSpecimenId?specimenById(selectedSpecimenId):null,scroll=$('#canvasScroll'),stage=$('#boxStage');if(!s||!scroll||!stage)return toast('Select a specimen first','warn');const x=stage.offsetLeft+stage.clientWidth*s.x/100,y=stage.offsetTop+stage.clientHeight*s.y/100;setCanvasView(x-scroll.clientWidth/2,y-scroll.clientHeight/2,{behavior:animate?'smooth':'auto'});const el=document.querySelector(`.specimen[data-specimen-id="${CSS.escape(s.id)}"]`);if(animate)el?.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(1.18)'},{transform:'translate(-50%,-50%) scale(1)'}],{duration:700,easing:'ease-out'});}

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
    const s=specimenById(id);if(!s)return;if(s.placementStatus==='skipped')return toast('Return this record to the active queue before placing it','warn');
    state.preferences.editMode='arrange';
    if(placingSpecimenId===id){placingSpecimenId=null;tool='select';}else{placingSpecimenId=id;tool='place';selectedSpecimenId=id;selectedZoneId=null;inspectorTab='details';}
    renderAll();
  }

  function placeSpecimenAt(id,x,y) {
    const s=specimenById(id);if(!s)return;if(state.preferences.editMode!=='arrange')return toast('Switch to Arrange to place specimens','warn');pushHistory();({x,y}=normalizedPositionFor(s,x,y));s.boxId=currentBox().id;s.targetBoxId=currentBox().id;s.x=x;s.y=y;s.zoneId=zoneAtPoint(x,y)?.id||s.preferredZoneId||null;s.placementStatus='active';s.updatedAt=nowISO();selectedSpecimenId=s.id;selectedZoneId=null;placingSpecimenId=null;tool='select';recordActivity('place',s.id,`Placed in ${currentBox().code}`,{x,y,zoneId:s.zoneId});persist('Specimen placed');renderAll();toast(`${shown(s.catalogNumber,'Specimen')} placed${s.zoneId?` · ${zoneById(s.zoneId)?.name||''}`:''}`);
  }

  function autoPlace(specimenIds=null,zoneId=null) {
    const queue=(specimenIds?.length?specimenIds.map(specimenById).filter(Boolean):queueForCurrentBox().filter(s=>s.placementStatus!=='skipped'));
    if(!queue.length)return toast('Select active placement records first','warn');state.preferences.editMode='arrange';const box=currentBox();const chosenZone=zoneById(zoneId||selectedZoneId||queue.find(s=>s.preferredZoneId)?.preferredZoneId);const zone=chosenZone?.boxId===box.id?chosenZone:null;const target=zone?{x:zone.x,y:zone.y,w:zone.w,h:zone.h,zoneId:zone.id}:{x:2,y:2,w:96,h:96,zoneId:null};const existing=placedInCurrentBox().map(s=>({...specimenRect(s,box),id:s.id}));const ordered=[...queue].sort((a,b)=>b.footprintWidthMm*b.footprintHeightMm-a.footprintWidthMm*a.footprintHeightMm);let placed=0;pushHistory();
    for(const s of ordered.slice(0,500)){const w=s.footprintWidthMm/box.widthMm*100,h=s.footprintHeightMm/box.heightMm*100;let found=null,step=Math.max(1.1,Math.min(w,h)/3);for(let cy=target.y+h/2+1;cy<=target.y+target.h-h/2-1&&!found;cy+=step){for(let cx=target.x+w/2+1;cx<=target.x+target.w-w/2-1;cx+=step){const r={x:cx-w/2,y:cy-h/2,w,h};if(!existing.some(o=>intersects(r,o,.5))){found={cx,cy,r};break;}}}if(found){s.boxId=box.id;s.targetBoxId=box.id;s.x=found.cx;s.y=found.cy;s.zoneId=target.zoneId||s.preferredZoneId||null;s.placementStatus='active';s.updatedAt=nowISO();existing.push({...found.r,id:s.id});recordActivity('auto-place',s.id,`Auto-placed in ${box.code}`,{x:s.x,y:s.y,zoneId:s.zoneId});placed++;}}
    if(!placed){history.pop();return toast('No collision-free space found in the selected area','warn');}selectedQueueIds.clear();persist('Auto-placement saved');renderAll();toast(`${placed} specimen${placed===1?'':'s'} auto-placed${zone?` in ${zone.name}`:''}${placed<queue.length?` · ${queue.length-placed} remain`:''}`);
  }

  function startZoneTool() {if(state.preferences.editMode!=='arrange'){state.preferences.editMode='arrange';toast('Arrange mode enabled');}placingSpecimenId=null;tool=tool==='zone'?'select':'zone';renderAll();}

  function handleStagePointerDown(e) {
    if (e.target.closest('.specimen') || e.target.closest('.zone')) return;
    if (placingSpecimenId) {
      if (state.preferences.editMode !== 'arrange') return toast('Switch to Arrange to place specimens','warn');
      const p = pointFromEvent(e);
      placeSpecimenAt(placingSpecimenId,p.x,p.y);
      return;
    }
    if (tool === 'zone') {
      if (state.preferences.editMode !== 'arrange') return;
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
    if (!zoneDraftState || state.preferences.editMode !== 'arrange') return;
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

  function startCanvasPan(e) {
    const scroll=$('#canvasScroll');
    const backgroundHit=!e.target.closest('.specimen,.zone,.minimap');
    const browseDrag = backgroundHit && state.preferences.editMode==='browse' && e.button===0;
    const touchDrag = backgroundHit && e.pointerType==='touch' && !placingSpecimenId;
    const shouldPan=backgroundHit&&canPanCanvas()&&(browseDrag||e.button===1||spacePressed||touchDrag);
    if(!shouldPan)return;
    e.preventDefault();
    panState={pointerId:e.pointerId,startX:e.clientX,startY:e.clientY,scrollLeft:scroll.scrollLeft,scrollTop:scroll.scrollTop};
    scroll.setPointerCapture?.(e.pointerId);scroll.classList.add('panning');
  }

  function moveCanvasPan(e) {
    if(!panState||panState.pointerId!==e.pointerId)return;const scroll=$('#canvasScroll');setCanvasView(panState.scrollLeft-(e.clientX-panState.startX),panState.scrollTop-(e.clientY-panState.startY),{behavior:'auto'});updateMinimapViewport();
  }

  function endCanvasPan(e) {if(!panState||panState.pointerId!==e.pointerId)return;panState=null;$('#canvasScroll').classList.remove('panning');}

  function handleCanvasWheel(e) {
    if(e.ctrlKey||e.metaKey){e.preventDefault();setZoom(state.preferences.zoom+(e.deltaY<0?10:-10));}
  }

  function handleMinimapPointer(e) {
    const surface=$('#minimapSurface'),scroll=$('#canvasScroll'),stage=$('#boxStage');if(!surface||!scroll||!stage)return;const r=surface.getBoundingClientRect(),x=clamp((e.clientX-r.left)/r.width,0,1),y=clamp((e.clientY-r.top)/r.height,0,1);setCanvasView(stage.offsetLeft+stage.clientWidth*x-scroll.clientWidth/2,stage.offsetTop+stage.clientHeight*y-scroll.clientHeight/2,{behavior:'smooth'});
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

  function recordValue(value,fallback) {
    const text=String(value??'').trim();
    return `<b class="${text?'':'empty'}">${esc(text||fallback)}</b>`;
  }

  function specimenAlerts(s,{includeResolved=false}={}) {
    return (state.alerts||[]).filter(a=>a.specimenId===s.id&&(includeResolved||a.status!=='resolved'));
  }

  function activityListHtml(s,limit=6) {
    const items=activityForSpecimen(s.id).slice(0,limit);
    if(!items.length)return '<div class="empty-state">No activity has been recorded yet.</div>';
    return `<div class="activity-list">${items.map(item=>`<div class="activity-item"><span class="activity-dot"></span><span><strong>${esc(item.message)}</strong><small>${esc(new Date(item.at).toLocaleString())}</small></span></div>`).join('')}</div>`;
  }

  function renderSpecimenInspector(s) {
    const art=s.photoThumb?`<img src="${s.photoThumb}" alt="Specimen photograph">`:s.icon;
    const zone=s.zoneId?zoneById(s.zoneId):null,box=boxForSpecimen(s),alerts=specimenAlerts(s);
    const arranging=state.preferences.editMode==='arrange';
    $('#inspectorBody').innerHTML=`<div class="detail-hero"><div class="detail-art">${art}</div><h2>${esc(shown(s.scientificName,'Unidentified specimen'))}</h2><p class="${String(s.catalogNumber).startsWith('TEMP-')?'temp-id':''}">${esc(shown(s.catalogNumber,'Temporary record'))}</p></div>
      <div class="record-sections">
        <section class="record-section"><div class="record-section-head"><h3>Identity</h3></div><div class="record-section-body record-data-grid"><div class="record-data"><span>Scientific name</span>${recordValue(isUnidentified(s)?'':s.scientificName,'Not determined yet')}</div><div class="record-data"><span>Catalogue number</span>${recordValue(s.catalogNumber,'Temporary ID')}</div><div class="record-data"><span>Identified by</span>${recordValue(s.identifiedBy,'Not determined yet')}</div><div class="record-data"><span>Collection code</span>${recordValue(s.collectionCode,'Not recorded')}</div></div></section>
        <section class="record-section"><div class="record-section-head"><h3>Collection event</h3></div><div class="record-section-body record-data-grid"><div class="record-data"><span>Locality</span>${recordValue(s.locality,'Not recorded')}</div><div class="record-data"><span>Collector</span>${recordValue(s.recordedBy,'Not recorded')}</div><div class="record-data"><span>Event date</span>${recordValue(s.eventDate,'Not recorded')}</div><div class="record-data"><span>Preparation</span>${recordValue(s.preparationType,'Not recorded')}</div></div></section>
        <section class="record-section"><div class="record-section-head"><h3>Physical storage</h3></div><div class="record-section-body record-data-grid"><div class="record-data"><span>Box</span>${recordValue(box?`${box.code} · ${box.name}`:'','Not placed')}</div><div class="record-data"><span>Zone</span>${recordValue(zone?.name,'No zone')}</div><div class="record-data"><span>Pin position</span>${recordValue(s.boxId&&s.x!=null?`${s.x.toFixed(1)}%, ${s.y.toFixed(1)}%`:'','Not placed')}</div><div class="record-data"><span>Footprint</span><b>${s.footprintWidthMm} × ${s.footprintHeightMm} mm</b></div></div></section>
        <section class="record-section"><div class="record-section-head"><h3>Condition & alerts</h3><button class="text-action" id="reportIssueBtn">＋ Report issue</button></div><div class="record-section-body"><div class="record-data-grid"><div class="record-data"><span>Condition</span><b>${esc(s.condition)}</b></div><div class="record-data"><span>Open alerts</span><b>${alerts.length}</b></div></div><div class="inspector-alert-list">${alerts.map(a=>`<button class="inspector-alert-chip" data-inspector-alert="${a.id}"><span>${esc(a.type)} · ${esc(a.title)}</span><b>›</b></button>`).join('')||'<div class="empty-state">No unresolved alerts for this specimen.</div>'}</div></div></section>
        <section class="record-section"><div class="record-section-head"><h3>Recent history</h3></div><div class="record-section-body">${activityListHtml(s,4)}</div></section>
      </div>
      <div class="field-row"><div class="field"><label>Footprint width (mm)</label><input type="number" id="detailW" value="${s.footprintWidthMm}" min="2" max="200" ${arranging?'':'disabled'}></div><div class="field"><label>Footprint height (mm)</label><input type="number" id="detailH" value="${s.footprintHeightMm}" min="2" max="200" ${arranging?'':'disabled'}></div></div>
      <div class="field"><label>Zone assignment</label><select id="detailZone" ${arranging?'':'disabled'}><option value="">No zone</option>${currentZones().map(x=>`<option value="${x.id}" ${x.id===s.zoneId?'selected':''}>${esc(x.code)} · ${esc(x.name)}</option>`).join('')}</select></div>
      <div class="field"><label>Condition</label><select id="detailCondition"><option ${s.condition==='Not assessed'?'selected':''}>Not assessed</option><option ${s.condition==='Good'?'selected':''}>Good</option><option ${s.condition==='Attention'?'selected':''}>Attention</option><option ${s.condition==='Damaged'?'selected':''}>Damaged</option><option ${s.condition==='Missing'?'selected':''}>Missing</option></select></div>
      <div class="field"><label>Notes</label><textarea id="detailNotes">${esc(s.notes)}</textarea></div>
      <input type="file" id="specimenPhotoInput" accept="image/*" hidden>
      ${arranging?'':'<div class="import-note">Spatial fields are locked in Browse mode. Switch to Arrange before changing the footprint, zone, or position.</div>'}
      <div class="action-stack"><button class="btn primary" id="saveSpecimenSpatial">Save details</button><button class="btn" id="editRecordBtn">✎ Edit catalogue data</button><button class="btn" id="uploadSpecimenPhoto">▧ ${s.photoThumb?'Replace':'Add'} specimen photo</button><button class="btn" id="openRecordBtn">Open complete record</button>${s.boxId?'<button class="btn" id="returnToTrayBtn">↩ Return to placement tray</button>':''}<button class="btn danger" id="deleteSpecimenBtn">Move to trash</button></div>`;
    $('#saveSpecimenSpatial').onclick=()=>{pushHistory();if(arranging){s.footprintWidthMm=clamp(+$('#detailW').value||30,2,200);s.footprintHeightMm=clamp(+$('#detailH').value||24,2,200);s.zoneId=$('#detailZone').value||null;if(s.boxId&&s.x!=null){const p=normalizedPositionFor(s,s.x,s.y);s.x=p.x;s.y=p.y;}}s.condition=$('#detailCondition').value;s.notes=$('#detailNotes').value.trim();s.updatedAt=nowISO();syncConditionAlertForSpecimen(s);recordActivity('edit',s.id,'Specimen details updated',{condition:s.condition,zoneId:s.zoneId});persist('Specimen saved');renderAll();toast('Specimen updated');};
    $('#editRecordBtn').onclick=()=>openEditSpecimenRecord(s);
    $('#reportIssueBtn').onclick=()=>openAlertForm(null,{specimenId:s.id,boxId:s.boxId});
    $$('[data-inspector-alert]').forEach(button=>button.onclick=()=>openAlertsCenter(button.dataset.inspectorAlert));
    $('#uploadSpecimenPhoto').onclick=()=>$('#specimenPhotoInput').click();
    $('#specimenPhotoInput').onchange=async e=>{if(!e.target.files[0])return;pushHistory();s.photoThumb=await compressImage(e.target.files[0],720,720,.82,'contain');s.updatedAt=nowISO();recordActivity('media',s.id,'Specimen photograph added or replaced');persist('Photograph saved');renderAll();toast('Specimen photo saved');};
    $('#openRecordBtn').onclick=()=>openFullRecord(s.id);
    if($('#returnToTrayBtn'))$('#returnToTrayBtn').onclick=()=>{pushHistory();const oldBox=boxForSpecimen(s);s.targetBoxId=s.boxId;s.boxId=null;s.x=null;s.y=null;s.zoneId=null;s.placementStatus='active';s.updatedAt=nowISO();recordActivity('unplace',s.id,`Returned from ${oldBox?.code||'box'} to placement tray`);persist('Returned to tray');selectedSpecimenId=s.id;renderAll();toast('Specimen returned to placement tray');};
    $('#deleteSpecimenBtn').onclick=()=>moveSpecimenToTrash(s);
  }

  function renderZoneInspector(z) {
    const count=state.specimens.filter(s=>s.boxId===z.boxId&&s.zoneId===z.id).length;
    $('#inspectorBody').innerHTML=`<div class="detail-hero"><div class="detail-art" style="font-size:40px">▱</div><h2>${esc(z.name)}</h2><p>${esc(z.code||'Zone')} · ${count} specimens</p></div>
      <div class="field"><label>Zone name</label><input id="editZoneName" value="${esc(z.name)}"></div><div class="field"><label>Short code</label><input id="editZoneCode" value="${esc(z.code||'')}"></div><div class="field"><label>Description</label><textarea id="editZoneDescription">${esc(z.description||'')}</textarea></div>
      <div class="detail-grid"><div class="detail-cell"><span>Position</span><b>${z.x.toFixed(1)}%, ${z.y.toFixed(1)}%</b></div><div class="detail-cell"><span>Size</span><b>${z.w.toFixed(1)}% × ${z.h.toFixed(1)}%</b></div></div>
      <div class="action-stack"><button class="btn primary" id="saveZoneDetails">Save zone</button><button class="btn" id="autoPlaceZone">Auto-place queue in this zone</button><button class="btn danger" id="deleteZone">Delete zone</button></div>`;
    $('#saveZoneDetails').onclick=()=>{pushHistory();z.name=$('#editZoneName').value.trim()||z.name;z.code=$('#editZoneCode').value.trim();z.description=$('#editZoneDescription').value.trim();persist();renderAll();toast('Zone updated');};
    $('#autoPlaceZone').onclick=()=>{selectedZoneId=z.id;autoPlace();};
    $('#deleteZone').onclick=()=>moveZoneToTrash(z);
  }

  function renderBoxInspector() {
    const box=currentBox();const placed=placedInCurrentBox().length,queued=queueForCurrentBox().length;
    $('#inspectorBody').innerHTML=`<div class="detail-hero"><div class="detail-art" style="font-size:50px">📦</div><h2>${esc(box.name)}</h2><p>${esc(box.path)}</p></div>
      <div class="detail-grid"><div class="detail-cell"><span>Dimensions</span><b>${box.widthMm} × ${box.heightMm} mm</b></div><div class="detail-cell"><span>Mapped</span><b>${placed} specimen${placed===1?'':'s'}</b></div><div class="detail-cell"><span>Placement tray</span><b>${queued} record${queued===1?'':'s'}</b></div><div class="detail-cell"><span>Zones</span><b>${currentZones().length}</b></div></div>
      <p style="font-size:12px;line-height:1.55;color:var(--muted)">The red point is the physical pin anchor. The oval is an approximate footprint, so large antennae, wings and labels can occupy different amounts of space without forcing the collection into rigid cells.</p>
      <div class="action-stack"><button class="btn primary" id="inspectorAddSpecimen">＋ Add specimen</button><button class="btn" id="inspectorImport">⇧ Import Excel / CSV</button><button class="btn" id="inspectorPhoto">▧ Replace box photograph</button><button class="btn" id="editBoxBtn">Edit box dimensions</button></div>`;
    $('#inspectorAddSpecimen').onclick=()=>openAddSpecimen();$('#inspectorImport').onclick=()=>$('#importFileInput').click();$('#inspectorPhoto').onclick=()=>$('#boxPhotoInput').click();$('#editBoxBtn').onclick=()=>openEditBox(box);
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
    const s=specimenById(id);if(!s)return;const box=boxForSpecimen(s),zone=zoneById(s.zoneId),alerts=specimenAlerts(s,{includeResolved:true});
    showModal({eyebrow:'Specimen record',title:shown(s.scientificName,'Unidentified specimen'),body:`<div class="record-sections">
      ${s.photoThumb?`<img class="record-photo" src="${s.photoThumb}" alt="Specimen photograph">`:''}
      <section class="record-section"><div class="record-section-head"><h3>Identity</h3></div><div class="record-section-body record-data-grid"><div class="record-data"><span>Scientific name</span>${recordValue(isUnidentified(s)?'':s.scientificName,'Not determined yet')}</div><div class="record-data"><span>Catalogue number</span>${recordValue(s.catalogNumber,'Temporary ID')}</div><div class="record-data"><span>Collection</span>${recordValue(s.collectionCode,'Not recorded')}</div><div class="record-data"><span>Identified by</span>${recordValue(s.identifiedBy,'Not determined yet')}</div></div></section>
      <section class="record-section"><div class="record-section-head"><h3>Collection event</h3></div><div class="record-section-body record-data-grid"><div class="record-data"><span>Locality</span>${recordValue(s.locality,'Not recorded')}</div><div class="record-data"><span>Collector</span>${recordValue(s.recordedBy,'Not recorded')}</div><div class="record-data"><span>Event date</span>${recordValue(s.eventDate,'Not recorded')}</div><div class="record-data"><span>Preparation</span>${recordValue(s.preparationType,'Not recorded')}</div></div></section>
      <section class="record-section"><div class="record-section-head"><h3>Physical storage</h3></div><div class="record-section-body record-data-grid"><div class="record-data"><span>Box</span>${recordValue(box?`${box.code} · ${box.name}`:'','Not placed')}</div><div class="record-data"><span>Storage path</span>${recordValue(box?.path,'Not placed')}</div><div class="record-data"><span>Zone</span>${recordValue(zone?.name,'No zone')}</div><div class="record-data"><span>Position</span>${recordValue(s.boxId&&s.x!=null?`${s.x.toFixed(1)}%, ${s.y.toFixed(1)}%`:'','Not placed')}</div></div></section>
      <section class="record-section"><div class="record-section-head"><h3>Condition</h3></div><div class="record-section-body"><div class="record-data-grid"><div class="record-data"><span>Condition</span><b>${esc(s.condition)}</b></div><div class="record-data"><span>Notes</span>${recordValue(s.notes,'No notes')}</div></div><div class="inspector-alert-list">${alerts.map(a=>`<button class="inspector-alert-chip ${a.status==='resolved'?'resolved':''}" data-full-alert="${a.id}"><span>${esc(a.type)} · ${esc(a.title)}</span><b>${esc(a.status)}</b></button>`).join('')||'<div class="empty-state">No alerts in this record.</div>'}</div></div></section>
      <section class="record-section"><div class="record-section-head"><h3>History</h3></div><div class="record-section-body">${activityListHtml(s,30)}</div></section>
    </div>`,foot:'<button class="btn" data-close-modal>Close</button><button class="btn" id="reportFromFullRecord">＋ Report issue</button><button class="btn primary" id="editFromFullRecord">Edit record</button>'});
    $('#editFromFullRecord').onclick=()=>{closeModal();openEditSpecimenRecord(s);};
    $('#reportFromFullRecord').onclick=()=>{closeModal();openAlertForm(null,{specimenId:s.id,boxId:s.boxId});};
    $$('[data-full-alert]',$('#modalBody')).forEach(b=>b.onclick=()=>{closeModal();openAlertsCenter(b.dataset.fullAlert);});
  }

  function openAddSpecimen() {
    if (!currentBox()) { toast('Create a specimen box first','warn'); openStorageCreateMenu(null); return; }
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
    $('#addToTray').onclick=()=>{const s=create();if(!s)return;pushHistory();state.specimens.push(s);selectedSpecimenId=s.id;currentView='workspace';state.selectedBoxId=s.targetBoxId||currentBox()?.id||state.selectedBoxId;state.preferences.navOpen=true;recordActivity('create',s.id,'Specimen record created in placement tray');syncConditionAlertForSpecimen(s);persist('Specimen added');closeModal();renderAll();requestAnimationFrame(()=>fitBoxToScreen());toast('Specimen added to this box’s placement tray');};
    $('#addAndPlace').onclick=()=>{const s=create();if(!s)return;pushHistory();state.specimens.push(s);selectedSpecimenId=s.id;placingSpecimenId=s.id;tool='place';currentView='workspace';state.selectedBoxId=s.targetBoxId||currentBox()?.id||state.selectedBoxId;state.preferences.navOpen=false;state.preferences.editMode='arrange';recordActivity('create',s.id,'Specimen record created for immediate placement');syncConditionAlertForSpecimen(s);persist('Specimen added');closeModal();renderAll();requestAnimationFrame(()=>fitBoxToScreen());toast('Tap the open box to place the specimen');};
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
      s.catalogNumber=cat;s.scientificName=$('#editTaxon').value.trim()||'Unidentified specimen';s.collectionCode=$('#editCollectionCode').value.trim();s.locality=$('#editLocality').value.trim();s.recordedBy=$('#editCollector').value.trim();s.eventDate=$('#editDate').value;s.identifiedBy=$('#editIdentifier').value.trim();s.condition=$('#editCondition').value;s.notes=$('#editNotes').value.trim();if(replacementPhoto)s.photoThumb=replacementPhoto;s.icon=iconForTaxon(s.scientificName);s.updatedAt=nowISO();syncConditionAlertForSpecimen(s);recordActivity('catalogue-edit',s.id,'Catalogue data updated',{scientificName:s.scientificName,catalogNumber:s.catalogNumber});persist('Record saved');closeModal();renderAll();toast('Specimen record updated');
    };
  }

  function moveSpecimenToTrash(s) {
    if(!confirm(`Move ${shown(s.catalogNumber,'this specimen')} to trash? You can restore it from Collection setup.`))return;
    pushHistory();
    const linkedAlerts=(state.alerts||[]).filter(a=>a.specimenId===s.id);
    state.trash.specimens.unshift({id:uid(),item:deepClone(s),alerts:deepClone(linkedAlerts),deletedAt:nowISO()});
    state.alerts=(state.alerts||[]).filter(a=>a.specimenId!==s.id);
    state.specimens=state.specimens.filter(x=>x.id!==s.id);
    selectedSpecimenId=null;persist('Moved to trash');renderAll();toast('Specimen moved to trash');
  }

  function moveZoneToTrash(z) {
    if(!confirm(`Move zone “${z.name}” to trash? Specimens stay in their current positions.`))return;
    pushHistory();const affected=state.specimens.filter(s=>s.zoneId===z.id).map(s=>s.id);state.trash.zones.unshift({id:uid(),item:deepClone(z),affectedSpecimenIds:affected,deletedAt:nowISO()});state.specimens.filter(s=>s.zoneId===z.id).forEach(s=>s.zoneId=null);state.zones=state.zones.filter(x=>x.id!==z.id);selectedZoneId=null;persist('Zone moved to trash');renderAll();toast('Zone moved to trash');
  }

  function moveLocationToTrash(location) {
    const childCount=state.locations.filter(l=>l.parentId===location.id).length,boxCount=state.boxes.filter(b=>b.parentLocationId===location.id).length;
    if(childCount||boxCount)return toast(`Move or delete ${childCount+boxCount} nested item${childCount+boxCount===1?'':'s'} first`,'warn');
    if(!confirm(`Move ${location.name} to trash?`))return;pushHistory();state.trash.locations.unshift({id:uid(),item:deepClone(location),deletedAt:nowISO()});state.locations=state.locations.filter(l=>l.id!==location.id);syncAllBoxPaths();persist('Location moved to trash');closeModal();renderAll();toast('Storage location moved to trash');
  }

  function moveBoxToTrash(box) {
    const records=state.specimens.filter(s=>s.boxId===box.id||s.targetBoxId===box.id).length,zones=state.zones.filter(z=>z.boxId===box.id).length;
    if(records||zones)return toast(`This box still contains ${records} record${records===1?'':'s'} and ${zones} zone${zones===1?'':'s'}`,'warn');
    if(!confirm(`Move ${box.name} to trash?`))return;pushHistory();state.trash.boxes.unshift({id:uid(),item:deepClone(box),deletedAt:nowISO()});state.boxes=state.boxes.filter(b=>b.id!==box.id);state.selectedBoxId=state.boxes[0]?.id||null;persist('Box moved to trash');closeModal();renderAll();toast('Box moved to trash');
  }

  function restoreTrashEntry(kind,entryId) {
    const list=state.trash[kind]||[],index=list.findIndex(e=>e.id===entryId);if(index<0)return;const entry=list[index];pushHistory();
    if(kind==='specimens'){let item=entry.item;if(state.specimens.some(s=>s.id===item.id))item.id=uid();if(state.specimens.some(s=>s.catalogNumber===item.catalogNumber))item.catalogNumber=nextTemporaryNumber();state.specimens.push(specimen(item));for(const alert of entry.alerts||[]){if(state.alerts.some(a=>a.id===alert.id))alert.id=uid();alert.specimenId=item.id;state.alerts.push(alert);}}
    if(kind==='zones'){const item=entry.item;if(state.zones.some(z=>z.id===item.id))item.id=uid();if(!state.boxes.some(b=>b.id===item.boxId))item.boxId=currentBox()?.id||null;if(item.boxId)state.zones.push(item);for(const id of entry.affectedSpecimenIds||[]){const s=specimenById(id);if(s&&s.boxId===item.boxId)s.zoneId=item.id;}}
    if(kind==='boxes'){const item=entry.item;if(state.boxes.some(b=>b.id===item.id))item.id=uid();if(item.parentLocationId&&!locationById(item.parentLocationId))item.parentLocationId=null;state.boxes.push(item);state.selectedBoxId=item.id;}
    if(kind==='locations'){const item=entry.item;if(state.locations.some(l=>l.id===item.id))item.id=uid();if(item.parentId&&!locationById(item.parentId))item.parentId=null;state.locations.push(item);}
    list.splice(index,1);syncAllBoxPaths();persist('Item restored');renderAll();openTrashRecovery();toast('Item restored from trash');
  }

  function permanentlyDeleteTrashEntry(kind,entryId) {if(!confirm('Permanently delete this item? This cannot be undone.'))return;state.trash[kind]=(state.trash[kind]||[]).filter(e=>e.id!==entryId);persist('Trash updated');openTrashRecovery();}

  function openTrashRecovery() {
    const groups=[['specimens','Specimens'],['zones','Zones'],['boxes','Boxes'],['locations','Storage locations']];
    const html=groups.map(([kind,label])=>{const entries=state.trash[kind]||[];return `<section class="record-section"><div class="record-section-head"><h3>${label}</h3><span class="count-badge">${entries.length}</span></div><div class="record-section-body trash-list">${entries.map(entry=>{const item=entry.item;const name=kind==='specimens'?`${shown(item.scientificName,'Unidentified specimen')} · ${shown(item.catalogNumber,'Temporary record')}`:item.name||item.code||'Deleted item';return `<div class="trash-item"><span><strong>${esc(name)}</strong><small>Deleted ${esc(new Date(entry.deletedAt).toLocaleString())}</small></span><span class="trash-actions"><button class="btn tiny" data-trash-restore="${kind}:${entry.id}">Restore</button><button class="btn tiny danger" data-trash-delete="${kind}:${entry.id}">Delete forever</button></span></div>`;}).join('')||'<div class="empty-state">No items in this section.</div>'}</div></section>`;}).join('');
    showModal({eyebrow:'Data recovery',title:'Trash & recovery',body:`<div class="import-note">Deleted items remain here until you permanently remove them. Backups also include the trash.</div><div class="record-sections">${html}</div>`,foot:'<button class="btn" data-close-modal>Close</button>'});
    $$('[data-trash-restore]').forEach(b=>b.onclick=()=>{const[k,id]=b.dataset.trashRestore.split(':');restoreTrashEntry(k,id);});$$('[data-trash-delete]').forEach(b=>b.onclick=()=>{const[k,id]=b.dataset.trashDelete.split(':');permanentlyDeleteTrashEntry(k,id);});
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
      const b={id:uid(),name,code,parentLocationId:parentId,path:'',widthMm:clamp(+$('#newBoxW').value||400,100,1200),heightMm:clamp(+$('#newBoxH').value||300,80,900),gridCols:16,gridRows:12,background:BLANK_BG};
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
    $('#deleteLocationBtn').onclick = () => moveLocationToTrash(location);
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
    $('#deleteBoxBtn').onclick=()=>moveBoxToTrash(box);
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
    state.meta ||= {};
    state.meta.hasExportedBackup = true;
    persist('Backup prepared');
    const safeName=(state.collectionName||'collection').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48)||'collection';
    const blob=new Blob([JSON.stringify({...state,exportedAt:nowISO()},null,2)],{type:'application/json'});downloadBlob(blob,`entobox-${safeName}-${new Date().toISOString().slice(0,10)}.json`);renderHome();toast('Backup downloaded');
  }
  function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}

  function collectionHasData() {
    return Boolean((state.locations||[]).length || (state.boxes||[]).length || (state.zones||[]).length || (state.specimens||[]).length);
  }

  function resetTransientUi() {
    selectedSpecimenId=null;
    selectedZoneId=null;
    selectedAlertId=null;
    selectedQueueIds.clear();
    inspectorTab='details';
    placingSpecimenId=null;
    tool='select';
    dragState=null;
    zoneDraftState=null;
    history=[];
    pendingImport=null;
    currentView='home';
    homeAlertsExpanded=false;
    tourStep=-1;
    panState=null;
    spacePressed=false;
    $('#tourOverlay')?.setAttribute('hidden','');
  }

  function replaceWorkspace(nextState,message) {
    state=normalizeState(nextState);
    resetTransientUi();
    welcomePending=false;
    persist(message);
    closeModal(true);
    renderAll();
  }

  function openWelcomeModal() {
    const hasData = collectionHasData();
    const modeLabel = state.meta?.isDemo ? 'Demo collection currently loaded' : 'Current browser workspace detected';
    showModal({eyebrow:'EntoBox launch screen',title:'Start new collection or load a demo',locked:true,body:`
      <div class="welcome-hero">
        <div class="welcome-hero-copy"><strong>Choose how you want to begin.</strong><span>Open a clean collection, inspect the demo collection, or continue the workspace already stored in this browser.</span></div>
        ${hasData?`<button class="welcome-continue" id="welcomeContinueCollection"><span>↩</span><div><strong>Continue current collection</strong><small>${esc(modeLabel)} · ${state.specimens.length} specimens · ${state.boxes.length} boxes</small></div></button>`:''}
      </div>
      <div class="welcome-choice-grid large-start-grid">
        <button class="welcome-choice featured large" id="welcomeNewCollection"><span class="welcome-choice-icon">＋</span><strong>Start new collection</strong><small>Begin from a clean setup with a guided wizard for storage, first box, and first specimen workflow.</small></button>
        <button class="welcome-choice large" id="welcomeDemoCollection"><span class="welcome-choice-icon">🪲</span><strong>Load demo collection</strong><small>Open an example workspace with boxes, placements, alerts, and a guided tour.</small></button>
      </div>
      <div class="welcome-secondary-row">
        <button class="welcome-secondary-action" id="welcomeRestoreCollection">⇧ Restore backup</button>
      </div>
      <div class="local-first-note">EntoBox is local-first: everything stays in this browser until you export a backup.</div>`,foot:''});
    if ($('#welcomeContinueCollection')) $('#welcomeContinueCollection').onclick=()=>{welcomePending=false;closeModal();renderAll();requestAnimationFrame(()=>fitBoxToScreen());};
    $('#welcomeNewCollection').onclick=()=>openNewCollectionWizard({fromWelcome:true});
    $('#welcomeDemoCollection').onclick=()=>{replaceWorkspace(defaultState(),'Demo workspace ready');toast('Demo collection loaded');setTimeout(()=>startGuidedTour(),250);};
    $('#welcomeRestoreCollection').onclick=()=>{$('#backupFileInput').dataset.context='welcome';$('#backupFileInput').click();};
  }

  function openNewCollectionWizard({fromWelcome=false}={}) {
    setupWizardDraft={fromWelcome,destructive:collectionHasData()&&!state.meta?.isDemo&&!fromWelcome,step:0,name:'My Entomology Collection',code:'',structure:'simple',building:'Building A',room:'Collection room',cabinet:'Cabinet 01',drawer:'Drawer 01',boxName:'Box 01',boxCode:'BOX-01',width:400,height:300,photo:null,next:'add',confirmed:false};
    renderSetupWizard();
  }

  function wizardProgress(step) {return `<div class="setup-wizard-progress">${[0,1,2,3].map(i=>`<span class="setup-wizard-step ${i<step?'done':i===step?'active':''}"></span>`).join('')}</div>`;}

  function captureWizardFields() {
    const d=setupWizardDraft;if(!d)return;
    const value=id=>$('#'+id)?.value;
    if(value('wizardCollectionName')!==undefined){d.name=value('wizardCollectionName').trim()||'My Entomology Collection';d.code=value('wizardCollectionCode').trim();}
    const structure=$('[name="wizardStructure"]:checked')?.value;if(structure)d.structure=structure;
    for(const [key,id] of [['building','wizardBuilding'],['room','wizardRoom'],['cabinet','wizardCabinet'],['drawer','wizardDrawer'],['boxName','wizardBoxName'],['boxCode','wizardBoxCode']])if(value(id)!==undefined)d[key]=value(id).trim();
    if(value('wizardBoxWidth')!==undefined)d.width=clamp(+value('wizardBoxWidth')||400,100,1200);
    if(value('wizardBoxHeight')!==undefined)d.height=clamp(+value('wizardBoxHeight')||300,80,900);
    if(value('wizardNext')!==undefined)d.next=value('wizardNext');
    if($('#wizardReplaceConfirm'))d.confirmed=$('#wizardReplaceConfirm').checked;
  }

  function renderSetupWizard() {
    const d=setupWizardDraft;if(!d)return;let body='',title='Create your collection';
    if(d.step===0)body=`${wizardProgress(0)}<div class="clean-start-illustration"><span>◆</span><div><strong>Name the workspace</strong><small>These details can be changed later from Collection setup.</small></div></div><div class="form-grid"><div class="field full"><label>Collection name</label><input id="wizardCollectionName" value="${esc(d.name)}" placeholder="e.g. Saniya Private Insect Collection"></div><div class="field"><label>Collection code <em>optional</em></label><input id="wizardCollectionCode" value="${esc(d.code)}" placeholder="e.g. SPIC"></div></div>`;
    if(d.step===1)body=`${wizardProgress(1)}<div class="optional-record-note"><strong>Storage levels are optional.</strong><span>A private collection can start with one box. A museum can use the full building-to-drawer hierarchy.</span></div><div class="wizard-choice-grid"><label class="wizard-choice ${d.structure==='simple'?'active':''}"><input type="radio" name="wizardStructure" value="simple" ${d.structure==='simple'?'checked':''}><strong>Just a box</strong><small>Collection → Box</small></label><label class="wizard-choice ${d.structure==='room'?'active':''}"><input type="radio" name="wizardStructure" value="room" ${d.structure==='room'?'checked':''}><strong>Room and box</strong><small>Collection → Room → Box</small></label><label class="wizard-choice ${d.structure==='detailed'?'active':''}"><input type="radio" name="wizardStructure" value="detailed" ${d.structure==='detailed'?'checked':''}><strong>Detailed institutional path</strong><small>Building → Room → Cabinet → Drawer → Box</small></label></div><div id="wizardStructureFields" class="form-grid" style="margin-top:12px"></div>`;
    if(d.step===2)body=`${wizardProgress(2)}<div class="clean-start-illustration"><span>▣</span><div><strong>Create the first spatial box</strong><small>The photograph is optional. A neutral box map is used until you upload one.</small></div></div><div class="form-grid"><div class="field"><label>Box name</label><input id="wizardBoxName" value="${esc(d.boxName)}"></div><div class="field"><label>Box code</label><input id="wizardBoxCode" value="${esc(d.boxCode)}"></div><div class="field"><label>Width (mm)</label><input type="number" id="wizardBoxWidth" value="${d.width}"></div><div class="field"><label>Height (mm)</label><input type="number" id="wizardBoxHeight" value="${d.height}"></div><div class="field full"><label>Box photograph <em>optional</em></label><input type="file" id="wizardBoxPhoto" accept="image/*"><small>${d.photo?'A compressed preview is ready. Choose another file to replace it.':'You can also upload the photograph later.'}</small></div></div>`;
    if(d.step===3){const path=d.structure==='simple'?'Collection root':d.structure==='room'?d.room:[d.building,d.room,d.cabinet,d.drawer].filter(Boolean).join(' › ');body=`${wizardProgress(3)}${d.destructive?'<div class="destructive-note"><strong>This replaces the collection currently saved in this browser.</strong><span>Download a backup first if you may need the current workspace again.</span></div>':''}<div class="wizard-review"><div class="wizard-review-row"><span>Collection</span><b>${esc(d.name)}</b></div><div class="wizard-review-row"><span>Storage path</span><b>${esc(path||'Collection root')}</b></div><div class="wizard-review-row"><span>First box</span><b>${esc(d.boxCode)} · ${esc(d.boxName)}</b></div><div class="wizard-review-row"><span>Box size</span><b>${d.width} × ${d.height} mm</b></div></div><div class="field" style="margin-top:12px"><label>After setup</label><select id="wizardNext"><option value="add" ${d.next==='add'?'selected':''}>Add the first specimen</option><option value="import" ${d.next==='import'?'selected':''}>Import Excel / CSV</option><option value="box" ${d.next==='box'?'selected':''}>Open the empty box</option><option value="home" ${d.next==='home'?'selected':''}>Open collection Home</option></select></div>${d.destructive?'<label class="replace-confirm"><input type="checkbox" id="wizardReplaceConfirm" '+(d.confirmed?'checked':'')+'><span>I understand that the current local workspace will be replaced.</span></label>':''}`;}
    const backLabel=d.step===0?(d.fromWelcome?'Back':'Cancel'):'Back',nextLabel=d.step===3?'Create collection':'Continue';
    showModal({eyebrow:`Guided setup · Step ${d.step+1} of 4`,title,locked:d.fromWelcome,body,foot:`${d.destructive&&d.step===3?'<button class="btn" id="wizardBackupBtn">⇩ Backup current data</button>':''}<span class="wizard-step-count">Step ${d.step+1} of 4</span><span class="modal-spacer"></span><button class="btn" id="wizardBackBtn">${backLabel}</button><button class="btn primary" id="wizardNextBtn">${nextLabel}</button>`});
    if(d.step===1){const draw=()=>{d.structure=$('[name="wizardStructure"]:checked')?.value||d.structure;$$('.wizard-choice').forEach(x=>x.classList.toggle('active',x.querySelector('input').checked));$('#wizardStructureFields').innerHTML=d.structure==='simple'?'<div class="import-note">The box will live directly under the collection root.</div>':d.structure==='room'?`<div class="field full"><label>Room / laboratory</label><input id="wizardRoom" value="${esc(d.room)}"></div>`:`<div class="field"><label>Building</label><input id="wizardBuilding" value="${esc(d.building)}"></div><div class="field"><label>Room</label><input id="wizardRoom" value="${esc(d.room)}"></div><div class="field"><label>Cabinet</label><input id="wizardCabinet" value="${esc(d.cabinet)}"></div><div class="field"><label>Drawer</label><input id="wizardDrawer" value="${esc(d.drawer)}"></div>`;};$$('[name="wizardStructure"]').forEach(x=>x.onchange=draw);draw();}
    if(d.step===2)$('#wizardBoxPhoto').onchange=async e=>{if(e.target.files[0]){d.photo=await compressImage(e.target.files[0],1800,1400,.8,'cover');toast('Box photo preview ready');}};
    if($('#wizardBackupBtn'))$('#wizardBackupBtn').onclick=exportBackup;
    $('#wizardBackBtn').onclick=()=>{captureWizardFields();if(d.step===0){setupWizardDraft=null;d.fromWelcome?openWelcomeModal():closeModal();}else{d.step--;renderSetupWizard();}};
    $('#wizardNextBtn').onclick=()=>{captureWizardFields();if(d.step===0&&!d.name)return toast('Enter a collection name','warn');if(d.step===2&&(!d.boxName||!d.boxCode))return toast('Enter a box name and code','warn');if(d.step<3){d.step++;renderSetupWizard();}else finishSetupWizard();};
  }

  function finishSetupWizard() {
    const d=setupWizardDraft;if(!d)return;if(d.destructive&&!d.confirmed)return toast('Please confirm that the current workspace may be replaced','warn');
    const next=emptyState({collectionName:d.name,collectionCode:d.code});let parentId=null;
    const addLocation=(type,name,code='')=>{const item={id:uid(),type,name:name||storageTypeTitle(type),code,parentId,notes:''};next.locations.push(item);parentId=item.id;return item;};
    if(d.structure==='room')addLocation('room',d.room||'Collection room');
    if(d.structure==='detailed'){addLocation('building',d.building||'Building A');addLocation('room',d.room||'Collection room');addLocation('cabinet',d.cabinet||'Cabinet 01');addLocation('drawer',d.drawer||'Drawer 01');}
    const box={id:uid(),name:d.boxName||'Box 01',code:d.boxCode||'BOX-01',parentLocationId:parentId,path:'',widthMm:d.width,heightMm:d.height,gridCols:16,gridRows:12,background:d.photo||BLANK_BG};next.boxes.push(box);next.selectedBoxId=box.id;next.meta.tourCompleted=true;syncAllBoxPaths(next);const action=d.next;setupWizardDraft=null;replaceWorkspace(next,'Collection created');toast('Your collection and first box are ready');setTimeout(()=>{
      if(action==='add'){
        openBoxWorkspace(box.id);
        setTimeout(()=>openAddSpecimen(),120);
      }else if(action==='import'){
        openBoxWorkspace(box.id);
        setTimeout(()=>$('#importFileInput').click(),120);
      }else if(action==='box')openBoxWorkspace(box.id);else setView('home');
    },180);
  }

  function openDemoConfirmation() {
    const destructive=collectionHasData()&&!state.meta?.isDemo;
    showModal({eyebrow:'Collection setup',title:'Load the EntoBox demo?',body:`<div class="clean-start-illustration demo"><span>🪲</span><div><strong>Restore the complete example workspace</strong><small>The demo includes storage, three boxes, specimen records, zones, a placement tray, and collection-care alerts.</small></div></div>${destructive?'<div class="destructive-note"><strong>Your current local workspace will be replaced.</strong><span>Export a backup before continuing if the data matters.</span></div><label class="replace-confirm"><input type="checkbox" id="replaceWithDemoConfirm"><span>I understand that the current local workspace will be replaced.</span></label>':''}`,foot:`${destructive?'<button class="btn" id="demoBackupBtn">⇩ Download backup</button>':''}<span class="modal-spacer"></span><button class="btn" data-close-modal>Cancel</button><button class="btn primary" id="loadDemoBtn">Load demo</button>`});
    if($('#demoBackupBtn'))$('#demoBackupBtn').onclick=exportBackup;
    $('#loadDemoBtn').onclick=()=>{if(destructive&&!$('#replaceWithDemoConfirm').checked)return toast('Please confirm that the current workspace may be replaced','warn');replaceWorkspace(defaultState(),'Demo workspace loaded');toast('Demo collection loaded');setTimeout(startGuidedTour,250);};
  }

  function openCollectionSetup() {
    const isDemo=!!state.meta?.isDemo,trashCount=Object.values(state.trash||{}).reduce((n,list)=>n+(list?.length||0),0);let snapshot=null;try{snapshot=JSON.parse(localStorage.getItem(PRE_IMPORT_KEY)||'null');}catch{}
    showModal({eyebrow:'Collection setup',title:'Manage this workspace',body:`<div class="workspace-status-card"><span class="collection-mode-badge ${isDemo?'demo':''}">${isDemo?'Demo workspace':'Your collection'}</span><strong>${esc(state.collectionName)}</strong><small>${state.specimens.length} specimens · ${state.boxes.length} boxes · ${state.locations.length} storage locations · ${activeCollectionAlerts().length} open alerts</small></div><div class="form-grid setup-details-grid"><div class="field"><label>Collection name</label><input id="setupCollectionName" value="${esc(state.collectionName)}"></div><div class="field"><label>Collection code <em>optional</em></label><input id="setupCollectionCode" value="${esc(state.collectionCode||'')}"></div></div><div class="setup-action-grid"><button class="setup-action" id="setupNewCollection"><span>＋</span><strong>Guided new collection</strong><small>Create storage and a first box in four steps.</small></button><button class="setup-action" id="setupRestoreBackup"><span>⇧</span><strong>Restore backup</strong><small>Validate and preview a V3 or V4 JSON backup.</small></button><button class="setup-action" id="setupLoadDemo"><span>🪲</span><strong>Load demo collection</strong><small>Return to the complete example workspace.</small></button><button class="setup-action" id="setupDownloadBackup"><span>⇩</span><strong>Download backup</strong><small>Save all local collection data as JSON.</small></button><button class="setup-action" id="setupTrash"><span>♻</span><strong>Trash & recovery</strong><small>${trashCount} recoverable item${trashCount===1?'':'s'}.</small></button><button class="setup-action" id="setupAutoSnapshot" ${snapshot?'':'disabled'}><span>↶</span><strong>Pre-import snapshot</strong><small>${snapshot?`Saved ${esc(new Date(snapshot.savedAt).toLocaleString())}`:'No automatic snapshot yet.'}</small></button><button class="setup-action" id="setupDiagnostics"><span>⌁</span><strong>Beta diagnostics</strong><small>Run 100 / 1,000 / 10,000-record benchmarks without changing data.</small></button><button class="setup-action" id="setupPrivacy"><span>ⓘ</span><strong>About & privacy</strong><small>Read the scope and local-storage limitations.</small></button></div>`,foot:'<button class="btn" data-close-modal>Close</button><button class="btn primary" id="saveCollectionDetails">Save collection details</button>'});
    $('#saveCollectionDetails').onclick=()=>{state.collectionName=$('#setupCollectionName').value.trim()||'My Entomology Collection';state.collectionCode=$('#setupCollectionCode').value.trim();persist('Collection details saved');closeModal();renderAll();toast('Collection details updated');};
    $('#setupNewCollection').onclick=()=>openNewCollectionWizard();$('#setupRestoreBackup').onclick=()=>{$('#backupFileInput').dataset.context='setup';$('#backupFileInput').click();};$('#setupLoadDemo').onclick=openDemoConfirmation;$('#setupDownloadBackup').onclick=exportBackup;$('#setupTrash').onclick=openTrashRecovery;$('#setupDiagnostics').onclick=openDiagnostics;$('#setupPrivacy').onclick=openAbout;
    if(snapshot)$('#setupAutoSnapshot').onclick=()=>previewRestoreBackup(snapshot.state,{label:'automatic pre-import snapshot'});
  }

  function validateBackupData(parsed) {
    if(!parsed||![3,4].includes(parsed.version)||!Array.isArray(parsed.locations)||!Array.isArray(parsed.boxes)||!Array.isArray(parsed.zones)||!Array.isArray(parsed.specimens))throw new Error('This is not a compatible EntoBox V3 or V4 backup.');
    const ids=[];for(const group of [parsed.locations,parsed.boxes,parsed.zones,parsed.specimens])for(const item of group){if(!item||typeof item!=='object'||!item.id)throw new Error('The backup contains an item without an ID.');ids.push(item.id);}if(new Set(ids).size!==ids.length)throw new Error('The backup contains duplicate object IDs.');
    if(parsed.specimens.some(s=>s.x!=null&&(!Number.isFinite(+s.x)||+s.x<0||+s.x>100||!Number.isFinite(+s.y)||+s.y<0||+s.y>100)))throw new Error('The backup contains invalid specimen coordinates.');
    return parsed;
  }

  function previewRestoreBackup(parsed,{label='backup'}={}) {
    const destructive=collectionHasData();showModal({eyebrow:'Restore data',title:`Restore ${label}?`,locked:welcomePending,body:`<div class="workspace-status-card"><strong>${esc(parsed.collectionName||'EntoBox collection')}</strong><small>${parsed.specimens.length} specimens · ${parsed.boxes.length} boxes · ${parsed.locations.length} storage locations</small></div>${destructive?'<div class="destructive-note"><strong>The current browser workspace will be replaced.</strong><span>Download a backup first if you need to preserve it.</span></div><label class="replace-confirm"><input type="checkbox" id="restoreReplaceConfirm"><span>I understand that the current workspace will be replaced.</span></label>':''}`,foot:`${destructive?'<button class="btn" id="restoreCurrentBackup">⇩ Backup current data</button>':''}<span class="modal-spacer"></span><button class="btn" id="restoreCancelBtn">Cancel</button><button class="btn primary" id="confirmRestoreBtn">Restore</button>`});
    if($('#restoreCurrentBackup'))$('#restoreCurrentBackup').onclick=exportBackup;$('#restoreCancelBtn').onclick=()=>welcomePending?openWelcomeModal():closeModal();$('#confirmRestoreBtn').onclick=()=>{if(destructive&&!$('#restoreReplaceConfirm').checked)return toast('Please confirm replacement of the current workspace','warn');replaceWorkspace(parsed,'Backup restored');toast(`Backup restored: ${parsed.collectionName||'EntoBox collection'}`);};
  }

  async function restoreBackupFile(file) {
    if(!file)return;try{const parsed=validateBackupData(JSON.parse(await file.text()));previewRestoreBackup(parsed,{label:file.name});}catch(error){toast(error.message||'Could not restore this backup','error');if(welcomePending)setTimeout(openWelcomeModal,80);}
  }

  function openAbout() {
    showModal({eyebrow:'EntoBox V4 Beta',title:'About & data privacy',body:`<div class="privacy-grid"><div class="privacy-card"><strong>Local-first storage</strong><small>Collection records and compressed image previews stay in this browser. EntoBox does not upload them to a server in this beta.</small></div><div class="privacy-card"><strong>Backups are essential</strong><small>Clearing site data, using another browser, or changing devices does not move the collection automatically. Export JSON backups regularly.</small></div><div class="privacy-card"><strong>Beta scope</strong><small>Designed for personal, teaching, and small institutional collection testing. It is not yet a replacement for a production museum CMS.</small></div><div class="privacy-card"><strong>Feedback privacy</strong><small>The feedback form adds version, browser, screen, and record counts only. It excludes specimen fields and photographs.</small></div></div><div class="local-first-note">Version ${APP_VERSION}. Cloud sync, institutional roles, AI identification, loans, and publication integrations are intentionally outside this beta.</div>`,foot:'<button class="btn" data-close-modal>Close</button><button class="btn primary" id="aboutBackupBtn">Download backup</button>'});$('#aboutBackupBtn').onclick=exportBackup;
  }

  function feedbackContext() {return {appVersion:APP_VERSION,createdAt:nowISO(),screen:currentView,editMode:state.preferences.editMode,browser:navigator.userAgent,viewport:`${window.innerWidth}×${window.innerHeight}`,counts:{specimens:state.specimens.length,boxes:state.boxes.length,locations:state.locations.length,alerts:activeCollectionAlerts().length},note:'No specimen fields or photographs are included.'};}

  function openFeedback() {
    showModal({eyebrow:'EntoBox beta feedback',title:'Tell us what happened',body:`<div class="form-grid"><div class="field"><label>Category</label><select id="feedbackCategory"><option>Bug</option><option>Confusing</option><option>Missing feature</option><option>Idea</option></select></div><div class="field full"><label>What were you trying to do?</label><textarea id="feedbackTrying"></textarea></div><div class="field full"><label>What happened?</label><textarea id="feedbackHappened"></textarea></div><div class="field full"><label>What did you expect?</label><textarea id="feedbackExpected"></textarea></div></div><div class="feedback-context">Technical context: <code>${esc(JSON.stringify(feedbackContext()))}</code></div>`,foot:'<button class="btn" data-close-modal>Cancel</button><button class="btn" id="feedbackDownload">Download JSON</button><button class="btn" id="feedbackCopy">Copy</button><button class="btn primary" id="feedbackGithub">Open GitHub issue</button>'});
    const payload=()=>({category:$('#feedbackCategory').value,trying:$('#feedbackTrying').value.trim(),happened:$('#feedbackHappened').value.trim(),expected:$('#feedbackExpected').value.trim(),context:feedbackContext()});const text=()=>JSON.stringify(payload(),null,2);
    $('#feedbackDownload').onclick=()=>downloadBlob(new Blob([text()],{type:'application/json'}),`entobox-feedback-${Date.now()}.json`);$('#feedbackCopy').onclick=async()=>{try{await navigator.clipboard.writeText(text());toast('Feedback copied');}catch{toast('Could not access the clipboard','warn');}};$('#feedbackGithub').onclick=()=>{const p=payload(),title=encodeURIComponent(`[V4 Beta] ${p.category}: ${p.trying||'Feedback'}`),body=encodeURIComponent(`### What I was trying to do\n${p.trying}\n\n### What happened\n${p.happened}\n\n### What I expected\n${p.expected}\n\n### Technical context\n\`\`\`json\n${JSON.stringify(p.context,null,2)}\n\`\`\``);window.open(`https://github.com/SaniyaSani/EntoBox/issues/new?title=${title}&body=${body}`,'_blank','noopener');};
  }

  function runBenchmark(size) {const names=['Carabus auratus','Rosalia alpina','Bombus pascuorum','Tachina fera','Unidentified specimen'];const data=Array.from({length:size},(_,i)=>({id:`test-${i}`,catalogNumber:`TEST-${String(i).padStart(6,'0')}`,scientificName:names[i%names.length],locality:`Locality ${i%200}`,x:i%100,y:(i*7)%100}));const t0=performance.now();const filtered=data.filter(x=>`${x.catalogNumber} ${x.scientificName} ${x.locality}`.toLowerCase().includes('carabus'));const searchMs=performance.now()-t0;const t1=performance.now();JSON.stringify(data);const jsonMs=performance.now()-t1;return {size,searchMs,jsonMs,matches:filtered.length};}

  function openDiagnostics() {
    showModal({eyebrow:'Beta diagnostics',title:'Local performance benchmark',body:`<div class="import-note">Runs entirely in memory and does not add records to your collection.</div><div class="action-stack"><button class="btn" data-benchmark="100">Run 100 records</button><button class="btn" data-benchmark="1000">Run 1,000 records</button><button class="btn primary" data-benchmark="10000">Run 10,000 records</button></div><div class="benchmark-results" id="benchmarkResults"></div>`,foot:'<button class="btn" data-close-modal>Close</button>'});$$('[data-benchmark]').forEach(b=>b.onclick=()=>{const result=runBenchmark(+b.dataset.benchmark),max=Math.max(result.searchMs,result.jsonMs,1);$('#benchmarkResults').insertAdjacentHTML('beforeend',`<div class="benchmark-row"><b>${result.size.toLocaleString()}</b><div><div class="benchmark-bar"><span style="width:${Math.min(100,max*5)}%"></span></div><small>Search ${result.searchMs.toFixed(2)} ms · JSON ${result.jsonMs.toFixed(2)} ms · ${result.matches} matches</small></div><strong>${(result.searchMs+result.jsonMs).toFixed(2)} ms</strong></div>`);});
  }

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
    if(!pendingImport||!currentBox())return toast('Open a box before importing records','warn');
    const rows=pendingImport.rows;let added=0,generated=0;pushHistory();
    try { localStorage.setItem(PRE_IMPORT_KEY, JSON.stringify({savedAt:nowISO(),state:deepClone(state)})); } catch {}
    for(const row of rows){
      let cat=String(mapped(row,'catalogNumber')??'').trim();if(!cat){cat=nextTemporaryNumber();generated++;}
      while(state.specimens.some(s=>String(s.catalogNumber||'').toLowerCase()===cat.toLowerCase()))cat=`${cat}-D${Math.floor(Math.random()*900+100)}`;
      const sizeKey=String(mapped(row,'sizeClass')||'m').trim().toLowerCase();const preset=sizePresets[sizeKey]||sizePresets.m;const w=Number(mapped(row,'footprintWidthMm'))||preset.w,h=Number(mapped(row,'footprintHeightMm'))||preset.h;
      const item=specimen({catalogNumber:cat,scientificName:String(mapped(row,'scientificName')||'Unidentified specimen').trim()||'Unidentified specimen',collectionCode:String(mapped(row,'collectionCode')||'').trim(),locality:String(mapped(row,'locality')||'').trim(),recordedBy:String(mapped(row,'recordedBy')||'').trim(),eventDate:excelDateToISO(mapped(row,'eventDate')),identifiedBy:String(mapped(row,'identifiedBy')||'').trim(),condition:String(mapped(row,'condition')||'Not assessed').trim(),notes:String(mapped(row,'notes')||'').trim(),targetBoxId:currentBox().id,footprintWidthMm:w,footprintHeightMm:h,placementStatus:'active'});
      state.specimens.push(item);recordActivity('import',item.id,`Imported to placement tray for ${currentBox().code}`,{file:pendingImport.fileName});added++;
    }
    state.meta.importedOnce=true;
    pendingImport=null;persist('Import saved');closeModal();renderAll();toast(`${added} records imported to the placement tray${generated?` · ${generated} temporary IDs generated`:''}`);
  }

  const tourSteps = [
    {
      title:'Your collection at a glance',
      text:'Home brings collection health, storage, unfinished work, and alerts into one overview. Every card is a shortcut into the underlying records.',
      selector:'#homeOverviewSection',
      prepare:()=>{currentView='home';state.preferences.navOpen=false;renderAll();}
    },
    {
      title:'Open a spatial box',
      text:'A box is a full-screen spatial workspace. The photograph, free-form pin positions, zones, and specimen cards all stay connected.',
      selector:'#boxStage',
      prepare:()=>{const box=currentBox()||state.boxes[0];if(box){state.selectedBoxId=box.id;currentView='workspace';state.preferences.navOpen=false;renderAll();}}
    },
    {
      title:'Browse safely, arrange deliberately',
      text:'Browse prevents accidental movement. Switch to Arrange only when placing records, moving pins, drawing zones, or changing the box photograph.',
      selector:'#editModeToggle',
      prepare:()=>{currentView='workspace';state.preferences.navOpen=false;state.preferences.editMode='browse';renderAll();}
    },
    {
      title:'Import and place spreadsheet records',
      text:'Open the Collection drawer, import Excel/CSV, filter or select records in the placement tray, then drag or auto-place them into this box.',
      selector:'#importBtn',
      prepare:()=>{currentView='workspace';state.preferences.navOpen=true;renderAll();}
    },
    {
      title:'Act on collection-care alerts',
      text:'Alerts link an issue to its specimen, box, and storage path. Open one to locate the object, document the response, and keep a resolution history.',
      selector:'#homeAlertsSection',
      prepare:()=>{currentView='home';state.preferences.navOpen=false;renderAll();}
    }
  ];

  function clearTourHighlight(){ $$('.tour-highlight').forEach(el=>el.classList.remove('tour-highlight')); }

  function positionTourCard(target) {
    const card=$('#tourCard'),focus=$('#tourFocus');if(!card||!focus||!target)return;
    const r=target.getBoundingClientRect(),pad=8;
    focus.style.left=`${Math.max(4,r.left-pad)}px`;focus.style.top=`${Math.max(4,r.top-pad)}px`;focus.style.width=`${Math.min(innerWidth-8,r.width+pad*2)}px`;focus.style.height=`${Math.min(innerHeight-8,r.height+pad*2)}px`;
    const cr=card.getBoundingClientRect(),gap=16;
    let left=clamp(r.right+gap,12,innerWidth-cr.width-12),top=clamp(r.top,12,innerHeight-cr.height-12);
    if(r.right+gap+cr.width>innerWidth-12){left=clamp(r.left,12,innerWidth-cr.width-12);top=clamp(r.bottom+gap,12,innerHeight-cr.height-12);}
    if(r.bottom+gap+cr.height>innerHeight-12&&r.top-cr.height-gap>12)top=r.top-cr.height-gap;
    card.style.left=`${left}px`;card.style.top=`${top}px`;
  }

  function showTourStep(index) {
    tourStep=clamp(index,0,tourSteps.length-1);const step=tourSteps[tourStep];step.prepare?.();
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      clearTourHighlight();
      const target=$(step.selector)||$('#homeBrand');target?.classList.add('tour-highlight');target?.scrollIntoView?.({block:'center',inline:'center'});
      $('#tourOverlay').hidden=false;$('#tourStepLabel').textContent=`Step ${tourStep+1} of ${tourSteps.length}`;$('#tourTitle').textContent=step.title;$('#tourText').textContent=step.text;$('#tourBackBtn').disabled=tourStep===0;$('#tourNextBtn').textContent=tourStep===tourSteps.length-1?'Finish':'Next';
      positionTourCard(target);
    }));
  }

  function startGuidedTour(){closeModal(true);showTourStep(0);}

  function finishGuidedTour({completed=true}={}) {
    clearTourHighlight();$('#tourOverlay').hidden=true;tourStep=-1;
    if(completed){state.meta.tourCompleted=true;persist('Tour completed');renderHome();toast('Guided tour completed');}
  }

  // Main UI bindings
  $('#homeBtn').onclick=()=>setView('home');
  $('#homeBrand').onclick=()=>setView('home');
  $('#aboutBtn').onclick=openAbout;
  $('#feedbackBtn').onclick=openFeedback;
  $('#exportBtn').onclick=exportBackup;
  $('#localBackupBtn').onclick=exportBackup;
  $('#saveStateLabel').onclick=openAbout;
  $('#addSpecimenBtn').onclick=()=>currentBox()?openAddSpecimen():openStorageCreateMenu(null);

  $('#homeOpenCurrentBoxBtn').onclick=()=>currentBox()?openBoxWorkspace(currentBox().id):openStorageCreateMenu(null);
  $('#homeCollectionSetupBtn').onclick=openCollectionSetup;
  $('#homeStartOwnBtn').onclick=()=>openNewCollectionWizard();
  $('#homeManageStorageBtn').onclick=()=>{if(!currentBox()&&!state.locations.length)return openStorageCreateMenu(null);currentView='workspace';state.preferences.navOpen=true;persist();renderAll();};
  $('#homeOpenStructureBtn').onclick=()=>{currentView='workspace';state.preferences.navOpen=true;persist();renderAll();};
  $('#homeCreateStorageBtn').onclick=()=>openStorageCreateMenu(null);
  $('#homeShowAllAlertsBtn').onclick=()=>openAlertsCenter();
  $('#startTourBtn').onclick=startGuidedTour;
  $('#hideGettingStartedBtn').onclick=()=>{state.preferences.gettingStartedHidden=true;persist('Checklist hidden');renderHome();};
  $$('[data-home-jump]').forEach(button=>button.onclick=()=>{
    const target=button.dataset.homeJump;
    if(target==='alerts')return openAlertsCenter();
    if(target==='boxes')return scrollHomeTo('homeOverviewSection');
    if(target==='storage'){currentView='workspace';state.preferences.navOpen=true;persist();return renderAll();}
    if(target==='specimens')return openCollectionRecords('all');
    if(target==='unidentified')return openCollectionRecords('unidentified');
    if(target==='unplaced')return openCollectionRecords('unplaced');
  });

  $('#alertsBackHomeBtn').onclick=()=>setView('home');
  $('#newGeneralAlertBtn').onclick=()=>openAlertForm();
  for(const id of ['alertsSearch','alertsStatusFilter','alertsTypeFilter','alertsSeverityFilter']){const el=$(`#${id}`);if(el)el[id==='alertsSearch'?'oninput':'onchange']=renderAlertsCenter;}

  $('#collectionNavBtn').onclick=()=>setNavigationOpen(!state.preferences.navOpen);
  $('#currentBoxChip').onclick=()=>setNavigationOpen(true);
  $('#drawerHandle').onclick=()=>setNavigationOpen(true);
  $('#closeCollectionNavBtn').onclick=()=>setNavigationOpen(false);
  $('#drawerBackdrop').onclick=()=>setNavigationOpen(false);
  $('#structureSearch').oninput=renderBoxes;
  $('#undoBtn').onclick=undo;
  $('#newBoxBtn').onclick=()=>openStorageCreateMenu(currentSuggestedParent());
  $('#importBtn').onclick=()=>currentBox()?$('#importFileInput').click():toast('Create or open a box before importing','warn');
  $('#queueSearch').oninput=renderQueue;
  $('#queueFilter').onchange=e=>{state.preferences.queueFilter=e.target.value;persist();renderQueue();};
  $('#queueSelectAll').onchange=e=>{for(const id of visibleQueueIds)e.target.checked?selectedQueueIds.add(id):selectedQueueIds.delete(id);renderQueue();};
  $$('[data-queue-view]').forEach(button=>button.onclick=()=>{state.preferences.queueView=button.dataset.queueView;persist();renderQueue();});
  $('#bulkSizeSelect').onchange=applyBulkSize;
  $('#bulkZoneSelect').onchange=e=>{if(!selectedQueueIds.size)return;pushHistory();for(const id of selectedQueueIds){const item=specimenById(id);if(item)item.preferredZoneId=e.target.value||null;}persist('Preferred zone saved');renderQueue();toast('Preferred zone applied');};
  $('#bulkAutoPlaceBtn').onclick=()=>autoPlace([...selectedQueueIds],$('#bulkZoneSelect').value||null);
  $('#bulkSkipBtn').onclick=skipSelectedQueue;
  $('#finishPlacementBtn').onclick=finishPlacementSession;

  $$('[data-edit-mode]').forEach(button=>button.onclick=()=>{const mode=button.dataset.editMode;state.preferences.editMode=mode;if(mode==='browse'){placingSpecimenId=null;tool='select';zoneDraftState=null;$('#zoneDraft').hidden=true;}persist(`${mode==='browse'?'Browse':'Arrange'} mode`);renderAll();});
  $$('[data-appearance]').forEach(b=>b.onclick=()=>{state.preferences.appearance=b.dataset.appearance;persist();renderAll();});
  $('#showZonesToggle').onchange=e=>{state.preferences.showZones=e.target.checked;persist();renderAll();};
  $('#showGridToggle').onchange=e=>{state.preferences.showGrid=e.target.checked;persist();renderAll();};
  $('#snapToggle').onchange=e=>{state.preferences.snap=e.target.checked;persist();renderAll();};
  $('#boxPhotoBtn').onclick=()=>{if(state.preferences.editMode!=='arrange')return toast('Switch to Arrange to change the box photograph','warn');$('#boxPhotoInput').click();};
  $('#newZoneBtn').onclick=startZoneTool;
  $('#fitBtn').onclick=fitBoxToScreen;
  $('#centerBtn').onclick=()=>centerBoxInView({behavior:'smooth'});
  $('#zoomRange').oninput=e=>setZoom(+e.target.value);
  $('#zoomOutBtn').onclick=()=>setZoom(state.preferences.zoom-10);
  $('#zoomInBtn').onclick=()=>setZoom(state.preferences.zoom+10);
  $('#zoom100Btn').onclick=()=>setZoom(100);
  $('#locateSelectedBtn').onclick=()=>locateSelectedSpecimen(true);
  $('#boxPhotoInput').onchange=e=>{handleBoxPhoto(e.target.files[0]);e.target.value='';};
  $('#importFileInput').onchange=e=>{if(e.target.files[0])loadSpreadsheet(e.target.files[0]);e.target.value='';};
  $('#backupFileInput').onchange=e=>{const file=e.target.files[0];e.target.value='';if(file)restoreBackupFile(file);};
  $('#modalClose').onclick=()=>closeModal();
  $('#modalBackdrop').onclick=e=>{if(e.target===$('#modalBackdrop'))closeModal();};
  $$('.inspector-tabs button').forEach(b=>b.onclick=()=>{inspectorTab=b.dataset.inspectorTab;renderInspector();});

  $('#boxStage').onpointerdown=handleStagePointerDown;
  $('#boxStage').onpointermove=handleStagePointerMove;
  $('#boxStage').onpointerup=handleStagePointerUp;
  $('#boxStage').onpointercancel=()=>{zoneDraftState=null;$('#zoneDraft').hidden=true;};
  $('#boxStage').ondragover=e=>{if(state.preferences.editMode!=='arrange')return;e.preventDefault();$('#boxStage').classList.add('drag-target');e.dataTransfer.dropEffect='move';};
  $('#boxStage').ondragleave=e=>{if(!$('#boxStage').contains(e.relatedTarget))$('#boxStage').classList.remove('drag-target');};
  $('#boxStage').ondrop=e=>{e.preventDefault();$('#boxStage').classList.remove('drag-target');if(state.preferences.editMode!=='arrange')return toast('Switch to Arrange to place specimens','warn');const id=e.dataTransfer.getData('text/entobox-specimen');if(id){const p=pointFromEvent(e);placeSpecimenAt(id,p.x,p.y);}};
  $('#canvasScroll').addEventListener('pointerdown',startCanvasPan);
  $('#canvasScroll').addEventListener('pointermove',moveCanvasPan);
  $('#canvasScroll').addEventListener('pointerup',endCanvasPan);
  $('#canvasScroll').addEventListener('pointercancel',endCanvasPan);
  $('#canvasScroll').addEventListener('scroll',updateMinimapViewport,{passive:true});
  $('#canvasScroll').addEventListener('wheel',handleCanvasWheel,{passive:false});
  $('#minimapSurface').addEventListener('pointerdown',handleMinimapPointer);

  $('#tourSkipBtn').onclick=()=>finishGuidedTour({completed:false});
  $('#tourBackBtn').onclick=()=>showTourStep(tourStep-1);
  $('#tourNextBtn').onclick=()=>tourStep>=tourSteps.length-1?finishGuidedTour():showTourStep(tourStep+1);

  document.addEventListener('keydown',e=>{
    if(e.code==='Space'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||'')){spacePressed=true;$('#canvasScroll')?.classList.add('pan-ready');e.preventDefault();}
    if(e.key==='Escape'){if(tourStep>=0)return finishGuidedTour({completed:false});placingSpecimenId=null;tool='select';zoneDraftState=null;$('#zoneDraft').hidden=true;renderAll();}
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='z'){e.preventDefault();undo();}
  });
  document.addEventListener('keyup',e=>{if(e.code==='Space'){spacePressed=false;$('#canvasScroll')?.classList.remove('pan-ready');}});
  window.addEventListener('resize',()=>{updateMinimapViewport();if(tourStep>=0){const step=tourSteps[tourStep],target=$(step.selector)||$('#homeBrand');positionTourCard(target);}});

  renderAll();
  requestAnimationFrame(()=>fitBoxToScreen());
  requestAnimationFrame(openWelcomeModal);
  if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
