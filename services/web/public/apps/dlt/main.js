import {UINodeManager} from './UINodeManager.js';
import {UIApp} from './UIApp.js';

/* Canvas setup */
const gCanvas = document.getElementById('dltool_canvas');
gCanvas.width = screen.width - 256;
gCanvas.height = 0.9*screen.height;

/* External events */
export var gExtEventMap = {
	onClear: function() {},
	onNodeSelected: function(node) {},
	onNodeUpdated: function(updatedNode) {
		var node = gUIApp.nodeManager.getById(updatedNode.nodeId);
		node.updateLayoutWithConstraints(
			updatedNode.rect[0],
			updatedNode.rect[1],
			updatedNode.rect[2],
			updatedNode.rect[3]);
		node.nodeParams = updatedNode.nodeParams;
		var entity = node.ui[0];
		entity.color = updatedNode.color;
	},
	onError: function(errors) {},
};

const gUIApp = new UIApp(gCanvas, gExtEventMap, gCanvas.height, gCanvas.width);
gUIApp.run();


function mousedown(e) {
	var position = {
		y: Math.floor(e.offsetY/gUIApp.movingUnit)*gUIApp.movingUnit, 
		x: Math.floor(e.offsetX/gUIApp.movingUnit)*gUIApp.movingUnit,
	};

	if (e.which == 1) {
		gUIApp.nodeManager.onLeftMouseDown(
			position, e.ctrtKey, e.shiftKey);
	}
	else if (e.which == 3) {
		gUIApp.nodeManager.onRightMouseDown(
			position, e.ctrtKey, e.shiftKey);
	}

	gUIApp.response.startPosition = position;
	gUIApp.response.which = e.which;
	gUIApp.response.moved = false;
	gUIApp.response.ctrtKey = e.ctrtKey;
	gUIApp.response.shiftKey = e.shiftKey;
	gUIApp.response.entity = gUIApp.nodeManager.getEntityByLocation(
		{y: e.offsetY, x: e.offsetX});
	gUIApp.response.anchorPoint = {
		y: position.y - gUIApp.response.entity.y1, 
		x: position.x - gUIApp.response.entity.x1, 
	};

	gUIApp.extEventMap.onClear();
}

function mousemove(e) {
	var position = {
		y: Math.floor(e.offsetY/gUIApp.movingUnit)*gUIApp.movingUnit, 
		x: Math.floor(e.offsetX/gUIApp.movingUnit)*gUIApp.movingUnit,
	};

	gUIApp.response.currentPosition = position;
	gUIApp.response.moved = true;

	switch (gUIApp.response.which) {
		case 1: // Left mouse
		gUIApp.nodeManager.onDrag(
			gUIApp.response.entity, 
			gUIApp.response.startPosition,
			gUIApp.response.currentPosition,
			gUIApp.response.anchorPoint, 
			gUIApp.response.ctrlKey, 
			gUIApp.response.shiftKey);
		break;

		case 3:
		gUIApp.nodeManager.onDragAll(position, e.ctrtKey, e.shiftKey);
		break;

		default:
		if (e.which == 0) {
			var entity = gUIApp.nodeManager.getEntityByLocation(
				{y: e.offsetY, x: e.offsetX});
			if (entity != undefined) {
				var anchorPoint = {
					y: e.offsetY - entity.y1, 
					x: e.offsetX - entity.x1, 
				};
				gUIApp.nodeManager.onHover(
					entity, 
					gUIApp.response.currentPosition,
					anchorPoint);
			}
		}
		break;
	}	
}

function onmouseup(e) {
	var position = {
		y: Math.floor(e.offsetY/gUIApp.movingUnit)*gUIApp.movingUnit, 
		x: Math.floor(e.offsetX/gUIApp.movingUnit)*gUIApp.movingUnit,
	};

	gUIApp.response.currentPosition = position;
	switch (gUIApp.response.which) {
		case 1: // Left mouse
		if (!gUIApp.response.moved) {
			gUIApp.nodeManager.onLeftClick(
				gUIApp.response.entity, 
				gUIApp.response.anchorPoint, 
				gUIApp.response.ctrlKey, 
				gUIApp.response.shiftKey);
		}
		else {
			gUIApp.nodeManager.onDrop(
				gUIApp.response.entity, 
				gUIApp.response.startPosition,
				gUIApp.response.currentPosition,
				gUIApp.response.anchorPoint, 
				gUIApp.response.ctrlKey, 
				gUIApp.response.shiftKey);
		}
		break;

		case 3: // Right mouse
		if (!gUIApp.response.moved) {
			gUIApp.nodeManager.onRightClick(
				gUIApp.response.entity, 
				gUIApp.response.anchorPoint, 
				gUIApp.response.ctrlKey, 
				gUIApp.response.shiftKey);
		}
		break;

		default:
		break;
	}

	gUIApp.response.startPosition = undefined;
	gUIApp.response.which = undefined;
	gUIApp.response.moved = undefined;
	gUIApp.response.ctrtKey = undefined;
	gUIApp.response.shiftKey = undefined;
	gUIApp.response.currentPosition = undefined;
	gUIApp.response.entity = undefined;
	gUIApp.response.anchorPoint = undefined;

	gUIApp.nodeManager.snapshot();
}

gCanvas.onmousedown = mousedown;
gCanvas.onmousemove = mousemove;
gCanvas.onmouseup = onmouseup;
gCanvas.oncontextmenu = function () { return false; };

function onkeypress(e) {
	if (e.ctrlKey) {
		switch (e.key) {
			case 'a':
			gUIApp.nodeManager.selectAllNodes();
			break;

			case 'x':
			gUIApp.nodeManager.removeSelectedNodes(gUIApp.render);
			gUIApp.nodeManager.snapshot();
			break;

			case 'd':
			gUIApp.nodeManager.duplicateSelectedNodes(gUIApp.render);
			gUIApp.nodeManager.snapshot();
			break;

			case 'z':
			gUIApp.nodeManager.undo(gUIApp.render);
			break;

			case 'Z':
			gUIApp.nodeManager.redo(gUIApp.render);
			break;

			default: 
			break;
		}
	}	
}

document.onkeypress = onkeypress;

/* Public APIs*/

export function addImageClassificationDatagen() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#C0C0C0', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-64, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+64,
				}, 
				name: 'ImageClassificationDatagen'
			},
			nodeParams: {
				type: 'NONE_ANY',
				blockType: 'IMAGE_CLASSIFICATION_DATAGEN',
				params: {
					dataset_name: 'MNIST_DIGITS',
					train_procedure: 'IMAGE_CLASSIFICATION',
					image_shape: [28, 28],
					total_train_examples: 60000,
					batch_size: 1000,
					epochs: 100,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addHeatmapRegressionDatagen() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#C0C0C0', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-64, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+64,
				}, 
				name: 'HeatmapRegressionDatagen'
			},
			nodeParams: {
				type: 'NONE_ANY',
				blockType: 'HEATMAP_REGRESSION_DATAGEN',
				params: {
					dataset_name: 'FACEALI',
					train_procedure: 'HEATMAP_REGRESSION',
					image_shape: [112, 112, 1],
					total_train_examples: 1000,
					batch_size: 100,
					epochs: 100,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addObjectDetection4TiersDatagen() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#C0C0C0', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-64, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+64,
				}, 
				name: 'ObjectDetection4TiersDatagen'
			},
			nodeParams: {
				type: 'NONE_ANY',
				blockType: 'OBJECT_DETECTION_4TIERS_DATAGEN',
				params: {
					dataset_name: 'FACE_DETECION',
					train_procedure: 'OBJECT_DETECTION_4TIERS',
					image_shape: [512, 512, 3],
					anchor_sizes: [[[32, 32]], [[64, 64]], [[128, 128]], [[256, 256]]],
					scale_sizes: [[128, 128], [64, 64], [32, 32], [16, 16]],
					iou_thresholds: [[0.5, 0.6], [0.45, 0.55], [0.4, 0.5], [0.3, 0.4]],
					anchor_samplings: [400, 300, 200, 100],
					epochs: 100,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addInputLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#004000', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'InputLayer'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'INPUT_LAYER',
				params: {
					batch_size: 1,
					input_shape: [256, 256, 3],
					dtype: 'float32',
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addConv2DLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#00E000', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'Conv2DLayer'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'CONV2D_LAYER',
				params: {
					name: 'conv',
					filters: 1,
					kernel_size: [3, 3],
					strides: [1, 1],
					padding: 'same',
					use_bias: 1,
					trainable: 1,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addDenseLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#E00000', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'DenseLayer'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'DENSE_LAYER',
				params: {
					name: '',
					units: 1,
					use_bias: 1,
					trainable: 1,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addFlattenLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#A04040', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'FlattenLayer'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'FLATTEN_LAYER',
				params: {}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addMaxPool2DLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#80F080', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'MaxPool2DLayer'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'MAXPOOL2D_LAYER',
				params: {
					pool_size: [2, 2],
					strides: [1, 1],
					padding: 'same',
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addUpSampling2DLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#F080F0', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'UpSampling2DLayer'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'UPSAMPLING2D_LAYER',
				params: {
					size: [2, 2],
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addBatchNormLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#A0A0A0', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-16, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+16,
				}, 
				name: 'BatchNormLayer'
			},
			nodeParams: {
				type: 'ONE_ONE',
				blockType: 'BATCH_NORM_LAYER',
				params: {
					name: '',
					trainable: 1,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addActivationLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#E0E0E0', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-16, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+16,
				}, 
				name: 'ActivationLayer'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'ACTIVATION_LAYER',
				params: {
					activation: 'linear',
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addDropoutLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#606060', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-16, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+16,
				}, 
				name: 'DropoutLayer'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'DROPOUT_LAYER',
				params: {
					name: '',
					rate: 0.1,
					trainable: 1,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addAddLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#00A0A0', 
				rect: {
					y1: gUIApp.refPosition.y-32, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+32, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'AddLayer'
			},
			nodeParams: {
				type: 'MANY_ANY',
				blockType: 'ADD_LAYER',
				params: {}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addConcatLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#A0A000', 
				rect: {
					y1: gUIApp.refPosition.y-32, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+32, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'ConcatLayer'
			},
			nodeParams: {
				type: 'MANY_ANY',
				blockType: 'CONCAT_LAYER',
				params: {
					axis: -1,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addSplitLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#A000A0', 
				rect: {
					y1: gUIApp.refPosition.y-32, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+32, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'SplitLayer'
			},
			nodeParams: {
				type: 'ONE_MANY',
				blockType: 'SPLIT_LAYER',
				params: {
					axis: -1,
					size_splits: [1, 1],
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addSplittedLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#A0A0A0', 
				rect: {
					y1: gUIApp.refPosition.y-32, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+32, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'SplittedLayer'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'SPLITTED_LAYER',
				params: {
					order: 0,
				},
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addConv2DBlock() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#00E080', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'Conv2DBlock'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'CONV2D_BLOCK',
				params: {
					block_name: 'conv',
					filters: 1,
					kernel_size: [3, 3],
					strides: [1, 1],
					padding: 'same',
					use_bias: 1,
					trainable: 1,
					bn_trainable: 1,
					activation: 'relu',
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addReshapeLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#80A0A0', 
				rect: {
					y1: gUIApp.refPosition.y-32, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+32, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'ReshapeLayer'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'RESHAPE_LAYER',
				params: {
					new_shape: [-1],
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addCastLayer() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#C0C0C0', 
				rect: {
					y1: gUIApp.refPosition.y-32, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+32, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'CastLayer'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'CAST_LAYER',
				params: {
					dtype: 'int32',
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addNMSBlock() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#802020', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-64, 
					y2: gUIApp.refPosition.y+16, 
					x2: gUIApp.refPosition.x+16,
				}, 
				name: 'NMSBlock'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'NMS_BLOCK',
				params: {
					max_output_size: 100,
					iou_threshold: 0.5,
					score_threshold: 0.0,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addHourglassBlock() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#F04040', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'HourglassBlock'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'HOURGLASS_BLOCK',
				params: {
					block_name: 'hourglass',
					depth: 4,
					use_bias: 1,
					trainable: 1,
					bn_trainable: 1,
					repeat: 1,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addResnetIdentityBlock() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: "#404080", 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: "ResnetIdentityBlock"
			},
			nodeParams: {
				type: "ONE_ANY",
				blockType: "RESNET_IDENTITY_BLOCK",
				params: {
					block_name: "identity",
					filters: [16, 16, 64],
					kernel_size: [3, 3],
					use_bias: 1,
					trainable: 1,
					bn_trainable: 1,
					repeat: 1,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addResnetSIdentityBlock() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#4080A0', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'ResnetSIdentityBlock'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'RESNET_SIDENTITY_BLOCK',
				params: {
					block_name: 'sidentity',
					filters: [16, 16, 64],
					kernel_size: [3, 3],
					strides: [2, 2],
					use_bias: 1,
					trainable: 1,
					bn_trainable: 1,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function addRFEBlock() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#04A0E0', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-32, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+32,
				}, 
				name: 'RFEBlock'
			},
			nodeParams: {
				type: 'ONE_ANY',
				blockType: 'RFE_BLOCK',
				params: {
					block_name: 'rfe',
					use_bias: 1,
					trainable: 1,
					bn_trainable: 1,
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function OD4LossFunc() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#C0C0C0', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-64, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+64,
				}, 
				name: 'OD4LossFunc'
			},
			nodeParams: {
				type: 'ONE_NONE',
				blockType: 'LOSS_FUNC_OD4',
				params: {
					name: 'SSD',
					total_classes: 1,
					lamda: 1.0
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function ICLossFunc() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#C0C0C0', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-64, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+64,
				}, 
				name: 'ICLossFunc'
			},
			nodeParams: {
				type: 'ONE_NONE',
				blockType: 'LOSS_FUNC_IC',
				params: {
					name: 'CategoricalCrossEntropy',
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function HMRLossFunc() {
	gUIApp.nodeManager.addNode(
		UINodeManager.NODE_TYPE_CONNECTABLE,
		{
			nodeSettings: {
				color: '#C0C0C0', 
				rect: {
					y1: gUIApp.refPosition.y-64, 
					x1: gUIApp.refPosition.x-64, 
					y2: gUIApp.refPosition.y+64, 
					x2: gUIApp.refPosition.x+64,
				}, 
				name: 'HMRLossFunc',
			},
			nodeParams: {
				type: 'ONE_NONE',
				blockType: 'LOSS_FUNC_HMR',
				params: {
					name: 'HeatmapRegression',
				}
			},
		},
		gUIApp.nodeManager);
	gUIApp.nodeManager.snapshot();
}

export function exportModel() {
	return gUIApp.nodeManager.exportModel();
}

export function validate() {
	var errors = gUIApp.nodeManager.validate();
	gUIApp.extEventMap.onError(errors);
}

export function train() {
	
}

export function importDLT(snapshotJson) {
	gUIApp.nodeManager.import(snapshotJson);
}

export function exportDLT() {
	return gUIApp.nodeManager.export();
}
