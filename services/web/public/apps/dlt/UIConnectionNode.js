import {UINode} from './UINode.js';

const CONN_POINT_SRC_NAME_PREFIX 		= 'CONN_SRC_POINT_';
const CONN_POINT_DST_NAME_PREFIX 		= 'CONN_DST_POINT_';
const CONN_PATH_NAME_PREFIX 				= 'CONN_PATH_';
const CONN_POINT_SIZE 						= 16;
const CONN_PATH_WIDTH 						= 8;
const CONN_PATH_COLOR						= '#404040';
const CONN_SRC_COLOR							= '#000000';
const CONN_DST_COLOR							= '#808080';
const CONN_PATH_HIGHLIGHT_COLOR			= '#202020';
const CONN_SRC_HIGHLIGHT_COLOR			= '#606060';
const CONN_DST_HIGHLIGHT_COLOR			= '#A0A0A0';
class UIConnectionNode extends UINode {
	constructor(nodeId, nodeZIndex, canvas, notif, srcPosition, dstPosition, 
		srcNodeId, dstNodeId, connEventProtocol) {
		super(nodeId, nodeZIndex, canvas, notif);

		var pathEntity = {
			nodeId: this.getId(),
			type: 'PATH',
			y1: srcPosition.y, 
			x1: srcPosition.x, 
			y2: dstPosition.y, 
			x2: dstPosition.x,
			z: this.getZIndex(),
			color: CONN_PATH_COLOR,
			lineWidth: CONN_PATH_WIDTH,
			isHidden: false,
			namePrefix: CONN_PATH_NAME_PREFIX,
			name: '',
		};
		var srcEntity = {
			nodeId: this.getId(),
			type: 'RECTANGLE',
			y1: srcPosition.y-0.5*CONN_POINT_SIZE, 
			x1: srcPosition.x-0.5*CONN_POINT_SIZE, 
			y2: srcPosition.y+0.5*CONN_POINT_SIZE, 
			x2: srcPosition.x+0.5*CONN_POINT_SIZE,
			z: this.getZIndex()+1,
			color: CONN_SRC_COLOR,
			isHidden: false,
			namePrefix: CONN_POINT_SRC_NAME_PREFIX,
			name: '',
		};
		var dstEntity = {
			nodeId: this.getId(),
			type: 'RECTANGLE',
			y1: dstPosition.y-0.5*CONN_POINT_SIZE, 
			x1: dstPosition.x-0.5*CONN_POINT_SIZE, 
			y2: dstPosition.y+0.5*CONN_POINT_SIZE, 
			x2: dstPosition.x+0.5*CONN_POINT_SIZE,
			z: this.getZIndex()+2,
			color: CONN_DST_COLOR,
			isHidden: false,
			namePrefix: CONN_POINT_DST_NAME_PREFIX,
			name: '',
		};

		var ui = [pathEntity, srcEntity, dstEntity];
		this.ui = ui;
		this.srcNodeId = srcNodeId;
		this.dstNodeId = dstNodeId;
		this.connEventProtocol = connEventProtocol;
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
		this.getCanvas().style.cursor = 'pointer';
	}

	// Node protocol
	onLeftClick(entity, anchorPoint, ctrlKey, shiftKey) {
		if (shiftKey) {
			this.onDeselect();
		}
		else {
			this.onSelect();
		}
	}

	// Node protocol
	onRightClick(entity, anchorPoint, ctrlKey, shiftKey) {
		
	}

	// Node protocol
	onDrag(entity, startPosition, currentPosition, anchorPoint, ctrlKey, shiftKey) {
		switch (entity.namePrefix) {
			case CONN_POINT_SRC_NAME_PREFIX:
			this.onSrcMove(currentPosition);
			break;

			case CONN_POINT_DST_NAME_PREFIX:
			this.onDstMove(currentPosition);
			break;

			default:
			break;
		}
	}

	// Node protocol
	onDrop(entity, startPosition, dropPosition, anchorPoint, ctrlKey, shiftKey) {
		switch (entity.namePrefix) {
			case CONN_POINT_SRC_NAME_PREFIX:
			this.connEventProtocol.onSrcConnect(
				this.ui[0].nodeId, dropPosition);
			break;

			case CONN_POINT_DST_NAME_PREFIX:
			this.connEventProtocol.onDstConnect(
				this.ui[0].nodeId, dropPosition);
			break;

			default:
			break;
		}
	}

	// Node protocol
	isIn(y1, x1, y2, x2) {
		var entity = this.ui[0];
		return entity.y1 >= y1
			&& entity.x1 >= x1
			&& entity.y2 <= y2
			&& entity.x2 <= x2;
	}

	// Node protocol
	onSelect() {
		this.ui[1].color = CONN_SRC_HIGHLIGHT_COLOR;
		this.ui[0].color = CONN_PATH_HIGHLIGHT_COLOR;
		this.ui[2].color = CONN_DST_HIGHLIGHT_COLOR;
	}

	// Node protocol
	onDeselect() {
		this.ui[1].color = CONN_SRC_COLOR;
		this.ui[0].color = CONN_PATH_COLOR;
		this.ui[2].color = CONN_DST_COLOR;
	}

	// Node protocol
	isSelected() {
		return this.ui[0].color == CONN_PATH_HIGHLIGHT_COLOR;
	}

	// Node protocol
	snapshot() {
		return {
			nodeType: 'CONNECTION',
			nodeId: this.ui[0].nodeId,
			nodeZIndex: this.ui[0].z,
			srcPosition: {y: this.ui[0].y1, x: this.ui[0].x1},
			dstPosition: {y: this.ui[0].y2, x: this.ui[0].x2},
			srcNodeId: this.srcNodeId,
			dstNodeId: this.dstNodeId,
		};
	}

	onSrcMove(position) {
		var srcEntity = this.ui[1];
		srcEntity.y1 = position.y-0.5*CONN_POINT_SIZE;
		srcEntity.x1 = position.x-0.5*CONN_POINT_SIZE;
		srcEntity.y2 = position.y+0.5*CONN_POINT_SIZE;
		srcEntity.x2 = position.x+0.5*CONN_POINT_SIZE;

		var pathEntity = this.ui[0];
		pathEntity.y1 = position.y;
		pathEntity.x1 = position.x;
	}

	onDstMove(position) {
		var dstEntity = this.ui[2];
		dstEntity.y1 = position.y-0.5*CONN_POINT_SIZE;
		dstEntity.x1 = position.x-0.5*CONN_POINT_SIZE;
		dstEntity.y2 = position.y+0.5*CONN_POINT_SIZE;
		dstEntity.x2 = position.x+0.5*CONN_POINT_SIZE;

		var pathEntity = this.ui[0];
		pathEntity.y2 = position.y;
		pathEntity.x2 = position.x;
	}
}

export {UIConnectionNode};
