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

function vai(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}
function mostraSub(s) {
    document.getElementById('sub-forn').classList.toggle('hidden', s !== 'forn');
    document.getElementById('sub-cli').classList.toggle('hidden', s !== 'cli');
}
function apriKey() {
    const k = prompt('Incolla la tua chiave gratuita Google AI Studio:', localStorage.getItem('g_key') || '');
    if (k !== null) localStorage.setItem('g_key', k.trim());
}

function render() {
    document.getElementById('tot-home').innerText = incassi[0].euro.toFixed(2) + ' €';
    document.getElementById('lista-home').innerHTML = incassi.map(i => `<div class="p-2 bg-slate-50 rounded-xl flex justify-between"><span>${i.data}<br><small class="text-slate-400">${i.note}</small></span><b>${i.euro.toFixed(2)} €</b></div>`).join('');
    document.getElementById('lista-ordini').innerHTML = ordini.map(o => `<div class="p-3 bg-white rounded-xl border text-sm"><b>🐟 ${o.prod}</b><p class="text-xs text-slate-500">${o.note}</p></div>`).join('');
    document.getElementById('lista-clienti').innerHTML = clienti.map(c => `<div class="p-3 bg-white rounded-xl border text-sm"><span class="text-xs font-bold text-orange-600">${c.nome}</span><p class="font-bold">${c.cosa}</p><p class="text-xs text-slate-500">${c.note}</p>${c.foto ? `<img src="${c.foto}" class="mt-2 max-h-32 rounded border">` : ''}</div>`).join('');
    document.getElementById('lista-inv').innerHTML = inv.map(v => `<div class="p-3 bg-white rounded-xl border text-sm"><span class="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold">${v.tipo}</span><p class="font-bold mt-1">${v.prod}</p><p class="text-xs text-slate-500">${v.note}</p></div>`).join('');
    
    const gg = ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'];
    document.getElementById('giorni-bar').innerHTML = gg.map(g => `<button onclick="giornoAttivo='${g}';render()" class="py-2 rounded-lg text-xs font-bold ${g===giornoAttivo?'bg-sky-600 text-white':'bg-white'}">${g}</button>`).join('');
    document.getElementById('titolo-giorno').innerText = 'Turni ' + giornoAttivo;
    document.getElementById('lista-turni').innerHTML = (turni[giornoAttivo]||[]).map(t => `<div class="p-2.5 bg-sky-50 rounded-xl text-sm font-medium">👤 ${t}</div>`).join('');
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

async function chiamaAI(file, promptTxt) {
    const key = localStorage.getItem('g_key');
    if (!key) { alert('Clicca sull\'ingranaggio in alto e inserisci la chiave Google AI!'); return null; }
    return new Promise(res => {
        const r = new FileReader();
        r.onload = async e => {
            const url = e.target.result;
            const b64 = url.split(',')[1];
            const resp = await fetch(`https://googleapis.com{key}`, {
                method: 'POST', headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ contents: [{ parts: [{ text: promptTxt }, { inline_data: { mime_type: file.type || 'image/jpeg', data: b64 } }] }] })
            });
            const d = await resp.json();
            const txt = d.candidates[0].content.parts[0].text.replace(/```json|```/g,'').trim();
            res({ dati: JSON.parse(txt), foto: url });
        };
        r.readAsDataURL(file);
    });
}

async function fotoIncasso(ev) {
    const r = await chiamaAI(ev.target.files[0], 'Trova data e riga 16 PESCE (Totale Vendite). Rispondi SOLO JSON: {"data":"GG/MM/AAAA","euro":1234.56,"note":"Da foto"}');
    if (r) { incassi.unshift(r.dati); render(); alert('Incasso caricato!'); }
}
async function fotoOrdine(ev) {
    const r = await chiamaAI(ev.target.files[0], 'Estrai articoli ordine. Rispondi SOLO array JSON: [{"prod":"Nome e Qta","note":"Da foto"}]');
    if (r) { r.dati.forEach(x => ordini.unshift(x)); render(); alert('Ordine caricato!'); }
}
async function fotoPostit(ev) {
    const r = await chiamaAI(ev.target.files[0], 'Trascrivi post-it cliente. Rispondi SOLO JSON: {"nome":"Cliente e giorno","cosa":"Prodotti","note":"Note"}');
    if (r) { clienti.unshift({ ...r.dati, foto: r.foto }); render(); alert('Post-it salvato!'); }
}
async function fotoTurni(ev) {
    const r = await chiamaAI(ev.target.files[0], 'Estrai turni lavorativi (ignora L, FER, MAL). Rispondi SOLO JSON: {"Lun":["Nome 06:00-12:00"],"Mar":[],"Mer":[],"Gio":[],"Ven":[],"Sab":[],"Dom":[]}');
    if (r) { turni = r.dati; render(); alert('Turni aggiornati!'); }
}

render();
