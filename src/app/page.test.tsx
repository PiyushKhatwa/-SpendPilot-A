import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the SpendPilot AI landing page", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "SpendPilot AI" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /start spend audit/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start spend audit/i })).toHaveAttribute(
      "href",
      "/audit/new",
    );
    expect(screen.getAllByText("Cursor").length).toBeGreaterThan(0);
  });
});
