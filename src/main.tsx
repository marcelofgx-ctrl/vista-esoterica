import React, { CSSProperties, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { buildReading, Drawn, shuffleDeck, spreadPositions } from './tarot';
import './styles.css';

type Stage = 'landing'|'form'|'prepare'|'cut'|'select'|'reveal'|'reading'|'clarify';

type SavedReading = {
  id:string;
  createdAt:string;
  name:string;
  birthDate:string;
  question:string;
  cutIndex:number;
  seed:string;
  cards:Drawn[];
};

const uid=()=>`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;

function App(){
  const [stage,setStage]=useState<Stage>('landing');
  const [name,setName]=useState('');
  const [birthDate,setBirthDate]=useState('');
  const [question,setQuestion]=useState('');
  const [saveReading,setSaveReading]=useState(true);
  const [seed,setSeed]=useState(()=>uid());
  const [cutIndex,setCutIndex]=useState(39);
  const [drawn,setDrawn]=useState<Drawn[]>([]);
  const [revealed,setRevealed]=useState<number[]>([]);
  const [clarifierTarget,setClarifierTarget]=useState<number|null>(null);
  const dragStart=useRef<{x:number;y:number;index:number}|null>(null);

  const shuffled=useMemo(()=>shuffleDeck(seed),[seed]);
  const deck=useMemo(()=>[...shuffled.slice(cutIndex),...shuffled.slice(0,cutIndex)],[shuffled,cutIndex]);
  const initialCards=drawn.filter(d=>d.clarifierFor===undefined).slice(0,7);
  const used=new Set(drawn.map(d=>d.deckIndex));
  const reading=initialCards.length===7?buildReading(initialCards):null;
  const clarifiers=drawn.filter(d=>d.clarifierFor!==undefined);

  function reset(){
    setStage('landing');setName('');setBirthDate('');setQuestion('');setSeed(uid());setCutIndex(39);setDrawn([]);setRevealed([]);setClarifierTarget(null);
  }

  function chooseCard(deckIndex:number){
    if(used.has(deckIndex))return;
    const source=deck[deckIndex];
    if(stage==='clarify'&&clarifierTarget!==null){
      if(clarifiers.length>=3)return;
      setDrawn(prev=>[...prev,{...source,deckIndex,position:7+clarifiers.length,clarifierFor:clarifierTarget}]);
      setStage('reading');
      return;
    }
    if(stage!=='select'||initialCards.length>=7)return;
    const next=[...drawn,{...source,deckIndex,position:initialCards.length}];
    setDrawn(next);
    if(next.filter(d=>d.clarifierFor===undefined).length===7){
      window.setTimeout(()=>setStage('reveal'),360);
    }
  }

  function onCardPointerDown(e:React.PointerEvent,index:number){
    dragStart.current={x:e.clientX,y:e.clientY,index};
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onCardPointerUp(e:React.PointerEvent,index:number){
    const start=dragStart.current;
    dragStart.current=null;
    if(!start||start.index!==index)return;
    const distance=Math.hypot(e.clientX-start.x,e.clientY-start.y);
    if(distance>=8||distance<8)chooseCard(index);
  }

  function persist(){
    if(!saveReading||initialCards.length!==7)return;
    const key='vista-esoterica-readings';
    const previous:SavedReading[]=JSON.parse(localStorage.getItem(key)||'[]');
    const payload:SavedReading={id:uid(),createdAt:new Date().toISOString(),name,birthDate,question,cutIndex,seed,cards:drawn};
    localStorage.setItem(key,JSON.stringify([payload,...previous].slice(0,25)));
  }

  const sections=reading?[
    ['El momento que estás atravesando',reading.moment],
    ['Lo que viene operando desde atrás',reading.behind],
    ['Lo que ya ves',reading.seen],
    ['Lo que todavía no estás viendo',reading.blind],
    ['La tensión central',reading.tension],
    ['El movimiento que se abre',reading.movement],
    ['Lo que pide acción',reading.action],
    ['Mirada psicológica',reading.psychology],
    ['Síntesis',reading.synthesis],
  ]:[];

  return <main className="app-shell">
    <header className="topbar">
      <div className="brand"><span className="sigil">✦</span><span>VISTA ESOTÉRICA</span></div>
      <button className="link-button" onClick={reset}>Reiniciar</button>
    </header>

    {stage==='landing'&&<section className="hero screen-centered">
      <span className="eyebrow">Tarot simbólico · lectura profunda</span>
      <h1>Una tirada para mirar lo que se está moviendo en vos.</h1>
      <p>No buscamos una respuesta rápida. La tirada se lee como un mapa integrado: raíz, pasado activo, presente, zona ciega, tendencia y acción.</p>
      <button className="primary" onClick={()=>setStage('form')}>Comenzar una lectura</button>
      <small>Lectura reflexiva y simbólica. No reemplaza asesoramiento médico, psicológico, legal o financiero.</small>
    </section>}

    {stage==='form'&&<section className="panel form-panel">
      <span className="eyebrow">01 · CONSULTANTE</span>
      <h2>Antes de abrir el mazo</h2>
      <p>Lo esencial alcanza. Después, la tirada habla por la combinación de las cartas.</p>
      <label>Nombre</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" />
      <label>Fecha de nacimiento</label><input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} />
      <label>Pregunta o intención <span>(opcional)</span></label><textarea rows={4} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="¿Qué aspecto de tu momento querés comprender mejor?" />
      <label className="save-row"><input type="checkbox" checked={saveReading} onChange={e=>setSaveReading(e.target.checked)}/><span><strong>Conservar esta lectura</strong><small>Por ahora se guarda localmente en este dispositivo. La persistencia central pasará a Supabase.</small></span></label>
      <button className="primary" disabled={!name.trim()||!birthDate} onClick={()=>setStage('prepare')}>Continuar</button>
    </section>}

    {stage==='prepare'&&<section className="ritual screen-centered">
      <span className="big-sigil">✦</span><span className="eyebrow">02 · PREPARACIÓN</span>
      <h2>{name}, tomá unos segundos.</h2>
      <p>{question?<>Volvé mentalmente a tu pregunta: <em>“{question}”</em></>:<>Pensá en el momento que estás atravesando, sin forzar una respuesta.</>}</p>
      <button className="primary" onClick={()=>setStage('cut')}>Estoy listo</button>
    </section>}

    {stage==='cut'&&<section className="ritual screen-centered">
      <span className="eyebrow">03 · CORTE</span><h2>Cortá el mazo hacia vos.</h2>
      <p>El corte reorganiza el mazo sin volver a barajarlo.</p>
      <div className="deck-stack">{Array.from({length:10}).map((_,i)=><i key={i} style={{transform:`translate(${i*.9}px,${-i*.9}px)`}}/>)}</div>
      <input className="cut-range" aria-label="Punto de corte" type="range" min="1" max="77" value={cutIndex} onChange={e=>setCutIndex(Number(e.target.value))}/>
      <small>Punto de corte: {cutIndex}</small>
      <button className="primary" onClick={()=>setStage('select')}>Confirmar corte</button>
    </section>}

    {(stage==='select'||stage==='clarify'||stage==='reveal')&&<section className="table-screen">
      <div className="table-copy">
        <span className="eyebrow">{stage==='clarify'?'ARCANO ACLARATORIO':stage==='reveal'?'05 · REVELACIÓN':'04 · SELECCIÓN'}</span>
        <h2>{stage==='clarify'?'Elegí una carta para profundizar.':stage==='reveal'?'La Cruz Profunda':`Elegí ${7-initialCards.length} ${7-initialCards.length===1?'carta':'cartas'}.`}</h2>
        <p>{stage==='reveal'?'El mazo se retira. Las cartas permanecen en el lugar exacto de la tirada.':stage==='clarify'?`La carta se vinculará con ${spreadPositions[clarifierTarget??2].label}.`:'Todo el mazo está frente a vos. Tocá o arrastrá la carta que te llame.'}</p>
      </div>

      {(stage==='select'||stage==='clarify')&&<div className="double-fan" aria-label="Mazo extendido">
        {[deck.slice(0,39),deck.slice(39)].map((half,row)=><div className={`fan fan-${row+1}`} key={row}>
          {half.map((entry,j)=>{
            const index=row*39+j; const t=j/(half.length-1); const x=3+t*94; const curve=56-Math.sqrt(Math.max(0,1-Math.pow((t-.5)*2,2)))*45; const angle=(t-.5)*54;
            return <button key={entry.card.id} disabled={used.has(index)} aria-label={`Carta ${index+1}`} onPointerDown={e=>onCardPointerDown(e,index)} onPointerUp={e=>onCardPointerUp(e,index)} className={`fan-card ${used.has(index)?'used':''}`} style={{'--x':`${x}%`,'--y':`${curve}px`,'--angle':`${angle}deg`,'--z':j+1} as CSSProperties}><span>✦</span></button>
          })}
        </div>)}
      </div>}

      <div className="spread-board">
        {spreadPositions.map((pos,i)=>{
          const d=initialCards[i]; const isOpen=revealed.includes(i);
          return <button key={pos.key} className={`spread-slot slot-${i+1} ${d?'occupied':''} ${isOpen?'flipped':''}`} onClick={()=>stage==='reveal'&&d&&!isOpen&&setRevealed(r=>[...r,i])}>
            {!d?<span className="slot-number">{i+1}</span>:<div className="flip-inner"><div className="card-back">✦</div><div className={`card-face ${d.reversed?'reversed':''}`}><small>{pos.label}</small><strong>{d.card.name}</strong><span>{d.card.keywords.join(' · ')}</span>{d.reversed&&<em>Invertida</em>}</div></div>}
            {clarifiers.filter(c=>c.clarifierFor===i).map((c,k)=><span key={k} className="clarifier-chip">{c.card.name}</span>)}
          </button>
        })}
      </div>
      {stage==='reveal'&&<button className="primary continue-reading" disabled={revealed.length<7} onClick={()=>{persist();setStage('reading')}}>Leer la tirada</button>}
    </section>}

    {stage==='reading'&&reading&&<section className="reading panel">
      <span className="eyebrow">06 · LECTURA</span><h2>Tu lectura, {name}</h2><p className="lead">{question||'Lectura general del momento presente'}</p>
      <div className="reading-cards">{initialCards.map((d,i)=><div key={i}><small>{spreadPositions[i].label}</small><strong>{d.card.name}</strong></div>)}</div>
      {sections.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}
      {clarifiers.map((d,i)=><article className="clarifier-reading" key={i}><h3>Arcano aclaratorio · {spreadPositions[d.clarifierFor!].label}</h3><p><strong>{d.card.name}</strong> aporta {d.card.keywords.join(', ')}. No reemplaza la lectura anterior: la confirma, matiza, tensiona o redirige según el vínculo con esa posición.</p></article>)}
      {clarifiers.length<3&&<section className="questions"><h3>¿Querés profundizar?</h3><p>Elegí un punto que todavía necesite contexto.</p><div><button onClick={()=>{setClarifierTarget(1);setStage('clarify')}}>¿Qué del pasado sigue activo?</button><button onClick={()=>{setClarifierTarget(4);setStage('clarify')}}>¿Qué estoy dejando fuera de mirada?</button><button onClick={()=>{setClarifierTarget(5);setStage('clarify')}}>¿Hacia dónde puede moverse esto?</button></div></section>}
    </section>}
  </main>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
