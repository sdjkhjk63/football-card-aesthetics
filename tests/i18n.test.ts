import { describe, expect, it } from "vitest";
import { localize, resolveLocale } from "@/domain/i18n";

describe("i18n helpers", () => {
  it("resolves supported locales and falls back to Chinese", () => {
    expect(resolveLocale("es")).toBe("es");
    expect(resolveLocale("fr")).toBe("zh-CN");
  });

  it("falls back to English for a missing localized card name", () => {
    expect(localize({ "zh-CN": "", en: "Refractor", es: "" }, "es")).toBe(
      "Refractor",
    );
  });
});
