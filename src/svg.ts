export function createSvgElement<K extends keyof SVGElementTagNameMap>(
	container: HTMLElement,
	tagName: K
): SVGElementTagNameMap[K] {
	return container.doc.createElementNS('http://www.w3.org/2000/svg', tagName);
}
