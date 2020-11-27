import {UIBackgroundNode} from './UIBackgroundNode.js';
import {UIConnectableNode} from './UIConnectableNode.js';
import {UIConnectionNode} from './UIConnectionNode.js';

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
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].getId() == nodeId) {
				return this.nodes[i];
			}
		}

		return null;
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

	checkConnectableNodeParams() {
		function isEmpty(value) {
			return value === undefined 
				|| value === null 
				|| value === {} 
				|| value === []
				|| value === '';
		}

		function isKernelSize(kernelSize) {
			return Array.isArray(kernelSize) && kernelSize.length == 2;
		}

		function isStrides(kernelSize) {
			return Array.isArray(kernelSize) && kernelSize.length == 2;
		}

		function isPaddingValue(value) {
			return value == 'same' || value == 'valid';
		}

		function is4TiersAnchorSet(anchorSet) {
			return anchorSet != undefined;
		}

		function is4TiersScaleSet(scaleSet) {
			return scaleSet != undefined;
		}

		var errors = [];
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode) {
				switch (node.nodeParams.blockType) {
					case 'IMAGE_CLASSIFICATION_DATAGEN': {
						break;
					}

					case 'HEATMAP_REGRESSION_DATAGEN': {
						break;
					}

					case 'OBJECT_DETECTION_4TIERS_DATAGEN': {
						break;
					}

					case 'INPUT_LAYER': {
						if (!Number.isInteger(node.nodeParams.params.batch_size)
							|| node.nodeParams.params.batch_size < 1) {
							errors.push(node.getName()+' batch size must be greater than 0');
						}

						if (!Array.isArray(node.nodeParams.params.input_shape)) {
							errors.push(node.getName()+' input shape must be array');
						}

						if (isEmpty(node.nodeParams.params.dtype)) {
							errors.push(node.getName()+' dtype must not be empty');
						}

						break;
					}

					case 'CONV2D_LAYER': {
						if (isEmpty(node.nodeParams.params.filters)) {
							errors.push(node.getName()+' filters must not be empty');
						}

						if (!isKernelSize(node.nodeParams.params.kernel_size)) {
							errors.push(node.getName()+' kernel size is not valid');
						}

						if (!isStrides(node.nodeParams.params.strides)) {
							errors.push(node.getName()+' strides is not valid');
						}

						if (!isPaddingValue(node.nodeParams.params.padding)) {
							errors.push(node.getName()+' padding must be \'same\' or \'valid\'');
						}

						if (isEmpty(node.nodeParams.params.use_bias)) {
							errors.push(node.getName()+' use bias must not be empty');
						}

						if (isEmpty(node.nodeParams.params.trainable)) {
							errors.push(node.getName()+' trainable must not be empty');
						}

						break;
					}

					case 'DENSE_LAYER': {
						if (isEmpty(node.nodeParams.params.name)) {
							errors.push(node.getName()+' name must not be empty');
						}

						if (isEmpty(node.nodeParams.params.units)) {
							errors.push(node.getName()+' units must not be empty');
						}

						if (isEmpty(node.nodeParams.params.use_bias)) {
							errors.push(node.getName()+' use bias must not be empty');
						}

						if (isEmpty(node.nodeParams.params.trainable)) {
							errors.push(node.getName()+' trainable must not be empty');
						}
						
						break;
					}

					case 'BATCH_NORM_LAYER': {
						if (isEmpty(node.nodeParams.params.name)) {
							errors.push(node.getName()+' name must not be empty');
						}

						break;
					}

					case 'ACTIVATION_LAYER': {
						if (isEmpty(node.nodeParams.params.activation)) {
							errors.push(node.getName()+' activation must not be empty');
						}

						break;
					}

					case 'DROPOUT_LAYER': {
						if (isEmpty(node.nodeParams.params.rate)) {
							errors.push(node.getName()+' rate must not be empty');
						}

						if (isEmpty(node.nodeParams.params.trainable)) {
							errors.push(node.getName()+' trainable must not be empty');
						}

						if (isEmpty(node.nodeParams.params.name)) {
							errors.push(node.getName()+' name must not be empty');
						}

						break;
					}

					case 'MAXPOOL2D_LAYER': {
						if (!isKernelSize(node.nodeParams.params.pool_size)) {
							errors.push(node.getName()+' pool size is not valid');
						}

						if (!isStrides(node.nodeParams.params.strides)) {
							errors.push(node.getName()+' strides is not valid');
						}

						if (!isPaddingValue(node.nodeParams.params.padding)) {
							errors.push(node.getName()+' padding must be \'same\' or \'valid\'');
						}

						break;
					}

					case 'UPSAMPLING2D_LAYER': {
						if (!isKernelSize(node.nodeParams.params.size)) {
							errors.push(node.getName()+' size is not valid');
						}

						break;
					}

					case 'FLATTEN_LAYER': {
						break;
					}

					case 'ADD_LAYER': {
						break;
					}

					case 'CONCAT_LAYER': {
						if (isEmpty(node.nodeParams.params.axis)) {
							errors.push(node.getName()+' axis must not be empty');
						}

						break;
					}

					case 'SPLIT_LAYER': {
						if (isEmpty(node.nodeParams.params.axis)) {
							errors.push(node.getName()+' axis must not be empty');
						}

						if (!Array.isArray(node.nodeParams.params.size_splits)
							|| node.nodeParams.params.size_splits.length < 2) {
							errors.push(node.getName()+' size splits is not valid');
						}

						break;
					}

					case 'SPLITTED_LAYER': {
						if (isEmpty(node.nodeParams.params.order)) {
							errors.push(node.getName()+' order must not be empty');
						}

						break;
					}

					case 'NMS_BLOCK': {
						if (isEmpty(node.nodeParams.params.max_output_size)) {
							errors.push(node.getName()+' max output size must not be empty');
						}

						if (isEmpty(node.nodeParams.params.iou_threshold)) {
							errors.push(node.getName()+' iou threshold must not be empty');
						}

						if (isEmpty(node.nodeParams.params.score_threshold)) {
							errors.push(node.getName()+' score threshold must not be empty');
						}

						break;
					}

					case 'RESHAPE_LAYER': {
						if (!Array.isArray(node.nodeParams.params.new_shape)) {
							errors.push(node.getName()+' shape must be array');
						}

						break;
					}

					case 'CAST_LAYER': {
						if (isEmpty(node.nodeParams.params.dtype)) {
							errors.push(node.getName()+' dtype must not be empty');
						}

						break;
					}

					case 'CONV2D_BLOCK': {
						if (isEmpty(node.nodeParams.params.filters)) {
							errors.push(node.getName()+' filters must not be empty');
						}

						if (!isKernelSize(node.nodeParams.params.kernel_size)) {
							errors.push(node.getName()+' kernel size is not valid');
						}

						if (!isStrides(node.nodeParams.params.strides)) {
							errors.push(node.getName()+' strides is not valid');
						}

						if (!isPaddingValue(node.nodeParams.params.padding)) {
							errors.push(node.getName()+' padding must be \'same\' or \'valid\'');
						}

						if (isEmpty(node.nodeParams.params.use_bias)) {
							errors.push(node.getName()+' use bias must not be empty');
						}

						if (isEmpty(node.nodeParams.params.trainable)) {
							errors.push(node.getName()+' trainable must not be empty');
						}

						if (isEmpty(node.nodeParams.params.bn_trainable)) {
							errors.push(node.getName()+' batch norm trainable must not be empty');
						}

						if (isEmpty(node.nodeParams.params.activation)) {
							errors.push(node.getName()+' activation must not be empty');
						}

						break;
					}

					case 'RESNET_IDENTITY_BLOCK': {
						if (isEmpty(node.nodeParams.params.block_name)) {
							errors.push(node.getName()+' block name must not be empty');
						}

						if (!Array.isArray(node.nodeParams.params.filters) ||
							node.nodeParams.params.filters.length != 3) {
							errors.push(node.getName()+' filters must be 3 values');
						}

						if (!isKernelSize(node.nodeParams.params.kernel_size)) {
							errors.push(node.getName()+' kernel size is not valid');
						}

						if (isEmpty(node.nodeParams.params.use_bias)) {
							errors.push(node.getName()+' use bias must not be empty');
						}

						if (isEmpty(node.nodeParams.params.trainable)) {
							errors.push(node.getName()+' trainable must not be empty');
						}

						if (isEmpty(node.nodeParams.params.bn_trainable)) {
							errors.push(node.getName()+' batch norm trainable must not be empty');
						}

						if (isEmpty(node.nodeParams.params.repeat)) {
							errors.push(node.getName()+' repeat must not be empty');
						}

						break;
					}

					case 'RESNET_SIDENTITY_BLOCK': {
						if (isEmpty(node.nodeParams.params.block_name)) {
							errors.push(node.getName()+' block name must not be empty');
						}

						if (!Array.isArray(node.nodeParams.params.filters) ||
							node.nodeParams.params.filters.length != 3) {
							errors.push(node.getName()+' filters must be 3 values');
						}

						if (!isKernelSize(node.nodeParams.params.kernel_size)) {
							errors.push(node.getName()+' kernel size is not valid');
						}

						if (!isKernelSize(node.nodeParams.params.strides)) {
							errors.push(node.getName()+' strides is not valid');
						}

						if (isEmpty(node.nodeParams.params.use_bias)) {
							errors.push(node.getName()+' use bias must not be empty');
						}

						if (isEmpty(node.nodeParams.params.trainable)) {
							errors.push(node.getName()+' trainable must not be empty');
						}

						if (isEmpty(node.nodeParams.params.bn_trainable)) {
							errors.push(node.getName()+' batch norm trainable must not be empty');
						}

						break;
					}

					case 'RFE_BLOCK': {
						if (isEmpty(node.nodeParams.params.block_name)) {
							errors.push(node.getName()+' block name must not be empty');
						}

						if (isEmpty(node.nodeParams.params.use_bias)) {
							errors.push(node.getName()+' use bias must not be empty');
						}

						if (isEmpty(node.nodeParams.params.trainable)) {
							errors.push(node.getName()+' trainable must not be empty');
						}

						if (isEmpty(node.nodeParams.params.bn_trainable)) {
							errors.push(node.getName()+' batch norm trainable must not be empty');
						}

						break;
					}

					case 'HOURGLASS_BLOCK': {
						if (isEmpty(node.nodeParams.params.block_name)) {
							errors.push(node.getName()+' block name must not be empty');
						}

						if (!Number.isInteger(node.nodeParams.params.depth)) {
							errors.push(node.getName()+' depth must be integer');
						}

						if (isEmpty(node.nodeParams.params.use_bias)) {
							errors.push(node.getName()+' use bias must not be empty');
						}

						if (isEmpty(node.nodeParams.params.trainable)) {
							errors.push(node.getName()+' trainable must not be empty');
						}

						if (isEmpty(node.nodeParams.params.bn_trainable)) {
							errors.push(node.getName()+' batch norm trainable must not be empty');
						}

						if (!Number.isInteger(node.nodeParams.params.repeat)) {
							errors.push(node.getName()+' repeat must be integer');
						}

						break;
					}

					default: { break; }
				}
			}
		}

		return errors;
	}

	checkConnections() {
		var errors = [];
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode) {
				var inOutType = node.nodeParams.type.split('_');
				var inConnType = inOutType[0];
				var outConnType = inOutType[1];

				switch (inConnType) {
					case 'NONE':
					if (node.dstConnIdList.length > 0) {
						errors.push('There should be NO connection to '+node.getName());
					}
					break;

					case 'ONE':
					if (node.dstConnIdList.length != 1) {
						errors.push('There should be ONE connection to '+node.getName());
					}
					break;

					case 'MANY':
					if (node.dstConnIdList.length <= 1) {
						errors.push('There should be MANY connections to '+node.getName());
					}
					break;

					case 'ANY':
					break;

					default:
					throw 1001;
					break;
				}

				switch (outConnType) {
					case 'NONE':
					if (node.srcConnIdList.length > 0) {
						errors.push('There should be NO connection from '+node.getName());
					}
					break;

					case 'ONE':
					if (node.srcConnIdList.length != 1) {
						errors.push('There should be ONE connection from '+node.getName());
					}
					break;

					case 'MANY':
					if (node.srcConnIdList.length <= 1) {
						errors.push('There should be MANY connections from '+node.getName());
					}
					break;

					case 'ANY':
					break;

					default:
					throw 1001;
					break;
				}
			}
		}

		return errors;
	}

	checkShapes() {
		this.clearShapes();

		var errors = [];

		// Check InputLayer with shape exist
		var inputLayerNode = null;
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode
				&& node.nodeParams.blockType == 'INPUT_LAYER'
				&& Array.isArray(node.nodeParams.params.input_shape)) {
				inputLayerNode = node;
			}
		}

		if (inputLayerNode == null) {
			errors.push('Must delare input layer with its shape');
			return errors;
		}

		// Compute shapes
		var nodeManager = this;
		(function traverse(prevNode, node) {
			// Check AddLayer shape
			switch (node.nodeParams.blockType) {
				case 'INPUT_LAYER': {
					node.nodeParams.params.shape = node.nodeParams.params.input_shape.slice();
					break;
				}

				case 'CONV2D_LAYER': {
					var prevLayerParams = prevNode.nodeParams.params;
					var layerParams = node.nodeParams.params;
					if (prevLayerParams.shape == undefined 
						|| prevLayerParams.shape.length != 3) {
						errors.push('Invalid shape node connects to '+node.getName());
						break;
					}

					var h = prevLayerParams.shape[0];
					var w = prevLayerParams.shape[1];
					var k_h = layerParams.kernel_size[0];
					var k_w = layerParams.kernel_size[1];
					var s_h = layerParams.strides[0];
					var s_w = layerParams.strides[1];
					var shape = undefined;
					if (prevLayerParams.padding == 'valid') {
						shape = [
							Math.ceil((h - k_h + 1)/s_h),
							Math.ceil((w - k_w + 1)/s_w),
							layerParams.filters,
						];
					}
					else {
						shape = [
							Math.ceil(h/s_h),
							Math.ceil(w/s_w),
							layerParams.filters,
						];
					}

					layerParams.shape = shape;
					break;
				}

				case 'DENSE_LAYER': {
					var shape = prevNode.nodeParams.params.shape;
					if (shape == undefined || shape.length != 1) {
						errors.push(node.getName()+' got invalid shape from input');
						return errors;
					}

					node.nodeParams.params.shape = [node.nodeParams.params.units];
					break;
				}

				case 'BATCH_NORM_LAYER': {
					var shape = prevNode.nodeParams.params.shape;
					if (shape == undefined) {
						errors.push('Invalid shape node connects to '+node.getName());
						return errors;
					}

					node.nodeParams.params.shape = shape.slice();
					break;
				}

				case 'ACTIVATION_LAYER': {
					var shape = prevNode.nodeParams.params.shape;
					if (shape == undefined) {
						errors.push('Invalid shape node connects to '+node.getName());
						return errors;
					}

					node.nodeParams.params.shape = shape.slice();
					break;
				}

				case 'DROPOUT_LAYER': {
					var shape = prevNode.nodeParams.params.shape;
					if (shape == undefined) {
						errors.push('Invalid shape node connects to '+node.getName());
						return errors;
					}

					node.nodeParams.params.shape = shape.slice();
					break;
				}

				case 'MAXPOOL2D_LAYER': {
					var prevLayerParams = prevNode.nodeParams.params;
					var layerParams = node.nodeParams.params;
					if (prevLayerParams.shape == undefined 
						|| prevLayerParams.shape.length != 3) {
						errors.push('Invalid shape node connects to '+node.getName());
						break;
					}

					var h = prevLayerParams.shape[0];
					var w = prevLayerParams.shape[1];
					var k_h = layerParams.pool_size[0];
					var k_w = layerParams.pool_size[1];
					var s_h = layerParams.strides[0];
					var s_w = layerParams.strides[1];
					var shape = undefined;
					if (prevLayerParams.padding == 'valid') {
						shape = [
							Math.ceil((h - k_h + 1)/s_h),
							Math.ceil((w - k_w + 1)/s_w),
							prevLayerParams.shape[2],
						];
					}
					else {
						shape = [
							Math.ceil(h/s_h),
							Math.ceil(w/s_w),
							prevLayerParams.shape[2],
						];
					}

					layerParams.shape = shape;
					break;
				}

				case 'UPSAMPLING2D_LAYER': {
					var prevLayerParams = prevNode.nodeParams.params;
					var layerParams = node.nodeParams.params;
					if (prevLayerParams.shape == undefined 
						|| prevLayerParams.shape.length != 3) {
						errors.push('Invalid shape node connects to '+node.getName());
						break;
					}

					var shape = prevLayerParams.shape.slice();
					shape[0] *= node.nodeParams.params.size[0];
					shape[1] *= node.nodeParams.params.size[1];

					layerParams.shape = shape;
					break;
				}

				case 'FLATTEN_LAYER': {
					var shape = prevNode.nodeParams.params.shape;
					if (shape == undefined) {
						errors.push('Invalid shape node connects to '+node.getName());
						return errors;
					}

					var dim = 1;
					for (var i = 0; i < shape.length; i++) {
						dim *= shape[i];
					}

					node.nodeParams.params.shape = [dim];
					break;
				}

				case 'ADD_LAYER': {
					var pShapes = [];
					for (var i = 0; i < node.dstConnIdList.length; i++) {
						var connId = node.dstConnIdList[i];
						var conn = nodeManager.getById(connId);
						var srcNodeId = conn.srcNodeId;
						var pNode = nodeManager.getById(srcNodeId);
						if (pNode.nodeParams.params.shape == undefined) {
							return;
						}

						pShapes.push(pNode.nodeParams.params.shape);
					}

					for (var a = 0; a < pShapes[0].length; a++) {
						var lDim = pShapes[0][a];
						for (var i = 1; i < pShapes.length; i++) {
							var dim = pShapes[i][a];
							if (dim != lDim) {
								errors.push('Add of shape invalid tensors '+node.getName());
								return errors;
							}
						}
					}

					node.nodeParams.params.shape = pShapes[0].slice();
					break;
				}

				case 'CONCAT_LAYER': {
					var axis = node.nodeParams.params.axis;

					var pShapes = [];
					for (var i = 0; i < node.dstConnIdList.length; i++) {
						var connId = node.dstConnIdList[i];
						var conn = nodeManager.getById(connId);
						var srcNodeId = conn.srcNodeId;
						var pNode = nodeManager.getById(srcNodeId);
						if (pNode.nodeParams.params.shape == undefined) {
							return;
						}

						pShapes.push(pNode.nodeParams.params.shape);
					}

					var shape = pShapes[0];
					if (axis > shape.length-1) {
						errors.push(node.getName() + ' got invalid axis');
						return errors;
					}

					if (axis > shape.length-1
						|| axis < -shape.length) {
						errors.push(node.getName()+' axis must out of range');
						return errors;
					}

					if (axis < 0) {
						axis = shape.length + axis;
					}

					var totalDim = 0
					for (var a = 0; a < pShapes[0].length; a++) {
						if (a == axis) {
							for (var i = 0; i < pShapes.length; i++) {
								totalDim += pShapes[i][a];
							}
						}
						else {
							var lDim = pShapes[0][a];
							for (var i = 1; i < pShapes.length; i++) {
								var dim = pShapes[i][a];
								if (dim != lDim) {
									errors.push('Concat of shape invalid tensors '+node.getName());
									return errors;
								}
							}
						}
					}
					
					node.nodeParams.params.shape = shape.slice();
					node.nodeParams.params.shape[axis] = totalDim;
					break;
				}

				case 'SPLIT_LAYER': {
					// Check and set shape from previous layer
					var shape = prevNode.nodeParams.params.shape;
					if (shape == undefined) {
						errors.push('Invalid shape node connects to '+node.getName());
						return errors;
					}

					node.nodeParams.params.shape = shape.slice();

					// Check axis
					var axis = node.nodeParams.params.axis;

					if (axis > node.nodeParams.params.shape.length-1
						|| axis < -node.nodeParams.params.shape.length) {
						errors.push(node.getName()+' axis must out of range');
						return errors;
					}

					if (axis < 0) {
						axis = node.nodeParams.params.shape.length + axis;
					}

					// Check size_splits
					var size_splits = node.nodeParams.params.size_splits
					if (size_splits == undefined || size_splits.length < 2) {
						errors.push(node.getName()+' has invalid size splits');
						return errors;
					}

					var dimByAxis = size_splits.reduce(function(total, num) { 
						return total+Math.round(num); 
					}, 0);
					if (dimByAxis != shape[axis]) {
						errors.push(node.getName()+' has incorrect size splits');
						return errors;
					}

					// Check splitted layer order
					var orders = [];
					for (var i = 0; i < node.srcConnIdList.length; i++) {
						var connId = node.srcConnIdList[i];
						var conn = nodeManager.getById(connId);
						var dstNodeId = conn.dstNodeId;
						var nNode = nodeManager.getById(dstNodeId);
						if (nNode.nodeParams.params.order == undefined) {
							errors.push('Must declare order for '+nNode.getName());
							return errors;
						}

						if (nNode.nodeParams.params.order > size_splits.length-1) {
							errors.push(nNode.getName()+' has invalid order');
							return errors;
						}

						orders.push(nNode.nodeParams.params.order);
					}

					for (var i = 0; i < orders.length-1; i++) {
						for (var j = i+1; j < orders.length; j++) {
							if (orders[i] == orders[j]) {
								errors.push(node.getName()+' has incorrect orders');
								return errors;
							}
						}
					}

					break;
				}

				case 'SPLITTED_LAYER': {
					// Check order
					var order = node.nodeParams.params.order;
					if (!Number.isInteger(order)) {
						errors.push(node.getName()+' must be integer');
						return errors;
					}

					// Check previous shape
					var prevShape = prevNode.nodeParams.params.shape;
					if (prevShape == undefined || prevShape.length == 0) {
						errors.push(prevNode.getName() + ' must have its shape');
						return errors;
					}

					// Check axis
					var prevAxis = prevNode.nodeParams.params.axis;
					if (prevAxis == undefined) {
						errors.push(prevNode.getName() + ' must have its axis');
						return errors;
					}

					if (prevAxis > prevNode.nodeParams.params.shape.length-1
						|| prevAxis < -prevNode.nodeParams.params.shape.length) {
						errors.push(node.getName()+' axis must out of range');
						return errors;
					}

					if (prevAxis < 0) {
						prevAxis = prevNode.nodeParams.params.shape.length + prevAxis;
					}

					var prevSizeSplits = prevNode.nodeParams.params.size_splits;
					var dim = prevSizeSplits[order];

					var splitted_shape = prevShape.slice();
					splitted_shape[prevAxis] = dim;
					node.nodeParams.params.shape = splitted_shape;
					break;
				}

				case 'RESHAPE_LAYER': {
					// Check previous shape
					var prevShape = prevNode.nodeParams.params.shape;
					if (prevShape == undefined || prevShape.length == 0) {
						errors.push(prevNode.getName() + ' must have its shape');
						return errors;
					}

					var shape = node.nodeParams.params.new_shape;
					var negOneExist = 0;
					for (var i = 0; i < shape.length; i++) {
						if (shape[i] == -1) {
							negOneExist += 1;
						}
						else if (shape[i] < -1 || shape[i] == 0) {
							errors.push(node.getName() + ' has invalid shape (negative or 0 dim)');
							return errors;
						}
					}

					if (negOneExist > 1) {
						errors.push(node.getName() + ' has many -1 dim');
						return errors;
					}

					var dim1 = prevShape.reduce((a, b) => a*b, 1)
					var dim2 = shape.reduce((a, b) => a*b, 1)

					if (negOneExist == 0) {
						if (dim1 != dim2) {
							errors.push('Invalid shape set to '+node.getName());
							return errors;
						}
					}
					else {
						dim2 = -dim2;
						if (dim1%dim2 != 0) {
							errors.push('Invalid shape set to (indivisible)'+node.getName());
							return errors;
						}
					}
					
					node.nodeParams.params.shape = shape.slice();
					var shape = node.nodeParams.params.shape;
					for (var i = 0; i < shape.length; i++) {
						if (shape[i] == -1) {
							shape[i] = dim1/dim2;
						}
					}

					break;
				}

				case 'CAST_LAYER': {
					var shape = prevNode.nodeParams.params.shape;
					if (shape == undefined) {
						errors.push('Invalid shape node connects to '+node.getName());
						return errors;
					}

					node.nodeParams.params.shape = shape.slice();
					break;
				}

				case 'CONV2D_BLOCK': {
					var prevLayerParams = prevNode.nodeParams.params;
					var layerParams = node.nodeParams.params;
					if (prevLayerParams.shape == undefined 
						|| prevLayerParams.shape.length != 3) {
						errors.push('Invalid shape node connects to '+node.getName());
						break;
					}

					var h = prevLayerParams.shape[0];
					var w = prevLayerParams.shape[1];
					var k_h = layerParams.kernel_size[0];
					var k_w = layerParams.kernel_size[1];
					var s_h = layerParams.strides[0];
					var s_w = layerParams.strides[1];
					var shape = undefined;
					if (prevLayerParams.padding == 'valid') {
						shape = [
							Math.ceil((h - k_h + 1)/s_h),
							Math.ceil((w - k_w + 1)/s_w),
							layerParams.filters,
						];
					}
					else {
						shape = [
							Math.ceil(h/s_h),
							Math.ceil(w/s_w),
							layerParams.filters,
						];
					}

					layerParams.shape = shape;
					break;
				}

				case 'NMS_BLOCK': {
					break;
				}

				case 'RESNET_IDENTITY_BLOCK': {
					var shape = prevNode.nodeParams.params.shape;
					if (shape == undefined) {
						errors.push('Invalid shape node connects to '+node.getName());
						return errors;
					}

					var filters = node.nodeParams.params.filters;
					if (shape[2] != filters[2]) {
						errors.push('Invalid shape node connects to '+node.getName());
						return errors;
					}

					node.nodeParams.params.shape = shape.slice();
					break;
				}

				case 'RESNET_SIDENTITY_BLOCK': {
					var prevLayerParams = prevNode.nodeParams.params;
					var layerParams = node.nodeParams.params;
					if (prevLayerParams.shape == undefined 
						|| prevLayerParams.shape.length != 3) {
						errors.push('Invalid shape node connects to '+node.getName());
						break;
					}

					var h = prevLayerParams.shape[0];
					var w = prevLayerParams.shape[1];
					var s_h = layerParams.strides[0];
					var s_w = layerParams.strides[1];
					var shape = [
						Math.ceil(h/s_h),
						Math.ceil(w/s_w),
						layerParams.filters[2],
					];

					layerParams.shape = shape;
					break;
				}

				case 'RFE_BLOCK': {
					var shape = prevNode.nodeParams.params.shape;
					if (shape == undefined) {
						errors.push('Invalid shape node connects to '+node.getName());
						return errors;
					}

					node.nodeParams.params.shape = shape.slice();
					break;
				}

				case 'HOURGLASS_BLOCK': {
					var shape = prevNode.nodeParams.params.shape;
					if (shape == undefined) {
						errors.push('Invalid shape node connects to '+node.getName());
						return errors;
					}

					node.nodeParams.params.shape = shape.slice();
					break;
				}

				default: { break; }
			}

			for (var i = 0; i < node.srcConnIdList.length; i++) {
				var connId = node.srcConnIdList[i];
				var conn = nodeManager.getById(connId);
				var dstNodeId = conn.dstNodeId;
				var nextNode = nodeManager.getById(dstNodeId);
				traverse(node, nextNode);
			}
		})(null, inputLayerNode);

		return errors;
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

	clearShapes() {
		for (var i = 0; i < this.nodes.length; i++) {
			var node = this.nodes[i];
			if (node instanceof UIConnectableNode && (
				node.nodeParams.blockType != 'INPUT_LAYER'
				&& node.nodeParams.blockType != 'SPLITTED_LAYER'
				)) {
				node.nodeParams.params.shape = undefined;
			}
		}
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

	initWithBlank() {
		var backgroundNodeId = this.addNode(UINodeManager.NODE_TYPE_BACKGROUND, {});
		var backgroundNode = this.getById(backgroundNodeId);
		this.snapshotList = [JSON.stringify([backgroundNode.snapshot()])];
		this.snapshotIdx = 0;
	}

	export() {
		return this.snapshotList[this.snapshotIdx];
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
		this.clearShapes();
		this.snapshot();
	}
}

UINodeManager.NODE_TYPE_BACKGROUND 				= 'BACKGROUND';
UINodeManager.NODE_TYPE_CONNECTABLE 			= 'CONNECTABLE';
UINodeManager.NODE_TYPE_CONNECTION 				= 'CONNECTION';
const Z_INDEX_CONN_NODE 							= 1000000;

export {UINodeManager};
