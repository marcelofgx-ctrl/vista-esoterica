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
  {key:'aries',name:'Aries',glyph:'♈',dates:'21 mar · 19 abr',element:'Fuego',mood:'Impulso con dirección',title:'No todo movimiento necesita ser urgente.',summary:'Hay energía disponible para empezar, responder y decidir. La clave de esta lectura de ejemplo está en distinguir el deseo genuino de la reacción inmediata. Una pausa breve puede darte más potencia, no menos.',love:'En vínculos, decir lo que querés con claridad puede evitar que la intensidad se convierta en choque. Escuchar también forma parte de tomar iniciativa.',work:'Buen momento simbólico para destrabar una tarea concreta. Elegí una prioridad y hacela avanzar antes de abrir tres frentes nuevos.',inner:'La pregunta no es si tenés fuerza, sino dónde vale la pena ponerla.',ritual:'Antes de actuar, escribí en una línea qué querés conseguir y en otra qué querés evitar.',question:'¿Dónde necesito actuar con decisión y dónde estoy reaccionando por impulso?',accent:'fuego',dataOrigin:'demo'},
  {key:'tauro',name:'Tauro',glyph:'♉',dates:'20 abr · 20 may',element:'Tierra',mood:'Valor y sostén',title:'Conservar no siempre significa quedarse igual.',summary:'La estabilidad puede ser refugio o plataforma. Esta lectura de ejemplo invita a revisar qué estructura todavía te sostiene y cuál empezaste a mantener solo porque ya existe.',love:'Una conversación sencilla puede valer más que grandes demostraciones. Mirá dónde necesitás seguridad y dónde necesitás confianza.',work:'Ordenar recursos, tiempos o pendientes puede devolverte sensación de control sin endurecerte.',inner:'Tu ritmo es una fortaleza cuando nace de una elección, no del miedo al cambio.',ritual:'Elegí un objeto, gasto o hábito que represente seguridad y preguntate si hoy sigue cumpliendo esa función.',question:'¿Qué necesito conservar y qué puedo soltar sin perder estabilidad?',accent:'tierra',dataOrigin:'demo'},
  {key:'geminis',name:'Géminis',glyph:'♊',dates:'21 may · 20 jun',element:'Aire',mood:'Ideas que buscan forma',title:'No toda posibilidad merece convertirse en camino.',summary:'Hay varias voces, opciones o conversaciones abiertas. La riqueza está en ver conexiones, pero el desafío consiste en elegir qué merece continuidad y qué puede quedar simplemente como curiosidad.',love:'Preguntar antes de interpretar puede cambiar el tono de un vínculo. Hay lugar para una charla que ordene lo que estaba supuesto.',work:'Una idea gana fuerza si la bajás a una prueba concreta. Menos pestañas abiertas, más experimento pequeño.',inner:'La mente puede ayudarte a comprender, pero también puede mantenerte lejos de una decisión.',ritual:'Anotá tres posibilidades. Tachá la que solo te entretiene y subrayá la que te compromete.',question:'¿Qué conversación o decisión vengo postergando por mantener abiertas demasiadas posibilidades?',accent:'aire',dataOrigin:'demo'},
  {key:'cancer',name:'Cáncer',glyph:'♋',dates:'21 jun · 22 jul',element:'Agua',mood:'Cuidar sin absorber',title:'Tu sensibilidad también necesita un borde.',summary:'La atención se dirige al hogar emocional: aquello que cuidás, recordás y sostenés. Esta lectura de ejemplo propone diferenciar pertenencia de sobrecarga.',love:'Podés estar percibiendo más de lo que se dice. Antes de hacerte cargo, confirmá qué pertenece realmente al otro.',work:'Cuidar el clima no significa resolverlo todo. Protegé tiempo y energía para tu propia tarea.',inner:'Sentir profundamente no obliga a responsabilizarte por cada emoción que aparece alrededor.',ritual:'Preguntate frente a una preocupación: “¿Esto es mío, compartido o ajeno?”.',question:'¿Qué estoy sosteniendo por amor y qué estoy sosteniendo por costumbre o culpa?',accent:'agua',dataOrigin:'demo'},
  {key:'leo',name:'Leo',glyph:'♌',dates:'23 jul · 22 ago',element:'Fuego',mood:'Presencia auténtica',title:'Mostrarte no es lo mismo que demostrar.',summary:'Hay una invitación simbólica a ocupar espacio con menos esfuerzo por justificarlo. El reconocimiento más útil empieza cuando dejás de negociar tanto con la mirada externa.',love:'Un vínculo puede beneficiarse de más calidez y menos puesta en escena. Decí algo verdadero aunque no sea perfecto.',work:'Tu capacidad puede ser visible sin convertir cada resultado en examen personal.',inner:'La pregunta central es cuánto de tu expresión nace del disfrute y cuánto de necesitar confirmación.',ritual:'Hacé algo que disfrutes aunque nadie vaya a verlo, medirlo ni celebrarlo.',question:'¿Dónde estoy buscando aprobación cuando en realidad necesito darme permiso?',accent:'fuego',dataOrigin:'demo'},
  {key:'virgo',name:'Virgo',glyph:'♍',dates:'23 ago · 22 sep',element:'Tierra',mood:'Orden con humanidad',title:'Mejorar algo no exige castigarlo primero.',summary:'Esta lectura de ejemplo pone el foco en ajustes, hábitos y pequeñas decisiones. Hay mucho que puede ordenarse, siempre que la exigencia no se disfrace de responsabilidad.',love:'No todo necesita ser corregido para ser cuidado. Prestá atención a los gestos que ya funcionan.',work:'Un cambio pequeño de sistema puede rendir más que una jornada de sobreesfuerzo.',inner:'Tu discernimiento es valioso cuando también sabe reconocer lo suficiente.',ritual:'Cerrá una tarea al 90% y observá qué parte de vos insiste en que todavía “no cuenta”.',question:'¿Qué puedo mejorar sin convertir mi valor personal en una evaluación permanente?',accent:'tierra',dataOrigin:'demo'},
  {key:'libra',name:'Libra',glyph:'♎',dates:'23 sep · 22 oct',element:'Aire',mood:'Equilibrio que decide',title:'La armonía también necesita una posición.',summary:'Puede haber una situación donde sostener todas las perspectivas ya no alcance. Esta lectura de ejemplo sugiere que elegir no rompe necesariamente el equilibrio: a veces lo crea.',love:'Una conversación honesta puede incomodar un poco y, al mismo tiempo, hacer el vínculo más verdadero.',work:'Revisá una decisión que venís consultando demasiado. Tal vez ya tenés la información suficiente.',inner:'Evitar el conflicto puede convertirse en una forma silenciosa de abandonar tu propio criterio.',ritual:'Escribí qué elegirías si no tuvieras que convencer a nadie de que tu elección es razonable.',question:'¿Qué decisión necesito tomar aunque no pueda dejar a todos conformes?',accent:'aire',dataOrigin:'demo'},
  {key:'escorpio',name:'Escorpio',glyph:'♏',dates:'23 oct · 21 nov',element:'Agua',mood:'Profundidad sin encierro',title:'Mirar la sombra no significa vivir dentro de ella.',summary:'Algo pide profundidad, verdad y quizá un cierre. La propuesta simbólica no es intensificarlo todo, sino reconocer qué transformación ya comenzó y qué resistencia todavía la acompaña.',love:'Hay espacio para nombrar deseo, miedo o resentimiento sin convertirlos automáticamente en veredicto.',work:'Un problema complejo puede requerir ir a la causa, no seguir corrigiendo síntomas.',inner:'Tu percepción gana libertad cuando deja de necesitar controlar todo lo que descubre.',ritual:'Nombrá una verdad que ya sabés y después escribí qué acción pequeña sería coherente con ella.',question:'¿Qué verdad estoy listo para reconocer sin usarla para castigarme ni controlar?',accent:'agua',dataOrigin:'demo'},
  {key:'sagitario',name:'Sagitario',glyph:'♐',dates:'22 nov · 21 dic',element:'Fuego',mood:'Cargando lectura…',title:'La lectura de Sagitario vive fuera del código de la web.',summary:'Este contenido se reemplaza automáticamente cuando llega el registro externo.',love:'',work:'',inner:'',ritual:'',question:'',accent:'fuego',dataOrigin:'demo'},
  {key:'capricornio',name:'Capricornio',glyph:'♑',dates:'22 dic · 19 ene',element:'Tierra',mood:'Responsabilidad con sentido',title:'No todo lo que podés sostener te corresponde sostenerlo.',summary:'La estructura, el compromiso y los objetivos están presentes. Esta lectura de ejemplo pregunta por el costo invisible de ser siempre quien aguanta o resuelve.',love:'La vulnerabilidad puede ser una forma de responsabilidad compartida, no una falla en tu fortaleza.',work:'Revisá si una meta sigue siendo tuya o si quedó funcionando por inercia, prestigio o deber.',inner:'Descansar una carga también puede ser una decisión madura.',ritual:'Hacé una lista breve de responsabilidades y marcá cuáles elegiste, cuáles heredaste y cuáles ya podrían terminar.',question:'¿Qué responsabilidad sigo cargando aunque ya no represente la vida que quiero construir?',accent:'tierra',dataOrigin:'demo'},
  {key:'acuario',name:'Acuario',glyph:'♒',dates:'20 ene · 18 feb',element:'Aire',mood:'Diferencia con pertenencia',title:'Ser distinto no obliga a estar lejos.',summary:'Una idea nueva, una necesidad de independencia o una mirada poco convencional puede estar tomando fuerza. La pregunta simbólica es cómo darle forma sin convertir autonomía en desconexión.',love:'Podés necesitar más libertad dentro de un vínculo, no necesariamente menos vínculo.',work:'Pensar diferente suma cuando encontrás una forma clara de comunicar por qué ese cambio mejora algo real.',inner:'Tu singularidad no necesita oposición permanente para existir.',ritual:'Explicá una idea importante en palabras que alguien muy distinto a vos pueda comprender.',question:'¿Cómo puedo ser fiel a mi diferencia sin aislarme ni vivir reaccionando contra lo establecido?',accent:'aire',dataOrigin:'demo'},
  {key:'piscis',name:'Piscis',glyph:'♓',dates:'19 feb · 20 mar',element:'Agua',mood:'Intuición con anclaje',title:'Lo sutil también necesita una forma.',summary:'Sensibilidad, imaginación e intuición aparecen muy disponibles. Esta lectura de ejemplo invita a recibirlas sin perder el criterio que permite distinguir una señal interna de una proyección.',love:'Escuchar el clima emocional puede ser valioso, siempre que también haya preguntas directas y límites claros.',work:'Una intuición creativa puede transformarse en algo concreto si le asignás tiempo, estructura y fecha.',inner:'No necesitás apagar la sensibilidad; necesitás un lugar desde donde sostenerla.',ritual:'Tomá una intuición y escribí qué hecho observable la apoya y qué parte sigue siendo solamente sensación.',question:'¿Qué intuición merece atención y qué necesito verificar antes de convertirla en certeza?',accent:'agua',dataOrigin:'demo'},
];

export function HoroscopeHome({onTarot}:HoroscopeHomeProps){
  const [selectedKey,setSelectedKey]=useState('sagitario');
  const [externalSagittarius,setExternalSagittarius]=useState<Sign|null>(null);
  const [sourceState,setSourceState]=useState<'loading'|'ready'|'error'>('loading');

  useEffect(()=>{
    const controller=new AbortController();
    fetch(`${import.meta.env.BASE_URL}content/horoscopes/sagitario.json`,{cache:'no-store',signal:controller.signal})
      .then(response=>{
        if(!response.ok)throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<ExternalHoroscopeRecord>;
      })
      .then(record=>{
        if(record.status!=='published'||record.sign!=='sagitario')throw new Error('Registro no publicable');
        const base=signs.find(sign=>sign.key==='sagitario')!;
        setExternalSagittarius({
          ...base,
          ...record.editorial,
          sourceName:record.source.name,
          sourceTitle:record.source.title,
          sourceUrl:record.source.video_url,
          sourceDate:record.published_at,
          sourceNote:record.source.note,
          dataOrigin:'external',
        });
        setSourceState('ready');
      })
      .catch(error=>{
        if(error?.name!=='AbortError')setSourceState('error');
      });
    return ()=>controller.abort();
  },[]);

  const selected=useMemo(()=>{
    const base=signs.find(sign=>sign.key===selectedKey)!;
    return selectedKey==='sagitario'&&externalSagittarius?externalSagittarius:base;
  },[selectedKey,externalSagittarius]);

  function selectSign(key:string){
    setSelectedKey(key);
    window.setTimeout(()=>document.getElementById('sign-reading')?.scrollIntoView({behavior:'smooth',block:'start'}),40);
  }

  return <div className="horoscope-home">
    <section className="horoscope-hero">
      <div className="horoscope-hero-copy">
        <span className="demo-pill">{selected.dataOrigin==='external'?'Sagitario · contenido externo activo':'Vista previa · contenido de ejemplo'}</span>
        <span className="horoscope-kicker">HORÓSCOPOS · TAROT · MIRADA SIMBÓLICA</span>
        <h1>Un espacio para leer el clima del momento.</h1>
        <p>Horóscopos con una voz más íntima, menos automática. Elegí tu signo, recorré la lectura y, si algo te toca de cerca, profundizalo con una tirada.</p>
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

    <section className="editorial-strip" aria-label="Destacados de ejemplo">
      <div><span>✦</span><small>TEMA DE LA SEMANA</small><strong>Elegir sin pedir permiso a todas las voces internas.</strong></div>
      <div><span>☾</span><small>PREGUNTA PARA MIRAR</small><strong>¿Qué parte de tu vida ya cambió aunque todavía la nombres como antes?</strong></div>
      <div className="tarot-teaser"><span>⌁</span><small>TAROT</small><strong>Cuando el horóscopo abre una pregunta, la tirada puede llevarla más profundo.</strong><button onClick={()=>onTarot()}>Abrir una tirada →</button></div>
    </section>

    <section className="zodiac-section" id="zodiac">
      <div className="section-heading">
        <div><span className="horoscope-kicker">LOS 12 SIGNOS</span><h2>Elegí el tuyo.</h2></div>
        <p>Sagitario ya se carga desde una fuente de datos separada del código. Los otros once signos siguen como demostración mientras definimos sus fuentes.</p>
      </div>
      <div className="zodiac-grid">
        {signs.map(sign=><button key={sign.key} className={`zodiac-card ${selectedKey===sign.key?'active':''}`} onClick={()=>selectSign(sign.key)}>
          <span className="zodiac-glyph">{sign.glyph}</span>
          <span className="zodiac-name">{sign.name}</span>
          <small>{sign.dates}</small>
          <em>{sign.element}</em>
        </button>)}
      </div>
    </section>

    <section className={`sign-reading ${selected.accent}`} id="sign-reading">
      <div className="sign-reading-head">
        <div className="sign-monogram"><span>{selected.glyph}</span></div>
        <div className="sign-title">
          <span className="horoscope-kicker">{selected.dataOrigin==='external'?'LECTURA EDITORIAL · REGISTRO EXTERNO':`LECTURA DE EJEMPLO · ${selected.element.toUpperCase()}`}</span>
          <h2>{selected.name}</h2>
          <p>{selected.dates} · <strong>{selected.mood}</strong></p>
          {selected.sourceTitle&&<p><small>Fuente: {selected.sourceName} · {selected.sourceDate}</small><br/><a href={selected.sourceUrl} target="_blank" rel="noreferrer">Ver video original ↗</a></p>}
          {selectedKey==='sagitario'&&sourceState==='error'&&<p><small>No se pudo leer la fuente externa; se muestra el respaldo local.</small></p>}
        </div>
        <button className="change-sign" onClick={()=>document.getElementById('zodiac')?.scrollIntoView({behavior:'smooth'})}>Cambiar signo ↑</button>
      </div>

      <div className="sign-lead">
        <span>CLIMA DEL MOMENTO</span>
        <h3>{selected.title}</h3>
        <p>{selected.summary}</p>
        {selected.sourceNote&&<p><small>{selected.sourceNote}</small></p>}
      </div>

      <div className="reading-grid">
        <article><span className="reading-icon">♡</span><small>VÍNCULOS</small><p>{selected.love}</p></article>
        <article><span className="reading-icon">◇</span><small>TRABAJO & RECURSOS</small><p>{selected.work}</p></article>
        <article><span className="reading-icon">☾</span><small>MUNDO INTERIOR</small><p>{selected.inner}</p></article>
      </div>

      <div className="ritual-card">
        <div><small>UN GESTO PARA HOY</small><p>{selected.ritual}</p></div>
        <span>✦</span>
      </div>

      <div className="tarot-bridge">
        <div className="tarot-mini-card" aria-hidden="true"><span>✦</span></div>
        <div className="tarot-bridge-copy">
          <span className="horoscope-kicker">PROFUNDIZÁ LA PREGUNTA</span>
          <h3>Del horóscopo a tu propia tirada.</h3>
          <p>El horóscopo propone un clima general. La tirada trabaja con tu pregunta y las cartas que vos elegís.</p>
          {selected.question&&<blockquote>“{selected.question}”</blockquote>}
          <button className="horoscope-primary" disabled={!selected.question} onClick={()=>selected.question&&onTarot(selected.question)}>Llevar esta pregunta al tarot <span>→</span></button>
          <button className="plain-tarot" onClick={()=>onTarot()}>Prefiero hacer una pregunta propia</button>
        </div>
      </div>
    </section>

    <section className="future-content">
      <span className="horoscope-kicker">PILOTO DE CONTENIDO</span>
      <h2>La interfaz ya no necesita contener el horóscopo.</h2>
      <p>Sagitario se obtiene desde un registro externo. Cuando pasemos a Supabase, la web conservará esta misma lógica y solo cambiaremos el origen del fetch.</p>
      <div className="future-chips"><span>Fuente separada</span><span>Contenido reemplazable</span><span>Tarot conectado</span><span>Supabase después</span></div>
    </section>

    <footer className="horoscope-footer"><span>✦ VISTA ESOTÉRICA</span><p>Sagitario usa contenido externo; los otros signos continúan como demostración.</p></footer>
  </div>;
}
