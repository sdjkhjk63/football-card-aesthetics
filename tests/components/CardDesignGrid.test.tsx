import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CardDesignGrid } from "@/components/CardDesignGrid";
import { merlinPremierLeague2026 } from "@/data/catalogue";

describe("CardDesignGrid", () => {
  it("searches all 38 independent designs", async () => {
    const user = userEvent.setup();
    render(<CardDesignGrid seriesSlug={merlinPremierLeague2026.slug} designs={merlinPremierLeague2026.cardDesigns} locale="zh-CN" ratings={[]} />);
    expect(screen.getAllByRole("link")).toHaveLength(38);
    await user.type(screen.getByRole("searchbox"), "Red Mojo");
    expect(screen.getByRole("link", { name: /Red Mojo/i })).toBeVisible();
    expect(screen.queryByRole("link", { name: /VHS/i })).not.toBeInTheDocument();
  });
});
