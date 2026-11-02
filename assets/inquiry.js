/* B & K stay inquiry: validates, then emails Tina through FormSubmit (no server needed). */
(function(){
  const form=document.getElementById('inquiry');
  if(!form)return;
  const done=document.querySelector('.inquiry-done');
  const errBox=form.querySelector('.form-error');
  const btn=form.querySelector('button[type=submit]');
  const arrive=form.elements['Arrival'],leave=form.elements['Departure'];
  const started=Date.now();
  const iso=d=>d.toISOString().slice(0,10);
  const today=iso(new Date());
  arrive.min=today;leave.min=today;
  arrive.addEventListener('change',()=>{if(arrive.value){const n=new Date(arrive.value);n.setDate(n.getDate()+1);leave.min=iso(n);if(leave.value&&leave.value<=arrive.value)leave.value=iso(n)}});

  const showError=msg=>{errBox.innerHTML=msg;errBox.hidden=false;errBox.scrollIntoView({behavior:'smooth',block:'center'})};

  form.addEventListener('submit',async e=>{
    e.preventDefault();errBox.hidden=true;
    form.querySelectorAll('.invalid').forEach(el=>el.classList.remove('invalid'));
    const bad=[...form.querySelectorAll('[required]')].filter(el=>!el.checkValidity());
    if(leave.value&&arrive.value&&leave.value<=arrive.value){leave.setCustomValidity('after');bad.push(leave)}else leave.setCustomValidity('');
    if(bad.length){bad.forEach(el=>el.closest('label')?.classList.add('invalid'));bad[0].focus();
      return showError('Please fill in your name, a valid email, your dates (leaving after arriving) and how many adults are coming.')}
    if(form.elements['_honey'].value||Date.now()-started<3000)return; // likely a bot

    const data=Object.fromEntries(new FormData(form));
    if(!data['Dates are flexible'])data['Dates are flexible']='No';
    data._subject=`Stay inquiry: ${data.Name}, ${data.Arrival} to ${data.Departure}`;
    data._replyto=data.email;
    delete data._next;delete data._honey;
    btn.disabled=true;btn.textContent='Sending…';
    try{
      const r=await fetch(form.action.replace('formsubmit.co/','formsubmit.co/ajax/'),{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(data)});
      const j=await r.json().catch(()=>({}));
      if(!r.ok||String(j.success)==='false')throw new Error(j.message||r.status);
      form.hidden=true;done.querySelector('.done-name').textContent=data.Name?', '+data.Name.split(' ')[0]:'';
      done.hidden=false;done.focus();done.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(err){
      btn.disabled=false;btn.textContent='Send my inquiry to Tina';
      const body=encodeURIComponent(Object.entries(data).filter(([k])=>!k.startsWith('_')).map(([k,v])=>`${k}: ${v}`).join('\n'));
      showError(`Sorry, that didn't go through. You can <a href="mailto:bandkcabins@gmail.com?subject=${encodeURIComponent(data._subject)}&body=${body}">send it by email instead</a> (your details are filled in), or call or text Tina at <a href="tel:+16013412663">(601) 341-2663</a>.`);
    }
  });
})();
