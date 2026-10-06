import React, { CSSProperties, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { buildReading, Drawn, shuffleDeck, spreadPositions } from './tarot';
import { tarotImageUrl } from './cardImages';
import { HoroscopeHome } from './HoroscopeHome';
import './styles.css';
import './cardArt.css';
import './interaction.css';

type Stage = 'home'|'landing'|'form'|'prepare'|'cut'|'select'|'reveal'|'reading'|'clarify';

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
  const [stage,setStage]=useState<Stage>('home');
  const [name,setName]=useState('');
  const [birthDate,setBirthDate]=useState('');
  const [question,setQuestion]=useState('');
  const [saveReading,setSaveReading]=useState(true);
  const [seed,setSeed]=useState(()=>uid());
  const [readingId,setReadingId]=useState(()=>uid());
  const [cutIndex,setCutIndex]=useState(39);
  const [drawn,setDrawn]=useState<Drawn[]>([]);
  const [revealed,setRevealed]=useState<number[]>([]);
  const [clarifierTarget,setClarifierTarget]=useState<number|null>(null);
  const [candidate,setCandidate]=useState<number|null>(null);
  const dragStart=useRef<{x:number;y:number;index:number}|null>(null);
  const suppressClick=useRef(false);

  const shuffled=useMemo(()=>shuffleDeck(seed),[seed]);
  const deck=useMemo(()=>[...shuffled.slice(cutIndex),...shuffled.slice(0,cutIndex)],[shuffled,cutIndex]);
  const initialCards=drawn.filter(d=>d.clarifierFor===undefined).slice(0,7);
  const used=new Set(drawn.map(d=>d.deckIndex));
  const reading=initialCards.length===7?buildReading(initialCards,question):null;
  const clarifiers=drawn.filter(d=>d.clarifierFor!==undefined);

  const availableCards=deck
    .map((entry,index)=>({entry,index}))
    .filter(({index})=>!used.has(index));
  const rowSize=Math.max(1,Math.ceil(availableCards.length/3));
  const fanRows=[
    availableCards.slice(0,rowSize),
    availableCards.slice(rowSize,rowSize*2),
    availableCards.slice(rowSize*2),
  ];

  function reset(){
    setStage('home');
    setName('');
    setBirthDate('');
    setQuestion('');
    setSeed(uid());
    setReadingId(uid());
    setCutIndex(39);
    setDrawn([]);
    setRevealed([]);
    setClarifierTarget(null);
    setCandidate(null);
  }

  function openTarot(suggestedQuestion?:string){
    setQuestion(suggestedQuestion||'');
    setCandidate(null);
    setStage('landing');
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function persist(cardsToSave=drawn){
    const initialForSave=cardsToSave.filter(d=>d.clarifierFor===undefined).slice(0,7);
    if(!saveReading||initialForSave.length!==7)return;
    const key='vista-esoterica-readings';
    const previous:SavedReading[]=JSON.parse(localStorage.getItem(key)||'[]');
    const payload:SavedReading={id:readingId,createdAt:new Date().toISOString(),name,birthDate,question,cutIndex,seed,cards:cardsToSave};
    const withoutCurrent=previous.filter(item=>item.id!==readingId);
    localStorage.setItem(key,JSON.stringify([payload,...withoutCurrent].slice(0,25)));
  }

  function chooseCard(deckIndex:number){
    if(used.has(deckIndex))return;
    const source=deck[deckIndex];
    setCandidate(null);

    if(stage==='clarify'&&clarifierTarget!==null){
      if(clarifiers.length>=3)return;
      const target=clarifierTarget;
      const next=[...drawn,{...source,deckIndex,position:7+clarifiers.length,clarifierFor:target}];
      setDrawn(next);
      setClarifierTarget(null);
      persist(next);
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
    const dx=e.clientX-start.x;
    const dy=e.clientY-start.y;
    const distance=Math.hypot(dx,dy);
    if(distance>=16||dy<=-12){
      suppressClick.current=true;
      chooseCard(index);
    }
  }

  function onCardClick(index:number){
    if(suppressClick.current){
      suppressClick.current=false;
      return;
    }
    if(candidate===index){
      chooseCard(index);
      return;
    }
    setCandidate(index);
  }

  function clarifierImpact(d:Drawn){
    const targetIndex=d.clarifierFor??2;
    const target=initialCards[targetIndex];
    if(!target)return {kind:'matiza',text:`${d.card.name} agrega ${d.card.keywords.join(', ')} a esta zona de la tirada.`};

    const sameSuit=Boolean(d.card.suit&&target.card.suit&&d.card.suit===target.card.suit);
    const oppositeOrientation=d.reversed!==target.reversed;
    const clarifierMeaning=d.reversed?d.card.shadow:d.card.light;
    const targetMeaning=target.reversed?target.card.shadow:target.card.light;

    let kind='matiza';
    if(d.card.arcana==='major'&&target.card.arcana==='minor')kind='redirige y amplifica';
    else if(sameSuit&&!oppositeOrientation)kind='confirma';
    else if(oppositeOrientation)kind='tensiona';

    const bridge=sameSuit
      ?`Las dos cartas trabajan sobre el mismo plano de ${d.card.suit?.toLowerCase()}, por lo que el mensaje gana insistencia.`
      :d.card.arcana==='major'
        ?`El aclaratorio eleva el tema desde una situación concreta hacia un aprendizaje más estructural.`
        :`El aclaratorio trae otro plano de experiencia y obliga a leer esta posición con más de una causa a la vez.`;

    const turn=kind==='confirma'
      ?`No abre un tema nuevo: refuerza que la clave está justamente ahí.`
      :kind==='tensiona'
        ?`Hay una contradicción útil: una parte quiere avanzar y otra todavía procesa, resiste o protege algo.`
        :kind==='redirige y amplifica'
          ?`La pregunta deja de ser solamente “qué está pasando” y pasa a ser “qué cambio de posición interna te está pidiendo esto”.`
          :`No invalida la primera lectura; la vuelve menos literal y más compleja.`;

    return {
      kind,
      text:`En ${spreadPositions[targetIndex].label}, ${target.card.name} venía señalando ${targetMeaning}. ${d.card.name}${d.reversed?' invertida':''} ${kind} ese mensaje al introducir ${clarifierMeaning}. ${bridge} ${turn}`,
    };
  }

  const sections=reading?[
    ['Lo que viene operando desde atrás',reading.behind],
    ['Lo que ya ves',reading.seen],
    ['Lo que todavía no estás mirando de frente',reading.blind],
    ['Dónde está la tensión',reading.tension],
    ['El movimiento que se abre',reading.movement],
    ['Lo que pide acción',reading.action],
    ['Mirada psicológica',reading.psychology],
  ]:[];

  return <main className="app-shell">
    <header className="topbar">
      <button className="brand brand-button" onClick={reset} aria-label="Volver al inicio"><span className="sigil">✦</span><span>VISTA ESOTÉRICA</span></button>
      {stage==='home'
        ?<button className="link-button" onClick={()=>openTarot()}>Tirada</button>
        :<button className="link-button" onClick={reset}>Inicio</button>}
    </header>

    {stage==='home'&&<HoroscopeHome onTarot={openTarot}/>} 

    {stage==='landing'&&<section className="hero screen-centered">
      <span className="eyebrow">Tarot simbólico · lectura profunda</span>
      <h1>Una tirada para mirar lo que se está moviendo en vos.</h1>
      <p>No buscamos una respuesta rápida. La tirada se lee como un mapa integrado: raíz, pasado activo, presente, zona ciega, tendencia y acción.</p>
      {question&&<div className="carried-question"><small>Pregunta traída desde tu horóscopo</small><strong>{question}</strong></div>}
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
        <p>{stage==='reveal'
          ?'El mazo se retira. Las cartas permanecen en el lugar exacto de la tirada.'
          :stage==='clarify'
            ?`La carta se vinculará con ${spreadPositions[clarifierTarget??2].label}. Tocá una para marcarla; tocala otra vez o arrastrala hacia arriba para elegirla.`
            :'El mazo está abierto en tres abanicos. Tocá una carta para marcarla; tocala otra vez o arrastrala hacia arriba para llevarla a la tirada.'}</p>
      </div>

      {(stage==='select'||stage==='clarify')&&<>
        <div className="triple-fan" aria-label="Mazo extendido en tres abanicos">
          {fanRows.flatMap((row,rowIndex)=>row.map(({entry,index},j)=>{
            const t=row.length<=1?.5:j/(row.length-1);
            const x=4+t*92;
            const curve=36-Math.sqrt(Math.max(0,1-Math.pow((t-.5)*2,2)))*30;
            const y=rowIndex*112+curve;
            const angle=(t-.5)*42;
            return <button
              key={entry.card.id}
              aria-label={`Carta ${index+1}`}
              aria-pressed={candidate===index}
              onPointerDown={e=>onCardPointerDown(e,index)}
              onPointerUp={e=>onCardPointerUp(e,index)}
              onClick={()=>onCardClick(index)}
              className={`fan-card ${candidate===index?'candidate':''}`}
              style={{'--x':`${x}%`,'--y':`${y}px`,'--angle':`${angle}deg`,'--z':rowIndex*30+j+1} as CSSProperties}
            ><span>✦</span></button>
          }))}
        </div>
        <div className={`candidate-bar ${candidate===null?'hidden':''}`}>
          <div><strong>Carta marcada</strong><span>Podés cambiarla tocando otra o confirmar esta elección.</span></div>
          <button className="primary candidate-confirm" disabled={candidate===null} onClick={()=>candidate!==null&&chooseCard(candidate)}>Llevar a la tirada</button>
        </div>
      </>}

      <div className="spread-board">
        {spreadPositions.map((pos,i)=>{
          const d=initialCards[i];
          const isOpen=revealed.includes(i);
          return <button key={pos.key} className={`spread-slot slot-${i+1} ${d?'occupied':''} ${isOpen?'flipped':''}`} onClick={()=>stage==='reveal'&&d&&!isOpen&&setRevealed(r=>[...r,i])}>
            {!d?<span className="slot-number">{i+1}</span>:<div className="flip-inner"><div className="card-back">✦</div><div className={`card-face ${d.reversed?'reversed':''}`}><img src={tarotImageUrl(d.card,360)} alt={d.card.name} loading="lazy"/><div className="card-caption"><small>{pos.label}</small><strong>{d.card.name}</strong><span>{d.card.keywords.join(' · ')}</span>{d.reversed&&<em>Invertida</em>}</div></div></div>}
            {clarifiers.filter(c=>c.clarifierFor===i).map((c,k)=><span key={k} className="clarifier-chip">{c.card.name}</span>)}
          </button>
        })}
      </div>
      {stage==='reveal'&&<button className="primary continue-reading" disabled={revealed.length<7} onClick={()=>{persist();setStage('reading')}}>Leer la tirada</button>}
    </section>}

    {stage==='reading'&&reading&&<section className="reading panel">
      <span className="eyebrow">06 · LECTURA</span><h2>Tu lectura, {name}</h2><p className="lead">{question||'Lectura general del momento presente'}</p>
      <div className="reading-cards">{initialCards.map((d,i)=><div key={i} className={d.reversed?'reading-card reversed-reading':''}><img src={tarotImageUrl(d.card,260)} alt={d.card.name} loading="lazy"/><small>{spreadPositions[i].label}</small><strong>{d.card.name}</strong>{d.reversed&&<em>Invertida</em>}</div>)}</div>

      <article className="integrated-reading">
        <span className="eyebrow">HILO CENTRAL</span>
        <h3>La historia que forman las cartas</h3>
        <p>{reading.moment}</p>
        <p>{reading.synthesis}</p>
      </article>

      {clarifiers.length>0&&<section className="reading-revision">
        <span className="eyebrow">DESPUÉS DE PROFUNDIZAR</span>
        <h3>La lectura se mueve</h3>
        {clarifiers.map((d,i)=>{
          const impact=clarifierImpact(d);
          return <article className="clarifier-reading" key={`${d.deckIndex}-${i}`}>
            <img className={d.reversed?'clarifier-art reversed-art':'clarifier-art'} src={tarotImageUrl(d.card,300)} alt={d.card.name} loading="lazy"/>
            <div><small className="impact-label">{impact.kind}</small><h3>{d.card.name} · {spreadPositions[d.clarifierFor!].label}</h3><p>{impact.text}</p></div>
          </article>;
        })}
      </section>}

      {sections.map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}

      {clarifiers.length<3&&<section className="questions"><h3>¿Querés profundizar?</h3><p>No se trata de sacar cartas por sacar. Elegí solamente el punto donde todavía haya una pregunta real.</p><div><button onClick={()=>{setCandidate(null);setClarifierTarget(1);setStage('clarify')}}>¿Qué del pasado sigue activo?</button><button onClick={()=>{setCandidate(null);setClarifierTarget(4);setStage('clarify')}}>¿Qué estoy dejando fuera de mirada?</button><button onClick={()=>{setCandidate(null);setClarifierTarget(5);setStage('clarify')}}>¿Qué puede cambiar esta tendencia?</button></div></section>}
    </section>}
  </main>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);