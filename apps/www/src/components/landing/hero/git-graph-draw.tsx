import { useEffect, useRef, useState } from 'react';
import { connectDots } from './connect-dots';
import './curved-lines.css';
import { DotsLine } from './dots-line';

export function GitGraphDraw() {
	const svgRef = useRef<SVGSVGElement>(null);
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
			// Generate new paths
			connectDots({ circle1: box1, circle2: box2, svgContainer: svg });
			connectDots({ circle1: box2, circle2: box3, svgContainer: svg });
		};

		updateCurve();
		window.addEventListener('resize', updateCurve);
		return () => window.removeEventListener('resize', updateCurve);
	}, [viewBox]); // 🔥 Runs only after `viewBox` updates

	const secondColumnDots = 6;

	const viewBoxX = Number(viewBox.split(' ')[2]);
	const viewBoxY = Number(viewBox.split(' ')[3]);

	const dinamicGap = viewBoxY / secondColumnDots;

	const firstColumn = dinamicGap / 2 + dinamicGap * 2;
	const thirdColumn = dinamicGap / 2 + dinamicGap;

	return (
		<svg ref={svgRef} className='container bg-red-300' viewBox={viewBox}>
			<DotsLine
				amount={2}
				cx={viewBoxX / 4}
				gap={dinamicGap}
				initialY={firstColumn}
				ref={box1Ref}
				branchingDot={2}
			/>
			<DotsLine
				amount={7}
				cx={viewBoxX / 2}
				gap={dinamicGap}
				initialY={0}
				ref={box2Ref}
				branchingDot={6}
			/>
			<DotsLine
				branchingDot={3}
				amount={3}
				cx={viewBoxX / 2 + viewBoxX / 4}
				gap={dinamicGap}
				initialY={thirdColumn}
				ref={box3Ref}
			/>
		</svg>
	);
}
