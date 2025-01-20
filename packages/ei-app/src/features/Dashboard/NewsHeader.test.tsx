import { render, screen } from "@testing-library/react";
import { NewsHeader } from "./NewsHeader";
import { formatDistanceToNow } from "date-fns";

jest.mock("date-fns", () => ({
  formatDistanceToNow: jest.fn().mockReturnValue("2 hours ago"),
}));

describe("NewsHeader", () => {
  it("should render the source text", () => {
    render(
      <NewsHeader
        ago={1609459200}
        source="Crypto News"
        tokensIconsUrls={[]}
      />,
    );
    expect(screen.getByText("2 hours ago · Crypto News")).toBeInTheDocument();
  });

  it("should display the correct number of token icons", () => {
    render(
      <NewsHeader
        ago={1609459200}
        source="Crypto News"
        tokensIconsUrls={["url1", "url2"]}
      />,
    );

    const avatars = screen.getAllByRole("img");
    expect(avatars).toHaveLength(2);
    expect(avatars[0]).toHaveAttribute("src", "url1");
    expect(avatars[1]).toHaveAttribute("src", "url2");
  });

  it("should render a single avatar with correct styling for multiple token icons", () => {
    render(
      <NewsHeader
        ago={1609459200}
        source="Crypto News"
        tokensIconsUrls={["url1"]}
      />,
    );

    const avatar = screen.getByRole("img");
    expect(avatar).toHaveAttribute("src", "url1");

    // Checking if the Avatar has applied default styles
    expect(avatar).toHaveStyle("width: 100%; height: 100%;"); // Adjusted to match the applied styles
  });

  it("should not display avatars if no token icon URLs are provided", () => {
    render(
      <NewsHeader
        ago={1609459200}
        source="Crypto News"
        tokensIconsUrls={[]}
      />,
    );
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("should call formatDistanceToNow with the correct timestamp", () => {
    render(
      <NewsHeader
        ago={1609459200}
        source="Crypto News"
        tokensIconsUrls={[]}
      />,
    );

    expect(formatDistanceToNow).toHaveBeenCalledWith(new Date(1609459200 * 1000), { addSuffix: true });
  });
});
