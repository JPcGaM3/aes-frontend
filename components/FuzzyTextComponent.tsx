"use client";

import React, { useCallback, useEffect, useRef } from "react";

// Configuration constants for easier maintenance
const CONFIG = {
	fuzzRange: 30,
	leftMargin: 30,
	rightMargin: 30,
	verticalMargin: 0,
	widthBuffer: 15,
} as const;

interface FuzzyTextProps {
	children: React.ReactNode;
	fontSize?: number | string;
	fontWeight?: string | number;
	fontFamily?: string;
	color?: string;
	enableHover?: boolean;
	baseIntensity?: number;
	hoverIntensity?: number;
	className?: string;
	width?: number | string;
	fullWidth?: boolean;
}

interface TextMetrics {
	width: number;
	height: number;
	baseline: number;
	leftOffset: number;
}

interface CanvasSetup {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	offscreen: HTMLCanvasElement;
	offscreenCtx: CanvasRenderingContext2D;
}

const FuzzyText: React.FC<FuzzyTextProps> = ({
	children,
	fontSize = "clamp(2rem, 8vw, 8rem)",
	fontWeight = 900,
	fontFamily = "inherit",
	color = "#000",
	enableHover = true,
	baseIntensity = 0.18,
	hoverIntensity = 0.5,
	className = "",
	width,
	fullWidth = false,
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>();
	const isHoveringRef = useRef<boolean>(false);
	const cleanupRef = useRef<(() => void) | null>(null);

	// Utility: Convert fontSize to pixels
	const getFontSizeInPixels = useCallback((size: number | string): number => {
		if (typeof size === "number") return size;

		const element = document.createElement("div");

		element.style.fontSize = size;
		element.style.position = "absolute";
		element.style.visibility = "hidden";
		document.body.appendChild(element);

		const computedSize = window.getComputedStyle(element).fontSize;
		const pixelSize = parseFloat(computedSize);

		document.body.removeChild(element);

		return pixelSize;
	}, []);

	// Utility: Get resolved font family
	const getResolvedFontFamily = useCallback(
		(family: string, canvas: HTMLCanvasElement): string => {
			if (family === "inherit") {
				return (
					window.getComputedStyle(canvas).fontFamily || "sans-serif"
				);
			}

			return family;
		},
		[]
	);

	// Setup canvas and measure text
	const setupCanvas = useCallback(
		(text: string): { setup: CanvasSetup; metrics: TextMetrics } | null => {
			const canvas = canvasRef.current;

			if (!canvas) return null;

			const ctx = canvas.getContext("2d");

			if (!ctx) return null;

			// Create offscreen canvas for text rendering
			const offscreen = document.createElement("canvas");
			const offscreenCtx = offscreen.getContext("2d");

			if (!offscreenCtx) return null;

			// Setup font
			const resolvedFontFamily = getResolvedFontFamily(
				fontFamily,
				canvas
			);
			const fontSizeStr =
				typeof fontSize === "number" ? `${fontSize}px` : fontSize;
			const font = `${fontWeight} ${fontSizeStr} ${resolvedFontFamily}`;

			// Measure text
			offscreenCtx.font = font;
			offscreenCtx.textBaseline = "alphabetic";
			const textMetrics = offscreenCtx.measureText(text);

			// Calculate dimensions
			const numericFontSize = getFontSizeInPixels(fontSize);
			const leftBound = textMetrics.actualBoundingBoxLeft ?? 0;
			const rightBound =
				textMetrics.actualBoundingBoxRight ?? textMetrics.width;
			const ascent =
				textMetrics.actualBoundingBoxAscent ?? numericFontSize;
			const descent =
				textMetrics.actualBoundingBoxDescent ?? numericFontSize * 0.2;

			const textWidth = Math.ceil(leftBound + rightBound);
			const textHeight = Math.ceil(ascent + descent);

			// Setup offscreen canvas
			const offscreenWidth = textWidth + CONFIG.widthBuffer;
			const xOffset = CONFIG.widthBuffer / 2;

			offscreen.width = offscreenWidth;
			offscreen.height = textHeight;

			// Draw text on offscreen canvas
			offscreenCtx.font = font;
			offscreenCtx.textBaseline = "alphabetic";
			offscreenCtx.fillStyle = color;
			offscreenCtx.fillText(text, xOffset - leftBound, ascent);

			// Setup main canvas
			const canvasWidth = fullWidth
				? (canvas.parentElement?.clientWidth ??
					offscreenWidth + CONFIG.leftMargin + CONFIG.rightMargin)
				: offscreenWidth + CONFIG.leftMargin + CONFIG.rightMargin;

			canvas.width = canvasWidth;
			canvas.height = textHeight + CONFIG.verticalMargin * 2;
			ctx.translate(CONFIG.leftMargin, CONFIG.verticalMargin);

			return {
				setup: { canvas, ctx, offscreen, offscreenCtx },
				metrics: {
					width: textWidth,
					height: textHeight,
					baseline: ascent,
					leftOffset: xOffset - leftBound,
				},
			};
		},
		[
			fontSize,
			fontWeight,
			fontFamily,
			color,
			getFontSizeInPixels,
			getResolvedFontFamily,
		]
	);

	// Animation loop
	const startAnimation = useCallback(
		(setup: CanvasSetup, metrics: TextMetrics) => {
			const { ctx, offscreen } = setup;
			const { height } = metrics;

			const animate = () => {
				// Clear canvas - get current canvas width for full width support
				const clearWidth = fullWidth
					? setup.canvas.width
					: offscreen.width + CONFIG.fuzzRange + CONFIG.rightMargin;

				ctx.clearRect(
					-CONFIG.fuzzRange,
					-CONFIG.fuzzRange,
					clearWidth,
					height + 2 * CONFIG.fuzzRange
				);

				// Apply fuzzy effect
				const intensity = isHoveringRef.current
					? hoverIntensity
					: baseIntensity;

				for (let y = 0; y < height; y++) {
					const offset = Math.floor(
						intensity * (Math.random() - 0.5) * CONFIG.fuzzRange
					);

					ctx.drawImage(
						offscreen,
						0,
						y,
						offscreen.width,
						1,
						offset,
						y,
						offscreen.width,
						1
					);
				}

				animationRef.current = requestAnimationFrame(animate);
			};

			animate();
		},
		[baseIntensity, hoverIntensity]
	);

	// Setup mouse/touch interactions
	const setupInteractions = useCallback(
		(canvas: HTMLCanvasElement, metrics: TextMetrics) => {
			if (!enableHover) return () => {};

			// Define interactive area
			const bounds = {
				left: CONFIG.leftMargin + metrics.leftOffset,
				top: CONFIG.verticalMargin,
				right: CONFIG.leftMargin + metrics.leftOffset + metrics.width,
				bottom: CONFIG.verticalMargin + metrics.height,
			};

			const isInsideText = (x: number, y: number): boolean =>
				x >= bounds.left &&
				x <= bounds.right &&
				y >= bounds.top &&
				y <= bounds.bottom;

			// Event handlers
			const handleMouseMove = (e: MouseEvent) => {
				const rect = canvas.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				isHoveringRef.current = isInsideText(x, y);
			};

			const handleMouseLeave = () => {
				isHoveringRef.current = false;
			};

			const handleTouchMove = (e: TouchEvent) => {
				e.preventDefault();
				const rect = canvas.getBoundingClientRect();
				const touch = e.touches[0];

				if (touch) {
					const x = touch.clientX - rect.left;
					const y = touch.clientY - rect.top;

					isHoveringRef.current = isInsideText(x, y);
				}
			};

			const handleTouchEnd = () => {
				isHoveringRef.current = false;
			};

			// Add event listeners
			canvas.addEventListener("mousemove", handleMouseMove);
			canvas.addEventListener("mouseleave", handleMouseLeave);
			canvas.addEventListener("touchmove", handleTouchMove, {
				passive: false,
			});
			canvas.addEventListener("touchend", handleTouchEnd);

			// Return cleanup function
			return () => {
				canvas.removeEventListener("mousemove", handleMouseMove);
				canvas.removeEventListener("mouseleave", handleMouseLeave);
				canvas.removeEventListener("touchmove", handleTouchMove);
				canvas.removeEventListener("touchend", handleTouchEnd);
			};
		},
		[enableHover]
	);

	// Main initialization function
	const initialize = useCallback(async () => {
		// Wait for fonts to load
		if (document.fonts?.ready) {
			await document.fonts.ready;
		}

		const text = React.Children.toArray(children).join("");

		if (!text) return;

		const result = setupCanvas(text);

		if (!result) return;

		const { setup, metrics } = result;

		// Start animation
		startAnimation(setup, metrics);

		// Setup interactions
		const removeListeners = setupInteractions(setup.canvas, metrics);

		// Store cleanup function
		cleanupRef.current = () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			removeListeners();
		};
	}, [children, setupCanvas, startAnimation, setupInteractions]);

	// Initialize and cleanup
	useEffect(() => {
		initialize();

		return () => {
			if (cleanupRef.current) {
				cleanupRef.current();
			}
		};
	}, [initialize]);

	// Handle resize to update font size when clamp() values change
	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) return;

		let lastFontSize = 0;

		const resizeObserver = new ResizeObserver(() => {
			// Get current computed font size
			const currentFontSize = getFontSizeInPixels(fontSize);

			// Only reinitialize if font size actually changed
			if (Math.abs(currentFontSize - lastFontSize) > 1) {
				lastFontSize = currentFontSize;

				// Preserve hover state during update
				const currentHoverState = isHoveringRef.current;

				// Use a small delay to avoid too frequent updates
				setTimeout(() => {
					initialize().then(() => {
						isHoveringRef.current = currentHoverState;
					});
				}, 50);
			}
		});

		// Observe the parent container for size changes
		const parentElement = canvas.parentElement;

		if (parentElement) {
			resizeObserver.observe(parentElement);
		}

		return () => {
			resizeObserver.disconnect();
		};
	}, [fontSize, getFontSizeInPixels, initialize]);

	// Container styles for responsive width
	const containerStyle: React.CSSProperties = {
		display: fullWidth ? "block" : "inline-block",
		textAlign: "left",
		width: fullWidth
			? "100%"
			: width && (typeof width === "number" ? `${width}px` : width),
	};

	return (
		<div className={className} style={containerStyle}>
			<canvas
				ref={canvasRef}
				style={{
					display: "block",
					width: fullWidth ? "100%" : "auto",
					maxWidth: "100%",
					height: "auto",
				}}
			/>
		</div>
	);
};

export default FuzzyText;
