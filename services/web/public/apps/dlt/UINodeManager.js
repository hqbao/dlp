import {UIBackgroundNode} from './UIBackgroundNode.js';
import {UIConnectableNode} from './UIConnectableNode.js';
import {UIConnectionNode} from './UIConnectionNode.js';
import {TensorFlowValidator} from './TensorFlowValidator.js';

class UINodeManager {
	constructor(render, canvas, context, extEventMap, height, width, movingUnit) {
		this.canvas = canvas;
		this.context = context;
		this.render = render;
		this.extEventMap = extEventMap;
		this.height = height;
		this.width = width;
		this.movingUnit = movingUnit;

		this.nodes = [];
		this.autoIncreaseEntityId = 0;
		this.autoIncreaseLowZIndex = 0;
		this.autoIncreaseHighZIndex = Z_INDEX_CONN_NODE;
		this.snapshotList = [];
		this.snapshotIdx = -1;

		this.validator = new TensorFlowValidator();

		this.loadCache(this.render);
	}

	addNode(type, params) {
		switch (type) {
			case UINodeManager.NODE_TYPE_BACKGROUND :
			var node = new UIBackgroundNode(
				this.autoIncreaseEntityId,
				this.autoIncreaseLowZIndex, 
				this.canvas,
				this.extEventMap,
				this.height, 
				this.width,
				this.movingUnit,
				this);
			this.autoIncreaseLowZIndex += 1;
			break;

			case UINodeManager.NODE_TYPE_CONNECTABLE:
			var node = new UIConnectableNode(
				this.autoIncreaseEntityId,
				this.autoIncreaseLowZIndex, 
				this.canvas,
				this.extEventMap,
				params.nodeSettings, 
				params.nodeParams,
				[],
				[],
				this);
			this.autoIncreaseLowZIndex += 10;
			break;

			case UINodeManager.NODE_TYPE_CONNECTION:
			var node = new UIConnectionNode(
				this.autoIncreaseEntityId,
				this.autoIncreaseHighZIndex, 
				this.canvas,
				this.extEventMap,
				params.srcPosition, 
				params.dstPosition,
				params.srcNodeId, 
				params.dstNodeId, 
				this);
			this.autoIncreaseHighZIndex += 10;
			break;

			default:
			throw 1000;
		}

		this.nodes.push(node);
		this.autoIncreaseEntityId += 1;

		// Render
		var entities = node.getEntities();
		for (var i = 0; i < entities.length; i++) {
			var entity = entities[i]
			this.render.add(entity);
		}

		return this.autoIncreaseEntityId-1;
	}

	addNodeWithSnapshot(snapshot) {
		switch (snapshot.nodeType) {
			case UINodeManager.NODE_TYPE_BACKGROUND:
			var node = new UIBackgroundNode(
				snapshot.nodeId,
				snapshot.nodeZIndex, 
				this.canvas,
				this.extEventMap,
				this.height, 
				this.width,
				this.movingUnit,
				this);
			if (this.autoIncreaseLowZIndex <= snapshot.nodeZIndex) {
				this.autoIncreaseLowZIndex = snapshot.nodeZIndex + 10;
			}
			break;

			case UINodeManager.NODE_TYPE_CONNECTABLE:
			var node = new UIConnectableNode(
				snapshot.nodeId,
				snapshot.nodeZIndex, 
				this.canvas,
				this.extEventMap,
				snapshot.nodeSettings, 
				snapshot.nodeParams,
				snapshot.srcConnIdList,
				snapshot.dstConnIdList,
				this);
			if (this.autoIncreaseLowZIndex <= snapshot.nodeZIndex) {
				this.autoIncreaseLowZIndex = snapshot.nodeZIndex + 10;
			}
			break;

			case UINodeManager.NODE_TYPE_CONNECTION:
			var node = new UIConnectionNode(
				snapshot.nodeId,
				snapshot.nodeZIndex, 
				this.canvas,
				this.extEventMap,
				snapshot.srcPosition, 
				snapshot.dstPosition,
				snapshot.srcNodeId, 
				snapshot.dstNodeId, 
				this);
			if (this.autoIncreaseHighZIndex <= snapshot.nodeZIndex) {
				this.autoIncreaseHighZIndex = snapshot.nodeZIndex + 10;
			}
			break;

			default:
			throw 1000;
		}

		this.nodes.push(node);
		if (this.autoIncreaseEntityId <= node.getId()) {
			this.autoIncreaseEntityId = node.getId() + 1;
		}
	}

	getById(nodeId) {
		var node = null;
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].getId() == nodeId) {
				node = this.nodes[i];
				break;
			}
		}

		return node;
	}

	getEntityByLocation(point) {
		var retEntity = null;
		var maxZ = -1;
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			for (var j = 0; j < node.ui.length; j++) {
				var entity = node.ui[j];
				if (entity.type == 'RECTANGLE') {
					if (point.y > entity.y1 && point.x > entity.x1 
						&& point.y < entity.y2 && point.x < entity.x2
						&& entity.z > maxZ) {
						retEntity = entity;
						maxZ = entity.z;
					}
				}
				else if (entity.type == 'PATH') {
					this.context.beginPath();
					this.context.moveTo(entity.x1, entity.y1);
					this.context.lineTo(entity.x2, entity.y2);
					this.context.lineWidth = entity.lineWidth;
					if (this.context.isPointInStroke(point.x, point.y) 
						&& entity.z > maxZ) {
						retEntity = entity;
						maxZ = entity.z;
					}
				}
			}
		}

		return retEntity;
	}

	selectAllNodes() {
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode
				|| node instanceof UIConnectionNode) {
				node.onSelect();
			}
		}
	}

	deselectNodes() {
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode
				|| node instanceof UIConnectionNode) {
				node.onDeselect();
			}
		}
	}

	removeSelectedNodes() {
		var rmConnectionNodeIndices = [];
		var rmConnectableNodeIndices = [];

		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectionNode
				&& node.isSelected()) {
				rmConnectionNodeIndices.push(i);

				// Remove relations with connection node
				var srcNode = this.getById(node.srcNodeId);
				if (srcNode != null) {
					srcNode.onDisconnect(node.getId(), true);
				}

				var dstNode = this.getById(node.dstNodeId);
				if (dstNode != null) {
					dstNode.onDisconnect(node.getId(), false);
				}

				// Remove entities
				this.render.removeByNodeId(node.getId());
			}
		}

		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode
				&& node.isSelected()) {
				rmConnectableNodeIndices.push(i);

				// Remove relations with connectable node
				// -> No need
				
				// Remove entities
				this.render.removeByNodeId(node.getId());
			}
		}

		var rmNodeIndices = rmConnectionNodeIndices.concat(rmConnectableNodeIndices);
		rmNodeIndices.sort((a,b)=>a-b);

		for (var i = rmNodeIndices.length - 1; i >= 0; i--) {
			this.nodes.splice(rmNodeIndices[i], 1);
		}
	}

	duplicateSelectedNodes() {
		var dupNodeIdList = [];
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode
				&& node.isSelected()) {
				var settings = node.getSettings();
				settings.rect.y1 += 64;
				settings.rect.x1 += 64;
				settings.rect.y2 += 64;
				settings.rect.x2 += 64;
				var dupNodeId = this.addNode(
					UINodeManager.NODE_TYPE_CONNECTABLE,
					{
						nodeSettings: settings,
						nodeParams: node.getParams(),
					});
				dupNodeIdList.push(dupNodeId);
				node.onDeselect();
			}
		}

		for (var i = 0; i < dupNodeIdList.length; i++) {
			var dupNode = this.getById(dupNodeIdList[i]);
			dupNode.onSelect();
		}
	}

	// UI event protocol
	onLeftMouseDown(position, ctrlKey, shiftKey) {
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode
				&& node.isSelected()) {
				node.anchorPoint = {
					y: position.y - node.ui[0].y1,
					x: position.x - node.ui[0].x1,
				};
			}
		}
	}

	// UI event protocol
	onRightMouseDown(position, ctrlKey, shiftKey) {
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode
				|| node instanceof UIConnectionNode) {
				node.anchorPoint = {
					y: position.y - node.ui[0].y1,
					x: position.x - node.ui[0].x1,
				};
			}
		}
	}

	// UI event protocol
	onDragAll(position, ctrlKey, shiftKey) {
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode
				|| node instanceof UIConnectionNode) {
				node.onDrag(node.ui[0], {y: 0, x: 0}, position,
					node.anchorPoint, ctrlKey, shiftKey);
			}
		}
	}

	// UI event protocol
	onHover(entity, position, anchorPoint) {
		var node = this.getById(entity.nodeId);
		if (node != null) {
			node.onHover(entity, position, anchorPoint);
		}
	}

	// UI event protocol
	onLeftClick(entity, anchorPoint, ctrlKey, shiftKey) {
		if (!shiftKey) {
			this.deselectNodes();
		}
		
		var node = this.getById(entity.nodeId);
		if (node != null) {
			node.onLeftClick(entity, anchorPoint, ctrlKey, shiftKey);
		}
	}

	// UI event protocol
	onRightClick(entity, anchorPoint, ctrlKey, shiftKey) {
		var node = this.getById(entity.nodeId);
		if (node != null) {
			node.onRightClick(entity, anchorPoint, ctrlKey, shiftKey);
		}
	}

	// UI event protocol
	onDrag(entity, startPosition, currentPosition, anchorPoint, ctrlKey, shiftKey) {
		if (!shiftKey) {
			var node = this.getById(entity.nodeId);
			if (node != null) {
				node.onDrag(entity, startPosition, currentPosition, 
					anchorPoint, ctrlKey, shiftKey);
			}
		}
		else {
			for (var i = 0; i < this.nodes.length; i++) {
				var node = this.nodes[i];
				if (node instanceof UIConnectableNode
					&& node.isSelected()) {
					node.onDrag(node.ui[0], startPosition, currentPosition, 
						node.anchorPoint, ctrlKey, shiftKey);
				}
			}
		}
	}

	// UI event protocol
	onDrop(entity, startPosition, dropPosition, anchorPoint, ctrlKey, shiftKey) {
		if (!shiftKey) {
			this.deselectNodes();

			var node = this.getById(entity.nodeId);
			if (node != null) {
				node.onDrop(entity, startPosition, dropPosition, anchorPoint, 
					ctrlKey, shiftKey);
			}
		}
		else {
			for (var i = 0; i < this.nodes.length; i++) {
				var node = this.nodes[i];
				if (node instanceof UIConnectableNode
					&& node.isSelected()) {
					node.onDrop(node.ui[0], startPosition, dropPosition, 
						node.anchorPoint, ctrlKey, shiftKey);
				}
			}
		}
	}

	// Background event protocol
	onAreaSelect(y1, x1, y2, x2) {
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if ((node instanceof UIConnectableNode
				|| node instanceof UIConnectionNode)
				&& node.isIn(y1, x1, y2, x2)) {
				node.onSelect();
			}
		}
	}

	// Background event protocol
	onBackgroundLeftClick(gUIApp, position, ctrlKey, shiftKey) {
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode
				|| node instanceof UIConnectionNode) {
				node.onDeselect();
			}
		}

		gUIApp.refPosition = position;
	}

	// Background event protocol
	onBackgroundRightClick(position, ctrlKey, shiftKey) {
		
	}

	// Connection event protocol
	onCreateConn(nodeId, position) {
		var connId = this.addNode(
			UINodeManager.NODE_TYPE_CONNECTION, 
			{
				srcPosition: position, 
				dstPosition: position, 
				srcNodeId: nodeId, 
				dstNodeId: nodeId,
			});
		var node = this.getById(nodeId);
		node.onConnect(connId, true);
		node.onConnect(connId, false);
	}

	// Connection event protocol
	onSrcConnect(connId, position) {
		var node = undefined;
		for (var i = 0; i < this.nodes.length; i++) {
			var _node = this.nodes[i];
			if (_node instanceof UIConnectableNode
				&& _node.isGroundOf(position.y, position.x)) {
				node = _node;
				break;
			}
		}

		var connNode = this.getById(connId);

		for (var i = 0; i < this.nodes.length; i++) {
			var _node = this.nodes[i];
			if (_node instanceof UIConnectableNode) {
				_node.onDisconnect(connNode.getId(), true);
			}
		}

		connNode.srcNodeId = undefined;

		if (node != undefined) {
			node.onConnect(connId, true);
			connNode.srcNodeId = node.getId();
		}
	}

	// Connection event protocol
	onDstConnect(connId, position) {
		var node = undefined;
		for (var i = 0; i < this.nodes.length; i++) {
			var _node = this.nodes[i];
			if (_node.isGroundOf != undefined
				&& _node.isGroundOf(position.y, position.x)) {
				node = _node;
				break;
			}
		}

		var connNode = this.getById(connId);

		for (var i = 0; i < this.nodes.length; i++) {
			var _node = this.nodes[i];
			if (_node instanceof UIConnectableNode) {
				_node.onDisconnect(connNode.getId(), false);
			}
		}

		connNode.dstNodeId = undefined;

		if (node != undefined) {
			node.onConnect(connId, false);
			connNode.dstNodeId = node.getId();
		}
	}

	// Connection event protocol
	onNodeLayoutUpdate(nodeId, connId, isSrc, y1, x1, y2, x2) {
		var connNode = this.getById(connId);
		if (connNode != null) {
			if (isSrc) {
				connNode.onSrcMove({y: y1+0.5*(y2-y1), x: x1+0.5*(x2-x1)});
			}
			else {
				connNode.onDstMove({y: y1+0.5*(y2-y1), x: x1+0.5*(x2-x1)});
			}
		}
		else {
			var node = this.getById(nodeId);
			node.onDisconnect(connId, isSrc);
		}
	}

	snapshot() {
		// Prepare a snapshot
		var snapshot = [];
		for (var i = 0; i < this.nodes.length; i++) {
			snapshot.push(this.nodes[i].snapshot());
		}

		var snapshotJson = JSON.stringify(snapshot);

		// Remove unused branch
		for (var i = this.snapshotList.length-1; i > this.snapshotIdx; i--) {
			this.snapshotList.splice(-1, 1);
		}

		var currentSnapshotJson = this.snapshotList[this.snapshotIdx];
		if (currentSnapshotJson == snapshotJson) { return; }

		this.snapshotList.push(snapshotJson);
		this.snapshotIdx += 1;
		this.saveCache();
	}

	loadSnapshot(snapshot) {
		this.nodes = [];
		for (var i = 0; i < snapshot.length; i++) {
			this.addNodeWithSnapshot(snapshot[i]);
		}

		// Update render entities
		var entities = [];
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			var nodeEntities = node.getEntities();
			for (var j = 0; j < nodeEntities.length; j++) {
				entities.push(nodeEntities[j]);
			}
		}

		this.render.setEntities(entities);
	}

	undo() {
		if (this.snapshotIdx > 0) { 
			this.snapshotIdx -= 1;
		}

		var snapshotJson = this.snapshotList[this.snapshotIdx];
		var snapshot = JSON.parse(snapshotJson);
		this.loadSnapshot(snapshot, this.render);
		this.saveCache();
	}

	redo() {
		if (this.snapshotIdx < this.snapshotList.length-1) { 
			this.snapshotIdx += 1;
		}

		var snapshotJson = this.snapshotList[this.snapshotIdx];
		var snapshot = JSON.parse(snapshotJson);
		this.loadSnapshot(snapshot, this.render);
		this.saveCache();
	}

	validate() {
		var errors = this.validator.checkConnectableNodeParams(this.nodes);
		if (errors.length > 0) {
			return errors;
		}

		errors = this.validator.checkConnections(this.nodes);
		if (errors.length > 0) {
			return errors;
		}

		errors = this.validator.checkShapes(this.nodes);
		return errors;
	}

	export() {
		return this.snapshotList[this.snapshotIdx];
	}

	exportModel() {
		var nodes = [];
		var vertices = [];
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode) {
				nodes.push(node);
				vertices.push(node.nodeParams);
			}
		}

		var conns = [];
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectionNode) {
				conns.push(node);
			}
		}

		var connection = [];
		for (var i = 0; i < nodes.length; i++) {
			var list = [];
			for (var j = 0; j < nodes.length; j++) {
				list.push(0);
			}

			connection.push(list);
		}

		for (var i = 0; i < nodes.length; i++) {
			var nodei = nodes[i];
			for (var j = 0; j < nodes.length; j++) {
				var nodej = nodes[j];
				for (var k = 0; k < conns.length; k++) {
					var conn = conns[k];
					if (conn.srcNodeId == nodei.getId()
						&& conn.dstNodeId == nodej.getId()) {
						connection[i][j] = 1;
						break;
					}
				}
			}
		}

		var graph = {
			vertices: vertices,
			connection: connection,
		};
		return JSON.stringify(graph);
	}

	initWithBlank() {
		var backgroundNodeId = this.addNode(UINodeManager.NODE_TYPE_BACKGROUND, {});
		var backgroundNode = this.getById(backgroundNodeId);
		this.snapshotList = [JSON.stringify([backgroundNode.snapshot()])];
		this.snapshotIdx = 0;
	}

	import(snapshotJson) {
		if (snapshotJson == undefined) {
			this.initWithBlank();
			return;
		}

		var snapshot = JSON.parse(snapshotJson);
		this.loadSnapshot(snapshot);
		this.snapshot();
	}

	saveCache() {
		var snapshotJson = this.snapshotList[this.snapshotIdx];
		localStorage.setItem('nodesJson', snapshotJson);
	}

	loadCache() {
		var snapshotJson = localStorage.getItem('nodesJson');
		if (snapshotJson == undefined) {
			this.initWithBlank();
			return;
		}

		var snapshot = JSON.parse(snapshotJson);

		// Clear cache if invalid screenshot
		if (snapshot[0] == undefined
			|| snapshot[0]['nodeType'] == undefined) {
			localStorage.removeItem('nodesJson');
			return;
		}

		this.loadSnapshot(snapshot);
		this.validator.clearShapes(this.nodes);
		this.snapshot();
	}
}

UINodeManager.NODE_TYPE_BACKGROUND 				= 'BACKGROUND';
UINodeManager.NODE_TYPE_CONNECTABLE 			= 'CONNECTABLE';
UINodeManager.NODE_TYPE_CONNECTION 				= 'CONNECTION';
const Z_INDEX_CONN_NODE 							= 1000000;

export {UINodeManager};
