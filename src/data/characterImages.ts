import { CharacterId } from '../types';

import reiImg from '../assets/images/rei_anime_portrait_1789617682178.jpg';
import kairoImg from '../assets/images/kairo_anime_portrait_1789617696982.jpg';
import yuumaImg from '../assets/images/yuuma_anime_portrait_1789617713870.jpg';
import kiraImg from '../assets/images/kira_anime_portrait_1789617730154.jpg';
import renImg from '../assets/images/ren_anime_portrait_1789617744396.jpg';
import airaImg from '../assets/images/aira_anime_portrait_1789617757389.jpg';

export const CHARACTER_ANIME_PORTRAITS: Record<CharacterId | 'aira', string> = {
  rei: reiImg,
  kairo: kairoImg,
  yuuma: yuumaImg,
  kira: kiraImg,
  ren: renImg,
  aira: airaImg,
};

export function getCharacterPortrait(id?: string | null): string {
  if (!id) return CHARACTER_ANIME_PORTRAITS.aira;
  const key = id.toLowerCase() as CharacterId | 'aira';
  return CHARACTER_ANIME_PORTRAITS[key] || CHARACTER_ANIME_PORTRAITS.aira;
}
