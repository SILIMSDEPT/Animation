(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.webFontTxtInst = {}; 
var loadedTypekitCount = 0;
var loadedGoogleCount = 0;
var gFontsUpdateCacheList = [];
var tFontsUpdateCacheList = [];
lib.ssMetadata = [
		{name:"Test 4_Accuracy Check 3_atlas_P_1", frames: [[833,243,176,231],[739,476,177,200],[833,0,177,241],[561,462,176,228],[289,544,177,186],[739,678,177,171],[561,272,230,188],[665,851,269,40],[664,893,272,27],[393,881,269,31],[971,476,50,49],[561,0,270,270],[971,527,48,47],[121,620,137,68],[918,476,51,51],[468,544,41,45],[793,333,19,22],[0,620,119,262],[0,0,287,618],[121,862,270,38],[918,529,41,49],[793,272,24,28],[468,692,233,102],[272,914,206,9],[121,732,270,86],[393,796,270,83],[121,820,270,40],[289,0,270,542],[0,902,270,24],[793,302,22,29]]},
		{name:"Test 4_Accuracy Check 3_atlas_NP_1", frames: [[0,690,272,200],[0,0,240,240],[0,242,240,240],[0,484,272,204]]}
];



lib.updateListCache = function (cacheList) {		
	for(var i = 0; i < cacheList.length; i++) {		
		if(cacheList[i].cacheCanvas)		
			cacheList[i].updateCache();		
	}		
};		

lib.addElementsToCache = function (textInst, cacheList) {		
	var cur = textInst;		
	while(cur != null && cur != exportRoot) {		
		if(cacheList.indexOf(cur) != -1)		
			break;		
		cur = cur.parent;		
	}		
	if(cur != exportRoot) {		
		var cur2 = textInst;		
		var index = cacheList.indexOf(cur);		
		while(cur2 != null && cur2 != cur) {		
			cacheList.splice(index, 0, cur2);		
			cur2 = cur2.parent;		
			index++;		
		}		
	}		
	else {		
		cur = textInst;		
		while(cur != null && cur != exportRoot) {		
			cacheList.push(cur);		
			cur = cur.parent;		
		}		
	}		
};		

lib.gfontAvailable = function(family, totalGoogleCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], gFontsUpdateCacheList);		

	loadedGoogleCount++;		
	if(loadedGoogleCount == totalGoogleCount) {		
		lib.updateListCache(gFontsUpdateCacheList);		
	}		
};		

lib.tfontAvailable = function(family, totalTypekitCount) {		
	lib.properties.webfonts[family] = true;		
	var txtInst = lib.webFontTxtInst && lib.webFontTxtInst[family] || [];		
	for(var f = 0; f < txtInst.length; ++f)		
		lib.addElementsToCache(txtInst[f], tFontsUpdateCacheList);		

	loadedTypekitCount++;		
	if(loadedTypekitCount == totalTypekitCount) {		
		lib.updateListCache(tFontsUpdateCacheList);		
	}		
};
(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.ignorePause = false;
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if((deltaFrame >= 0) && this.ignorePause){
					cjs.MovieClip.prototype.play.call(this);
					this.ignorePause = false;
				}
				else if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
				else if(deltaFrame <= -2){
					cjs.MovieClip.prototype.stop.call(this);
					this.ignorePause = true;
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib._1AccuracyCheckPhasebubble = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib._1 = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_NP_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib._2Youneedtobeginbubble = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib._4PlayAudiobubble = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib._5Revisebubble = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib._6Confirmbubble = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib._7ContinueCheckingbubble = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib._8AffirmAccuracyCheckbubble = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.Accuracycheck2menreduced = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_NP_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.Accuracycheckexpert = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_NP_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.AccuracyCheckHeader = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.AccuracyCheckScreenHeader = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.Bluebarblank = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.Confirmgreencheck = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.Graybackground = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_NP_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.Graybottonsection = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.Graycheckmark = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.Jésusetlatempête = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.Logbutton = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.PauseButtonGray = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.PauseButton = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.PhaseDropdown = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.PhoneFrame2_618x2871withoutheader = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.PlayAudioBackground = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.PlaybuttonGray = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.Playbutton = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.Pleasecheckmessage = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.slidingball_small = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.Verseandscriptpage1 = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.Verseandscripttitlepage = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.Voicestudioheader = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.VoiceStudioLock = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.Voicestudioscreenheader = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.whitemicrophonebuttononbluebackground = function() {
	this.initialize(ss["Test 4_Accuracy Check 3_atlas_P_1"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.Tween42 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Graycheckmark();
	this.instance.setTransform(-24,-23.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24,-23.5,48,47);


(lib.Tween41 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Graycheckmark();
	this.instance.setTransform(-24,-23.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-24,-23.5,48,47);


(lib.Tween40 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Jésusetlatempête();
	this.instance.setTransform(-68.5,-34);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-68.5,-34,137,68);


(lib.Tween39 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Jésusetlatempête();
	this.instance.setTransform(-68.5,-34);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-68.5,-34,137,68);


(lib.Tween37 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib._1();
	this.instance.setTransform(0,-102);

	this.instance_1 = new lib.Graybackground();
	this.instance_1.setTransform(-272,-102);

	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["Test 4_Accuracy Check 3_atlas_P_1"],13);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-68.5,-34)).s().p("AqsFUIAAqnIVZAAIAAKng")
	}.bind(this);
	this.shape.setTransform(-137.5,-19);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-272,-102,544,204);


(lib.Tween36 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Logbutton();
	this.instance.setTransform(-25.5,-25.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-25.5,-25.5,51,51);


(lib.Tween35 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Logbutton();
	this.instance.setTransform(112.5,-25.5);

	this.instance_1 = new lib.Logbutton();
	this.instance_1.setTransform(-163.5,-25.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-163.5,-25.5,327,51);


(lib.Tween34 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Verseandscriptpage1();
	this.instance.setTransform(-135,-43);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-135,-43,270,86);


(lib.Tween33 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Verseandscriptpage1();
	this.instance.setTransform(2,-43);

	this.instance_1 = new lib.Verseandscripttitlepage();
	this.instance_1.setTransform(-272,-43);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-272,-43,544,86);


(lib.Tween30 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FFFFFF").s().p("AgUAcQgKgKAAgRQAAgRAKgKQAJgKANAAQAHAAAFACQAFACAEAEQAEAEACAGQACAGAAAIIAAAGIgwAAQAAAMAGAGQAGAHAKAAIAIgBIAHgCIAFgDIAEgDIAAAAIAAANIgFADIgFABIgHACIgHAAQgQAAgJgJgAgFgZIgHAEIgEAHIgBAHIAkAAQAAgEgBgEIgDgGIgFgEQgEgBgEAAQgEAAgDABg");
	this.shape.setTransform(-131.325,1.975);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("AgFAyIAAhiIALAAIAABig");
	this.shape_1.setTransform(-136.7,0.6);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AgHApQgFgFAAgMIAAgnIgIAAIAAgKIAIAAIAAgVIAMAAIAAAVIAVAAIAAAKIgVAAIAAAgIAAAJQAAADAAADIAEADIAGABIAGgBIAEgBIABAAIAAAKIgHACIgGAAQgJABgGgGg");
	this.shape_2.setTransform(-140.8,1.05);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#FFFFFF").s().p("AgFAwIAAhGIALAAIAABGgAgGgjIAAgMIANAAIAAAMg");
	this.shape_3.setTransform(-145.025,0.8);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#FFFFFF").s().p("AgGAvIAAhSIgfAAIAAgLIBLAAIAAALIggAAIAABSg");
	this.shape_4.setTransform(-150.8,0.825);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FFFFFF").s().p("AgWAwIAAgKIARAAIAAg+IgRAAIAAgJQAJAAAFgDQAFgCAAgJIAJAAIAABVIARAAIAAAKg");
	this.shape_5.setTransform(149.05,0);

	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFFFFF").s().p("AgUAcQgKgKAAgRQAAgRAKgKQAJgKANAAQAHAAAFACQAFACAEAEQAEAEACAGQACAGAAAIIAAAGIgwAAQAAAMAGAGQAGAHAKAAIAIgBIAHgCIAFgDIAEgDIAAAAIAAANIgFADIgFABIgHACIgHAAQgQAAgJgJgAgFgZIgHAEIgEAHIgBAHIAkAAQAAgEgBgEIgDgGIgFgEQgEgBgEAAQgEAAgDABg");
	this.shape_6.setTransform(136.825,1.175);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("AgMAxIgKgCIAAgMIABAAIADABIAGACIAGAAIAGABQAFAAADgBQAEgBACgEIADgFIABgIIAAgHQgFAFgEACQgFACgGAAQgMAAgHgJQgIgJAAgQQAAgJADgGQACgHAFgGQAEgEAFgDQAGgCAEAAQAGAAAEABIAIAEIABgDIALAAIAAA+QAAASgIAIQgIAJgPAAIgLgBgAgLggQgFAHAAAMQAAANAEAEQAEAHAIAAIAJgCIAJgFIAAgmQgEgDgEAAIgIgBQgIAAgFAGg");
	this.shape_7.setTransform(129.025,2.45);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFFFFF").s().p("AgOAkIgHgFQgDgDgBgEQgCgFAAgEQAAgIADgFQADgEAHgDQAGgDAIgBIAQgBIAAgDIgBgGQgBgDgCgBIgGgCIgGgBIgJABIgMAEIAAAAIAAgMIAJgCIAMgBIAMABQAFABAEADQAEADABAEQACAFAAAHIAAAvIgMAAIAAgHIgDADIgFADIgGACIgIABIgIgBgAAGAAIgKABQgFABgDAEQgDADAAAFQAAAGAEADQADADAHAAQAEAAAFgCIAIgGIAAgTIgKABg");
	this.shape_8.setTransform(121.575,1.225);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFFFF").s().p("AgdAvIAAhdIAYAAQAHAAAGABQAGACAEADQAGADADAGQADAFAAAIQAAAGgDAGQgBAFgFADQgFAFgGADQgHACgJAAIgLAAIAAAjgAgRABIAJAAIALgBQAFAAADgDIAFgHIABgHQgBgFgBgEQgBgEgEgCIgHgDIgJAAIgLAAg");
	this.shape_9.setTransform(114.7,0.025);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6},{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-156.6,-10.2,313.2,20.5);


(lib.Tween28 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Playbutton();
	this.instance.setTransform(-12,-14);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-12,-14,24,28);


(lib.Tween27 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Playbutton();
	this.instance.setTransform(-151,-14);

	this.instance_1 = new lib.Playbutton();
	this.instance_1.setTransform(127,-14);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-151,-14,302,28);


(lib.Tween24 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib._1();
	this.instance.setTransform(0,-102);

	this.instance_1 = new lib.Graybackground();
	this.instance_1.setTransform(-272,-102);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-272,-102,544,204);


(lib.Progressbar = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#CCCCCC").ss(42,1,1).p("A6YAAMA0xAAA");
	this.shape.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-189.8,-21,379.70000000000005,42);


(lib.greencheckmark = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Confirmgreencheck();

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,50,49);


(lib.Tween4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.slidingball_small();
	this.instance.setTransform(-103,-4.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-103,-4.5,206,9);


(lib.Touch = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#CCCCCC").s().p("ACNEuIgJgBIgJgBIgJgBIgJgCIgJgBIgIgDIgHgEIgIgDIgIgDIgIgEIgHgDIgHgEIgHgEIgGgFIgGgFIgGgFIgGgFIgFgGIgFgFIgEgGIgFgHQgYgJgWgLQgcgPgbgSQgcgRgagSQgXgPgVgRQgWgRgUgSQg1ghgZg4QgYg2AIg7QAJg9ArgtQAwgyBFgLQBBgKA5AgQAnAVAXAlIAFAEIAFAFIAFAEIAFAFIAFAEIAPAKIAPAJIAPAKIAWANIAWAOIAPAJQAuAOApAZQApAYAdAlQAYAeAMAjQAMAlAAAnQAAAxgXAsQgOAZgUAUIgIAGIgIAGIgIAGIgHAGIgIAGIgQAIIgQAHIgQAFIgQAEIgRACIgSABIgJgBg");
	this.shape.setTransform(71.0196,31.1236,1,1,-14.9983);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#CCCCCC").s().p("AEHSfQgRgGgQgKQgWgNgSgSQgRgPgNgTQgOgVgKgXQgJgUgJgWQgKgZgGgaQgDgNgEgMIgOggIgLgYIgJgZIgIgZIgGgZIgCgIQgig8AJhEQAIg+AsgtQAtguA/gKQBJgMA+AmQBOAxAUBYQAKAoANAoIAOAgIALAZQAFAMAEANIAIAYIAHAZQAeApAGAyQAGAugPAqQgRAvglAiQglAggwANQgXAGgXAAQggAAgggMgApcOJIgJgBIgIgCIgJgBIgJgBIgIgBIgJgBQgigJgcgVQghgYgVgjQgUgjgGgoQgFgoAMgnQALgmAZgeIAQgRQBChVBNhMQA9g7BJgpQAlgVArgEQBYgHBCA6QBJA/gIBgQgIBkhVA1QgSALgUAHIgGAFIgGAGIgGAFIgHAFIgHAGIgGAFIgHAFIgLAMIgLAMIgKANIgRAUIgSATIgMAMIgWAhQgMAPgPANQgOAMgQAKQgPALgRAGQgQAGgQAEQgUAFgWAAIgBAAgAryAtQg+gBgzgkQgxgigVg5QgVg4APg6QAQg8AwgpQAtgmA6gHIAVgBIARgEIASgDIASgCIASgBIAPAAIAGAAQCCgRCEAKQBqAJAyBeQAzBgg4BdQgrBGhRARQgvAJgxgBIhpgCIgLACIgSAEIgSACIgSABIgQABIgGABIgQADIgQACIgPACIgOABIgQABIgKABIgFAAgAH1iHQgzgEgqgcQgngagXgoQgagtAAgzIAAgWQAAgMACgNIAFgZIAIgYQAEgMAFgMIAEgHIAIgXIAHgOIAGgNIAHgPIAJgPIAJgNIALgMIACgEIADgGIAEgFIAEgFIAKgXIALgYQAGgMAHgLIAIgLIAMgUQAGgKAHgJIACgEIAEgHIAFgHIAFgHIAGgHIAIgQIAIgPIAGgOIAGgMIAHgMIAKgPIAGgHQAXg5AtgqQAvgtBCgFQBCgFA4AkQA6AlAVBBQAYBNgiBIQgJATgMARIgHAOIgEAGIgEAHIgEAHIgFAIIgFAHIgGAIIgMAYIgIAQIgIARIgIAOIgIANIgJAMIgCAEIgEAHIgFAHIgFAHIgFAGIgBADIgEAFIgDAEIgFAHIgDAFIgDAFIgFAQIgFAPIgHAOIgJAOIgDAGIgFAFIgEAGIgEAGIgEAHIgEAGIgEAFIgFAGIgDAHIgDAIIgCAIIgEAIIgDAHQgIAwgeAnQgeAmgrAVQgmASgpAAIgQgBgAholiQgqgJgigZIgHgFIgGgGIgGgGIgGgGIgGgGIgGgGIgGgGQgJgMgIgOQgJgRgFgSQgGgTgDgUQgEgTABgVIABgpIABgSQgCgDgBgEIgDgIIgDgIIgCgJIgCgIIgDgIIgCgJIgIgQIgIgOIgJgQIgJgOQgEgHgCgIIgEgGIgDgHIgEgGIgEgHIgEgGIgDgIIgDgHIgEgQIgDgQIgEgIIgDgIIgDgJIgEgIIgCgDIgFgJIgFgJIgFgIIgFgJIgGgIIgFgPIgEgPIgDgPIgCgPIgBgPIABgQIABgIQAIhCAtgxQAogrA4gNQA0gNA0AQQA2ARAlAtQAgAqAYAwQAJASABAUIAEAJIADAJIADAIIAEAJIACAJIAEAHIADAGIADAHIADAHIACAHIABACIAAgBIABACIACAEIALAQIAMAVIALAUIAJAXIAJAZIAGAZIAKAVQAGANAEAOIAIAhQAEAQABAQQACARgCARIgEAdIAAAHQAMArgIArQgIAsgaAlQgWAdgfAUQgeAUgjAHQgUAEgVAAQgTAAgTgEg");
	this.shape_1.setTransform(-10.4745,0.2633);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-105.4,-119.2,213.2,239);


(lib.PlayAudioBackgrouind = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.PlayAudioBackground();
	this.instance.setTransform(-135,-19);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-135,-19,270,38);


(lib.handbrown = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#000000").s().p("AkdehQlyhqjRkiQk4mviWnGQhAjCAYilQAci+B0hpQCMh/ECjVQAWgSAKgSQAKgTAAgbQgCpmABq9QAAh1BEhSQBDhQBygaQCLghB2BlQB0BjgCCKQgCB+ABC4IABE2IAAD6QBPgwBPgLQBLgKBRAWQBTAXAsBCQAlA4APBgQCVhUCQAqQCfAtA3CMIAQgBQCfhtCVA8QCVA7AoC+QAUBgABBhIACH4QABEdgEDcQgEDng3C7Qg+DSiDCmQjrEtmdAnQhjAKhjAAQkaAAkThQgAshjDQgIADgDADIivCaQhlBYhGBDQhDA/gYCAQgaCOA2CoQCLGxE1GwQCsDyEvBkQF/B+GVgxQHTg6DBm5QBljoADjzQAHoPgIoyQgBhfgxh5QgnhhiGAEQhgAEgsBkQgZA3gCAeQgEA6gHC6QgBApgPATQgOATgegCQgigCgNgXQgJgRAAgjQABiygBixQAAhnhHg7QhHg7hnARQieAagBCiIAAF8QAABFg7gBQg4gBAAhCIAAiqQAAkbgBiOQgBhDgYgrQgYgpgtgPQh3glhPA6QhQA6gBB8IgDH5IAAApQgBAYgHANQgHAOgRAMQgSANgPAAQgLAAgPgPQgNgNgJgQQgEgIAAgRIACgdIAA1fIAAiJQABhSgCg4QgDhshOg7QhOg7hjAdQiGAnAAClMAAAAjiIABAcQAAAQgDALQgGAYgQANQgRAOgXgIQgNgEgOgQQgIgJgPgWQgEgFABgNIACgVIAAsPIgSAHg");
	this.shape.setTransform(0.024,0.0047);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#946038").s().p("AkpciQkvhkitjxQk1mxiLmxQg1inAaiPQAXh/BDhAQBGhCBmhZICuiZQAEgDAHgDIASgIIAAMQIgBAVQgBAMAEAGQAOAVAIAJQAOAQAOAFQAWAHASgOQAPgMAGgZQADgKAAgRIAAgbMAAAgjjQAAikCFgnQBkgeBOA7QBNA8AEBsQABA3AABSIgBCKIAAVfIgBAcQgBARAFAJQAJAPANANQAPAQALAAQAPgBARgMQASgMAHgOQAHgOABgXIAAgpIADn5QABh9BQg6QBOg6B3AmQAtAOAYAqQAZAqAABEQACCOgBEbIAACqQAABCA4AAQA8ACAAhGIgBl8QABiiCfgaQBngRBHA7QBHA8AABnQABCxgBCyQAAAjAJARQANAXAhACQAeACAPgUQAOgTABgpQAHi6AFg6QACgeAYg3QAthkBfgDQCGgFAnBhQAxB6ACBeQAIIzgIIOQgDDzhlDoQjAG6nUA5QhyAOhwAAQkeAAkThbg");
	this.shape_1.setTransform(-0.0187,0.1794);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-137.3,-203.3,274.70000000000005,406.6);


(lib.Bluedot = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	var sprImg_shape = cjs.SpriteSheetUtils.extractFrame(ss["Test 4_Accuracy Check 3_atlas_P_1"],23);
	sprImg_shape.onload = function(){
		this.shape.graphics.bf(sprImg_shape, null, new cjs.Matrix2D(1,0,0,1,-201,-4.5)).s().p("AgxAtIAAhZIBjAAIAABZg")
	}.bind(this);
	this.shape.setTransform(0.025,0);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-4.9,-4.5,9.9,9);


(lib.circle_of_progress = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#000000").ss(1,1,1).p("ABiAAQAAApgdAcQgDAEgEADQgaAWgkAAQgEAAgEAAQgjgDgagaQgcgcAAgpQAAgoAcgdQAdgcAoAAQApAAAcAcQAdAdAAAog");

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#00A7E2").s().p("AgHBiQgjgDgagaQgdgcAAgpQAAgoAdgcQAcgdAoAAQApAAAcAdQAdAcAAAoQAAApgdAcIgHAHQgaAWgkAAIgHAAg");

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-10.8,-10.8,21.6,21.6);


(lib.Play_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.PlaybuttonGray();
	this.instance.setTransform(-20.5,-24.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-20.5,-24.5,41,49);


(lib.Pause_btn = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.PauseButtonGray();
	this.instance.setTransform(-20.5,-22.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-20.5,-22.5,41,45);


(lib.gotostart = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#CCCCCC").ss(5,1,1).p("AAAkIIAAIR");
	this.shape.setTransform(-31.95,1.525);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#CCCCCC").ss(1,1,1).p("Ak9AAIGIDjIAAhdIDzAAIAAkNIjzAAIAAhbg");
	this.shape_1.setTransform(2.625,1.625);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#333333").s().p("Ak9AAIGIjiIAABbIDzAAIAAENIjzAAIAABdg");
	this.shape_2.setTransform(2.625,1.625);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-34.4,-27.4,69.8,57.9);


(lib.gotoend = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#CCCCCC").ss(5,1,1).p("AAAkIIAAIR");
	this.shape.setTransform(33.65,0.525);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#CCCCCC").ss(1,1,1).p("AE+AAImIDjIAAhdIjzAAIAAkNIDzAAIAAhbg");
	this.shape_1.setTransform(-0.925,0.625);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#333333").s().p("AhKCGIjzAAIAAkNIDzAAIAAhbIGIDiImIDjg");
	this.shape_2.setTransform(-0.925,0.625);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-33.7,-28.4,69.9,57.9);


(lib.goforwardbutton = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#999999").ss(1,1,1).p("AE+AAImIDjIAAhdIjzAAIAAkNIDzAAIAAhbg");
	this.shape.setTransform(2.675,1.625);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#666666").s().p("AhKCGIjzAAIAAkNIDzAAIAAhbIGIDiImIDjg");
	this.shape_1.setTransform(2.675,1.625);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-30.1,-22,65.6,47.3);


(lib.gobackbutton = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#999999").ss(1,1,1).p("Ak9AAIGIDjIAAhdIDzAAIAAkNIjzAAIAAhbg");
	this.shape.setTransform(2.625,1.625);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#666666").s().p("Ak9AAIGIjiIAABbIDzAAIAAENIjzAAIAABdg");
	this.shape_1.setTransform(2.625,1.625);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-30.1,-22,65.5,47.3);


(lib.Tween29 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.Bluedot("synched",0);
	this.instance.setTransform(138.1,0);

	this.instance_1 = new lib.Bluedot("synched",0);
	this.instance_1.setTransform(-138.15,0);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-143.1,-4.5,286.2,9);


(lib.TouchAnimation = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {Tap:0};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Touch
	this.instance = new lib.Touch("synched",0);
	this.instance.setTransform(-5.25,-254.7,0.25,0.25,0,0,0,0,0.2);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({y:-255.75,alpha:0},9).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-31.6,-285.6,53.3,60.80000000000001);


(lib.Backgroundforplayaudio = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.PlayAudioBackgrouind("synched",0);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-135,-19,270,38);


// stage content:
(lib.Test4_AccuracyCheck3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = false; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {"  1 - In this phase you need to ask another person to check and approve the story for accuracy.":9,"  3 - If this is a Bible story, the person should have Bible knowledge.":161,"  4 -Begin on the Title Page.":323,"  5 - If a different page is showing, swipe left or right to the Title page.":384,"  11 - Allow the accuracy checker to play the translation for this page.":522,"Portuguese title audio":635,"  12 - Is it accurate? Do the words communicate the correct meaning? Are key words used consistently in the story?":690,"  13 - If the accuracy checker feels that a change is needed, go back to the Translate Phase to make the changes.":942,"  14 - Then return to the Accuracy Check to continue checking.":1136,"  15 - The accuracy checker should tap here if they approve this page.":1299,"  16 - A green checkmark indicates that it has been approved.":1419,"  17 - Go to each page. Check each page for accuracy.":1543,"  18 - Revise the page’s translation if necessary.":1662,"  19 - If you try to go to the Voice Studio, Finalize, or Share phases before all the pages are approved, this message will appear.":1768,"  20 -  You must finish the Accuracy Check before going to the next phase.":1994,"  21 - Go back to the Accuracy Check and make sure each page has been approved by someone with Bible knowledge. ":2112,"  22 - When all the pages have been checked, this message will appear.":2294,"  23 - If you tap “no,” you will be reminded to ask someone with Bible knowledge to check the story.":2415,"  24 - If you tap ‘yes’, the story is approved.":2595,"  25 - When you finish, the app moves to the next phase, Voice Studio.":2698,Hand:275,"hand off screen":329,"Hand":479,"Hand off screen":534,"Hand":597,"Hand off screen":650,"Hand":899,"Hand off screen":947,"Hand":1035,"Hand off screen":1078,"Hand":1155,"Hand off screen":1208,"Hand":1227,"Hand off screen":1280,"Hand":1322,"Hand off screen":1379,"Hand":1501,"Hand off screen":1544,"Swipe Left":1559,"Hand off screen":1609,"Hand":1734,"Hand off screen":1780,"Hand":1815,"Hand":1864,"Hand off screen":1965,"Hand":2117,"Hand off screen":2245,"Hand":2312,"Hand":2355,"Hand":2408,"Hand off screen":2465,"Hand":2541,"Hand off screen":2592,"Hand":2638,"Hand off screen":2695,"Tap next":301,"Tap next":505,"Tap play":622,"Tap next":918,"Tap phase menu":1061,"Tap next":1178,"Tap next":1250,"Tap gray check":1346,"Tap next":1524,"Tap and hold to slide":1568,"Tap got it":1757,"Tap phase menu":1846,"Tap voice studio":1931,"Tap phase menu":2158,"Tap accuracy check":2200,"Tap next":2335,"Tap No":2431,"Tap OK":2567,"Tap YES":2665,"Phone Frame":0,"Header for Phone Frame":0,"Voice studio header":1942,"Accuracy check header":2203,"Voice studio header":2668,"2 men reading Bible":48,"BIble knowledge man":234,"Image Border Black":48,"Image border gray":48,"Circle Translate & Revise":1073,"Circle Accuracy Check":1154,"Red circle for Voice Studio":1857,"Phases menu":1062,"Phases menu":1850,"Phases menu":2162,"Voice Studio w/ lock":1942,"Affirm Accuracy Check":2370,"Please have someone check...":2435,"Affirm Accuracy Check":2571,"BTW-Accuracy Check Phase":0,"BTW-you need to begin":316,"BTW-Play audio":506,"BTW - Revise":933,"BTW - Confirm":1263,"BTW - Continue Checking":1527,"Pause button":625,"Play button":0,"Play button":676,"Play button":1571,"Play button":1609,"Mask for Slider":0,"Mask for Slider":626,"Round Slider w/ Line":0,"Round Slider w/ Line":626,"Blue dot only":1571,"Blue dot only":1610,Title:0,"TItle/Page1":1571,"Page 1":1609,"Page 1":1610,"Title":2668,"Middle bar background":0,"Accuracy header":0,"Voice studio header":2668,"Gray check":0,"Gray check coming in":1571,"Gray check":1609,"Green check":1351,"Check emphasized":1444,"Green check":1465,"Green check going out":1571,"Green check":2338,"Title page verse & script":0,"Bible verse & Script":1571,"Bible verse & Script - page 1":1610,"Log button":0,"Log button":1571,"Log button":1610,Microphone:2668,"Blue bottom bar":2668,"Gray bottom section ":0,"Jesus et la Tempete":0,"Jesus et la Tempete":2668,"Title page gray background":0,"Swipe left from Title page to Page 1":1571,"Swipe left from title page to page 1":1609,"page 1":1610,"Title page gray background":2668};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,9,161,323,384,522,637,690,942,1136,1299,1419,1543,1662,1768,1994,2112,2294,2415,2595,2698];
	this.streamSoundSymbolsList[9] = [{id:"ENGVoiceStudio_Marker01",startFrame:9,endFrame:161,loop:1,offset:0}];
	this.streamSoundSymbolsList[161] = [{id:"ENGVoiceStudio_Marker03",startFrame:161,endFrame:323,loop:1,offset:0}];
	this.streamSoundSymbolsList[323] = [{id:"ENGVoiceStudio_Marker04",startFrame:323,endFrame:384,loop:1,offset:0}];
	this.streamSoundSymbolsList[384] = [{id:"ENGVoiceStudio_Marker05",startFrame:384,endFrame:522,loop:1,offset:0}];
	this.streamSoundSymbolsList[522] = [{id:"ENGVoiceStudio_Marker11",startFrame:522,endFrame:690,loop:1,offset:0}];
	this.streamSoundSymbolsList[637] = [{id:"Jesus_and_the_storm_Portuguese_OnildoFRocha_pvc_s50_sb75_se0_b_m2",startFrame:637,endFrame:690,loop:1,offset:0}];
	this.streamSoundSymbolsList[690] = [{id:"ENGVoiceStudio_Marker12",startFrame:690,endFrame:942,loop:1,offset:0}];
	this.streamSoundSymbolsList[942] = [{id:"ENGVoiceStudio_Marker13",startFrame:942,endFrame:1136,loop:1,offset:0}];
	this.streamSoundSymbolsList[1136] = [{id:"ENGVoiceStudio_Marker14",startFrame:1136,endFrame:1299,loop:1,offset:0}];
	this.streamSoundSymbolsList[1299] = [{id:"ENGVoiceStudio_Marker15",startFrame:1299,endFrame:1419,loop:1,offset:0}];
	this.streamSoundSymbolsList[1419] = [{id:"ENGVoiceStudio_Marker16",startFrame:1419,endFrame:1543,loop:1,offset:0}];
	this.streamSoundSymbolsList[1543] = [{id:"ENGVoiceStudio_Marker17",startFrame:1543,endFrame:1662,loop:1,offset:0}];
	this.streamSoundSymbolsList[1662] = [{id:"ENGVoiceStudio_Marker18",startFrame:1662,endFrame:1768,loop:1,offset:0}];
	this.streamSoundSymbolsList[1768] = [{id:"ENGVoiceStudio_Marker19",startFrame:1768,endFrame:1994,loop:1,offset:0}];
	this.streamSoundSymbolsList[1994] = [{id:"ENGVoiceStudio_Marker20",startFrame:1994,endFrame:2112,loop:1,offset:0}];
	this.streamSoundSymbolsList[2112] = [{id:"ENGVoiceStudio_Marker21",startFrame:2112,endFrame:2294,loop:1,offset:0}];
	this.streamSoundSymbolsList[2294] = [{id:"ENGVoiceStudio_Marker22",startFrame:2294,endFrame:2415,loop:1,offset:0}];
	this.streamSoundSymbolsList[2415] = [{id:"ENGVoiceStudio_Marker23",startFrame:2415,endFrame:2595,loop:1,offset:0}];
	this.streamSoundSymbolsList[2595] = [{id:"ENGVoiceStudio_Marker24",startFrame:2595,endFrame:2698,loop:1,offset:0}];
	this.streamSoundSymbolsList[2698] = [{id:"ENGVoiceStudio_Marker25",startFrame:2698,endFrame:2840,loop:1,offset:0}];
	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		// WORKS, NO ERRORS, BUT BASED ON WHERE YOU CLICK ON THE SCREEN 
		// RATHER THAN WHERE YOU CLICK ON AN OBJECT
		// THE function playOnClickPosition(event) IS BASED ON PIXELS RATHER THAN PERCENTAGES
		// NOTE: I PUT A STOP COMMAND ON THE LAST FRAME OF THE ANIMATION.
		
		// Control buttons
		var _this = this;
		var previousFrame = -1;
		
		// Initialize state
		this.stop();  // Stop on first frame
		this.playBtn.visible = true;
		this.pauseBtn.visible = false;
		
		// Get total frames safely
		const totalFrames = this.totalFrames || 100;
		
		// Helper function to validate frame numbers
		function validateFrame(frame) {
		    return Math.max(0, Math.min(totalFrames - 1, frame));
		}
		
		// Button event listeners with error handling
		function addSafeListener(button, event, handler) {
		    if (button) {
		        button.addEventListener(event, handler.bind(this));
		    } else {
		        console.error(`Button not found: ${button}`);
		    }
		}
		
		addSafeListener(this.playBtn, "click", playAnimation);
		addSafeListener(this.pauseBtn, "click", pauseAnimation);
		addSafeListener(this.Progress_bar_btn, "click", playOnClickPosition);
		addSafeListener(this.go_back_X_btn, "click", goBackXandPlay);
		addSafeListener(this.go_forward_X_btn, "click", goForwardXandPlay);
		addSafeListener(this.PlayAgainBtn, "click", playAgain);
		addSafeListener(this.go_to_end_btn, "click", goToTheEnd);
		
		function playAnimation() {
		    if (!_this) return;
		    
		    // If we're on the last frame, go back to the start before playing
		    if (_this.currentFrame === totalFrames - 1) {
		        _this.gotoAndPlay(1);
		    } else {
		        _this.play();
		    }
		    
		    _this.playBtn.visible = false;
		    _this.pauseBtn.visible = true;
		}
		
		function pauseAnimation() {
		    if (!_this) return;
		    _this.stop();
		    _this.playBtn.visible = true;
		    _this.pauseBtn.visible = false;
		}
		
		function playOnClickPosition(event) {
		    if (!_this || !stage) return;
		    
		    const progressBarWidth = 203;
		    const clickOffset = Math.max(0, stage.mouseX - 48);
		    let frame = Math.floor((clickOffset / progressBarWidth) * totalFrames * 0.85);
		    frame = validateFrame(frame);
		
		    _this.gotoAndStop(frame);
		    _this.playBtn.visible = true;
		    _this.pauseBtn.visible = false;
		}
		
		function goBackXandPlay() {
		    if (!_this) return;
		    const frameNumber = _this.currentFrame || 0;
		    const newFrame = validateFrame(frameNumber - 75);
		
		    if (_this.playBtn && !_this.playBtn.visible) {
		        _this.gotoAndPlay(newFrame);
		    } else {
		        _this.gotoAndStop(newFrame);
		    }
		    console.log(`Frame change: ${frameNumber} -> ${newFrame}`);
		}
		
		function goForwardXandPlay() {
		    if (!_this) return;
		    const frameNumber = _this.currentFrame || 0;
		    const newFrame = validateFrame(frameNumber + 70);
		
		    if (_this.playBtn && !_this.playBtn.visible) {
		        _this.gotoAndPlay(newFrame);
		    } else {
		        _this.gotoAndStop(newFrame);
		    }
		    console.log(`Frame change: ${frameNumber} -> ${newFrame}`);
		}
		
		function playAgain() {
		    if (!_this) return;
		    _this.gotoAndStop(1);
		    _this.playBtn.visible = true;
		    _this.pauseBtn.visible = false;
		}
		
		function goToTheEnd() {
		    if (!_this) return;
		    _this.gotoAndStop(totalFrames - 1);
		    _this.playBtn.visible = true;
		    _this.pauseBtn.visible = false;
		}
		
		// Add frame event listener to check for last frame
		_this.addEventListener("enterFrame", function() {
		    if (_this.currentFrame === totalFrames - 1) {
		        _this.stop();
		        _this.playBtn.visible = true;
		        _this.pauseBtn.visible = false;
		    }
		});
		
		// Drag and drop functionality
		const stage = this.stage;
		if (!stage) {
		    console.error("Stage not found");
		    return;
		}
		
		let isDragging = false;
		const dragBoundaries = {
		    startX: stage.canvas.width * 0.15,
		    endX: stage.canvas.width * 0.86,
		    startY: stage.canvas.height * 0.90,
		    endY: stage.canvas.height * 0.94
		};
		
		function isInDraggableArea(x, y) {
		    return (
		        x >= dragBoundaries.startX &&
		        x <= dragBoundaries.endX &&
		        y >= dragBoundaries.startY &&
		        y <= dragBoundaries.endY
		    );
		}
		
		function startDrag(event) {
		    isDragging = isInDraggableArea(event.stageX, event.stageY);
		}
		
		function drag(event) {
		    if (!isDragging || !_this) return;
		    
		    const xPosition = Math.max(
		        dragBoundaries.startX,
		        Math.min(dragBoundaries.endX, event.stageX)
		    );
		    
		    const draggableWidth = dragBoundaries.endX - dragBoundaries.startX;
		    let frame = Math.floor(
		        ((xPosition - dragBoundaries.startX) / draggableWidth) * totalFrames
		    );
		    
		    frame = validateFrame(frame);
		    _this.gotoAndStop(frame);
		    _this.playBtn.visible = true;
		    _this.pauseBtn.visible = false;
		}
		
		function stopDrag() {
		    isDragging = false;
		    console.log("Drag ended");
		}
		
		stage.addEventListener("stagemousedown", startDrag);
		stage.addEventListener("stagemousemove", drag);
		stage.addEventListener("stagemouseup", stopDrag);
		
		var _this = this; 
		
		// Function to update frame number
		function updateFrameNumber() {
		    if (_this && _this.frameNumberTxt) {
		        _this.frameNumberTxt.text = "" + ((_this.currentFrame + 1)/10);
		    }
		}
		
		// Ensure frame number updates in real-time
		_this.addEventListener("tick", updateFrameNumber);
		
		
		
		totalFrames =
		
		// Function to move the playhead to the specified frame number based on user click
		function playOnClickPosition() {
		    // Get the dimensions of your progress bar
		    const progressBarWidth = 287; // Width in pixels
		    const totalFrames = 1705;
		    
		    // Adjust starting offset - this is the position where the progress bar begins
		    const progressBarStartX = 63; // Adjust this value based on exact position
		    
		    // Get exact click position relative to the start of the progress bar
		    const clickOffset = Math.max(0, Math.min(progressBarWidth, stage.mouseX - progressBarStartX));
		    
		    // Calculate position as percentage of the bar width
		    const positionPercentage = clickOffset / progressBarWidth;
		    
		    // Map percentage to frame number (linear mapping)
		    const frame = Math.round(positionPercentage * totalFrames);
		    
		    // Ensure frame is within valid range (0 to totalFrames-1)
		    const validFrame = Math.max(1, Math.min(totalFrames, frame));
		    
		    console.log("Click offset:", clickOffset, "Position %:", positionPercentage, "Frame:", validFrame);
		    
		    // Go to that frame and update UI
		    _this.gotoAndStop(validFrame);
		    _this.playBtn.visible = true;
		    _this.pauseBtn.visible = false;
		}
	}
	this.frame_9 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker01",0);
		this.InsertIntoSoundStreamData(soundInstance,9,161,1);
	}
	this.frame_161 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker03",0);
		this.InsertIntoSoundStreamData(soundInstance,161,323,1);
	}
	this.frame_323 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker04",0);
		this.InsertIntoSoundStreamData(soundInstance,323,384,1);
	}
	this.frame_384 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker05",0);
		this.InsertIntoSoundStreamData(soundInstance,384,522,1);
	}
	this.frame_522 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker11",0);
		this.InsertIntoSoundStreamData(soundInstance,522,690,1);
	}
	this.frame_637 = function() {
		var soundInstance = playSound("Jesus_and_the_storm_Portuguese_OnildoFRocha_pvc_s50_sb75_se0_b_m2",0);
		this.InsertIntoSoundStreamData(soundInstance,637,690,1);
	}
	this.frame_690 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker12",0);
		this.InsertIntoSoundStreamData(soundInstance,690,942,1);
	}
	this.frame_942 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker13",0);
		this.InsertIntoSoundStreamData(soundInstance,942,1136,1);
	}
	this.frame_1136 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker14",0);
		this.InsertIntoSoundStreamData(soundInstance,1136,1299,1);
	}
	this.frame_1299 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker15",0);
		this.InsertIntoSoundStreamData(soundInstance,1299,1419,1);
	}
	this.frame_1419 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker16",0);
		this.InsertIntoSoundStreamData(soundInstance,1419,1543,1);
	}
	this.frame_1543 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker17",0);
		this.InsertIntoSoundStreamData(soundInstance,1543,1662,1);
	}
	this.frame_1662 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker18",0);
		this.InsertIntoSoundStreamData(soundInstance,1662,1768,1);
	}
	this.frame_1768 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker19",0);
		this.InsertIntoSoundStreamData(soundInstance,1768,1994,1);
	}
	this.frame_1994 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker20",0);
		this.InsertIntoSoundStreamData(soundInstance,1994,2112,1);
	}
	this.frame_2112 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker21",0);
		this.InsertIntoSoundStreamData(soundInstance,2112,2294,1);
	}
	this.frame_2294 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker22",0);
		this.InsertIntoSoundStreamData(soundInstance,2294,2415,1);
	}
	this.frame_2415 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker23",0);
		this.InsertIntoSoundStreamData(soundInstance,2415,2595,1);
	}
	this.frame_2595 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker24",0);
		this.InsertIntoSoundStreamData(soundInstance,2595,2698,1);
	}
	this.frame_2698 = function() {
		var soundInstance = playSound("ENGVoiceStudio_Marker25",0);
		this.InsertIntoSoundStreamData(soundInstance,2698,2840,1);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(9).call(this.frame_9).wait(152).call(this.frame_161).wait(162).call(this.frame_323).wait(61).call(this.frame_384).wait(138).call(this.frame_522).wait(115).call(this.frame_637).wait(53).call(this.frame_690).wait(252).call(this.frame_942).wait(194).call(this.frame_1136).wait(163).call(this.frame_1299).wait(120).call(this.frame_1419).wait(124).call(this.frame_1543).wait(119).call(this.frame_1662).wait(106).call(this.frame_1768).wait(226).call(this.frame_1994).wait(118).call(this.frame_2112).wait(182).call(this.frame_2294).wait(121).call(this.frame_2415).wait(180).call(this.frame_2595).wait(103).call(this.frame_2698).wait(143));

	// Frame_number
	this.frameNumberTxt = new cjs.Text("", "normal 500 9px 'Inter'", "#00CCCC");
	this.frameNumberTxt.name = "frameNumberTxt";
	this.frameNumberTxt.textAlign = "center";
	this.frameNumberTxt.lineHeight = 15;
	this.frameNumberTxt.lineWidth = 27;
	this.frameNumberTxt.parent = this;
	this.frameNumberTxt.setTransform(239.9277,622.8368,1.0748,1.0927);
	if(!lib.properties.webfonts['Inter']) {
		lib.webFontTxtInst['Inter'] = lib.webFontTxtInst['Inter'] || [];
		lib.webFontTxtInst['Inter'].push(this.frameNumberTxt);
	}

	this.timeline.addTween(cjs.Tween.get(this.frameNumberTxt).wait(2841));

	// Progress
	this.instance = new lib.circle_of_progress("synched",0);
	this.instance.setTransform(39.85,632.9,0.5089,0.5089,0,0,0,0.1,0.1);

	this.timeline.addTween(cjs.Tween.get(this.instance).to({x:240.45,y:635.6},2840).wait(1));

	// Line
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#999999").ss(1,1,1).p("APxAAI/iAA");
	this.shape.setTransform(140.75,633.25);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(2841));

	// Bar
	this.Progress_bar_btn = new lib.Progressbar();
	this.Progress_bar_btn.name = "Progress_bar_btn";
	this.Progress_bar_btn.setTransform(139.9,633.3,0.6027,0.5089,0,0,0,0,0.1);
	new cjs.ButtonHelper(this.Progress_bar_btn, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.Progress_bar_btn).wait(2841));

	// Go_forward
	this.go_forward_X_btn = new lib.goforwardbutton();
	this.go_forward_X_btn.name = "go_forward_X_btn";
	this.go_forward_X_btn.setTransform(179.7,659.2,0.3934,0.3925,0,0,0,0.1,0);
	new cjs.ButtonHelper(this.go_forward_X_btn, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.go_forward_X_btn).wait(2841));

	// go_to_end
	this.go_to_end_btn = new lib.gotoend();
	this.go_to_end_btn.name = "go_to_end_btn";
	this.go_to_end_btn.setTransform(231.4,658.8,0.4709,0.4721,0,0,0,0.6,0.2);
	new cjs.ButtonHelper(this.go_to_end_btn, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.go_to_end_btn).wait(2841));

	// Go_back
	this.go_back_X_btn = new lib.gobackbutton();
	this.go_back_X_btn.name = "go_back_X_btn";
	this.go_back_X_btn.setTransform(94.05,659.35,0.3934,0.3903,0,0,0,0.4,0.7);
	new cjs.ButtonHelper(this.go_back_X_btn, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.go_back_X_btn).wait(2841));

	// Play_button
	this.playBtn = new lib.Play_btn();
	this.playBtn.name = "playBtn";
	this.playBtn.setTransform(137.15,659.85,0.3982,0.3982,0,0,0,0.1,0);
	new cjs.ButtonHelper(this.playBtn, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.playBtn).wait(2841));

	// Pause
	this.pauseBtn = new lib.Pause_btn();
	this.pauseBtn.name = "pauseBtn";
	this.pauseBtn.setTransform(136.1,659.85,0.3982,0.3982,0,0,0,0.1,0);
	new cjs.ButtonHelper(this.pauseBtn, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.pauseBtn).wait(2841));

	// go_to_start
	this.PlayAgainBtn = new lib.gotostart();
	this.PlayAgainBtn.name = "PlayAgainBtn";
	this.PlayAgainBtn.setTransform(46.65,659.8,0.4709,0.4721,0,0,0,0.1,0.3);
	new cjs.ButtonHelper(this.PlayAgainBtn, 0, 1, 1);

	this.timeline.addTween(cjs.Tween.get(this.PlayAgainBtn).wait(2841));

	// rectangle
	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#000000").ss(1,1,1).p("AxxkdMAjjAAAQAxAAACA1QAAACAAACIAAHJQAAAegOAOQgMANgZAAMgjjAAAQgZAAgMgNQgOgOAAgeIAAnJQAAgCAAgCQABg1AyAAg");
	this.shape_1.setTransform(139.425,647.275);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFFFFF").s().p("AxxEeQgZAAgMgNQgOgOAAgeIAAnJIAAgEQABg1AyAAMAjjAAAQAxAAACA1IAAAEIAAHJQAAAegOAOQgMANgZAAg");
	this.shape_2.setTransform(139.425,647.275);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_2},{t:this.shape_1}]}).wait(2841));

	// Hand
	this.instance_1 = new lib.handbrown("synched",0);
	this.instance_1.setTransform(332.8,447.5,0.25,0.25,0,0,0,0.2,0.2);
	this.instance_1._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_1).wait(275).to({_off:false},0).to({x:214.9,y:326.85},26).wait(4).to({startPosition:0},0).to({x:326.35,y:436.8},24).wait(150).to({x:332.8,y:447.5},0).to({x:243.7,y:490.8},26).wait(4).to({startPosition:0},0).to({x:326.35,y:436.8},25).wait(63).to({startPosition:0},0).to({x:38.9,y:306.65},25).wait(4).to({startPosition:0},0).to({x:326.35,y:436.8},24).wait(249).to({x:327.7,y:443.85},0).to({x:167.9,y:541.6},19).wait(4).to({startPosition:0},0).to({x:326.35,y:436.8},25).wait(88).to({x:327.7,y:443.85},0).to({x:168.75,y:103.65},26).wait(4).to({startPosition:0},0).to({x:337.35,y:335.85},13).wait(77).to({startPosition:0},0).to({x:176.7,y:223.2},23).wait(4).to({startPosition:0},0).to({x:337.35,y:335.85},26).wait(1).to({startPosition:0},0).wait(18).to({startPosition:0},0).to({x:195.9,y:323.1},23).wait(4).to({startPosition:0},0).to({x:337.35,y:335.85},26).wait(42).to({startPosition:0},0).to({x:206.9,y:592.1},24).wait(5).to({startPosition:0},0).to({x:337.35,y:504.8},28).wait(122).to({startPosition:0},0).to({x:235.9,y:520.2},23).wait(4).to({startPosition:0},0).to({x:337.35,y:504.8},16).wait(15).to({x:342.7,y:314.2},0).to({x:259.95,y:229.2},6).wait(3).to({y:223.2},0).wait(3).to({startPosition:0},0).to({x:-51.1},38).wait(125).to({x:337.35,y:507.15},0).to({x:243.65,y:463.05},23).wait(4).to({startPosition:0},0).to({x:337.35,y:507.15},19).wait(35).to({y:230.2},0).to({x:163.9,y:104.1},31).wait(18).to({startPosition:0},0).to({x:165.9,y:261.2},51).wait(34).to({startPosition:0},0).to({x:337.35,y:341.2},16).wait(152).to({y:230.2},0).to({x:163.9,y:104.1},41).wait(15).to({startPosition:0},0).to({x:165.9,y:223.2},27).wait(7).to({startPosition:0},0).to({x:337.35,y:341.2},38).wait(67).to({y:504.8},0).to({x:206.9,y:590.65},23).wait(4).to({startPosition:0},0).to({x:337.35,y:504.8},16).wait(53).to({x:330.35,y:452.8},0).to({x:234.9,y:377.1},23).wait(7).to({startPosition:0},0).to({x:330.35,y:452.8},27).wait(76).to({x:327.7,y:443.85},0).to({x:244.7,y:385.6},26).wait(4).to({startPosition:0},0).to({x:327.7,y:443.85},21).wait(46).to({startPosition:0},0).to({x:234.7,y:346.1},27).wait(6).to({startPosition:0},0).to({x:327.7,y:443.85},24).wait(146));

	// Tap_slide_animation
	this.instance_2 = new lib.TouchAnimation("synched",0,false);
	this.instance_2.setTransform(202.6,267.2,1,1,0,0,0,-5,-272.1);
	this.instance_2._off = true;

	this.instance_3 = new lib.Touch("synched",0);
	this.instance_3.setTransform(247.35,176.55,0.2499,0.2301,0,0,0,1.2,0.2);
	this.instance_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_2).wait(301).to({_off:false},0).to({_off:true},4).wait(200).to({_off:false,x:231.4,y:431.15},0).to({_off:true},4).wait(113).to({_off:false,x:26.6,y:247},0).to({_off:true},4).wait(292).to({_off:false,x:155.6,y:481.95},0).to({_off:true},4).wait(139).to({_off:false,x:156.45,y:44},0).to({_off:true},4).wait(113).to({_off:false,x:164.4,y:163.55},0).to({_off:true},4).wait(68).to({_off:false,x:183.6,y:263.45},0).to({_off:true},4).wait(92).to({_off:false,x:194.6,y:532.45},0).to({_off:true},5).wait(173).to({_off:false,x:223.6,y:460.55},0).to({_off:true},4).wait(229).to({_off:false,x:231.35,y:403.4},0).to({_off:true},4).wait(85).to({_off:false,x:151.6,y:44.45},0).to({_off:true},6).wait(79).to({_off:false,x:153.6,y:201.55},0).to({_off:true},18).wait(209).to({_off:false,x:151.6,y:44.45},0).to({_off:true},8).wait(34).to({_off:false,x:153.6,y:163.55},0).to({_off:true},6).wait(129).to({_off:false,x:194.6,y:531},0).to({_off:true},4).wait(92).to({_off:false,x:222.6,y:317.45},0).to({_off:true},7).wait(129).to({_off:false,x:232.4,y:325.95},0).to({_off:true},4).wait(94).to({_off:false,x:222.4,y:286.45},0).to({_off:true},6).wait(170));
	this.timeline.addTween(cjs.Tween.get(this.instance_3).wait(1568).to({_off:false},0).wait(3).to({startPosition:0},0).to({x:42.1},25).to({_off:true},1).wait(1244));

	// PhoneFrame
	this.instance_4 = new lib.PhoneFrame2_618x2871withoutheader();

	this.timeline.addTween(cjs.Tween.get(this.instance_4).wait(2841));

	// Header_for_PhoneFrame
	this.instance_5 = new lib.AccuracyCheckScreenHeader();
	this.instance_5.setTransform(5,10);

	this.instance_6 = new lib.Voicestudioscreenheader();
	this.instance_6.setTransform(9,13);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_5,p:{x:5}}]}).to({state:[{t:this.instance_6}]},1942).to({state:[{t:this.instance_5,p:{x:6}}]},261).to({state:[{t:this.instance_6}]},465).wait(173));

	// AI_Image
	this.instance_7 = new lib.Accuracycheck2menreduced();
	this.instance_7.setTransform(23,328);

	this.instance_8 = new lib.Accuracycheckexpert();
	this.instance_8.setTransform(23,328);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_7}]},48).to({state:[{t:this.instance_8}]},186).to({state:[]},82).wait(2525));

	// AI_Image_Border_Black_Inner
	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f("#000000").s().p("AzhTiMAAAgnDMAnDAAAMAAAAnDg");
	this.shape_3.setTransform(143,447.85);
	this.shape_3._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_3).wait(48).to({_off:false},0).to({_off:true},268).wait(2525));

	// AI_Image_Border_Gray_Outer
	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f("#666666").s().p("Az/T9MAAAgn/QAAAGT/AAQUAAAAAgGMAAAAn/QAAAG0AAAQz/AAAAgGg");
	this.shape_4.setTransform(143,448.175);
	this.shape_4._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_4).wait(48).to({_off:false},0).to({_off:true},268).wait(2525));

	// Red_circle
	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f().s("#FF0000").ss(3,1,1).p("AEYAAQAABFhSAwQhSAwh0AAQhzAAhSgwQhSgwAAhFQAAhDBSgxQBSgwBzAAQB0AABSAwQBSAxAABDg");
	this.shape_5.setTransform(157.108,103.55,2.3568,1);
	this.shape_5._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape_5).wait(1073).to({_off:false},0).to({_off:true},74).wait(7).to({_off:false,y:179.55},0).to({_off:true},28).wait(675).to({_off:false,scaleX:1.7736,x:139.4769,y:215.8},0).to({_off:true},85).wait(899));

	// Phases_menu
	this.instance_9 = new lib.PhaseDropdown();
	this.instance_9.setTransform(99,48);
	this.instance_9._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_9).wait(1062).to({_off:false},0).to({_off:true},120).wait(668).to({_off:false},0).to({_off:true},92).wait(220).to({_off:false},0).to({_off:true},41).wait(638));

	// Misc_overlays
	this.instance_10 = new lib.VoiceStudioLock();
	this.instance_10.setTransform(8,37);

	this.instance_11 = new lib._8AffirmAccuracyCheckbubble();
	this.instance_11.setTransform(27,192);

	this.instance_12 = new lib.Pleasecheckmessage();
	this.instance_12.setTransform(26,256);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_10}]},1942).to({state:[]},261).to({state:[{t:this.instance_11,p:{x:27,y:192}}]},167).to({state:[{t:this.instance_12}]},65).to({state:[{t:this.instance_11,p:{x:28,y:196}}]},136).to({state:[]},97).wait(173));

	// BTW
	this.instance_13 = new lib._1AccuracyCheckPhasebubble();
	this.instance_13.setTransform(65,71);

	this.instance_14 = new lib._2Youneedtobeginbubble();
	this.instance_14.setTransform(94,268);

	this.instance_15 = new lib._4PlayAudiobubble();
	this.instance_15.setTransform(16,274);

	this.instance_16 = new lib._5Revisebubble();
	this.instance_16.setTransform(46,71);

	this.instance_17 = new lib._6Confirmbubble();
	this.instance_17.setTransform(84,334);

	this.instance_18 = new lib._7ContinueCheckingbubble();
	this.instance_18.setTransform(89,268);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_13}]}).to({state:[{t:this.instance_14}]},316).to({state:[{t:this.instance_15}]},190).to({state:[{t:this.instance_16}]},427).to({state:[{t:this.instance_17}]},330).to({state:[{t:this.instance_18}]},264).to({state:[]},232).wait(1082));

	// Pause_button
	this.instance_19 = new lib.PauseButton();
	this.instance_19.setTransform(20,250);
	this.instance_19._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_19).wait(625).to({_off:false},0).to({_off:true},51).wait(2165));

	// Play_button
	this.instance_20 = new lib.Playbutton();
	this.instance_20.setTransform(16,246);

	this.instance_21 = new lib.Tween27("synched",0);
	this.instance_21.setTransform(167,260);

	this.instance_22 = new lib.Tween28("synched",0);
	this.instance_22.setTransform(28.85,260);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_20}]}).to({state:[]},625).to({state:[{t:this.instance_20}]},51).to({state:[{t:this.instance_21}]},895).to({state:[{t:this.instance_22}]},38).wait(1232));

	// Mask_for_blue_slider (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	var mask_graphics_0 = new cjs.Graphics().p("AryU4IAAiAMAgLAAAIAACAg");
	var mask_graphics_626 = new cjs.Graphics().p("AryU4IAAiAMAgLAAAIAACAg");

	this.timeline.addTween(cjs.Tween.get(mask).to({graphics:mask_graphics_0,x:130.5302,y:133.65}).wait(626).to({graphics:mask_graphics_626,x:130.5302,y:133.65}).wait(50).to({graphics:null,x:0,y:0}).wait(2165));

	// Blue_slider_w_line
	this.instance_23 = new lib.Tween4("synched",0);
	this.instance_23.setTransform(-37.75,260.75);

	var maskedShapeInstanceList = [this.instance_23];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get(this.instance_23).wait(626).to({startPosition:0},0).to({x:123.6,y:261.15},50).to({_off:true},1).wait(2164));

	// Blue_Dot_only
	this.instance_24 = new lib.Bluedot("synched",0);
	this.instance_24.setTransform(60.2,261.25);

	this.instance_25 = new lib.Tween29("synched",0);
	this.instance_25.setTransform(198.35,261.25);
	this.instance_25._off = true;

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_24,p:{x:60.2}}]},677).to({state:[{t:this.instance_25}]},894).to({state:[{t:this.instance_25}]},38).to({state:[{t:this.instance_24,p:{x:56.8}}]},1).wait(1231));
	this.timeline.addTween(cjs.Tween.get(this.instance_25).wait(1571).to({_off:false},0).to({x:-82.15},38).to({_off:true,x:56.8},1).wait(1231));

	// Title_or_Page_1_2_3
	this.shape_6 = new cjs.Shape();
	this.shape_6.graphics.f("#FFFFFF").s().p("AgUAcQgKgKAAgRQAAgRAKgKQAJgKANAAQAHAAAFACQAFACAEAEQAEAEACAGQACAGAAAIIAAAGIgwAAQAAAMAGAGQAGAHAKAAIAIgBIAHgCIAFgDIAEgDIAAAAIAAANIgFADIgFABIgHACIgHAAQgQAAgJgJgAgFgZIgHAEIgEAHIgBAHIAkAAQAAgEgBgEIgDgGIgFgEQgEgBgEAAQgEAAgDABg");
	this.shape_6.setTransform(258.825,260.475);

	this.shape_7 = new cjs.Shape();
	this.shape_7.graphics.f("#FFFFFF").s().p("AgFAyIAAhiIALAAIAABig");
	this.shape_7.setTransform(253.45,259.1);

	this.shape_8 = new cjs.Shape();
	this.shape_8.graphics.f("#FFFFFF").s().p("AgHApQgFgFAAgNIAAgmIgIAAIAAgKIAIAAIAAgVIAMAAIAAAVIAVAAIAAAKIgVAAIAAAgIAAAJQAAADAAADIAEADIAGABIAGgBIAEgCIABAAIAAALIgHACIgGABQgJAAgGgGg");
	this.shape_8.setTransform(249.35,259.55);

	this.shape_9 = new cjs.Shape();
	this.shape_9.graphics.f("#FFFFFF").s().p("AgFAwIAAhHIALAAIAABHgAgGgiIAAgNIANAAIAAANg");
	this.shape_9.setTransform(245.125,259.3);

	this.shape_10 = new cjs.Shape();
	this.shape_10.graphics.f("#FFFFFF").s().p("AgGAvIAAhSIgfAAIAAgLIBLAAIAAALIggAAIAABSg");
	this.shape_10.setTransform(239.35,259.325);

	this.instance_26 = new lib.Tween30("synched",0);
	this.instance_26.setTransform(389.85,259.6);
	this.instance_26._off = true;

	this.text = new cjs.Text("Page 1", "13px 'Tahoma'", "#FFFFFF");
	this.text.lineHeight = 18;
	this.text.lineWidth = 44;
	this.text.parent = this;
	this.text.setTransform(230.4,249.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6}]}).to({state:[{t:this.instance_26}]},1571).to({state:[{t:this.instance_26}]},38).to({state:[{t:this.text}]},1).to({state:[{t:this.shape_10},{t:this.shape_9},{t:this.shape_8},{t:this.shape_7},{t:this.shape_6}]},1058).wait(173));
	this.timeline.addTween(cjs.Tween.get(this.instance_26).wait(1571).to({_off:false},0).to({x:119.65,y:257.75},38).to({_off:true,x:230.4,y:249.5,text:"Page 1",font:"13px 'Tahoma'",color:"#FFFFFF",textAlign:0,lineHeight:17.7,lineWidth:44},1).wait(1231));

	// Middle_bar_background
	this.instance_27 = new lib.Backgroundforplayaudio("synched",0);
	this.instance_27.setTransform(142.95,260.55);
	this.instance_27.alpha = 0.3984;

	this.timeline.addTween(cjs.Tween.get(this.instance_27).wait(2841));

	// Phase_header
	this.instance_28 = new lib.AccuracyCheckHeader();
	this.instance_28.setTransform(9,37);

	this.instance_29 = new lib.Voicestudioheader();
	this.instance_29.setTransform(7,37);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_28}]}).to({state:[{t:this.instance_29}]},2668).wait(173));

	// Gray_check
	this.instance_30 = new lib.Graycheckmark();
	this.instance_30.setTransform(170,524);

	this.instance_31 = new lib.Tween41("synched",0);
	this.instance_31.setTransform(471,548.5);
	this.instance_31._off = true;

	this.instance_32 = new lib.Tween42("synched",0);
	this.instance_32.setTransform(194,547.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_30}]}).to({state:[]},1351).to({state:[{t:this.instance_31}]},220).to({state:[{t:this.instance_32}]},38).to({state:[]},729).wait(503));
	this.timeline.addTween(cjs.Tween.get(this.instance_31).wait(1571).to({_off:false},0).to({_off:true,x:194,y:547.5},38).wait(1232));

	// Green_check
	this.instance_33 = new lib.greencheckmark("synched",0);
	this.instance_33.setTransform(195,548.5,1,1,0,0,0,25,24.5);
	this.instance_33._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_33).wait(1351).to({_off:false},0).wait(93).to({startPosition:0},0).to({regY:24.6,scaleX:1.2449,scaleY:1.2449,y:548.6},5).to({regY:24.5,scaleX:1,scaleY:1,x:196,y:548.5},5).wait(1).to({x:195},0).to({regY:24.6,scaleX:1.2449,scaleY:1.2449,y:548.6},5).to({regY:24.5,scaleX:1,scaleY:1,y:548.5},5).wait(106).to({startPosition:0},0).to({x:-75.8,y:547.05},38).to({_off:true},1).wait(728).to({_off:false,x:195,y:548.5},0).to({_off:true},329).wait(174));

	// Bible_verse___script
	this.instance_34 = new lib.Verseandscripttitlepage();
	this.instance_34.setTransform(8,281);

	this.instance_35 = new lib.Tween33("synched",0);
	this.instance_35.setTransform(281,324);
	this.instance_35._off = true;

	this.instance_36 = new lib.Tween34("synched",0);
	this.instance_36.setTransform(144,324);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_34}]}).to({state:[{t:this.instance_35}]},1571).to({state:[{t:this.instance_35}]},38).to({state:[{t:this.instance_36}]},1).to({state:[]},1058).wait(173));
	this.timeline.addTween(cjs.Tween.get(this.instance_35).wait(1571).to({_off:false},0).to({x:10.2,y:322.55},38).to({_off:true},1).wait(1231));

	// Log_button
	this.instance_37 = new lib.Logbutton();
	this.instance_37.setTransform(60,520);

	this.instance_38 = new lib.Tween35("synched",0);
	this.instance_38.setTransform(223.5,545.5);
	this.instance_38._off = true;

	this.instance_39 = new lib.Tween36("synched",0);
	this.instance_39.setTransform(85.5,545.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_37}]}).to({state:[{t:this.instance_38}]},1571).to({state:[{t:this.instance_38}]},38).to({state:[{t:this.instance_39}]},1).to({state:[]},1058).wait(173));
	this.timeline.addTween(cjs.Tween.get(this.instance_38).wait(1571).to({_off:false},0).to({x:-47.3,y:544.05},38).to({_off:true},1).wait(1231));

	// Microphone
	this.instance_40 = new lib.whitemicrophonebuttononbluebackground();
	this.instance_40.setTransform(34,546);
	this.instance_40._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_40).wait(2668).to({_off:false},0).wait(173));

	// Blue_bottom_bar
	this.instance_41 = new lib.Bluebarblank();
	this.instance_41.setTransform(10,545);
	this.instance_41._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance_41).wait(2668).to({_off:false},0).wait(173));

	// Gray_bottom_section
	this.instance_42 = new lib.Graybottonsection();
	this.instance_42.setTransform(9,278,1,1.2222);

	this.timeline.addTween(cjs.Tween.get(this.instance_42).wait(2841));

	// Jesus_Title
	this.instance_43 = new lib.Jésusetlatempête();
	this.instance_43.setTransform(74,126);

	this.instance_44 = new lib.Tween39("synched",0);
	this.instance_44.setTransform(142.5,160);
	this.instance_44._off = true;

	this.instance_45 = new lib.Tween40("synched",0);
	this.instance_45.setTransform(-130.5,160);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_43}]}).to({state:[{t:this.instance_44}]},1571).to({state:[{t:this.instance_45}]},38).to({state:[]},1).to({state:[{t:this.instance_43}]},1058).wait(173));
	this.timeline.addTween(cjs.Tween.get(this.instance_44).wait(1571).to({_off:false},0).to({_off:true,x:-130.5},38).wait(1232));

	// Page_Images
	this.instance_46 = new lib.Graybackground();
	this.instance_46.setTransform(8,77);

	this.instance_47 = new lib.Tween37("synched",0);
	this.instance_47.setTransform(280,179);
	this.instance_47._off = true;

	this.instance_48 = new lib.Tween24("synched",0);
	this.instance_48.setTransform(10.2,179);

	this.shape_11 = new cjs.Shape();
	var sprImg_shape_11 = cjs.SpriteSheetUtils.extractFrame(ss["Test 4_Accuracy Check 3_atlas_NP_1"],0);
	sprImg_shape_11.onload = function(){
		this.shape_11.graphics.bf(sprImg_shape_11, null, new cjs.Matrix2D(1,0,0,1,-136,-100)).s().p("A1PPoIAA/PMAqfAAAIAAfPg")
	}.bind(this);
	this.shape_11.setTransform(146.2,177);

	this.instance_49 = new lib._1();
	this.instance_49.setTransform(6,77);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_46}]}).to({state:[{t:this.instance_47}]},1571).to({state:[{t:this.instance_48}]},38).to({state:[{t:this.shape_11}]},1).to({state:[{t:this.instance_49}]},334).to({state:[{t:this.instance_46}]},724).wait(173));
	this.timeline.addTween(cjs.Tween.get(this.instance_47).wait(1571).to({_off:false},0).to({_off:true,x:10.2},38).wait(1232));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(-118.3,338.5,671.3,338.4);
// library properties:
lib.properties = {
	id: 'D314B53C362E7C44BD4F100859E91301',
	width: 287,
	height: 677,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	webfonts: {},
	manifest: [
		{src:"images/Test 4_Accuracy Check 3_atlas_P_1.png?1740676117567", id:"Test 4_Accuracy Check 3_atlas_P_1"},
		{src:"images/Test 4_Accuracy Check 3_atlas_NP_1.jpg?1740676117568", id:"Test 4_Accuracy Check 3_atlas_NP_1"},
		{src:"sounds/ENGVoiceStudio_Marker01.mp3?1740676117690", id:"ENGVoiceStudio_Marker01"},
		{src:"sounds/ENGVoiceStudio_Marker03.mp3?1740676117690", id:"ENGVoiceStudio_Marker03"},
		{src:"sounds/ENGVoiceStudio_Marker04.mp3?1740676117690", id:"ENGVoiceStudio_Marker04"},
		{src:"sounds/ENGVoiceStudio_Marker05.mp3?1740676117690", id:"ENGVoiceStudio_Marker05"},
		{src:"sounds/ENGVoiceStudio_Marker11.mp3?1740676117690", id:"ENGVoiceStudio_Marker11"},
		{src:"sounds/ENGVoiceStudio_Marker12.mp3?1740676117690", id:"ENGVoiceStudio_Marker12"},
		{src:"sounds/ENGVoiceStudio_Marker13.mp3?1740676117690", id:"ENGVoiceStudio_Marker13"},
		{src:"sounds/ENGVoiceStudio_Marker14.mp3?1740676117690", id:"ENGVoiceStudio_Marker14"},
		{src:"sounds/ENGVoiceStudio_Marker15.mp3?1740676117690", id:"ENGVoiceStudio_Marker15"},
		{src:"sounds/ENGVoiceStudio_Marker16.mp3?1740676117690", id:"ENGVoiceStudio_Marker16"},
		{src:"sounds/ENGVoiceStudio_Marker17.mp3?1740676117690", id:"ENGVoiceStudio_Marker17"},
		{src:"sounds/ENGVoiceStudio_Marker18.mp3?1740676117690", id:"ENGVoiceStudio_Marker18"},
		{src:"sounds/ENGVoiceStudio_Marker19.mp3?1740676117690", id:"ENGVoiceStudio_Marker19"},
		{src:"sounds/ENGVoiceStudio_Marker20.mp3?1740676117690", id:"ENGVoiceStudio_Marker20"},
		{src:"sounds/ENGVoiceStudio_Marker21.mp3?1740676117690", id:"ENGVoiceStudio_Marker21"},
		{src:"sounds/ENGVoiceStudio_Marker22.mp3?1740676117690", id:"ENGVoiceStudio_Marker22"},
		{src:"sounds/ENGVoiceStudio_Marker23.mp3?1740676117690", id:"ENGVoiceStudio_Marker23"},
		{src:"sounds/ENGVoiceStudio_Marker24.mp3?1740676117690", id:"ENGVoiceStudio_Marker24"},
		{src:"sounds/ENGVoiceStudio_Marker25.mp3?1740676117690", id:"ENGVoiceStudio_Marker25"},
		{src:"sounds/Jesus_and_the_storm_Portuguese_OnildoFRocha_pvc_s50_sb75_se0_b_m2.mp3?1740676117690", id:"Jesus_and_the_storm_Portuguese_OnildoFRocha_pvc_s50_sb75_se0_b_m2"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['D314B53C362E7C44BD4F100859E91301'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}


an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused || stageChild.ignorePause){
			stageChild.syncStreamSounds();
		}
	}
}
an.handleFilterCache = function(event) {
	if(!event.paused){
		var target = event.target;
		if(target){
			if(target.filterCacheList){
				for(var index = 0; index < target.filterCacheList.length ; index++){
					var cacheInst = target.filterCacheList[index];
					if((cacheInst.startFrame <= target.currentFrame) && (target.currentFrame <= cacheInst.endFrame)){
						cacheInst.instance.cache(cacheInst.x, cacheInst.y, cacheInst.w, cacheInst.h);
					}
				}
			}
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;