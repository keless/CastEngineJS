"use strict"; //ES6

class MenuState extends AppState {
	constructor() { 
		super();
		this.view = new MenuStateView();
	}
}

class MenuStateView extends BaseStateView {
	constructor() {
		super();
		var RP = Service.Get("rp");
		var sprBtnBlue = RP.getSprite("gfx/btn_blue.sprite");
		this.rootView = new ButtonView("btnMain", sprBtnBlue, "Main");
		this.rootView.pos.setVal(150, 150);
		
		this.SetListener("btnMain", this.onBtnMain);
	}
	
	onBtnMain() {
		var state = Service.Get("state");
		
		state.gotoState("battle");
	}
}