const manifest=window.BK_PHOTOS||[];document.querySelectorAll('[data-gallery]').forEach(g=>{const n=Number(g.dataset.gallery)||1000;g.innerHTML=manifest.slice(0,n).map((p,i)=>`<figure><a href="${p.url}" target="_blank" rel="noopener" aria-label="View original B and K cabin photograph ${i+1}"><img loading="lazy" alt="Original B and K Cabins Gloster Mississippi guest and recreation photo ${i+1}" src="${p.url}" onerror="this.closest('figure').style.display='none'"></a><figcaption>${p.category} • ${i+1}</figcaption></figure>`).join('')});

/* October 2026 photography: galleries + lightbox */
(function(){
  const all=window.BK_NEW_PHOTOS||[];
  if(!all.length)return;
  const byId=Object.fromEntries(all.map(p=>[p.id,p]));
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const pic=(p,eager)=>`<picture><source type="image/webp" srcset="${p.webp} 900w, ${p.src} ${p.w}w" sizes="(max-width:700px) 100vw, 50vw"><img src="${p.src}" alt="${esc(p.alt)}" width="${p.w}" height="${p.h}" ${eager?'':'loading="lazy" decoding="async"'}></picture>`;
  let current=[],idx=0;
  const box=document.createElement('dialog');
  box.className='lightbox';box.setAttribute('aria-label','Photo viewer');
  box.innerHTML='<button class="lb-close" aria-label="Close">×</button><button class="lb-prev" aria-label="Previous photo">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-next" aria-label="Next photo">›</button>';
  document.body.appendChild(box);
  const lbImg=box.querySelector('img'),lbCap=box.querySelector('figcaption');
  const show=i=>{idx=(i+current.length)%current.length;const p=current[idx];lbImg.src=p.src;lbImg.alt=p.alt;lbCap.textContent=p.caption+'  ·  '+(idx+1)+' / '+current.length};
  const open=(list,i)=>{current=list;show(i);if(box.showModal)box.showModal();else box.setAttribute('open','')};
  box.querySelector('.lb-close').onclick=()=>box.close();
  box.querySelector('.lb-prev').onclick=()=>show(idx-1);
  box.querySelector('.lb-next').onclick=()=>show(idx+1);
  box.addEventListener('click',e=>{if(e.target===box)box.close()});
  document.addEventListener('keydown',e=>{if(!box.open)return;if(e.key==='ArrowRight')show(idx+1);if(e.key==='ArrowLeft')show(idx-1)});
  let sx=null;box.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  box.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)show(idx+(dx<0?1:-1));sx=null});

  document.querySelectorAll('[data-new-photos]').forEach(el=>{
    const spec=el.dataset.newPhotos;
    const list=spec==='all'?all:spec.startsWith('group:')?all.filter(p=>spec.slice(6).split(',').includes(p.group)):spec.split(',').map(s=>byId[s.trim()]).filter(Boolean);
    el.innerHTML=list.map((p,i)=>`<figure class="${p.h>p.w?'tall':'wide'}"><button type="button" data-i="${i}" aria-label="Open photo: ${esc(p.caption)}">${pic(p,el.hasAttribute('data-eager')&&i<2)}</button>${el.hasAttribute('data-captions')?`<figcaption>${esc(p.caption)}</figcaption>`:''}</figure>`).join('');
    el.addEventListener('click',e=>{const b=e.target.closest('button[data-i]');if(b)open(list,Number(b.dataset.i))});
  });

  /* gentle fade-in as sections scroll into view */
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  }else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
})();
