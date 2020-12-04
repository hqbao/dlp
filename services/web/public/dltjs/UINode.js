class UINode {
	#id
	#zIndex
	#canvas
	#notif
	constructor(nodeId, nodeZIndex, canvas, notif) {
		if (new.target === Node) { 
			throw new Error("Can not construct Node instances directly");
		}

		this.#id = nodeId;
		this.#zIndex = nodeZIndex;
		this.#canvas = canvas;
		this.#notif = notif;
	}

	getId() {
		return this.#id;
	}

	getZIndex() {
		return this.#zIndex;
	}

	getCanvas() {
		return this.#canvas;
	}

	getnotif() {
		return this.#notif;
	}

	getName() {
		throw new Error("Implement (getName) not found");
	}

	getEntities() {
		throw new Error("Implement (getEntities) not found");
	}

	onHover(entity, position, anchorPoint) {
		throw new Error("Implement (onHover) not found");
	}

	onLeftClick(entity, anchorPoint, ctrlKey, shiftKey) {
		throw new Error("Implement (onLeftClick) not found");
	}

	onRightClick(entity, anchorPoint, ctrlKey, shiftKey) {
		throw new Error("Implement (onRightClick) not found");
	}

	onDrag(entity, startPosition, currentPosition, anchorPoint, ctrlKey, shiftKey) {
		throw new Error("Implement (onDrag) not found");
	}

	onDrop(entity, startPosition, dropPosition, anchorPoint, ctrlKey, shiftKey) {
		throw new Error("Implement (onDrop) not found");
	}

	snapshot() {
		throw new Error("Implement (snapshot) not found");
	}
}

export {UINode};