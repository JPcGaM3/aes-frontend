"use client";

import React, { useEffect, useRef, useState } from "react";

interface FuzzyTextProps {
	children: React.ReactNode;
	baseIntensity?: number;
	hoverIntensity?: number;
	color?: string;
	enableHover?: boolean;
	fontSize?: string;
	fontWeight?: number;
	fontFamily?: string;
	textAlign?: "text-center" | "text-start" | "text-end";
	className?: string;
}

const FuzzyText: React.FC<FuzzyTextProps> = ({
	children,
	baseIntensity = 0.15,
	hoverIntensity = 0.35,
	color = "rgba(239, 68, 68, 0.9)",
	enableHover = true,
	fontSize = "9rem",
	fontWeight = 700,
	fontFamily = "inherit",
	textAlign = "text-center",
	className = "",
}) => {
	const textRef = useRef<HTMLDivElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	// Convert intensity values to CSS-friendly values
	const baseBlur = baseIntensity * 10; // 0.15 -> 1.5px
	const hoverBlur = hoverIntensity * 10; // 0.35 -> 3.5px

	useEffect(() => {
		const element = textRef.current;

		if (!element) return;

		let animationFrame: number;
		let isRunning = true;

		const animate = () => {
			if (!isRunning) return;

			const intensity = isHovered ? hoverIntensity : baseIntensity;
			const blur = isHovered ? hoverBlur : baseBlur;
			const offset = intensity * 20;

			// Generate random glitch effects
			const translateX = (Math.random() - 0.5) * offset;
			const translateY = (Math.random() - 0.5) * offset;
			const currentBlur = blur * (0.5 + Math.random() * 0.5);

			const shadowX1 = (Math.random() - 0.5) * offset;
			const shadowY1 = (Math.random() - 0.5) * offset;
			const shadowX2 = (Math.random() - 0.5) * offset;
			const shadowY2 = (Math.random() - 0.5) * offset;
			const shadowX3 = (Math.random() - 0.5) * offset;
			const shadowY3 = (Math.random() - 0.5) * offset;

			element.style.transform = `translate(${translateX}px, ${translateY}px)`;
			element.style.filter = `blur(${currentBlur}px)`;
			element.style.textShadow = `
				${shadowX1}px ${shadowY1}px ${blur}px ${color},
				${shadowX2}px ${shadowY2}px ${blur * 1.5}px ${color},
				${shadowX3}px ${shadowY3}px ${blur * 2}px ${color}
			`;

			// Adjust animation speed based on hover state
			const delay = isHovered ? 50 : 100;

			setTimeout(() => {
				animationFrame = requestAnimationFrame(animate);
			}, delay);
		};

		animate();

		return () => {
			isRunning = false;
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	}, [isHovered, baseIntensity, hoverIntensity, color, baseBlur, hoverBlur]);

	const handleMouseEnter = () => {
		if (enableHover) {
			setIsHovered(true);
		}
	};

	const handleMouseLeave = () => {
		if (enableHover) {
			setIsHovered(false);
		}
	};

	return (
		<div className={`relative inline-block ${className}`}>
			<div
				ref={textRef}
				className={`${textAlign} select-none cursor-default`}
				style={{
					fontSize,
					fontWeight,
					fontFamily,
					color,
					userSelect: "none",
					position: "relative",
					display: "inline-block",
				}}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				{children}
			</div>
		</div>
	);
};

export default FuzzyText;
