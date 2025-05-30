/* ---------- Globale Variablen ---------- */
let places = [];          // wird durch places.json initialisiert
let map;                  // Leaflet-Map-Instanz
const markers = [];       // Marker-Referenzen für Filter

const CustomIcon = L.Icon.extend({
  options: {
    iconUrl: 'static/marker.png',
    iconSize: [31, 42],
    iconAnchor: [16,40],
    popupAnchor: [0,-30],
  }
})

const customIcon = new CustomIcon()

/* ---------- App-Start ---------- */
function startApp() {
  map = L.map('map');
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap-Mitwirkende'
  }).addTo(map);

  /* Marker anlegen */
  places.forEach(p => {
    const parts = [
      `<b>${p.name}</b>`,
      p.type,
      (p.tags && p.tags.length) ? `<span class="popup-highlighted">${p.tags.join(', ')}</span>` : null,
      p.address || null,
      p.website ? `<a href="${p.website}" target="_blank" rel="noopener">Webseite</a>` : null
    ];
    const popupContent = parts.filter(Boolean).join('<br>');

    const m = L.marker(
      p.coords, 
      {
        icon: customIcon
      }
    )
    .bindPopup(popupContent);
    m.type = p.type;
    m.tags = p.tags;
    m.addTo(map);
    markers.push(m);
  });

  /* ---- Kartenausschnitt automatisch anpassen ---- */
  if (places.length === 1) {
    map.setView(places[0].coords, 15);
  } else {
    const bounds = L.latLngBounds(places.map(p => p.coords));
    map.fitBounds(bounds.pad(0.01));      // 5 % Rand
  }

  buildFilters();
}

/* ---------- Filter-Oberfläche ---------- */
function buildFilters() {
  const categories = [...new Set(places.map(p => p.category))].sort();
  const tags       = [...new Set(places.flatMap(p => p.tags))].sort();

  // Baue für jede Kategorie eine eigene Type-Section
  let html = '';
  categories.forEach(cat => {
    const typesForCat = [...new Set(
      places
        .filter(p => p.category === cat)
        .map(p => p.type)
    )].sort();
    html += buildSection(cat, typesForCat, 'type-filter', false);
  });

  // Danach die Tag-Section
  html += buildSection('Nachhaltigkeit', tags, 'tag-filter', false);

  // Rendern und Event-Handler binden
  const ctrl = document.getElementById('control-panel');
  ctrl.innerHTML = html;
  ctrl.addEventListener('change', updateFilters);
}

function buildSection(title, items, cssClass, checked) {
  return `
    <div class="filter-section">
      <h3>${title}</h3>
      <div class="filter-group">
        ${items.map(i => `
          <label>
            <input type="checkbox" class="${cssClass}" value="${i}" ${checked ? 'checked' : ''}>
            ${i}
          </label>`).join('')}
      </div>
    </div>`;
}

function updateFilters() {
  const activeTypes = [...document.querySelectorAll('.type-filter:checked')].map(cb => cb.value);
  const activeTags  = [...document.querySelectorAll('.tag-filter:checked')].map(cb => cb.value);

  markers.forEach(m => {
    const typeOk = activeTypes.length ===0 || activeTypes.includes(m.type);
    const tagOk  = activeTags.length === 0 || activeTags.every(t => m.tags.includes(t));
    if (typeOk && tagOk) {
      m.addTo(map);
    } else {
      map.removeLayer(m);
    }
  });
}

const toggleBtn = document.getElementById('panel-toggle');
const panel = document.querySelector('.control-panel');
toggleBtn.addEventListener('click', () => {
  panel.classList.toggle('hidden');
});

/* ---------- Daten laden & App starten ---------- */
fetch('places.json')
  .then(r => r.json())
  .then(data => { places = data; startApp(); })
  .catch(err => console.error('places.json konnte nicht geladen werden:', err));

