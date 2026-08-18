import type { Locale } from "@/domain/catalogue";

const messages = {
  brand: { "zh-CN": "卡面审美馆", en: "Card Aesthetics", es: "Estética de cartas" },
  catalogue: { "zh-CN": "系列目录", en: "Catalogue", es: "Catálogo" },
  methodology: { "zh-CN": "评分方法", en: "Methodology", es: "Metodología" },
  language: { "zh-CN": "语言", en: "Language", es: "Idioma" },
  enterSeries: { "zh-CN": "进入系列", en: "Enter series", es: "Entrar en la serie" },
  designs: { "zh-CN": "种独立卡面", en: "independent designs", es: "diseños independientes" },
  explore: { "zh-CN": "浏览并评价每一种独立设计，而不是评价球员本身。", en: "Explore and rate each independent design—not the player.", es: "Explora y puntúa cada diseño independiente, no al jugador." },
  search: { "zh-CN": "搜索卡种", en: "Search designs", es: "Buscar diseños" },
  searchPlaceholder: { "zh-CN": "输入名称，例如 Mojo", en: "Try Mojo or Refractor", es: "Prueba Mojo o Refractor" },
  all: { "zh-CN": "全部", en: "All", es: "Todo" },
  base: { "zh-CN": "基础与平行", en: "Base & parallels", es: "Base y paralelas" },
  insert: { "zh-CN": "特卡", en: "Inserts", es: "Insertos" },
  noResults: { "zh-CN": "没有找到相符卡种。", en: "No matching designs found.", es: "No se encontraron diseños." },
  myRating: { "zh-CN": "我的评分", en: "My rating", es: "Mi puntuación" },
  notRated: { "zh-CN": "尚未评分", en: "Not rated", es: "Sin puntuar" },
  composition: { "zh-CN": "构图", en: "Composition", es: "Composición" },
  colorFinish: { "zh-CN": "色彩与工艺", en: "Color & finish", es: "Color y acabado" },
  themeIdentity: { "zh-CN": "主题与辨识度", en: "Theme & identity", es: "Tema e identidad" },
  typographyDetails: { "zh-CN": "字体与细节", en: "Typography & details", es: "Tipografía y detalles" },
  selectScore: { "zh-CN": "选择分数", en: "Select score", es: "Elegir puntuación" },
  saveRating: { "zh-CN": "保存评分", en: "Save rating", es: "Guardar puntuación" },
  updateRating: { "zh-CN": "更新评分", en: "Update rating", es: "Actualizar puntuación" },
  savedLocally: { "zh-CN": "评分只保存在你的浏览器中。", en: "Your rating is saved only in this browser.", es: "Tu puntuación se guarda solo en este navegador." },
  sessionOnly: { "zh-CN": "浏览器存储不可用，本次评分只在当前会话保留。", en: "Browser storage is unavailable; ratings last for this session only.", es: "El almacenamiento no está disponible; las puntuaciones duran solo esta sesión." },
  playerSelection: { "zh-CN": "球员选图质量", en: "Player photo selection", es: "Selección de fotos" },
  saveSeriesRating: { "zh-CN": "保存系列评分", en: "Save series rating", es: "Guardar puntuación de serie" },
  cardAverage: { "zh-CN": "已评卡面平均分", en: "Rated-card average", es: "Media de cartas puntuadas" },
  fullSeries: { "zh-CN": "我的系列综合分", en: "My full series score", es: "Mi puntuación total de serie" },
  source: { "zh-CN": "图片来源", en: "Image source", es: "Fuente de imagen" },
  researchOnly: { "zh-CN": "仅用于设计研究；版权归原权利方", en: "Research reference only; rights remain with the owner", es: "Solo referencia de investigación; derechos del propietario" },
  official: { "zh-CN": "官方产品图", en: "Official product image", es: "Imagen oficial del producto" },
  backToSeries: { "zh-CN": "返回系列", en: "Back to series", es: "Volver a la serie" },
  rateDesign: { "zh-CN": "评价这个卡面", en: "Rate this design", es: "Puntúa este diseño" },
  formula: { "zh-CN": "公开评分公式", en: "Public scoring formula", es: "Fórmula pública" },
  missing: { "zh-CN": "没有找到这个内容。", en: "This content could not be found.", es: "No se encontró este contenido." },
  home: { "zh-CN": "返回首页", en: "Back home", es: "Volver al inicio" },
} as const;

export type MessageKey = keyof typeof messages;

export function translate(key: MessageKey, locale: Locale): string {
  return messages[key][locale] || messages[key].en;
}
