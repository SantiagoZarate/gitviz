import { useEffect, useRef } from 'react';
import { connectDots } from './connect-dots';
import './curved-lines.css';

export function GitGraphDraw() {
	const svgRef = useRef<SVGSVGElement>(null);
	const pathsRef = useRef<SVGPathElement[]>([]);
	const box1Ref = useRef<SVGCircleElement>(null);
	const box2Ref = useRef<SVGCircleElement>(null);
	const box3Ref = useRef<SVGCircleElement>(null);

	useEffect(() => {
		const box1 = box1Ref.current;
		const box2 = box2Ref.current;
		const box3 = box3Ref.current;
		const svg = svgRef.current;

		if (!box1 || !box2 || !box3 || !svg) return;

		console.log('EJECUTANDO');

		const updateCurve = () => {
			// Remove existing paths
			pathsRef.current.forEach((path) => svg.removeChild(path));
			pathsRef.current = [];

			// Generate new paths
			pathsRef.current.push(
				connectDots({ circle1: box1, circle2: box2, svgContainer: svg }),
			);
			pathsRef.current.push(
				connectDots({ circle1: box2, circle2: box3, svgContainer: svg }),
			);
		};
		updateCurve(); // Initial draw

		window.addEventListener('resize', updateCurve);
		return () => window.removeEventListener('resize', updateCurve);
	}, []);

	let firstColumn = 20;
	let secondColumn = 40;
	let thirdColumn = 10;
	const dotsGap = 20;

	// @
	return (
		<section className='container flex items-center justify-center gap-12'>
			<svg ref={svgRef} className='h-full w-full bg-red-300'>
				{Array(2)
					.fill(1)
					.map((_n, index) => {
						const cy = firstColumn;
						firstColumn += dotsGap;
						return (
							<circle
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								ref={index === 1 ? box1Ref : null}
								className='spot'
								cx='50'
								cy={cy}
								r='4'
							/>
						);
					})}
				{Array(6)
					.fill(1)
					.map((_n, index) => {
						const cy = secondColumn;
						secondColumn += dotsGap;

						return (
							<circle
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								ref={index === 2 ? box2Ref : null}
								className='spot'
								cx='100'
								cy={cy}
								r='4'
							/>
						);
					})}
				{Array(3)
					.fill(1)
					.map((_n, index) => {
						const cy = thirdColumn;
						thirdColumn += dotsGap;
						return (
							<circle
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								ref={index === 2 ? box3Ref : null}
								className='spot'
								cx='150'
								cy={cy}
								r='4'
							/>
						);
					})}
			</svg>
		</section>
	);
}
