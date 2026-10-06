export type SocialType =
  | 'facebook' | 'instagram' | 'twitter' | 'youtube'
  | 'tiktok' | 'spotify' | 'linkedin' | 'web';

export interface SocialMeta {
  label: string;
  /** Color de marca (fondo del icono). */
  color: string;
  /** Texto que describe la acción en el modal. */
  action: string;
}

export const SOCIAL_META: Record<SocialType, SocialMeta> = {
  facebook:  { label: 'Facebook',  color: '#1877F2', action: 'Visitar página' },
  instagram: { label: 'Instagram', color: 'linear-gradient(45deg,#F58529,#DD2A7B 50%,#8134AF)', action: 'Ver perfil' },
  twitter:   { label: 'X (Twitter)', color: '#000000', action: 'Ver perfil' },
  youtube:   { label: 'YouTube',   color: '#FF0000', action: 'Ver canal' },
  tiktok:    { label: 'TikTok',    color: '#010101', action: 'Ver perfil' },
  spotify:   { label: 'Spotify',   color: '#1DB954', action: 'Escuchar' },
  linkedin:  { label: 'LinkedIn',  color: '#0A66C2', action: 'Ver perfil' },
  web:       { label: 'Sitio web', color: '#475569', action: 'Visitar sitio' },
};

/** Normaliza un tipo desconocido a 'web'. */
export function socialType(t: string | undefined): SocialType {
  return t && t in SOCIAL_META ? (t as SocialType) : 'web';
}
