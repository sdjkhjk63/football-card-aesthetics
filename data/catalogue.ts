import type {
  CardDesign,
  CardGroup,
  CardSection,
  CardSeries,
  LocalizedText,
} from "@/domain/catalogue";

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
};

const card = ({
  slug,
  officialName,
  name,
  group,
  section,
  serial,
  extension = "jpg",
}: CardInput): CardDesign => ({
  slug,
  officialName,
  name,
  group,
  section,
  serial: serial ?? null,
  image: {
    path: `images/merlin-2026/cards/${slug}.${extension}`,
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
  card({ slug: "base", officialName: "Base Cards", name: names("基础卡", "Base Cards", "Cartas base"), group: "base", section: unnumbered }),
  card({ slug: "refractor", officialName: "Refractor", name: names("普通折射", "Refractor", "Refractor estándar"), group: "base", section: unnumbered }),
  card({ slug: "raywave", officialName: "RayWave Refractor", name: names("光波折射", "RayWave Refractor", "Refractor RayWave"), group: "base", section: unnumbered }),
  card({ slug: "mojo", officialName: "Mojo Refractor", name: names("Mojo 环纹折射", "Mojo Refractor", "Refractor Mojo"), group: "base", section: unnumbered }),
  card({ slug: "vintage-merlin", officialName: "Vintage Merlin Refractor", name: names("复古梅林折射", "Vintage Merlin Refractor", "Refractor Merlin Vintage"), group: "base", section: unnumbered }),
  card({ slug: "vhs-refractor", officialName: "VHS Refractor", name: names("VHS 录像带折射", "VHS Refractor", "Refractor VHS"), group: "base", section: unnumbered }),
  card({ slug: "pink-refractor", officialName: "Pink Refractor", name: names("粉色折射", "Pink Refractor", "Refractor rosa"), group: "base", section: numbered, serial: "/250" }),
  card({ slug: "aqua-refractor", officialName: "Aqua Refractor", name: names("水蓝折射", "Aqua Refractor", "Refractor aguamarina"), group: "base", section: numbered, serial: "/199" }),
  card({ slug: "aqua-mojo", officialName: "Aqua Mojo Refractor", name: names("水蓝 Mojo 折射", "Aqua Mojo Refractor", "Refractor Mojo aguamarina"), group: "base", section: numbered, serial: "/199" }),
  card({ slug: "blue-refractor", officialName: "Blue Refractor", name: names("蓝色折射", "Blue Refractor", "Refractor azul"), group: "base", section: numbered, serial: "/150" }),
  card({ slug: "blue-mojo", officialName: "Blue Mojo Refractor", name: names("蓝色 Mojo 折射", "Blue Mojo Refractor", "Refractor Mojo azul"), group: "base", section: numbered, serial: "/150" }),
  card({ slug: "green-refractor", officialName: "Green Refractor", name: names("绿色折射", "Green Refractor", "Refractor verde"), group: "base", section: numbered, serial: "/99" }),
  card({ slug: "green-mojo", officialName: "Green Mojo Refractor", name: names("绿色 Mojo 折射", "Green Mojo Refractor", "Refractor Mojo verde"), group: "base", section: numbered, serial: "/99" }),
  card({ slug: "battle-of-britpop", officialName: "Battle of Britpop Refractor", name: names("英伦摇滚之战折射", "Battle of Britpop Refractor", "Refractor Battle of Britpop"), group: "base", section: numbered, serial: "/95", extension: "webp" }),
  card({ slug: "purple-refractor", officialName: "Purple Refractor", name: names("紫色折射", "Purple Refractor", "Refractor morado"), group: "base", section: numbered, serial: "/75" }),
  card({ slug: "purple-mojo", officialName: "Purple Mojo Refractor", name: names("紫色 Mojo 折射", "Purple Mojo Refractor", "Refractor Mojo morado"), group: "base", section: numbered, serial: "/75" }),
  card({ slug: "gold-refractor", officialName: "Gold Refractor", name: names("金色折射", "Gold Refractor", "Refractor dorado"), group: "base", section: numbered, serial: "/50" }),
  card({ slug: "gold-mojo", officialName: "Gold Mojo Refractor", name: names("金色 Mojo 折射", "Gold Mojo Refractor", "Refractor Mojo dorado"), group: "base", section: numbered, serial: "/50" }),
  card({ slug: "orange-refractor", officialName: "Orange Refractor", name: names("橙色折射", "Orange Refractor", "Refractor naranja"), group: "base", section: numbered, serial: "/25" }),
  card({ slug: "orange-mojo", officialName: "Orange Mojo Refractor", name: names("橙色 Mojo 折射", "Orange Mojo Refractor", "Refractor Mojo naranja"), group: "base", section: numbered, serial: "/25" }),
  card({ slug: "black-refractor", officialName: "Black Refractor", name: names("黑色折射", "Black Refractor", "Refractor negro"), group: "base", section: numbered, serial: "/10" }),
  card({ slug: "black-mojo", officialName: "Black Mojo Refractor", name: names("黑色 Mojo 折射", "Black Mojo Refractor", "Refractor Mojo negro"), group: "base", section: numbered, serial: "/10", extension: "webp" }),
  card({ slug: "red-refractor", officialName: "Red Refractor", name: names("红色折射", "Red Refractor", "Refractor rojo"), group: "base", section: numbered, serial: "/5" }),
  card({ slug: "red-mojo", officialName: "Red Mojo Refractor", name: names("红色 Mojo 折射", "Red Mojo Refractor", "Refractor Mojo rojo"), group: "base", section: numbered, serial: "/5", extension: "webp" }),
  card({ slug: "superfractor", officialName: "Superfractor", name: names("超级折射", "Superfractor", "Superfractor"), group: "base", section: numbered, serial: "1/1", extension: "webp" }),
  card({ slug: "fantasy-football", officialName: "Fantasy Football", name: names("梦幻足球", "Fantasy Football", "Fútbol de fantasía"), group: "insert", section: regularInsert }),
  card({ slug: "mystic-afternoons", officialName: "Mystic Afternoons", name: names("魔法午后", "Mystic Afternoons", "Tardes místicas"), group: "insert", section: regularInsert }),
  card({ slug: "merlins-young-magicians", officialName: "Merlin's Young Magicians", name: names("梅林青年魔法师", "Merlin's Young Magicians", "Jóvenes magos de Merlin"), group: "insert", section: regularInsert }),
  card({ slug: "merlin-speaks", officialName: "Merlin Speaks", name: names("梅林预言", "Merlin Speaks", "Merlin habla"), group: "insert", section: regularInsert }),
  card({ slug: "ta-da", officialName: "Ta-Da", name: names("华丽登场", "Ta-Da", "Ta-Da"), group: "insert", section: regularInsert }),
  card({ slug: "merlin-premier-league-1996-edition", officialName: "Merlin Premier League 1996 Edition", name: names("梅林英超 1996 复古版", "Merlin Premier League 1996 Edition", "Edición Premier League 1996"), group: "insert", section: rareInsert, extension: "webp" }),
  card({ slug: "the-shiny", officialName: "The Shiny", name: names("闪耀", "The Shiny", "El brillante"), group: "insert", section: rareInsert }),
  card({ slug: "renaissance", officialName: "Renaissance", name: names("文艺复兴", "Renaissance", "Renacimiento"), group: "insert", section: rareInsert, extension: "webp" }),
  card({ slug: "magic-in-his-boots", officialName: "Magic in His Boots", name: names("足下魔法", "Magic in His Boots", "Magia en sus botas"), group: "insert", section: rareInsert, extension: "webp" }),
  card({ slug: "rainbow-flick", officialName: "Rainbow Flick", name: names("彩虹挑球", "Rainbow Flick", "Regate arcoíris"), group: "insert", section: rareInsert }),
  card({ slug: "merlins-magnum-opus", officialName: "Merlin's Magnum Opus", name: names("梅林巅峰杰作", "Merlin's Magnum Opus", "La obra maestra de Merlin"), group: "insert", section: rareInsert, extension: "webp" }),
  card({ slug: "merlins-mythical-art", officialName: "Merlin's Mythical Art", name: names("梅林神话艺术", "Merlin's Mythical Art", "Arte mítico de Merlin"), group: "insert", section: rareInsert }),
  card({ slug: "mask-off", officialName: "Mask Off", name: names("摘下面具", "Mask Off", "Sin máscara"), group: "insert", section: rareInsert, extension: "webp" }),
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
    alt: names(
      "2026 Topps 梅林英超 Hobby 盒包装",
      "2026 Topps Merlin Premier League Hobby box packaging",
      "Caja Hobby 2026 Topps Merlin Premier League",
    ),
  },
  cardDesigns,
};

const finestPath = (slug: string) => `images/finest-premier-league-2026/cards/${slug}.webp`;
type FinestCardInput = {
  slug: string;
  officialName: string;
  name: LocalizedText;
  group: CardGroup;
  section: CardSection;
  serial?: string;
  layout?: CardDesign["layout"];
};

const finestCard = ({
  slug,
  officialName,
  name,
  group,
  section,
  serial,
  layout,
}: FinestCardInput): CardDesign => ({
  slug,
  officialName,
  name,
  group,
  section,
  serial: serial ?? null,
  layout,
  image: {
    path: finestPath(slug),
    alt: names(
      `2026 Topps Finest 英超 ${name["zh-CN"]}卡面示例`,
      `2026 Topps Finest Premier League ${name.en} card example`,
      `Ejemplo de carta ${name.es} de 2026 Topps Finest Premier League`,
    ),
  },
});

type BaseVariantInput = {
  suffix: string;
  officialLabel: string;
  zhLabel: string;
  enLabel: string;
  esLabel: string;
  serial?: string;
};

const commonBaseVariants: BaseVariantInput[] = [
  { suffix: "checkerboard", officialLabel: "Checkerboard", zhLabel: "棋盘", enLabel: "Checkerboard", esLabel: "tablero" },
  { suffix: "refractor", officialLabel: "Refractor", zhLabel: "折射", enLabel: "Refractor", esLabel: "refractor" },
  { suffix: "saturday-3pm", officialLabel: "Saturday 3PM", zhLabel: "周六 3PM", enLabel: "Saturday 3PM", esLabel: "Saturday 3PM" },
  { suffix: "blue", officialLabel: "Blue", zhLabel: "蓝色", enLabel: "Blue", esLabel: "azul", serial: "/200" },
  { suffix: "purple-checkerboard", officialLabel: "Purple Checkerboard", zhLabel: "紫色棋盘", enLabel: "Purple Checkerboard", esLabel: "tablero morado", serial: "/150" },
  { suffix: "blue-checkerboard", officialLabel: "Blue Checkerboard", zhLabel: "蓝色棋盘", enLabel: "Blue Checkerboard", esLabel: "tablero azul", serial: "/99" },
  { suffix: "green", officialLabel: "Green", zhLabel: "绿色", enLabel: "Green", esLabel: "verde", serial: "/75" },
  { suffix: "pearl", officialLabel: "Pearl", zhLabel: "珍珠", enLabel: "Pearl", esLabel: "perla", serial: "/60" },
  { suffix: "gold", officialLabel: "Gold", zhLabel: "金色", enLabel: "Gold", esLabel: "dorado", serial: "/50" },
  { suffix: "orange", officialLabel: "Orange", zhLabel: "橙色", enLabel: "Orange", esLabel: "naranja", serial: "/25" },
  { suffix: "black", officialLabel: "Black", zhLabel: "黑色", enLabel: "Black", esLabel: "negro", serial: "/20" },
  { suffix: "red", officialLabel: "Red", zhLabel: "红色", enLabel: "Red", esLabel: "rojo", serial: "/10" },
  { suffix: "superfractor", officialLabel: "SuperFractor", zhLabel: "超级折射", enLabel: "SuperFractor", esLabel: "superfractor", serial: "1/1" },
];

const uncommonBaseVariants: BaseVariantInput[] = commonBaseVariants.map((variant) => ({
  ...variant,
  serial: {
    blue: "/150",
    "purple-checkerboard": "/99",
    "blue-checkerboard": "/75",
    pearl: "/40",
    green: "/35",
    gold: "/25",
    orange: "/20",
    black: "/15",
    red: "/5",
    superfractor: "1/1",
  }[variant.suffix] ?? undefined,
}));

const pearlBeforeGreenOrder = [
  "checkerboard",
  "refractor",
  "saturday-3pm",
  "blue",
  "purple-checkerboard",
  "blue-checkerboard",
  "pearl",
  "green",
  "gold",
  "orange",
  "black",
  "red",
  "superfractor",
];

uncommonBaseVariants.sort((a, b) => pearlBeforeGreenOrder.indexOf(a.suffix) - pearlBeforeGreenOrder.indexOf(b.suffix));

const rareBaseVariants: BaseVariantInput[] = commonBaseVariants.map((variant) => ({
  ...variant,
  serial: {
    blue: "/99",
    "purple-checkerboard": "/75",
    "blue-checkerboard": "/49",
    pearl: "/30",
    green: "/25",
    gold: "/20",
    orange: "/15",
    black: "/10",
    red: "/3",
    superfractor: "1/1",
  }[variant.suffix] ?? undefined,
}));

rareBaseVariants.sort((a, b) => pearlBeforeGreenOrder.indexOf(a.suffix) - pearlBeforeGreenOrder.indexOf(b.suffix));


const finestBaseCards = (
  tier: "common" | "uncommon" | "rare",
  officialTier: "Common" | "Uncommon" | "Rare",
  variants: BaseVariantInput[],
  baseSerial?: string,
) => [
  finestCard({
    slug: `base-${tier}`,
    officialName: `Base ${officialTier}`,
    name: names(`基础 ${officialTier}`, `Base ${officialTier}`, `Base ${officialTier}`),
    group: "base",
    section: baseSerial ? numbered : unnumbered,
    serial: baseSerial,
  }),
  ...variants.map((variant) => {
    const slug = `base-${tier}-${variant.suffix}`;
    return finestCard({
      slug,
      officialName: `Base ${officialTier} ${variant.officialLabel}`,
      name: names(
        `基础 ${officialTier} ${variant.zhLabel}`,
        `Base ${officialTier} ${variant.enLabel}`,
        `Base ${officialTier} ${variant.esLabel}`,
      ),
      group: "base",
      section: variant.serial ? numbered : unnumbered,
      serial: variant.serial,
    });
  }),
];

const finestCardDesigns: CardDesign[] = [
  ...finestBaseCards("common", "Common", commonBaseVariants),
  ...finestBaseCards("uncommon", "Uncommon", uncommonBaseVariants),
  ...finestBaseCards("rare", "Rare", rareBaseVariants),
  finestCard({ slug: "arrivals", officialName: "Arrivals", name: names("新援登场", "Arrivals", "Llegadas"), group: "insert", section: regularInsert }),
  finestCard({ slug: "clean", officialName: "Clean", name: names("Clean 防守", "Clean", "Clean"), group: "insert", section: regularInsert }),
  finestCard({ slug: "expected-brilliance", officialName: "(xB) Expected Brilliance", name: names("预期闪耀", "Expected Brilliance", "Brillantez esperada"), group: "insert", section: regularInsert }),
  finestCard({ slug: "aura", officialName: "Aura", name: names("气场", "Aura", "Aura"), group: "insert", section: rareInsert }),
  finestCard({ slug: "gusto", officialName: "Gusto", name: names("Gusto 冲劲", "Gusto", "Gusto"), group: "insert", section: rareInsert }),
  finestCard({ slug: "headliners", officialName: "Headliners", name: names("头条人物", "Headliners", "Titulares"), group: "insert", section: rareInsert }),
  finestCard({ slug: "main-attraction", officialName: "Main Attraction", name: names("主秀焦点", "Main Attraction", "Atracción principal"), group: "insert", section: rareInsert }),
  finestCard({ slug: "nightmare-fuel", officialName: "Nightmare Fuel", name: names("噩梦燃料", "Nightmare Fuel", "Combustible de pesadilla"), group: "insert", section: rareInsert }),
  finestCard({ slug: "polka", officialName: "Polka", name: names("波尔卡", "Polka", "Polka"), group: "insert", section: rareInsert }),
  finestCard({ slug: "swerve", officialName: "Swerve", name: names("Swerve 变线", "Swerve", "Swerve"), group: "insert", section: regularInsert }),
  finestCard({ slug: "swerve-fusion", officialName: "Swerve Fusion", name: names("Swerve Fusion 融合", "Swerve Fusion", "Swerve Fusion"), group: "insert", section: rareInsert }),
  finestCard({ slug: "finest-idols", officialName: "Finest Idols", name: names("Finest 偶像", "Finest Idols", "Ídolos Finest"), group: "insert", section: rareInsert }),
  finestCard({ slug: "finest-fans-autographs", officialName: "Finest Fans Autographs", name: names("名人球迷签名", "Finest Fans Autographs", "Autógrafos Finest Fans"), group: "insert", section: rareInsert, serial: "/5" }),
  finestCard({ slug: "finest-moments-autographs", officialName: "Finest Moments Autographs", name: names("Finest 时刻签名", "Finest Moments Autographs", "Autógrafos Finest Moments"), group: "insert", section: rareInsert }),
  finestCard({ slug: "finest-partnerships", officialName: "Finest Partnerships Dual Autographs", name: names("Finest 双人签名组合", "Finest Partnerships", "Finest Partnerships"), group: "insert", section: rareInsert, serial: "1/1", layout: "landscape" }),
  finestCard({ slug: "finest-seasons-autographs", officialName: "Finest Seasons 1995/96 Autographs", name: names("Finest 1995/96 赛季签名", "Finest Seasons Autographs", "Autógrafos Finest Seasons"), group: "insert", section: rareInsert }),
];

export const toppsFinestPremierLeague2026: CardSeries = {
  slug: "topps-finest-premier-league-2026",
  manufacturer: "Topps",
  season: "2026",
  name: names(
    "2026 Topps Finest 英超",
    "2026 Topps Finest Premier League",
    "2026 Topps Finest Premier League",
  ),
  packaging: {
    path: "images/finest-premier-league-2026/packaging.webp",
    alt: names(
      "2026 Topps Finest 英超 Hobby 盒包装",
      "2026 Topps Finest Premier League Hobby box packaging",
      "Caja Hobby 2026 Topps Finest Premier League",
    ),
  },
  cardDesigns: finestCardDesigns,
};

const arsenalInsertRainbow = [
  { name: "Aqua Refractor", serial: "/199" },
  { name: "Arsenal Blue Refractor", serial: "/150" },
  { name: "Green Refractor", serial: "/99" },
  { name: "Purple Refractor", serial: "/75" },
  { name: "Arsenal Gold Refractor", serial: "/49" },
  { name: "White Refractor", serial: "/30" },
  { name: "Orange Refractor", serial: "/25" },
  { name: "Black Refractor", serial: "/10" },
  { name: "Arsenal Red Refractor", serial: "/5" },
  { name: "SuperFractor", serial: "1/1" },
];

const arsenalAutographRainbow = arsenalInsertRainbow.slice(2);

type ArsenalCardInput = {
  slug: string;
  officialName: string;
  name: LocalizedText;
  group: CardGroup;
  section: CardSection;
  serial?: string;
  parallels?: CardDesign["parallels"];
  layout?: CardDesign["layout"];
};

const retouchedArsenalCards = new Set([
  "base-image-two",
  "prism-refractor",
  "red-vision",
  "highbury-highs",
  "marble-icons",
  "n5-heritage",
  "the-arsenal",
]);

const rectifiedArsenalCards = new Set([
  "base-image-one",
  "arsenal-blue-refractor",
  "arsenal-gold-refractor",
  "green-refractor",
  "purple-refractor",
  "orange-refractor",
  "black-refractor",
  "white-refractor",
]);

const arsenalImageSuffix = (slug: string) => {
  if (rectifiedArsenalCards.has(slug)) return "-v4";
  if (retouchedArsenalCards.has(slug)) return "-v2";
  return "";
};

const arsenalCard = ({
  slug,
  officialName,
  name,
  group,
  section,
  serial,
  parallels,
  layout,
}: ArsenalCardInput): CardDesign => ({
  slug,
  officialName,
  name,
  group,
  section,
  serial: serial ?? null,
  parallels,
  layout,
  image: {
    path: `images/topps-chrome-arsenal-2025-26/cards/${slug}${arsenalImageSuffix(slug)}.webp`,
    alt: names(
      `2025-26 Topps Chrome 阿森纳 ${name["zh-CN"]}卡面示例`,
      `2025-26 Topps Chrome Arsenal ${name.en} card example`,
      `Ejemplo de carta ${name.es} de 2025-26 Topps Chrome Arsenal`,
    ),
  },
});

const chromeArsenalCardDesigns: CardDesign[] = [
  arsenalCard({ slug: "base-image-one", officialName: "Base Image Variation 1", name: names("基础卡图一", "Base Image One", "Imagen base uno"), group: "base", section: unnumbered }),
  arsenalCard({ slug: "base-image-two", officialName: "Base Image Variation 2", name: names("基础卡图二", "Base Image Two", "Imagen base dos"), group: "base", section: unnumbered }),
  arsenalCard({ slug: "prism-refractor", officialName: "Prism Refractor", name: names("棱镜折射", "Prism Refractor", "Refractor Prism"), group: "base", section: unnumbered }),
  arsenalCard({ slug: "red-vision", officialName: "Red Vision", name: names("红色视觉", "Red Vision", "Visión roja"), group: "base", section: unnumbered }),
  arsenalCard({ slug: "arsenal-blue-refractor", officialName: "Arsenal Blue Refractor", name: names("阿森纳蓝折射", "Arsenal Blue Refractor", "Refractor azul Arsenal"), group: "base", section: numbered, serial: "/150" }),
  arsenalCard({ slug: "green-refractor", officialName: "Green Refractor", name: names("绿色折射", "Green Refractor", "Refractor verde"), group: "base", section: numbered, serial: "/99" }),
  arsenalCard({ slug: "purple-refractor", officialName: "Purple Refractor", name: names("紫色折射", "Purple Refractor", "Refractor morado"), group: "base", section: numbered, serial: "/75" }),
  arsenalCard({ slug: "arsenal-gold-refractor", officialName: "Arsenal Gold Refractor", name: names("阿森纳金折射", "Arsenal Gold Refractor", "Refractor dorado Arsenal"), group: "base", section: numbered, serial: "/49" }),
  arsenalCard({ slug: "white-refractor", officialName: "White Refractor", name: names("白色折射", "White Refractor", "Refractor blanco"), group: "base", section: numbered, serial: "/30" }),
  arsenalCard({ slug: "orange-refractor", officialName: "Orange Refractor", name: names("橙色折射", "Orange Refractor", "Refractor naranja"), group: "base", section: numbered, serial: "/25" }),
  arsenalCard({ slug: "black-refractor", officialName: "Black Refractor", name: names("黑色折射", "Black Refractor", "Refractor negro"), group: "base", section: numbered, serial: "/10" }),
  arsenalCard({ slug: "arsenal-red-refractor", officialName: "Arsenal Red Refractor", name: names("阿森纳红折射", "Arsenal Red Refractor", "Refractor rojo Arsenal"), group: "base", section: numbered, serial: "/5" }),
  arsenalCard({ slug: "superfractor", officialName: "SuperFractor", name: names("超级折射", "SuperFractor", "SuperFractor"), group: "base", section: numbered, serial: "1/1" }),
  arsenalCard({ slug: "golden-title", officialName: "Golden Title", name: names("金色冠军", "Golden Title", "Título dorado"), group: "insert", section: rareInsert, serial: "/49" }),
  arsenalCard({ slug: "highbury-highs", officialName: "Highbury Highs", name: names("海布里高光", "Highbury Highs", "Cumbres de Highbury"), group: "insert", section: regularInsert, parallels: arsenalInsertRainbow }),
  arsenalCard({ slug: "marble-icons", officialName: "Marble Icons", name: names("大理石传奇", "Marble Icons", "Iconos de mármol"), group: "insert", section: regularInsert, parallels: arsenalInsertRainbow }),
  arsenalCard({ slug: "n5-heritage", officialName: "N5 Heritage", name: names("N5 传承", "N5 Heritage", "Herencia N5"), group: "insert", section: regularInsert, parallels: arsenalInsertRainbow, layout: "landscape" }),
  arsenalCard({ slug: "the-arsenal", officialName: "The Arsenal", name: names("阿森纳之队", "The Arsenal", "El Arsenal"), group: "insert", section: regularInsert, parallels: arsenalInsertRainbow }),
  arsenalCard({ slug: "base-autographs", officialName: "Base Autographs", name: names("基础卡签名", "Base Autographs", "Autógrafos base"), group: "insert", section: rareInsert, parallels: arsenalAutographRainbow }),
  arsenalCard({ slug: "highbury-highs-autographs", officialName: "Highbury Highs Autographs", name: names("海布里高光签名", "Highbury Highs Autographs", "Autógrafos Cumbres de Highbury"), group: "insert", section: rareInsert, parallels: arsenalAutographRainbow }),
  arsenalCard({ slug: "marble-icons-autographs", officialName: "Marble Icons Autographs", name: names("大理石传奇签名", "Marble Icons Autographs", "Autógrafos Iconos de mármol"), group: "insert", section: rareInsert, parallels: arsenalAutographRainbow }),
  arsenalCard({ slug: "arsenal-all-stars-autographs", officialName: "Arsenal All-Stars Autographs", name: names("阿森纳全明星签名", "Arsenal All-Stars Autographs", "Autógrafos de estrellas del Arsenal"), group: "insert", section: rareInsert, parallels: arsenalAutographRainbow }),
  arsenalCard({ slug: "228-and-out-autographs", officialName: "228 & Out Autographs", name: names("228 球纪录签名", "228 & Out Autographs", "Autógrafos 228 y fuera"), group: "insert", section: rareInsert, parallels: [{ name: "Black Refractor", serial: "/10" }, { name: "Arsenal Red Refractor", serial: "/5" }, { name: "SuperFractor", serial: "1/1" }] }),
  arsenalCard({ slug: "the-arsenal-away-autographs", officialName: "The Arsenal Away Autographs", name: names("阿森纳客场签名", "The Arsenal Away Autographs", "Autógrafos visitantes del Arsenal"), group: "insert", section: rareInsert, serial: "1/1", parallels: [{ name: "SuperFractor", serial: "1/1" }] }),
];

export const toppsChromeArsenal202526: CardSeries = {
  slug: "topps-chrome-arsenal-2025-26",
  manufacturer: "Topps",
  season: "2025-26",
  name: names(
    "2025-26 Topps Chrome 阿森纳",
    "2025-26 Topps Chrome Arsenal",
    "2025-26 Topps Chrome Arsenal",
  ),
  packaging: {
    path: "images/topps-chrome-arsenal-2025-26/packaging.webp",
    alt: names(
      "2025-26 Topps Chrome 阿森纳 Hobby 盒包装",
      "2025-26 Topps Chrome Arsenal Hobby box packaging",
      "Caja Hobby 2025-26 Topps Chrome Arsenal",
    ),
  },
  cardDesigns: chromeArsenalCardDesigns,
};

type SapphireBundesligaCardInput = {
  slug: string;
  officialName: string;
  name: LocalizedText;
  group: CardGroup;
  section: CardSection;
  serial?: string;
  layout?: CardDesign["layout"];
  representative?: boolean;
  extension?: "jpg" | "webp";
};

const sapphireBundesligaCard = ({
  slug,
  officialName,
  name,
  group,
  section,
  serial,
  layout,
  representative = false,
  extension = "jpg",
}: SapphireBundesligaCardInput): CardDesign => ({
  slug,
  officialName,
  name,
  group,
  section,
  serial: serial ?? null,
  layout,
  curatorNote: representative
    ? names(
      "该版本已由 Topps 官方清单确认；公开的当季对应折色实卡图暂未核实，因此不展示相似版本代图。",
      "This version is confirmed by the official Topps checklist. No exact in-season photo has been verified yet, so no lookalike reference image is shown.",
      "Esta versión está confirmada por la lista oficial de Topps. Aún no se ha verificado una foto exacta de esta temporada, por lo que no se muestra una imagen parecida.",
    )
    : undefined,
  image: {
    path: `images/topps-chrome-sapphire-bundesliga-2025-26/cards/${slug}.${extension}`,
    verification: representative ? "unverified" : "exact",
    alt: names(
      `2025-26 Topps Chrome Sapphire 德甲 ${name["zh-CN"]}卡面示例`,
      `2025-26 Topps Chrome Sapphire Bundesliga ${name.en} card example`,
      `Ejemplo de carta ${name.es} de 2025-26 Topps Chrome Sapphire Bundesliga`,
    ),
  },
});

const chromeSapphireBundesligaCardDesigns: CardDesign[] = [
  sapphireBundesligaCard({ slug: "base-sapphire", officialName: "Base Sapphire", name: names("基础蓝宝石", "Base Sapphire", "Base Sapphire"), group: "base", section: unnumbered }),
  sapphireBundesligaCard({ slug: "base-green-sapphire", officialName: "Green Sapphire", name: names("基础绿色蓝宝石", "Base Green Sapphire", "Base Sapphire verde"), group: "base", section: numbered, serial: "/99" }),
  sapphireBundesligaCard({ slug: "base-yellow-sapphire", officialName: "Yellow Sapphire", name: names("基础黄色蓝宝石", "Base Yellow Sapphire", "Base Sapphire amarilla"), group: "base", section: numbered, serial: "/75" }),
  sapphireBundesligaCard({ slug: "base-gold-sapphire", officialName: "Gold Sapphire", name: names("基础金色蓝宝石", "Base Gold Sapphire", "Base Sapphire dorada"), group: "base", section: numbered, serial: "/50" }),
  sapphireBundesligaCard({ slug: "base-orange-sapphire", officialName: "Orange Sapphire", name: names("基础橙色蓝宝石", "Base Orange Sapphire", "Base Sapphire naranja"), group: "base", section: numbered, serial: "/25" }),
  sapphireBundesligaCard({ slug: "base-black-sapphire", officialName: "Black Sapphire", name: names("基础黑色蓝宝石", "Base Black Sapphire", "Base Sapphire negra"), group: "base", section: numbered, serial: "/10" }),
  sapphireBundesligaCard({ slug: "base-red-sapphire", officialName: "Red Sapphire", name: names("基础红色蓝宝石", "Base Red Sapphire", "Base Sapphire roja"), group: "base", section: numbered, serial: "/5" }),
  sapphireBundesligaCard({ slug: "base-padparadscha-sapphire", officialName: "Padparadscha Sapphire", name: names("基础帕帕拉恰蓝宝石", "Base Padparadscha Sapphire", "Base Sapphire Padparadscha"), group: "base", section: numbered, serial: "1/1" }),
  sapphireBundesligaCard({ slug: "sapphire-selections", officialName: "Sapphire Selections", name: names("蓝宝石精选", "Sapphire Selections", "Selecciones Sapphire"), group: "insert", section: regularInsert }),
  sapphireBundesligaCard({ slug: "sapphire-selections-yellow", officialName: "Sapphire Selections Yellow Sapphire", name: names("蓝宝石精选 黄色", "Sapphire Selections Yellow", "Selecciones Sapphire amarilla"), group: "insert", section: rareInsert, serial: "/75" }),
  sapphireBundesligaCard({ slug: "sapphire-selections-gold", officialName: "Sapphire Selections Gold Sapphire", name: names("蓝宝石精选 金色", "Sapphire Selections Gold", "Selecciones Sapphire dorada"), group: "insert", section: rareInsert, serial: "/50" }),
  sapphireBundesligaCard({ slug: "sapphire-selections-orange", officialName: "Sapphire Selections Orange Sapphire", name: names("蓝宝石精选 橙色", "Sapphire Selections Orange", "Selecciones Sapphire naranja"), group: "insert", section: rareInsert, serial: "/25" }),
  sapphireBundesligaCard({ slug: "sapphire-selections-black", officialName: "Sapphire Selections Black Sapphire", name: names("蓝宝石精选 黑色", "Sapphire Selections Black", "Selecciones Sapphire negra"), group: "insert", section: rareInsert, serial: "/10" }),
  sapphireBundesligaCard({ slug: "sapphire-selections-red", officialName: "Sapphire Selections Red Sapphire", name: names("蓝宝石精选 红色", "Sapphire Selections Red", "Selecciones Sapphire roja"), group: "insert", section: rareInsert, serial: "/5" }),
  sapphireBundesligaCard({ slug: "sapphire-selections-padparadscha", officialName: "Sapphire Selections Padparadscha Sapphire", name: names("蓝宝石精选 帕帕拉恰", "Sapphire Selections Padparadscha", "Selecciones Sapphire Padparadscha"), group: "insert", section: rareInsert, serial: "1/1", extension: "webp" }),
  sapphireBundesligaCard({ slug: "infinite-sapphire", officialName: "Infinite Sapphire", name: names("无限蓝宝石", "Infinite Sapphire", "Infinite Sapphire"), group: "insert", section: rareInsert, layout: "landscape" }),
  sapphireBundesligaCard({ slug: "infinite-sapphire-padparadscha", officialName: "Infinite Sapphire Padparadscha Sapphire", name: names("无限蓝宝石 帕帕拉恰", "Infinite Sapphire Padparadscha", "Infinite Sapphire Padparadscha"), group: "insert", section: rareInsert, serial: "1/1", layout: "landscape" }),
  sapphireBundesligaCard({ slug: "base-autograph-orange-sapphire", officialName: "Sapphire Autographs Orange Sapphire", name: names("基础签名 橙色蓝宝石", "Base Autograph Orange Sapphire", "Autógrafo base Sapphire naranja"), group: "insert", section: rareInsert, serial: "/25" }),
  sapphireBundesligaCard({ slug: "base-autograph-black-sapphire", officialName: "Sapphire Autographs Black Sapphire", name: names("基础签名 黑色蓝宝石", "Base Autograph Black Sapphire", "Autógrafo base Sapphire negra"), group: "insert", section: rareInsert, serial: "/10" }),
  sapphireBundesligaCard({ slug: "base-autograph-red-sapphire", officialName: "Sapphire Autographs Red Sapphire", name: names("基础签名 红色蓝宝石", "Base Autograph Red Sapphire", "Autógrafo base Sapphire roja"), group: "insert", section: rareInsert, serial: "/5" }),
  sapphireBundesligaCard({ slug: "base-autograph-padparadscha-sapphire", officialName: "Sapphire Autographs Padparadscha Sapphire", name: names("基础签名 帕帕拉恰蓝宝石", "Base Autograph Padparadscha Sapphire", "Autógrafo base Sapphire Padparadscha"), group: "insert", section: rareInsert, serial: "1/1" }),
  sapphireBundesligaCard({ slug: "sapphire-selections-autograph-black", officialName: "Sapphire Selections Autographs Black Sapphire", name: names("蓝宝石精选签名 黑色", "Sapphire Selections Autograph Black", "Autógrafo Selecciones Sapphire negra"), group: "insert", section: rareInsert, serial: "/10", extension: "webp" }),
  sapphireBundesligaCard({ slug: "sapphire-selections-autograph-red", officialName: "Sapphire Selections Autographs Red Sapphire", name: names("蓝宝石精选签名 红色", "Sapphire Selections Autograph Red", "Autógrafo Selecciones Sapphire roja"), group: "insert", section: rareInsert, serial: "/5" }),
  sapphireBundesligaCard({ slug: "sapphire-selections-autograph-padparadscha", officialName: "Sapphire Selections Autographs Padparadscha Sapphire", name: names("蓝宝石精选签名 帕帕拉恰", "Sapphire Selections Autograph Padparadscha", "Autógrafo Selecciones Sapphire Padparadscha"), group: "insert", section: rareInsert, serial: "1/1" }),
];

export const toppsChromeSapphireBundesliga202526: CardSeries = {
  slug: "topps-chrome-sapphire-bundesliga-2025-26",
  manufacturer: "Topps",
  season: "2025-26",
  name: names(
    "2025-26 Topps Chrome Sapphire 德甲",
    "2025-26 Topps Chrome Sapphire Bundesliga",
    "2025-26 Topps Chrome Sapphire Bundesliga",
  ),
  packaging: {
    path: "images/topps-chrome-sapphire-bundesliga-2025-26/packaging.png",
    alt: names(
      "2025-26 Topps Chrome Sapphire 德甲 Hobby 盒包装",
      "2025-26 Topps Chrome Sapphire Bundesliga Hobby box packaging",
      "Caja Hobby 2025-26 Topps Chrome Sapphire Bundesliga",
    ),
  },
  cardDesigns: chromeSapphireBundesligaCardDesigns,
};

type BarcelonaForeverCardInput = {
  slug: string;
  officialName: string;
  name: LocalizedText;
  serial?: string;
  layout?: CardDesign["layout"];
  verification?: "exact" | "unverified";
  parallels?: CardDesign["parallels"];
  curatorNote?: LocalizedText;
  displayScale?: number;
};

const barcelonaForeverCard = ({
  slug,
  officialName,
  name,
  serial,
  layout,
  verification = "unverified",
  parallels,
  curatorNote,
  displayScale,
}: BarcelonaForeverCardInput): CardDesign => ({
  slug,
  officialName,
  name,
  group: "insert",
  section: serial ? rareInsert : regularInsert,
  serial: serial ?? null,
  layout,
  parallels,
  curatorNote: curatorNote ?? (verification === "unverified"
    ? names(
      "该版本已由公开清单确认；目前展示同卡面家族的官方示意图，确切平行版实卡图仍待核实。",
      "This version is checklist-confirmed. The official image for its design family is shown while an exact parallel photo is still being verified.",
      "Esta versión está confirmada por la lista. Se muestra la imagen oficial de su familia de diseño mientras se verifica una foto exacta del paralelo.",
    )
    : undefined),
  image: {
    path: `images/topps-forever-fc-barcelona-2025-26/cards/${slug}.jpg`,
    verification,
    displayScale,
    alt: names(
      `2025-26 Topps Forever 巴塞罗那 ${name["zh-CN"]}卡面示例`,
      `2025-26 Topps Forever FC Barcelona ${name.en} card example`,
      `Ejemplo de carta ${name.es} de 2025-26 Topps Forever FC Barcelona`,
    ),
  },
});

const standardBarcelonaParallels = [
  { suffix: "", zh: "", en: "", es: "", serial: undefined },
  { suffix: "burgundy", zh: "酒红", en: "Burgundy", es: "burdeos", serial: "/125" },
  { suffix: "green", zh: "绿色", en: "Green", es: "verde", serial: "/99" },
  { suffix: "purple", zh: "紫色", en: "Purple", es: "morado", serial: "/75" },
  { suffix: "gold", zh: "金色", en: "Gold", es: "dorado", serial: "/50" },
  { suffix: "orange", zh: "橙色", en: "Orange", es: "naranja", serial: "/25" },
  { suffix: "black", zh: "黑色", en: "Black", es: "negro", serial: "/10" },
  { suffix: "red", zh: "红色", en: "Red", es: "rojo", serial: "/5" },
  { suffix: "gold-foilfractor", zh: "金色 FoilFractor", en: "Gold FoilFractor", es: "Gold FoilFractor", serial: "1/1" },
] as const;

type BarcelonaStandardFamily = {
  slug: string;
  officialName: string;
  name: LocalizedText;
  representativeSuffix: typeof standardBarcelonaParallels[number]["suffix"];
  curatorNote?: LocalizedText;
  displayScale?: number;
};

const verifiedBarcelonaDisplaySlugs = new Set([
  "blaugrana-vault-green",
  "forever-kit",
  "forever-legends-gold-foilfractor",
  "forever-mens-purple",
  "forever-womens-orange",
  "identity-respect",
  "century-club-gold-foilfractor",
  "home-view",
]);

const buildBarcelonaStandardFamily = ({
  slug,
  officialName,
  name,
  representativeSuffix,
  curatorNote,
  displayScale,
}: BarcelonaStandardFamily): CardDesign[] => {
  const representative = standardBarcelonaParallels.find((parallel) => parallel.suffix === representativeSuffix);
  if (!representative) return [];
  const cardSlug = representative.suffix ? `${slug}-${representative.suffix}` : slug;

  return [barcelonaForeverCard({
    slug: cardSlug,
    officialName,
    name,
    serial: representative.serial,
    verification: verifiedBarcelonaDisplaySlugs.has(cardSlug) ? "exact" : "unverified",
    curatorNote,
    displayScale,
    parallels: standardBarcelonaParallels.slice(1)
      .map((parallel) => ({ name: parallel.en, serial: parallel.serial ?? null })),
  })];
};

const identityParallels = [
  { name: "Teamwork", serial: "/50" },
  { name: "Humility", serial: "/25" },
  { name: "Effort", serial: "/10" },
  { name: "Ambition", serial: "/5" },
  { name: "Respect", serial: "1/1" },
];

const centuryClubParallels = [
  { name: "Black", serial: "/10" },
  { name: "Red", serial: "/5" },
  { name: "Gold FoilFractor", serial: "1/1" },
];

const barcelonaForeverCardDesigns: CardDesign[] = [
  ...buildBarcelonaStandardFamily({ slug: "blaugrana-vault", officialName: "Blaugrana Vault Autographs", name: names("红蓝宝库签名", "Blaugrana Vault Autographs", "Autógrafos Blaugrana Vault"), representativeSuffix: "green" }),
  ...buildBarcelonaStandardFamily({ slug: "forever-kit", officialName: "Forever Kit Autographs", name: names("永恒球衣签名", "Forever Kit Autographs", "Autógrafos Forever Kit"), representativeSuffix: "", curatorNote: names("以巴萨历代球衣元素为视觉主题的签名卡，不含实物。", "An autograph card built around visual elements from historic Barça kits; it does not contain memorabilia.", "Una carta autografiada inspirada en elementos visuales de camisetas históricas del Barça; no contiene reliquias.") }),
  ...buildBarcelonaStandardFamily({ slug: "forever-legends", officialName: "Forever Legend's Autographs", name: names("永恒传奇签名", "Forever Legends Autographs", "Autógrafos Forever Legends"), representativeSuffix: "gold-foilfractor" }),
  ...buildBarcelonaStandardFamily({ slug: "forever-mens", officialName: "Forever Men's Autographs", name: names("永恒男足签名", "Forever Men's Autographs", "Autógrafos Forever masculinos"), representativeSuffix: "purple" }),
  ...buildBarcelonaStandardFamily({ slug: "forever-womens", officialName: "Forever Women's Autographs", name: names("永恒女足签名", "Forever Women's Autographs", "Autógrafos Forever femeninos"), representativeSuffix: "orange", displayScale: 1.85 }),
  barcelonaForeverCard({ slug: "identity-respect", officialName: "Identity Autographs", name: names("巴萨精神签名", "Identity Autographs", "Autógrafos Identity"), serial: "1/1", verification: "exact", parallels: identityParallels }),
  barcelonaForeverCard({ slug: "century-club-gold-foilfractor", officialName: "Century Club: Yamal Edition Autograph Relic", name: names("百场纪念：亚马尔签名比赛球网实物", "Century Club: Yamal Edition Autograph Relic", "Century Club: reliquia autografiada de Yamal"), serial: "1/1", verification: "exact", parallels: centuryClubParallels, curatorNote: names("纪念亚马尔代表巴萨第 100 次出场，卡内包含该场使用的比赛球网实物，并带有球员签名。", "Celebrating Yamal's 100th FC Barcelona appearance, this signed card contains match-used goal-net material from that game.", "Celebra el partido número 100 de Yamal con el FC Barcelona e incluye material de la red utilizada en ese encuentro, además de su autógrafo.") }),
  barcelonaForeverCard({ slug: "home-view", officialName: "Home View Autograph Relics", name: names("主场视角签名实物", "Home View Autograph Relics", "Reliquias autografiadas Home View"), serial: "1/1", layout: "landscape", verification: "exact", parallels: [{ name: "Gold FoilFractor", serial: "1/1" }], curatorNote: names("每位球员仅有 Gold FoilFractor 1/1，卡内包含诺坎普座椅实物并带有签名。", "Each player has only a Gold FoilFractor 1/1, combining an autograph with an authentic Camp Nou seat relic.", "Cada jugador aparece únicamente en Gold FoilFractor 1/1, con autógrafo y una reliquia auténtica de un asiento del Camp Nou.") }),
];

export const toppsForeverFcBarcelona202526: CardSeries = {
  slug: "topps-forever-fc-barcelona-2025-26",
  manufacturer: "Topps",
  season: "2025-26",
  name: names(
    "2025-26 Topps Forever 巴塞罗那",
    "2025-26 Topps Forever FC Barcelona",
    "2025-26 Topps Forever FC Barcelona",
  ),
  packaging: {
    path: "images/topps-forever-fc-barcelona-2025-26/packaging.jpg",
    verification: "exact",
    alt: names(
      "2025-26 Topps Forever 巴塞罗那 Hobby 盒包装",
      "2025-26 Topps Forever FC Barcelona Hobby box packaging",
      "Caja Hobby 2025-26 Topps Forever FC Barcelona",
    ),
  },
  totalVariants: 57,
  cardDesigns: barcelonaForeverCardDesigns,
};

type ArgentinaCardInput = {
  slug: string;
  officialName: string;
  name: LocalizedText;
  serial?: string;
  group?: CardGroup;
  verification?: "exact" | "unverified";
  curatorNote?: LocalizedText;
  parallels?: CardDesign["parallels"];
  layout?: CardDesign["layout"];
};

const argentinaCard = ({
  slug,
  officialName,
  name,
  serial,
  group = "base",
  verification = "exact",
  curatorNote,
  parallels,
  layout,
}: ArgentinaCardInput): CardDesign => ({
  slug,
  officialName,
  name,
  group,
  section: group === "base" ? (serial ? numbered : unnumbered) : (serial ? rareInsert : regularInsert),
  serial: serial ?? null,
  parallels,
  layout,
  curatorNote: curatorNote ?? (verification === "unverified"
    ? names(
      "该版本已由官方清单确认，但公开市场暂未出现可核实的对应低编实物；当前展示同卡面家族中最接近的已核实版本。",
      "This version is confirmed by the official checklist, but no verifiable photo of the exact low-numbered parallel is public yet; the closest verified card from the same design family is shown.",
      "Esta versión está confirmada por la lista oficial, pero aún no hay una foto pública verificable del paralelo exacto de baja numeración; se muestra la carta verificada más cercana de la misma familia.",
    )
    : undefined),
  image: {
    path: `images/topps-argentina-team-set-2026/cards/${slug}.jpg`,
    verification,
    alt: names(
      `2026 Topps 阿根廷国家队 ${name["zh-CN"]}卡面示例`,
      `2026 Topps Argentina Team Set ${name.en} card example`,
      `Ejemplo de carta ${name.es} de Topps Argentina Team Set 2026`,
    ),
  },
});

const argentinaBaseParallels = [
  { name: "Aqua Rainbow", serial: "/199" },
  { name: "Aqua Icy", serial: "/199" },
  { name: "Blue Rainbow", serial: "/150" },
  { name: "Blue Icy", serial: "/150" },
  { name: "Green Rainbow", serial: "/99" },
  { name: "Green Icy", serial: "/99" },
  { name: "Gold Rainbow", serial: "/50" },
  { name: "Gold Icy", serial: "/50" },
  { name: "Orange Rainbow", serial: "/25" },
  { name: "Orange Icy", serial: "/25" },
  { name: "Black Rainbow", serial: "/10" },
  { name: "Black Icy", serial: "/10" },
  { name: "Red Rainbow", serial: "/5" },
  { name: "Red Icy", serial: "/5" },
  { name: "Gold FoilFractor", serial: "1/1" },
];

const argentinaAutoParallels = [
  { name: "Blue", serial: "/150" },
  { name: "Green", serial: "/99" },
  { name: "Gold", serial: "/50" },
  { name: "Orange", serial: "/25" },
  { name: "Black", serial: "/10" },
  { name: "Red", serial: "/5" },
  { name: "Gold FoilFractor", serial: "1/1" },
];

const verifiedArgentinaSlugs = new Set([
  "first-team-base",
  "first-team-halo",
  "first-team-static",
  "bona-fide-baller-base",
  "bona-fide-baller-halo",
  "bona-fide-baller-static",
  "block-base",
  "block-halo",
  "block-static",
  "toast-the-host-base",
  "toast-the-host-halo",
  "toast-the-host-static",
  "afa-in-the-apple-base",
  "afa-in-the-apple-halo",
  "afa-in-the-apple-static",
  "afa-in-the-apple-gold-foilfractor",
  "rainbow-flick",
  "first-team-autograph-red",
  "bona-fide-baller-autograph-red",
  "golden-sun-autograph-black",
  "vis10nary-autograph-gold-foilfractor",
]);

const argentinaBaseFamilies = [
  { slug: "first-team", officialName: "First Team", zh: "一线队", es: "Primer equipo" },
  { slug: "bona-fide-baller", officialName: "Bona Fide Baller", zh: "真格球星", es: "Bona Fide Baller" },
  { slug: "block", officialName: "Block", zh: "街区", es: "Block" },
  { slug: "toast-the-host", officialName: "Toast the Host", zh: "致敬东道主", es: "Brindis por el anfitrión" },
  { slug: "afa-in-the-apple", officialName: "AFA in the Apple", zh: "足协闯入大苹果城", es: "AFA en la Gran Manzana" },
] as const;

const argentinaVersions = [
  { suffix: "base", zh: "基础版", en: "Base", es: "Base", serial: undefined },
  { suffix: "halo", zh: "Halo 光晕", en: "Halo", es: "Halo", serial: undefined },
  { suffix: "static", zh: "Static 静电", en: "Static", es: "Static", serial: undefined },
] as const;

const argentinaTeamSetCardDesigns: CardDesign[] = [
  ...argentinaBaseFamilies.flatMap((family) => argentinaVersions.map((version, index) => {
    const slug = `${family.slug}-${version.suffix}`;
    return argentinaCard({
      slug,
      officialName: `${family.officialName} ${version.en}`,
      name: names(`${family.zh} · ${version.zh}`, `${family.officialName} · ${version.en}`, `${family.es} · ${version.es}`),
      serial: version.serial,
      verification: verifiedArgentinaSlugs.has(slug) ? "exact" : "unverified",
      parallels: index === 0 ? argentinaBaseParallels : undefined,
      layout: family.slug === "toast-the-host" ? "landscape" : undefined,
    });
  })),
  argentinaCard({ slug: "rainbow-flick", officialName: "Rainbow Flick", name: names("彩虹挑球", "Rainbow Flick", "Regate arcoíris"), group: "insert", layout: "landscape" }),
  argentinaCard({ slug: "first-team-autograph-red", officialName: "First Team Autograph Red", name: names("一线队签名 · 红色", "First Team Autograph · Red", "Autógrafo Primer equipo · Rojo"), serial: "/5", group: "insert", parallels: argentinaAutoParallels }),
  argentinaCard({ slug: "bona-fide-baller-autograph-red", officialName: "Bona Fide Baller Autograph Red", name: names("真格球星签名 · 红色", "Bona Fide Baller Autograph · Red", "Autógrafo Bona Fide Baller · Rojo"), serial: "/5", group: "insert", parallels: argentinaAutoParallels }),
  argentinaCard({ slug: "golden-sun-autograph-black", officialName: "Golden Sun Autograph Black", name: names("金色太阳签名 · 黑色", "Golden Sun Autograph · Black", "Autógrafo Golden Sun · Negro"), serial: "/10", group: "insert", parallels: argentinaAutoParallels }),
  argentinaCard({ slug: "vis10nary-autograph-gold-foilfractor", officialName: "Vis10nary Autograph Gold FoilFractor", name: names("梅西 Vis10nary 签名 · 金色 FoilFractor", "Messi Vis10nary Autograph · Gold FoilFractor", "Autógrafo Vis10nary de Messi · Gold FoilFractor"), serial: "1/1", group: "insert", parallels: [{ name: "Gold FoilFractor", serial: "1/1" }] }),
];

export const toppsArgentinaTeamSet2026: CardSeries = {
  slug: "topps-argentina-team-set-2026",
  manufacturer: "Topps",
  season: "2026",
  name: names("2026 Topps 阿根廷国家队套装", "2026 Topps Argentina Team Set", "Topps Argentina Team Set 2026"),
  packaging: {
    path: "images/topps-argentina-team-set-2026/packaging.jpg",
    verification: "exact",
    alt: names("2026 Topps 阿根廷国家队盒装", "2026 Topps Argentina Team Set box", "Caja Topps Argentina Team Set 2026"),
  },
  totalVariants: 116,
  cardDesigns: argentinaTeamSetCardDesigns,
};

type RealMadridCardInput = {
  slug: string;
  officialName: string;
  name: LocalizedText;
  serial?: string;
  displayParallelName?: string;
  group?: CardGroup;
  parallels?: CardDesign["parallels"];
  layout?: CardDesign["layout"];
};

const realMadridCard = ({
  slug,
  officialName,
  name,
  serial,
  displayParallelName,
  group = "base",
  parallels,
  layout,
}: RealMadridCardInput): CardDesign => ({
  slug,
  officialName,
  name,
  group,
  section: group === "base" ? (serial ? numbered : unnumbered) : (serial ? rareInsert : regularInsert),
  serial: serial ?? null,
  displayParallelName,
  parallels,
  layout,
  image: {
    path: `images/topps-real-madrid-team-set-2025-26/cards/${slug}.jpg`,
    verification: "exact",
    alt: names(
      `2025-26 Topps 皇家马德里球队套装 ${name["zh-CN"]}卡面示例`,
      `2025-26 Topps Real Madrid Team Set ${name.en} card example`,
      `Ejemplo de carta ${name.es} de Topps Real Madrid Team Set 2025-26`,
    ),
  },
});

const realMadridBaseParallels: CardDesign["parallels"] = [
  { name: "Purple Rainbow Foil", serial: "/250" },
  { name: "Purple Icy Foil", serial: "/250" },
  { name: "Aqua Rainbow Foil", serial: "/199" },
  { name: "Aqua Icy Foil", serial: "/199" },
  { name: "Blue Rainbow Foil", serial: "/150" },
  { name: "Blue Icy Foil", serial: "/150" },
  { name: "Green Rainbow Foil", serial: "/99" },
  { name: "Green Icy Foil", serial: "/99" },
  { name: "Gold Rainbow Foil", serial: "/50" },
  { name: "Gold Icy Foil", serial: "/50" },
  { name: "Orange Rainbow Foil", serial: "/25" },
  { name: "Orange Icy Foil", serial: "/25" },
  { name: "Black Rainbow Foil", serial: "/10" },
  { name: "Black Icy Foil", serial: "/10" },
  { name: "Red Rainbow Foil", serial: "/5" },
  { name: "Red Icy Foil", serial: "/5" },
  { name: "Gold FoilFractor", serial: "1/1" },
];

const realMadridAutographParallels: CardDesign["parallels"] = [
  { name: "Aqua Rainbow Foil", serial: "/199" },
  { name: "Blue Rainbow Foil", serial: "/150" },
  { name: "Green Rainbow Foil", serial: "/99" },
  { name: "Gold Rainbow Foil", serial: "/50" },
  { name: "Orange Rainbow Foil", serial: "/25" },
  { name: "Black Rainbow Foil", serial: "/10" },
  { name: "Red Rainbow Foil", serial: "/5" },
  { name: "Gold FoilFractor", serial: "1/1" },
];

const realMadridBaseFamilies = [
  { slug: "first-team", officialName: "First Team", zh: "一线队", es: "Primer equipo" },
  { slug: "bona-fide-baller", officialName: "Bona Fide Baller", zh: "真格球星", es: "Bona Fide Baller" },
  { slug: "pitch-pursuits", officialName: "Pitch Pursuits", zh: "球场追击", es: "Pitch Pursuits" },
  { slug: "collectors-corner", officialName: "Collector's Corner", zh: "收藏家角旗区", es: "Rincón del coleccionista" },
  { slug: "king-real", officialName: "King Real", zh: "皇马之王", es: "Rey Real" },
] as const;

const realMadridVersions = [
  { suffix: "base", zh: "基础版", en: "Base", es: "Base" },
  { suffix: "halo", zh: "Halo 光晕", en: "Halo", es: "Halo" },
  { suffix: "static", zh: "Static 静电", en: "Static Foil", es: "Static Foil" },
] as const;

const realMadridTeamSetCardDesigns: CardDesign[] = [
  ...realMadridBaseFamilies.flatMap((family) => realMadridVersions.map((version, index) =>
    realMadridCard({
      slug: `${family.slug}-${version.suffix}`,
      officialName: `${family.officialName} ${version.en}`,
      name: names(
        `${family.zh} · ${version.zh}`,
        `${family.officialName} · ${version.en}`,
        `${family.es} · ${version.es}`,
      ),
      parallels: index === 0 ? realMadridBaseParallels : undefined,
      layout: family.slug === "collectors-corner" ? "landscape" : undefined,
    }),
  )),
  realMadridCard({ slug: "rainbow-flick", officialName: "Rainbow Flick", name: names("彩虹挑球", "Rainbow Flick", "Regate arcoíris"), group: "insert", layout: "landscape" }),
  realMadridCard({ slug: "base-autograph", officialName: "Base Autograph Orange Rainbow Foil", name: names("基础签名 · 橙色彩虹", "Base Autograph · Orange Rainbow Foil", "Autógrafo base · Naranja arcoíris"), serial: "/25", displayParallelName: "Orange Rainbow Foil", group: "insert", parallels: realMadridAutographParallels }),
  realMadridCard({ slug: "bona-fide-baller-autograph", officialName: "Bona Fide Baller Autograph Red Rainbow Foil", name: names("真格球星签名 · 红色彩虹", "Bona Fide Baller Autograph · Red Rainbow Foil", "Autógrafo Bona Fide Baller · Rojo arcoíris"), serial: "/5", displayParallelName: "Red Rainbow Foil", group: "insert", parallels: realMadridAutographParallels }),
];

export const toppsRealMadridTeamSet202526: CardSeries = {
  slug: "topps-real-madrid-team-set-2025-26",
  manufacturer: "Topps",
  season: "2025/26",
  name: names(
    "2025-26 Topps 皇家马德里球队套装",
    "2025-26 Topps Real Madrid Team Set",
    "Topps Real Madrid Team Set 2025-26",
  ),
  packaging: {
    path: "images/topps-real-madrid-team-set-2025-26/packaging.jpg",
    verification: "exact",
    alt: names(
      "2025-26 Topps 皇家马德里球队套装盒装",
      "2025-26 Topps Real Madrid Team Set box",
      "Caja Topps Real Madrid Team Set 2025-26",
    ),
  },
  totalVariants: 1448,
  cardDesigns: realMadridTeamSetCardDesigns,
};

type ManchesterUnitedCardInput = {
  slug: string;
  officialName: string;
  name: LocalizedText;
  serial?: string;
  displayParallelName?: string;
  group?: CardGroup;
  parallels?: CardDesign["parallels"];
  layout?: CardDesign["layout"];
};

const manchesterUnitedCard = ({
  slug,
  officialName,
  name,
  serial,
  displayParallelName,
  group = "base",
  parallels,
  layout,
}: ManchesterUnitedCardInput): CardDesign => ({
  slug,
  officialName,
  name,
  group,
  section: group === "base" ? (serial ? numbered : unnumbered) : (serial ? rareInsert : regularInsert),
  serial: serial ?? null,
  displayParallelName,
  parallels,
  layout,
  image: {
    path: `images/topps-manchester-united-team-set-2025-26/cards/${slug}.jpg`,
    verification: "exact",
    alt: names(
      `2025-26 Topps 曼彻斯特联球队套装 ${name["zh-CN"]}卡面示例`,
      `2025-26 Topps Manchester United Team Set ${name.en} card example`,
      `Ejemplo de carta ${name.es} de Topps Manchester United Team Set 2025-26`,
    ),
  },
});

const manchesterUnitedBaseParallels: CardDesign["parallels"] = [
  { name: "Aqua Rainbow Foil", serial: "/199" },
  { name: "Aqua Icy Foil", serial: "/199" },
  { name: "Blue Rainbow Foil", serial: "/150" },
  { name: "Blue Icy Foil", serial: "/150" },
  { name: "Green Rainbow Foil", serial: "/99" },
  { name: "Green Icy Foil", serial: "/99" },
  { name: "Purple Rainbow Foil", serial: "/75" },
  { name: "Purple Icy Foil", serial: "/75" },
  { name: "Gold Rainbow Foil", serial: "/50" },
  { name: "Gold Icy Foil", serial: "/50" },
  { name: "Orange Rainbow Foil", serial: "/25" },
  { name: "Orange Icy Foil", serial: "/25" },
  { name: "Black Rainbow Foil", serial: "/10" },
  { name: "Black Icy Foil", serial: "/10" },
  { name: "Red Devil Rainbow Foil", serial: "/5" },
  { name: "Red Devil Icy Foil", serial: "/5" },
  { name: "Gold FoilFractor", serial: "1/1" },
];

const manchesterUnitedAutographParallels: CardDesign["parallels"] = [
  { name: "Blue", serial: "/150" },
  { name: "Green", serial: "/99" },
  { name: "Gold", serial: "/50" },
  { name: "Orange", serial: "/25" },
  { name: "Black", serial: "/10" },
  { name: "Red Devil", serial: "/5" },
  { name: "Gold FoilFractor", serial: "1/1" },
];

const manchesterUnitedBaseFamilies = [
  { slug: "first-team", officialName: "First Team", zh: "一线队", es: "Primer equipo" },
  { slug: "bona-fide-baller", officialName: "Bona Fide Baller", zh: "真格球星", es: "Bona Fide Baller" },
  { slug: "pitch-pursuits", officialName: "Pitch Pursuits", zh: "球场追击", es: "Pitch Pursuits" },
  { slug: "collectors-corner", officialName: "Collector's Corner", zh: "收藏家角旗区", es: "Rincón del coleccionista" },
  { slug: "united-road", officialName: "United Road", zh: "曼联之路", es: "United Road" },
] as const;

const manchesterUnitedVersions = [
  { suffix: "base", zh: "基础版", en: "Base", es: "Base" },
  { suffix: "halo", zh: "Halo 光晕", en: "Halo", es: "Halo" },
  { suffix: "static", zh: "Static 静电", en: "Static Foil", es: "Static Foil" },
] as const;

const manchesterUnitedTeamSetCardDesigns: CardDesign[] = [
  ...manchesterUnitedBaseFamilies.flatMap((family) => manchesterUnitedVersions.map((version, index) =>
    manchesterUnitedCard({
      slug: `${family.slug}-${version.suffix}`,
      officialName: `${family.officialName} ${version.en}`,
      name: names(
        `${family.zh} · ${version.zh}`,
        `${family.officialName} · ${version.en}`,
        `${family.es} · ${version.es}`,
      ),
      serial: family.slug === "bona-fide-baller" && version.suffix === "base" ? "1/1" : undefined,
      displayParallelName: family.slug === "bona-fide-baller" && version.suffix === "base" ? "Gold FoilFractor" : undefined,
      parallels: index === 0 ? manchesterUnitedBaseParallels : undefined,
      layout: family.slug === "collectors-corner" ? "landscape" : undefined,
    }),
  )),
  manchesterUnitedCard({ slug: "rainbow-flick", officialName: "Rainbow Flick", name: names("彩虹挑球", "Rainbow Flick", "Regate arcoíris"), group: "insert", layout: "landscape" }),
  manchesterUnitedCard({ slug: "base-autograph", officialName: "Base Cards Autograph Variation", name: names("基础卡签名", "Base Cards Autograph Variation", "Variación de autógrafo base"), serial: "1/1", displayParallelName: "Gold FoilFractor", group: "insert", parallels: manchesterUnitedAutographParallels }),
  manchesterUnitedCard({ slug: "bona-fide-baller-autograph", officialName: "Bona Fide Baller Autograph Variation", name: names("真格球星签名", "Bona Fide Baller Autograph Variation", "Autógrafo Bona Fide Baller"), serial: "/10", displayParallelName: "Black", group: "insert", parallels: manchesterUnitedAutographParallels }),
];

export const toppsManchesterUnitedTeamSet202526: CardSeries = {
  slug: "topps-manchester-united-team-set-2025-26",
  manufacturer: "Topps",
  season: "2025/26",
  name: names(
    "2025-26 Topps 曼彻斯特联球队套装",
    "2025-26 Topps Manchester United Team Set",
    "Topps Manchester United Team Set 2025-26",
  ),
  packaging: {
    path: "images/topps-manchester-united-team-set-2025-26/packaging.jpg",
    verification: "exact",
    alt: names(
      "2025-26 Topps 曼彻斯特联球队套装盒装",
      "2025-26 Topps Manchester United Team Set box",
      "Caja Topps Manchester United Team Set 2025-26",
    ),
  },
  totalVariants: 1377,
  cardDesigns: manchesterUnitedTeamSetCardDesigns,
};

type InceptionCardInput = {
  slug: string;
  officialName: string;
  zh: string;
  es: string;
  serial?: string;
  displayParallelName?: string;
  group?: CardGroup;
  verification?: "exact" | "unverified";
  layout?: CardDesign["layout"];
  parallels?: CardDesign["parallels"];
};

const inceptionCard = ({
  slug,
  officialName,
  zh,
  es,
  serial,
  displayParallelName,
  group = "insert",
  verification = "exact",
  layout,
  parallels,
}: InceptionCardInput): CardDesign => ({
  slug,
  officialName,
  name: names(zh, officialName, es),
  group,
  section: group === "base" ? "base-numbered" : "rare-insert",
  serial: serial ?? null,
  displayParallelName,
  layout,
  parallels,
  image: {
    path: `images/topps-inception-ucc-2025-26/cards/${slug}.webp`,
    verification,
    alt: names(
      `2025/26 Topps Inception 欧足联俱乐部赛事 ${zh}代表卡`,
      `2025/26 Topps Inception UEFA Club Competitions ${officialName} representative card`,
      `Carta representativa ${es} de 2025/26 Topps Inception UEFA Club Competitions`,
    ),
  },
});

const inceptionBaseParallels: CardDesign["parallels"] = [
  { name: "Foil", serial: "/199" },
  { name: "Yellow Foil", serial: "/150" },
  { name: "Magenta Foil", serial: "/125" },
  { name: "Green Foil", serial: "/99" },
  { name: "Pink Foil", serial: "/75" },
  { name: "Blue Foil", serial: "/49" },
  { name: "Purple Foil", serial: "/25" },
  { name: "Red Foil", serial: "/10" },
  { name: "Orange Foil", serial: "/5" },
  { name: "Gold Foil", serial: "1/1" },
  { name: "Printing Plates", serial: "1/1" },
];

const inceptionStandardAutographParallels: CardDesign["parallels"] = [
  { name: "Green Foil", serial: "/99" },
  { name: "Pink Foil", serial: "/75" },
  { name: "Blue Foil", serial: "/49" },
  { name: "Purple Foil", serial: "/25" },
  { name: "Red Foil", serial: "/10" },
  { name: "Orange Foil", serial: "/5" },
  { name: "Gold Foil", serial: "1/1" },
];

const inceptionShortAutographParallels: CardDesign["parallels"] = [
  { name: "Purple Foil", serial: "/25" },
  { name: "Red Foil", serial: "/10" },
  { name: "Orange Foil", serial: "/5" },
  { name: "Gold Foil", serial: "1/1" },
];

const inceptionMarksParallels: CardDesign["parallels"] = [
  { name: "Gold Foil", serial: "/50" },
  { name: "Orange Foil", serial: "/25" },
  { name: "Purple Foil", serial: "/10" },
  { name: "Red Foil", serial: "/5" },
  { name: "Black Foil", serial: "1/1" },
];

const inceptionGoldOneOfOne: CardDesign["parallels"] = [{ name: "Gold Foil", serial: "1/1" }];
const inceptionOrangeGoldParallels: CardDesign["parallels"] = [
  { name: "Orange Foil", serial: "/5" },
  { name: "Gold Foil", serial: "1/1" },
];

const inceptionUccCardDesigns: CardDesign[] = [
  inceptionCard({ slug: "first-xi", officialName: "First XI", zh: "首发十一人", es: "Once inicial", serial: "/25", displayParallelName: "Purple Foil", group: "base", parallels: inceptionBaseParallels }),
  inceptionCard({ slug: "emerging-stars", officialName: "Emerging Stars", zh: "新星崛起", es: "Estrellas emergentes", serial: "/150", displayParallelName: "Yellow Foil", group: "base", parallels: inceptionBaseParallels }),
  inceptionCard({ slug: "succession", officialName: "Succession", zh: "传承接班", es: "Sucesión", serial: "/25", displayParallelName: "Purple Foil", group: "base", parallels: inceptionBaseParallels }),
  inceptionCard({ slug: "showman", officialName: "Showman", zh: "球场巨星", es: "Showman", serial: "/25", displayParallelName: "Purple Foil", group: "base", parallels: inceptionBaseParallels }),
  inceptionCard({ slug: "star-quality", officialName: "Star Quality", zh: "巨星品质", es: "Calidad de estrella", serial: "/10", displayParallelName: "Red Foil", group: "base", parallels: inceptionBaseParallels }),
  inceptionCard({ slug: "superior-legends", officialName: "Superior Legends", zh: "至尊传奇", es: "Leyendas superiores", serial: "/25", displayParallelName: "Purple Foil", group: "base", parallels: inceptionBaseParallels }),
  inceptionCard({ slug: "worldwide", officialName: "Worldwide", zh: "世界足坛", es: "Mundial", serial: "/99", displayParallelName: "Green Foil", group: "base", parallels: inceptionBaseParallels }),
  inceptionCard({ slug: "dark-flow", officialName: "Dark Flow", zh: "暗流", es: "Flujo oscuro", serial: "1/1", displayParallelName: "Gold Foil", parallels: inceptionGoldOneOfOne }),
  inceptionCard({ slug: "first-xi-autographs", officialName: "First XI Autographs", zh: "首发十一人签字", es: "Autógrafos Once inicial", serial: "/25", displayParallelName: "Purple Foil", parallels: inceptionStandardAutographParallels }),
  inceptionCard({ slug: "emerging-stars-autographs", officialName: "Emerging Stars Autographs", zh: "新星崛起签字", es: "Autógrafos Estrellas emergentes", serial: "/10", displayParallelName: "Red Foil", parallels: inceptionStandardAutographParallels }),
  inceptionCard({ slug: "succession-autographs", officialName: "Succession Autographs", zh: "传承接班签字", es: "Autógrafos Sucesión", serial: "/5", displayParallelName: "Orange Foil", parallels: inceptionStandardAutographParallels }),
  inceptionCard({ slug: "showman-autographs", officialName: "Showman Autographs", zh: "球场巨星签字", es: "Autógrafos Showman", serial: "/25", displayParallelName: "Purple Foil", parallels: inceptionStandardAutographParallels }),
  inceptionCard({ slug: "star-quality-autographs", officialName: "Star Quality Autographs", zh: "巨星品质签字", es: "Autógrafos Calidad de estrella", serial: "/10", displayParallelName: "Red Foil", parallels: inceptionStandardAutographParallels }),
  inceptionCard({ slug: "superior-legends-autographs", officialName: "Superior Legends Autographs", zh: "至尊传奇签字", es: "Autógrafos Leyendas superiores", parallels: inceptionStandardAutographParallels }),
  inceptionCard({ slug: "worldwide-autographs", officialName: "Worldwide Autographs", zh: "世界足坛签字", es: "Autógrafos Mundial", serial: "/25", displayParallelName: "Purple Foil", parallels: inceptionStandardAutographParallels }),
  inceptionCard({ slug: "dawn-of-greatness-autographs", officialName: "Dawn of Greatness Autographs", zh: "伟大黎明签字", es: "Autógrafos Amanecer de la grandeza", serial: "/10", displayParallelName: "Red Foil", parallels: inceptionShortAutographParallels }),
  inceptionCard({ slug: "silver-signings-autographs", officialName: "Silver Signings Autographs", zh: "银墨签字", es: "Autógrafos Firmas plateadas", serial: "1/1", displayParallelName: "Gold Foil Gold Ink", parallels: [...inceptionShortAutographParallels!.slice(0, 3), { name: "Gold Foil Gold Ink", serial: "1/1" }], layout: "landscape" }),
  inceptionCard({ slug: "marks-of-excellence", officialName: "Marks of Excellence", zh: "卓越印记签字", es: "Marcas de excelencia", serial: "/5", displayParallelName: "Red Foil", parallels: inceptionMarksParallels }),
  inceptionCard({ slug: "inception-dual-autographs", officialName: "Inception Dual Autographs", zh: "Inception 双人签字", es: "Autógrafos dobles Inception", serial: "/5", displayParallelName: "Orange Foil", parallels: [{ name: "Red Foil", serial: "/10" }, ...inceptionOrangeGoldParallels!], layout: "landscape" }),
  inceptionCard({ slug: "role-models-quad-autograph-book", officialName: "Role Models Quad Autograph Book", zh: "楷模四人签字书卡", es: "Libro de cuatro autógrafos Modelos a seguir", parallels: inceptionOrangeGoldParallels, verification: "unverified", layout: "landscape" }),
  inceptionCard({ slug: "ucl-winners-quad-autograph-book", officialName: "UCL Winners Quad Autograph Book", zh: "欧冠冠军四人签字书卡", es: "Libro de cuatro autógrafos Campeones UCL", parallels: inceptionGoldOneOfOne, verification: "unverified", layout: "landscape" }),
  inceptionCard({ slug: "uwcl-winners-quad-autograph-book", officialName: "UWCL Winners Quad Autograph Book", zh: "女足欧冠冠军四人签字书卡", es: "Libro de cuatro autógrafos Campeonas UWCL", parallels: inceptionOrangeGoldParallels, verification: "unverified", layout: "landscape" }),
  inceptionCard({ slug: "inception-patch", officialName: "Inception Patch", zh: "Inception 实物切片", es: "Parche Inception", serial: "/10", displayParallelName: "Red Foil", parallels: inceptionShortAutographParallels }),
  inceptionCard({ slug: "match-day-memories-relic", officialName: "Match Day Memories Relic", zh: "比赛日记忆实物", es: "Reliquia Recuerdos del partido", serial: "/10", displayParallelName: "Red Foil", parallels: inceptionShortAutographParallels }),
  inceptionCard({ slug: "uwcl-final-goal-net-relic", officialName: "UWCL Final Goal Net Relic", zh: "女足欧冠决赛球网实物", es: "Reliquia de red de la final UWCL", serial: "1/1", displayParallelName: "Gold Foil", parallels: inceptionGoldOneOfOne }),
  inceptionCard({ slug: "uwcl-final-corner-flag-relic", officialName: "UWCL Final Corner Flag Relic", zh: "女足欧冠决赛角旗实物", es: "Reliquia de banderín de la final UWCL", serial: "1/1", displayParallelName: "Gold Foil", parallels: inceptionGoldOneOfOne, verification: "unverified" }),
  inceptionCard({ slug: "inception-autograph-patch", officialName: "Inception Autograph Patch", zh: "Inception 签字切片", es: "Parche autografiado Inception", serial: "/25", displayParallelName: "Purple Foil", parallels: inceptionStandardAutographParallels, layout: "landscape" }),
  inceptionCard({ slug: "number-1-patch-autographs", officialName: "Number 1 Patch Autographs", zh: "一号门将签字切片（库尔图瓦）", es: "Autógrafos con parche Número 1 (Courtois)", serial: "1/1", displayParallelName: "Goalkeeper Gloves Wrist Strap", parallels: [...inceptionOrangeGoldParallels!, { name: "Goalkeeper Gloves Logo", serial: "1/1" }, { name: "Goalkeeper Gloves Wrist Strap", serial: "1/1" }] }),
  inceptionCard({ slug: "match-day-memories-autograph-relic", officialName: "Match Day Memories Autograph Relic", zh: "比赛日记忆签字实物", es: "Reliquia autografiada Recuerdos del partido", serial: "/10", displayParallelName: "Red Foil", parallels: inceptionShortAutographParallels, layout: "landscape" }),
  inceptionCard({ slug: "club-crest-autograph-patch-v1", officialName: "Club Crest Autograph Patch — Erling Haaland Version 1", zh: "俱乐部徽章签字切片·哈兰德版本 1", es: "Parche autografiado de escudo · Haaland Versión 1", serial: "1/1", displayParallelName: "CCA-EH1 · Version 1", parallels: [{ name: "CCA-EH1 · Version 1", serial: "1/1" }], verification: "unverified" }),
  inceptionCard({ slug: "club-crest-autograph-patch-v2", officialName: "Club Crest Autograph Patch — Erling Haaland Version 2", zh: "俱乐部徽章签字切片·哈兰德版本 2", es: "Parche autografiado de escudo · Haaland Versión 2", serial: "1/1", displayParallelName: "CCA-EH2 · Version 2", parallels: [{ name: "CCA-EH2 · Version 2", serial: "1/1" }], verification: "unverified" }),
  inceptionCard({ slug: "autograph-branded-patch-book", officialName: "Autograph Branded Patch Book", zh: "品牌切片签字书卡", es: "Libro de parche de marca autografiado", serial: "1/1", displayParallelName: "Gold Foil", parallels: inceptionGoldOneOfOne, verification: "unverified", layout: "landscape" }),
  inceptionCard({ slug: "dual-autograph-patch-book", officialName: "Dual Autograph Patch Book", zh: "双人签字切片书卡", es: "Libro de doble parche autografiado", serial: "/5", displayParallelName: "Orange Foil", parallels: inceptionOrangeGoldParallels, layout: "landscape" }),
];

export const toppsInceptionUcc202526: CardSeries = {
  slug: "topps-inception-ucc-2025-26",
  manufacturer: "Topps",
  season: "2025/26",
  name: names(
    "2025/26 Topps Inception 欧足联俱乐部赛事",
    "2025/26 Topps Inception UEFA Club Competitions",
    "2025/26 Topps Inception UEFA Club Competitions",
  ),
  packaging: {
    path: "images/topps-inception-ucc-2025-26/packaging.webp",
    verification: "exact",
    alt: names(
      "2025/26 Topps Inception 欧足联俱乐部赛事 Hobby 盒包装",
      "2025/26 Topps Inception UEFA Club Competitions Hobby box",
      "Caja Hobby 2025/26 Topps Inception UEFA Club Competitions",
    ),
  },
  totalVariants: 33,
  cardDesigns: inceptionUccCardDesigns,
};

type DecoCardInput = {
  slug: string;
  officialName: string;
  zh: string;
  es: string;
  group?: CardGroup;
  section?: CardSection;
  serial?: string;
  displayParallelName?: string;
  parallels?: CardDesign["parallels"];
  layout?: CardDesign["layout"];
  verification?: "exact" | "unverified";
  curatorNote?: LocalizedText;
};

const decoCard = ({
  slug,
  officialName,
  zh,
  es,
  group = "insert",
  section = "rare-insert",
  serial,
  displayParallelName,
  parallels,
  layout,
  verification = "exact",
  curatorNote,
}: DecoCardInput): CardDesign => ({
  slug,
  officialName,
  name: names(zh, officialName, es),
  group,
  section,
  serial: serial ?? null,
  displayParallelName,
  parallels,
  layout,
  curatorNote,
  image: {
    path: `images/topps-deco-ucc-2025-26/cards/${slug}.webp`,
    verification,
    alt: names(
      `2025/26 Topps Deco 欧足联俱乐部赛事 ${zh}代表卡`,
      `2025/26 Topps Deco UEFA Club Competitions ${officialName} representative card`,
      `Carta representativa ${es} de 2025/26 Topps Deco UEFA Club Competitions`,
    ),
  },
});

const decoMainParallels: CardDesign["parallels"] = [
  { name: "Blue", serial: "/99" },
  { name: "Green", serial: "/75" },
  { name: "Purple", serial: "/50" },
  { name: "Orange", serial: "/25" },
  { name: "Black", serial: "/10" },
  { name: "Red", serial: "/5" },
  { name: "Gold", serial: "1/1" },
];

const decoBaseCard = (input: DecoCardInput): CardDesign => decoCard({
  ...input,
  group: "base",
  section: "base-unnumbered",
  parallels: decoMainParallels,
});

const decoUccCardDesigns: CardDesign[] = [
  decoBaseCard({ slug: "current-stars", officialName: "Current Stars", zh: "当季球星", es: "Estrellas actuales", serial: "/50", displayParallelName: "Purple" }),
  decoBaseCard({ slug: "artistry", officialName: "Artistry", zh: "艺术肖像", es: "Arte", serial: "/5", displayParallelName: "Red" }),
  decoBaseCard({ slug: "moderne-marvels", officialName: "Moderne Marvels", zh: "现代巨星", es: "Maravillas modernas" }),
  decoBaseCard({ slug: "then-and-now", officialName: "Then & Now", zh: "今昔双星", es: "Antes y ahora" }),
  decoBaseCard({ slug: "one-club", officialName: "One Club", zh: "同一俱乐部", es: "Un solo club", serial: "/5", displayParallelName: "Red" }),
  decoBaseCard({ slug: "legends", officialName: "Legends", zh: "传奇", es: "Leyendas" }),
  decoBaseCard({ slug: "prodigy", officialName: "Prodigy", zh: "天才新星", es: "Prodigio" }),
  decoBaseCard({ slug: "l-nouvel-esprit", officialName: "L’Nouvel Esprit", zh: "新生代精神", es: "El nuevo espíritu" }),
  decoBaseCard({ slug: "joueur-emblematique", officialName: "Joueur Emblématique", zh: "标志性球员", es: "Jugador emblemático" }),
  decoCard({ slug: "razzmatazz", officialName: "Razzmatazz", zh: "炫目华彩", es: "Deslumbrante", section: "regular-insert", serial: "/50", displayParallelName: "Purple" }),
  decoCard({ slug: "cubist", officialName: "Cubist", zh: "立体主义", es: "Cubista" }),
  decoCard({ slug: "current-stars-autographs", officialName: "Current Stars Autographs", zh: "当季球星签字", es: "Autógrafos de estrellas actuales", serial: "1/1", displayParallelName: "Gold" }),
  decoCard({ slug: "legends-autographs", officialName: "Legends Autographs", zh: "传奇签字", es: "Autógrafos de leyendas", serial: "/25", displayParallelName: "Orange" }),
  decoCard({ slug: "joueur-emblematique-autographs", officialName: "Joueur Emblématique Autographs", zh: "标志性球员签字", es: "Autógrafos de jugador emblemático", serial: "/5", displayParallelName: "Red" }),
  decoCard({ slug: "l-nouvel-esprit-autographs", officialName: "L’Nouvel Esprit Autographs", zh: "新生代精神签字", es: "Autógrafos El nuevo espíritu", serial: "/50", displayParallelName: "Purple" }),
  decoCard({ slug: "one-club-autographs", officialName: "One Club Autographs", zh: "同一俱乐部双签", es: "Autógrafos dobles Un solo club", serial: "/5", displayParallelName: "Red" }),
  decoCard({ slug: "nouveau-short-print-autographs", officialName: "Nouveau Short Print Autographs", zh: "新艺术短印签字", es: "Autógrafos Nouveau de tirada corta", serial: "/10", displayParallelName: "Black" }),
  decoCard({ slug: "dual-autographs", officialName: "Dual Autographs", zh: "双人签字", es: "Autógrafos dobles", serial: "/10", displayParallelName: "Black", layout: "landscape" }),
  decoCard({ slug: "then-and-now-autographs", officialName: "Then & Now Autographs", zh: "今昔双星双签", es: "Autógrafos dobles Antes y ahora", serial: "/5", displayParallelName: "Red" }),
  decoCard({ slug: "triple-autographs", officialName: "Triple Autographs", zh: "三人签字", es: "Autógrafos triples", serial: "1/1", displayParallelName: "Gold" }),
  decoCard({ slug: "antiquity-autograph-relics", officialName: "Antiquity Autograph Relics", zh: "古典签字实物", es: "Reliquias autografiadas Antiquity", serial: "/25", displayParallelName: "Orange", layout: "landscape" }),
  decoCard({ slug: "prodigy-autographs", officialName: "Prodigy Autographs", zh: "天才新星签字", es: "Autógrafos Prodigy", serial: "/99", displayParallelName: "Blue" }),
  decoCard({
    slug: "only1-autographs",
    officialName: "Only1 Autographs",
    zh: "唯一签字",
    es: "Autógrafos Only1",
    serial: "1/1",
    displayParallelName: "Only1",
    parallels: [{ name: "Only1", serial: "1/1" }],
    verification: "unverified",
    curatorNote: names(
      "官方已确认该神秘 1/1 卡种，但人物与实卡图尚未公开。",
      "Topps has confirmed this mystery 1/1 card type, but its subject and physical card image have not been revealed.",
      "Topps ha confirmado este misterioso tipo de carta 1/1, pero aún no se han revelado su protagonista ni una imagen de la carta física.",
    ),
  }),
];

export const toppsDecoUcc202526: CardSeries = {
  slug: "topps-deco-ucc-2025-26",
  manufacturer: "Topps",
  season: "2025/26",
  name: names(
    "2025/26 Topps Deco 欧足联俱乐部赛事",
    "2025/26 Topps Deco UEFA Club Competitions",
    "2025/26 Topps Deco UEFA Club Competitions",
  ),
  packaging: {
    path: "images/topps-deco-ucc-2025-26/packaging.png",
    verification: "exact",
    alt: names(
      "2025/26 Topps Deco 欧足联俱乐部赛事 Hobby 盒包装",
      "2025/26 Topps Deco UEFA Club Competitions Hobby box",
      "Caja Hobby 2025/26 Topps Deco UEFA Club Competitions",
    ),
  },
  totalVariants: 23,
  cardDesigns: decoUccCardDesigns,
};

const catalogue = [
  merlinPremierLeague2026,
  toppsFinestPremierLeague2026,
  toppsChromeArsenal202526,
  toppsChromeSapphireBundesliga202526,
  toppsForeverFcBarcelona202526,
  toppsArgentinaTeamSet2026,
  toppsInceptionUcc202526,
  toppsDecoUcc202526,
  toppsRealMadridTeamSet202526,
  toppsManchesterUnitedTeamSet202526,
];

export function getCatalogue() {
  return catalogue;
}

export function getSeries(slug: string) {
  return catalogue.find((series) => series.slug === slug);
}

export function getCardDesign(slug: string, seriesSlug?: string) {
  const series = seriesSlug ? getSeries(seriesSlug) : merlinPremierLeague2026;
  return series?.cardDesigns.find((design) => design.slug === slug);
}
