// ===========================
// SUPABASE CONFIG
// ===========================
const SUPABASE_URL = 'https://vymnqnjlcdrcfkatypvf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bW5xbmpsY2RyY2ZrYXR5cHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTE1MzgsImV4cCI6MjA5NjU2NzUzOH0.0T8jpotynydNixbr2Gywqcv-bxfUhaVTslU3VddjZPw';

async function supabaseRequest(method, body = null, params = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/reparations${params}`, {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : ''
    },
    body: body ? JSON.stringify(body) : null
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return method === 'DELETE' ? null : res.json();
}


// ===========================
// RÉCUPÉRER LES DONNÉES DU FORMULAIRE
// ===========================
function getFormData() {
  return {
    date_saisie:      new Date().toLocaleDateString('fr-FR'),
    marque:           document.getElementById('marque').value,
    matricule:        document.getElementById('matricule').value,
    kilometrage:      document.getElementById('kilometrage').value,
    chauffeur:        document.getElementById('chauffeur').value,
    depart:           document.getElementById('depart').value,
    destination:      document.getElementById('destination').value,
    arrivee:          document.getElementById('arrivee').value,
    gazoil_prix:      document.getElementById('gazoil_prix').value,
    gazoil_lieu:      document.getElementById('gazoil_lieu').value,
    nature_piece:     document.getElementById('nature_piece').value,
    prix_achat:       document.getElementById('prix_achat').value,
    date_achat:       document.getElementById('date_achat').value,
    nature_entretien: document.getElementById('nature_entretien').value,
    prix_entretien:   document.getElementById('prix_entretien').value,
    date_entretien:   document.getElementById('date_entretien').value,
    notes:            document.getElementById('notes').value
  };
}


// ===========================
// NOTIFICATION TOAST
// ===========================
function showToast(msg, success = true) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  toastMsg.textContent = msg;
  if (success) {
    toast.style.borderColor = 'rgba(0,212,170,0.3)';
    toast.style.color = 'var(--accent2)';
    toast.querySelector('i').className = 'ti ti-check';
  } else {
    toast.style.borderColor = 'rgba(255,107,107,0.3)';
    toast.style.color = 'var(--accent3)';
    toast.querySelector('i').className = 'ti ti-alert-triangle';
  }
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}


// ===========================
// ENREGISTRER (save Supabase uniquement)
// ===========================
async function enregistrer() {
  const data = getFormData();
  if (!data.marque || !data.matricule) {
    showToast('Veuillez remplir Marque et Matricule!', false);
    return;
  }
  try {
    showToast('Enregistrement en cours...', true);
    await supabaseRequest('POST', data);
    showToast('Enregistré avec succès! ✓', true);
  } catch (e) {
    showToast('Erreur: ' + e.message, false);
  }
}


// ===========================
// IMPRIMER SEULEMENT (sans enregistrer)
// ===========================
function imprimerSeulement() {
  const data = getFormData();
  if (!data.marque || !data.matricule) {
    showToast('Veuillez remplir Marque et Matricule!', false);
    return;
  }
  remplirFiche(data);
  lancerImpression();
}


// ===========================
// REMPLIR LA FICHE D'IMPRESSION
// ===========================
function remplirFiche(data) {
  document.getElementById('p_marque').textContent           = data.marque || '-';
  document.getElementById('p_matricule').textContent        = data.matricule || '-';
  document.getElementById('p_chauffeur').textContent        = data.chauffeur || '-';
  document.getElementById('p_kilometrage').textContent      = data.kilometrage ? data.kilometrage + ' km' : '-';
  document.getElementById('p_depart').textContent           = data.depart || '-';
  document.getElementById('p_destination').textContent      = data.destination || '-';
  document.getElementById('p_arrivee').textContent          = data.arrivee || '-';
  document.getElementById('p_gazoil').textContent           = data.gazoil_prix ? data.gazoil_prix + ' MAD — ' + (data.gazoil_lieu || '') : '-';
  document.getElementById('p_nature_piece').textContent     = data.nature_piece || '-';
  document.getElementById('p_prix_achat').textContent       = data.prix_achat ? data.prix_achat + ' MAD' : '-';
  document.getElementById('p_date_achat').textContent       = data.date_achat || '-';
  document.getElementById('p_nature_entretien').textContent = data.nature_entretien || '-';
  document.getElementById('p_prix_entretien').textContent   = data.prix_entretien ? data.prix_entretien + ' MAD' : '-';
  document.getElementById('p_date_entretien').textContent   = data.date_entretien || '-';
  document.getElementById('p_notes').textContent            = data.notes || '-';
  document.getElementById('p_date_impression').textContent  = new Date().toLocaleDateString('fr-FR');
}


// ===========================
// LANCER L'IMPRESSION
// ===========================
function lancerImpression() {
  const printArea = document.getElementById('printArea');
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(el => {
    if (el.id !== 'printArea') el.style.setProperty('display', 'none', 'important');
  });
  printArea.style.setProperty('display', 'block', 'important');
  setTimeout(() => {
    window.print();
    setTimeout(() => {
      bodyChildren.forEach(el => {
        if (el.id !== 'printArea') el.style.display = '';
      });
      printArea.style.display = '';
    }, 500);
  }, 150);
  showToast('Impression lancée!');
}


// ===========================
// EFFACER LE FORMULAIRE
// ===========================
function clearForm() {
  const fields = [
    'marque', 'matricule', 'kilometrage', 'chauffeur',
    'depart', 'destination', 'arrivee',
    'gazoil_prix', 'gazoil_lieu',
    'nature_piece', 'prix_achat', 'date_achat',
    'nature_entretien', 'prix_entretien', 'date_entretien',
    'notes'
  ];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (el.tagName === 'SELECT') el.selectedIndex = 0;
      else el.value = '';
    }
  });
  showToast('Champs effacés');
}


// ===========================
// AFFICHER TABLEAU (depuis Supabase)
// ===========================
async function afficherExcel() {
  const overlay = document.getElementById('tableOverlay');
  const content = document.getElementById('tableContent');
  content.innerHTML = `<p class="no-data"><i class="ti ti-loader" style="font-size:24px;display:block;margin-bottom:8px;"></i>Chargement...</p>`;
  overlay.classList.add('show');

  try {
    const records = await supabaseRequest('GET', null, '?order=created_at.desc');

    if (!records || records.length === 0) {
      content.innerHTML = `<p class="no-data"><i class="ti ti-inbox" style="font-size:32px;display:block;margin-bottom:8px;"></i>Aucune donnée enregistrée</p>`;
      return;
    }

    const cols = [
      ['date_saisie',      'Date'],
      ['marque',           'Marque'],
      ['matricule',        'Matricule'],
      ['chauffeur',        'Chauffeur'],
      ['kilometrage',      'KM'],
      ['depart',           'Départ'],
      ['arrivee',          'Arrivée'],
      ['gazoil_prix',      'Gazoil (MAD)'],
      ['nature_piece',     'Pièce'],
      ['prix_achat',       'Prix P. (MAD)'],
      ['nature_entretien', 'Entretien'],
      ['prix_entretien',   'Prix E. (MAD)'],
      ['notes',            'Notes']
    ];

    let html = '<table><thead><tr>';
    cols.forEach(([, label]) => { html += `<th>${label}</th>`; });
    html += '</tr></thead><tbody>';

    records.forEach(r => {
      html += '<tr>';
      cols.forEach(([key]) => {
        let val = r[key] || '—';
        if (key === 'nature_piece' && val !== '—')
          val = `<span class="badge badge-purple">${val}</span>`;
        if (key === 'nature_entretien' && val !== '—')
          val = `<span class="badge badge-teal">${val}</span>`;
        html += `<td>${val}</td>`;
      });
      html += '</tr>';
    });

    html += '</tbody></table>';
    content.innerHTML = html;
  } catch (e) {
    content.innerHTML = `<p class="no-data" style="color:var(--accent3);">Erreur chargement: ${e.message}</p>`;
  }
}


// ===========================
// FERMER LE TABLEAU
// ===========================
function closeTable() {
  document.getElementById('tableOverlay').classList.remove('show');
}

document.getElementById('tableOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeTable();
});


// ===========================
// EXPORTER EN EXCEL (.xls) depuis Supabase
// ===========================
async function exportCSV() {
  try {
    const records = await supabaseRequest('GET', null, '?order=created_at.desc');
    if (!records || records.length === 0) {
      showToast('Aucune donnée à exporter', false);
      return;
    }

    const cols = [
      ['date_saisie',      'Date Saisie'],
      ['marque',           'Marque'],
      ['matricule',        'Matricule'],
      ['kilometrage',      'Kilométrage'],
      ['chauffeur',        'Chauffeur'],
      ['depart',           'Départ'],
      ['destination',      'Destination'],
      ['arrivee',          'Arrivée'],
      ['gazoil_prix',      'Gazoil (MAD)'],
      ['gazoil_lieu',      'Gazoil Lieu'],
      ['nature_piece',     'Nature Pièce'],
      ['prix_achat',       'Prix Achat (MAD)'],
      ['date_achat',       'Date Achat'],
      ['nature_entretien', 'Nature Entretien'],
      ['prix_entretien',   'Prix Entretien (MAD)'],
      ['date_entretien',   'Date Entretien'],
      ['notes',            'Notes']
    ];

    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8">
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>
      <x:ExcelWorksheet><x:Name>Réparations</x:Name>
      <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
      </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      </head><body><table border="1">`;

    html += '<tr style="background:#1e213a;color:#ffffff;font-weight:bold;">';
    cols.forEach(([, label]) => {
      html += `<td style="padding:6px 10px;white-space:nowrap;">${label}</td>`;
    });
    html += '</tr>';

    records.forEach((r, i) => {
      const bg = i % 2 === 0 ? '#ffffff' : '#f0f4ff';
      html += `<tr style="background:${bg};">`;
      cols.forEach(([key]) => {
        const val = (r[key] || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html += `<td style="padding:5px 10px;">${val}</td>`;
      });
      html += '</tr>';
    });

    html += '</table></body></html>';

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reparations_${new Date().toISOString().slice(0, 10)}.xls`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export Excel réussi! ✓');
  } catch (e) {
    showToast('Erreur export: ' + e.message, false);
  }
}


// ===========================
// QUITTER LE FORMULAIRE
// ===========================
function quitForm() {
  if (!confirm('Voulez-vous vraiment quitter le formulaire?')) return;
  const modal = document.querySelector('.modal');
  modal.style.opacity = '0';
  modal.style.transform = 'scale(0.95)';
  modal.style.transition = 'all 0.3s';
  setTimeout(() => {
    document.body.innerHTML = `
      <div style="color:#8b8fa8;font-family:sans-serif;text-align:center;margin-top:40vh;font-size:14px;">
        Formulaire fermé. Actualisez la page pour recommencer.
      </div>`;
  }, 300);
}