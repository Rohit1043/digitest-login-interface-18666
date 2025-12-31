import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders DigiTest Login header", () => {
  render(<App />);
  const heading = screen.getByRole("heading", { name: /digitest login/i });
  expect(heading).toBeInTheDocument();
});
