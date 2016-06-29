//#include js/framework/EventDispatcher

function getRand(min, max) {
  return ~~(Math.random() * (max - min + 1)) + min
}

//get dictionary length
function dicLength( dictionary ) {
	return Object.keys(dictionary).length;
}

function arrayContains( array, element ) {
	if (array.some(function(e){ return e == element; })) return true;
	return false;
}

function isString( obj ) {
	return (typeof obj === 'string' || obj instanceof String);
}

function isArray( obj ) {
  return obj.constructor === Array || Array.isArray(obj);
}


//fnCallback = function (data)  where data = null on error
function getJSON( url, fnCallback ) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	
	request.onload = function() {
		if ((this.status >= 200 && this.status < 400) || (this.status == 0 && this.response)) {
			// Success!
			var data = JSON.parse(this.response);
			fnCallback(data);
		} else {
			console.error("unable to download " + url + " error: " + this.status + " " + this.statusText);
			// We reached our target server, but it returned an error
			fnCallback(null);
		}
	};
	
	request.onerror = function() {
		console.error("unable to download " + url + " unable to connect");
		// There was a connection error of some sort
		fnCallback(null);
	};
	
	request.send();
}

function CreateSimpleButton( strLabel, strEvt, strBus ) 
{
  var area = new Vec2D(100,40);
  
  var btn = new NodeView();
  btn.setRect(area.x, area.y, "rgb(50,150,50)");
  btn.setLabel(strLabel);
  btn.setClick(function(){
    EventBus.Get(strBus).dispatch({evtName:strEvt, from:btn});
  });
  return btn;
}

function CreateSimplePopup( strMsg, strBtnLabel, okEvt, strBus ) 
{
  var area = new Vec2D(300, 250);
  
  var pop = new NodeView();
  pop.setRect(area.x, area.y, "rgb(200,200,200)");
  
  var btn = CreateSimpleButton(strBtnLabel, okEvt, strBus );
  btn.pos.y = area.y/2;
  pop.addChild(btn);
  
  console.log("button size " + btn.size.x + "," + btn.size.y);
  area.y -= btn.size.y;
  var label = new NodeView();
  label.setLabel( strMsg, "24px Arial", "rgb(0,0,0)", true);
  label.pos.y = area.y;
  pop.addChild(label);
  
  return pop;
}

function CreateSimpleEditBox( strMsg, strDefaultTxt, strBtnLabel, okEvt, strBus ) {
  var area = new Vec2D(300, 250);
  
  var pop = new NodeView();
  pop.setRect(area.x, area.y, "rgb(200,200,200)");
  
  console.log("button size " + btn.size.x + "," + btn.size.y);
  area.y -= btn.size.y;
  var label = new NodeView();
  label.setLabel( strMsg, "24px Arial", "rgb(0,0,0)", true);
  label.pos.y = area.y;
  pop.addChild(label);
  
  //TODO: how to text field
  var tf = new NodeView();
  tf.setTextInput(250, 50);
  tf.pos.setVal(area.x/2, 50);
  pop.addChild(tf);
  
  var btn = CreateSimpleButton(strBtnLabel, okEvt, strBus );
  btn.pos.y = area.y/2;
  pop.addChild(btn);
  
  return pop;
}