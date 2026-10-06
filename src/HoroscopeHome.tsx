import { useEffect, useMemo, useState } from 'react';
import './horoscope.css';

type HoroscopeHomeProps = {
  onTarot: (suggestedQuestion?: string) => void;
};

type Sign = {
  key:string;
  name:string;
  glyph:string;
  dates:string;
  element:string;
  mood:string;
  title:string;
  summary:string;
  love:string;
  work:string;
  inner:string;
  ritual:string;
  question:string;
  accent:string;
  sourceName?:string;
  sourceTitle?:string;
  sourceUrl?:string;
  sourceDate?:string;
  sourceNote?:string;
  dataOrigin?:'demo'|'external';
};

type ExternalHoroscopeRecord = {
  id:string;
  sign:string;
  status:string;
  published_at:string;
  source:{
    name:string;
    title:string;
    video_url:string;
    transcript_status:string;
    transcript_raw:string|null;
    transcript_clean:string|null;
    note:string;
  };
  editorial:{
    mood:string;
    title:string;
    summary:string;
    love:string;
    work:string;
    inner:string;
    ritual:string;
    question:string;
  };
};

const signs:Sign[] = [
  {key:'aries',name:'Aries',glyph:'♈',dates:'21 mar · 19 abr',element:'Fuego',accent:'fuego',mood:'Lectura pendiente',title:'Todavía no hay una lectura externa verificada para Aries.',summary:'Cuando exista un registro publicado y validado, aparecerá aquí automáticamente.',love:'',work:'',inner:'',ritual:'',question:'',dataOrigin:'demo'},
  {key:'tauro',name:'Tauro',glyph:'♉',dates:'20 abr · 20 may',element:'Tierra',accent:'tierra',mood:'Lectura pendiente',title:'Todavía no hay una lectura externa verificada para Tauro.',summary:'Cuando exista un registro publicado y validado, aparecerá aquí automáticamente.',love:'',work:'',inner:'',ritual:'',question:'',dataOrigin:'demo'},
  {key:'geminis',name:'Géminis',glyph:'♊',dates:'21 may · 20 jun',element:'Aire',accent:'aire',mood:'Lectura pendiente',title:'Todavía no hay una lectura externa verificada para Géminis.',summary:'Cuando exista un registro publicado y validado, aparecerá aquí automáticamente.',love:'',work:'',inner:'',ritual:'',question:'',dataOrigin:'demo'},
  {key:'cancer',name:'Cáncer',glyph:'♋',dates:'21 jun · 22 jul',element:'Agua',accent:'agua',mood:'Lectura pendiente',title:'Todavía no hay una lectura externa verificada para Cáncer.',summary:'Cuando exista un registro publicado y validado, aparecerá aquí automáticamente.',love:'',work:'',inner:'',ritual:'',question:'',dataOrigin:'demo'},
  {key:'leo',name:'Leo',glyph:'♌',dates:'23 jul · 22 ago',element:'Fuego',accent:'fuego',mood:'Lectura pendiente',title:'Todavía no hay una lectura externa verificada para Leo.',summary:'Cuando exista un registro publicado y validado, aparecerá aquí automáticamente.',love:'',work:'',inner:'',ritual:'',question:'',dataOrigin:'demo'},
  {key:'virgo',name:'Virgo',glyph:'♍',dates:'23 ago · 22 sep',element:'Tierra',accent:'tierra',mood:'Lectura pendiente',title:'Todavía no hay una lectura externa verificada para Virgo.',summary:'Cuando exista un registro publicado y validado, aparecerá aquí automáticamente.',love:'',work:'',inner:'',ritual:'',question:'',dataOrigin:'demo'},
  {key:'libra',name:'Libra',glyph:'♎',dates:'23 sep · 22 oct',element:'Aire',accent:'aire',mood:'Lectura pendiente',title:'Todavía no hay una lectura externa verificada para Libra.',summary:'Cuando exista un registro publicado y validado, aparecerá aquí automáticamente.',love:'',work:'',inner:'',ritual:'',question:'',dataOrigin:'demo'},
  {key:'escorpio',name:'Escorpio',glyph:'♏',dates:'23 oct · 21 nov',element:'Agua',accent:'agua',mood:'Lectura pendiente',title:'Todavía no hay una lectura externa verificada para Escorpio.',summary:'Cuando exista un registro publicado y validado, aparecerá aquí automáticamente.',love:'',work:'',inner:'',ritual:'',question:'',dataOrigin:'demo'},
  {key:'sagitario',name:'Sagitario',glyph:'♐',dates:'22 nov · 21 dic',element:'Fuego',accent:'fuego',mood:'Lectura pendiente',title:'Todavía no hay una lectura externa verificada para Sagitario.',summary:'Cuando exista un registro publicado y validado, aparecerá aquí automáticamente.',love:'',work:'',inner:'',ritual:'',question:'',dataOrigin:'demo'},
  {key:'capricornio',name:'Capricornio',glyph:'♑',dates:'22 dic · 19 ene',element:'Tierra',accent:'tierra',mood:'Lectura pendiente',title:'Todavía no hay una lectura externa verificada para Capricornio.',summary:'Cuando exista un registro publicado y validado, aparecerá aquí automáticamente.',love:'',work:'',inner:'',ritual:'',question:'',dataOrigin:'demo'},
  {key:'acuario',name:'Acuario',glyph:'♒',dates:'20 ene · 18 feb',element:'Aire',accent:'aire',mood:'Lectura pendiente',title:'Todavía no hay una lectura externa verificada para Acuario.',summary:'Cuando exista un registro publicado y validado, aparecerá aquí automáticamente.',love:'',work:'',inner:'',ritual:'',question:'',dataOrigin:'demo'},
  {key:'piscis',name:'Piscis',glyph:'♓',dates:'19 feb · 20 mar',element:'Agua',accent:'agua',mood:'Lectura pendiente',title:'Todavía no hay una lectura externa verificada para Piscis.',summary:'Cuando exista un registro publicado y validado, aparecerá aquí automáticamente.',love:'',work:'',inner:'',ritual:'',question:'',dataOrigin:'demo'},
];

function formatReadingDate(value?:string){
  if(!value)return '';
  const [year,month,day]=value.split('-').map(Number);
  if(!year||!month||!day)return value;
  return new Intl.DateTimeFormat('es-UY',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'})
    .format(new Date(Date.UTC(year,month-1,day)))
    .replaceAll('.','');
}

function hydrateSign(base:Sign, record:ExternalHoroscopeRecord):Sign{
  return {
    ...base,
    ...record.editorial,
    sourceName:record.source.name,
    sourceTitle:record.source.title,
    sourceUrl:record.source.video_url,
    sourceDate:record.published_at,
    sourceNote:record.source.note,
    dataOrigin:'external',
  };
}

export function HoroscopeHome({onTarot}:HoroscopeHomeProps){
  const [selectedKey,setSelectedKey]=useState('sagitario');
  const [externalSigns,setExternalSigns]=useState<Record<string,Sign>>({});
  const [sourceStates,setSourceStates]=useState<Record<string,'loading'|'ready'|'error'>>(
    Object.fromEntries(signs.map(sign=>[sign.key,'loading']))
  );

  useEffect(()=>{
    const controller=new AbortController();
    let active=true;

    Promise.all(signs.map(async sign=>{
      try{
        const response=await fetch(`${import.meta.env.BASE_URL}content/horoscopes/${sign.key}.json`,{cache:'no-store',signal:controller.signal});
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        const record=await response.json() as ExternalHoroscopeRecord;
        if(record.status!=='published'||record.sign!==sign.key)throw new Error('Registro no publicable');
        if(!active)return;
        setExternalSigns(current=>({...current,[sign.key]:hydrateSign(sign,record)}));
        setSourceStates(current=>({...current,[sign.key]:'ready'}));
      }catch(error:any){
        if(!active||error?.name==='AbortError')return;
        setSourceStates(current=>({...current,[sign.key]:'error'}));
      }
    }));

    return ()=>{
      active=false;
      controller.abort();
    };
  },[]);

  const selected=useMemo(()=>{
    const base=signs.find(sign=>sign.key===selectedKey)!;
    return externalSigns[selectedKey]??base;
  },[selectedKey,externalSigns]);

  function selectSign(key:string){
    setSelectedKey(key);
    window.setTimeout(()=>document.getElementById('sign-reading')?.scrollIntoView({behavior:'smooth',block:'start'}),40);
  }

  return <div className="horoscope-home">
    <section className="horoscope-hero">
      <div className="horoscope-hero-copy">
        <span className="demo-pill">{selected.dataOrigin==='external'&&selected.sourceDate?`${selected.name} · lectura ${formatReadingDate(selected.sourceDate)}`:`${selected.name} · esperando lectura verificada`}</span>
        <span className="horoscope-kicker">HORÓSCOPOS · TAROT · MIRADA SIMBÓLICA</span>
        <h1>Un espacio para leer el clima del momento.</h1>
        <p>Elegí tu signo. Cada ficha puede actualizarse de forma independiente con la lectura más reciente y conservar la fecha y fuente reales.</p>
        <div className="hero-actions">
          <button className="horoscope-primary" onClick={()=>document.getElementById('zodiac')?.scrollIntoView({behavior:'smooth'})}>Elegir mi signo</button>
          <button className="horoscope-secondary" onClick={()=>onTarot()}>Ir directo al tarot <span>→</span></button>
        </div>
      </div>
      <div className="celestial-orbit" aria-hidden="true">
        <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
        <span className="moon">☾</span><span className="star star-a">✦</span><span className="star star-b">✧</span><span className="star star-c">·</span>
        <div className="orbit-copy"><small>LECTURA DEL MOMENTO</small><strong>mirar · comprender · elegir</strong></div>
      </div>
    </section>

    <section className="editorial-strip" aria-label="Claves del espacio">
      <div><span>✦</span><small>ACTUALIZACIÓN POR SIGNO</small><strong>Cada lectura conserva su propia fecha y fuente.</strong></div>
      <div><span>☾</span><small>CRITERIO</small><strong>Solo se publica un registro cuando la fuente está verificada.</strong></div>
      <div className="tarot-teaser"><span>⌁</span><small>TAROT</small><strong>Cuando una lectura abre una pregunta, podés llevarla a una tirada propia.</strong><button onClick={()=>onTarot()}>Abrir una tirada →</button></div>
    </section>

    <section className="zodiac-section" id="zodiac">
      <div className="section-heading">
        <div><span className="horoscope-kicker">LOS 12 SIGNOS</span><h2>Elegí el tuyo.</h2></div>
        <p>La última lectura publicada de cada signo se carga desde su registro independiente.</p>
      </div>
      <div className="zodiac-grid">
        {signs.map(sign=>{
          const cardSign=externalSigns[sign.key]??sign;
          return <button key={sign.key} className={`zodiac-card ${selectedKey===sign.key?'active':''}`} onClick={()=>selectSign(sign.key)}>
            <span className="zodiac-glyph">{sign.glyph}</span>
            <span className="zodiac-name">{sign.name}</span>
            <small>{sign.dates}</small>
            {cardSign.sourceDate?<small>Lectura · {formatReadingDate(cardSign.sourceDate)}</small>:<small>Lectura pendiente</small>}
            <em>{sign.element}</em>
          </button>;
        })}
      </div>
    </section>

    <section className={`sign-reading ${selected.accent}`} id="sign-reading">
      <div className="sign-reading-head">
        <div className="sign-monogram"><span>{selected.glyph}</span></div>
        <div className="sign-title">
          <span className="horoscope-kicker">{selected.dataOrigin==='external'?'LECTURA EDITORIAL · FUENTE VERIFICADA':`LECTURA PENDIENTE · ${selected.element.toUpperCase()}`}</span>
          <h2>{selected.name}</h2>
          <p>{selected.dates} · <strong>{selected.mood}</strong></p>
          {selected.sourceDate&&<p><small>Lectura correspondiente al {formatReadingDate(selected.sourceDate)}</small></p>}
          {selected.sourceTitle&&<p><small>Fuente: {selected.sourceName}</small><br/><a href={selected.sourceUrl} target="_blank" rel="noreferrer">Ver video original ↗</a></p>}
          {sourceStates[selectedKey]==='error'&&selected.dataOrigin!=='external'&&<p><small>Aún no existe un registro externo publicado y verificable para este signo.</small></p>}
        </div>
        <button className="change-sign" onClick={()=>document.getElementById('zodiac')?.scrollIntoView({behavior:'smooth'})}>Cambiar signo ↑</button>
      </div>

      <div className="sign-lead">
        <span>CLIMA DEL MOMENTO</span>
        <h3>{selected.title}</h3>
        <p>{selected.summary}</p>
        {selected.sourceNote&&<p><small>{selected.sourceNote}</small></p>}
      </div>

      {selected.dataOrigin==='external'&&<>
        <div className="reading-grid">
          <article><span className="reading-icon">♡</span><small>VÍNCULOS</small><p>{selected.love}</p></article>
          <article><span className="reading-icon">◇</span><small>TRABAJO & RECURSOS</small><p>{selected.work}</p></article>
          <article><span className="reading-icon">☾</span><small>MUNDO INTERIOR</small><p>{selected.inner}</p></article>
        </div>

        {selected.ritual&&<div className="ritual-card">
          <div><small>UN GESTO PARA HOY</small><p>{selected.ritual}</p></div>
          <span>✦</span>
        </div>}
      </>}

      <div className="tarot-bridge">
        <div className="tarot-mini-card" aria-hidden="true"><span>✦</span></div>
        <div className="tarot-bridge-copy">
          <span className="horoscope-kicker">PROFUNDIZÁ LA PREGUNTA</span>
          <h3>Del horóscopo a tu propia tirada.</h3>
          <p>La lectura propone un clima general. La tirada trabaja con tu pregunta y las cartas que vos elegís.</p>
          {selected.question&&<blockquote>“{selected.question}”</blockquote>}
          <button className="horoscope-primary" disabled={!selected.question} onClick={()=>selected.question&&onTarot(selected.question)}>Llevar esta pregunta al tarot <span>→</span></button>
          <button className="plain-tarot" onClick={()=>onTarot()}>Prefiero hacer una pregunta propia</button>
        </div>
      </div>
    </section>

    <section className="future-content">
      <span className="horoscope-kicker">CONTENIDO VIVO</span>
      <h2>Un registro por signo, siempre reemplazable por uno más reciente.</h2>
      <p>La web intenta leer Aries, Tauro, Géminis, Cáncer, Leo, Virgo, Libra, Escorpio, Sagitario, Capricornio, Acuario y Piscis por separado. Un signo puede actualizarse sin tocar los demás.</p>
      <div className="future-chips"><span>12 registros</span><span>Fecha por signo</span><span>Fuente verificada</span><span>Última lectura</span></div>
    </section>

    <footer className="horoscope-footer"><span>✦ VISTA ESOTÉRICA</span><p>Cada signo conserva su propia fuente y fecha de actualización.</p></footer>
  </div>;
}
