import {GenreCategory} from '../utils/graphql';

import iconPop from './assets/pop.svg';
import iconRock from './assets/rock.svg';
import iconIndie from './assets/indie.svg';
import iconMetal from './assets/metal.svg';
import iconCountry from './assets/country.svg';
import iconHipHop from './assets/hip_hop.svg';
import iconJazz from './assets/jazz.svg';
import iconHippie from './assets/hippie.svg';
import iconDisco from './assets/disco.svg';
import iconVocal from './assets/vocal.svg';

export const GENRE_ICONS: Map<GenreCategory, string> = new Map([
  [GenreCategory.Pop, iconPop],
  [GenreCategory.Rock, iconRock],
  [GenreCategory.Indie, iconIndie],
  [GenreCategory.HardrockMetalPunk, iconMetal],
  [GenreCategory.FolkSingerSongwriterCountry, iconCountry],
  [GenreCategory.ElektroHipHop, iconHipHop],
  [GenreCategory.BluesFunkJazzSoul, iconJazz],
  [GenreCategory.ReggaeSka, iconHippie],
  [GenreCategory.Dj, iconDisco],
  [GenreCategory.Other, iconVocal],
]);

export const GENRE_CATEGORIES: Map<GenreCategory, string> = new Map([
  [GenreCategory.Pop, 'Pop'],
  [GenreCategory.Rock, 'Rock'],
  [GenreCategory.Indie, 'Indie'],
  [GenreCategory.HardrockMetalPunk, 'Hardrock / Metal / Punk'],
  [
    GenreCategory.FolkSingerSongwriterCountry,
    'Folk / Singer/Songwriter / Country',
  ],
  [GenreCategory.ElektroHipHop, 'Elektro / Hip-Hop'],
  [GenreCategory.BluesFunkJazzSoul, 'Blues / Funk / Jazz / Soul'],
  [GenreCategory.ReggaeSka, 'Reggae / Ska'],
  [GenreCategory.Dj, 'DJ'],
  [GenreCategory.Other, 'andere Musikrichtung'],
]);
