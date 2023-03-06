let pads = [];
let sounds = [];
let sequence = [0, 1, 2, 3, 4, 5];
let currentStep = 0;
let isPlaying = false;
let tempo = 500;
let tempoInput;

function preload() {
  const soundUrls = ['RullyShabaraSampleR01.wav', 'RullyShabaraSampleR05.mp3', 'RullyShabaraSampleR01.wav', 'RullyShabaraSampleR03.wav', 'RullyShabaraSampleR02.wav', 'RullyShabaraSampleR01.wav'];

  Promise.all(soundUrls.map(url => loadSound(url)))
    .then((loadedSounds) => {
      sounds = loadedSounds;
    });
}

function setup() {
  createCanvas(390, 110);

  for (let i = 0; i < 6; i++) {
    pads[i] = {
      x: 30 + i * 60,
      y: 30,
      w: 30,
      h: 30,
    };
  }

  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.classList.add('button');
  });

  const startStopButton = createButton('Start/Stop');
  startStopButton.mousePressed(startStopSequence);
  const switchButton = createButton('Switch');
  switchButton.mousePressed(switchOrder);
  const tempoUpButton = createButton('+');
  tempoUpButton.mousePressed(() => {
    tempo = Math.max(tempo - 50, 50);
  });
  const tempoDownButton = createButton('-');
  tempoDownButton.mousePressed(() => {
    tempo += 50;
  });
  const randomButton = createButton('Random');
  randomButton.mousePressed(generateRandomSequence);

  tempoUpButton.position(330, 85);
  tempoDownButton.position(360, 85);
}

function draw() {
  background(55);
  for (let i = 0; i < pads.length; i++) {
    let pad = pads[i];
    if (i === sequence[currentStep]) {
      fill(255, 0, 0);
    } else {
      fill(255);
    }
    rect(pad.x, pad.y, pad.w, pad.h);
  }
}

function mouseClicked() {
  setTimeout(() => {
    for (let i = 0; i < pads.length; i++) {
      let pad = pads[i];
      if (mouseX >= pad.x && mouseX <= pad.x + pad.w &&
          mouseY >= pad.y && mouseY <= pad.y + pad.h) {
togglePad(i);
}
}
}, 50);
}

function togglePad(padIndex) {
if (sequence.includes(padIndex)) {
sequence = sequence.filter(step => step !== padIndex);
} else {
sequence.push(padIndex);
}
}

function startStopSequence() {
isPlaying = !isPlaying;
currentStep = 0;
if (isPlaying) {
scheduleSequence();
}
}

function scheduleSequence() {
if (!isPlaying) {
return;
}
setTimeout(() => {
playStep(sequence[currentStep]);
currentStep = (currentStep + 1) % sequence.length;
scheduleSequence();
}, tempo);
}

function playStep(step) {
const sound = sounds[step];
sound.stop();
sound.play();
}

function switchOrder() {
sequence = sequence.reverse();
}

function generateRandomSequence() {
sequence = [];
while (sequence.length < 6) {
const randomStep = Math.floor(Math.random() * 6);
if (!sequence.includes(randomStep)) {
sequence.push(randomStep);
}
}
}
