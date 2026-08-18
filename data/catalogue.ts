import type {
  CardDesign,
  CardGroup,
  CardSection,
  CardSeries,
  LocalizedText,
} from "@/domain/catalogue";

const cardHobby = (id: string) => `https://www.cardhobby.com.cn/market/item/${id}`;

const names = (zh: string, en: string, es: string): LocalizedText => ({
  "zh-CN": zh,
  en,
  es,
});

type CardInput = {
  slug: string;
  officialName: string;
  name: LocalizedText;
  group: CardGroup;
  section: CardSection;
  serial?: string;
  extension?: "jpg" | "webp";
  platform?: "CardHobby" | "eBay";
  sourceUrl: string;
};

const card = ({
  slug,
  officialName,
  name,
  group,
  section,
  serial,
  extension = "jpg",
  platform = "CardHobby",
  sourceUrl,
}: CardInput): CardDesign => ({
  slug,
  officialName,
  name,
  group,
  section,
  serial: serial ?? null,
  image: {
    path: `images/merlin-2026/cards/${slug}.${extension}`,
    platform,
    sourceUrl,
    authorization: "research-only",
    alt: names(
      `2026 Topps 梅林英超 ${name["zh-CN"]}卡面示例`,
      `2026 Topps Merlin Premier League ${name.en} card example`,
      `Ejemplo de carta ${name.es} de 2026 Topps Merlin Premier League`,
    ),
  },
});

const unnumbered = "base-unnumbered" as const;
const numbered = "base-numbered" as const;
const regularInsert = "regular-insert" as const;
const rareInsert = "rare-insert" as const;

const cardDesigns: CardDesign[] = [
  card({ slug: "base", officialName: "Base Cards", name: names("基础卡", "Base Cards", "Cartas base"), group: "base", section: unnumbered, sourceUrl: cardHobby("129614358") }),
  card({ slug: "refractor", officialName: "Refractor", name: names("普通折射", "Refractor", "Refractor estándar"), group: "base", section: unnumbered, sourceUrl: cardHobby("129614089") }),
  card({ slug: "raywave", officialName: "RayWave Refractor", name: names("光波折射", "RayWave Refractor", "Refractor RayWave"), group: "base", section: unnumbered, sourceUrl: cardHobby("129444173") }),
  card({ slug: "mojo", officialName: "Mojo Refractor", name: names("Mojo 环纹折射", "Mojo Refractor", "Refractor Mojo"), group: "base", section: unnumbered, sourceUrl: cardHobby("129615073") }),
  card({ slug: "vintage-merlin", officialName: "Vintage Merlin Refractor", name: names("复古梅林折射", "Vintage Merlin Refractor", "Refractor Merlin Vintage"), group: "base", section: unnumbered, sourceUrl: cardHobby("128855079") }),
  card({ slug: "vhs-refractor", officialName: "VHS Refractor", name: names("VHS 录像带折射", "VHS Refractor", "Refractor VHS"), group: "base", section: unnumbered, sourceUrl: cardHobby("129244750") }),
  card({ slug: "pink-refractor", officialName: "Pink Refractor", name: names("粉色折射", "Pink Refractor", "Refractor rosa"), group: "base", section: numbered, serial: "/250", sourceUrl: cardHobby("129432551") }),
  card({ slug: "aqua-refractor", officialName: "Aqua Refractor", name: names("水蓝折射", "Aqua Refractor", "Refractor aguamarina"), group: "base", section: numbered, serial: "/199", sourceUrl: cardHobby("129432437") }),
  card({ slug: "aqua-mojo", officialName: "Aqua Mojo Refractor", name: names("水蓝 Mojo 折射", "Aqua Mojo Refractor", "Refractor Mojo aguamarina"), group: "base", section: numbered, serial: "/199", sourceUrl: cardHobby("129705652") }),
  card({ slug: "blue-refractor", officialName: "Blue Refractor", name: names("蓝色折射", "Blue Refractor", "Refractor azul"), group: "base", section: numbered, serial: "/150", sourceUrl: cardHobby("129060212") }),
  card({ slug: "blue-mojo", officialName: "Blue Mojo Refractor", name: names("蓝色 Mojo 折射", "Blue Mojo Refractor", "Refractor Mojo azul"), group: "base", section: numbered, serial: "/150", sourceUrl: cardHobby("129236554") }),
  card({ slug: "green-refractor", officialName: "Green Refractor", name: names("绿色折射", "Green Refractor", "Refractor verde"), group: "base", section: numbered, serial: "/99", sourceUrl: cardHobby("129176815") }),
  card({ slug: "green-mojo", officialName: "Green Mojo Refractor", name: names("绿色 Mojo 折射", "Green Mojo Refractor", "Refractor Mojo verde"), group: "base", section: numbered, serial: "/99", sourceUrl: cardHobby("129480033") }),
  card({ slug: "battle-of-britpop", officialName: "Battle of Britpop Refractor", name: names("英伦摇滚之战折射", "Battle of Britpop Refractor", "Refractor Battle of Britpop"), group: "base", section: numbered, serial: "/95", extension: "webp", platform: "eBay", sourceUrl: "https://www.ebay.com/itm/800515626125" }),
  card({ slug: "purple-refractor", officialName: "Purple Refractor", name: names("紫色折射", "Purple Refractor", "Refractor morado"), group: "base", section: numbered, serial: "/75", sourceUrl: cardHobby("129443147") }),
  card({ slug: "purple-mojo", officialName: "Purple Mojo Refractor", name: names("紫色 Mojo 折射", "Purple Mojo Refractor", "Refractor Mojo morado"), group: "base", section: numbered, serial: "/75", sourceUrl: cardHobby("129470351") }),
  card({ slug: "gold-refractor", officialName: "Gold Refractor", name: names("金色折射", "Gold Refractor", "Refractor dorado"), group: "base", section: numbered, serial: "/50", sourceUrl: cardHobby("129585935") }),
  card({ slug: "gold-mojo", officialName: "Gold Mojo Refractor", name: names("金色 Mojo 折射", "Gold Mojo Refractor", "Refractor Mojo dorado"), group: "base", section: numbered, serial: "/50", sourceUrl: cardHobby("129455095") }),
  card({ slug: "orange-refractor", officialName: "Orange Refractor", name: names("橙色折射", "Orange Refractor", "Refractor naranja"), group: "base", section: numbered, serial: "/25", sourceUrl: cardHobby("128852761") }),
  card({ slug: "orange-mojo", officialName: "Orange Mojo Refractor", name: names("橙色 Mojo 折射", "Orange Mojo Refractor", "Refractor Mojo naranja"), group: "base", section: numbered, serial: "/25", sourceUrl: cardHobby("128853661") }),
  card({ slug: "black-refractor", officialName: "Black Refractor", name: names("黑色折射", "Black Refractor", "Refractor negro"), group: "base", section: numbered, serial: "/10", sourceUrl: cardHobby("129157398") }),
  card({ slug: "black-mojo", officialName: "Black Mojo Refractor", name: names("黑色 Mojo 折射", "Black Mojo Refractor", "Refractor Mojo negro"), group: "base", section: numbered, serial: "/10", extension: "webp", platform: "eBay", sourceUrl: "https://www.ebay.com/itm/407137024097" }),
  card({ slug: "red-refractor", officialName: "Red Refractor", name: names("红色折射", "Red Refractor", "Refractor rojo"), group: "base", section: numbered, serial: "/5", sourceUrl: cardHobby("129182958") }),
  card({ slug: "red-mojo", officialName: "Red Mojo Refractor", name: names("红色 Mojo 折射", "Red Mojo Refractor", "Refractor Mojo rojo"), group: "base", section: numbered, serial: "/5", extension: "webp", platform: "eBay", sourceUrl: "https://www.ebay.com/itm/147478334531" }),
  card({ slug: "superfractor", officialName: "Superfractor", name: names("超级折射", "Superfractor", "Superfractor"), group: "base", section: numbered, serial: "1/1", extension: "webp", platform: "eBay", sourceUrl: "https://www.ebay.com/itm/287438700878" }),
  card({ slug: "fantasy-football", officialName: "Fantasy Football", name: names("梦幻足球", "Fantasy Football", "Fútbol de fantasía"), group: "insert", section: regularInsert, sourceUrl: cardHobby("129613117") }),
  card({ slug: "mystic-afternoons", officialName: "Mystic Afternoons", name: names("魔法午后", "Mystic Afternoons", "Tardes místicas"), group: "insert", section: regularInsert, sourceUrl: cardHobby("129521635") }),
  card({ slug: "merlins-young-magicians", officialName: "Merlin's Young Magicians", name: names("梅林青年魔法师", "Merlin's Young Magicians", "Jóvenes magos de Merlin"), group: "insert", section: regularInsert, sourceUrl: cardHobby("129240135") }),
  card({ slug: "merlin-speaks", officialName: "Merlin Speaks", name: names("梅林预言", "Merlin Speaks", "Merlin habla"), group: "insert", section: regularInsert, sourceUrl: cardHobby("129612636") }),
  card({ slug: "ta-da", officialName: "Ta-Da", name: names("华丽登场", "Ta-Da", "Ta-Da"), group: "insert", section: regularInsert, sourceUrl: cardHobby("129705840") }),
  card({ slug: "merlin-premier-league-1996-edition", officialName: "Merlin Premier League 1996 Edition", name: names("梅林英超 1996 复古版", "Merlin Premier League 1996 Edition", "Edición Premier League 1996"), group: "insert", section: rareInsert, extension: "webp", platform: "eBay", sourceUrl: "https://www.ebay.com/itm/227400363179" }),
  card({ slug: "the-shiny", officialName: "The Shiny", name: names("闪耀", "The Shiny", "El brillante"), group: "insert", section: rareInsert, sourceUrl: cardHobby("128681885") }),
  card({ slug: "renaissance", officialName: "Renaissance", name: names("文艺复兴", "Renaissance", "Renacimiento"), group: "insert", section: rareInsert, extension: "webp", platform: "eBay", sourceUrl: "https://www.ebay.com/itm/278189778466" }),
  card({ slug: "magic-in-his-boots", officialName: "Magic in His Boots", name: names("足下魔法", "Magic in His Boots", "Magia en sus botas"), group: "insert", section: rareInsert, extension: "webp", platform: "eBay", sourceUrl: "https://www.ebay.com/itm/318449520440" }),
  card({ slug: "rainbow-flick", officialName: "Rainbow Flick", name: names("彩虹挑球", "Rainbow Flick", "Regate arcoíris"), group: "insert", section: rareInsert, sourceUrl: cardHobby("129585326") }),
  card({ slug: "merlins-magnum-opus", officialName: "Merlin's Magnum Opus", name: names("梅林巅峰杰作", "Merlin's Magnum Opus", "La obra maestra de Merlin"), group: "insert", section: rareInsert, extension: "webp", platform: "eBay", sourceUrl: "https://www.ebay.com/itm/398257627029" }),
  card({ slug: "merlins-mythical-art", officialName: "Merlin's Mythical Art", name: names("梅林神话艺术", "Merlin's Mythical Art", "Arte mítico de Merlin"), group: "insert", section: rareInsert, sourceUrl: cardHobby("128890212") }),
  card({ slug: "mask-off", officialName: "Mask Off", name: names("摘下面具", "Mask Off", "Sin máscara"), group: "insert", section: rareInsert, extension: "webp", platform: "eBay", sourceUrl: "https://www.ebay.co.uk/itm/267759226841" }),
];

export const merlinPremierLeague2026: CardSeries = {
  slug: "topps-merlin-premier-league-2026",
  manufacturer: "Topps",
  season: "2026",
  name: names(
    "2026 Topps 梅林英超",
    "2026 Topps Merlin Premier League",
    "2026 Topps Merlin Premier League",
  ),
  packaging: {
    path: "images/merlin-2026/packaging.webp",
    platform: "Topps",
    sourceUrl: "https://www.topps.com/products/merlin-premier-league-2026-hobby-box",
    authorization: "official",
    alt: names(
      "2026 Topps 梅林英超 Hobby 盒包装",
      "2026 Topps Merlin Premier League Hobby box packaging",
      "Caja Hobby 2026 Topps Merlin Premier League",
    ),
  },
  cardDesigns,
};

const catalogue = [merlinPremierLeague2026];

export function getSeries(slug: string) {
  return catalogue.find((series) => series.slug === slug);
}

export function getCardDesign(slug: string) {
  return merlinPremierLeague2026.cardDesigns.find((design) => design.slug === slug);
}
