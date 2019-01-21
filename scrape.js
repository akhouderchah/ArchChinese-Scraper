var scrape_text = "";

// Popular character definition.
var character = document.getElementById('characterTitle').childNodes[0].innerText;
var traditionalCharacter = "";
var definitionElements = document.getElementById('charDef').childNodes;
var currentContext = "";
var pinyin = [];
var definitions = [];

for (i=0; i < definitionElements.length; i++) {
  switch (definitionElements[i].tagName) {
	case "A":
	  if (currentContext.includes("Definition:")) {
		definitions.push(definitionElements[i].innerText)
	  } else if (currentContext.includes("Simplified Form:")) {
		traditionalCharacter = character;
		character = definitionElements[i].innerText;
	  } else if (currentContext.includes("Traditional Form:")) {
		traditionalCharacter = definitionElements[i].innerText;
	  }
	  break;
	case "SPAN":
	  currentContext = definitionElements[i].innerText;
	  if (currentContext.includes("Pinyin:")) {
		i += 1;
		for (j=0; j < definitionElements[i].childNodes.length; j++) {
		  if (definitionElements[i].childNodes[j] != undefined &&
			  definitionElements[i].childNodes[j].tagName == "A") {
			pinyin.push(definitionElements[i].childNodes[j].innerText);
		  }
		}
	  }
	  break;
  }
}

pinyin = pinyin.join("/");
definitions = definitions.join(", ");
if (traditionalCharacter.length != 0) {
  scrape_text += character + ";" + pinyin + " (simpl);" + definitions + "\n";
  scrape_text += traditionalCharacter + ";" + pinyin + " (trad);" + definitions + "\n";
} else {
  scrape_text += character + ";" + pinyin + ";" + definitions + "\n";
}

// Populate word objects.
var words = document.getElementsByClassName("word-container");
for(i=0; i < words.length; i++) {
  var wordForms = words[i].innerText.split(/\r?\n/);
  scrape_text += wordForms[0];
  if (1 < wordForms.length) {
	scrape_text += '/' + wordForms[1].slice(1, -1);
  }

  // 1: pinyin
  // 2: definition
  // 3: type of word
  // 4: (MW) or HSK
  // 5: (HSK)
  var definitionComponents = /\[ (.*) \] (.*)\r?\n(?:\[([^\]]*)\]\s*)?(?:\[([^\]]*)\]\s*)?(?:\[([^\]]*)\]\s*)?/.exec(
	  words[i].parentNode.childNodes[2].innerText
  )
  if (definitionComponents == undefined) {
	alert(words[i].parentNode.childNodes[2].innerText)
	continue;
  }

  var measureIndex = -1;
  var measureIndicator = 'M.W.';
  if (definitionComponents[4] != undefined &&
	  definitionComponents[4].includes(measureIndicator)) {
	measureIndex = 4;
  } else if (definitionComponents[5] != undefined &&
			 definitionComponents[5].includes(measureIndicator)) {
	measureIndex = 5;
  }

  var hasMeasure = (measureIndex != -1);
  if (hasMeasure) {
	scrape_text += ' (+measure)';
  }
  scrape_text += ' [' + definitionComponents[1] + ']';
  scrape_text += ';' + definitionComponents[2];
  if (hasMeasure) {
	var measures = definitionComponents[measureIndex].slice(6).split(/(?=[\s\S])/u).join();
	scrape_text += ' (measure: ' + measures + ')';
  }
  scrape_text += '\n';
}

copyTextToClipboard(scrape_text);
alert(scrape_text);

function copyTextToClipboard(text) {
  var text_area = document.createElement("textarea");
  text_area.textContent = text;

  document.body.appendChild(text_area);

  text_area.select();
  document.execCommand('copy');
  text_area.blur();

  document.body.removeChild(text_area);
}
