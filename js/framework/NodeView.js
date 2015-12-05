"use strict"; //ES6
//#include js/framework/Graphics.js

//scene node heirarchy of sprites/animations

class NodeView extends BaseListener {
	constructor( ) {
		super();
		this.pos = new Vec2D();
		this.size = new Vec2D();
		this.rotation = 0;

		this.children = [];
		this.parent = null;

		this.fnCustomDraw = [];
		
		this.fnOnClick = null;
		this.onClickCallChildren = true;
	}
	
	Destroy() {
		//override me to clean up
		for(var child of this.children) {
			child.Destroy();
		}
		
		super.Destroy();
	}
	
	get worldRotation() {
		if(this.parent) {
			return this.parent.worldRotation + this.rotation;
		}
		return this.rotation;
	}
	
	setCircle( radius ) {
		if(this.circleRadius) {
			console.error("NodeView: already has a circle, abort!");
			return;
		}
		this.circleRadius = radius;
		var self = this;
		this.fnCustomDraw.push(function(gfx, x,y, ct){
			gfx.drawCircle(x, y, self.circleRadius);
		});
	}
	setRect( w, h, fillStyle ) {
		this.size.setVal( Math.max(this.size.x, w), Math.max(this.size.y, h));
		//var self = this;
		this.fnCustomDraw.push(function(gfx, x,y, ct){
			gfx.drawRectEx(x, y, w, h, fillStyle);
		});
	}
	setPolygon( arrVerts, fill, strokeSize, outline ) {
		this.fnCustomDraw.push(function(gfx,x,y,ct) {
			gfx.drawPolygonEx(arrVerts, fill, outline, strokeSize);
		});
	}
	setImage( image ) {
		if( isString(image) ) {
			var RP = Service.Get("rp");
			image = RP.getImage(image); //load image url into image resource
		}
		
		if(this.image) {
			console.error("NodeView: already has an image, abort!");
			return;
		}
		this.image = image;
		this.size.setVal( Math.max(this.size.x, image.width), Math.max(this.size.y, image.height));
		
		var self = this;
		this.fnCustomDraw.push(function(gfx, x,y, ct){
			gfx.drawImage(self.image, x, y);
		});
	}
	setImageStretch( image, x,y, w,h ) {
		if( isString(image) ) {
			var RP = Service.Get("rp");
			image = RP.getImage(image); //load image url into image resource
		}
		
		if(this.image) {
			console.error("NodeView: already has an image, abort!");
			return;
		}
		this.image = image;
		this.size.setVal( Math.max(this.size.x, image.width), Math.max(this.size.y, image.height));
		
		var self = this;
		this.fnCustomDraw.push(function(gfx, x,y, ct){
			gfx.drawImageEx(self.image, x, y, w, h);
		});
	}
	setSprite( sprite, spriteFrame, hFlip ) {		
		hFlip = hFlip || false;
		
		if( isString(sprite) ) {
			var RP = Service.Get("rp");
			sprite = RP.getSprite(sprite); //load sprite url into sprite resource
		}
		
		if(this.sprite) {
			console.error("NodeView: already has a sprite, abort!");
			return;
		}
		this.sprite = sprite;
		this.spriteFrame = spriteFrame;
		this.hFlip = hFlip;
		this.size.setVal( Math.max(this.size.x, sprite.getWidth()), Math.max(this.size.y, sprite.getHeight()));
		var self = this;
		this.fnCustomDraw.push(function(gfx, x,y, ct){
			self.sprite.drawFrame(gfx, x, y, self.spriteFrame, self.hFlip);
		});
	}
	setAnim( anim ) {
		if(this.animInstance) {
			console.error("NodeView: already has an anim, abort!");
			return;			
		}
		this.animInstance = new AnimationInstance( anim );
		var self = this;
		this.fnCustomDraw.push(function(gfx, x,y, ct){
			self.animInstance.update(ct);
			self.animInstance.Draw(gfx, x, y, self.hFlip);
		});

		//thin wrappers for AnimationInstance
		this.animEvent = function( ct, evt ) {
			this.animInstance.event(ct, evt);
		}
		this.startAnim = function(ct, animState) {
			this.animInstance.startAnim(ct, animState);
		}
	}
	setLabel( labelText, labelFont, labelStyle ) {
		if(this.labelText) {
			console.error("NodeView: already has a label, abort!");
			return;	
		}
		this.labelText = labelText;
		this.labelFont = labelFont;
		this.labelStyle = labelStyle;
		var gfx = Service.Get("gfx");
		var textSize = gfx.getTextSize(this.labelText, this.labelFont);
		this.size.setVal( Math.max(this.size.x, textSize.x), Math.max(this.size.y, textSize.y));
		var self = this;
		this.fnCustomDraw.push(function(gfx, x,y, ct){
			gfx.drawTextEx(self.labelText, x, y, self.labelFont, self.labelStyle);
		});
	}
	updateLabel( labelText ) {
		if(!this.labelText) {
			console.error("NodeView: cant update label, dont have one!");
			return;	
		}
		this.labelText = labelText;
	}
	updateLabelStyle( style ) {
		this.labelStyle = style;
	}
	
	///fn(gfx, x,y, ct)
	addCustomDraw( fn ) {
		this.fnCustomDraw.push(fn);
	}
	
	setClick( fn, shouldCallChildren ) {
		this.onClickCallChildren = shouldCallChildren || (fn?false:true);
		this.fnOnClick = fn;
	}
	
	//x,y should be sent relative to node origin
	OnMouseDown(e, x,y) {
		
		//make local to self origin
		x -= this.pos.x;
		y -= this.pos.y;
		//rotate
		if(this.rotation != 0) {
			var v = new Vec2D(x,y);
			v.rotate(-this.rotation);
			x = v.x;
			y = v.y;
		}

		if( this.fnOnClick ) {
			var originX = 0;
			var originY = 0;
			if( Config.areSpritesCentered ) {
				originX -= this.size.x/2;
				originY -= this.size.y/2;
			}
			if(Rect2D.isPointInArea(x, y, originX, originY, this.size.x, this.size.y)) {
				this.fnOnClick(e, x, y);
			}
		}
		
		if( this.onClickCallChildren ) {
			for(var child of this.children) {
				child.OnMouseDown(e, x, y);
			}
		}
	}
	
	getWidth() {
		return this.size.x;
	}
	getHeight() {
		return this.size.y;
	}
	
	//node heirarchy functions
	addChild( child ) {
		child.removeFromParent();
		
		this.children.push(child);
		child.parent = this;
	}
	removeFromParent(shouldDestroy) {
		shouldDestroy = shouldDestroy || false;
		if(!this.parent) return;
		this.parent.removeChild(this, shouldDestroy);
		this.parent = null;
	}
	
	removeChild(child, shouldDestroy) {
		shouldDestroy = shouldDestroy || false;
		var childIdx = this.children.indexOf(child);
		this.removeChildByIdx(childIdx, shouldDestroy);
	}
	removeChildByIdx( childIdx, shouldDestroy ) {
		shouldDestroy = shouldDestroy || false;
		if(childIdx < 0) return;
		var child = this.children.splice(childIdx, 1)[0];
		if(child.parent === this) child.parent = null;
		if(shouldDestroy) child.Destroy();
	}
	removeAllChildren( shouldDestroy ) { 
		shouldDestroy = shouldDestroy || false;
		for( var i=(this.children.length-1); i >= 0; i--) {
			var child = this.children[i];
			this.removeChild(child, shouldDestroy);
		}
	}
	//TODO: support string path lookup

	//draw function
	Draw( gfx, x, y, ct ) {
		
		gfx.saveMatrix();
		gfx.translate(x + this.pos.x, y + this.pos.y);

		if(this.rotation != 0) {
			gfx.rotate(this.rotation);
		}
		
		for(var f of this.fnCustomDraw) {
			f(gfx, 0,0, ct);
		}
		
		for(var child of this.children) {
			//note: dont subtract this.pos, since we're using gfx.translate
			child.Draw(gfx, 0, 0, ct);
		}

		gfx.restoreMatrix();
	}
}