export function connectDivs(
	div1: SVGCircleElement,
	div2: SVGCircleElement,
	svg: SVGSVGElement,
) {
	const rect1 = div1.getBoundingClientRect();
	const rect2 = div2.getBoundingClientRect();

	const x1 = rect1.left + rect1.width / 2;
	const y1 = rect1.top + rect1.height / 2;
	const x2 = rect2.left + rect2.width / 2;
	const y2 = rect2.top + rect2.height / 2;

	// Control points for smooth curve
	const dx = Math.abs(x2 - x1) * 0.4;
	const xControl1 = x1 + dx;
	const yControl1 = y1;
	const xControl2 = x2 - dx;
	const yControl2 = y2;

	// Define cubic Bézier path
	const pathData = `M ${x1},${y1} C ${xControl1},${yControl1} ${xControl2},${yControl2} ${x2},${y2}`;

	// Ensure SVG covers the required area
	const minX = Math.min(x1, x2) - 20;
	const minY = Math.min(y1, y2) - 20;
	const maxX = Math.max(x1, x2) + 20;
	const maxY = Math.max(y1, y2) + 20;
	svg.setAttribute('viewBox', `${minX} ${minY} ${maxX - minX} ${maxY - minY}`);
	svg.setAttribute('width', `${maxX - minX}`);
	svg.setAttribute('height', `${maxY - minY}`);

	console.log({ pathData });

	// Create or update the path
	let path = svg.querySelector('path');
	if (!path) {
		path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.classList.add('path');
		svg.appendChild(path);
	}
	path.setAttribute('d', pathData);
}
