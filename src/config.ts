// create debug flag to fall back to debug values
import { Rarities } from "./data";

const debug =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_DEBUG === "true";

export const config = {
  // detect debug
  debug,

  name: "Cräft!",
  subLogo: "Alpha",

  // general config
  useLocalStorage: false,
  compressLocalStorage: true,

  // game parameters
  startResources: debug ? 1000 : 0,
  startDelay: 1, // 1 second

  // everything happens instantly
  instant: debug,

  // how fast should the ticker update?
  tickerTick: 0.2, // 0.2 seconds

  // disentchant
  disentchantRecyclingPercentFrom: 30,
  disentchantRecyclingPercentTo: 75,

  // item rarity
  // 0-79
  rarityChancePercentCommon: 80.0,
  // 80-84
  rarityChancePercentRare: 85.0,
  // 85-98
  rarityChancePercentEpic: 98.0,
  // 98-99 - legendary

  // start delays
  initialItemDelay: debug ? 1 : 10,
  initialCraefterDelay: debug ? 1 : 5,
  initialFarmDelay: debug ? 1 : 2,

  // play initial stats
  playerStartLevel: debug ? 10 : 1,

  playerInitialHp: 50,
  playerInitialSta: 25,

  playerInitialStrFrom: 1,
  playerInitialStrTo: 5,

  playerInitialVitFrom: 1,
  playerInitialVitTo: 2,

  playerInitialIntFrom: 0,
  playerInitialIntTo: 7,

  playerInitialDexFrom: 0,
  playerInitialDexTo: 2,

  playerInitialAgiFrom: 0,
  playerInitialAgiTo: 2,

  // craefter initial stats
  craefterInitialSta: 5,

  weaponCraefterInitialStr: 9,
  weaponCraefterInitialInt: 3,
  weaponCraefterInitialDex: 5,
  weaponCraefterInitialLuk: 6,
  weaponCraefterInitialRequiredExp: 5,

  armorCraefterInitialStr: 4,
  armorCraefterInitialInt: 2,
  armorCraefterInitialDex: 3,
  armorCraefterInitialLuk: 9,
  armorCraefterInitialRequiredExp: 10,

  organismInitialRequiredExp: 20,

  showBossScreen: debug,

  rarityMultiplier: {
    [Rarities.Common]: 1,
    [Rarities.Rare]: 1.5,
    [Rarities.Epic]: 3,
    [Rarities.Legendary]: 5,
  },
};
