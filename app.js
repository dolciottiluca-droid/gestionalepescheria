let incassi = [
    { data: '11/11/2026', euro: 2572.50, note: '175 pz • 192 scontrini' },
    { data: '10/11/2026', euro: 3639.51, note: '203 pz • 258 scontrini' },
    { data: '09/11/2026', euro: 2130.79, note: '131 pz • 163 scontrini' },
    { data: '08/11/2026', euro: 641.23, note: '87 pz • 69 scontrini' }
];
let ordini = [{ prod: 'Orate e Branzini 18 Kg', note: 'Mercato Ittico' }];
let clienti = [{ nome: 'Sig.ra Bianchi - Sab 11:30', cosa: '1,5 Kg Vongole + 2 Spigole', note: 'Sfilettate', foto: null }];
let inv = [{ tipo: 'Scarto / Calo', prod: 'Pulizia filetti 3,2 Kg', note: 'Banco mattino' }];
let turni = {
    Lun: ['Andreoni I. 06:00-12:30', 'Orlando F. 11:30-16:30', 'Lafuente A. 16:30-21:00'],
    Mar: ['Orlando F. 06:00-10:00 / 11:00-14:30', 'Vico E. 06:00-12:30', 'Farinelli M. 17:00-20:00'],
    Mer: ['Vico E. 06:00-09:00 / 10:00-13:30', 'Lafuente A. 07:00-12:00', 'Farinelli M. 12:00-18:00'],
    Gio: ['Vico E. 06:00-10:30 / 11:30-14:30', 'Farinelli M. 06:00-11:30', 'Orlando F. 14:30-18:00'],
    Ven: ['Andreoni I. 06:30-12:30', 'Lafuente A. 12:30-17:00', 'Orlando F. 17:30-21:00'],
    Sab: ['Andreoni I. 06:00-12:00', 'Vico E. 12:00-17:00', 'Orlando F. 17:00-21:00'],
    Dom: ['Andreoni I. 08:00-11:30']
};
let giornoAttivo = 'Mer';

function vai(id, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}
function mostraSub(s) {
    document.getElementById('sub-forn').classList.toggle('hidden', s !== 'forn');
    document.getElementById('sub-cli').classList.toggle('hidden', s !== 'cli');
}
function apriKey() {
    const k = prompt('Incolla la tua chiave gratuita Google AI Studio:', localStorage.getItem('g_key') || '');
    if (k !== null && k.trim() !== '') {
        localStorage.setItem('g_key', k.trim());
        alert('✅ Chiave salvata!');
    }
}

function render() {
    const primoIncasso = incassi.at(0);
    if (primoIncasso) {
        document.getElementById('tot-home').innerText = Number(primoIncasso.euro).toLocaleString('it-IT', {minimumFractionDigits: 2}) + ' €';
    }
    document.getElementById('lista-home').innerHTML = incassi.map(i => `
        <div class="incasso-row">
            <div class="incasso-left">
                <div class="incasso-data">${i.data}</div>
                <div class="incasso-note">${i.note}</div>
            </div>
            <div class="incasso-right">${Number(i.euro).toLocaleString('it-IT', {minimumFractionDigits: 2})} €</div>
        </div>
    `).join('');

    document.getElementById('lista-ordini').innerHTML = ordini.map(o => `<div class="card"><strong>🐟 ${o.prod}</strong><p style="font-size:12px;color:#64748b;margin-top:4px;">${o.note}</p></div>`).join('');
    document.getElementById('lista-clienti').innerHTML = clienti.map(c => `<div class="card"><small style="color:#ea580c;font-weight:bold;">${c.nome}</small><p style="font-weight:bold;margin:4px 0;">${c.cosa}</p><p style="font-size:12px;color:#64748b;">${c.note}</p>${c.foto ? `<img src="${c.foto}" style="margin-top:8px;max-height:140px;border-radius:8px;">` : ''}</div>`).join('');
    document.getElementById('lista-inv').innerHTML = inv.map(v => `<div class="card"><small style="background:#ffe4e6;color:#be123c;padding:2px 6px;border-radius:6px;font-weight:bold;">${v.tipo}</small><p style="font-weight:bold;margin-top:6px;">${v.prod}</p><p style="font-size:12px;color:#64748b;">${v.note}</p></div>`).join('');
    
    const gg = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'];
    document.getElementById('giorni-bar').innerHTML = gg.map(g => `<button onclick="giornoAttivo='${g}';render()" class="day-btn ${g===giornoAttivo?'active':''}">${g}</button>`).join('');
    document.getElementById('titolo-giorno').innerText = 'Turni ' + giornoAttivo;
    const listaGiorno = turni[giornoAttivo] || [];
    document.getElementById('lista-turni').innerHTML = listaGiorno.map(t => `<div class="turno-item">👤 ${t}</div>`).join('');
}

function salvaIncasso() {
    const euro = parseFloat(document.getElementById('i-euro').value);
    if (!euro) return alert('Inserisci importo');
    incassi.unshift({ data: document.getElementById('i-data').value || 'Oggi', euro, note: document.getElementById('i-note').value });
    render(); alert('Salvato!');
}
function salvaOrdine() {
    const prod = document.getElementById('o-prod').value;
    if (!prod) return;
    ordini.unshift({ prod, note: document.getElementById('o-note').value });
    render();
}
function salvaCliente() {
    const nome = document.getElementById('c-nome').value;
    const cosa = document.getElementById('c-cosa').value;
    if (!nome || !cosa) return;
    clienti.unshift({ nome, cosa, note: document.getElementById('c-note').value, foto: null });
    render();
}
function salvaInv() {
    const prod = document.getElementById('v-prod').value;
    if (!prod) return;
    inv.unshift({ tipo: document.getElementById('v-tipo').value, prod, note: document.getElementById('v-note').value });
    render();
}

function riduciFoto(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const max = 1100;
                let w = img.width, h = img.height;
                if (w > max || h > max) {
                    if (w > h) { h = Math.round(h * max / w); w = max; }
                    else { w = Math.round(w * max / h); h = max; }
                }
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.75));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

async function chiamaAI(fileList, promptTxt) {
    const file = fileList ? fileList.item(0) : null;
    if (!file) return null;
    const key = localStorage.getItem('g_key');
    if (!key) { alert('⚠️ Clicca sull\'ingranaggio ⚙️ in alto a destra e inserisci prima la tua chiave Google AI Studio!'); return null; }
    
    document.body.style.opacity = '0.5';
    try {
        const url = await riduciFoto(file);
        const b64 = url.split(',').pop();
        const resp = await fetch('/.netlify/functions/leggi-foto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key, promptTxt, b64 })
        });
        const d = await resp.json();
        document.body.style.opacity = '1';
        if (d.error) {
            alert('❌ Risposta Google: ' + d.error.message);
            return null;
        }
        const primoCandidato = d.candidates.at(0);
        const primaParte = primoCandidato.content.parts.at(0);
        const txt = primaParte.text.replace(/```json|```/g,'').trim();
        return { dati: JSON.parse(txt), foto: url };
    } catch (err) {
        document.body.style.opacity = '1';
        alert('❌ Errore di rete: ' + err.message);
        return null;
    }
}

async function fotoIncasso(ev) {
    const r = await chiamaAI(ev.target.files, 'Analizza questo tabulato. Trova la data (Periodo) e la riga 16 PESCE (colonna Totale Vendite, numero con decimali, e Pezzi/Scontrini). Rispondi SOLO JSON valido: {"data":"GG/MM/AAAA","euro":1234.56,"note":"Da foto tabulato"}');
    if (r && r.dati) { incassi.unshift(r.dati); render(); vai('p-home'); alert('🐟 Incasso caricato: ' + r.dati.euro + ' €!'); }
    ev.target.value = '';
}
async function fotoOrdine(ev) {
    const r = await chiamaAI(ev.target.files, 'Estrai tutti gli articoli ordinati dalla foto. Rispondi SOLO array JSON valido: [{"prod":"Nome prodotto e quantità","note":"Fornitore o dettagli"}]');
    if (r && Array.isArray(r.dati)) { r.dati.forEach(x => ordini.unshift(x)); render(); alert('📦 Caricati ' + r.dati.length + ' articoli!'); }
    ev.target.value = '';
}
async function fotoPostit(ev) {
    const r = await chiamaAI(ev.target.files, 'Trascrivi questo post-it scritto a mano di un cliente. Rispondi SOLO JSON valido: {"nome":"Cliente e giorno ritiro","cosa":"Prodotti ordinati","note":"Note pulizia/lavorazione"}');
    if (r && r.dati) { clienti.unshift({ ...r.dati, foto: r.foto }); render(); alert('📝 Post-it salvato e trascritto!'); }
    ev.target.value = '';
}
async function fotoTurni(ev) {
    const r = await chiamaAI(ev.target.files, 'Leggi questa tabella settimanale dei turni (anche se ruotata o B/N). Estrai per ogni giorno SOLO chi lavora (ignora L, FER, MAL). Rispondi SOLO JSON valido: {"Lun":["Cognome N. 06:00-12:00"],"Mar":[],"Mer":[],"Gio":[],"Ven":[],"Sab":[],"Dom":[]}');
    if (r && r.dati) { turni = r.dati; render(); alert('👥 Turni della settimana aggiornati!'); }
    ev.target.value = '';
}

render();
