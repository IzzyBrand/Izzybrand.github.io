
setInterval(update, 5000);

function update() {
	$('.profileLink').each(function(){
		var t = nameSwitch($(this).text());
		$(this).text(t)
	})

	$('.UFICommentActorName').each(function(){
		var t = nameSwitch($(this).text());
		$(this).text(t)
	})

	$('._1frb').each(function(){
		var t = nameSwitch($(this).text());
		$(this).text(t)
	})

	$('.fwb fcg').each(function(){
		var t = nameSwitch($(this).text());
		$(this).text(t)
	})

	$('#fb-timeline-cover-name').each(function(){
		var t = nameSwitch($(this).text());
		$(this).text(t)
	})
}

// switches around the first and letters amongst words in a name
function nameSwitch(name) {
	console.log(name)
	var splitName = name.split(" ");
	var pres = [];
	var posts = [];
	for (var i = 0; i < splitName.length; i++) {
		var splitWord = getPrefix(splitName[i]);
		pres[(i + 1)%splitName.length] = splitWord[0];
		posts[i] = splitWord[1];
	}
	var newName = ""
	for (var i = 0; i < splitName.length; i++) {
		newName += capitalizeFirstLetter((pres[i] + posts[i] + " ").toLowerCase());
	}
	console.log(newName)
	return newName.slice(0, -1);;

}

// gets the chars up the first vowel in a first string, and the remainders in the second string
function getPrefix(word) {
	var letters = word.split("");
	var pre = "";
	var post = "";
	var foundVowel = false;
	for (var i = 0; i < letters.length; i++) {
		foundVowel = isVowel(letters[i].toLowerCase()) || foundVowel;
		if (!foundVowel) {
			pre += letters[i];
		}
		else {
			post += letters[i];
		}
	}
	return [pre, post];
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// returns true if a (lowercase) letter is a vowel
function isVowel(letter) {
  return (letter == "a") || (letter == "e") || (letter == "i") || (letter == "o") || (letter == "u") || (letter == "y");
}
