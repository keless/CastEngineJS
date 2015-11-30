"use strict"; //ES6

class SpellMakerState extends AppState {
	constructor() { 
		super();
		this.view = new SpellMakerView();
	}
}

class SpellMakerView extends BaseStateView {
	constructor() {
		super();

		var gfx = Service.Get("gfx");
		this.rootView.setImageStretch("gfx/workbench3.png", 0,0, gfx.getWidth(), gfx.getHeight());

		var btnBack =  new ButtonView("btnBack", "gfx/btn_blue.sprite", "back");
		btnBack.pos.setVal(150, 150);

		this.rootView.addChild(btnBack);
		
		this.SetListener("btnBack", this.onBtnBack);
	}
	
	onBtnBack() {
		var state = Service.Get("state");
		
		state.gotoState("menu");
	}
}