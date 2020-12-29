import {UINodeManager} from './UINodeManager.js';
import {UIApp} from './UIApp.js';

/* Canvas setup */
const gCanvas = document.getElementById('dltool_canvas');
gCanvas.width = screen.width;
gCanvas.height = 0.9*screen.height;

/* External events */
var gNotification = {
	onClear: function() {},
	onNodeSelected: function(node) {},
	onError: function(errors) {},
};

const gUIApp = new UIApp(gCanvas, gNotification, gCanvas.height, gCanvas.width);
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

	gUIApp.notif.onClear();
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

// document.onkeypress notworking in Windows
document.onkeydown = onkeypress;

var gCommander = {
	addImageClassificationDatagen: function() {
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
					name: 'ImageClassificationDatagen',
					shortName: 'IC DATGEN',
				},
				nodeParams: {
					type: 'NONE_ANY',
					blockType: 'IMAGE_CLASSIFICATION_DATAGEN',
					params: {
						dataset_name: 'mnist-digits',
						train_procedure: 'image-classification',
						image_shape: [28, 28, 1],
						total_train_examples: 60000,
						total_test_examples: 10000,
						batch_size: 1000,
						epochs: 100,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addHeatmapRegressionDatagen: function() {
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
					name: 'HeatmapRegressionDatagen',
					shortName: 'HM DATGEN',
				},
				nodeParams: {
					type: 'NONE_ANY',
					blockType: 'HEATMAP_REGRESSION_DATAGEN',
					params: {
						dataset_name: 'faceali128x128',
						train_procedure: 'heatmap-regression',
						image_shape: [112, 112, 1],
						total_train_examples: 1000,
						total_test_examples: 200,
						batch_size: 100,
						epochs: 100,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addObjectDetectionDatagen: function() {
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
					name: 'ObjectDetectionDatagen',
					shortName: 'OD DATGEN',
				},
				nodeParams: {
					type: 'NONE_ANY',
					blockType: 'OBJECT_DETECTION_DATAGEN',
					params: {
						dataset_name: 'face1024',
						train_procedure: 'object-detection-3tiers',
						image_shape: [256, 256, 3],
						anchor_sizes: [[[32, 32]], [[64, 64]], [[128, 128]]],
						scale_sizes: [[64, 64], [32, 32], [16, 16]],
						iou_thresholds: [[0.45, 0.55], [0.4, 0.5], [0.3, 0.4]],
						anchor_sampling: [512, 246, 128],
						scale_range: [250, 1000],
						epochs: 1000,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addInputLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#004000', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'InputLayer',
					shortName: 'INPUT',
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
			});
		gUIApp.nodeManager.snapshot();
	},
	addConv2DLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#00E000', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'Conv2DLayer',
					shortName: 'CONV2D',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'CONV2D_LAYER',
					params: {
						name: '',
						filters: 1,
						kernel_size: [3, 3],
						strides: [1, 1],
						padding: 'same',
						use_bias: 1,
						trainable: 1,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addDenseLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#E00000', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'DenseLayer',
					shortName: 'DENSE',
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
			});
		gUIApp.nodeManager.snapshot();
	},
	addFlattenLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#A04040', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'FlattenLayer',
					shortName: 'FLATTEN',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'FLATTEN_LAYER',
					params: {}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addMaxPool2DLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#80F080', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'MaxPool2DLayer',
					shortName: 'MAXPOOL2D',
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
			});
		gUIApp.nodeManager.snapshot();
	},
	addUpSampling2DLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#F080F0', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'UpSampling2DLayer',
					shortName: 'UPSAMP2D',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'UPSAMPLING2D_LAYER',
					params: {
						size: [2, 2],
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addBatchNormLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#A0A0A0', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'BatchNormLayer',
					shortName: 'BN',
				},
				nodeParams: {
					type: 'ONE_ONE',
					blockType: 'BATCH_NORM_LAYER',
					params: {
						name: '',
						trainable: 1,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addActivationLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#E0E0E0', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'ActivationLayer',
					shortName: 'ACTIVATION',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'ACTIVATION_LAYER',
					params: {
						activation: 'linear',
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addDropoutLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#606060', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'DropoutLayer',
					shortName: 'DROPOUT',
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
			});
		gUIApp.nodeManager.snapshot();
	},
	addAddLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#00A0A0', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'AddLayer',
					shortName: 'ADD',
				},
				nodeParams: {
					type: 'MANY_ANY',
					blockType: 'ADD_LAYER',
					params: {}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addOrdinalLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#A04000', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'OrdinalLayer',
					shortName: 'ORDINAL',
				},
				nodeParams: {
					type: 'ONE_ONE',
					blockType: 'ORDINAL_LAYER',
					params: {
						order: 0,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addConcatLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#A0A000', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'ConcatLayer',
					shortName: 'CONCAT',
				},
				nodeParams: {
					type: 'MANY_ANY',
					blockType: 'CONCAT_LAYER',
					params: {
						axis: -1,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addSplitLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#A000A0', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'SplitLayer',
					shortName: 'SPLIT',
				},
				nodeParams: {
					type: 'ONE_MANY',
					blockType: 'SPLIT_LAYER',
					params: {
						axis: -1,
						size_splits: [1, 1],
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addSplittedLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#A0A0A0', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'SplittedLayer',
					shortName: 'SPLITTED',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'SPLITTED_LAYER',
					params: {
						order: 0,
					},
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addConv2DBlock: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#00E080', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'Conv2DBlock',
					shortName: 'CONV2D BLK',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'CONV2D_BLOCK',
					params: {
						name: '',
						filters: 1,
						kernel_size: [3, 3],
						strides: [1, 1],
						padding: 'same',
						use_bias: 1,
						trainable: 1,
						bn_trainable: 1,
						activation: 'relu',
						repeat: 1,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addReshapeLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#80A0A0', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'ReshapeLayer',
					shortName: 'RESHAPE',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'RESHAPE_LAYER',
					params: {
						new_shape: [-1],
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addCastLayer: function() {
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
					name: 'CastLayer',
					shortName: 'CAST',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'CAST_LAYER',
					params: {
						dtype: 'int32',
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addNMSBlock: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#802020', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'NMSBlock',
					shortName: 'NMS',
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
			});
		gUIApp.nodeManager.snapshot();
	},
	addHourglassBlock: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#F04040', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'HourglassBlock',
					shortName: 'HOURGS',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'HOURGLASS_BLOCK',
					params: {
						name: '',
						depth: 4,
						use_bias: 1,
						trainable: 1,
						bn_trainable: 1,
						repeat: 1,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addOutputLayer: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#0040F0', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'OutputLayer',
					shortName: 'OUTPUT',
				},
				nodeParams: {
					type: 'ONE_NONE',
					blockType: 'OUTPUT_LAYER',
					params: {}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addResnetIdentityBlock: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#404080', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'ResnetIdentityBlock',
					shortName: 'RESNET ID',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'RESNET_IDENTITY_BLOCK',
					params: {
						name: '',
						filters: [16, 16, 64],
						kernel_size: [3, 3],
						use_bias: 1,
						trainable: 1,
						bn_trainable: 1,
						repeat: 1,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addResnetSIdentityBlock: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#4080A0', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'ResnetSIdentityBlock',
					shortName: 'RESNET SID',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'RESNET_SIDENTITY_BLOCK',
					params: {
						name: 'sidentity',
						filters: [16, 16, 64],
						kernel_size: [3, 3],
						strides: [2, 2],
						use_bias: 1,
						trainable: 1,
						bn_trainable: 1,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addRFEBlock: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#04A0E0', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'RFEBlock',
					shortName: 'RFE',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'RFE_BLOCK',
					params: {
						name: 'rfe',
						use_bias: 1,
						trainable: 1,
						bn_trainable: 1,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	addODHeadBlock: function() {
		gUIApp.nodeManager.addNode(
			UINodeManager.NODE_TYPE_CONNECTABLE,
			{
				nodeSettings: {
					color: '#660066', 
					rect: {
						y1: gUIApp.refPosition.y-64, 
						x1: gUIApp.refPosition.x-64, 
						y2: gUIApp.refPosition.y+64, 
						x2: gUIApp.refPosition.x+64,
					}, 
					name: 'ODHeadBlock',
					shortName: 'OD HEAD',
				},
				nodeParams: {
					type: 'ONE_ANY',
					blockType: 'OD_HEAD_BLOCK',
					params: {
						k: 1,
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	ODLossFunc: function() {
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
					name: 'ODLossFunc',
					shortName: 'OD LOSS',
				},
				nodeParams: {
					type: 'ONE_NONE',
					blockType: 'LOSS_FUNC_OD',
					params: {
						name: 'object-detection',
						total_classes: 1,
						lamda: 1.0
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	ICLossFunc: function() {
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
					name: 'ICLossFunc',
					shortName: 'IC LOSS',
				},
				nodeParams: {
					type: 'ONE_NONE',
					blockType: 'LOSS_FUNC_IC',
					params: {
						name: 'categorical-cross-entropy',
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
	HMRLossFunc: function() {
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
					shortName: 'HM LOSS',
				},
				nodeParams: {
					type: 'ONE_NONE',
					blockType: 'LOSS_FUNC_HMR',
					params: {
						name: 'heatmap-regression',
					}
				},
			});
		gUIApp.nodeManager.snapshot();
	},
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
	exportModel: function() {
		return gUIApp.nodeManager.exportModel();
	},
	validate: function() {
		var errors = gUIApp.nodeManager.validate();
		gUIApp.notif.onError(errors);
		return errors;
	},
	train: function() {
		
	},
	importDLT: function(snapshotJson) {
		gUIApp.nodeManager.import(snapshotJson);
	},
	exportDLT: function() {
		return gUIApp.nodeManager.export();
	}
}

export {gCommander, gNotification};
