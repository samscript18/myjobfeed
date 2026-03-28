"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const AppEffects = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();

	useEffect(() => {
		const root = document.documentElement;
		let rafId = 0;
		let pendingX = 0;
		let pendingY = 0;

		const applyPointerVars = () => {
			rafId = 0;
			const normalizedX = clamp((pendingX / window.innerWidth) * 2 - 1, -1, 1);
			const normalizedY = clamp((pendingY / window.innerHeight) * 2 - 1, -1, 1);
			const xPercent = clamp((pendingX / window.innerWidth) * 100, 0, 100);
			const yPercent = clamp((pendingY / window.innerHeight) * 100, 0, 100);

			root.style.setProperty("--mx", normalizedX.toFixed(4));
			root.style.setProperty("--my", normalizedY.toFixed(4));
			root.style.setProperty("--cursor-x", `${xPercent.toFixed(2)}%`);
			root.style.setProperty("--cursor-y", `${yPercent.toFixed(2)}%`);
		};

		const onPointerMove = (event: PointerEvent) => {
			pendingX = event.clientX;
			pendingY = event.clientY;
			if (rafId === 0) {
				rafId = window.requestAnimationFrame(applyPointerVars);
			}
		};

		const onScroll = () => {
			const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
			const progress = clamp(window.scrollY / maxScroll, 0, 1);
			root.style.setProperty("--scroll-progress", progress.toFixed(4));
		};

		onScroll();
		window.addEventListener("pointermove", onPointerMove, { passive: true });
		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("scroll", onScroll);
			if (rafId !== 0) {
				window.cancelAnimationFrame(rafId);
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
