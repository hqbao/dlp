import * as dlt from './Main.js';

var gNode = null;

export function onImageClassificationDatagenSelected() {
	var rectInput = document.getElementById("IMAGE_CLASSIFICATION_DATAGEN.rect");
	var colorInput = document.getElementById("IMAGE_CLASSIFICATION_DATAGEN.color");
	var datasetNameInput = document.getElementById("IMAGE_CLASSIFICATION_DATAGEN.dataset_name");
	var trainProcedureInput = document.getElementById("IMAGE_CLASSIFICATION_DATAGEN.train_procedure");
	var imageShapeInput = document.getElementById("IMAGE_CLASSIFICATION_DATAGEN.image_shape");
	var totalTrainExamplesShapeInput = document.getElementById("IMAGE_CLASSIFICATION_DATAGEN.total_train_examples");
	var totalTestExamplesShapeInput = document.getElementById("IMAGE_CLASSIFICATION_DATAGEN.total_test_examples");
	var batchSizeShapeInput = document.getElementById("IMAGE_CLASSIFICATION_DATAGEN.batch_size");
	var epochsShapeInput = document.getElementById("IMAGE_CLASSIFICATION_DATAGEN.epochs");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	datasetNameInput.value = gNode.nodeParams.params.dataset_name;
	trainProcedureInput.value = gNode.nodeParams.params.train_procedure;
	imageShapeInput.value = JSON.stringify(gNode.nodeParams.params.image_shape);
	totalTrainExamplesShapeInput.value = gNode.nodeParams.params.total_train_examples;
	totalTestExamplesShapeInput.value = gNode.nodeParams.params.total_test_examples;
	batchSizeShapeInput.value = gNode.nodeParams.params.batch_size;
	epochsShapeInput.value = gNode.nodeParams.params.epochs;
}

export function onImageClassificationDatagenChange(id, value) {
	switch (id) {
		case "IMAGE_CLASSIFICATION_DATAGEN.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "IMAGE_CLASSIFICATION_DATAGEN.color":
		gNode.color = value;
		break;

		case "IMAGE_CLASSIFICATION_DATAGEN.dataset_name":
		gNode.nodeParams.params.dataset_name = value;
		break;

		case "IMAGE_CLASSIFICATION_DATAGEN.train_procedure":
		gNode.nodeParams.params.name = value;
		break;

		case "IMAGE_CLASSIFICATION_DATAGEN.image_shape":
		gNode.nodeParams.params.image_shape = JSON_parse(value);
		break;

		case "IMAGE_CLASSIFICATION_DATAGEN.total_train_examples":
		gNode.nodeParams.params.total_train_examples = parseInt(value);
		break;

		case "IMAGE_CLASSIFICATION_DATAGEN.total_test_examples":
		gNode.nodeParams.params.total_test_examples = parseInt(value);
		break;

		case "IMAGE_CLASSIFICATION_DATAGEN.batch_size":
		gNode.nodeParams.params.batch_size = parseInt(value);
		break;

		case "IMAGE_CLASSIFICATION_DATAGEN.epochs":
		gNode.nodeParams.params.epochs = parseInt(value);
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onHeatmapRegressionDatagenSelected() {
	var rectInput = document.getElementById("HEATMAP_REGRESSION_DATAGEN.rect");
	var colorInput = document.getElementById("HEATMAP_REGRESSION_DATAGEN.color");
	var datasetNameInput = document.getElementById("HEATMAP_REGRESSION_DATAGEN.dataset_name");
	var trainProcedureInput = document.getElementById("HEATMAP_REGRESSION_DATAGEN.train_procedure");
	var imageShapeInput = document.getElementById("HEATMAP_REGRESSION_DATAGEN.image_shape");
	var totalTrainExamplesShapeInput = document.getElementById("HEATMAP_REGRESSION_DATAGEN.total_train_examples");
	var totalTestExamplesShapeInput = document.getElementById("HEATMAP_REGRESSION_DATAGEN.total_test_examples");
	var batchSizeShapeInput = document.getElementById("HEATMAP_REGRESSION_DATAGEN.batch_size");
	var epochsShapeInput = document.getElementById("HEATMAP_REGRESSION_DATAGEN.epochs");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	datasetNameInput.value = gNode.nodeParams.params.dataset_name;
	trainProcedureInput.value = gNode.nodeParams.params.train_procedure;
	imageShapeInput.value = JSON.stringify(gNode.nodeParams.params.image_shape);
	totalTrainExamplesShapeInput.value = gNode.nodeParams.params.total_train_examples;
	totalTestExamplesShapeInput.value = gNode.nodeParams.params.total_test_examples;
	batchSizeShapeInput.value = gNode.nodeParams.params.batch_size;
	epochsShapeInput.value = gNode.nodeParams.params.epochs;
}

export function onHeatmapRegressionDatagenChange(id, value) {
	switch (id) {
		case "HEATMAP_REGRESSION_DATAGEN.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "HEATMAP_REGRESSION_DATAGEN.color":
		gNode.color = value;
		break;

		case "HEATMAP_REGRESSION_DATAGEN.dataset_name":
		gNode.nodeParams.params.dataset_name = value;
		break;

		case "HEATMAP_REGRESSION_DATAGEN.train_procedure":
		gNode.nodeParams.params.name = value;
		break;

		case "HEATMAP_REGRESSION_DATAGEN.image_shape":
		gNode.nodeParams.params.image_shape = JSON_parse(value);
		break;

		case "HEATMAP_REGRESSION_DATAGEN.total_train_examples":
		gNode.nodeParams.params.total_train_examples = parseInt(value);
		break;

		case "HEATMAP_REGRESSION_DATAGEN.total_test_examples":
		gNode.nodeParams.params.total_test_examples = parseInt(value);
		break;

		case "HEATMAP_REGRESSION_DATAGEN.batch_size":
		gNode.nodeParams.params.batch_size = parseInt(value);
		break;

		case "HEATMAP_REGRESSION_DATAGEN.epochs":
		gNode.nodeParams.params.epochs = parseInt(value);
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onObjectDetectionDatagenSelected() {
	var rectInput = document.getElementById("OBJECT_DETECTION_DATAGEN.rect");
	var colorInput = document.getElementById("OBJECT_DETECTION_DATAGEN.color");
	var datasetNameInput = document.getElementById("OBJECT_DETECTION_DATAGEN.dataset_name");
	var trainProcedureInput = document.getElementById("OBJECT_DETECTION_DATAGEN.train_procedure");
	var imageShapeInput = document.getElementById("OBJECT_DETECTION_DATAGEN.image_shape");
	var anchorSizesInput = document.getElementById("OBJECT_DETECTION_DATAGEN.anchor_sizes");
	var scaleSizesInput = document.getElementById("OBJECT_DETECTION_DATAGEN.scale_sizes");
	var iouThresholdsInput = document.getElementById("OBJECT_DETECTION_DATAGEN.iou_thresholds");
	var anchorSamplingsInput = document.getElementById("OBJECT_DETECTION_DATAGEN.anchor_sampling");
	var epochsInput = document.getElementById("OBJECT_DETECTION_DATAGEN.epochs");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	datasetNameInput.value = gNode.nodeParams.params.dataset_name;
	trainProcedureInput.value = gNode.nodeParams.params.train_procedure;
	imageShapeInput.value = JSON.stringify(gNode.nodeParams.params.image_shape);
	anchorSizesInput.value = JSON.stringify(gNode.nodeParams.params.anchor_sizes);
	scaleSizesInput.value = JSON.stringify(gNode.nodeParams.params.scale_sizes);
	iouThresholdsInput.value = JSON.stringify(gNode.nodeParams.params.iou_thresholds);
	anchorSamplingsInput.value = JSON.stringify(gNode.nodeParams.params.anchor_sampling);
	epochsInput.value = gNode.nodeParams.params.epochs;
}

export function addObjectDetectionDatagenChange(id, value) {
	switch (id) {
		case "OBJECT_DETECTION_DATAGEN.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "OBJECT_DETECTION_DATAGEN.color":
		gNode.color = value;
		break;

		case "OBJECT_DETECTION_DATAGEN.dataset_name":
		gNode.nodeParams.params.dataset_name = value;
		break;

		case "OBJECT_DETECTION_DATAGEN.train_procedure":
		gNode.nodeParams.params.train_procedure = value;
		break;

		case "OBJECT_DETECTION_DATAGEN.image_shape":
		gNode.nodeParams.params.image_shape = JSON_parse(value);
		break;

		case "OBJECT_DETECTION_DATAGEN.anchor_sizes":
		gNode.nodeParams.params.anchor_sizes = JSON_parse(value);
		break;

		case "OBJECT_DETECTION_DATAGEN.scale_sizes":
		gNode.nodeParams.params.scale_sizes = JSON_parse(value);
		break;

		case "OBJECT_DETECTION_DATAGEN.iou_thresholds":
		gNode.nodeParams.params.iou_thresholds = JSON_parse(value);
		break;

		case "OBJECT_DETECTION_DATAGEN.anchor_sampling":
		gNode.nodeParams.params.anchor_sampling = JSON_parse(value);
		break;

		case "OBJECT_DETECTION_DATAGEN.epochs":
		gNode.nodeParams.params.epochs = parseInt(value);
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onInputLayerSelected() {
	var rectInput = document.getElementById("INPUT_LAYER.rect");
	var colorInput = document.getElementById("INPUT_LAYER.color");
	var batchSizeInput = document.getElementById("INPUT_LAYER.batch_size");
	var shapeInput = document.getElementById("INPUT_LAYER.input_shape");
	var dtypeInput = document.getElementById("INPUT_LAYER.dtype");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	batchSizeInput.value = gNode.nodeParams.params.batch_size;
	shapeInput.value = JSON.stringify(gNode.nodeParams.params.input_shape);
	dtypeInput.value = gNode.nodeParams.params.dtype;
}

export function onInputLayerChange(id, value) {
	switch (id) {
		case "INPUT_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "INPUT_LAYER.color":
		gNode.color = value;
		break;

		case "INPUT_LAYER.batch_size":
		gNode.nodeParams.params.batch_size = parseInt(value);
		break;

		case "INPUT_LAYER.input_shape":
		gNode.nodeParams.params.input_shape = JSON_parse(value);
		break;

		case "INPUT_LAYER.dtype":
		gNode.nodeParams.params.dtype = value;
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onDenseLayerSelected() {
	var rectInput = document.getElementById("DENSE_LAYER.rect");
	var colorInput = document.getElementById("DENSE_LAYER.color");
	var nameInput = document.getElementById("DENSE_LAYER.name");
	var unitsInput = document.getElementById("DENSE_LAYER.units");
	var useBiasInput = document.getElementById("DENSE_LAYER.use_bias");
	var trainableInput = document.getElementById("DENSE_LAYER.trainable");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	nameInput.value = gNode.nodeParams.params.name;
	unitsInput.value = gNode.nodeParams.params.units;
	useBiasInput.value = gNode.nodeParams.params.use_bias;
	trainableInput.value = gNode.nodeParams.params.trainable;
}

export function onDenseLayerChange(id, value) {
	switch (id) {
		case "DENSE_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "DENSE_LAYER.color":
		gNode.color = value;
		break;

		case "DENSE_LAYER.name":
		gNode.nodeParams.params.name = value;
		break;

		case "DENSE_LAYER.units":
		gNode.nodeParams.params.units = parseInt(value);
		break;

		case "DENSE_LAYER.use_bias":
		gNode.nodeParams.params.use_bias = parseInt(value);
		break;

		case "DENSE_LAYER.trainable":
		gNode.nodeParams.params.trainable = parseInt(value);
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onConv2DLayerSelected() {
	var rectInput = document.getElementById("CONV2D_LAYER.rect");
	var colorInput = document.getElementById("CONV2D_LAYER.color");
	var nameInput = document.getElementById("CONV2D_LAYER.name");
	var filtersInput = document.getElementById("CONV2D_LAYER.filters");
	var kernelSizeInput = document.getElementById("CONV2D_LAYER.kernel_size");
	var stridesInput = document.getElementById("CONV2D_LAYER.strides");
	var paddingInput = document.getElementById("CONV2D_LAYER.padding");
	var useBiasInput = document.getElementById("CONV2D_LAYER.use_bias");
	var trainableInput = document.getElementById("CONV2D_LAYER.trainable");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	nameInput.value = gNode.nodeParams.params.name;
	filtersInput.value = gNode.nodeParams.params.filters;
	kernelSizeInput.value = JSON.stringify(gNode.nodeParams.params.kernel_size);
	stridesInput.value = JSON.stringify(gNode.nodeParams.params.strides);
	paddingInput.value = gNode.nodeParams.params.padding;
	useBiasInput.value = gNode.nodeParams.params.use_bias;
	trainableInput.value = gNode.nodeParams.params.trainable;
}

export function onConv2DLayerChange(id, value) {
	switch (id) {
		case "CONV2D_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "CONV2D_LAYER.color":
		gNode.color = value;
		break;

		case "CONV2D_LAYER.name":
		gNode.nodeParams.params.name = value;
		break;

		case "CONV2D_LAYER.filters":
		gNode.nodeParams.params.filters = parseInt(value);
		break;

		case "CONV2D_LAYER.kernel_size":
		gNode.nodeParams.params.kernel_size = JSON_parse(value);
		break;

		case "CONV2D_LAYER.strides":
		gNode.nodeParams.params.strides = JSON_parse(value);
		break;

		case "CONV2D_LAYER.padding":
		gNode.nodeParams.params.padding = value;
		break;

		case "CONV2D_LAYER.use_bias":
		gNode.nodeParams.params.use_bias = parseInt(value);
		break;

		case "CONV2D_LAYER.trainable":
		gNode.nodeParams.params.trainable = parseInt(value);
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onMaxPool2DLayerSelected() {
	var rectInput = document.getElementById("MAXPOOL2D_LAYER.rect");
	var colorInput = document.getElementById("MAXPOOL2D_LAYER.color");
	var poolSizeInput = document.getElementById("MAXPOOL2D_LAYER.pool_size");
	var stridesInput = document.getElementById("MAXPOOL2D_LAYER.strides");
	var paddingInput = document.getElementById("MAXPOOL2D_LAYER.padding");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	poolSizeInput.value = JSON.stringify(gNode.nodeParams.params.pool_size);
	stridesInput.value = JSON.stringify(gNode.nodeParams.params.strides);
	paddingInput.value = gNode.nodeParams.params.padding;
}

export function onMaxPool2DLayerChange(id, value) {
	switch (id) {
		case "MAXPOOL2D_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "MAXPOOL2D_LAYER.color":
		gNode.color = value;
		break;

		case "MAXPOOL2D_LAYER.pool_size":
		gNode.nodeParams.params.pool_size = JSON_parse(value);
		break;

		case "MAXPOOL2D_LAYER.strides":
		gNode.nodeParams.params.strides = JSON_parse(value);
		break;

		case "MAXPOOL2D_LAYER.padding":
		gNode.nodeParams.params.padding = value;
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onUpSampling2DLayerSelected() {
	var rectInput = document.getElementById("UPSAMPLING2D_LAYER.rect");
	var colorInput = document.getElementById("UPSAMPLING2D_LAYER.color");
	var sizeInput = document.getElementById("UPSAMPLING2D_LAYER.size");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	sizeInput.value = JSON.stringify(gNode.nodeParams.params.size);
}

export function onUpSampling2DLayerChange(id, value) {
	switch (id) {
		case "UPSAMPLING2D_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "UPSAMPLING2D_LAYER.color":
		gNode.color = value;
		break;

		case "UPSAMPLING2D_LAYER.size":
		gNode.nodeParams.params.size = JSON_parse(value);
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onBatchNormLayerSelected() {
	var rectInput = document.getElementById("BATCH_NORM_LAYER.rect");
	var colorInput = document.getElementById("BATCH_NORM_LAYER.color");
	var nameInput = document.getElementById("BATCH_NORM_LAYER.name");
	var trainableInput = document.getElementById("BATCH_NORM_LAYER.trainable");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	nameInput.value = gNode.nodeParams.params.name;
	trainableInput.value = gNode.nodeParams.params.trainable;
}

export function onBatchNormLayerChange(id, value) {
	switch (id) {
		case "BATCH_NORM_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "BATCH_NORM_LAYER.color":
		gNode.color = value;
		break;

		case "BATCH_NORM_LAYER.name":
		gNode.nodeParams.params.name = value;
		break;

		case "BATCH_NORM_LAYER.trainable":
		gNode.nodeParams.params.trainable = parseInt(value);
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onDropoutLayerSelected() {
	var rectInput = document.getElementById("DROPOUT_LAYER.rect");
	var colorInput = document.getElementById("DROPOUT_LAYER.color");
	var nameInput = document.getElementById("DROPOUT_LAYER.name");
	var rateInput = document.getElementById("DROPOUT_LAYER.rate");
	var trainableInput = document.getElementById("DROPOUT_LAYER.trainable");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	nameInput.value = gNode.nodeParams.params.name;
	rateInput.value = gNode.nodeParams.params.rate;
	trainableInput.value = gNode.nodeParams.params.trainable;
}

export function onDropoutLayerChange(id, value) {
	switch (id) {
		case "DROPOUT_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "DROPOUT_LAYER.color":
		gNode.color = value;
		break;

		case "DROPOUT_LAYER.name":
		gNode.nodeParams.params.name = value;
		break;

		case "DROPOUT_LAYER.rate":
		gNode.nodeParams.params.rate = parseFloat(value);
		break;

		case "DROPOUT_LAYER.trainable":
		gNode.nodeParams.params.trainable = parseInt(value);
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onActivationLayerSelected() {
	var rectInput = document.getElementById("ACTIVATION_LAYER.rect");
	var colorInput = document.getElementById("ACTIVATION_LAYER.color");
	var activationInput = document.getElementById("ACTIVATION_LAYER.activation");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	activationInput.value = gNode.nodeParams.params.activation;
}

export function onActivationLayerChange(id, value) {
	switch (id) {
		case "ACTIVATION_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "ACTIVATION_LAYER.color":
		gNode.color = value;
		break;

		case "ACTIVATION_LAYER.activation":
		gNode.nodeParams.params.activation = value;
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onFlattenLayerSelected() {
	var rectInput = document.getElementById("FLATTEN_LAYER.rect");
	var colorInput = document.getElementById("FLATTEN_LAYER.color");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
}

export function onFlattenLayerChange(id, value) {
	switch (id) {
		case "FLATTEN_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "FLATTEN_LAYER.color":
		gNode.color = value;
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onAddLayerSelected() {
	var rectInput = document.getElementById("ADD_LAYER.rect");
	var colorInput = document.getElementById("ADD_LAYER.color");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
}

export function onAddLayerChange(id, value) {
	switch (id) {
		case "ADD_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "ADD_LAYER.color":
		gNode.color = value;
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onConcatLayerSelected() {
	var rectInput = document.getElementById("CONCAT_LAYER.rect");
	var colorInput = document.getElementById("CONCAT_LAYER.color");
	var axisInput = document.getElementById("CONCAT_LAYER.axis");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	axisInput.value = gNode.nodeParams.params.axis;
}

export function onConcatLayerChange(id, value) {
	switch (id) {
		case "CONCAT_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "CONCAT_LAYER.color":
		gNode.color = value;
		break;

		case "CONCAT_LAYER.axis":
		gNode.nodeParams.params.axis = parseInt(value);
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onSplitLayerSelected() {
	var rectInput = document.getElementById("SPLIT_LAYER.rect");
	var colorInput = document.getElementById("SPLIT_LAYER.color");
	var axisInput = document.getElementById("SPLIT_LAYER.axis");
	var sizeSplitsInput = document.getElementById("SPLIT_LAYER.size_splits");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	axisInput.value = gNode.nodeParams.params.axis;
	sizeSplitsInput.value = JSON.stringify(gNode.nodeParams.params.size_splits);
}

export function onSplitLayerChange(id, value) {
	switch (id) {
		case "SPLIT_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "SPLIT_LAYER.color":
		gNode.color = value;
		break;

		case "SPLIT_LAYER.axis":
		gNode.nodeParams.params.axis = parseInt(value);
		break;

		case "SPLIT_LAYER.size_splits":
		gNode.nodeParams.params.size_splits = JSON_parse(value);
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onSplittedLayerSelected() {
	var rectInput = document.getElementById("SPLITTED_LAYER.rect");
	var colorInput = document.getElementById("SPLITTED_LAYER.color");
	var orderInput = document.getElementById("SPLITTED_LAYER.order");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	orderInput.value = gNode.nodeParams.params.order;
}

export function onSplittedLayerChange(id, value) {
	switch (id) {
		case "SPLITTED_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "SPLITTED_LAYER.color":
		gNode.color = value;
		break;

		case "SPLITTED_LAYER.order":
		gNode.nodeParams.params.order = parseInt(value);
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onReshapeLayerSelected() {
	var rectInput = document.getElementById("RESHAPE_LAYER.rect");
	var colorInput = document.getElementById("RESHAPE_LAYER.color");
	var shapeInput = document.getElementById("RESHAPE_LAYER.new_shape");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	shapeInput.value = JSON.stringify(gNode.nodeParams.params.new_shape);
}

export function onReshapeLayerChange(id, value) {
	switch (id) {
		case "RESHAPE_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "RESHAPE_LAYER.color":
		gNode.color = value;
		break;

		case "RESHAPE_LAYER.new_shape":
		gNode.nodeParams.params.new_shape = JSON_parse(value);
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onCastLayerSelected() {
	var rectInput = document.getElementById("CAST_LAYER.rect");
	var colorInput = document.getElementById("CAST_LAYER.color");
	var dtypeInput = document.getElementById("CAST_LAYER.dtype");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	dtypeInput.value = gNode.nodeParams.params.dtype;
}

export function onCastLayerChange(id, value) {
	switch (id) {
		case "CAST_LAYER.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "CAST_LAYER.color":
		gNode.color = value;
		break;

		case "CAST_LAYER.dtype":
		gNode.nodeParams.params.dtype = value;
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onConv2DBlockSelected() {
	var rectInput = document.getElementById("CONV2D_BLOCK.rect");
	var colorInput = document.getElementById("CONV2D_BLOCK.color");
	var nameInput = document.getElementById("CONV2D_BLOCK.name");
	var filtersInput = document.getElementById("CONV2D_BLOCK.filters");
	var kernelSizeInput = document.getElementById("CONV2D_BLOCK.kernel_size");
	var stridesInput = document.getElementById("CONV2D_BLOCK.strides");
	var paddingInput = document.getElementById("CONV2D_BLOCK.padding");
	var useBiasInput = document.getElementById("CONV2D_BLOCK.use_bias");
	var trainableInput = document.getElementById("CONV2D_BLOCK.trainable");
	var bnTrainableInput = document.getElementById("CONV2D_BLOCK.bn_trainable");
	var activationInput = document.getElementById("CONV2D_BLOCK.activation");
	var repeatInput = document.getElementById("CONV2D_BLOCK.repeat");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	nameInput.value = gNode.nodeParams.params.name;
	filtersInput.value = gNode.nodeParams.params.filters;
	kernelSizeInput.value = JSON.stringify(gNode.nodeParams.params.kernel_size);
	stridesInput.value = JSON.stringify(gNode.nodeParams.params.strides);
	paddingInput.value = gNode.nodeParams.params.padding;
	useBiasInput.value = gNode.nodeParams.params.use_bias;
	trainableInput.value = gNode.nodeParams.params.trainable;
	bnTrainableInput.value = gNode.nodeParams.params.bn_trainable;
	activationInput.value = gNode.nodeParams.params.activation;
	repeatInput.value = gNode.nodeParams.params.repeat;
}

export function onConv2DBlockChange(id, value) {
	switch (id) {
		case "CONV2D_BLOCK.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "CONV2D_BLOCK.color":
		gNode.color = value;
		break;

		case "CONV2D_BLOCK.name":
		gNode.nodeParams.params.name = value;
		break;

		case "CONV2D_BLOCK.filters":
		gNode.nodeParams.params.filters = parseInt(value);
		break;

		case "CONV2D_BLOCK.kernel_size":
		gNode.nodeParams.params.kernel_size = JSON_parse(value);
		break;

		case "CONV2D_BLOCK.strides":
		gNode.nodeParams.params.strides = JSON_parse(value);
		break;

		case "CONV2D_BLOCK.padding":
		gNode.nodeParams.params.padding = value;
		break;

		case "CONV2D_BLOCK.use_bias":
		gNode.nodeParams.params.use_bias = parseInt(value);
		break;

		case "CONV2D_BLOCK.trainable":
		gNode.nodeParams.params.trainable = parseInt(value);
		break;

		case "CONV2D_BLOCK.bn_trainable":
		gNode.nodeParams.params.trainable = parseInt(value);
		break;

		case "CONV2D_BLOCK.activation":
		gNode.nodeParams.params.activation = value;
		break;

		case "CONV2D_BLOCK.repeat":
		gNode.nodeParams.params.repeat = parseInt(value);
		break;

		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onResnetIdentityBlockSelected() {
	var rectInput = document.getElementById("RESNET_IDENTITY_BLOCK.rect");
	var colorInput = document.getElementById("RESNET_IDENTITY_BLOCK.color");
	var nameInput = document.getElementById("RESNET_IDENTITY_BLOCK.name");
	var filtersInput = document.getElementById("RESNET_IDENTITY_BLOCK.filters");
	var kernelSizeInput = document.getElementById("RESNET_IDENTITY_BLOCK.kernel_size");
	var useBiasInput = document.getElementById("RESNET_IDENTITY_BLOCK.use_bias");
	var trainableInput = document.getElementById("RESNET_IDENTITY_BLOCK.trainable");
	var bnTrainableInput = document.getElementById("RESNET_IDENTITY_BLOCK.bn_trainable");
	var repeatInput = document.getElementById("RESNET_IDENTITY_BLOCK.repeat");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	nameInput.value = gNode.nodeParams.params.name;
	filtersInput.value = JSON.stringify(gNode.nodeParams.params.filters);
	kernelSizeInput.value = JSON.stringify(gNode.nodeParams.params.kernel_size);
	useBiasInput.value = gNode.nodeParams.params.use_bias;
	trainableInput.value = gNode.nodeParams.params.trainable;
	bnTrainableInput.value = gNode.nodeParams.params.bn_trainable;
	repeatInput.value = gNode.nodeParams.params.repeat;
}

export function onResnetIdentityBlockChange(id, value) {
	switch (id) {
		case "RESNET_IDENTITY_BLOCK.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "RESNET_IDENTITY_BLOCK.color":
		gNode.color = value;
		break;

		case "RESNET_IDENTITY_BLOCK.name":
		gNode.nodeParams.params.name = value;
		break;

		case "RESNET_IDENTITY_BLOCK.filters":
		gNode.nodeParams.params.filters = JSON_parse(value);
		break;

		case "RESNET_IDENTITY_BLOCK.kernel_size":
		gNode.nodeParams.params.kernel_size = JSON_parse(value);
		break;

		case "RESNET_IDENTITY_BLOCK.use_bias":
		gNode.nodeParams.params.use_bias = parseInt(value);
		break;

		case "RESNET_IDENTITY_BLOCK.bn_trainable":
		gNode.nodeParams.params.bn_trainable = parseInt(value);
		break;

		case "RESNET_IDENTITY_BLOCK.repeat":
		gNode.nodeParams.params.repeat = parseInt(value);
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onResnetSIdentityBlockSelected() {
	var rectInput = document.getElementById("RESNET_SIDENTITY_BLOCK.rect");
	var colorInput = document.getElementById("RESNET_SIDENTITY_BLOCK.color");
	var nameInput = document.getElementById("RESNET_SIDENTITY_BLOCK.name");
	var filtersInput = document.getElementById("RESNET_SIDENTITY_BLOCK.filters");
	var kernelSizeInput = document.getElementById("RESNET_SIDENTITY_BLOCK.kernel_size");
	var stridesInput = document.getElementById("RESNET_SIDENTITY_BLOCK.strides");
	var useBiasInput = document.getElementById("RESNET_SIDENTITY_BLOCK.use_bias");
	var trainableInput = document.getElementById("RESNET_SIDENTITY_BLOCK.trainable");
	var bnTrainableInput = document.getElementById("RESNET_SIDENTITY_BLOCK.bn_trainable");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	nameInput.value = gNode.nodeParams.params.name;
	filtersInput.value = JSON.stringify(gNode.nodeParams.params.filters);
	kernelSizeInput.value = JSON.stringify(gNode.nodeParams.params.kernel_size);
	stridesInput.value = JSON.stringify(gNode.nodeParams.params.strides);
	useBiasInput.value = gNode.nodeParams.params.use_bias;
	trainableInput.value = gNode.nodeParams.params.trainable;
	bnTrainableInput.value = gNode.nodeParams.params.bn_trainable;
}

export function onResnetSIdentityBlockChange(id, value) {
	switch (id) {
		case "RESNET_SIDENTITY_BLOCK.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "RESNET_SIDENTITY_BLOCK.color":
		gNode.color = value;
		break;

		case "RESNET_SIDENTITY_BLOCK.name":
		gNode.nodeParams.params.name = value;
		break;

		case "RESNET_SIDENTITY_BLOCK.filters":
		gNode.nodeParams.params.filters = JSON_parse(value);
		break;

		case "RESNET_SIDENTITY_BLOCK.kernel_size":
		gNode.nodeParams.params.kernel_size = JSON_parse(value);
		break;

		case "RESNET_SIDENTITY_BLOCK.strides":
		gNode.nodeParams.params.strides = JSON_parse(value);
		break;

		case "RESNET_SIDENTITY_BLOCK.use_bias":
		gNode.nodeParams.params.use_bias = parseInt(value);
		break;

		case "RESNET_SIDENTITY_BLOCK.trainable":
		gNode.nodeParams.params.trainable = parseInt(value);
		break;

		case "RESNET_SIDENTITY_BLOCK.bn_trainable":
		gNode.nodeParams.params.bn_trainable = parseInt(value);
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onNMSLayerSelected() {
	var rectInput = document.getElementById("NMS_BLOCK.rect");
	var colorInput = document.getElementById("NMS_BLOCK.color");
	var maxOuputSizeInput = document.getElementById("NMS_BLOCK.max_output_size");
	var iouThresholdInput = document.getElementById("NMS_BLOCK.iou_threshold");
	var scoreThredholdInput = document.getElementById("NMS_BLOCK.score_threshold");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	maxOuputSizeInput.value = gNode.nodeParams.params.max_output_size;
	iouThresholdInput.value = gNode.nodeParams.params.iou_threshold;
	scoreThredholdInput.value = gNode.nodeParams.params.score_threshold;
}

export function onNMSLayerChange(id, value) {
	switch (id) {
		case "NMS_BLOCK.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "NMS_BLOCK.color":
		gNode.color = value;
		break;

		case "NMS_BLOCK.max_output_size":
		gNode.nodeParams.params.max_output_size = parseInt(value);
		break;

		case "NMS_BLOCK.iou_threshold":
		gNode.nodeParams.params.iou_threshold = parseFloat(value);
		break;

		case "NMS_BLOCK.score_threshold":
		gNode.nodeParams.params.score_threshold = parseFloat(value);
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onRFEBlockSelected() {
	var rectInput = document.getElementById("RFE_BLOCK.rect");
	var colorInput = document.getElementById("RFE_BLOCK.color");
	var nameInput = document.getElementById("RFE_BLOCK.name");
	var useBiasInput = document.getElementById("RFE_BLOCK.use_bias");
	var trainableInput = document.getElementById("RFE_BLOCK.trainable");
	var bnTrainableInput = document.getElementById("RFE_BLOCK.bn_trainable");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	nameInput.value = gNode.nodeParams.params.name;
	useBiasInput.value = gNode.nodeParams.params.use_bias;
	trainableInput.value = gNode.nodeParams.params.trainable;
	bnTrainableInput.value = gNode.nodeParams.params.bn_trainable;
}

export function onRFEBlockChange(id, value) {
	switch (id) {
		case "RFE_BLOCK.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "RFE_BLOCK.color":
		gNode.color = value;
		break;

		case "RFE_BLOCK.name":
		gNode.nodeParams.params.name = value;
		break;

		case "RFE_BLOCK.use_bias":
		gNode.nodeParams.params.use_bias = parseInt(value);
		break;

		case "RFE_BLOCK.trainable":
		gNode.nodeParams.params.trainable = parseInt(value);
		break;

		case "RFE_BLOCK.bn_trainable":
		gNode.nodeParams.params.repeat = parseInt(bn_trainable);
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onHourglassBlockSelected() {
	var rectInput = document.getElementById("HOURGLASS_BLOCK.rect");
	var colorInput = document.getElementById("HOURGLASS_BLOCK.color");
	var nameInput = document.getElementById("HOURGLASS_BLOCK.name");
	var depthInput = document.getElementById("HOURGLASS_BLOCK.depth");
	var useBiasInput = document.getElementById("HOURGLASS_BLOCK.use_bias");
	var trainableInput = document.getElementById("HOURGLASS_BLOCK.trainable");
	var bnTrainableInput = document.getElementById("HOURGLASS_BLOCK.bn_trainable");
	var repeatInput = document.getElementById("HOURGLASS_BLOCK.repeat");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	nameInput.value = gNode.nodeParams.params.name;
	depthInput.value = gNode.nodeParams.params.depth;
	useBiasInput.value = gNode.nodeParams.params.use_bias;
	trainableInput.value = gNode.nodeParams.params.trainable;
	bnTrainableInput.value = gNode.nodeParams.params.bn_trainable;
	repeatInput.value = gNode.nodeParams.params.repeat;
}

export function onHourglassBlockChange(id, value) {
	switch (id) {
		case "HOURGLASS_BLOCK.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "HOURGLASS_BLOCK.color":
		gNode.color = value;
		break;

		case "HOURGLASS_BLOCK.name":
		gNode.nodeParams.params.name = value;
		break;

		case "HOURGLASS_BLOCK.depth":
		gNode.nodeParams.params.depth = parseInt(value);
		break;

		case "HOURGLASS_BLOCK.use_bias":
		gNode.nodeParams.params.use_bias = parseInt(value);
		break;

		case "HOURGLASS_BLOCK.bn_trainable":
		gNode.nodeParams.params.bn_trainable = parseInt(value);
		break;

		case "HOURGLASS_BLOCK.repeat":
		gNode.nodeParams.params.repeat = parseInt(value);
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onODLossFuncSelected() {
	var rectInput = document.getElementById("LOSS_FUNC_OD4.rect");
	var colorInput = document.getElementById("LOSS_FUNC_OD4.color");
	var nameInput = document.getElementById("LOSS_FUNC_OD4.name");
	var totalClassesInput = document.getElementById("LOSS_FUNC_OD4.total_classes");
	var lamdaInput = document.getElementById("LOSS_FUNC_OD4.lamda");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	nameInput.value = gNode.nodeParams.params.name;
	totalClassesInput.value = gNode.nodeParams.params.total_classes;
	lamdaInput.value = gNode.nodeParams.params.lamda;
}

export function onODLossFuncChange(id, value) {
	switch (id) {
		case "LOSS_FUNC_OD4.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "LOSS_FUNC_OD4.color":
		gNode.color = value;
		break;

		case "LOSS_FUNC_OD4.name":
		gNode.nodeParams.params.name = value;
		break;

		case "LOSS_FUNC_OD4.total_classes":
		gNode.nodeParams.params.total_classes = parseInt(value);
		break;

		case "LOSS_FUNC_OD4.lamda":
		gNode.nodeParams.params.lamda = parseFloat(value);
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onICLossFuncSelected() {
	var rectInput = document.getElementById("LOSS_FUNC_IC.rect");
	var colorInput = document.getElementById("LOSS_FUNC_IC.color");
	var nameInput = document.getElementById("LOSS_FUNC_IC.name");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	nameInput.value = gNode.nodeParams.params.name;
}

export function onICLossFuncChange(id, value) {
	switch (id) {
		case "LOSS_FUNC_IC.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "LOSS_FUNC_IC.color":
		gNode.color = value;
		break;

		case "LOSS_FUNC_IC.name":
		gNode.nodeParams.params.name = value;
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

export function onHMRLossFuncSelected() {
	var rectInput = document.getElementById("LOSS_FUNC_HMR.rect");
	var colorInput = document.getElementById("LOSS_FUNC_HMR.color");
	var nameInput = document.getElementById("LOSS_FUNC_HMR.name");

	rectInput.value = JSON.stringify(gNode.rect);
	colorInput.value = gNode.color;
	nameInput.value = gNode.nodeParams.params.name;
}

export function onHMRLossFuncChange(id, value) {
	switch (id) {
		case "LOSS_FUNC_HMR.rect":
		gNode.rect = JSON_parse(value);
		break;

		case "LOSS_FUNC_HMR.color":
		gNode.color = value;
		break;

		case "LOSS_FUNC_HMR.name":
		gNode.nodeParams.params.name = value;
		break;
		
		default:
		break;
	}

	dlt.gCommander.onNodeUpdated(gNode);
}

dlt.gNotification.onClear = function(node) {
	var settingsForms = document.getElementsByClassName("settings-form");
	for (var i = 0; i < settingsForms.length; i++) {
		settingsForms[i].style.display = "none";
	}
};

dlt.gNotification.onNodeSelected = function(node) {
	dlt.gNotification.onClear();
	gNode = node;
	console.log(gNode.nodeParams.params.shape);
	document.getElementById(gNode.nodeParams.blockType).style.display = "block";

	switch (gNode.nodeParams.blockType) {
		case "IMAGE_CLASSIFICATION_DATAGEN":
		onImageClassificationDatagenSelected();
		break;

		case "HEATMAP_REGRESSION_DATAGEN":
		onHeatmapRegressionDatagenSelected();
		break;

		case "OBJECT_DETECTION_DATAGEN":
		onObjectDetectionDatagenSelected();
		break;

		case "INPUT_LAYER":
		onInputLayerSelected();
		break;

		case "DENSE_LAYER":
		onDenseLayerSelected();
		break;

		case "CONV2D_LAYER":
		onConv2DLayerSelected();
		break;

		case "MAXPOOL2D_LAYER":
		onMaxPool2DLayerSelected();
		break;

		case "UPSAMPLING2D_LAYER":
		onUpSampling2DLayerSelected();
		break;

		case "BATCH_NORM_LAYER":
		onBatchNormLayerSelected();
		break;

		case "DROPOUT_LAYER":
		onDropoutLayerSelected();
		break;

		case "ACTIVATION_LAYER":
		onActivationLayerSelected();
		break;

		case "FLATTEN_LAYER":
		onFlattenLayerSelected();
		break;

		case "ADD_LAYER":
		onAddLayerSelected();
		break;

		case "CONCAT_LAYER":
		onConcatLayerSelected();
		break;

		case "SPLIT_LAYER":
		onSplitLayerSelected();
		break;

		case "SPLITTED_LAYER":
		onSplittedLayerSelected();
		break;

		case "RESHAPE_LAYER":
		onReshapeLayerSelected();
		break;

		case "CAST_LAYER":
		onCastLayerSelected();
		break;

		case "CONV2D_BLOCK":
		onConv2DBlockSelected();
		break;

		case "NMS_BLOCK":
		onNMSLayerSelected();
		break;

		case "RESNET_IDENTITY_BLOCK":
		onResnetIdentityBlockSelected();
		break;

		case "RESNET_SIDENTITY_BLOCK":
		onResnetSIdentityBlockSelected();
		break;

		case "RFE_BLOCK":
		onRFEBlockSelected();
		break;

		case "HOURGLASS_BLOCK":
		onHourglassBlockSelected();
		break;

		case "LOSS_FUNC_OD4":
		onODLossFuncSelected();
		break;

		case "LOSS_FUNC_IC":
		onICLossFuncSelected();
		break;

		case "LOSS_FUNC_HMR":
		onHMRLossFuncSelected();
		break;

		default:
		break;
	}
};

dlt.gNotification.onError = function(errors) {
	var errorMessages = "";
	for (var i = 0; i < errors.length; i++) {
		var error = errors[i];
		errorMessages += "<li>" + error + "</li>";
	}

	var errorsUl = document.getElementById("errorValidation");
	errorsUl.innerHTML = errorMessages;
};

function JSON_parse(value) {
	var parsed = null;
	try { parsed = JSON.parse(value); }
	catch (err) {}
	return parsed;
}

function download(filename, text) {
	var pom = document.createElement('a');
	pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	pom.setAttribute('download', filename);

	if (document.createEvent) {
		var event = document.createEvent('MouseEvents');
		event.initEvent('click', true, true);
		pom.dispatchEvent(event);
	}
	else {
		pom.click();
	}
}

export function save(name, callback) {
	var model = undefined;
	try { model = JSON.parse(localStorage.getItem('MODEL')); }
	catch (e) {}
	if (!model) {
		localStorage.setItem('REDIRECT_URL', '/dlt');
		location.href = '/sign-in';
		return;
	}

	var screenshot = dlt.gCommander.exportDLT();
	var jBdyStr = JSON.stringify({
		name: name,
		screenshot: screenshot,
	});
	var http = new XMLHttpRequest();
	http.open('PATCH', 'https://ai-designer.io/api/aimodel/update?id='+model._id, true);
	http.setRequestHeader('Content-type', 'application/json');
	http.setRequestHeader('Authorization', localStorage.getItem('TOKEN'));
	http.onreadystatechange = function() {
		if(http.readyState == 4) {
			if (http.status == 401) {
				localStorage.setItem('REDIRECT_URL', '/dlt');
				location.href = '/sign-in';
				return;
			}

			var msg = JSON.parse(http.responseText);
			if (msg.msgCode == 1000) {
				model.name = name;
				model.screenshot = screenshot;
				localStorage.setItem('MODEL', JSON.stringify(model));
				
				callback();
			}
		}
	}
	http.send(jBdyStr);
}

export function generateCode() {
	var errors = dlt.gCommander.validate();
	if (errors.length > 0) {
		return;
	}

	var model = undefined;
	try { model = JSON.parse(localStorage.getItem('MODEL')); }
	catch (e) {}
	if (!model) {
		localStorage.setItem('REDIRECT_URL', '/dlt');
		location.href = '/sign-in';
		return;
	}

	document.getElementById('loadingEffect').style.display = 'block';

	var jBdyStr = JSON.stringify({
		model: dlt.gCommander.exportModel(),
		screenshot: dlt.gCommander.exportDLT(),
	});
	var http = new XMLHttpRequest();
	http.open('PATCH', 'https://ai-designer.io/api/aimodel/update?id='+model._id, true);
	http.setRequestHeader('Content-type', 'application/json');
	http.setRequestHeader('Authorization', localStorage.getItem('TOKEN'));
	http.onreadystatechange = function() {
		if(http.readyState == 4) {
			if (http.status == 401) {
				localStorage.setItem('REDIRECT_URL', '/dlt');
				location.href = '/sign-in';
				return;
			}

			var msg1 = JSON.parse(http.responseText);
			if (msg1.msgCode == 1000) {
				var jBdyStr = JSON.stringify({
					aiModelId: model._id,
				});
				http.open('POST', 'https://ai-designer.io/api/codegen/generate', true);
				http.setRequestHeader('Content-type', 'application/json');
				http.setRequestHeader('Authorization', localStorage.getItem('TOKEN'));
				http.onreadystatechange = function() {
					if(http.readyState == 4) {
						if (http.status == 401) {
							location.href = '/sign-in';
							return;
						}

						var msg2 = JSON.parse(http.responseText);
						if (msg2.msgCode == 1000) {
							document.getElementById('loadingEffect').style.display = 'none';
							var tab2 = window.open('about:blank');
							tab2.location = msg2.msgResp.colabUrl;
						}
					}
				}
				http.send(jBdyStr);
			}
		}
	}
	http.send(jBdyStr);
}

export function exportFile() {
	download('screenshot_'+(new Date()).toISOString()+'.json', dlt.gCommander.exportDLT());
}

export function importFile() {
	var inputElement = document.createElement("input");
	inputElement.type = "file";
	inputElement.accept = ".json,text/plain,application/json";
	inputElement.addEventListener("change", function(e) {
		var files = e.target.files;
		var file = files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			var snapshotJson = e.target.result;
			dlt.gCommander.importDLT(snapshotJson);
		};
		reader.readAsText(file);
	});
	inputElement.dispatchEvent(new MouseEvent("click")); 
}