import os
os.system('pip install dlp')
import tensorflow as tf
import numpy as np
import dlp.blocks as blocks
import dlp.utils as utils

def build_model():
	tensorNone = None
	tensor15 = None
	tensor1 = blocks.INPUT_LAYER(input_tensor=tensorNone, batch_size=1, input_shape=[512, 512, 3], dtype='float32')
	tensor2 = blocks.CONV2D_BLOCK(input_tensor=tensor1, filters=16, kernel_size=[3, 3], strides=[2, 2], padding='same', use_bias=1, trainable=1, bn_trainable=1, activation='relu', name='CONV2D_BLOCK0')
	tensor3 = blocks.MAXPOOL2D_LAYER(input_tensor=tensor2, pool_size=[3, 3], strides=[2, 2], padding='same')
	tensor4 = blocks.RESNET_SIDENTITY_BLOCK(input_tensor=tensor3, filters=[16, 16, 64], kernel_size=[3, 3], strides=[1, 1], use_bias=1, trainable=1, bn_trainable=1, name='RESNET_SIDENTITY_BLOCK0')
	tensor5 = blocks.RESNET_IDENTITY_BLOCK(input_tensor=tensor4, filters=[16, 16, 64], kernel_size=[3, 3], use_bias=1, trainable=1, bn_trainable=1, repeat=4, name='RESNET_IDENTITY_BLOCK0')
	tensor6 = blocks.RESNET_SIDENTITY_BLOCK(input_tensor=tensor5, filters=[32, 32, 128], kernel_size=[3, 3], strides=[2, 2], use_bias=1, trainable=1, bn_trainable=1, name='RESNET_SIDENTITY_BLOCK1')
	tensor7 = blocks.RESNET_IDENTITY_BLOCK(input_tensor=tensor6, filters=[32, 32, 128], kernel_size=[3, 3], use_bias=1, trainable=1, bn_trainable=1, repeat=4, name='RESNET_IDENTITY_BLOCK1')
	tensor8 = blocks.CONV2D_BLOCK(input_tensor=tensor7, filters=32, kernel_size=[3, 3], strides=[1, 1], padding='same', use_bias=1, trainable=1, bn_trainable=1, activation='relu', name='CONV2D_BLOCK1')
	tensor9 = blocks.CONV2D_LAYER(input_tensor=tensor8, name='CONV2D_LAYER0', filters=6, kernel_size=[3, 3], strides=[1, 1], padding='same', use_bias=1, trainable=1)
	tensor10 = blocks.RESHAPE_LAYER(input_tensor=tensor9, new_shape=[-1, 6])
	tensor11 = blocks.SPLIT_LAYER(input_tensor=tensor10, axis=-1, size_splits=[2, 4])
	tensor12 = blocks.SPLITTED_LAYER(input_tensor=tensor11, order=0)
	tensor14 = blocks.ACTIVATION_LAYER(input_tensor=tensor12, activation='linear')
	tensor15 = blocks.CONCAT_LAYER(tensor1=tensor15, tensor2=tensor14, axis=-1)
	tensor13 = blocks.SPLITTED_LAYER(input_tensor=tensor11, order=1)
	tensor15 = blocks.CONCAT_LAYER(tensor1=tensor15, tensor2=tensor13, axis=-1)
	loss_func16 = blocks.LOSS_FUNC_OD4(input_tensor=tensor15, name='SSD', total_classes=1, lamda=1)
	model = tf.keras.models.Model(inputs=tensor1, outputs=tensor15)
	model.compile(optimizer=tf.keras.optimizers.Adam(), loss=loss_func16)
	return model

def train(dataset_name, image_shape, scale_sizes, anchor_sizes, iou_thresholds, anchor_sampling, epochs):
	dataset_info = utils.get_dataset_info(dataset_name)
	output_path = './outputs'
	train_anno_file_path = dataset_info['train_anno_file_path']
	train_image_dir_path = dataset_info['train_image_dir_path']
	ishape = image_shape
	ssize = scale_sizes
	asizes = anchor_sizes
	total_classes = dataset_info['total_classes']
	total_epoches = epochs
	total_train_examples = dataset_info['total_train_examples']

	abox_2dtensor = tf.constant(value=utils.genanchors(isize=ishape[:2], ssize=ssize, asizes=asizes), dtype='float32') # (h*w*k, 4)

	model = build_model()
	model.summary()

	if not os.path.exists(output_path):
		os.makedirs(output_path)

	weight_file_path = output_path+'/weights_'+dataset_name+'.h5'
	if os.path.isdir(weight_file_path):
		model.load_weights(weight_file_path, by_name=True)

	train_dataset = utils.load_object_detection_dataset(anno_file_path=train_anno_file_path, total_classes=total_classes)

	for epoch in range(total_epoches):
		gen = utils.genxy_od(
			dataset=train_dataset, 
			image_dir=train_image_dir_path, 
			ishape=ishape, 
			abox_2dtensor=abox_2dtensor, 
			iou_thresholds=iou_thresholds, 
			total_examples=total_train_examples,
			total_classes=total_classes, 
			anchor_sampling=anchor_sampling)

		print('\nTrain epoch {}'.format(epoch))
		loss = np.zeros(total_train_examples)

		for batch in range(total_train_examples):
			batchx_4dtensor, batchy_2dtensor, _ = next(gen)
			batch_loss = model.train_on_batch(batchx_4dtensor, batchy_2dtensor)
			loss[batch] = batch_loss

			print('-', end='')
			if batch%100==99:
				print('{:.2f}%'.format((batch+1)*100/total_train_examples), end='\n')

		mean_loss = float(np.mean(loss, axis=-1))
		print('\nLoss: {:.3f}'.format(mean_loss))

		model.save_weights(weight_file_path)

train(dataset_name="face1024", image_shape=[512, 512, 3], scale_sizes=[64, 64], anchor_sizes=[[32, 32]], iou_thresholds=[0.3, 0.5], anchor_sampling=100, epochs=1000)

