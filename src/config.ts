// create debug flag to fall back to debug values
import { Rarities } from "./data";

const debug =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_DEBUG === "true";

export const config = {
  // detect debug
  debug,

  name: "Cräft!",
  subLogo: "Beta",

  // general config
  useLocalStorage: false,
  compressLocalStorage: true,
  // show boss screen
  showBossScreen: debug,

  // game parameters
  startResources: debug ? 100 : 0,
  startDelay: 1, // 1 second

  // everything happens instantly
  instant: debug,

  // how fast should the ticker update?
  tickerTick: 0.2, // 0.2 seconds

  // disentchant
  disentchantRecyclingPercentFrom: 30,
  disentchantRecyclingPercentTo: 80,

  // item rarity
  // 0-79
  rarityChancePercentCommon: 80.0,
  // 80-84
  rarityChancePercentRare: 85.0,
  // 85-98
  rarityChancePercentEpic: 98.0,
  // 98-99 - legendary

  // two-handed chance
  itemChanceTwoHanded: 3, // chance 1/3
  itemBrokenMultiplier: 1 - 0.9, // 90% loss on item breaking

  // start delays
  initialItemDelay: debug ? 1 : 10,
  initialCraefterDelay: debug ? 1 : 5,
  initialFarmDelay: debug ? 1 : 2,

  // farm
  farmDelayCurve: { floor: 2, top: 5 },
  farmHardness: 2,

  // play initial stats
  playerStartLevel: debug ? 10 : 1,

  playerInitialHp: 50,
  playerInitialSta: 25,

  playerInitialStr: { from: 1, to: 5 },
  playerInitialVit: { from: 1, to: 2 },
  playerInitialInt: { from: 0, to: 7 },
  playerInitialDex: { from: 0, to: 2 },
  playerInitialAgi: { from: 0, to: 2 },

  // craefter initial stats
  craefterInitialSta: 5,
  craefterMaterialExhaustionMultiplier: 0.75,
  craefterDelayCurve: { floor: 2, top: 7 },

  weaponCraefterInitialStr: { from: 3, to: 9 },
  weaponCraefterInitialInt: { from: 1, to: 3 },
  weaponCraefterInitialDex: { from: 2, to: 5 },
  weaponCraefterInitialLuk: { from: 0, to: 6 },

  armorCraefterInitialStr: { from: 1, to: 4 },
  armorCraefterInitialInt: { from: 0, to: 2 },
  armorCraefterInitialDex: { from: 1, to: 3 },
  armorCraefterInitialLuk: { from: 2, to: 9 },

  // exp config
  weaponCraefterInitialRequiredExp: 5,
  armorCraefterInitialRequiredExp: 10,
  organismInitialRequiredExp: 20,

  rarityMultiplier: {
    [Rarities.Common]: 1,
    [Rarities.Rare]: 1.5,
    [Rarities.Epic]: 3,
    [Rarities.Legendary]: 5,
  },
};
