import {UINode} from './UINode.js';

const BACKGROUND_NAME_PREFIX 				= 'BACKGROUND_';
const SELECTED_AREA_NAME_PREFIX 			= 'SELECTED_ARE_';
const Z_INDEX_SELECTED_AREA_BOX 			= 3000000;
const BACKGROUND_COLOR						= '#FFFFFF';
const BACKGROUND_CARO_COLOR				= '#000000';
const BACKGROUND_SELECTED_AREA_COLOR	= '#000000';
const NODE_TYPE_BACKGROUND					= 'BACKGROUND'
class UIBackgroundNode extends UINode {
	constructor(nodeId, nodeZIndex, canvas, extEventMap, height, width, movingUnit, backgroundEventProtocol) {
		super(nodeId, nodeZIndex, canvas, extEventMap);

		this.ui = [
			{
				nodeId: this.getId(),
				type: 'RECTANGLE',
				y1: 0, 
				x1: 0, 
				y2: height, 
				x2: width,
				z: this.getZIndex(),
				color: BACKGROUND_COLOR,
				isHidden: false,
				namePrefix: BACKGROUND_NAME_PREFIX,
				name: '',
			},
			{
				nodeId: this.getId(),
				type: 'RECTANGLE',
				y1: 0, 
				x1: 0, 
				y2: 0, 
				x2: 0,
				z: Z_INDEX_SELECTED_AREA_BOX,
				color: BACKGROUND_SELECTED_AREA_COLOR,
				fill: false,
				lineWidth: 0.2,
				isHidden: true,
				namePrefix: SELECTED_AREA_NAME_PREFIX,
				name: '',
			},
		];
		for (var i = 0; i < height/movingUnit/2; i++) {
			var line = {
				nodeId: this.getId(),
				type: 'PATH',
				y1: i*2*movingUnit, 
				x1: 0, 
				y2: i*2*movingUnit, 
				x2: width,
				z: this.getZIndex(),
				color: BACKGROUND_CARO_COLOR,
				lineWidth: 0.2,
				isHidden: false,
				namePrefix: '',
				name: '',
			};
			this.ui.push(line);
		}

		for (var i = 0; i < width/movingUnit/2; i++) {
			var line = {
				nodeId: this.getId(),
				type: 'PATH',
				y1: 0, 
				x1: i*2*movingUnit, 
				y2: height, 
				x2: i*2*movingUnit,
				z: this.getZIndex(),
				color: '#000000',
				lineWidth: 0.2,
				isHidden: false,
				namePrefix: '',
				name: '',
			};
			this.ui.push(line);
		}

		this.backgroundEventProtocol = backgroundEventProtocol;
	}

	// Node protocol
	getName() {
		return this.ui[0].name;
	}

	// Node protocol
	getEntities() {
		return this.ui;
	}

	// Node protocol
	onHover(entity, position, anchorPoint) {
		this.getCanvas().style.cursor = 'default';
	}

	// Node protocol
	onLeftClick(entity, anchorPoint, ctrlKey, shiftKey) {
		if (this.backgroundEventProtocol.onBackgroundLeftClick != undefined) {
			this.backgroundEventProtocol.onBackgroundLeftClick(
				anchorPoint, ctrlKey, shiftKey);
		}
	}

	// Node protocol
	onRightClick(entity, anchorPoint, ctrlKey, shiftKey) {
		if (this.backgroundEventProtocol.onBackgroundRightClick != undefined) {
			this.backgroundEventProtocol.onBackgroundRightClick(
				anchorPoint, ctrlKey, shiftKey);
		}
	}

	// Node protocol
	onDrag(entity, startPosition, currentPosition, anchorPoint, ctrlKey, shiftKey) {
		var selectedAreaEntity = this.ui[1];
		selectedAreaEntity.isHidden = false;
		selectedAreaEntity.y1 = startPosition.y;
		selectedAreaEntity.x1 = startPosition.x;
		selectedAreaEntity.y2 = currentPosition.y;
		selectedAreaEntity.x2 = currentPosition.x;
	}

	// Node protocol
	onDrop(entity, startPosition, dropPosition, anchorPoint, ctrlKey, shiftKey) {
		var selectedAreaEntity = this.ui[1];

		this.backgroundEventProtocol.onAreaSelect(
			Math.min(selectedAreaEntity.y1, selectedAreaEntity.y2), 
			Math.min(selectedAreaEntity.x1, selectedAreaEntity.x2),
			Math.max(selectedAreaEntity.y1, selectedAreaEntity.y2), 
			Math.max(selectedAreaEntity.x1, selectedAreaEntity.x2));

		selectedAreaEntity.isHidden = true;
		selectedAreaEntity.y1 = 0;
		selectedAreaEntity.x1 = 0;
		selectedAreaEntity.y2 = 0;
		selectedAreaEntity.x2 = 0;
	}

	snapshot() {
		return {
			nodeType: NODE_TYPE_BACKGROUND,
			nodeId: this.ui[0].nodeId,
			nodeZIndex: this.ui[0].z,
		};
	}
}

export {UIBackgroundNode};
