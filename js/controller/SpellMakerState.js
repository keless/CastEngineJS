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
		btnBack.pos.setVal(gfx.getWidth()/2, 50);

		this.rootView.addChild(btnBack);
		
		
		this.m_spellPageList = new SpellPageList();
		this.rootView.addChild(this.m_spellPageList);
		
		this.m_spellDiagram = new SpellDiagramNode();
		this.m_spellDiagram.pos.setVal( gfx.getWidth(), gfx.getHeight() );
		this.rootView.addChild(this.m_spellDiagram);
		
		this.m_spellDescription = new SpellDescriptionView();
		this.rootView.addChild(this.m_spellDescription);
		
		this.SetListener("btnBack", this.onBtnBack);
		this.SetListener("pageSelected", this.onSpellPageSelected.bind(this));
		this.SetListener("saveSpell", this.onSpellSave.bind(this));
		this.SetListener("saveSpellNamed", this.onSpellSaveNamed.bind(this));
	}
	
	onSpellPageSelected() {
		//todo
	}
	
	onSpellSave() {
		//todo
	}
	
	onSpellSaveNamed() {
		//todo
	}
	
	onBtnBack() {
		var state = Service.Get("state");
		
		state.gotoState("menu");
	}
}

/*
#define NUM_SPELL_SCRIPTS 13
char* s_spellScriptNames[NUM_SPELL_SCRIPTS];
	s_spellScriptNames[0] = "01 Novice's Circle\n\
	1 effect(1)";
	s_spellScriptNames[1] = "02 Blind Eye\n\
	1 effect(2)\n\
	2 mods(2)";
	s_spellScriptNames[2] = "03 Adept's Circle\n\
	2 effects(2)\n\
	2 mods(3)";
	s_spellScriptNames[3] = "04 Lesser Pyramid\n\
	1 effect(3)\n\
	3 mods(2)";
	s_spellScriptNames[4] = "05 Serpent's Eye\n\
	2 effects(3)\n\
	2 mods(3)\n\
	2 mods(2)";
	s_spellScriptNames[5] = "06 Lesser Triquetra\n\
	4 effects(3)\n\
	3 mods(4)\n\
	3 mods(2)";
	s_spellScriptNames[6] = "07 Compass\n\
	4 effects(3)\n\
	1 mod(4)\n\
	4 mods(3)";
	s_spellScriptNames[7] = "08 Fortress\n\
	1 effect(4)\n\
	4 mods(2)";
	s_spellScriptNames[8] = "09 Dragon's Eye\n\
	2 effects(3)\n\
	1 effect(2)\n\
	2 mods(4)\n\
	2 mods(2)";
	s_spellScriptNames[9] = "10 Seeing Eye\n\
	3 effects(2)\n\
	2 mods(4)";
	s_spellScriptNames[10] = "11 Leaf\n\
	6 effects(3)\n\
	1 mod(5)\n\
	3 mods(4)\n\
	1 mod(3)\n\
	2 mods(2)";
	s_spellScriptNames[11] = "12 Greater Pyramid\n\
	1 effect(3)\n\
	3 effects(2)\n\
	3 mods(4)";
	s_spellScriptNames[12] = "13 Greater Triquetra\n\
	7 effects(3)\n\
	6 mods(4)";
*/

class SpellPageList extends NodeView {
	constructor() {
		super();
		this.m_spellNames = [];
		
		var spells = g_spellDiagrams["diagrams"];
		for(var i=0; i<spells.length; i++) {
			var pageName = "" + (i+1) + " " + spells[i]["name"] + "\n" + spells[i]["effects"].length + " effects";
			this.m_spellNames.push(pageName);
		}
		
		var gfx = Service.Get("gfx");
		var w = gfx.getWidth() / 5;
		var h = gfx.getHeight();
		this.setRect(w,h, "rgba(240,227,132,0.5)");
		this.pos.setVal(w/2, h/2);
		
		this.m_list = new TableView(w, h);
		for(var labelText of this.m_spellNames) {
			var node = new NodeView();
			node.setLabel(labelText, "12px Arial", "rgb(0,0,0)");
			node.setClick( this.createSpellCallback(labelText) );
			this.m_list.addCell(node);
		}
		this.addChild(this.m_list);
	}
	
	createSpellCallback(labelText) {
		return function() {
			console.log("clicked " + labelText);
		}
	}
}

class SpellDiagramNode extends NodeView {
	constructor() {
		super();
	}
}

class SpellDescriptionView extends NodeView {
	constructor() {
		super();
	}
}