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
		
		var btnMain = new ButtonView("btnMain", sprBtnBlue, "Main");
		btnMain.pos.setVal(150, 150);
		this.rootView.addChild(btnMain);
		
		var btnSpell = new ButtonView("btnSpellMaker", sprBtnBlue, "Spell Maker");
		btnSpell.pos.setVal(150, 300);
		this.rootView.addChild(btnSpell);
		
		this.SetListener("btnMain", this.onBtnMain);
		this.SetListener("btnSpellMaker", this.onBtnSpellMaker);
	}
	
	onBtnMain() {
		Service.Get("state").gotoState("battle");
	}
	onBtnSpellMaker() {
		Service.Get("state").gotoState("spellMaker");
	}
}