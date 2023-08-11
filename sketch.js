let pads = [];
let sounds = [];
let sequence = [0, 1, 2, 3, 4, 5, 6, 7];
let currentStep = 0;
let isPlaying = false;
let tempo = 500;
let delayFX; // renamed from delay
let distortion;
let isDelayOn = false; 
let isDistortionOn = false; 
let autonomousButton; 
let randomTempoButton;
let delayButton;
let distortionButton;

function preload() {
  const soundUrls = [
    "RullyShabaraSampleR05.mp3",
    "RullyShabaraSampleR05.mp3",
    "RullyShabaraSampleR02.wav",
    "RullyShabaraSampleR01.wav",
    "RullyShabaraSampleR02.wav",
    "RullyShabaraSampleR02.wav",
    "RullyShabaraSampleR05.mp3",
    "RullyShabaraSampleR02.wav",
  ];

  Promise.all(soundUrls.map((url) => loadSound(url))).then((loadedSounds) => {
    sounds = loadedSounds;
  });
}

function setup() {
  createCanvas(500, 110);
  delayFX = new p5.Delay(); // renamed from delay
  distortion = new p5.Distortion();

  for (let i = 0; i < 8; i++) {
    pads[i] = {
      x: 30 + i * 60,
      y: 30,
      w: 30,
      h: 30,
      active: true,
    };
  }

  const startStopButton = createButton("Start/Stop");
  startStopButton.mousePressed(startStopSequence);
  startStopButton.class('btn');

  const switchButton = createButton("Switch");
  switchButton.mousePressed(switchOrder);
  switchButton.class('btn');

  const tempoUpButton = createButton("+");
  tempoUpButton.mousePressed(() => {
    tempo = Math.max(tempo - 50, 50);
  });
  tempoUpButton.class('btn');

  const tempoDownButton = createButton("-");
  tempoDownButton.mousePressed(() => {
    tempo += 50;
  });
  tempoDownButton.class('btn');

  const randomButton = createButton("Random");
  randomButton.mousePressed(generateRandomSequence);
  randomButton.class('btn btn-random');

delayButton = createButton("Delay");
  delayButton.mousePressed(toggleDelay);
  delayButton.class('btn');

  // Remove the const keyword here
  distortionButton = createButton("Distortion");
  distortionButton.mousePressed(toggleDistortion);
  distortionButton.class('btn');

  tempoUpButton.position(415, 122);
  tempoDownButton.position(460, 122);
  
  autonomousButton = createButton("Xhabarabot Takeover");
  autonomousButton.mousePressed(toggleAutonomousMode);
  autonomousButton.class('btn');
  autonomousButton.position(7, 155);

  randomTempoButton = createButton("Randomize Tempo");
  randomTempoButton.mousePressed(randomizeTempo);
  randomTempoButton.class('btn');
  randomTempoButton.position(380, 155);


}

function draw() {
  background(55);
  for (let i = 0; i < pads.length; i++) {
    let pad = pads[i];
    if (i === sequence[currentStep]) {
      fill(255, 200, 0);
    } else {
      fill(pad.active ? 255 : 100);
    }
    rect(pad.x, pad.y, pad.w, pad.h);
  }
}

function mouseClicked() {
  setTimeout(() => {
    for (let i = 0; i < pads.length; i++) {
      let pad = pads[i];
      if (
        mouseX >= pad.x &&
        mouseX <= pad.x + pad.w &&
        mouseY >= pad.y &&
        mouseY <= pad.y + pad.h
      ) {
        togglePad(i);
      }
    }
  }, 50);
}

function togglePad(padIndex) {
  pads[padIndex].active = !pads[padIndex].active;
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
  if (pads[step].active) {
    const sound = sounds[step];
    sound.stop();

    // Apply the effects if they're on
    if (isDelayOn) {
      delayFX.process(sound, 0.5, 0.3, 2300);
    }
    if (isDistortionOn) {
      distortion.process(sound, 0.03, '2x');
    }

    sound.play();
  }
}

function switchOrder () {
sequence = sequence.reverse();
}

function generateRandomSequence() {
sequence = [];
while (sequence.length < 8) {
const randomStep = Math.floor(Math.random() * 8);
if (!sequence.includes(randomStep)) {
sequence.push(randomStep);
}
}
}


function randomizeTempo() {
  if (tempo === 500) {
    tempo = Math.floor(Math.random() * 1000) + 10;
    randomTempoButton.style('background-color', 'green');
  } else {
    tempo = 500;
    randomTempoButton.style('background-color', 'rgb(117,113,113)');
  }
}

let isAutonomousOn = false;
function toggleAutonomousMode() {
  isAutonomousOn = !isAutonomousOn;
  autonomousButton.style('background-color', isAutonomousOn ? 'red' : 'rgb(96,92,92)');

  if (isAutonomousOn && !isPlaying) {
    startStopSequence();
    scheduleAutonomousActions();
  } else if (!isAutonomousOn) {
    if (isPlaying) {
      startStopSequence();
    }
  }
}

function scheduleAutonomousActions() {
  if (!isAutonomousOn) {
    return;
  }

  setTimeout(() => {
    const randomAction = Math.floor(Math.random() * 6); // Total of 6 actions now
    switch (randomAction) {
      case 0:
        togglePad(Math.floor(Math.random() * 8));
        break;
      case 1:
        switchOrder();
        break;
      case 2:
        toggleDelay();
        break;
      case 3:
        toggleDistortion();
        break;
      case 4:
        generateRandomSequence();
        break;
      case 5:
        randomizeTempo();
        break;
    }

    scheduleAutonomousActions();
  }, Math.random() * tempo + 100);
}

function toggleDelay() {
  isDelayOn = !isDelayOn;
  delayButton.style('background-color', isDelayOn ? 'green' : 'rgb(117,113,113)');
}

function toggleDistortion() {
  isDistortionOn = !isDistortionOn;
  distortionButton.style('background-color', isDistortionOn ? 'red' : 'rgb(117,113,113)');
}
