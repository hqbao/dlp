class UIRender {
	constructor() {
		this.entities = [];
	}

	add(entity) {
		this.entities.push(entity);

		// Sort by z index
		this.entities.sort((a, b) => (a.z < b.z) ? -1 : ((b.z < a.z) ? 1 : 0));
	}

	setEntities(entities) {
		this.entities = entities;

		// Sort by z index
		this.entities.sort((a, b) => (a.z < b.z) ? -1 : ((b.z < a.z) ? 1 : 0));
	}

	removeByNodeId(nodeId) {
		var rmIndices = [];
		for (var i = 0; i < this.entities.length; i++) {
			if (this.entities[i].nodeId == nodeId) {
				rmIndices.push(i);
			}
		}

		for (var i = rmIndices.length - 1; i >= 0; i--) {
			this.entities.splice(rmIndices[i], 1);
		}
	}
}

export {UIRender};
