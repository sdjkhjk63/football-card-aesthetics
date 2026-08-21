"use client";

import { useLanguage } from "@/components/LanguageProvider";

const content = {
  "zh-CN": {
    title: "公开评分方法",
    intro: "这里评价的是卡面设计，不评价球员水平、稀有度或市场价格。",
    card: "单张卡面总分",
    cardExplain: "玩家使用 1.0—10.0 滑杆直接给出总体审美分。构图、色彩与工艺、主题与辨识度、字体与细节作为自愿填写的精评，不再强制决定总分。",
    details: "可选精评",
    series: "系列综合分",
    explain: "只有在填写球员选图质量后，才会显示完整系列综合分。所有分数只保存在你的浏览器，不会伪装成社区平均分。",
  },
  en: {
    title: "Public scoring methodology",
    intro: "We rate card design—not player quality, rarity, or market price.",
    card: "Card design score",
    cardExplain: "Players give one overall aesthetic score with a 1.0–10.0 slider. Composition, color and finish, theme and identity, and typography and details are optional review criteria and no longer determine the main score.",
    details: "Optional detailed review",
    series: "Full series score",
    explain: "A full series score appears only after player-photo selection is rated. Scores stay in your browser and are never presented as community averages.",
  },
  es: {
    title: "Metodología pública",
    intro: "Puntuamos el diseño, no al jugador, la rareza ni el precio.",
    card: "Puntuación del diseño",
    cardExplain: "El jugador da una puntuación estética general con un control de 1,0 a 10,0. La composición, el color y acabado, el tema y la identidad, y la tipografía y detalles son criterios opcionales.",
    details: "Reseña detallada opcional",
    series: "Puntuación total de serie",
    explain: "La puntuación total aparece al valorar la selección de fotos. Tus notas permanecen en el navegador y nunca se presentan como medias comunitarias.",
  },
};

export default function MethodologyPage() {
  const { locale } = useLanguage();
  const copy = content[locale];
  return (
    <main className="methodology-page">
      <span className="kicker">OPEN METHOD · V2.0</span>
      <h1>{copy.title}</h1>
      <p className="lede">{copy.intro}</p>
      <section className="formula-card">
        <h2>{copy.card}</h2>
        <code>1.0—10.0 · {copy.card}</code>
        <p>{copy.cardExplain}</p>
        <div className="weight-grid" aria-label={copy.details}>
          <span><strong>01</strong> 构图</span>
          <span><strong>02</strong> 色彩与工艺</span>
          <span><strong>03</strong> 主题与辨识度</span>
          <span><strong>04</strong> 字体与细节</span>
        </div>
      </section>
      <section className="formula-card">
        <h2>{copy.series}</h2>
        <code>卡面平均分 × 80% + 球员选图质量 × 20%</code>
        <p>{copy.explain}</p>
      </section>
    </main>
  );
}
