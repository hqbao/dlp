import {UIConnectableNode} from './UIConnectableNode.js';
import {UIConnectionNode} from './UIConnectionNode.js';

const SUPPORTED_IMAGE_CLASSIFICATION_DATASETS = ['mnist-digits', 'fingers'];
const SUPPORTED_HEATMAP_REGRESSION_DATASETS = ['faceali128x128'];
const SUPPORTED_OBJECT_DETECTION_DATASETS = ['face1024'];

class TensorFlowValidator {
	constructor() {}

	getNodeById(nodes, nodeId) {
		var node = null;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].getId() == nodeId) {
				node = nodes[i];
				break;
			}
		}

		return node;
	}

	checkConnectableNodeParams(nodes) {
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

		var nameDist = {
			'CONV2D_LAYER': [],
			'DENSE_LAYER': [],
			'BATCH_NORM_LAYER': [],
			'DROPOUT_LAYER': [],
			'CONV2D_BLOCK': [],
			'HOURGLASS_BLOCK': [],
			'RESNET_IDENTITY_BLOCK': [],
			'RESNET_SIDENTITY_BLOCK': [],
			'RFE_BLOCK': [],
		};

		var errors = [];
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node instanceof UIConnectableNode) {
				switch (node.nodeParams.blockType) {
					case 'IMAGE_CLASSIFICATION_DATAGEN': {
						if (!SUPPORTED_IMAGE_CLASSIFICATION_DATASETS.includes(node.nodeParams.params.dataset_name)) {
							errors.push(node.getName()+' dataset not supported');
						}

						break;
					}

					case 'HEATMAP_REGRESSION_DATAGEN': {
						if (!SUPPORTED_HEATMAP_REGRESSION_DATASETS.includes(node.nodeParams.params.dataset_name)) {
							errors.push(node.getName()+' dataset not supported');
						}

						break;
					}

					case 'OBJECT_DETECTION_DATAGEN': {
						if (!SUPPORTED_OBJECT_DETECTION_DATASETS.includes(node.nodeParams.params.dataset_name)) {
							errors.push(node.getName()+' dataset not supported');
						}

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

						// Set name if needed
						var name = node.nodeParams.params.name;
						var blockType = node.nodeParams.blockType;
						var existedNames = nameDist[blockType];
						if (!name || existedNames.includes(name)) {
							var newName = blockType+existedNames.length;
							node.nodeParams.params.name = newName;
						}
						existedNames.push(node.nodeParams.params.name);

						break;
					}

					case 'DENSE_LAYER': {
						if (isEmpty(node.nodeParams.params.units)) {
							errors.push(node.getName()+' units must not be empty');
						}

						if (isEmpty(node.nodeParams.params.use_bias)) {
							errors.push(node.getName()+' use bias must not be empty');
						}

						if (isEmpty(node.nodeParams.params.trainable)) {
							errors.push(node.getName()+' trainable must not be empty');
						}

						// Set name if needed
						var name = node.nodeParams.params.name;
						var blockType = node.nodeParams.blockType;
						var existedNames = nameDist[blockType];
						if (!name || existedNames.includes(name)) {
							var newName = blockType+existedNames.length;
							node.nodeParams.params.name = newName;
						}
						existedNames.push(node.nodeParams.params.name);
						
						break;
					}

					case 'BATCH_NORM_LAYER': {
						// Set name if needed
						var name = node.nodeParams.params.name;
						var blockType = node.nodeParams.blockType;
						var existedNames = nameDist[blockType];
						if (!name || existedNames.includes(name)) {
							var newName = blockType+existedNames.length;
							node.nodeParams.params.name = newName;
						}
						existedNames.push(node.nodeParams.params.name);

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

						// Set name if needed
						var name = node.nodeParams.params.name;
						var blockType = node.nodeParams.blockType;
						var existedNames = nameDist[blockType];
						if (!name || existedNames.includes(name)) {
							var newName = blockType+existedNames.length;
							node.nodeParams.params.name = newName;
						}
						existedNames.push(node.nodeParams.params.name);

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

						if (isEmpty(node.nodeParams.params.repeat)) {
							errors.push(node.getName()+' repeat must not be empty');
						}

						// Set name if needed
						var name = node.nodeParams.params.name;
						var blockType = node.nodeParams.blockType;
						var existedNames = nameDist[blockType];
						if (!name || existedNames.includes(name)) {
							var newName = blockType+existedNames.length;
							node.nodeParams.params.name = newName;
						}
						existedNames.push(node.nodeParams.params.name);

						break;
					}

					case 'RESNET_IDENTITY_BLOCK': {
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

						// Set name if needed
						var name = node.nodeParams.params.name;
						var blockType = node.nodeParams.blockType;
						var existedNames = nameDist[blockType];
						if (!name || existedNames.includes(name)) {
							var newName = blockType+existedNames.length;
							node.nodeParams.params.name = newName;
						}
						existedNames.push(node.nodeParams.params.name);

						break;
					}

					case 'RESNET_SIDENTITY_BLOCK': {
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

						// Set name if needed
						var name = node.nodeParams.params.name;
						var blockType = node.nodeParams.blockType;
						var existedNames = nameDist[blockType];
						if (!name || existedNames.includes(name)) {
							var newName = blockType+existedNames.length;
							node.nodeParams.params.name = newName;
						}
						existedNames.push(node.nodeParams.params.name);

						break;
					}

					case 'RFE_BLOCK': {
						if (isEmpty(node.nodeParams.params.use_bias)) {
							errors.push(node.getName()+' use bias must not be empty');
						}

						if (isEmpty(node.nodeParams.params.trainable)) {
							errors.push(node.getName()+' trainable must not be empty');
						}

						if (isEmpty(node.nodeParams.params.bn_trainable)) {
							errors.push(node.getName()+' batch norm trainable must not be empty');
						}

						// Set name if needed
						var name = node.nodeParams.params.name;
						var blockType = node.nodeParams.blockType;
						var existedNames = nameDist[blockType];
						if (!name || existedNames.includes(name)) {
							var newName = blockType+existedNames.length;
							node.nodeParams.params.name = newName;
						}
						existedNames.push(node.nodeParams.params.name);

						break;
					}

					case 'HOURGLASS_BLOCK': {
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

						// Set name if needed
						var name = node.nodeParams.params.name;
						var blockType = node.nodeParams.blockType;
						var existedNames = nameDist[blockType];
						if (!name || existedNames.includes(name)) {
							var newName = blockType+existedNames.length;
							node.nodeParams.params.name = newName;
						}
						existedNames.push(node.nodeParams.params.name);

						break;
					}

					default: { break; }
				}
			}
		}

		return errors;
	}

	checkConnections(nodes) {
		var errors = [];
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
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

	checkShapes(nodes) {
		this.clearShapes(nodes);

		var errors = [];

		// Check InputLayer with shape exist
		var inputLayerNode = null;
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
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
		var self = this;
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
						var conn = self.getNodeById(nodes, connId);
						var srcNodeId = conn.srcNodeId;
						var pNode = self.getNodeById(nodes, srcNodeId);
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
						var conn = self.getNodeById(nodes, connId);
						var srcNodeId = conn.srcNodeId;
						var pNode = self.getNodeById(nodes, srcNodeId);
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
						var conn = self.getNodeById(nodes, connId);
						var dstNodeId = conn.dstNodeId;
						var nNode = self.getNodeById(nodes, dstNodeId);
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
				var conn = self.getNodeById(nodes, connId);
				var dstNodeId = conn.dstNodeId;
				var nextNode = self.getNodeById(nodes, dstNodeId);
				traverse(node, nextNode);
			}
		})(null, inputLayerNode);

		return errors;
	}

	clearShapes(nodes) {
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			if (node instanceof UIConnectableNode && (
				node.nodeParams.blockType != 'INPUT_LAYER'
				&& node.nodeParams.blockType != 'SPLITTED_LAYER'
				)) {
				node.nodeParams.params.shape = undefined;
			}
		}
	}
}

export {TensorFlowValidator};