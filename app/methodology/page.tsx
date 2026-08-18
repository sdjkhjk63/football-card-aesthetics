"use client";

import { useLanguage } from "@/components/LanguageProvider";

const content = {
  "zh-CN": { title: "公开评分方法", intro: "这里评价的是卡面设计，不评价球员水平、稀有度或市场价格。", card: "单张卡面总分", series: "系列综合分", explain: "只有在填写球员选图质量后，才会显示完整系列综合分。所有分数只保存在你的浏览器，不会伪装成社区平均分。" },
  en: { title: "Public scoring methodology", intro: "We rate card design—not player quality, rarity, or market price.", card: "Card design score", series: "Full series score", explain: "A full series score appears only after player-photo selection is rated. Scores stay in your browser and are never presented as community averages." },
  es: { title: "Metodología pública", intro: "Puntuamos el diseño, no al jugador, la rareza ni el precio.", card: "Puntuación del diseño", series: "Puntuación total de serie", explain: "La puntuación total aparece al valorar la selección de fotos. Tus notas permanecen en el navegador y nunca se presentan como medias comunitarias." },
};

export default function MethodologyPage() {
  const { locale } = useLanguage();
  const copy = content[locale];
  return <main className="methodology-page"><span className="kicker">OPEN WEIGHTS · V1.0</span><h1>{copy.title}</h1><p className="lede">{copy.intro}</p><section className="formula-card"><h2>{copy.card}</h2><code>(构图 × 30%) + (色彩与工艺 × 30%) + (主题与辨识度 × 25%) + (字体与细节 × 15%)</code><div className="weight-grid"><span><strong>30%</strong> 构图</span><span><strong>30%</strong> 色彩与工艺</span><span><strong>25%</strong> 主题与辨识度</span><span><strong>15%</strong> 字体与细节</span></div></section><section className="formula-card"><h2>{copy.series}</h2><code>卡面平均分 × 80% + 球员选图质量 × 20%</code><p>{copy.explain}</p></section></main>;
}
