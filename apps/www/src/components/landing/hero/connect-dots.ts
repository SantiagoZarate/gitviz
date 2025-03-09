interface Options {
	circle1: SVGCircleElement;
	circle2: SVGCircleElement;
	svgContainer: SVGSVGElement;
}

export function connectDots({ circle1, circle2, svgContainer }: Options) {
	// Circle 1 coordinates
	const p1x = Number.parseFloat(circle1.getAttribute('cx')!);
	const p1y = Number.parseFloat(circle1.getAttribute('cy')!);
	// Circle 2 coordinates
	const p2x = Number.parseFloat(circle2.getAttribute('cx')!);
	const p2y = Number.parseFloat(circle2.getAttribute('cy')!);

	// Calculate the vertical difference
	const verticalDiff = Math.abs(p2y - p1y);
	const controlOffset = verticalDiff * 0.7; // Adjust multiplier as needed

	// Determine control points dynamically
	const isBox1Above = p1y < p2y;

	// Adjust control points based on relative position
	const c1x = p1x;
	const c1y = isBox1Above ? p1y + controlOffset : p1y - controlOffset;
	const c2x = p2x;
	const c2y = isBox1Above ? p2y - controlOffset : p2y + controlOffset;

	// Construct the cubic Bézier curve
	const curve = `M${p1x} ${p1y} C${c1x},${c1y} ${c2x},${c2y} ${p2x} ${p2y}`;

	// Create a new <path> element
	// const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	// path.setAttribute('d', curve);
	// path.setAttribute('stroke', 'green');
	// path.setAttribute('stroke-width', '4');
	// path.setAttribute('stroke-linecap', 'round');
	// path.setAttribute('fill', 'transparent');

	// Append to SVG container
	// svgContainer.appendChild(path);

	return curve;
}
