export interface ArmorStats {
  def(): number;
  mdef(): number;
}

export interface WeaponStats {
  atk(): number;
  matk(): number;
}

export interface BaseStats {
  str(): number;
  int(): number;
  dex(): number;
}

export interface CraefterStats extends BaseStats {
  // craefter exclusive
  luk(): number;
}

export interface PlayerStats extends BaseStats {
  // player specific
  vit(): number;
  agi(): number;
}
