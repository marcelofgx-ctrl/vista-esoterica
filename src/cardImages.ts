import type { TarotCard } from './tarot';

const majorNames = [
  'Fool','Magician','High Priestess','Empress','Emperor','Hierophant','Lovers','Chariot','Strength','Hermit',
  'Wheel of Fortune','Justice','Hanged Man','Death','Temperance','Devil','Tower','Star','Moon','Sun','Judgement','World',
] as const;

const suitFiles = {
  Oros: 'Pentacles',
  Copas: 'Cups',
  Espadas: 'Swords',
  Bastos: 'Wands',
} as const;

function twoDigits(value:number){
  return String(value).padStart(2,'0');
}

function filenameFor(card:TarotCard){
  if(card.arcana==='major'){
    const number=card.number ?? 0;
    return `RWS1909 - ${twoDigits(number)} ${majorNames[number]}.jpeg`;
  }

  const suit=card.suit ? suitFiles[card.suit] : 'Wands';
  return `RWS1909 - ${suit} ${twoDigits(card.number ?? 1)}.jpeg`;
}

export function tarotImageUrl(card:TarotCard,width=420){
  const filename=filenameFor(card);
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`;
}
