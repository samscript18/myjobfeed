"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const AppEffects = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();

	useEffect(() => {
		const root = document.documentElement;
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
		const isLargeViewport = window.matchMedia("(min-width: 1024px)").matches;
		const shouldAnimate = !prefersReducedMotion && hasFinePointer && isLargeViewport;

		// Keep deterministic defaults when effects are disabled.
		root.style.setProperty("--mx", "0");
		root.style.setProperty("--my", "0");
		root.style.setProperty("--cursor-x", "50%");
		root.style.setProperty("--cursor-y", "18%");

		if (!shouldAnimate) {
			root.style.setProperty("--scroll-progress", "0");
			return;
		}

		let pointerRafId = 0;
		let scrollRafId = 0;
		let pendingX = 0;
		let pendingY = 0;

		const applyPointerVars = () => {
			pointerRafId = 0;
			const normalizedX = clamp((pendingX / window.innerWidth) * 2 - 1, -1, 1);
			const normalizedY = clamp((pendingY / window.innerHeight) * 2 - 1, -1, 1);
			const xPercent = clamp((pendingX / window.innerWidth) * 100, 0, 100);
			const yPercent = clamp((pendingY / window.innerHeight) * 100, 0, 100);

			root.style.setProperty("--mx", normalizedX.toFixed(4));
			root.style.setProperty("--my", normalizedY.toFixed(4));
			root.style.setProperty("--cursor-x", `${xPercent.toFixed(2)}%`);
			root.style.setProperty("--cursor-y", `${yPercent.toFixed(2)}%`);
		};

		const applyScrollVar = () => {
			scrollRafId = 0;
			const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
			const progress = clamp(window.scrollY / maxScroll, 0, 1);
			root.style.setProperty("--scroll-progress", progress.toFixed(4));
		};

		const onPointerMove = (event: PointerEvent) => {
			pendingX = event.clientX;
			pendingY = event.clientY;
			if (pointerRafId === 0) {
				pointerRafId = window.requestAnimationFrame(applyPointerVars);
			}
		};

		const onScroll = () => {
			if (scrollRafId === 0) {
				scrollRafId = window.requestAnimationFrame(applyScrollVar);
			}
		};

		applyScrollVar();
		window.addEventListener("pointermove", onPointerMove, { passive: true });
		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("scroll", onScroll);
			if (pointerRafId !== 0) {
				window.cancelAnimationFrame(pointerRafId);
			}
			if (scrollRafId !== 0) {
				window.cancelAnimationFrame(scrollRafId);
			}
		};
	}, []);

	return (
		<div key={pathname} className="route-shell" data-route={pathname}>
			{children}
		</div>
	);
};

export default AppEffects;
