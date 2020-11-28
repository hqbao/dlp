import {UIRender} from './UIRender.js';
import {UINodeManager} from './UINodeManager.js';

class UIApp {
	constructor(canvas, extEventMap, height, width) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.extEventMap = extEventMap;
		this.height = height;
		this.width = width;
		this.movingUnit = 8;

		this.response = {
			startPosition: undefined,
			which: undefined,
			moved: undefined,
			ctrtKey: undefined,
			shiftKey: undefined,
			currentPosition: undefined,
			entity: undefined,
			anchorPoint: undefined,
		};

		this.render = new UIRender();

		this.nodeManager = new UINodeManager(
			this.render, 
			this.canvas, 
			this.context,
			this.extEventMap, 
			this.height, 
			this.width,
			this.movingUnit);

		this.refPosition = {y: 256, x: 256};
	}

	run() {
		var _context = this.context;
		var _height = this.height;
		var _width = this.width;

		function clear() {
			_context.beginPath();
			_context.clearRect(0, 0, _width, _height);
		}

		var render = this.render;
		function draw() {
			var entities = render.entities;
			for (var i = 0; i < entities.length; i++) {
				var entity = entities[i];
				if (entity.isHidden) { 
					continue; 
				}

				if (entity.type == 'IMAGE' && entity.image != null) {
					_context.drawImage(
						entity.image, 
						entity.x1, entity.y1, 
						entity.x2-entity.x1, entity.y2-entity.y1);
				}
				else if (entity.type == 'RECTANGLE' && entity.color != null) {
					if (entity.fill == false) {
						_context.lineWidth = entity.lineWidth;
						_context.strokeStyle = entity.color;
						_context.strokeRect(entity.x1, entity.y1,
							entity.x2-entity.x1, entity.y2-entity.y1);
					}
					else {
						_context.fillStyle = entity.color;
						_context.fillRect(entity.x1, entity.y1,
							entity.x2-entity.x1, entity.y2-entity.y1);
					}
				}
				else if (entity.type == 'PATH' && entity.color != null) {
					_context.beginPath();
					_context.strokeStyle = entity.color;
					_context.moveTo(entity.x1, entity.y1);
					_context.lineTo(entity.x2, entity.y2);
					_context.lineWidth = entity.lineWidth;
					_context.stroke();
				}
			}
		}

		(function loop() {
			clear();
			draw();
			setTimeout(loop, 20);
		}());
	}
}

export {UIApp};
