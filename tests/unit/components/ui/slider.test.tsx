import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock radix-ui Slider to avoid ResizeObserver/timeout issues
vi.mock("radix-ui", () => ({
	Slider: {
		Root: ({ children, className, ...props }: any) => (
			<div role="slider" data-slot="slider" className={className} {...props}>
				{children}
			</div>
		),
		Track: ({ children, ...props }: any) => (
			<div data-slot="slider-track" {...props}>{children}</div>
		),
		Range: (props: any) => <div data-slot="slider-range" {...props} />,
		Thumb: (props: any) => <div data-slot="slider-thumb" {...props} />,
	},
}));

import { Slider } from "#/components/ui/slider";

describe("Slider", () => {
	it("renders a slider with default values", () => {
		const { container } = render(<Slider defaultValue={[50]} />);
		const slider = container.querySelector("[data-slot='slider']");
		expect(slider).toBeInTheDocument();
	});

	it("renders with value prop", () => {
		const { container } = render(<Slider value={[30, 70]} />);
		const slider = container.querySelector("[data-slot='slider']");
		expect(slider).toBeInTheDocument();
		// Should render 2 thumbs
		const thumbs = container.querySelectorAll("[data-slot='slider-thumb']");
		expect(thumbs.length).toBe(2);
	});

	it("renders with custom min and max", () => {
		const { container } = render(<Slider min={10} max={200} defaultValue={[50]} />);
		const slider = container.querySelector("[data-slot='slider']");
		expect(slider).toBeInTheDocument();
	});

	it("renders track and range", () => {
		const { container } = render(<Slider defaultValue={[50]} />);
		const track = container.querySelector("[data-slot='slider-track']");
		const range = container.querySelector("[data-slot='slider-range']");
		expect(track).toBeInTheDocument();
		expect(range).toBeInTheDocument();
	});

	it("merges custom className", () => {
		const { container } = render(<Slider className="custom-slider" defaultValue={[50]} />);
		const slider = container.querySelector("[data-slot='slider']");
		expect(slider?.className).toContain("custom-slider");
	});

	it("renders with no value and no defaultValue (falls back to [min, max])", () => {
		const { container } = render(<Slider />);
		const thumbs = container.querySelectorAll("[data-slot='slider-thumb']");
		// Falls back to [min, max] which is [0, 100] = 2 thumbs
		expect(thumbs.length).toBe(2);
	});
});
