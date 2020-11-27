import {UINode} from './UINode.js';

const SIZE_EDITOR_NAME_PREFIX				= 'SIZE_EDITOR_';
const SIZE_EDITOR_NAME_LEFT 				= 'LEFT';
const SIZE_EDITOR_NAME_TOP 				= 'TOP';
const SIZE_EDITOR_NAME_RIGHT 				= 'RIGHT';
const SIZE_EDITOR_NAME_BOTTOM 			= 'BOTTOM';
const SIZE_EDITOR_NAME_LEFT_TOP 			= 'LEFT_TOP';
const SIZE_EDITOR_NAME_TOP_RIGHT 		= 'TOP_RIGHT';
const SIZE_EDITOR_NAME_RIGHT_BOTTOM 	= 'RIGHT_BOTTOM';
const SIZE_EDITOR_NAME_BOTTOM_LEFT 		= 'BOTTOM_LEFT';
const SIZE_EDITOR_LINE_WIDTH				= 8;
const SIZE_EDITOR_CORNER_BOX_SIZE		= 16;
const SIZE_EDITOR_EDGE_COLOR				= '#E0E0E0';
const SIZE_EDITOR_CORNER_COLOR			= '#D0D0D0';
class UISizeEditor extends UINode {
	constructor(nodeId, nodeZIndex, canvas, extEventMap, y1, x1, y2, x2, entities) {
		super(nodeId, nodeZIndex, canvas, extEventMap);

		this.ui = [
			{
				nodeId: this.getId(),
				type: 'PATH',
				y1: y1, 
				x1: x1, 
				y2: y2, 
				x2: x1,
				z: this.getZIndex()+0,
				color: SIZE_EDITOR_EDGE_COLOR,
				lineWidth: SIZE_EDITOR_LINE_WIDTH,
				isHidden: true,
				namePrefix: SIZE_EDITOR_NAME_PREFIX,
				name: SIZE_EDITOR_NAME_LEFT,
			},
			{
				nodeId: this.getId(),
				type: 'PATH',
				y1: y1, 
				x1: x1, 
				y2: y1, 
				x2: x2,
				z: this.getZIndex()+1,
				color: SIZE_EDITOR_EDGE_COLOR,
				lineWidth: SIZE_EDITOR_LINE_WIDTH,
				isHidden: true,
				namePrefix: SIZE_EDITOR_NAME_PREFIX,
				name: SIZE_EDITOR_NAME_TOP,
			},
			{
				nodeId: this.getId(),
				type: 'PATH',
				y1: y1, 
				x1: x2, 
				y2: y2, 
				x2: x2,
				z: this.getZIndex()+2,
				color: SIZE_EDITOR_EDGE_COLOR,
				lineWidth: SIZE_EDITOR_LINE_WIDTH,
				isHidden: true,
				namePrefix: SIZE_EDITOR_NAME_PREFIX,
				name: SIZE_EDITOR_NAME_RIGHT,
			},
			{
				nodeId: this.getId(),
				type: 'PATH',
				y1: y2, 
				x1: x1, 
				y2: y2, 
				x2: x2,
				z: this.getZIndex()+3,
				color: SIZE_EDITOR_EDGE_COLOR,
				lineWidth: SIZE_EDITOR_LINE_WIDTH,
				isHidden: true,
				namePrefix: SIZE_EDITOR_NAME_PREFIX,
				name: SIZE_EDITOR_NAME_BOTTOM,
			},
			{
				nodeId: this.getId(),
				type: 'RECTANGLE',
				y1: y1-0.5*SIZE_EDITOR_CORNER_BOX_SIZE, 
				x1: x1-0.5*SIZE_EDITOR_CORNER_BOX_SIZE, 
				y2: y1+0.5*SIZE_EDITOR_CORNER_BOX_SIZE, 
				x2: x1+0.5*SIZE_EDITOR_CORNER_BOX_SIZE,
				z: this.getZIndex()+4,
				color: SIZE_EDITOR_CORNER_COLOR,
				isHidden: true,
				namePrefix: SIZE_EDITOR_NAME_PREFIX,
				name: SIZE_EDITOR_NAME_LEFT_TOP,
			},
			{
				nodeId: this.getId(),
				type: 'RECTANGLE',
				y1: y1-0.5*SIZE_EDITOR_CORNER_BOX_SIZE, 
				x1: x2-0.5*SIZE_EDITOR_CORNER_BOX_SIZE, 
				y2: y1+0.5*SIZE_EDITOR_CORNER_BOX_SIZE, 
				x2: x2+0.5*SIZE_EDITOR_CORNER_BOX_SIZE,
				z: this.getZIndex()+5,
				color: SIZE_EDITOR_CORNER_COLOR,
				isHidden: true,
				namePrefix: SIZE_EDITOR_NAME_PREFIX,
				name: SIZE_EDITOR_NAME_TOP_RIGHT,
			},
			{
				nodeId: this.getId(),
				type: 'RECTANGLE',
				y1: y2-0.5*SIZE_EDITOR_CORNER_BOX_SIZE, 
				x1: x2-0.5*SIZE_EDITOR_CORNER_BOX_SIZE, 
				y2: y2+0.5*SIZE_EDITOR_CORNER_BOX_SIZE, 
				x2: x2+0.5*SIZE_EDITOR_CORNER_BOX_SIZE,
				z: this.getZIndex()+6,
				color: SIZE_EDITOR_CORNER_COLOR,
				isHidden: true,
				namePrefix: SIZE_EDITOR_NAME_PREFIX,
				name: SIZE_EDITOR_NAME_RIGHT_BOTTOM,
			},
			{
				nodeId: this.getId(),
				type: 'RECTANGLE',
				y1: y2-0.5*SIZE_EDITOR_CORNER_BOX_SIZE, 
				x1: x1-0.5*SIZE_EDITOR_CORNER_BOX_SIZE, 
				y2: y2+0.5*SIZE_EDITOR_CORNER_BOX_SIZE, 
				x2: x1+0.5*SIZE_EDITOR_CORNER_BOX_SIZE,
				z: this.getZIndex()+7,
				color: SIZE_EDITOR_CORNER_COLOR,
				isHidden: true,
				namePrefix: SIZE_EDITOR_NAME_PREFIX,
				name: SIZE_EDITOR_NAME_BOTTOM_LEFT,
			},
		];

		for (var i = 0; i < this.ui.length; i++) {
			entities.push(this.ui[i]);
		}
	}

	show() {
		for (var i = 0; i < this.ui.length; i++) {
			this.ui[i].isHidden = false;
		}
	}

	hide() {
		for (var i = 0; i < this.ui.length; i++) {
			this.ui[i].isHidden = true;
		}
	}

	focus(entity) {
		var left = this.ui[0];
		var top = this.ui[1];
		var right = this.ui[2];
		var bottom = this.ui[3];
		var leftTop = this.ui[4];
		var topRight = this.ui[5];
		var rightBottom = this.ui[6];
		var bottomLeft = this.ui[7];

		left.y1 = entity.y1;
		left.x1 = entity.x1;
		left.y2 = entity.y2;
		left.x2 = entity.x1;

		top.y1 = entity.y1;
		top.x1 = entity.x1;
		top.y2 = entity.y1;
		top.x2 = entity.x2;

		right.y1 = entity.y1;
		right.x1 = entity.x2;
		right.y2 = entity.y2;
		right.x2 = entity.x2;

		bottom.y1 = entity.y2;
		bottom.x1 = entity.x1;
		bottom.y2 = entity.y2;
		bottom.x2 = entity.x2;

		leftTop.y1 = entity.y1-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		leftTop.x1 = entity.x1-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		leftTop.y2 = entity.y1+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		leftTop.x2 = entity.x1+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		topRight.y1 = entity.y1-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		topRight.x1 = entity.x2-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		topRight.y2 = entity.y1+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		topRight.x2 = entity.x2+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		rightBottom.y1 = entity.y2-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		rightBottom.x1 = entity.x2-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		rightBottom.y2 = entity.y2+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		rightBottom.x2 = entity.x2+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		bottomLeft.y1 = entity.y2-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		bottomLeft.x1 = entity.x1-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		bottomLeft.y2 = entity.y2+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		bottomLeft.x2 = entity.x1+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
	}

	updateLeft(node, position) {
		var entity = node.ui[0];
		var x = Math.min(position.x, entity.x2-SIZE_EDITOR_CORNER_BOX_SIZE);

		var left = this.ui[0];
		left.x1 = x;
		left.x2 = x;

		var top = this.ui[1];
		top.x1 = x;

		var bottom = this.ui[3];
		bottom.x1 = x;

		var leftTop = this.ui[4];
		leftTop.x1 = x-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		leftTop.x2 = x+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		var bottomLeft = this.ui[7];
		bottomLeft.x1 = x-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		bottomLeft.x2 = x+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		// Update main entity layout
		node.updateLayoutWithConstraints(undefined, x, undefined, undefined);
	}

	updateTop(node, position) {
		var entity = node.ui[0];
		var y = Math.min(position.y, entity.y2-SIZE_EDITOR_CORNER_BOX_SIZE);

		var top = this.ui[1];
		top.y1 = y;
		top.y2 = y;

		var left = this.ui[0];
		left.y1 = y;

		var right = this.ui[2];
		right.y1 = y;

		var leftTop = this.ui[4];
		leftTop.y1 = y-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		leftTop.y2 = y+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		var topRight = this.ui[5];
		topRight.y1 = y-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		topRight.y2 = y+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		// Update main entity layout
		node.updateLayoutWithConstraints(y, undefined, undefined, undefined);
	}

	updateRight(node, position) {
		var entity = node.ui[0];
		var x = Math.max(position.x, entity.x1+SIZE_EDITOR_CORNER_BOX_SIZE);

		var right = this.ui[2];
		right.x1 = x;
		right.x2 = x;

		var top = this.ui[1];
		top.x2 = x;

		var bottom = this.ui[3];
		bottom.x2 = x;

		var topRight = this.ui[5];
		topRight.x1 = x-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		topRight.x2 = x+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		var rightBottom = this.ui[6];
		rightBottom.x1 = x-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		rightBottom.x2 = x+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		// Update main entity layout
		node.updateLayoutWithConstraints(undefined, undefined, undefined, x);
	}

	updateBottom(node, position) {
		var entity = node.ui[0];
		var y = Math.max(position.y, entity.y1+SIZE_EDITOR_CORNER_BOX_SIZE);

		var bottom = this.ui[3];
		bottom.y1 = y;
		bottom.y2 = y;

		var left = this.ui[0];
		left.y2 = y;

		var right = this.ui[2];
		right.y2 = y;

		var rightBottom = this.ui[6];
		rightBottom.y1 = y-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		rightBottom.y2 = y+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		var bottomLeft = this.ui[7];
		bottomLeft.y1 = y-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		bottomLeft.y2 = y+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		// Update main entity layout
		node.updateLayoutWithConstraints(undefined, undefined, y, undefined);
	}

	updateLeftTop(node, position) {
		var entity = node.ui[0];
		var y = Math.min(position.y, entity.y2-SIZE_EDITOR_CORNER_BOX_SIZE);
		var x = Math.min(position.x, entity.x2-SIZE_EDITOR_CORNER_BOX_SIZE);

		var left = this.ui[0];
		left.y1 = y;
		left.x1 = x;
		left.x2 = x;

		var top = this.ui[1];
		top.y1 = y;
		top.x1 = x;
		top.y2 = y;

		var right = this.ui[2];
		right.y1 = y;

		var bottom = this.ui[3];
		bottom.x1 = x;

		var leftTop = this.ui[4];
		leftTop.y1 = y-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		leftTop.x1 = x-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		leftTop.y2 = y+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		leftTop.x2 = x+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		var topRight = this.ui[5];
		topRight.y1 = y-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		topRight.y2 = y+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		var bottomLeft = this.ui[7];
		bottomLeft.x1 = x-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		bottomLeft.x2 = x+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		// Update main entity layout
		node.updateLayoutWithConstraints(y, x, undefined, undefined);
	}

	updateTopRight(node, position) {
		var entity = node.ui[0];
		var y = Math.min(position.y, entity.y2-SIZE_EDITOR_CORNER_BOX_SIZE);
		var x = Math.max(position.x, entity.x1+SIZE_EDITOR_CORNER_BOX_SIZE);

		var left = this.ui[0];
		left.y1 = y;

		var top = this.ui[1];
		top.y1 = y;
		top.x2 = x;
		top.y2 = y;

		var right = this.ui[2];
		right.y1 = y;
		right.x1 = x;
		right.x2 = x;

		var bottom = this.ui[3];
		bottom.x2 = x;

		var leftTop = this.ui[4];
		leftTop.y1 = y-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		leftTop.y2 = y+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		var topRight = this.ui[5];
		topRight.y1 = y-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		topRight.x1 = x-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		topRight.y2 = y+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		topRight.x2 = x+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		var rightBottom = this.ui[6];
		rightBottom.x1 = x-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		rightBottom.x2 = x+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		// Update main entity layout
		node.updateLayoutWithConstraints(y, undefined, undefined, x);
	}

	updateRightBottom(node, position) {
		var entity = node.ui[0];
		var y = Math.max(position.y, entity.y1+SIZE_EDITOR_CORNER_BOX_SIZE);
		var x = Math.max(position.x, entity.x1+SIZE_EDITOR_CORNER_BOX_SIZE);

		var left = this.ui[0];
		left.y2 = y;

		var top = this.ui[1];
		top.x2 = x;

		var right = this.ui[2];
		right.y2 = y;

		var bottom = this.ui[3];
		bottom.y1 = y;
		bottom.y2 = y;
		bottom.x2 = x;

		var topRight = this.ui[5];
		topRight.x1 = x-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		topRight.x2 = x+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		var rightBottom = this.ui[6];
		rightBottom.y1 = y-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		rightBottom.x1 = x-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		rightBottom.y2 = y+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		rightBottom.x2 = x+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		var bottomLeft = this.ui[7];
		bottomLeft.y1 = y-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		bottomLeft.y2 = y+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		// Update main entity layout
		node.updateLayoutWithConstraints(undefined, undefined, y, x);
	}

	updateBottomLeft(node, position) {
		var entity = node.ui[0];
		var y = Math.max(position.y, entity.y1+SIZE_EDITOR_CORNER_BOX_SIZE);
		var x = Math.min(position.x, entity.x2-SIZE_EDITOR_CORNER_BOX_SIZE);

		var left = this.ui[0];
		left.x1 = x;
		left.y2 = y;
		left.x2 = x;

		var top = this.ui[1];
		top.x1 = x;

		var right = this.ui[2];
		right.y2 = y;

		var bottom = this.ui[3];
		bottom.y1 = y;
		bottom.x1 = x;
		bottom.y2 = y;

		var leftTop = this.ui[4];
		leftTop.x1 = x-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		leftTop.x2 = x+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		var rightBottom = this.ui[6];
		rightBottom.y1 = y-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		rightBottom.y2 = y+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		var bottomLeft = this.ui[7];
		bottomLeft.y1 = y-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		bottomLeft.x1 = x-0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		bottomLeft.y2 = y+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;
		bottomLeft.x2 = x+0.5*SIZE_EDITOR_CORNER_BOX_SIZE;

		// Update main entity layout
		node.updateLayoutWithConstraints(undefined, x, y, undefined);
	}

	onDrag(node, entity, startPosition, currentPosition, anchorPoint, ctrlKey, shiftKey) {
		switch (entity.name) {
			case SIZE_EDITOR_NAME_LEFT:
			this.updateLeft(node, currentPosition);
			break;

			case SIZE_EDITOR_NAME_TOP:
			this.updateTop(node, currentPosition);
			break;

			case SIZE_EDITOR_NAME_RIGHT:
			this.updateRight(node, currentPosition);
			break;

			case SIZE_EDITOR_NAME_BOTTOM:
			this.updateBottom(node, currentPosition);
			break;

			case SIZE_EDITOR_NAME_LEFT_TOP:
			this.updateLeftTop(node, currentPosition);
			break;

			case SIZE_EDITOR_NAME_TOP_RIGHT:
			this.updateTopRight(node, currentPosition);
			break;

			case SIZE_EDITOR_NAME_RIGHT_BOTTOM:
			this.updateRightBottom(node, currentPosition);
			break;

			case SIZE_EDITOR_NAME_BOTTOM_LEFT:
			this.updateBottomLeft(node, currentPosition);
			break;

			default:
			console.log('ERROR: Unrecognize size editor entity name');
			break;
		}
	}
}

const CONNECTABLE_NODE_NAME_PREFIX 		= 'CONNECTABLE_NODE_'
const Z_INDEX_OF_SIZE_EDITOR_ENTITIES 	= 2000000;
class UIConnectableNode extends UINode {
	constructor(nodeId, nodeZIndex, canvas, extEventMap,
		nodeSettings={
			color: '#808080', 
			rect: {y1: 0, x1: 0, y2: 0, x2: 0}, 
			name: ''
		},
		nodeParams={},
		srcConnIdList=[],
		dstConnIdList=[],
		connEventProtocol) {
		super(nodeId, nodeZIndex, canvas, extEventMap);

		var entity = {
			nodeId: this.getId(),
			type: 'RECTANGLE',
			y1: nodeSettings.rect.y1, 
			x1: nodeSettings.rect.x1, 
			y2: nodeSettings.rect.y2, 
			x2: nodeSettings.rect.x2,
			z: this.getZIndex(),
			color: nodeSettings.color,
			isHidden: false,
			namePrefix: CONNECTABLE_NODE_NAME_PREFIX,
			name: nodeSettings.name,
		};
		this.ui = [entity];
		this.sizeEditor = new UISizeEditor(
			this.getId(), 
			Z_INDEX_OF_SIZE_EDITOR_ENTITIES+this.getZIndex(), 
			canvas,
			extEventMap,
			entity.y1, entity.x1, entity.y2, entity.x2, this.ui);

		this.srcConnIdList = srcConnIdList;
		this.dstConnIdList = dstConnIdList;
		this.nodeParams = nodeParams;
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
		if (entity.namePrefix == CONNECTABLE_NODE_NAME_PREFIX) {
			this.getCanvas().style.cursor = 'pointer';
		}
		else if (entity.namePrefix == SIZE_EDITOR_NAME_PREFIX) {
			if (!entity.isHidden) {
				switch (entity.name) {
					case SIZE_EDITOR_NAME_LEFT:
					this.getCanvas().style.cursor = 'col-resize';
					break;

					case SIZE_EDITOR_NAME_TOP:
					this.getCanvas().style.cursor = 'row-resize';
					break;

					case SIZE_EDITOR_NAME_RIGHT:
					this.getCanvas().style.cursor = 'col-resize';
					break;

					case SIZE_EDITOR_NAME_BOTTOM:
					this.getCanvas().style.cursor = 'row-resize';
					break;

					case SIZE_EDITOR_NAME_LEFT_TOP:
					this.getCanvas().style.cursor = 'nw-resize';
					break;

					case SIZE_EDITOR_NAME_TOP_RIGHT:
					this.getCanvas().style.cursor = 'ne-resize';
					break;

					case SIZE_EDITOR_NAME_RIGHT_BOTTOM:
					this.getCanvas().style.cursor = 'se-resize';
					break;

					case SIZE_EDITOR_NAME_BOTTOM_LEFT:
					this.getCanvas().style.cursor = 'sw-resize';
					break;

					default:
					break;
				}
			}
		}
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
		this.connEventProtocol.onCreateConn(
			entity.nodeId,
			{y: entity.y1+anchorPoint.y, x: entity.x1+anchorPoint.x});
	}

	// Node protocol
	onDrag(entity, startPosition, currentPosition, anchorPoint, ctrlKey, shiftKey) {
		if (entity.isHidden) { 
			return; 
		}

		if (entity.namePrefix == CONNECTABLE_NODE_NAME_PREFIX) {
			var h = entity.y2 - entity.y1;
			var w = entity.x2 - entity.x1;
			this.updateLayoutWithConstraints(
				currentPosition.y-anchorPoint.y,
				currentPosition.x-anchorPoint.x,
				currentPosition.y-anchorPoint.y+h,
				currentPosition.x-anchorPoint.x+w);
		}
		else if (entity.namePrefix == SIZE_EDITOR_NAME_PREFIX) {
			this.sizeEditor.onDrag(this, entity, startPosition, 
				currentPosition, anchorPoint, ctrlKey, shiftKey);
		}
	}

	// Node protocol
	onDrop(entity, startPosition, dropPosition, anchorPoint, ctrlKey, shiftKey) {
		this.onSelect();
	}

	// Node protocol
	getSettings() {
		var entity = this.ui[0];
		return {
			color: entity.color, 
			rect: {
				y1: entity.y1, 
				x1: entity.x1, 
				y2: entity.y2, 
				x2: entity.x2
			}, 
			name: entity.name,
		};
	}

	// Node protocol
	getParams() {
		return JSON.parse(JSON.stringify(this.nodeParams));
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
		this.sizeEditor.show();
		var entity = this.ui[0];
		this.getExtEventMap().onNodeSelected({
			nodeId: entity.nodeId,
			rect: [entity.y1, entity.x1, entity.y2, entity.x2],
			color: entity.color,
			nodeParams: this.getParams(),
		});
	}

	// Node protocol
	onDeselect() {
		this.sizeEditor.hide();
	}

	// Node protocol
	isSelected() {
		return this.sizeEditor.ui[0].isHidden == false;
	}

	isGroundOf(y, x) {
		var entity = this.ui[0];
		return entity.y1 <= y
			&& entity.x1 <= x
			&& entity.y2 >= y
			&& entity.x2 >= x;
	}



	// Connectable node event protocol
	onConnect(connId, isSrc) {
		if (isSrc) {
			this.srcConnIdList.push(connId);
		}
		else {
			this.dstConnIdList.push(connId);
		}
	}

	// Connectable node event protocol
	onDisconnect(connId, isSrc) {
		if (isSrc) {
			var rmIdx = this.srcConnIdList.indexOf(connId);
			if (rmIdx > -1) {
			  this.srcConnIdList.splice(rmIdx, 1);
			}
		}
		else {
			var rmIdx = this.dstConnIdList.indexOf(connId);
			if (rmIdx > -1) {
			  this.dstConnIdList.splice(rmIdx, 1);
			}
		}
	}

	updateLayout(y1, x1, y2, x2) {
		// Update location
		var entity = this.ui[0];
		if (y1 != undefined) { entity.y1 = y1; }
		if (x1 != undefined) { entity.x1 = x1; }
		if (y2 != undefined) { entity.y2 = y2; }
		if (x2 != undefined) { entity.x2 = x2; }

		// Keep focusing
		this.sizeEditor.focus(entity);
	}

	updateConstraints(y1, x1, y2, x2) {
		var entity = this.ui[0];
		if (y1 == undefined) { y1 = entity.y1; }
		if (x1 == undefined) { x1 = entity.x1; }
		if (y2 == undefined) { y2 = entity.y2; }
		if (x2 == undefined) { x2 = entity.x2; }

		for (var i = 0; i < this.srcConnIdList.length; i++) {
			this.connEventProtocol.onNodeLayoutUpdate(
				this.getId(), this.srcConnIdList[i], true, y1, x1, y2, x2);
		}
		
		for (var i = 0; i < this.dstConnIdList.length; i++) {
			this.connEventProtocol.onNodeLayoutUpdate(
				this.getId(), this.dstConnIdList[i], false, y1, x1, y2, x2);
		}
	}

	updateLayoutWithConstraints(y1, x1, y2, x2) {
		this.updateLayout(y1, x1, y2, x2);
		this.updateConstraints(y1, x1, y2, x2);
	}

	snapshot() {
		return {
			nodeType: 'CONNECTABLE',
			nodeId: this.ui[0].nodeId,
			nodeZIndex: this.ui[0].z,
			nodeSettings: {
				color: this.ui[0].color,
				rect: {
					y1: this.ui[0].y1, 
					x1: this.ui[0].x1, 
					y2: this.ui[0].y2, 
					x2: this.ui[0].x2,
				},
				name: this.ui[0].name,
			},
			srcConnIdList: this.srcConnIdList,
			dstConnIdList: this.dstConnIdList,
			nodeParams: this.nodeParams,
		};
	}
}

export {UIConnectableNode};
