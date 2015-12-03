"use strict"; //ES6

class TableView extends NodeView {
	static get VERTICAL() { return 0; }
	static get HORIZONTAL() { return 1; }
	
	constructor( w, h ) {
		super();
		
		this.m_cells = [];
		this.m_scrollOffsetX = 0;
		this.m_scrollOffsetY = 0;
		this.padding = 5;
		
		this.size.setVal(w,h);
		
		this.direction = TableView.VERTICAL;
	}
	
	Destroy() {
		
	}
	
	addCell( cell ) {
		this.m_cells.push(cell);
	}
	
	removeCellAtIndex( idx ) { 
		this.m_cells = this.m_cells.splice(idx, 1);
	}
	
	//x,y should be sent relative to node origin
	OnMouseDown(e, x,y) {

		//make local to self origin
		x -= this.pos.x;
		y -= this.pos.y;
		x -= this.m_scrollOffsetX;
		y -= this.m_scrollOffsetY;	

		var off = 0;
		if( this.direction == TableView.VERTICAL ) {
			for( var i=0; i<this.m_cells.length; i++) {
				
				this.m_cells[i].OnMouseDown(e, x, (y - off));
				off += this.m_cells[i].getHeight() + this.padding;
			}
		} else {
			for( var i=0; i<this.m_cells.length; i++) {
				this.m_cells[i].OnMouseDown(e, (x - off), y);
				off += this.m_cells[i].getWidth() + this.padding;
			}
		}
	}
	
	Draw( gfx, x, y, ct ) {
		
		gfx.saveMatrix();
		gfx.translate(x + this.pos.x, y + this.pos.y);
		
		x -= this.m_scrollOffsetX;
		y -= this.m_scrollOffsetY;
		
		var off = 0;
		if( this.direction == TableView.VERTICAL ) {
			for( var i=0; i<this.m_cells.length; i++) {
				this.m_cells[i].Draw(gfx, 0, off, ct);
				off += this.m_cells[i].getHeight() + this.padding;
			}
		} else {
			for( var i=0; i<this.m_cells.length; i++) {
				this.m_cells[i].Draw(gfx, off, 0, ct);
				off += this.m_cells[i].getWidth() + this.padding;
			}
		}
		
		for(var child of this.children) {
			//note: dont subtract this.pos, since we're using gfx.translate
			child.Draw(gfx, 0, 0, ct);
		}
		
		gfx.restoreMatrix();
	}
}