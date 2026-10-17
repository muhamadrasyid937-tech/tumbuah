/* TUMBUAH prototype modules v1.0 — offline-first, no third-party dependencies */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const STORE = {
    missions: 'tumbuah.ar.missions.v1',
    cultureDrafts: 'tumbuah.culture.drafts.v1',
    audioRequests: 'tumbuah.audio.requests.v1',
    assessments: 'tumbuah.evaluation.results.v1'
  };
  const state = { culture: [], cultureFilter: 'Semua', cultureQuery: '', audioQuery: '', arStream: null, activeEval: 'pre', evalQuestionIndex: 0, evalAnswers: {}, evalFeedback: null };
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = (name, extra='') => `<svg class="ui-icon ${extra}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;
  function safeRead(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (_) { return fallback; } }
  function safeWrite(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { toast('Penyimpanan lokal tidak tersedia atau ruang perangkat penuh.'); return false; } }
  let toastTimer = 0;
  function toast(message) { const node=$('prototypeToast'); if(!node) return; node.textContent=message; node.hidden=false; clearTimeout(toastTimer); toastTimer=setTimeout(()=>{node.hidden=true;},4200); }

  function showModal({eyebrow='TUMBUAH · INFORMASI', title='Informasi', content=''}) {
    const modal=$('prototypeModal'); if(!modal) return;
    $('prototypeModalEyebrow').textContent=eyebrow; $('prototypeModalTitle').textContent=title; $('prototypeModalContent').innerHTML=content; modal.hidden=false; document.body.classList.add('prototype-modal-open');
    const panel=modal.querySelector('.prototype-modal-panel'); if(panel) panel.focus({preventScroll:true});
  }
  function closeModal(){ const m=$('prototypeModal'); if(m) m.hidden=true; document.body.classList.remove('prototype-modal-open'); }
  document.addEventListener('click', e => { if(e.target.closest('[data-modal-close]')) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape'){closeModal();} });

  // Culture catalogue: data is stored locally and can be viewed offline after the shell is cached.
  const cultureFallback = [
    {id:'aksara-rejang',title:'Aksara Rejang / Kaganga',category:'Aksara & Naskah',summary:'Rujukan teknis mengenai blok karakter Rejang di Unicode.',status:'Rujukan awal',statusType:'reference',detail:['Katalog budaya lokal belum termuat. Coba buka aplikasi saat online sekali untuk menyimpan berkas data budaya ke cache.'],sources:[],icon:'script'},
  ];
  async function loadCulture() {
    const grid=$('prototypeCultureGrid'); if(!grid) return;
    try {
      const response=await fetch(new URL('./data/budaya.json', document.baseURI), {cache:'no-cache'});
      if(!response.ok) throw new Error('budaya data HTTP '+response.status);
      const data=await response.json();
      if(!Array.isArray(data)) throw new Error('Format katalog budaya tidak sesuai');
      state.culture=data;
    } catch (err) {
      state.culture=cultureFallback;
      console.warn('TUMBUAH: katalog budaya tidak dapat dimuat', err);
      toast('Katalog budaya belum dapat dimuat. Buka saat online, lalu coba lagi.');
    }
    renderCulture();
  }
  function coverClass(item) {
    if(item.category==='Aksara & Naskah') return 'cover-script';
    if(item.category==='Karya & Kerajinan') return 'cover-pattern';
    if(item.category==='Alam & Lingkungan') return 'cover-green';
    if(item.category==='Bahasa & Dialek') return 'cover-paper';
    return 'cover-green';
  }
  function coverArtwork(item,index) {
    if(item.icon==='script') return `<span class="culture-cover-glyph">ꤰ ꤱ ꤲ</span>`;
    const names={pattern:'palette',dance:'activity',ritual:'users',home:'house',language:'languages',leaf:'leaf',oral:'messages'};
    return `<span class="culture-cover-symbol">${icon(names[item.icon]||'book-open')}</span><span class="culture-cover-index">T-${String(index+1).padStart(2,'0')}</span>`;
  }
  function renderCulture() {
    const grid=$('prototypeCultureGrid'); if(!grid) return;
    const q=state.cultureQuery.toLowerCase().trim();
    const items=state.culture.filter(x => (state.cultureFilter==='Semua'||x.category===state.cultureFilter) && (!q || [x.title,x.category,x.summary,x.period].join(' ').toLowerCase().includes(q)));
    $('cultureResultCount').textContent=items.length;
    grid.innerHTML=items.length ? items.map((item,index)=>{
      const realIndex=state.culture.findIndex(x=>x.id===item.id);
      const sc=item.statusType==='reference'?'status-reference':item.statusType==='verified'?'status-verified':'status-review';
      const statusText=item.statusType==='reference'?'Ada rujukan':item.statusType==='verified'?'Terverifikasi':'Perlu tinjauan';
      return `<article class="prototype-culture-card"><button type="button" class="culture-card-open" data-culture-open="${esc(item.id)}" aria-label="Buka detail ${esc(item.title)}"><div class="culture-card-cover ${coverClass(item)}">${coverArtwork(item,realIndex)}</div><div class="prototype-culture-card-body"><span class="culture-category-label">${esc(item.category)}</span><h4>${esc(item.title)}</h4><p>${esc(item.summary)}</p><div class="culture-card-foot"><span class="culture-status-mini ${sc}">${statusText}</span><span class="culture-category-label">${esc(item.period||'Koleksi')}</span></div></div></button><button type="button" class="culture-card-read" data-culture-open="${esc(item.id)}">Baca ringkasan ${icon('arrow-up-right')}</button></article>`;
    }).join('') : `<div class="prototype-empty">${icon('search')} Tidak ada kartu yang cocok. Coba kata atau kategori lain.</div>`;
  }
  function openCultureDetail(id) {
    const item=state.culture.find(x=>x.id===id); if(!item) return;
    const paragraphs=(item.detail||[]).map(p=>`<p class="culture-detail-paragraph">${esc(p)}</p>`).join('');
    const sources=(item.sources||[]).length ? `<div class="culture-source-list"><h3>Rujukan yang digunakan</h3>${item.sources.map(s=>`<a class="culture-source-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${icon('external-link')}<span><strong>${esc(s.title)}</strong><small>${esc(s.label||'Sumber')}</small></span></a>`).join('')}</div>` : `<div class="form-notice">Belum ada sumber eksternal yang terhubung. Konten ini merupakan kerangka pengumpulan, bukan klaim informasi terverifikasi.</div>`;
    showModal({eyebrow:`INFO BUDAYA · ${item.category}`,title:item.title,content:`<div class="culture-detail-tags"><span>${esc(item.category)}</span><span>${esc(item.status||'Status belum ditetapkan')}</span></div>${paragraphs}<div class="form-notice">${esc(item.sourceNote||'Ringkasan perlu ditinjau oleh sumber dan komunitas terkait.')}</div>${sources}<div class="prototype-form-actions"><button class="btn btn-outline" type="button" onclick="openCultureContribution('${esc(item.id)}')">${icon('square-pen')} Usulkan koreksi / pelengkap</button></div>`});
  }
  document.addEventListener('click', e => {
    const filter=e.target.closest('[data-culture-filter]');
    if(filter){state.cultureFilter=filter.dataset.cultureFilter;document.querySelectorAll('[data-culture-filter]').forEach(b=>{const on=b===filter;b.classList.toggle('aktif',on);b.setAttribute('aria-pressed',String(on));});renderCulture();return;}
    const open=e.target.closest('[data-culture-open]'); if(open){openCultureDetail(open.dataset.cultureOpen);}
  });
  $('cultureSearch')?.addEventListener('input',e=>{state.cultureQuery=e.target.value;renderCulture();});

  window.openCultureContribution = function(contextId='') {
    const context=state.culture.find(x=>x.id===contextId);
    showModal({eyebrow:'KONTRIBUSI · DRAF LOKAL',title:'Usulkan informasi budaya',content:`<p class="culture-detail-paragraph">Usulan ini hanya disimpan sebagai draf di perangkatmu. Formulir belum terhubung ke server atau dikirim kepada pengelola TUMBUAH.</p><form class="prototype-form" id="cultureContributionForm"><label>Judul usulan<input name="title" required maxlength="120" value="${esc(context?context.title:'')}" placeholder="Contoh: istilah bagian rumah adat"></label><div class="prototype-form-grid"><label>Kategori<select name="category" required><option>Aksara & Naskah</option><option>Seni & Tradisi</option><option>Karya & Kerajinan</option><option>Bahasa & Dialek</option><option>Alam & Lingkungan</option><option>Rumah & Keseharian</option></select></label><label>Wilayah / komunitas<input name="region" maxlength="120" placeholder="Kabupaten/desa atau komunitas"></label></div><label>Ringkasan atau koreksi<textarea name="summary" required maxlength="1600" placeholder="Tulis uraian singkat beserta konteks pemakaiannya..."></textarea></label><label>Sumber / narasumber (jika ada)<input name="source" maxlength="240" placeholder="Nama publikasi atau keterangan narasumber"></label><label class="checkbox-line"><input type="checkbox" name="consent" required><span>Saya memahami bahwa usulan ini adalah draf lokal dan belum dipublikasikan. Informasi lisan memerlukan izin narasumber sebelum dibagikan.</span></label><div class="form-notice">Draf tidak otomatis terunggah. Setelah disimpan, kamu dapat mengunduh JSON untuk diberikan kepada pengelola secara manual.</div><div class="prototype-form-actions"><button type="button" class="btn btn-outline" data-modal-close>Batal</button><button class="btn btn-primary" type="submit">${icon('book-marked')} Simpan draf</button></div></form>`});
    $('cultureContributionForm')?.addEventListener('submit',e=>{
      e.preventDefault();const form=e.currentTarget;const fd=new FormData(form);const draft={id:'draft-'+Date.now(),contextId:contextId||null,title:String(fd.get('title')||'').trim(),category:String(fd.get('category')||''),region:String(fd.get('region')||'').trim(),summary:String(fd.get('summary')||'').trim(),source:String(fd.get('source')||'').trim(),createdAt:new Date().toISOString(),status:'Draf lokal — belum dikirim'};
      const drafts=safeRead(STORE.cultureDrafts,[]);drafts.unshift(draft);safeWrite(STORE.cultureDrafts,drafts);closeModal();showModal({eyebrow:'KONTRIBUSI · TERSIMPAN LOKAL',title:'Draf berhasil disimpan',content:`<div class="evaluation-feedback"><strong>${esc(draft.title)}</strong>Draf tersimpan di perangkat ini. Belum ada data yang dikirim ke server.</div><p class="culture-detail-paragraph">Kamu bisa mengunduh salinan draf ini untuk ditinjau bersama pengelola atau narasumber.</p><div class="prototype-form-actions"><button type="button" class="btn btn-primary" onclick="downloadLocalDraft('${esc(draft.id)}')">${icon('download')} Unduh draf JSON</button></div>`});
    });
  };
  window.downloadLocalDraft=function(id){const drafts=safeRead(STORE.cultureDrafts,[]);const item=drafts.find(d=>d.id===id);if(!item){toast('Draf tidak ditemukan di penyimpanan lokal.');return;}downloadJson(item,`tumbuah-draf-budaya-${id}.json`);};
  function downloadJson(data,filename){try{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}catch(_){toast('Browser tidak dapat menyiapkan unduhan pada perangkat ini.');}}

  // Audio catalogue — intentionally no synthesized voice pretending to be Rejang speaker audio.
  const AUDIO_WORDS=[
    {word:'bioa',meaning:'air',category:'Alam / kebutuhan harian',region:'Perlu konfirmasi penutur',source:'BERENDO · entri BR2155'},
    {word:'umeak',meaning:'rumah',category:'Rumah & keseharian',region:'Perlu konfirmasi penutur',source:'BERENDO · entri BR3258'},
    {word:'bungai',meaning:'bunga',category:'Alam',region:'Perlu konfirmasi penutur',source:'BERENDO · entri BR2201'},
    {word:'butau',meaning:'batu',category:'Alam',region:'Perlu konfirmasi penutur',source:'BERENDO · entri BR2207'},
    {word:'opoi',meaning:'api',category:'Alam',region:'Perlu konfirmasi penutur',source:'BERENDO · entri BR2840'},
    {word:'anak',meaning:'anak',category:'Keluarga',region:'Perlu konfirmasi penutur',source:'BERENDO · entri BR2024'},
    {word:'poi',meaning:'padi',category:'Keseharian',region:'Perlu konfirmasi penutur',source:'BERENDO · entri BR2916'}
  ];
  function renderAudioWords(){const host=$('audioWordList');if(!host)return;const q=state.audioQuery.toLowerCase().trim();const rows=AUDIO_WORDS.filter(x=>[x.word,x.meaning,x.category].join(' ').toLowerCase().includes(q));host.innerHTML=rows.length?rows.map(item=>`<article class="audio-word-item"><div class="audio-word-main"><strong>${esc(item.meaning)}</strong><small>${esc(item.word)} · ${esc(item.category)}</small><div class="audio-word-meta"><span class="audio-entry-status">${icon('clock')} Rekaman belum tersedia</span><span class="culture-category-label">${esc(item.region)}</span></div><small>${esc(item.source)} · Aksara di bawah memakai pratinjau konverter aplikasi</small><div class="audio-word-script" data-latin="${esc(item.word)}">—</div></div><div class="audio-word-actions"><button type="button" class="audio-open-info" data-audio-unavailable="${esc(item.word)}">${icon('volume-2')} Coba audio <span aria-hidden="true">·</span> Info</button><button type="button" class="audio-open-info" data-audio-request="${esc(item.word)}">${icon('mic')} Prioritaskan</button></div></article>`).join(''):`<div class="prototype-empty">${icon('search')} Tidak ada kata yang cocok dengan pencarianmu.</div>`;
    host.querySelectorAll('[data-latin]').forEach(el=>{try{el.textContent=typeof window.toKaganga==='function'?window.toKaganga(el.dataset.latin):'Aksara belum tersedia';}catch(_){el.textContent='Aksara belum tersedia';}});
  }
  $('audioSearch')?.addEventListener('input',e=>{state.audioQuery=e.target.value;renderAudioWords();});
  window.showAudioUnavailable = function(word){showModal({eyebrow:'AUDIO PENUTUR · TAHAP PENGEMBANGAN',title:'Rekaman belum tersedia',content:`<div class="audio-unavailable-card">${icon('headphones')}<div><strong>${esc(word)}</strong><p>Audio asli penutur belum tersedia pada prototipe ini. Tombol ini tidak memutar suara sintetis agar aplikasi tidak menampilkan pelafalan yang keliru sebagai suara Bahasa Rejang.</p></div></div><p class="culture-detail-paragraph">Langkah berikutnya adalah mendapatkan rekaman yang diizinkan, mencatat label dialek, lalu memeriksa pelafalan bersama penutur yang kompeten.</p><div class="prototype-form-actions"><button type="button" class="btn btn-primary" onclick="openAudioRequest('${esc(word)}')">${icon('mic')} Catat kebutuhan kata ini</button></div>`});};
  window.openAudioRequest=function(word='') {showModal({eyebrow:'KATALOG AUDIO · DRAF LOKAL',title:'Prioritas rekaman penutur',content:`<p class="culture-detail-paragraph">Pilih kata yang ingin diprioritaskan untuk rekaman. Catatan ini tersimpan di perangkat, tidak dikirim otomatis ke mana pun.</p><form id="audioRequestForm" class="prototype-form"><label>Kata / makna<input name="word" required maxlength="120" value="${esc(word)}" placeholder="Contoh: bioa — air"></label><label>Catatan kebutuhan<textarea name="note" maxlength="600" placeholder="Dialek, konteks penggunaan, atau kebutuhan audio..."></textarea></label><div class="form-notice">Belum ada layanan pengiriman kontribusi. Catatan ini hanya membantu membuat daftar kebutuhan lokal pada prototipe.</div><div class="prototype-form-actions"><button type="button" class="btn btn-outline" data-modal-close>Batal</button><button type="submit" class="btn btn-primary">${icon('book-marked')} Simpan prioritas</button></div></form>`});$('audioRequestForm')?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const list=safeRead(STORE.audioRequests,[]);list.unshift({word:String(fd.get('word')||'').trim(),note:String(fd.get('note')||'').trim(),createdAt:new Date().toISOString(),status:'Lokal saja — belum dikirim'});safeWrite(STORE.audioRequests,list);closeModal();toast('Prioritas audio disimpan di perangkat ini, belum dikirim.');});};
  document.addEventListener('click',e=>{const b=e.target.closest('[data-audio-unavailable]');if(b){showAudioUnavailable(b.dataset.audioUnavailable);return;}const req=e.target.closest('[data-audio-request]');if(req){openAudioRequest(req.dataset.audioRequest);}});

  // Real camera preview + manual overlay demo. Marker recognition and spatial tracking are not implemented.
  const AR_OBJECTS={
    bioa:{word:'bioa',meaning:'air',category:'Kebutuhan harian',note:'Entri kamus BERENDO · BR2155'},
    umeak:{word:'umeak',meaning:'rumah',category:'Rumah & keseharian',note:'Entri kamus BERENDO · BR3258'},
    bungai:{word:'bungai',meaning:'bunga',category:'Alam',note:'Entri kamus BERENDO · BR2201'},
    butau:{word:'butau',meaning:'batu',category:'Alam',note:'Entri kamus BERENDO · BR2207'},
    opoi:{word:'opoi',meaning:'api',category:'Alam',note:'Entri kamus BERENDO · BR2840'}
  };
  function renderAROverlay(){const id=$('arObjectSelect')?.value||'bioa';const item=AR_OBJECTS[id]||AR_OBJECTS.bioa;$('arOverlayMeaning').textContent=item.meaning;$('arOverlayWord').textContent=item.word;try{$('arOverlayScript').textContent=typeof window.toKaganga==='function'?window.toKaganga(item.word):'Aksara belum tersedia';}catch(_){$('arOverlayScript').textContent='Aksara belum tersedia';}$('arOverlayMeta').textContent=`${item.category} · ${item.note}`;}
  function setARState(on,text){const pill=$('arCameraState');if(pill){pill.classList.toggle('is-on',on);pill.innerHTML=`<span></span>${esc(text)}`;}}
  async function startCamera(){
    if(!navigator.mediaDevices?.getUserMedia){toast('Browser ini tidak menyediakan akses kamera. Gunakan mode kartu demo.');return;}
    try{
      stopCamera(false);
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});
      state.arStream=stream;const video=$('arVideo');video.srcObject=stream;video.hidden=false;$('arViewfinder').classList.add('camera-active');$('arFallbackScene').hidden=true;$('arStartCamera').disabled=true;$('arStopCamera').disabled=false;$('arCameraLabel').innerHTML=`<span class="status-led"></span> KAMERA AKTIF · OVERLAY MANUAL DEMO`; $('arViewfinderHint').textContent='Arahkan kamera ke benda apa pun, lalu tampilkan overlay demo secara manual. Marker tidak dideteksi otomatis.';setARState(true,'Kamera aktif · demo');toast('Kamera aktif. Overlay masih dipilih manual, bukan hasil deteksi otomatis.');
    }catch(err){console.warn('TUMBUAH camera preview:',err);let msg='Kamera tidak dapat dibuka.';if(err?.name==='NotAllowedError')msg='Izin kamera ditolak. Aktifkan izin kamera di pengaturan browser atau gunakan kartu demo.';else if(err?.name==='NotFoundError')msg='Kamera tidak ditemukan. Gunakan kartu demo.';else if(location.protocol!=='https:'&&location.hostname!=='localhost')msg='Kamera membutuhkan HTTPS. Buka dari GitHub Pages atau gunakan kartu demo.';toast(msg);setARState(false,'Kamera belum aktif');}
  }
  function stopCamera(update=true){if(state.arStream){state.arStream.getTracks().forEach(t=>t.stop());state.arStream=null;}const v=$('arVideo');if(v){v.pause?.();v.srcObject=null;v.hidden=true;}const vf=$('arViewfinder');if(vf){vf.classList.remove('camera-active');vf.classList.remove('overlay-active');}if($('arFallbackScene'))$('arFallbackScene').hidden=false;if($('arStartCamera'))$('arStartCamera').disabled=false;if($('arStopCamera'))$('arStopCamera').disabled=true;if($('arOverlayCard'))$('arOverlayCard').hidden=true;if($('arCameraLabel'))$('arCameraLabel').innerHTML='<span class="status-led"></span> PRATINJAU DEMO · KAMERA BELUM AKTIF';if($('arViewfinderHint'))$('arViewfinderHint').textContent='Pilih “Mode kartu demo” untuk menampilkan contoh overlay tanpa kamera.';if(update)setARState(false,'Kamera belum aktif');}
  $('arStartCamera')?.addEventListener('click',startCamera);$('arStopCamera')?.addEventListener('click',()=>stopCamera());
  $('arDemoMode')?.addEventListener('click',()=>{stopCamera(false);$('arFallbackScene').hidden=false;$('arCameraLabel').innerHTML='<span class="status-led"></span> MODE KARTU DEMO · OFFLINE';$('arViewfinderHint').textContent='Kartu visual contoh dibuat di perangkat. Tidak memakai pengenalan kamera.';setARState(false,'Mode kartu demo');toast('Mode demo aktif; aman digunakan tanpa internet.');});
  $('arShowOverlay')?.addEventListener('click',()=>{renderAROverlay();$('arOverlayCard').hidden=false;$('arViewfinder').classList.add('overlay-active');$('arViewfinderHint').textContent='Overlay manual tampil sebagai contoh konsep. Ini bukan deteksi marker atau AR otomatis.';if(!$('arViewfinder').classList.contains('camera-active'))$('arCameraLabel').innerHTML='<span class="status-led"></span> OVERLAY SIMULASI · TANPA KAMERA';toast('Overlay simulasi ditampilkan.');});
  $('arObjectSelect')?.addEventListener('change',()=>{renderAROverlay();if(!$('arOverlayCard').hidden)toast('Kata demo diperbarui.');});
  const missions=[
    {id:'m1',title:'Temukan atau bayangkan sumber air',word:'bioa',meaning:'air'},
    {id:'m2',title:'Kenali istilah untuk rumah',word:'umeak',meaning:'rumah'},
    {id:'m3',title:'Cari benda alam berbentuk batu',word:'butau',meaning:'batu'},
    {id:'m4',title:'Amati bunga di lingkungan sekitar',word:'bungai',meaning:'bunga'},
    {id:'m5',title:'Diskusikan nama api dengan anggota keluarga',word:'opoi',meaning:'api'}
  ];
  function renderMissions(){const host=$('missionList');if(!host)return;const done=safeRead(STORE.missions,[]);host.innerHTML=missions.map(m=>`<label class="mission-item ${done.includes(m.id)?'done':''}"><input type="checkbox" data-mission="${m.id}" ${done.includes(m.id)?'checked':''}><span>${esc(m.title)}</span><small>${esc(m.word)} · ${esc(m.meaning)}</small></label>`).join('');const count=missions.filter(m=>done.includes(m.id)).length;$('missionProgressText').textContent=`${count} dari ${missions.length} selesai`; $('missionProgressBar').style.width=`${count/missions.length*100}%`;}
  $('missionList')?.addEventListener('change',e=>{const input=e.target.closest('[data-mission]');if(!input)return;let done=safeRead(STORE.missions,[]);done=input.checked?[...new Set([...done,input.dataset.mission])]:done.filter(x=>x!==input.dataset.mission);safeWrite(STORE.missions,done);renderMissions();});
  $('resetMissions')?.addEventListener('click',()=>{safeWrite(STORE.missions,[]);renderMissions();toast('Progres misi demo direset pada perangkat ini.');});

  // Learning evaluation: demonstration questions and a draft SUS form; all results are local-only.
  const TESTS={
    pre:[
      {q:'Rentang blok Unicode untuk aksara Rejang adalah…',o:['U+A930–U+A95F','U+1200–U+12FF','U+0900–U+097F','U+0100–U+017F'],a:0,why:'Unicode Standard mencantumkan blok Rejang pada rentang U+A930–U+A95F.'},
      {q:'Dalam entri kamus prototipe, “bioa” dipadankan dengan…',o:['batu','air','rumah','bunga'],a:1,why:'Data lokal BERENDO yang disertakan dalam proyek memuat bioa — air (entri BR2155).'},
      {q:'Mengapa rekaman pelafalan harus menyertakan label dialek?',o:['Agar halaman lebih dekoratif','Agar bisa memverifikasi konteks dan variasi pelafalan','Agar semua dialek dianggap sama','Supaya tak perlu sumber'],a:1,why:'Label dialek membantu dokumentasi konteks; penetapannya perlu dikonfirmasi penutur.'},
      {q:'Jika sumber budaya belum ditinjau komunitas, status yang paling jujur adalah…',o:['Terverifikasi','Resmi untuk semua komunitas','Rujukan awal / perlu tinjauan','Tidak perlu sumber'],a:2,why:'Sumber publikasi awal tidak otomatis berarti telah diverifikasi oleh komunitas terkait.'},
      {q:'Bagian PWA yang membantu menyimpan halaman untuk akses offline adalah…',o:['Service Worker dan Cache Storage','Warna tema','Judul halaman saja','Ikon menu saja'],a:0,why:'Service Worker dapat mengatur strategi cache aset untuk akses luring.'}
    ],
    post:[
      {q:'Mengapa bentuk aksara Trace perlu divalidasi oleh penutur/ahli?',o:['Agar skornya selalu 100','Agar pola dan arah goresan tidak sekadar perkiraan desain','Agar halaman memakai warna marun','Agar kamera menyala'],a:1,why:'Konten latihan harus sesuai bentuk dan konvensi penulisan yang telah diperiksa.'},
      {q:'Apa yang harus dilakukan sebelum merekam dan mendistribusikan audio penutur?',o:['Mengganti dengan suara acak','Meminta izin dan mencatat dialek/sumber','Menghapus label dialek','Menyimpan tanpa atribusi'],a:1,why:'Izin penggunaan dan metadata sumber merupakan bagian dari dokumentasi audio.'},
      {q:'Kartu budaya yang bersumber dari artikel akademik sebaiknya…',o:['Langsung dianggap mewakili semua komunitas','Menyertakan rujukan dan batasan ringkasan','Tidak punya tanggal atau sumber','Dibuat tanpa konteks'],a:1,why:'Rujukan perlu terlihat dan klaim perlu dibatasi sesuai isi sumber.'},
      {q:'Mode demo AR pada prototipe ini…',o:['Mengenali semua benda otomatis','Menunjukkan overlay manual; deteksi marker masih tahap pengembangan','Mengganti kamera menjadi sensor 3D','Mengirim data ke server'],a:1,why:'Overlay dipilih manual untuk menggambarkan UI; computer vision belum diimplementasikan.'},
      {q:'Manakah praktik yang tepat untuk hasil evaluasi prototipe?',o:['Mengklaim hasil mewakili semua pengguna','Mencatat metode, batasan, dan persetujuan','Mengumpulkan nama tanpa alasan','Tidak mencatat versi aplikasi'],a:1,why:'Evaluasi perlu transparan mengenai metode, persetujuan, dan batasan sampel.'}
    ],
    retention:[
      {q:'Apa status audio penutur pada prototipe TUMBUAH saat ini?',o:['Semua kata memiliki audio terverifikasi','Rekaman belum tersedia di paket ini','Audio dibuat dari suara penutur asli secara otomatis','Tidak membutuhkan sumber'],a:1,why:'Audio penutur ditandai tahap pengembangan, tanpa suara sintetis yang disamarkan sebagai Rejang.'},
      {q:'Apakah daftar label wilayah kamus otomatis sama dengan klasifikasi dialektologi akademik?',o:['Ya, selalu sama','Tidak; klasifikasi perlu ditinjau berdasarkan sumber','Semua dialek selalu identik','Tidak ada perbedaan wilayah'],a:1,why:'Label administratif dan klasifikasi dialek akademik dapat berbeda dasar pengelompokannya.'},
      {q:'Apa tujuan tes retensi?',o:['Mengukur ingatan setelah jeda waktu','Mengukur ukuran file saja','Mengubah tema warna','Memeriksa kamera'],a:0,why:'Tes retensi memeriksa apa yang masih diingat setelah periode tertentu.'},
      {q:'Di mana hasil evaluasi pada prototipe ini disimpan?',o:['Secara otomatis di server publik','Di localStorage perangkat, tanpa pengiriman otomatis','Di layanan iklan','Tidak disimpan sama sekali'],a:1,why:'Hasil demo disimpan lokal dan bisa diekspor oleh pengguna.'},
      {q:'Agar data bahasa luring bisa diperbarui, aplikasi perlu…',o:['Sumber data dan alur cache/pembaruan yang terkelola','Menghapus semua berkas setiap buka','Mengandalkan internet setiap klik','Menyembunyikan tanggal data'],a:0,why:'Data lokal perlu struktur sumber dan strategi pembaruan yang eksplisit.'}
    ]
  };
  const SUS_PROMPTS=[
    'Saya ingin menggunakan TUMBUAH secara rutin.',
    'Saya merasa TUMBUAH memiliki kerumitan yang tidak perlu.',
    'Saya merasa TUMBUAH mudah digunakan.',
    'Saya memerlukan bantuan orang teknis untuk menggunakan TUMBUAH.',
    'Saya merasa fitur-fitur TUMBUAH terintegrasi dengan baik.',
    'Saya menemukan banyak ketidakkonsistenan dalam TUMBUAH.',
    'Saya membayangkan kebanyakan orang akan cepat mempelajari TUMBUAH.',
    'Saya merasa TUMBUAH merepotkan digunakan.',
    'Saya merasa percaya diri menggunakan TUMBUAH.',
    'Saya perlu banyak belajar sebelum dapat menggunakan TUMBUAH.'
  ];
  function getEvalData(){return safeRead(STORE.assessments,{tests:{},sus:null});}
  function setEvalData(data){safeWrite(STORE.assessments,data);}
  function renderEval(){const host=$('evaluationContent');if(!host)return;const mode=state.activeEval;document.querySelectorAll('[data-evaluation-mode]').forEach(b=>{const on=b.dataset.evaluationMode===mode;b.classList.toggle('aktif',on);b.setAttribute('aria-selected',String(on));});
    if(mode==='sus'){renderSus(host);return;}
    const questions=TESTS[mode]||TESTS.pre;const data=getEvalData();const saved=data.tests?.[mode];
    if(saved){host.innerHTML=`<div class="evaluation-module-head"><div><span class="section-eyebrow">HASIL LOKAL · ${mode==='pre'?'PRATES':mode==='post'?'PASCA TES':'RETENSI'}</span><h3>${mode==='pre'?'Prates pemahaman':mode==='post'?'Pascates pemahaman':'Tes retensi'}</h3><p>Hasil tersimpan di perangkat ini. Soal merupakan contoh prototipe, belum instrumen penelitian yang divalidasi.</p></div></div><div class="evaluation-feedback"><strong>Skor ${saved.score} / ${saved.total} (${Math.round(saved.score/saved.total*100)}%)</strong>Dikerjakan ${new Date(saved.completedAt).toLocaleString('id-ID')}. ${saved.score/saved.total>=.8?'Pemahaman pada soal contoh terlihat baik.':'Gunakan jawaban sebagai bahan diskusi dan ulangi setelah mempelajari materi.'}</div><div class="prototype-form-actions" style="margin-top:14px"><button type="button" class="btn btn-outline" id="retryEvaluation">Ulangi instrumen</button></div>`;return;}
    host.innerHTML=`<div class="evaluation-module-head"><div><span class="section-eyebrow">INSTRUMEN CONTOH · BELUM DIVALIDASI</span><h3>${mode==='pre'?'Prates pemahaman':mode==='post'?'Pascates pemahaman':'Tes retensi'}</h3><p>${mode==='pre'?'Isi sebelum memakai fitur belajar.':mode==='post'?'Isi setelah sesi belajar.':'Gunakan setelah jeda waktu yang ditetapkan dalam rencana evaluasi.'} Setiap jawaban dinilai lokal dan dapat diekspor; hasil ini belum mewakili penelitian.</p></div><span class="prototype-status status-demo">${questions.length} soal</span></div><form id="evaluationQuizForm">${questions.map((q,i)=>`<div class="evaluation-question"><h4>${i+1}. ${esc(q.q)}</h4><div class="evaluation-options">${q.o.map((o,j)=>`<label class="evaluation-option"><input type="radio" name="q${i}" value="${j}" required><span>${esc(o)}</span></label>`).join('')}</div></div>`).join('')}<div class="evaluation-quiz-actions"><span class="culture-category-label">Tidak meminta nama atau email</span><button type="submit" class="btn btn-primary">Periksa jawaban ${icon('arrow-up-right')}</button></div></form>`;
    $('evaluationQuizForm')?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);let score=0;const answers=questions.map((q,i)=>{const n=Number(fd.get('q'+i));const correct=n===q.a;if(correct)score++;return {question:q.q,answer:q.o[n],correct,explanation:q.why};});const result={score,total:questions.length,answers,completedAt:new Date().toISOString(),prototype:true};const all=getEvalData();all.tests=all.tests||{};all.tests[mode]=result;setEvalData(all);host.innerHTML=`<div class="evaluation-feedback"><strong>Skor ${score} / ${questions.length} (${Math.round(score/questions.length*100)}%)</strong>Ini hasil dari soal contoh untuk menguji alur antarmuka. Soal dan batas penilaian belum divalidasi sebagai instrumen penelitian.</div><div class="evaluation-review-list">${answers.map((a,i)=>`<div class="review-item ${a.correct?'is-correct':'is-incorrect'}"><span class="review-state">${a.correct?icon('circle-check'):icon('circle-x')}</span><div><strong>${i+1}. ${esc(a.question)}</strong><small>Jawabanmu: ${esc(a.answer)}. ${esc(a.explanation)}</small></div></div>`).join('')}</div><div class="prototype-form-actions" style="margin-top:14px"><button type="button" class="btn btn-outline" id="retryEvaluation">Ulangi instrumen</button></div>`;});
  }
  function renderSus(host){const data=getEvalData();const saved=data.sus; if(saved){host.innerHTML=`<div class="evaluation-module-head"><div><span class="section-eyebrow">HASIL SUS · LOKAL</span><h3>Skor kebergunaan</h3><p>Versi pernyataan ini merupakan draf bahasa Indonesia dan perlu diuji keterpahaman sebelum pengambilan data formal.</p></div></div><div class="evaluation-feedback"><strong>Skor SUS: ${saved.score.toFixed(1)} / 100</strong>Skor dihitung dari 10 butir skala 1–5. Ini skor uji coba pada perangkat ini, bukan hasil evaluasi peserta penelitian.</div><div class="prototype-form-actions" style="margin-top:14px"><button type="button" class="btn btn-outline" id="retryEvaluation">Isi ulang SUS</button></div>`;return;}
    host.innerHTML=`<div class="evaluation-module-head"><div><span class="section-eyebrow">SYSTEM USABILITY SCALE · DRAF</span><h3>Bagaimana pengalamanmu?</h3><p>Pilih satu tingkat persetujuan untuk setiap pernyataan. Instrumen ini hanya contoh UI; terjemahan dan prosedur perlu ditinjau sebelum digunakan dalam penelitian.</p></div><span class="prototype-status status-development">Draf SUS</span></div><form id="susForm"><div class="sus-list">${SUS_PROMPTS.map((p,i)=>`<div class="sus-item"><p>${i+1}. ${esc(p)}</p><div class="sus-options">${[1,2,3,4,5].map(n=>`<label><input type="radio" name="sus${i}" value="${n}" required><span>${n}</span><small>${n===1?'STS':n===2?'TS':n===3?'Netral':n===4?'S':'SS'}</small></label>`).join('')}</div></div>`).join('')}</div><div class="evaluation-quiz-actions"><span class="culture-category-label">STS = sangat tidak setuju · SS = sangat setuju</span><button type="submit" class="btn btn-primary">Hitung skor SUS</button></div></form>`;
    $('susForm')?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const values=SUS_PROMPTS.map((_,i)=>Number(fd.get('sus'+i)));let points=0;values.forEach((v,i)=>{points+=(i%2===0)?v-1:5-v;});const score=points*2.5;const all=getEvalData();all.sus={score,values,completedAt:new Date().toISOString(),prototype:true};setEvalData(all);renderSus(host);});
  }
  document.querySelectorAll('[data-evaluation-mode]').forEach(b=>b.addEventListener('click',()=>{state.activeEval=b.dataset.evaluationMode;renderEval();}));
  document.addEventListener('click',e=>{if(e.target.closest('#retryEvaluation')){const data=getEvalData();if(state.activeEval==='sus')data.sus=null;else{data.tests=data.tests||{};delete data.tests[state.activeEval];}setEvalData(data);renderEval();}});
  $('exportEvaluation')?.addEventListener('click',()=>{const data=getEvalData();downloadJson({application:'TUMBUAH',exportedAt:new Date().toISOString(),privacy:'Data ini disimpan lokal; ekspor dilakukan oleh pengguna.',results:data},'tumbuah-evaluasi-lokal.json');});
  $('clearEvaluation')?.addEventListener('click',()=>{if(confirm('Hapus seluruh hasil evaluasi TUMBUAH dari penyimpanan lokal pada perangkat ini?')){localStorage.removeItem(STORE.assessments);renderEval();toast('Hasil evaluasi lokal sudah dihapus.');}});

  // Add quick actions to current roadmap cards without pretending planned modules are complete.
  function enhanceRoadmapLinks(){
    document.querySelectorAll('.development-card').forEach(card=>{
      if(card.querySelector('.prototype-roadmap-link'))return;
      const t=(card.querySelector('h4')?.textContent||'').toLowerCase();let tab=null,label='Lihat prototipe';
      if(t.includes('audio')){tab='audio';label='Buka katalog audio';}
      else if(t.includes('ar')||t.includes('spatial')){tab='jelajah';label='Buka demo AR';}
      else if(t.includes('evaluasi')){tab='evaluasi';label='Buka evaluasi';}
      else if(t.includes('budaya')){tab='budaya';label='Buka katalog budaya';}
      if(tab){const a=document.createElement('button');a.type='button';a.className='prototype-roadmap-link';a.innerHTML=`${label} ${icon('arrow-up-right')}`;a.addEventListener('click',()=>{if(typeof window.gantiTab==='function')window.gantiTab(tab);});card.appendChild(a);}
    });
  }

  // Wrap the existing router to stop camera tracks when the AR section is left.
  const originalTab=window.gantiTab;
  if(typeof originalTab==='function'){
    window.gantiTab=function(id,btn){if(id!=='jelajah')stopCamera(false);const out=originalTab.call(this,id,btn);if(id==='budaya')renderCulture();if(id==='audio')renderAudioWords();if(id==='jelajah'){renderAROverlay();renderMissions();}if(id==='evaluasi')renderEval();return out;};
  }
  // When users open a new area through the drawer, the existing mobile router calls gantiTab;
  // this wrapper covers cleanup without touching the legacy dictionary/converter handlers.
  function init(){
    loadCulture();renderAudioWords();renderAROverlay();renderMissions();renderEval();enhanceRoadmapLinks();
    const hash=location.hash.match(/^#tab-(audio|jelajah|evaluasi)$/);if(hash&&typeof window.gantiTab==='function')window.gantiTab(hash[1]);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.addEventListener('pagehide',()=>stopCamera(false));
})();
