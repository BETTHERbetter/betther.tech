/* Formulaire « Demander un devis » des pages prestations.
   Envoi par Web3Forms (site statique, aucun serveur à nous). La clé est publique par conception. */
(function(){
  var forms=document.querySelectorAll('form.form-rapide'); if(!forms.length) return;
  function telOk(t){ var d=(t||'').replace(/[^0-9+]/g,'').replace(/^\+33/,'0'); return /^0[1-9][0-9]{8}$/.test(d); }
  function envoyer(sujet,corps,email,nom){
    corps=String(corps||'').replace(/[  ]/g,' ');
    var data={access_key:'1c229693-4a09-4e35-87ca-0337d5224fef',subject:sujet,from_name:'Site betther.tech',name:nom||'Visiteur',message:corps};
    if(email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) data.email=email;
    return fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json();}).then(function(j){return !!(j&&j.success);})
      .catch(function(){return false;});
  }
  Array.prototype.forEach.call(forms,function(f){
    function champ(n){ var e=f.querySelector('[name="'+n+'"]'); return e?e.value.trim():''; }
    var tel=f.querySelector('[name="tel"]');
    if(tel) tel.addEventListener('input',function(){
      if(/^\+/.test(tel.value.trim())) return;
      var d=tel.value.replace(/\D/g,'').substr(0,10), o=[];
      for(var i=0;i<d.length;i+=2) o.push(d.substr(i,2));
      var fin=tel.selectionStart===tel.value.length; tel.value=o.join(' ');
      if(fin){ try{ tel.selectionStart=tel.selectionEnd=tel.value.length; }catch(e){} }
    });
    var out=f.querySelector('.out');
    function stop(n,txt){ out.hidden=false; out.style.color='#c2410c'; out.textContent=txt; var e=f.querySelector('[name="'+n+'"]'); if(e) e.focus(); }
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(!champ('nom')) return stop('nom','Merci d’indiquer votre nom.');
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(champ('email'))) return stop('email','Merci d’indiquer une adresse e-mail valide : c’est par là que nous vous répondons.');
      if(!telOk(champ('tel'))) return stop('tel','Merci d’indiquer un numéro de téléphone à 10 chiffres, par exemple 06 12 34 56 78.');
      var page=f.getAttribute('data-page')||document.title;
      var corps='Bonjour BETTHER,'
        +'\nDemande depuis la page : '+page
        +'\nNom : '+champ('nom')
        +'\nTel : '+champ('tel')
        +'\nEmail : '+champ('email')
        +(champ('ville')?('\nCommune du projet : '+champ('ville')):'')
        +(champ('source')?('\nA connu BETTHER par : '+champ('source')):'')
        +'\nProjet : '+(champ('message')||'-');
      var btn=f.querySelector('button[type=submit]'); btn.disabled=true; out.hidden=true;
      envoyer('Demande de devis ('+page+') — '+champ('nom'),corps,champ('email'),champ('nom')).then(function(ok){
        btn.disabled=false; out.hidden=false;
        if(ok){ out.style.color=''; out.innerHTML='<b>Demande envoyée.</b> Merci, nous revenons vers vous sous 24 h.'; f.reset(); }
        else { out.style.color='#c2410c'; out.innerHTML='L’envoi n’a pas abouti. Réessayez, ou écrivez à <a href="mailto:lili.brendle@betther.tech">lili.brendle@betther.tech</a>, ou appelez le 06 18 13 76 45.'; }
      });
    });
  });
})();
