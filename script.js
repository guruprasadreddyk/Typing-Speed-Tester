// Basic vocabulary pool for constructing new words/sentences
const nouns = ["cat", "ocean", "dream", "forest", "river", "fire", "star", "path", "storm", "mind"];
const verbs = ["runs", "flows", "shines", "whispers", "glows", "fades", "moves", "calls", "rises"];
const adjectives = ["silent", "bright", "cold", "dark", "ancient", "gentle", "wild", "hidden"];
const adverbs = ["quickly", "softly", "silently", "suddenly", "peacefully", "brightly"];
const connectors = ["and", "but", "because", "while", "as"];

// Generate semi-random meaningful sentences
function generateMeaningfulSentence() {
    const subject = `The ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
    const verbPhrase = `${verbs[Math.floor(Math.random() * verbs.length)]} ${adverbs[Math.floor(Math.random() * adverbs.length)]}`;
    const connector = connectors[Math.floor(Math.random() * connectors.length)];
    const object = `the ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
    return `${subject} ${verbPhrase} ${connector} ${object}.`;
}

// New generator functions
const generators = {
    random: () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?;: ';
        return generateRandomWords(chars);
    },

    letters: () => {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        return generateRandomWords(letters);
    },

    finger: () => {
        const fingerMaps = {
            all: 'abcdefghijklmnopqrstuvwxyz',
            pinky: 'qpaz',
            ring: 'woslx',
            middle: 'edcik',
            index: 'rfvtgbyhun'
        };
        const chars = fingerMaps[currentFinger] || fingerMaps.all;
        return generateRandomWords(chars);
    },

    words: () => {
        const allWords = [...nouns, ...verbs, ...adjectives, ...adverbs];
        const result = [];
        for (let i = 0; i < currentLength; i++) {
            result.push(allWords[Math.floor(Math.random() * allWords.length)]);
        }
        return result.join(" ");
    },

    sentences: () => {
        const result = [];
        let count = 0;
        while (count < currentLength) {
            const sentence = generateMeaningfulSentence();
            result.push(sentence);
            count += sentence.split(" ").length;
        }
        return result.join(" ");
    }
};


function generateRandomWords(charSet) {
    const words = [];
    for (let i = 0; i < currentLength; i++) {
        const wordLength = Math.floor(Math.random() * 5) + 2;
        let word = '';
        for (let j = 0; j < wordLength; j++) {
            word += charSet[Math.floor(Math.random() * charSet.length)];
        }
        words.push(word);
    }
    return words.join(' ');
}

let currentText = '';
let startTime = 0;
let timerInterval = null;
let testDuration = 60;
let currentLength = 50;
let currentMode = 'random';
let currentFinger = 'all';
let isTestActive = false;
let correctChars = 0;
let totalChars = 0;
let errors = 0;

const textDisplay = document.getElementById('textDisplay');
const userInputEl = document.getElementById('userInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const timerEl = document.getElementById('timer');
const progressEl = document.getElementById('progress');
const resultsEl = document.getElementById('results');
const fingerGuideEl = document.getElementById('fingerGuide');
const difficultyIndicatorEl = document.getElementById('difficultyIndicator');

function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('fingerSettings').style.display = mode === 'finger' ? 'block' : 'none';
    fingerGuideEl.classList.toggle('show', mode === 'finger');
    updateDifficultyIndicator();
    if (!isTestActive) generateNew();
}

function setDuration(duration) {
    testDuration = duration;
    document.querySelectorAll('.setting-btn').forEach(btn => {
        if (btn.textContent.includes('s') || btn.textContent.includes('min')) {
            btn.classList.remove('active');
        }
    });
    event.target.classList.add('active');
    timerEl.textContent = duration + 's';
}

function setLength(length) {
    currentLength = length;
    document.querySelectorAll('.setting-btn').forEach(btn => {
        if (!btn.textContent.includes('s') && !btn.textContent.includes('min') && !btn.textContent.includes('All') && !btn.textContent.includes('Pinky') && !btn.textContent.includes('Ring') && !btn.textContent.includes('Middle') && !btn.textContent.includes('Index')) {
            btn.classList.remove('active');
        }
    });
    event.target.classList.add('active');
    if (!isTestActive) generateNew();
}

function setFinger(finger) {
    currentFinger = finger;
    document.querySelectorAll('#fingerSettings .setting-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    if (!isTestActive) generateNew();
}

function updateDifficultyIndicator() {
    const indicators = {
        random: `Random Mode - Generated using alphanumeric characters & symbols.`,
        letters: `Letters Only Mode - Great for key memorization.`,
        finger: `Finger Practice Mode - ${currentFinger} finger only.`,
        words: `Word Mode - Random letter-composed words.`
    };
    difficultyIndicatorEl.textContent = indicators[currentMode];
}

function generateNew() {
    currentText = generators[currentMode]();
    textDisplay.innerHTML = '';
    currentText.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('char');
        textDisplay.appendChild(span);
    });
    userInputEl.value = '';
    userInputEl.disabled = true;
    progressEl.style.width = '0%';
    resultsEl.classList.remove('show');
}

function startTest() {
    if (isTestActive) return;
    isTestActive = true;
    userInputEl.disabled = false;
    userInputEl.focus();
    startTime = Date.now();
    correctChars = 0;
    totalChars = 0;
    errors = 0;

    timerEl.textContent = testDuration + 's';

    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const timeLeft = testDuration - elapsed;
        timerEl.textContent = timeLeft + 's';
        const percent = (elapsed / testDuration) * 100;
        progressEl.style.width = percent + '%';

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endTest();
        }
    }, 1000);
}

function resetTest() {
    clearInterval(timerInterval);
    isTestActive = false;
    userInputEl.disabled = true;
    userInputEl.value = '';
    textDisplay.innerHTML = '';
    progressEl.style.width = '0%';
    timerEl.textContent = testDuration + 's';
    wpmEl.textContent = '0';
    accuracyEl.textContent = '100%';
    resultsEl.classList.remove('show');
    generateNew();
}

function endTest() {
    isTestActive = false;
    userInputEl.disabled = true;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
    const wpm = Math.round((correctChars / 5) / timeElapsed);
    const accuracy = Math.round((correctChars / totalChars) * 100) || 0;

    wpmEl.textContent = wpm;
    accuracyEl.textContent = accuracy + '%';

    document.getElementById('finalWpm').textContent = wpm;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    document.getElementById('finalChars').textContent = totalChars;
    document.getElementById('finalErrors').textContent = errors;
    resultsEl.classList.add('show');
}

userInputEl.addEventListener('input', () => {
    if (!isTestActive) return;

    const input = userInputEl.value;
    const spans = textDisplay.querySelectorAll('.char');
    correctChars = 0;
    totalChars = input.length;
    errors = 0;

    spans.forEach((span, idx) => {
        const typedChar = input[idx];
        if (!typedChar) {
            span.className = 'char';
        } else if (typedChar === span.textContent) {
            span.className = 'char correct';
            correctChars++;
        } else {
            span.className = 'char incorrect';
            errors++;
        }
    });

    if (input.length >= currentText.length) {
        clearInterval(timerInterval);
        endTest();
    }
});

// Init
generateNew();
