export type Suit = 'Oros' | 'Copas' | 'Espadas' | 'Bastos';

export type TarotCard = {
  id: number;
  name: string;
  arcana: 'major' | 'minor';
  suit?: Suit;
  number?: number;
  keywords: string[];
  light: string;
  shadow: string;
};

type MinorDef = {
  keywords: string[];
  light: string;
  shadow: string;
};

const majors = [
  ['El Loco','inicio, libertad, salto','abrirte a lo desconocido sin exigir garantías antes de empezar','moverte por impulso o usar la libertad para no comprometerte'],
  ['El Mago','voluntad, recursos, inicio','reconocer que ya tenés herramientas para intervenir en la situación','forzar los tiempos, controlar o confundir capacidad con omnipotencia'],
  ['La Sacerdotisa','intuición, silencio, profundidad','escuchar lo que sabés internamente antes de explicarlo todo','cerrarte, callar demasiado o convertir la intuición en sospecha'],
  ['La Emperatriz','creación, nutrición, abundancia','dar cuerpo a algo que quiere crecer y permitirte recibir','sobrecuidar, sobreproducir o sostener más de lo que te corresponde'],
  ['El Emperador','estructura, orden, autoridad','poner límites, ordenar y asumir una posición clara','endurecerte, querer dominar o confundir seguridad con rigidez'],
  ['El Hierofante','tradición, sentido, enseñanza','apoyarte en valores, experiencia y una estructura con significado','obedecer por inercia, buscar permiso o quedar atrapado en el deber'],
  ['Los Enamorados','elección, vínculo, valores','elegir en coherencia con lo que realmente valorás','postergar una elección, dividirte entre deseo y deber o querer conservar todas las opciones'],
  ['El Carro','avance, dirección, voluntad','tomar las riendas y orientar fuerzas que hasta ahora iban en direcciones distintas','acelerar para no sentir, controlar demasiado o confundir movimiento con avance'],
  ['La Fuerza','coraje, integración, dominio interno','regular una fuerza intensa sin negarla y actuar desde una firmeza serena','reprimir, desgastarte intentando aguantar o reaccionar desde el orgullo'],
  ['El Ermitaño','retiro, búsqueda, discernimiento','separarte del ruido para reconocer tu propia verdad','aislarte, demorarte indefinidamente o usar la reflexión para no volver al mundo'],
  ['La Rueda','cambio, ciclo, giro','aceptar que un ciclo se mueve y aprovechar el cambio de condiciones','aferrarte a lo conocido o esperar que el azar resuelva lo que requiere participación'],
  ['La Justicia','equilibrio, verdad, consecuencia','mirar hechos, asumir consecuencias y decidir con ecuanimidad','juzgarte con dureza, racionalizar o exigir una perfección imposible'],
  ['El Colgado','pausa, entrega, nueva mirada','suspender la reacción automática para ver lo que antes no veías','quedarte esperando, sacrificarte sin sentido o llamar paciencia al estancamiento'],
  ['La Muerte','cierre, transformación, desprendimiento','dejar terminar lo que ya cumplió su ciclo para liberar energía nueva','sostener lo agotado por miedo a la pérdida o dramatizar un cierre necesario'],
  ['La Templanza','integración, armonía, proceso','combinar partes opuestas y permitir un proceso gradual de acomodación','diluirte para evitar conflicto o esperar equilibrio sin hacer ajustes reales'],
  ['El Diablo','deseo, apego, sombra','reconocer deseo, poder, dependencia y necesidades negadas sin moralizarlas','quedar atado a compulsiones, pactos silenciosos o relaciones de poder que no querés mirar'],
  ['La Torre','ruptura, revelación, derrumbe','dejar caer una estructura falsa o demasiado rígida para recuperar verdad','aferrarte a lo que se rompe, reaccionar desde el pánico o provocar ruptura sin integración'],
  ['La Estrella','esperanza, autenticidad, renovación','recuperar confianza, sencillez y una dirección más auténtica después del desgaste','idealizar, esperar una señal perfecta o confundir esperanza con pasividad'],
  ['La Luna','inconsciente, sensibilidad, ambigüedad','tolerar la incertidumbre y escuchar imágenes, emociones y señales internas sin apresurar conclusiones','proyectar, temer lo que no comprendés o tomar una sensación como certeza'],
  ['El Sol','claridad, vitalidad, expresión','mostrarte, disfrutar y permitir que algo sea visto tal como es','sobreexponerte, necesitar aprobación o negar las sombras porque algo parece ir bien'],
  ['El Juicio','despertar, llamado, revisión','escuchar un llamado interno, revisar el pasado y responder de otra manera','castigarte, quedar preso de la culpa o pedir una absolución externa antes de avanzar'],
  ['El Mundo','culminación, integración, logro','reconocer un ciclo completo y ocupar el lugar que ganaste','no terminar, minimizar lo logrado o seguir girando dentro de una etapa ya cumplida'],
] as const;

const suitDefs: Record<Suit,{theme:string;element:string;light:string;shadow:string}> = {
  Oros:{theme:'cuerpo, recursos, trabajo, seguridad y realidad material',element:'tierra',light:'dar forma y sostén',shadow:'aferrarte a lo seguro'},
  Copas:{theme:'afecto, vínculos, deseo, memoria y sensibilidad',element:'agua',light:'sentir y vincularte',shadow:'idealizar o desbordarte'},
  Espadas:{theme:'pensamiento, verdad, decisiones, conflicto y lenguaje',element:'aire',light:'ver con claridad',shadow:'quedar atrapado en la mente'},
  Bastos:{theme:'deseo, impulso, vocación, energía y acción',element:'fuego',light:'encender movimiento',shadow:'quemar energía sin dirección'},
};

const ranks = ['As','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho','Nueve','Diez','Sota','Caballero','Reina','Rey'];

const minorMeanings: Record<Suit, MinorDef[]> = {
  Oros:[
    {keywords:['oportunidad concreta','semilla material','cuerpo'],light:'abrir una posibilidad concreta y cultivarla con paciencia',shadow:'dejar pasar una oportunidad por miedo, inseguridad o exceso de cálculo'},
    {keywords:['equilibrio','adaptación','recursos'],light:'administrar varias demandas sin perder flexibilidad',shadow:'sostener demasiado a la vez, improvisar sin base o vivir apagando incendios'},
    {keywords:['trabajo conjunto','oficio','reconocimiento'],light:'construir con otros, aprender y permitir que tu capacidad sea vista',shadow:'sentirte subvalorado, trabajar sin coordinación o buscar validación externa'},
    {keywords:['seguridad','control','posesión'],light:'conservar recursos y establecer una base estable',shadow:'cerrarte por miedo a perder, controlar o confundir posesión con seguridad'},
    {keywords:['carencia','exclusión','vulnerabilidad'],light:'reconocer una necesidad y aceptar apoyo sin vergüenza',shadow:'quedar identificado con la escasez, aislarte o sentir que no hay salida'},
    {keywords:['intercambio','dar y recibir','reciprocidad'],light:'restablecer equilibrio entre lo que ofrecés y lo que recibís',shadow:'dar para controlar, recibir desde dependencia o sostener una deuda emocional'},
    {keywords:['espera','evaluación','inversión'],light:'mirar qué está creciendo y ajustar antes de seguir invirtiendo',shadow:'impacientarte, persistir por costo hundido o esperar fruto donde ya no hay crecimiento'},
    {keywords:['disciplina','oficio','repetición'],light:'perfeccionar una capacidad con constancia y atención al detalle',shadow:'trabajar en automático, obsesionarte con hacerlo perfecto o reducir tu valor a productividad'},
    {keywords:['autonomía','cosecha','valor propio'],light:'disfrutar lo construido y reconocer tu suficiencia sin aislarte',shadow:'encerrarte en autosuficiencia, medir tu valor por logros o temer depender de alguien'},
    {keywords:['legado','familia','estabilidad'],light:'pensar a largo plazo, pertenecer y consolidar una estructura compartida',shadow:'quedar atrapado en expectativas familiares, estatus o una seguridad que ya no te representa'},
    {keywords:['aprendizaje','noticia concreta','nueva habilidad'],light:'volver a aprender con curiosidad y poner una idea en práctica',shadow:'quedarte preparando, dudar de tu capacidad o esperar sentirte experto antes de empezar'},
    {keywords:['constancia','responsabilidad','rutina'],light:'avanzar de manera firme, realista y confiable',shadow:'estancarte por rutina, resistir cambios o avanzar tan lento que perdés el impulso'},
    {keywords:['cuidado','cuerpo','abundancia práctica'],light:'crear bienestar, cuidar recursos y sostener sin perderte',shadow:'hacerte cargo de todo, maternizar a otros o olvidar tus propias necesidades'},
    {keywords:['dominio material','gestión','seguridad'],light:'administrar con madurez, visión práctica y responsabilidad',shadow:'medir todo por utilidad, controlar con recursos o proteger tanto que inmovilizás'},
  ],
  Copas:[
    {keywords:['apertura emocional','afecto','intuición'],light:'permitir que nazca una emoción, vínculo o sensibilidad nueva',shadow:'cerrarte por miedo a sentir o desbordarte sin contención'},
    {keywords:['encuentro','reciprocidad','acuerdo'],light:'reconocer un vínculo donde existe intercambio real y mutuo',shadow:'idealizar la unión, perderte en el otro o evitar una conversación necesaria'},
    {keywords:['celebración','amistad','comunidad'],light:'compartir, apoyarte en otros y permitir alegría colectiva',shadow:'distraerte con lo social, triangular o buscar pertenencia a cualquier precio'},
    {keywords:['apatía','revisión','desconexión'],light:'detenerte a reconocer qué ya no te satisface y qué oferta no estás viendo',shadow:'cerrarte, aburrirte de todo o rechazar por inercia algo que merece atención'},
    {keywords:['duelo','pérdida','decepción'],light:'hacer lugar al dolor sin negar lo que todavía permanece disponible',shadow:'quedarte mirando únicamente lo perdido o convertir la decepción en identidad'},
    {keywords:['memoria','pasado','ternura'],light:'recuperar algo valioso de tu historia sin tener que volver a vivirla',shadow:'idealizar el pasado, infantilizarte o buscar refugio en lo que ya fue'},
    {keywords:['opciones','fantasía','proyección'],light:'explorar deseos posibles y distinguir imaginación de elección real',shadow:'dispersarte, fantasear para no decidir o enamorarte de una posibilidad más que de la realidad'},
    {keywords:['retiro','despedida','búsqueda'],light:'alejarte de algo que ya no te llena aunque todavía tenga valor afectivo',shadow:'huir sin elaborar, irte esperando que el vacío se resuelva solo o volver por culpa'},
    {keywords:['satisfacción','deseo','bienestar'],light:'reconocer lo que sí te hace bien y permitirte disfrutarlo',shadow:'buscar gratificación como anestesia, complacerte sin profundidad o depender de que todo salga como querés'},
    {keywords:['plenitud afectiva','familia','pertenencia'],light:'construir una experiencia emocional compartida y suficientemente verdadera',shadow:'idealizar la armonía familiar, tapar conflictos o vivir para sostener una imagen de felicidad'},
    {keywords:['sensibilidad','mensaje emocional','intuición'],light:'escuchar una emoción nueva, una señal delicada o una expresión creativa',shadow:'tomarte todo personalmente, confundir intuición con fantasía o esperar mensajes en vez de hablar'},
    {keywords:['búsqueda afectiva','romance','ideal'],light:'moverte hacia lo que amás y expresar sentimientos con belleza y coraje',shadow:'enamorarte de la idea, prometer más de lo que podés sostener o evitar lo cotidiano'},
    {keywords:['empatía','profundidad emocional','percepción'],light:'sentir profundamente sin perder tu centro y comprender lo no dicho',shadow:'absorber estados ajenos, sobreadaptarte o usar sensibilidad sin límites'},
    {keywords:['madurez emocional','regulación','compasión'],light:'sostener emoción intensa con estabilidad, escucha y responsabilidad',shadow:'controlar lo que sentís hasta desconectarte o mantener calma externa mientras acumulás adentro'},
  ],
  Espadas:[
    {keywords:['claridad','verdad','decisión'],light:'nombrar la verdad y cortar confusión con una decisión clara',shadow:'usar la verdad como arma, racionalizar o creer que pensar más resolverá todo'},
    {keywords:['bloqueo','evitación','encrucijada'],light:'reconocer que hay una decisión suspendida y reunir información sin precipitarte',shadow:'no elegir para no perder, cerrar los ojos a un hecho o mantener un equilibrio imposible'},
    {keywords:['dolor','separación','verdad incómoda'],light:'aceptar una verdad dolorosa para que el duelo pueda empezar',shadow:'reabrir la herida, identificarte con el rechazo o convertir dolor en argumento contra vos'},
    {keywords:['reposo','recuperación','silencio mental'],light:'parar, integrar y permitir que el sistema recupere energía',shadow:'aislarte demasiado, posponer indefinidamente o confundir agotamiento con falta de deseo'},
    {keywords:['conflicto','ego','victoria amarga'],light:'ver qué precio tiene ganar una disputa y elegir tus batallas',shadow:'necesitar tener razón, humillar o quedarte en una lucha que ya no produce nada'},
    {keywords:['transición','distancia','pasaje'],light:'moverte hacia una etapa más tranquila aunque todavía lleves parte del pasado contigo',shadow:'cambiar de escenario sin cambiar el patrón o marcharte sin nombrar lo pendiente'},
    {keywords:['estrategia','secreto','evasión'],light:'actuar con inteligencia, discreción y autonomía cuando no todo debe exponerse',shadow:'autoengaño, ocultamiento, escapismo o una estrategia que erosiona confianza'},
    {keywords:['restricción','miedo','prisión mental'],light:'reconocer qué límite es real y cuál está sostenido por miedo o creencias antiguas',shadow:'sentirte sin salida, pedir permiso para moverte o ceder poder a una narrativa interna'},
    {keywords:['ansiedad','culpa','rumiación'],light:'nombrar el miedo y distinguir pensamiento nocturno de realidad comprobable',shadow:'castigarte mentalmente, anticipar catástrofes o quedar atrapado en escenarios imaginados'},
    {keywords:['final','agotamiento','colapso'],light:'aceptar que algo llegó a su límite y dejar de exigirle continuidad',shadow:'dramatizar el cierre, sentirte derrotado para siempre o insistir en lo irreparable'},
    {keywords:['observación','curiosidad','vigilancia'],light:'preguntar, investigar y mirar una situación desde nuevos ángulos',shadow:'hipervigilar, sacar conclusiones rápidas o consumir información sin experiencia directa'},
    {keywords:['velocidad','confrontación','decisión'],light:'actuar con convicción cuando la claridad ya llegó',shadow:'precipitarte, discutir para descargar tensión o avanzar sin escuchar consecuencias'},
    {keywords:['discernimiento','límites','independencia'],light:'decir lo necesario con claridad y proteger tu criterio sin endurecerte',shadow:'cortar demasiado rápido, intelectualizar el dolor o usar distancia como defensa permanente'},
    {keywords:['autoridad mental','criterio','verdad'],light:'ordenar información, decidir con rigor y sostener una palabra responsable',shadow:'volverte frío, autoritario o usar lógica para invalidar lo emocional'},
  ],
  Bastos:[
    {keywords:['chispa','deseo','comienzo'],light:'seguir una energía nueva y darle una primera forma concreta',shadow:'entusiasmarte sin sostener, buscar estímulo constante o empezar para escapar'},
    {keywords:['planificación','horizonte','elección'],light:'mirar más allá de lo conocido y decidir qué expansión querés intentar',shadow:'quedarte imaginando posibilidades sin salir de la zona segura'},
    {keywords:['expansión','resultados','proyección'],light:'ver que algo ya salió al mundo y ajustar tu dirección con perspectiva',shadow:'esperar resultados sin participar, sobreextenderte o vivir pendiente de lo que viene'},
    {keywords:['celebración','hogar','estabilidad'],light:'reconocer una base firme, compartir un logro y sentir pertenencia',shadow:'querer que todo parezca estable, aferrarte a la aprobación del grupo o temer mover lo construido'},
    {keywords:['fricción','competencia','diversidad'],light:'usar diferencias y tensión como combustible creativo y aprendizaje',shadow:'discutir por posición, dispersar energía o vivir cada desacuerdo como amenaza'},
    {keywords:['reconocimiento','avance','visibilidad'],light:'permitirte recibir reconocimiento y asumir la posición que ganaste',shadow:'depender del aplauso, inflarte con la validación o temer caer después de ser visto'},
    {keywords:['defensa','posición','límites'],light:'sostener tu lugar aunque haya presión externa y elegir qué defendés',shadow:'vivir a la defensiva, pelear con amenazas imaginarias o agotarte justificándote'},
    {keywords:['aceleración','mensaje','movimiento'],light:'aprovechar una ventana de velocidad y dejar que las cosas avancen',shadow:'ir demasiado rápido, saturarte de estímulos o confundir urgencia con importancia'},
    {keywords:['resistencia','cautela','último esfuerzo'],light:'reconocer cuánto ya atravesaste y proteger lo que importa sin abandonar',shadow:'esperar otro golpe, endurecerte por experiencias previas o perseverar solo por orgullo'},
    {keywords:['carga','responsabilidad','sobrecarga'],light:'ordenar responsabilidades y terminar lo que sí te corresponde',shadow:'cargar con todo, demostrar valor mediante sacrificio o no delegar por control'},
    {keywords:['exploración','curiosidad','noticia'],light:'probar una dirección nueva con entusiasmo y mente abierta',shadow:'buscar novedad para no profundizar o abandonar cuando baja la excitación inicial'},
    {keywords:['impulso','aventura','conquista'],light:'moverte con decisión, coraje y deseo hacia una experiencia nueva',shadow:'impulsividad, intensidad sin continuidad o actuar antes de saber qué querés'},
    {keywords:['confianza','magnetismo','autonomía'],light:'ocupar tu espacio, confiar en tu deseo y contagiar vitalidad sin pedir permiso',shadow:'necesitar atención, dominar la escena o esconder inseguridad detrás de intensidad'},
    {keywords:['visión','liderazgo','dirección'],light:'convertir deseo en dirección, asumir liderazgo y pensar a largo plazo',shadow:'imponer tu visión, aburrirte con la ejecución o confundir autoridad con control'},
  ],
};

export const tarotDeck: TarotCard[] = [
  ...majors.map((m,i)=>({id:i,name:m[0],arcana:'major' as const,number:i,keywords:m[1].split(', '),light:m[2],shadow:m[3]})),
  ...(['Oros','Copas','Espadas','Bastos'] as Suit[]).flatMap((suit,suitIndex)=>
    ranks.map((rank,i)=>({
      id:22+suitIndex*14+i,
      name:`${rank} de ${suit}`,
      arcana:'minor' as const,
      suit,
      number:i+1,
      ...minorMeanings[suit][i],
    }))
  ),
];

export const spreadPositions = [
  {key:'root',label:'Raíz / subyacencia'},
  {key:'past',label:'Pasado activo'},
  {key:'core',label:'Núcleo del momento'},
  {key:'present',label:'Presente visible'},
  {key:'blind',label:'Zona ciega'},
  {key:'future',label:'Tendencia'},
  {key:'action',label:'Orientación / acción'},
] as const;

function hashSeed(seed:string){let h=2166136261;for(let i=0;i<seed.length;i++)h=Math.imul(h^seed.charCodeAt(i),16777619);return h>>>0}
function rand(state:number){state+=0x6d2b79f5;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return [((t^(t>>>14))>>>0)/4294967296,state>>>0] as const}

export function shuffleDeck(seed:string){
  const cards=tarotDeck.map((card,i)=>({card,reversed:false,order:i}));
  let state=hashSeed(seed);
  for(let i=cards.length-1;i>0;i--){const [r,next]=rand(state);state=next;const j=Math.floor(r*(i+1));[cards[i],cards[j]]=[cards[j],cards[i]]}
  return cards.map((x,i)=>{const[r,next]=rand(state+i);state=next;return{...x,reversed:r<0.26}})
}

export type Drawn = {card:TarotCard;reversed:boolean;deckIndex:number;position:number;clarifierFor?:number};

function cardName(d:Drawn){return `${d.card.name}${d.reversed?' invertida':''}`}
function meaning(d:Drawn){return d.reversed?d.card.shadow:d.card.light}
function kw(d:Drawn){return d.card.keywords.slice(0,3).join(', ')}

function suitPattern(cards:Drawn[]){
  const counts=cards.reduce<Record<string,number>>((a,c)=>{if(c.card.suit)a[c.card.suit]=(a[c.card.suit]||0)+1;return a},{});
  const sorted=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  const dominant=sorted[0] as [Suit,number]|undefined;
  if(!dominant||dominant[1]<2)return 'No hay un palo que monopolice la lectura: el asunto toca varias capas de tu vida al mismo tiempo.';
  const [suit,count]=dominant;
  return `${count} cartas de ${suit} cargan especialmente el plano de ${suitDefs[suit].theme}. El tema de fondo no parece abstracto: pide trabajar esa zona en concreto.`;
}

function relationalPattern(cards:Drawn[]){
  const suits=new Set(cards.map(c=>c.card.suit).filter(Boolean));
  if(suits.has('Copas')&&suits.has('Espadas'))return 'Copas y Espadas aparecen juntas: hay una conversación incómoda entre lo que sentís y lo que pensás. Una parte quiere proteger el vínculo o el deseo; otra necesita nombrar una verdad.';
  if(suits.has('Oros')&&suits.has('Bastos'))return 'Oros y Bastos se responden: no alcanza con querer el cambio; la tirada pide convertir impulso en estructura, tiempo, cuerpo y recursos concretos.';
  if(suits.has('Copas')&&suits.has('Oros'))return 'Copas y Oros mezclan afecto con seguridad: conviene observar cuánto de una decisión emocional también está condicionada por pertenencia, estabilidad o miedo a perder una base conocida.';
  if(suits.has('Espadas')&&suits.has('Bastos'))return 'Espadas y Bastos elevan la intensidad mental y la urgencia de actuar. El punto no es moverte más rápido, sino conseguir que decisión y deseo vayan en la misma dirección.';
  return 'La tirada no se organiza alrededor de una sola tensión elemental; el movimiento aparece repartido y pide una mirada más amplia que una única causa.';
}

function numberPattern(cards:Drawn[]){
  const nums=cards.filter(c=>c.card.arcana==='minor'&&c.card.number&&c.card.number<=10).map(c=>c.card.number!);
  const counts=nums.reduce<Record<number,number>>((a,n)=>{a[n]=(a[n]||0)+1;return a},{});
  const repeated=Object.entries(counts).filter(([,c])=>c>=2).sort((a,b)=>Number(a[0])-Number(b[0]));
  if(repeated.length)return `Hay repetición del número ${repeated.map(([n])=>n).join(' y ')}. Cuando un número vuelve, la lectura suele insistir en un mismo estadio del proceso: algo no está apareciendo una sola vez, está pidiendo elaboración.`;
  return '';
}

export function buildReading(cards:Drawn[], question=''){
  const [root,past,core,present,blind,future,action]=cards;
  const majorsCount=cards.filter(c=>c.card.arcana==='major').length;
  const reversedCount=cards.filter(c=>c.reversed).length;
  const dominant=suitPattern(cards);
  const relation=relationalPattern(cards);
  const numbers=numberPattern(cards);
  const questionFrame=question.trim()?`Tomando como eje tu pregunta —“${question.trim()}”—, `:'';

  const rootCoreAgreement=root.card.suit&&core.card.suit&&root.card.suit===core.card.suit;
  const rootCore=`${cardName(root)} en la raíz y ${cardName(core)} en el núcleo ${rootCoreAgreement?'hablan el mismo idioma':'no cuentan exactamente la misma historia'}. `+
    `${rootCoreAgreement?`Hay continuidad entre lo que opera por debajo y lo que ya empezó a hacerse consciente: ambos llevan la atención a ${suitDefs[root.card.suit!].theme}.`:`Por debajo aparece ${meaning(root)}, mientras en el centro de tu experiencia aparece ${meaning(core)}. Esa diferencia importa: podés estar intentando resolver en un plano algo cuyo origen está en otro.`}`;

  const timeArc=`El pasado activo, ${cardName(past)}, no aparece como un recuerdo cerrado: trae ${kw(past)} y todavía colorea el presente. `+
    `Ahora ${cardName(present)} muestra ${meaning(present)}. Y hacia adelante, ${cardName(future)} no marca una sentencia, sino una dirección probable: ${meaning(future)}. `+
    `${past.reversed||present.reversed||future.reversed?'Hay al menos una inversión en este eje temporal, así que el avance no parece lineal: parte del movimiento puede estar ocurriendo primero por dentro, como revisión, resistencia o cambio de perspectiva.':'El eje temporal se presenta relativamente abierto: lo que hagas en el presente tiene margen real para modificar la tendencia.'}`;

  const blindAction=`La zona ciega es uno de los puntos más importantes: ${cardName(blind)} sugiere ${meaning(blind)}. `+
    `No necesariamente es algo que “no sabés”; puede ser algo que ya intuís pero todavía no querés mirar de frente o no terminás de traducir en conducta. `+
    `La respuesta de la tirada aparece en ${cardName(action)}: ${meaning(action)}. Dicho de otro modo, la acción no viene a borrar la zona ciega, sino a obligarte a relacionarte con ella de otra manera.`;

  const intensity=majorsCount>=4
    ?`Hay ${majorsCount} Arcanos Mayores entre siete posiciones. Eso le da a la tirada un peso estructural: no parece una anécdota pasajera, sino una etapa que toca identidad, decisiones de fondo o cambio de ciclo.`
    :majorsCount>=2
      ?`Los ${majorsCount} Arcanos Mayores señalan que, junto a cuestiones cotidianas, hay un aprendizaje más profundo intentando organizar la experiencia.`
      :`Predominan los Arcanos Menores: el asunto puede sentirse importante, pero la lectura lo coloca especialmente en el terreno de decisiones, hábitos, conversaciones y acciones modificables.`;

  const reversals=reversedCount>=3
    ?`${reversedCount} cartas invertidas concentran energía hacia adentro. Antes de pensar “bloqueo”, miraría dónde hay ambivalencia, cansancio, miedo a perder algo o una verdad que todavía no encuentra forma de salir.`
    :reversedCount>0
      ?`${reversedCount} carta${reversedCount>1?'s':''} invertida${reversedCount>1?'s':''} introduce${reversedCount>1?'n':''} matices de demora, interiorización o resistencia; no anula${reversedCount>1?'n':''} la carta, pero obliga${reversedCount>1?'n':''} a leer qué cuesta expresar.`
      :`No hay inversiones en la tirada. La energía aparece más exteriorizada: el problema no parece ser tanto no saber qué pasa, sino qué hacés con lo que ya está disponible.`;

  const moment=`${questionFrame}lo primero que destaca no es una carta aislada, sino la relación entre la raíz y el centro. ${rootCore} ${dominant}`;
  const behind=`${cardName(root)} muestra que el asunto viene sostenido por ${meaning(root)}. ${cardName(past)} agrega una historia todavía activa alrededor de ${kw(past)}. Esto sugiere que el presente no empezó hoy: hay una continuidad que conviene reconocer para no tratar como “nuevo” un patrón que ya tiene antecedentes.`;
  const seen=`En lo visible está ${cardName(present)}. Acá la tirada señala ${meaning(present)}. Es posible que esta sea la parte que ya podés explicar, contar o justificar. La pregunta es si tu conducta acompaña esa comprensión o si todavía existe distancia entre lo que sabés y lo que hacés.`;
  const blindText=`${blindAction} ${relation}`;
  const tension=`${intensity} ${reversals}${numbers?` ${numbers}`:''}`;
  const movement=`${timeArc} Lo más útil es mirar la tendencia como consecuencia de un modo de posicionarte, no como un futuro escrito.`;
  const actionText=`${cardName(action)} pone la orientación en ${kw(action)}. En términos prácticos: ${meaning(action)}. Si tuvieras que traducir toda la tirada a un movimiento pequeño pero real, tendría que parecerse a esto antes que a una gran promesa o a esperar una señal externa.`;
  const psychology=`Psicológicamente, la lectura muestra una posible distancia entre la necesidad profunda de la raíz (${cardName(root)}) y la forma en que hoy intentás organizarte desde el núcleo (${cardName(core)}). La zona ciega (${cardName(blind)}) marca el punto donde esa distancia puede convertirse en repetición: lo que no se integra suele volver como duda, exceso de control, postergación, sobreesfuerzo o elección automática. La orientación (${cardName(action)}) no te pide ser otra persona; te pide recuperar margen de decisión frente a ese automatismo.`;
  const synthesis=`Si junto toda la tirada, no veo siete mensajes separados. Veo una historia: ${cardName(past)} deja una huella, ${cardName(core)} muestra dónde estás parado hoy, ${cardName(blind)} señala lo que puede estar condicionando sin ocupar todavía el centro de tu atención, y ${cardName(future)} muestra hacia dónde tiende el movimiento si la dinámica se mantiene. La llave está en ${cardName(action)}. ${relation} ${dominant} La lectura no afirma que “esto va a pasar”; muestra qué dinámica está viva y qué parte de ella todavía depende de vos.`;

  return {moment,behind,seen,blind:blindText,tension,movement,action:actionText,psychology,synthesis};
}
