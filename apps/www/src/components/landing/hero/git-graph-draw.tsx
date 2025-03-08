import { useEffect, useRef, useState } from 'react';
import { connectDots } from './connect-dots';
import './curved-lines.css';

export function GitGraphDraw() {
	const svgRef = useRef<SVGSVGElement>(null);
	const pathsRef = useRef<SVGPathElement[]>([]);
	const box1Ref = useRef<SVGCircleElement>(null);
	const box2Ref = useRef<SVGCircleElement>(null);
	const box3Ref = useRef<SVGCircleElement>(null);
	const [viewBox, setViewBox] = useState('');

	// 1️⃣ First useEffect: Set `viewBox` based on initial size
	useEffect(() => {
		const updateViewBox = () => {
			if (!svgRef.current) return;
			const { width, height } = svgRef.current.getBoundingClientRect();
			setViewBox(`0 0 ${width} ${height}`);
		};

		updateViewBox(); // Set initially
		window.addEventListener('resize', updateViewBox);
		return () => window.removeEventListener('resize', updateViewBox);
	}, []);

	// 2️⃣ Second useEffect: Draw paths only AFTER `viewBox` updates
	useEffect(() => {
		if (!viewBox) return; // Prevent running before viewBox is set
		const box1 = box1Ref.current;
		const box2 = box2Ref.current;
		const box3 = box3Ref.current;
		const svg = svgRef.current;

		if (!box1 || !box2 || !box3 || !svg) return;

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

		updateCurve();
		window.addEventListener('resize', updateCurve);
		return () => window.removeEventListener('resize', updateCurve);
	}, [viewBox]); // 🔥 Runs only after `viewBox` updates

	const firstColumnDots = 2;
	const secondColumnDots = 6;
	const thridColumnDots = 3;

	const firstColumn = 20;
	let secondColumn = 40;
	const thirdColumn = 10;
	const dotsGap = 20;

	const viewBoxX = Number(viewBox.split(' ')[2]);
	const viewBoxY = Number(viewBox.split(' ')[3]);

	const dinamicGap = viewBoxY / secondColumnDots;

	// @
	return (
		<section className='container flex items-center justify-center gap-12'>
			<svg ref={svgRef} className='h-full w-full bg-red-300' viewBox={viewBox}>
				{Array(firstColumnDots)
					.fill(1)
					.map((_n, index) => {
						const aux = index * dinamicGap;

						return (
							<circle
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								ref={index === firstColumnDots - 1 ? box1Ref : null}
								cy={aux + firstColumn}
								cx={viewBoxX / 4}
								className='spot'
								r='4'
							/>
						);
					})}
				{Array(secondColumnDots)
					.fill(1)
					.map((_n, index) => {
						const cy = secondColumn;
						secondColumn += dotsGap;

						return (
							<circle
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								ref={index === 4 ? box2Ref : null}
								className='spot'
								cx={viewBoxX / 2}
								cy={index * dinamicGap}
								r='4'
							/>
						);
					})}
				{Array(thridColumnDots)
					.fill(1)
					.map((_n, index) => {
						const aux = index * dinamicGap;
						const cy = aux + thirdColumn;

						const cx = viewBoxX / 2 + viewBoxX / 4;

						return (
							<circle
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								ref={index === thridColumnDots - 1 ? box3Ref : null}
								className='spot'
								cx={cx}
								cy={cy}
								r='4'
							/>
						);
					})}
				<path
					className=''
					d={`M${viewBoxX / 2} 0, ${viewBoxX / 2} ${viewBoxY}`}
					stroke='green'
					strokeWidth='4'
					strokeLinecap='round'
					fill='transparent'
				/>
			</svg>
		</section>
	);
}
