"use strict"; //ES6

class TableView extends NodeView {
	static get VERTICAL() { return 0; }
	static get HORIZONTAL() { return 1; }
	
	constructor( w, h ) {
		super();
		
		this.m_cells = [];
		this.m_scrollOffsetX = 0;
		this.m_scrollOffsetY = 0;
		
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
				this.m_cells[i].OnMouseDown(e, x, (y - (this.size.y/4) + off));
				off += this.m_cells[i].getHeight();
			}
		} else {
			for( var i=0; i<this.m_cells.length; i++) {
				this.m_cells[i].OnMouseDown(e, (x + off), y - (this.size.y/4));
				off += this.m_cells[i].getWidth();
			}
		}
		
		
		for(var child of this.m_cells) {
			child.OnMouseDown(e, x, y);
		}
	}
	
	Draw( gfx, x, y, ct ) {
		x -= this.m_scrollOffsetX;
		y -= this.m_scrollOffsetY;
		
		var off = 0;
		if( this.direction == TableView.VERTICAL ) {
			for( var i=0; i<this.m_cells.length; i++) {
				this.m_cells[i].Draw(gfx, x, (y - (this.size.y/4) + off), ct);
				off += this.m_cells[i].getHeight();
			}
		} else {
			for( var i=0; i<this.m_cells.length; i++) {
				this.m_cells[i].Draw(gfx, (x + off), y - (this.size.y/4), ct);
				off += this.m_cells[i].getWidth();
			}
		}
	}
}