import React from "react";
import { render, screen } from "@testing-library/react";
import { SymbolLookupField } from "./SymbolLookupField";
import "@testing-library/jest-dom";

jest.mock("components", () => ({
  useMemoizedImage: jest.fn(() => React.createRef<HTMLImageElement>()),
}));

describe("SymbolLookupField Component", () => {
  const defaultProps = {
    text: "Sample Text",
    iconUrl: "https://example.com/icon.png",
  };

  it("renders without crashing", () => {
    render(<SymbolLookupField {...defaultProps} />);

    const textElement = screen.getByText("Sample Text");
    expect(textElement).toBeInTheDocument();

    const imgElement = screen.getByAltText("Sample Text");
    expect(imgElement).toBeInTheDocument();
    jest.mock("components", () => ({
      useMemoizedImage: jest.fn(() => (element: HTMLImageElement | null) => {
        if (element) {
          element.src = "https://example.com/icon.png";
        }
      }),
    }));
  });

  it("renders with default image dimensions", () => {
    render(<SymbolLookupField {...defaultProps} />);

    const imgElement = screen.getByAltText("Sample Text");
    expect(imgElement).toHaveAttribute("height", "25");
    expect(imgElement).toHaveAttribute("width", "25");
  });

  it("renders with custom image dimensions", () => {
    render(
      <SymbolLookupField
        {...defaultProps}
        imgHeight={50}
        imgWidth={50}
      />,
    );

    const imgElement = screen.getByAltText("Sample Text");
    expect(imgElement).toHaveAttribute("height", "50");
    expect(imgElement).toHaveAttribute("width", "50");
  });

  it("renders the text correctly", () => {
    render(<SymbolLookupField text="Another Text" />);

    const textElement = screen.getByText("Another Text");
    expect(textElement).toBeInTheDocument();
  });

  it("renders without an iconUrl", () => {
    render(<SymbolLookupField text="No Icon Text" />);

    const imgElement = screen.getByAltText("No Icon Text");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).not.toHaveAttribute("src");
  });

  it("applies additional props to the Stack component", () => {
    render(
      <SymbolLookupField
        text="With Additional Props"
        data-testid="stack-component"
        direction="column"
      />,
    );

    const stackElement = screen.getByTestId("stack-component");
    expect(stackElement).toHaveAttribute("data-testid", "stack-component");
    expect(stackElement).toHaveClass("MuiStack-root");
  });

  it("applies gap and alignment styles correctly", () => {
    render(<SymbolLookupField {...defaultProps} />);

    const stackElement = screen.getByText("Sample Text").closest(".MuiStack-root");
    expect(stackElement).toHaveStyle("gap: 16px");
  });
});
