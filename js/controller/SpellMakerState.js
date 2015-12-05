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
		this.m_spellDiagram.pos.setVal( gfx.getWidth()/2, gfx.getHeight()/2 );
		this.rootView.addChild(this.m_spellDiagram);
		
		this.m_spellDescription = new SpellDescriptionView();
		this.rootView.addChild(this.m_spellDescription);
		
		this.SetListener("btnBack", this.onBtnBack);
		this.SetListener("pageSelected", this.onSpellPageSelected.bind(this));
		this.SetListener("saveSpell", this.onSpellSave.bind(this));
		this.SetListener("saveSpellNamed", this.onSpellSaveNamed.bind(this));
	}
	
	onSpellPageSelected(e) {
		this.m_spellDiagram.setDiagram( e.idx || SD_INVALID );
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
		
		for(var i=0; i< this.m_spellNames.length; i++) {
			var labelText = this.m_spellNames[i];
			var node = new NodeView();
			node.setLabel(labelText, "12px Arial", "rgb(0,0,0)");
			node.setClick( this.createSpellCallback(labelText, i) );
			this.m_list.addCell(node);
		}
		this.addChild(this.m_list);
	}
	
	createSpellCallback(labelText, idx) {
		return function() {
			EventBus.ui.dispatch({evtName:"pageSelected", idx: idx });
			console.log("clicked " + labelText);
		}
	}
}


var SD_01_NOVICE_CIRCLE = 0;
var SD_02_BLIND_EYE = 1;
var SD_03_ADEPTS_CIRCLE = 2;
var SD_04_LESSER_PYRAMID = 3;
var SD_05_SERPENTS_EYE = 4;
var SD_06_LESSER_TRIQUESTRA = 5;
var SD_07_COMPASS = 6;
var SD_08_FORTRESS = 7;
var SD_09_DRAGONS_EYE = 8;
var SD_10_SEEING_EYE = 9;
var SD_11_LEAF = 10;
var SD_12_GREATER_PYRAMID = 11;
var SD_13_GREATER_TRIQUETRA = 12;
var SD_COUNT = 13;
var SD_INVALID = -1

var MOD_COLOR = "rgba(0,1,0,1)";
var EFF_COLOR = "rgba(1,0,0,1)";

var DSIZE = 400;

//triangle
var tA = new Vec2D(0, DSIZE*0.5); //top
var tB = new Vec2D(DSIZE*0.4330, -DSIZE*0.25); //br
var tC = new Vec2D(-DSIZE*0.4330, -DSIZE*0.25); //bl
//serpents eye
var seT = new Vec2D(0, DSIZE*0.38);
var seB = new Vec2D(0, -DSIZE*0.38);
//leaf
var leT = new Vec2D(0, DSIZE*0.5);
var leB = new Vec2D(0, -DSIZE*0.15);

class SpellDiagramNode extends NodeView {
	constructor() {
		super();
		
		this.m_type = SD_INVALID;
		this.m_slotEquipMenu = null;
		this.m_spellDiagrams = null;
		this.m_size = DSIZE;
		this.m_effectSlots = [];
		this.m_modSlots = [];
		this.m_effectsJson = {};
		
		var JM = JsonManager.Get();
		this.m_spellParts_Mods = JM.getJson("SpellParts_Mods");
		this.m_spellParts_Effects = JM.getJson("SpellParts_Effects");
		
		this.m_spellDiagrams = g_spellDiagrams["diagrams"];
		
		this.SetListener("slotMenuCancel", this.onMenuCancel.bind(this));
		this.SetListener("slotMenuMod", this.onMenuMod.bind(this));
		this.SetListener("slotMenuEff", this.onMenuEff.bind(this));
	}
	
	createPentNode( fill, outline)
	{
		var pent = [];
		pent.push( new Vec2D(0,10) );
		pent.push( new Vec2D(10,2) );
		pent.push( new Vec2D(5,-7) );
		pent.push( new Vec2D(-5,-7) );
		pent.push( new Vec2D(-10,2) );
	
		var pt = new NodeView();
		pt.setPolygon(pent, fill, outline, 1);
		return pt;
	}
	
	prepareDiagram( numEffects, numMods ) {
		this.m_effectsJson = {};
		this.m_modsJson = {};
	
		for( var i=0; i< this.m_effectSlots.length;i++)
		{
			this.m_effectSlots[i].removeAllChildren(true);
		}
		for( var i=0; i< this.m_modSlots.length;i++)
		{
			this.m_modSlots[i].removeAllChildren(true);
		}
	
		this.trimEffectsSize(numEffects);
		this.trimModsSize(numMods);
	}
	trimEffectsSize( maxEffects ) {
		if( this.m_effectSlots.length <= maxEffects ) return;
	
		for( var i= maxEffects; i < this.m_effectSlots.length; i++ ) {
			this.m_effectSlots[i].removeFromParent(true);
		}
		this.m_effectSlots.splice(  maxEffects, this.m_effectSlots.length - maxEffects );
	}
	trimModsSize( maxMods ) {
		if( this.m_modSlots.length <= maxMods ) return;
	
		for( var i= maxMods; i < this.m_modSlots.length; i++ ) {
			this.m_modSlots[i].removeFromParent(true);
		}
		this.m_modSlots.splice(  maxMods, this.m_modSlots.length - maxMods );
	}
	addEffect( idx, x, y, level) {
		var pt;
		if( idx < this.m_effectSlots.length )
		{
			pt = this.m_effectSlots[idx];
//TODO			pt->runAction( CCMoveTo::create(TRANSITION_TIME, ccp(x,y)) );
			pt.pos.setVal(x,y); //temp
		}else {
			//create new
			pt = this.createPentNode(EFF_COLOR, "rgba(0,0,0,1)");
			pt.pos.setVal(x,y);
			this.addChild(pt);
//TODO pt.setScale(0.01);
//TODO: pt->runAction(CCScaleTo::create(TRANSITION_TIME/2, 1,1));
			this.m_effectSlots.push(pt);
		}
	}
	
	addMod( idx, x, y, level) {
		var pt;
		if( idx < this.m_modSlots.length )
		{
			pt = this.m_modSlots[idx];
			//TODO: pt->runAction( CCMoveTo::create(TRANSITION_TIME, ccp(x,y)) );
			pt.pos.setVal(x,y); //temp
		}else {
	
			pt = this.createPentNode(MOD_COLOR, "rgba(0,0,0,1)");
			pt.pos.setVal(x,y);
			this.addChild(pt);
//TODO pt.setScale(0.01);
//TODO: pt->runAction(CCScaleTo::create(TRANSITION_TIME/2, 1,1));
			this.m_modSlots.push(pt);
		}
	}
	
	setDiagram( diagram ) {
		if ( diagram >= this.m_spellDiagrams.length ) {
			return; //out of bounds
		}
		
		this.m_type = diagram;
		
		if( this.m_type == SD_INVALID ) return;
		
		var spellDiagram = this.m_spellDiagrams[this.m_type];
		var effects = spellDiagram["effects"];
		var mods = spellDiagram["mods"];
		
		this.prepareDiagram(effects.length, mods.length);
		var level, x, y;
		for( var i=0; i< effects.length; i++ ) {
			level = effects[i]["level"];
			x = effects[i]["x"];
			y = effects[i]["y"];
			this.addEffect(i, this.m_size*x, this.m_size*y, level);
		}
		for( var i=0; i< mods.length; i++ ) {
			level = mods[i]["level"];
			x = mods[i]["x"];
			y = mods[i]["y"];
			this.addMod(i, this.m_size*x, this.m_size*y, level);
		}
		
		EventBus.game.dispatch({evtName:"spellEditorUpdate", json:this.getSpellDiagramJson()});
	}

	createModSlotMenu( slotEquipMenu, pos, idx ) {
		//todo
	}
	createEffSlotMenu( slotEquipMenu, pos, idx ) {
		//todo
	}

	onMenuCancel(e) {
		//todo
	}
	onMenuMod(e) {
		//todo
	}
	onMenuEff(e) {
		//todo
	}
	
	getSpellDiagramJson() {
		var json = {};

		var diagram = this.m_spellDiagrams[this.m_type];
		json["diagramLevel"] = diagram["lines"].length;
		json["diagramName"] = diagram["name"];
		json["effects"] = [];
		for( var i=0; i< this.m_effectSlots.length; i++) {
			if( !this.m_effectsJson.hasOwnProperty(i) ) {
				json["effects"].push({});
			}else {
				json["effects"].push( this.m_effectsJson[i] );
			}
		}
		
		json["mods"] = [];
		for( var i=0; i< this.m_modSlots.length; i++) {
			if( !this.m_modsJson.hasOwnProperty(i) ) {
				json["mods"].push({});
			}else {
				json["mods"].push( this.m_modsJson[i] );
			}
		}
		
		return json;
	}
	
	Draw(gfx, x, y, ct) {
		if (this.m_type != SD_INVALID) {
			gfx.saveMatrix();
			gfx.translate(x + this.pos.x, y + this.pos.y);
			
			var lines = this.m_spellDiagrams[this.m_type]["lines"];
			var size = this.m_size;
			var ptSize = 5;
			var fill = "";
			var stroke = "rgb(0,0,1)";
			for( var i=0; i< lines.length; i++)
			{
				var pts;
				var type = lines[i]["type"] || "circle";
				if( type == "circle" ) {
					gfx.drawCircleEx(0, 0, this.m_size/2, fill, stroke, ptSize);
				}else if( type == "bezier" ) {
					pts = lines[i]["points"];
					gfx.drawCubicBezierEx([{x:size*pts[0],y:size*pts[1]},
											{x:size*pts[2],y:size*pts[3]},
											{x:size*pts[4],y:size*pts[5]},
											{x:size*pts[6],y:size*pts[7]}], fill, stroke, ptSize);
				}else if( type == "line" ) {
					pts = lines[i]["points"];
					gfx.drawLineEx(size*pts[0],size*pts[1], size*pts[2],size*pts[3], stroke, ptSize);
				}
			}
			
			gfx.restoreMatrix();
		}

		super.Draw(gfx, x, y, ct);
	}
}

class SpellDescriptionView extends NodeView {
	constructor() {
		super();
	}
}