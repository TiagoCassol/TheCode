const fs = require('fs');

const words = require('./words.json');

const wordsByLength = {};
for (const wordObj of words) {
  const wordLength = wordObj.length;
  if (!wordsByLength[wordLength]) {
    wordsByLength[wordLength] = [];
  }
  wordsByLength[wordLength].push(wordObj);
}

fs.writeFileSync('words-by-length.json', JSON.stringify(wordsByLength, null, 2));