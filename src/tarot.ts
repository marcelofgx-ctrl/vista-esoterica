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

const majors = [
  ['El Loco','inicio, libertad, salto','apertura a lo desconocido','impulsividad sin anclaje'],
  ['El Mago','voluntad, recursos, inicio','capacidad de actuar','control o manipulación'],
  ['La Sacerdotisa','intuición, silencio, profundidad','escucha interior','repliegue o secreto'],
  ['La Emperatriz','creación, nutrición, abundancia','fertilidad creadora','sobreprotección'],
  ['El Emperador','estructura, orden, autoridad','capacidad de sostener','rigidez'],
  ['El Hierofante','tradición, sentido, enseñanza','marco de valores','dogmatismo'],
  ['Los Enamorados','elección, vínculo, valores','decisión alineada','ambivalencia'],
  ['El Carro','avance, dirección, voluntad','movimiento enfocado','prisa o control'],
  ['La Fuerza','coraje, integración, dominio interno','serenidad activa','represión o desgaste'],
  ['El Ermitaño','retiro, búsqueda, discernimiento','claridad interior','aislamiento'],
  ['La Rueda','cambio, ciclo, giro','apertura al movimiento','resistencia al cambio'],
  ['La Justicia','equilibrio, verdad, consecuencia','discernimiento objetivo','juicio rígido'],
  ['El Colgado','pausa, entrega, nueva mirada','cambio de perspectiva','estancamiento'],
  ['La Muerte','cierre, transformación, desprendimiento','renovación profunda','apego'],
  ['La Templanza','integración, armonía, proceso','equilibrio dinámico','dilución'],
  ['El Diablo','deseo, apego, sombra','contacto con lo reprimido','dependencia'],
  ['La Torre','ruptura, revelación, derrumbe','liberación de lo falso','crisis reactiva'],
  ['La Estrella','esperanza, autenticidad, renovación','alineación y confianza','idealización'],
  ['La Luna','inconsciente, sensibilidad, ambigüedad','imaginación profunda','confusión o proyección'],
  ['El Sol','claridad, vitalidad, expresión','visibilidad y confianza','sobreexposición'],
  ['El Juicio','despertar, llamado, revisión','reconocimiento y decisión','culpa o autojuicio'],
  ['El Mundo','culminación, integración, logro','cierre fértil','dificultad para cerrar'],
] as const;

const suitDefs: Record<Suit,{nouns:string[];light:string;shadow:string}> = {
  Oros:{nouns:['recursos','cuerpo','trabajo','seguridad'],light:'construcción concreta',shadow:'apego a la seguridad'},
  Copas:{nouns:['afecto','vínculo','sensibilidad','deseo'],light:'apertura emocional',shadow:'desborde o idealización'},
  Espadas:{nouns:['mente','decisión','verdad','conflicto'],light:'claridad mental',shadow:'tensión o rumiación'},
  Bastos:{nouns:['impulso','vocación','energía','acción'],light:'iniciativa vital',shadow:'dispersión o impaciencia'},
};

const ranks = ['As','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho','Nueve','Diez','Sota','Caballero','Reina','Rey'];

export const tarotDeck: TarotCard[] = [
  ...majors.map((m,i)=>({id:i,name:m[0],arcana:'major' as const,number:i,keywords:m[1].split(', '),light:m[2],shadow:m[3]})),
  ...(['Oros','Copas','Espadas','Bastos'] as Suit[]).flatMap((suit,suitIndex)=>
    ranks.map((rank,i)=>({
      id:22+suitIndex*14+i,
      name:`${rank} de ${suit}`,
      arcana:'minor' as const,
      suit,
      number:i+1,
      keywords:[suitDefs[suit].nouns[i%4],suitDefs[suit].nouns[(i+1)%4],i<5?'inicio':i<10?'desarrollo':'madurez'],
      light:suitDefs[suit].light,
      shadow:suitDefs[suit].shadow,
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

export function buildReading(cards:Drawn[]){
  const majorsCount=cards.filter(c=>c.card.arcana==='major').length;
  const suitCounts=cards.reduce<Record<string,number>>((a,c)=>{if(c.card.suit)a[c.card.suit]=(a[c.card.suit]||0)+1;return a},{});
  const dominantSuit=Object.entries(suitCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] as Suit|undefined;
  const reversed=cards.filter(c=>c.reversed).length;
  const root=cards[0]?.card, core=cards[2]?.card, blind=cards[4]?.card, future=cards[5]?.card, action=cards[6]?.card;
  const dominant=dominantSuit?`Hay una presencia marcada de ${dominantSuit.toLowerCase()}: ${suitDefs[dominantSuit].nouns.join(', ')}.`:'La tirada distribuye su energía entre distintos planos, sin un único elemento dominante.';
  return {
    moment:`${core?.name} sitúa el foco en ${core?.keywords.join(', ')}. ${dominant}`,
    behind:`${root?.name} muestra que debajo de lo visible opera ${root?.light}. Ese clima de fondo sigue influyendo en las decisiones actuales.`,
    seen:'Hay elementos que ya se reconocen. La cuestión no es solamente comprenderlos, sino observar si esa comprensión está produciendo una acción coherente.',
    blind:`${blind?.name} pone atención sobre ${blind?.keywords.join(', ')}. Puede tratarse menos de algo oculto afuera que de un aspecto propio todavía no integrado.`,
    tension:`${reversed?`${reversed} carta${reversed>1?'s':''} invertida${reversed>1?'s':''} muestran resistencia, demora o energía vuelta hacia adentro.`:'No hay una gran concentración de inversiones.'} ${majorsCount>=3?`Los ${majorsCount} Arcanos Mayores le dan al momento un peso estructural.`:'Predominan procesos cotidianos y trabajables.'}`,
    movement:`${future?.name} orienta el movimiento hacia ${future?.light}. Es una tendencia, no un destino fijo.`,
    action:`${action?.name} sugiere atender ${action?.keywords.join(', ')} y traducir esa energía en una conducta concreta.`,
    psychology:'Desde una mirada psicológica, la tirada observa la relación entre lo que percibís, lo que evitás o postergás y los recursos que ya están disponibles. El eje útil es detectar contradicciones entre deseo, pensamiento y acción, sin convertir la lectura en diagnóstico.',
    synthesis:'La tirada muestra una raíz todavía activa, un presente que pide discernimiento y una tendencia que puede cambiar según las decisiones. Funciona como espejo del movimiento actual, no como sentencia.',
  };
}
