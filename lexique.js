/* Offre de lancement : la mention disparaît d'elle-même à partir du 2 janvier 2027. */
(function(){
  if(Date.now() < new Date(2027,0,2).getTime()) return;
  function retirer(){ var l=document.querySelectorAll('.promo-lancement'); for(var i=0;i<l.length;i++) l[i].parentNode.removeChild(l[i]); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',retirer); else retirer();
})();
/* Arrivée en haut de page : on ne reprend jamais la position précédente. */
(function(){
  try{ if('scrollRestoration' in history) history.scrollRestoration='manual'; }catch(e){}
  function enHaut(){ if(!location.hash) window.scrollTo(0,0); }
  enHaut();
  window.addEventListener('load',enHaut);
})();

/* Lexique BETTHER — souligne les termes techniques et affiche leur définition au survol.
   Une seule occurrence par page et par terme, jamais dans un titre, un lien ou le simulateur. */
(function(){
  var LEXIQUE = [
    ['RE2020', 'Réglementation environnementale 2020 : la règle de calcul obligatoire pour toute construction neuve, sur l’énergie, le confort d’été et le carbone.'],
    ['Bbio', 'Besoin bioclimatique : ce que le bâtiment demande en chauffage, en froid et en éclairage avant même de choisir les équipements. Il dépend de la forme, de l’isolation et des ouvertures.'],
    ['Cep,nr', 'Consommation d’énergie primaire non renouvelable : la part de la consommation qui vient d’énergies non renouvelables.'],
    ['Cep', 'Consommation d’énergie primaire : l’énergie réellement consommée une fois les équipements pris en compte, chauffage, eau chaude, ventilation et éclairage.'],
    ['degrés-heures', 'Le cumul des heures où il fait trop chaud à l’intérieur en été, et de combien. C’est la mesure réglementaire du confort d’été.'],
    ['DH', 'Degrés-heures : le cumul des heures où il fait trop chaud à l’intérieur en été. C’est la mesure réglementaire du confort d’été.'],
    ['Ic construction', 'Indicateur carbone de la construction : le CO₂ émis pour fabriquer, transporter et mettre en œuvre les matériaux, en kg éq. CO₂ par m².'],
    ['Ic énergie', 'Indicateur carbone de l’énergie : le CO₂ émis par les consommations du bâtiment pendant cinquante ans.'],
    ['analyse de cycle de vie', 'Le bilan environnemental du bâtiment sur toute sa vie, de la fabrication des matériaux à la démolition.'],
    ['ACV', 'Analyse du cycle de vie : le bilan environnemental du bâtiment sur toute sa vie, de la fabrication des matériaux à la démolition.'],
    ['FDES', 'Fiche de déclaration environnementale et sanitaire : la carte d’identité carbone d’un produit de construction, établie par son fabricant.'],
    ['INIES', 'La base de données française qui rassemble les FDES des produits de construction.'],
    ['déphasage', 'Le temps que met la chaleur d’été pour traverser une paroi. Plus il est long, plus la maison reste fraîche en journée.'],
    ['perméabilité à l’air', 'La quantité d’air qui entre et sort par les défauts d’étanchéité du bâtiment. Elle se mesure avec un test d’infiltrométrie.'],
    ['ponts thermiques', 'Les endroits où l’isolation est interrompue, par exemple une jonction de dalle ou de balcon, et par où la chaleur s’échappe.'],
    ['déperditions', 'Les pertes de chaleur du bâtiment, par les parois, les ouvertures et la ventilation. Elles donnent la puissance de chauffage nécessaire.'],
    ['VMC', 'Ventilation mécanique contrôlée : le système qui renouvelle l’air du logement en continu et évacue l’humidité.'],
    ['ECS', 'Eau chaude sanitaire : l’eau chaude des douches, des lavabos et de la cuisine.'],
    ['PAC', 'Pompe à chaleur : un système qui prend de la chaleur dans l’air, l’eau ou le sol pour chauffer le logement.'],
    ['DPE', 'Diagnostic de performance énergétique : l’étiquette de A à G d’un logement. C’est un diagnostic réglementaire, pas une étude thermique.'],
    ['Bbio max', 'La valeur de Bbio à ne pas dépasser, fixée par la réglementation selon la zone et le type de bâtiment.']
  ];
  var IGNORE = 'a,button,label,input,textarea,select,script,style,h1,h2,h3,h4,h5,code,.lex,.wizard,.strip,.nav,.foot-legal,.wiz-pack-list,.wiz-includes,.eyebrow,.cat,.tag,.tags,.k,.bio-mots,.pd-kicker,.bb-val,.bb-an,.lede,.slogan,.hero,.phero,.pd-hero,.chip,.chips,.wiz-recap,.wiz-check,.foot-slogan,.sr-word,figcaption,caption,th,.bio-unite';

  function echappe(t){ return t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

  function poser(){
    var zone = document.querySelector('main') || document.body;
    var restants = LEXIQUE.slice();
    var noeuds = [], it = document.createTreeWalker(zone, NodeFilter.SHOW_TEXT, null);
    var n; while((n = it.nextNode())){
      if(!n.nodeValue || !n.nodeValue.trim()) continue;
      if(n.parentElement && n.parentElement.closest(IGNORE)) continue;
      var bloc = n.parentElement && n.parentElement.closest('p,li,div,td,span');
      if(!bloc || (bloc.textContent||'').trim().length < 90) continue; // étiquette ou pastille : on laisse
      noeuds.push(n);
    }
    noeuds.forEach(function(noeud){
      for(var i=0;i<restants.length;i++){
        var terme = restants[i][0], def = restants[i][1];
        var bord = /[A-Za-zÀ-ÿ]$/.test(terme) ? '(?![\\wÀ-ÿ])' : '';
        var rx = new RegExp('(^|[^\\wÀ-ÿ-])(' + echappe(terme) + ')' + bord);
        var m = rx.exec(noeud.nodeValue);
        if(!m) continue;
        var avant = noeud.nodeValue.slice(0, m.index + m[1].length);
        var apres = noeud.nodeValue.slice(m.index + m[1].length + m[2].length);
        var span = document.createElement('span');
        span.className = 'lex'; span.tabIndex = 0;
        span.setAttribute('style','position:relative;color:var(--accent-ink,#B23100);cursor:help;font-weight:500');
        span.setAttribute('role','note');
        span.appendChild(document.createTextNode(m[2]));
        var bulle = document.createElement('span');
        bulle.className = 'lex-bulle'; bulle.textContent = def;
        bulle.setAttribute('style','position:absolute;left:50%;bottom:calc(100% + 11px);transform:translateX(-50%);'
          + 'z-index:60;width:280px;max-width:72vw;padding:12px 14px;border-radius:13px;'
          + 'font:400 13px/1.45 var(--font-body,sans-serif);letter-spacing:0;text-transform:none;text-align:left;'
          + 'background:var(--surface,#fff);color:var(--ink,#0B1120);border:1px solid var(--line-strong,#D3CDC1);'
          + 'box-shadow:0 20px 44px -24px rgba(0,11,33,.8);display:none');
        span.appendChild(bulle);
        // Bulle masquée = display:none, sinon elle déborde du cadre et fait glisser la page
        // de côté sur téléphone. Affichée, on la recale pour qu'elle reste dans l'écran.
        function montre(v){
          if(!v){ bulle.style.display = 'none'; return; }
          bulle.style.display = 'block'; bulle.style.transform = 'translateX(-50%)';
          var r = bulle.getBoundingClientRect(), marge = 8, dx = 0, w = document.documentElement.clientWidth;
          if(r.right > w - marge) dx = w - marge - r.right;
          if(r.left + dx < marge) dx = marge - r.left;
          bulle.style.transform = 'translateX(calc(-50% + ' + Math.round(dx) + 'px))';
        }
        span.addEventListener('mouseenter',function(){ montre(true); });
        span.addEventListener('mouseleave',function(){ montre(false); });
        span.addEventListener('focus',function(){ montre(true); });
        span.addEventListener('blur',function(){ montre(false); });
        var parent = noeud.parentNode;
        parent.insertBefore(document.createTextNode(avant), noeud);
        parent.insertBefore(span, noeud);
        noeud.nodeValue = apres;
        restants.splice(i,1);
        return;
      }
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', poser);
  else poser();
})();
