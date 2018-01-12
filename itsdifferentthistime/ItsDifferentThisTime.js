var initial = {
	scaleDegreeRankings: ["R",1,3,5,7,2,4,6],
	keyChangeRankings: [6,1,5,4,3,2],
	bpm: 140,
	measuresPerKeyChange: 10,
	seed: "42",
	setup: function()
	{
	//put URL to initial value setup here	
	}
};


//Set Scales (original used Major and Harmonic Minor scales)
var scale = {
	major: [2,2,1,2,2,2,1],
	minor: [2,1,2,2,1,3,1],
	chromatic: ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
};

//Weighted Lists for Random Key Changing and Note Selection
var weighted = {
	scaleDegreesList: [],
	keyChangeList: [],
	listsSetup: function() 
	{
		this.scaleDegreeList = createWeightedList(initial.scaleDegreeRankings);
		this.keyChangeList = createWeightedList(initial.keyChangeRankings);
	}	
};

function createWeightedList(nonWeightedList)
{
	var newWeightedList = [];
	
	var index = 0;
	var i;	
	for (i = 0; i < nonWeightedList.length; i++)
	{
		var j;
		for (j = 0; j < (nonWeightedList.length - i); j++) 
		{
			
			newWeightedList[index] = nonWeightedList[i];
			index++;
		}
	}
	//console.log(newWeightedList.length);
	return newWeightedList;
};



var current = {
	//CURRENT KEY
	key: [],
	keyGetsChanged: function()
	{
		var weightedRandomIndex = weighted.keyChangeList[Math.seededRandom(0,weighted.keyChangeList.length)];
		
		var newTonic = this.key[weightedRandomIndex - 1];		
		var newMediant = this.key[weightedRandomIndex + 1];
		
		var thirdQuality = determineThirdQuality(newTonic,newMediant);
		
		if (newTonic != this.key[0]) {
			this.setNewKey(newTonic, thirdQuality);
		} else /*for parallel maj/min*/ {
			if (thirdQuality == "major") {
				this.setNewKey(newTonic, "minor");
			} else {
				this.setNewKey(newTonic, "major");
			}			
		} 
	},
	setNewKey: function(tonic, quality) 
	{
		//set the root for the new key
		var newKey = [tonic];
		
		var stepCount = scale.chromatic.indexOf(tonic);
		
		var i;
		for (i = 1; i < scale[quality].length; i++){
			stepCount = stepCount + scale[quality][i-1];
			if (stepCount > 11) {
				stepCount = stepCount - 12;
			}
			newKey[i] = scale.chromatic[stepCount];
		}
		//set the new key
		this.key = newKey;
	},	
	keySetup: function()
	{
		var randomIndex = Math.seededRandom(0, 12);
		var initialTonic = scale.chromatic[randomIndex];
		console.log(randomIndex);
		this.setNewKey(initialTonic, "major");
	},
	//CURRENT NOTE
	note: "C",
	noteGets: function(scaleDegree)
	{	
		if (scaleDegree != "R") {
			this.note = this.key[scaleDegree - 1];
		} else {			
			this.note = "R";
		}
	},
	//CURRENT MEASURE
	measure: 0,
	measureBecomesThisMeasure: function() 
	{
		this.measure++;
	}
};

function determineThirdQuality (tonic, mediant) 
{	
	if (scale.chromatic.indexOf(mediant) - scale.chromatic.indexOf(tonic) == 4) {
		return "major";
	} else {
		return "minor";
	}
};

//used to determine when to change keys
function thisMeasureIsRight(currentMeasure) 
{
	if (currentMeasure != initial.measuresPerKeyChange) {
		return false;
	} else {
		return true;				
	}
};

//used to make consistent key changes
Math.seededRandom = function(max, min) {
    max = max || 1;
    min = min || 0;
 
    initial.seed = (initial.seed * 9301 + 49297) % 233280;
    var rnd = initial.seed / 233280;
 
    return Math.floor(min + rnd * (max - min));
};



//Create a loop
var thisPiece = new Tone.Loop(function(time)
{
	current.measureBecomesThisMeasure();	
	hideOldNote();
	playAndDisplayNewNote(time);
	console.log(current.note);
	
	if (thisMeasureIsRight(current.measure)) {
		current.keyGetsChanged();
	}	
}, "1n");

function hideOldNote()
{
	document.getElementById(current.note).style.display = "none";
};

function playAndDisplayNewNote(time) 
{
	var randomIndex = Math.floor(Math.random() * weighted.scaleDegreeList.length);
	var newScaleDegree = weighted.scaleDegreeList[randomIndex];
	current.noteGets(newScaleDegree);
	//display the new note
	document.getElementById(current.note).style.display = "inline";
	
	//play the note if not rest
	if (current.note != "R") {
		guideTone.triggerAttackRelease(current.note.concat("4"), "2n", time);
	}
};
//repeat until time to change keys
//if time to change key, set the new key based on the seeded probability

weighted.listsSetup();
current.keySetup();

//setup Tone.js
//pass in the audio context
var context = new AudioContext();
Tone.setContext(context);
//on iOS, the context will be started on the first valid user action on the #playButton element
//StartAudioContext(context, "#playButton");
StartAudioContext(Tone.context, '#playButton');

//Tone.context.latencyHint = 'playback';


//create a synth and connect it to the master output (your speakers)
var guideTone = new Tone.Synth();
var volume = new Tone.Volume(0);
guideTone.chain(volume, Tone.Master);

Tone.Transport.bpm.value = initial.bpm;

//play the piece
thisPiece.start(0).stop('180m'); 



//when finished, toggle the play button and play the rest




function toggleSound() {				
	var currentState = document.getElementById("soundOnOff").innerHTML;
	 

	if (currentState == "volume_up") {
		volume.mute = true;
		document.getElementById("soundOnOff").innerHTML = "volume_off";					
	}else {
		volume.mute = false;
		document.getElementById("soundOnOff").innerHTML = "volume_up";					
	}				
};

function togglePlayStop() {				
	var currentState = document.getElementById("playStop").innerHTML;
	Tone.Transport.start('+0.1');
	if (currentState == "play_arrow") {		
		document.getElementById("playStop").innerHTML = "stop";					
	}else {
		Tone.Transport.stop();
		document.getElementById("playStop").innerHTML = "play_arrow";					
	}				
};