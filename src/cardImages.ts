import type { TarotCard } from './tarot';

const majorFiles: Record<string, string> = {
  'El Loco': 'The Fool',
  'El Mago': 'The Magician',
  'La Sacerdotisa': 'The High Priestess',
  'La Emperatriz': 'The Empress',
  'El Emperador': 'The Emperor',
  'El Hierofante': 'The Hierophant',
  'Los Enamorados': 'The Lovers',
  'El Carro': 'The Chariot',
  'La Fuerza': 'Strength',
  'El Ermitaño': 'The Hermit',
  'La Rueda': 'Wheel of Fortune',
  'La Justicia': 'Justice',
  'El Colgado': 'The Hanged Man',
  'La Muerte': 'Death',
  'La Templanza': 'Temperance',
  'El Diablo': 'The Devil',
  'La Torre': 'The Tower',
  'La Estrella': 'The Star',
  'La Luna': 'The Moon',
  'El Sol': 'The Sun',
  'El Juicio': 'Judgement',
  'El Mundo': 'The World',
};

const rankFiles: Record<string, string> = {
  As: 'Ace',
  Dos: 'Two',
  Tres: 'Three',
  Cuatro: 'Four',
  Cinco: 'Five',
  Seis: 'Six',
  Siete: 'Seven',
  Ocho: 'Eight',
  Nueve: 'Nine',
  Diez: 'Ten',
  Sota: 'Page',
  Caballero: 'Knight',
  Reina: 'Queen',
  Rey: 'King',
};

const suitFiles = {
  Oros: 'Pentacles',
  Copas: 'Cups',
  Espadas: 'Swords',
  Bastos: 'Wands',
} as const;

function imageTitle(card: TarotCard) {
  if (card.arcana === 'major') return majorFiles[card.name] ?? card.name;

  const [spanishRank] = card.name.split(' de ');
  let rank = rankFiles[spanishRank] ?? spanishRank;
  const suit = card.suit ? suitFiles[card.suit] : '';

  // In the cleaned 78-card Commons set these two files are named "One", not "Ace".
  if (rank === 'Ace' && (suit === 'Pentacles' || suit === 'Swords')) rank = 'One';

  return `${rank} of ${suit}`;
}

export function tarotImageUrl(card: TarotCard, width = 420) {
  const filename = `${imageTitle(card)} (Rider-Waite Smith tarot deck).png`;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`;
}
