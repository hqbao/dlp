import {UIRender} from './UIRender.js';
import {UINodeManager} from './UINodeManager.js';

class UIApp {
	constructor(canvas, notif, height, width) {
		this.canvas = canvas;
		this.context = canvas.getContext('2d');
		this.notif = notif;
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
			this.notif, 
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
						var radius = entity.radius ? entity.radius : {tl: 0, tr: 0, br: 0, bl: 0};
						_context.beginPath();
						_context.moveTo(entity.x1 + radius.tl, entity.y1);
						_context.lineTo(entity.x2 - radius.tr, entity.y1);
						_context.quadraticCurveTo(entity.x2, entity.y1, entity.x2, entity.y1 + radius.tr);
						_context.lineTo(entity.x2, entity.y2 - radius.br);
						_context.quadraticCurveTo(entity.x2, entity.y2, entity.x2 - radius.br, entity.y2);
						_context.lineTo(entity.x1 + radius.bl, entity.y2);
						_context.quadraticCurveTo(entity.x1, entity.y2, entity.x1, entity.y2 - radius.bl);
						_context.lineTo(entity.x1, entity.y1 + radius.tl);
						_context.quadraticCurveTo(entity.x1, entity.y1, entity.x1 + radius.tl, entity.y1);
						_context.closePath();
						_context.fillStyle = entity.color;
						_context.fill();

						if (entity.text) {
							var nameBox = {y1: entity.y1-8, x1: entity.x1-8, y2: entity.y1+20, x2: entity.x1+80};
							_context.beginPath();
							_context.moveTo(nameBox.x1 + radius.tl, nameBox.y1);
							_context.lineTo(nameBox.x2 - radius.tr, nameBox.y1);
							_context.quadraticCurveTo(nameBox.x2, nameBox.y1, nameBox.x2, nameBox.y1 + radius.tr);
							_context.lineTo(nameBox.x2, nameBox.y2 - radius.br);
							_context.quadraticCurveTo(nameBox.x2, nameBox.y2, nameBox.x2 - radius.br, nameBox.y2);
							_context.lineTo(nameBox.x1 + radius.bl, nameBox.y2);
							_context.quadraticCurveTo(nameBox.x1, nameBox.y2, nameBox.x1, nameBox.y2 - radius.bl);
							_context.lineTo(nameBox.x1, nameBox.y1 + radius.tl);
							_context.quadraticCurveTo(nameBox.x1, nameBox.y1, nameBox.x1 + radius.tl, nameBox.y1);
							_context.closePath();
							_context.fillStyle = '#000000';
							_context.fill();
							_context.lineWidth = 2;
							_context.strokeStyle = '#ffff00';
							_context.stroke();

							_context.font = '11px Arial';
							_context.fillStyle = '#ffffff';
							_context.fillText(entity.text, entity.x1, entity.y1+10);
						}
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
