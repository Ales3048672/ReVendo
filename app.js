"use strict";
const categories=["Tutti","Abbigliamento","Scarpe","Elettronica","Videogiochi","Casa","Accessori","Altro"];
const demo=[
{id:"demo1",title:"Giacca vintage",price:35,category:"Abbigliamento",description:"Giacca in ottime condizioni.",location:"Milano",image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"},
{id:"demo2",title:"Sneakers casual",price:49,category:"Scarpe",description:"Scarpe casual usate poco.",location:"Torino",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"},
{id:"demo3",title:"Cuffie wireless",price:28,category:"Elettronica",description:"Cuffie in buono stato.",location:"Roma",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"},
{id:"demo4",title:"Borsa quotidiana",price:22,category:"Accessori",description:"Borsa pratica per tutti i giorni.",location:"Bologna",image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"},
{id:"demo5",title:"Felpa basic",price:18,category:"Abbigliamento",description:"Felpa comoda in buone condizioni.",location:"Firenze",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"},
{id:"demo6",title:"Controller gaming",price:32,category:"Videogiochi",description:"Controller funzionante.",location:"Napoli",image:"https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600"},
{id:"demo7",title:"Lampada da tavolo",price:15,category:"Casa",description:"Lampada minimal per scrivania.",location:"Genova",image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"},
{id:"demo8",title:"Orologio classico",price:40,category:"Accessori",description:"Orologio elegante, stile classico.",location:"Verona",image:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"}
];
const $=id=>document.getElementById(id);
let active="Tutti",showFavorites=false,favorites=new Set();
let listings=[];
try{const stored=JSON.parse(localStorage.getItem("revendoListings")||"[]");if(Array.isArray(stored))listings=stored;}catch{listings=[];}
try{const storedFav=JSON.parse(localStorage.getItem("revendoFavorites")||"[]");if(Array.isArray(storedFav))favorites=new Set(storedFav);}catch{}
const euro=n=>Number(n).toLocaleString("it-IT",{style:"currency",currency:"EUR"});
function toast(message){const el=$("toast");el.textContent=message;el.style.display="block";clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.style.display="none",2800);}
function saveListings(){try{localStorage.setItem("revendoListings",JSON.stringify(listings));return true;}catch{toast("Spazio locale esaurito: prova a rimuovere alcuni annunci o foto.");return false;}}
function saveFavorites(){try{localStorage.setItem("revendoFavorites",JSON.stringify([...favorites]));}catch{}}
function renderCategories(){
 const host=$("categories");host.replaceChildren();
 categories.forEach(cat=>{const b=document.createElement("button");b.textContent=cat;b.className=cat===active?"active":"";b.onclick=()=>{active=cat;showFavorites=false;renderCategories();renderProducts();};host.append(b);});
}
function addText(parent,tag,className,text){const el=document.createElement(tag);if(className)el.className=className;el.textContent=text;parent.append(el);return el;}
function renderProducts(){
 const query=$("search").value.trim().toLocaleLowerCase("it");
 const all=[...listings].reverse().concat(demo);
 const shown=all.filter(p=>(active==="Tutti"||p.category===active)&&(!showFavorites||favorites.has(p.id))&&(`${p.title} ${p.description} ${p.category} ${p.location||""}`).toLocaleLowerCase("it").includes(query));
 const host=$("products");host.replaceChildren();$("empty").hidden=shown.length>0;$("count").textContent=`${shown.length} ${shown.length===1?"annuncio":"annunci"}`;$("sectionTitle").textContent=showFavorites?"I tuoi preferiti":"Ultimi annunci";
 shown.forEach(p=>{
  const card=document.createElement("article");card.className="card";
  if(p.image){const img=document.createElement("img");img.className="photo";img.src=p.image;img.alt=p.title;img.loading="lazy";img.onerror=()=>{img.remove();const ph=document.createElement("div");ph.className="photo-placeholder";ph.textContent="📦";card.prepend(ph);};card.append(img);}
  else{const ph=document.createElement("div");ph.className="photo-placeholder";ph.textContent="📦";card.append(ph);}
  const heart=document.createElement("button");heart.className="heart";heart.textContent=favorites.has(p.id)?"♥":"♡";heart.setAttribute("aria-label","Aggiungi o rimuovi dai preferiti");heart.onclick=()=>{if(favorites.has(p.id))favorites.delete(p.id);else favorites.add(p.id);saveFavorites();renderProducts();};card.append(heart);
  const info=document.createElement("div");info.className="info";
  const title=addText(info,"button","title",p.title);title.style.cssText="background:none;color:var(--ink);padding:0;text-align:left;width:100%;font-size:15px";
  title.onclick=()=>openDetail(p);
  if(card.querySelector("img"))card.querySelector("img").style.cursor="pointer";
  if(card.querySelector("img"))card.querySelector("img").onclick=()=>openDetail(p);
  addText(info,"div","price",euro(p.price));addText(info,"p","muted",p.description);if(p.condition)addText(info,"p","muted","Condizioni: "+p.condition);addText(info,"p","muted",p.location?`${p.location} · ${p.category}`:p.category);
  const detailsBtn=document.createElement("button");detailsBtn.className="secondary";detailsBtn.textContent="Vedi annuncio";detailsBtn.style.width="100%";detailsBtn.onclick=()=>openDetail(p);info.append(detailsBtn);
  const actions=document.createElement("div");actions.className="card-actions";
  const contact=document.createElement("button");contact.textContent="Contatta venditore";contact.onclick=()=>toast("La chat non è ancora attiva in questo prototipo.");
  actions.append(contact);
  if(!String(p.id).startsWith("demo")){const del=document.createElement("button");del.className="secondary";del.textContent="Elimina";del.onclick=()=>{if(confirm("Vuoi eliminare questo annuncio da questo browser?")){listings=listings.filter(x=>x.id!==p.id);saveListings();renderProducts();toast("Annuncio eliminato.");}};actions.append(del);}
  info.append(actions);card.append(info);host.append(card);
 });
}
$("search").addEventListener("input",renderProducts);
$("publishBtn").onclick=()=>$("modal").showModal();
$("cancelBtn").onclick=()=>$("modal").close();
$("exploreBtn").onclick=()=>$("catalog").scrollIntoView({behavior:"smooth"});
$("favoritesBtn").onclick=()=>{showFavorites=!showFavorites;$("favoritesBtn").textContent=showFavorites?"← Tutti gli annunci":"♡ Preferiti";renderProducts();$("catalog").scrollIntoView({behavior:"smooth"});};
$("listingForm").addEventListener("submit",async e=>{
 e.preventDefault();const form=e.currentTarget,data=new FormData(form),file=data.get("photo");let image="";
 if(file&&file.size){
  if(!file.type.startsWith("image/")){toast("Seleziona un file immagine valido.");return;}
  if(file.size>2*1024*1024){toast("Scegli una foto inferiore a 2 MB.");return;}
  try{image=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});}catch{toast("Impossibile leggere la foto.");return;}
 }
 const item={id:"user_"+Date.now()+"_"+Math.random().toString(36).slice(2,7),title:String(data.get("title")).trim(),price:Number(data.get("price")),category:String(data.get("category")),condition:String(data.get("condition")),description:String(data.get("description")).trim(),location:String(data.get("location")).trim(),image};
 if(!item.title||!item.description||!Number.isFinite(item.price)||item.price<=0||item.price>1000000){toast("Controlla titolo, descrizione e prezzo.");return;}
 listings.push(item);if(!saveListings()){listings.pop();return;}
 form.reset();$("modal").close();active="Tutti";showFavorites=false;renderCategories();renderProducts();toast("Annuncio salvato in questo browser.");window.scrollTo({top:0,behavior:"smooth"});
});

let selectedProduct = null;
function openDetail(p){
 selectedProduct=p;
 const view=$("detailView");view.replaceChildren();view.style.display="block";
 const back=document.createElement("button");back.className="back-button";back.textContent="← Torna agli annunci";
 back.onclick=()=>{view.style.display="none";selectedProduct=null;$("products").scrollIntoView({behavior:"smooth",block:"start"});};
 view.append(back);
 const layout=document.createElement("div");layout.className="detail-layout";
 const left=document.createElement("div");
 if(p.image){const img=document.createElement("img");img.className="detail-image";img.src=p.image;img.alt=p.title;left.append(img);}
 else{const ph=document.createElement("div");ph.className="photo-placeholder";ph.textContent="📦";left.append(ph);}
 const right=document.createElement("div");
 addText(right,"div","muted",p.category+(p.location?" · "+p.location:""));
 addText(right,"h2","",p.title);
 addText(right,"div","detail-price",euro(p.price));
 addText(right,"h3","","Descrizione");
 addText(right,"p","detail-description",p.description||"Il venditore non ha aggiunto una descrizione.");
 if(p.condition)addText(right,"p","muted","Condizioni dell'articolo: "+p.condition);
 addText(right,"p","muted","Annuncio dimostrativo: verifica sempre le informazioni con il venditore.");
 const contact=document.createElement("button");contact.className="detail-contact";contact.textContent="Contatta il venditore";
 contact.onclick=()=>toast("La chat con il venditore non è ancora attiva in questo prototipo.");
 right.append(contact);layout.append(left,right);view.append(layout);
 view.scrollIntoView({behavior:"smooth",block:"start"});
}
function addAIMessage(text,className=""){
 const msg=document.createElement("div");msg.className="ai-message "+className;msg.textContent=text;$("aiMessages").append(msg);$("aiMessages").scrollTop=$("aiMessages").scrollHeight;return msg;
}
function aiSearch(query){
 const q=query.toLocaleLowerCase("it");
 const priceMatches=[...q.matchAll(/(?:sotto|massimo|max|budget|meno di|fino a)\s*€?\s*(\d+(?:[.,]\d+)?)/g)];
 const euroMatches=[...q.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:€|euro)/g)];
 let maxPrice=null;
 if(priceMatches.length)maxPrice=Number(priceMatches[priceMatches.length-1][1].replace(",","."));
 else if(euroMatches.length)maxPrice=Number(euroMatches[euroMatches.length-1][1].replace(",","."));
 const terms=q.replace(/(?:sotto|massimo|max|budget|meno di|fino a)\s*€?\s*\d+(?:[.,]\d+)?/g," ")
   .replace(/\d+(?:[.,]\d+)?\s*(?:€|euro)/g," ")
   .replace(/[€.,!?]/g," ").split(/\s+/).filter(w=>w.length>2&&!["cerco","cerca","voglio","vorrei","per","con","una","uno","dei","delle","degli","che","sotto","massimo","prezzo","budget","euro"].includes(w));
 const all=[...listings].reverse().concat(demo);
 const ranked=all.map(p=>{
  const text=(p.title+" "+p.description+" "+p.category+" "+(p.location||"")).toLocaleLowerCase("it");
  let score=0;terms.forEach(t=>{if(text.includes(t))score+=text.includes(p.title.toLocaleLowerCase("it"))?3:1;});
  if(maxPrice!==null&&p.price<=maxPrice)score+=2;
  if(maxPrice!==null&&p.price>maxPrice)score-=4;
  return {...p,_score:score};
 }).filter(p=>(maxPrice===null||p.price<=maxPrice)&&(!terms.length||p._score>0))
 .sort((a,b)=>b._score-a._score||a.price-b.price).slice(0,4);
 if(!ranked.length){addAIMessage("Non ho trovato annunci compatibili nella demo. Prova a descrivere l'oggetto in modo diverso o aumenta il budget.");return;}
 addAIMessage(`Ho trovato ${ranked.length} ${ranked.length===1?"risultato":"risultati"} pertinenti${maxPrice!==null?" entro "+euro(maxPrice):""}:`);
 const wrap=document.createElement("div");wrap.className="ai-results";
 ranked.forEach(p=>{
  const b=document.createElement("button");b.type="button";b.className="ai-result";
  if(p.image){const img=document.createElement("img");img.src=p.image;img.alt="";img.onerror=()=>img.replaceWith(Object.assign(document.createElement("div"),{className:"mini-photo",textContent:"📦"}));b.append(img);}
  else{const ph=document.createElement("div");ph.className="mini-photo";ph.textContent="📦";b.append(ph);}
  const info=document.createElement("span");const name=document.createElement("strong");name.textContent=p.title;const price=document.createElement("small");price.textContent=euro(p.price)+" · "+p.category;info.append(name,price);b.append(info);b.onclick=()=>{ $("aiPanel").classList.remove("open");openDetail(p);};wrap.append(b);
 });
 $("aiMessages").append(wrap);$("aiMessages").scrollTop=$("aiMessages").scrollHeight;
}
$("aiFab").onclick=()=>{$("aiPanel").classList.toggle("open");if($("aiPanel").classList.contains("open"))$("aiQuery").focus();};
$("aiClose").onclick=()=>$("aiPanel").classList.remove("open");
$("aiForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const q=$("aiQuery").value.trim();if(!q)return;
 addAIMessage(q,"user");$("aiQuery").value="";
 const wait=addAIMessage("Sto analizzando la richiesta con l'assistente IA…");
 const catalog=[...listings].reverse().concat(demo).map(p=>({id:String(p.id),title:p.title,price:Number(p.price),category:p.category,condition:p.condition||"",description:String(p.description||"").slice(0,350),location:p.location||""}));
 try{
  const response=await fetch("/api/ai-search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:q,products:catalog})});
  const data=await response.json();
  if(!response.ok)throw new Error(data.error||"Servizio IA non disponibile.");
  wait.remove();
  addAIMessage(data.message||"Ecco gli annunci più adatti alla tua richiesta.");
  const byId=new Map([...listings].concat(demo).map(p=>[String(p.id),p]));
  const matches=(Array.isArray(data.results)?data.results:[]).map(result=>byId.get(String(result.id))||result).filter(p=>p&&p.title&&Number.isFinite(Number(p.price)));
  if(!matches.length){addAIMessage("Non ho trovato annunci compatibili nel catalogo attuale. Prova con un'altra descrizione o un budget diverso.");return;}
  const wrap=document.createElement("div");wrap.className="ai-results";
  matches.slice(0,4).forEach(p=>{
   const b=document.createElement("button");b.type="button";b.className="ai-result";
   if(p.image){const img=document.createElement("img");img.src=p.image;img.alt="";img.onerror=()=>img.replaceWith(Object.assign(document.createElement("div"),{className:"mini-photo",textContent:"📦"}));b.append(img);}
   else{const ph=document.createElement("div");ph.className="mini-photo";ph.textContent="📦";b.append(ph);}
   const info=document.createElement("span");const name=document.createElement("strong");name.textContent=p.title;const price=document.createElement("small");price.textContent=euro(p.price)+" · "+p.category;info.append(name,price);b.append(info);b.onclick=()=>{$("aiPanel").classList.remove("open");openDetail(p);};wrap.append(b);
  });
  $("aiMessages").append(wrap);$("aiMessages").scrollTop=$("aiMessages").scrollHeight;
 }catch(err){wait.remove();if(String(err.message).includes("Accedi per continuare")){addAIMessage("Per usare l'assistente IA, accedi o crea un account ReVendo dal pulsante Accedi.");}else{addAIMessage("Non riesco a contattare l'IA. Verifica che il server sia attivo e che OPENAI_API_KEY sia configurata. "+err.message);}}
});

let authMode="login", currentUser=null;
function setAuthMode(mode){
 authMode=mode;
 const signup=mode==="register";
 $("authTitle").textContent=signup?"Crea il tuo account":"Accedi a ReVendo";
 $("authSubtitle").textContent=signup?"Registrati per iniziare a usare ReVendo.":"Accedi per entrare nel tuo account.";
 $("authNameField").hidden=!signup;
 $("authName").required=signup;
 $("authPassword").autocomplete=signup?"new-password":"current-password";
 $("authSubmit").textContent=signup?"Registrati":"Accedi";
 $("authSwitchText").textContent=signup?"Hai già un account?":"Non hai un account?";
 $("authSwitch").textContent=signup?"Accedi":"Crea account";
 $("authMessage").textContent="";$("authMessage").className="small-note";
}
function renderAccount(){
 const btn=$("accountBtn");
 if(currentUser){btn.textContent="Esci";btn.title="Account: "+currentUser.name;btn.onclick=async()=>{try{await fetch("/api/logout",{method:"POST"});}catch{}currentUser=null;renderAccount();toast("Hai effettuato la disconnessione.");};}
 else{btn.textContent="Accedi";btn.title="Accedi o crea un account";btn.onclick=()=>{setAuthMode("login");$("authModal").showModal();};}
}
$("authSwitch").onclick=()=>setAuthMode(authMode==="login"?"register":"login");
$("authCancel").onclick=()=>$("authModal").close();
$("authForm").addEventListener("submit",async e=>{
 e.preventDefault();
 const payload={email:$("authEmail").value.trim(),password:$("authPassword").value};
 if(authMode==="register")payload.name=$("authName").value.trim();
 $("authSubmit").disabled=true;$("authMessage").textContent="Attendi…";
 try{
  const res=await fetch(authMode==="register"?"/api/register":"/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const data=await res.json();if(!res.ok)throw new Error(data.error||"Operazione non riuscita.");
  currentUser=data.user;renderAccount();$("authModal").close();$("authForm").reset();toast(authMode==="register"?"Account creato!":"Accesso effettuato.");
 }catch(err){$("authMessage").textContent=err.message;$("authMessage").className="small-note auth-message-error";}
 finally{$("authSubmit").disabled=false;}
});
async function loadSession(){try{const res=await fetch("/api/me");if(res.ok){const data=await res.json();currentUser=data.user||null;}}catch{}renderAccount();}

renderCategories();renderProducts();loadSession();


// Supporto PWA: registrazione service worker e richiesta installazione su Android/Chrome.
let pendingInstallPrompt = null;
const installAppBtn = document.getElementById("installAppBtn");
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  pendingInstallPrompt = event;
  if (installAppBtn) installAppBtn.hidden = false;
});
if (installAppBtn) {
  installAppBtn.addEventListener("click", async () => {
    if (!pendingInstallPrompt) {
      toast("Apri il menu di Chrome e scegli Installa app o Aggiungi a schermata Home.");
      return;
    }
    pendingInstallPrompt.prompt();
    await pendingInstallPrompt.userChoice;
    pendingInstallPrompt = null;
    installAppBtn.hidden = true;
  });
}
window.addEventListener("appinstalled", () => {
  if (installAppBtn) installAppBtn.hidden = true;
  toast("ReVendo è stato installato sul dispositivo.");
});
if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}
