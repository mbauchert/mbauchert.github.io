var scaleDegrees = document.getElementById('scaleDegrees');
var sortableScaleDegrees = Sortable.create(scaleDegrees);

var keyChangeDegrees = document.getElementById('keyChangeDegrees');
var sortableKeyChangeDegrees = Sortable.create(keyChangeDegrees);

var bpmSlider = document.getElementById("bpmSlider");
var bpmOutput = document.getElementById("bpmSliderValue");
bpmOutput.innerHTML = "BPM: ".concat(bpmSlider.value); // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
bpmSlider.oninput = function() {
	bpmOutput.innerHTML = "BPM: ".concat(this.value);
}

var keyChangeSlider = document.getElementById("keyChangeSlider");
var keyChangeOutput = document.getElementById("keyChangeSliderValue");
keyChangeOutput.innerHTML = "Measures Per Key Change: ".concat(keyChangeSlider.value); // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
keyChangeSlider.oninput = function() {
	keyChangeOutput.innerHTML = "Measures Per Key Change: ".concat(this.value);
}

function getLink()
{			
	var scaleDegreeRankings = (sortableScaleDegrees.toArray()).toString();
	scaleDegreeRankings = scaleDegreeRankings.replace(new RegExp(',', 'g'), '');
	
	var keyChangeRankings = (sortableKeyChangeDegrees.toArray()).toString();
	keyChangeRankings = keyChangeRankings.replace(new RegExp(',', 'g'), '');
	
	var bpm = bpmSlider.value;
	var measuresPerKeyChange = keyChangeSlider.value;
	var seed = Math.floor(Math.random() * 9999);
	
	var customLink = document.getElementById('customLink');
	customLink.value = window.location + "?sdr=" + scaleDegreeRankings + "&kcr=" + keyChangeRankings + "&bpm=" + bpm + "&mpk=" + measuresPerKeyChange + "&seed=" + seed;
}	
