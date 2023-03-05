const key = localStorage.getItem('key');

const renderer = new PIXI.autoDetectRenderer({
  width: window.innerWidth,
  height: window.innerHeight,
});

const stage = new PIXI.Container();
stage.visible = false;
PIXI.Ticker.shared.add(() => {
  renderer.render(stage);
});

let bet = 1;
let coinValue = 0.01;
let balance = 0;
let betResponse = false;

const symbolsCount = 8;
const spinTime = 350;
const spinTimeBetweenReels = 200;

let creditsValue, betValue;

const Assets = PIXI.Assets;

const assetsUrl = `/data/${gameId}/`;
const assetsManifest = {
  bundles: [
    {
      name: 'ui',
      assets: [
        {
          name: 'background',
          srcs: `${assetsUrl}main_game/back.png`,
        },
        {
          name: 'reels-background',
          srcs: `${assetsUrl}main_game/screen.png`,
        },
        {
          name: 'logo',
          srcs: `${assetsUrl}main_game/ui/logo_small.png`,
        },
        {
          name: 'spin-icon',
          srcs: `/data/spin-icon.png`,
        },
        {
          name: 'stop-icon',
          srcs: `/data/stop-icon.png`,
        },
        {
          name: 'circle-icon',
          srcs: `/data/circle-icon.png`,
        },
      ],
    },
    {
      name: 'symbols',
      assets: [
        {
          name: 'symbol-1',
          srcs: `${assetsUrl}main_game/icon_1.png`,
        },
        {
          name: 'symbol-1-blurred',
          srcs: `${assetsUrl}main_game/icon_1_blurred.png`,
        },
        {
          name: 'symbol-2',
          srcs: `${assetsUrl}main_game/icon_2.png`,
        },
        {
          name: 'symbol-2-blurred',
          srcs: `${assetsUrl}main_game/icon_2_blurred.png`,
        },
        {
          name: 'symbol-3',
          srcs: `${assetsUrl}main_game/icon_3.png`,
        },
        {
          name: 'symbol-3-blurred',
          srcs: `${assetsUrl}main_game/icon_3_blurred.png`,
        },
        {
          name: 'symbol-4',
          srcs: `${assetsUrl}main_game/icon_4.png`,
        },
        {
          name: 'symbol-4-blurred',
          srcs: `${assetsUrl}main_game/icon_4_blurred.png`,
        },
        {
          name: 'symbol-5',
          srcs: `${assetsUrl}main_game/icon_5.png`,
        },
        {
          name: 'symbol-5-blurred',
          srcs: `${assetsUrl}main_game/icon_5_blurred.png`,
        },
        {
          name: 'symbol-6',
          srcs: `${assetsUrl}main_game/icon_6.png`,
        },
        {
          name: 'symbol-6-blurred',
          srcs: `${assetsUrl}main_game/icon_6_blurred.png`,
        },
        {
          name: 'symbol-7',
          srcs: `${assetsUrl}main_game/icon_7.png`,
        },
        {
          name: 'symbol-7-blurred',
          srcs: `${assetsUrl}main_game/icon_7_blurred.png`,
        },
        {
          name: 'symbol-8',
          srcs: `${assetsUrl}main_game/icon_8.png`,
        },
        {
          name: 'symbol-8-blurred',
          srcs: `${assetsUrl}main_game/icon_8_blurred.png`,
        },
      ],
    },
  ],
};

Assets.init({ manifest: assetsManifest });

const uiAssetsLoadPromise = Assets.loadBundle('ui', (progress) => {
  
});

const symbolsAssetsLoadPromise = Assets.loadBundle('symbols', (progress) => {
  
});

Promise.all([uiAssetsLoadPromise, symbolsAssetsLoadPromise]).then(() => {
  console.log('Assets loaded');
  init();
});

const reels = [];

Object.defineProperty(reels, 'active', {
  get() {
    return reels.some((reel) => reel.rolling == true || reel.stopping !== false);
  },
});

reels.onStartFns = [];
reels.onStart = (fn) => reels.onStartFns.push(fn);
reels.onStopFns = [];
reels.onStop = (fn) => reels.onStopFns.push(fn);
reels.onStopCommandFns = [];
reels.onStopCommand = (fn) => reels.onStopCommandFns.push(fn);

function play() {
  if (reels.active) {
    if (betResponse) {
      reels.onStopCommandFns.forEach((fn) => fn());

      reels.forEach((r, i) => {
        if ((r.rolling == true || r.stopping < r.positions + 1) && !(r.forceStopped || r.stoppedAutomatically)) {
          r.values = betResponse.reels[i].slice();
          r.offset = 0;
          r.stopping = r.positions + 1;
          r.forceStopped = true;
        }
      });
    }
  } else {

    socket.emit('bet', {
      key,
      gameId,
      bet,
      coinValue,
    });
    betResponse = null;

    reels.forEach((r) => {
      r.stoppedAutomatically = false;
      r.forceStopped = false;
      r.roll();

      r.onceStop(() => {
        if (!reels.active) {
          reels.onStopFns.forEach((fn) => fn());
        }
      });
    });

    reels.onStartFns.forEach((fn) => fn());
  }
}

function init() {
  initControls();

  const background = PIXI.Sprite.from('background');
  background.x = 0;
  background.y = 0;
  background.z = 5;
  stage.addChild(background);

  const reelsBackground = PIXI.Sprite.from('reels-background');
  reelsBackground.x = 0;
  reelsBackground.y = 0;
  reelsBackground.z = 1;
  stage.addChild(reelsBackground);

  const logo = PIXI.Sprite.from('logo');
  logo.anchor.set(0.5, 0);
  logo.scale.set(0.7, 0.7);
  logo.x = 1280 / 2;
  logo.z = 6;
  stage.addChild(logo);

  for (let i = 0; i < 5; i++) {
    const spinValues = [];
    for (let k = 0; k < 100; k++) {
      spinValues.push(parseInt(Math.random() * symbolsCount) + 1);
    }

    const reel = new Reel({
      positions: 3,
      spinValues,
      speed: 0.18,
      bounceDepthPerc: 0.1,
      bounceDuration: 350,
      symbolMargin: 20,
      maskPaddingY: 14,
    });
    reel.container.z = 3;
    reel.mask.z = 4;
    PIXI.Ticker.shared.add(() => {
      reel.container.x = 245 + (i * 144) + (i * 15);
      reel.container.y = 90;
      reel.render();
    });
    stage.addChild(reel.container);
    stage.addChild(reel.mask);
    reels.push(reel);
  }

  reels.forEach((reel) => {
    reel.rollingTime = 0;
  });

  PIXI.Ticker.shared.add((delta) => {
    for (let i = 0; i < reels.length; i++) {
      const reel = reels[i];
      active = reel.rolling == true || reel.stopping !== false;

      if (active) {
        const reelStopTime = spinTime + (i * spinTimeBetweenReels);
        if (reel.rollingTime > reelStopTime && betResponse) {
          reel._stopValues = reel.stopValues;
          reel.stop();
          reel.onceStop(function() {
            reel.stoppedAutomatically = true;
          });
        } else {
          reel.rollingTime += delta * 16.667;
        }
      } else {
        reel.rollingTime = 0;
      }
    }
  });

  window.addEventListener('keydown', function(e) {
    if (e.code === 'Space' || e.code === 'Numpad0') {
      play();
    }
  });

  stage.children.sort(function(a, b) {
    if (a.z > b.z) {
      return 1;
    } else {
      return -1;
    }
  });

  function resize() {
    const gameRatio = 1280 / 800;
    const windowRatio = window.innerWidth / window.innerHeight;
    let width, height;

    if (windowRatio < gameRatio) {
      width = window.innerWidth;
      height = width / gameRatio;
    } else {
      height = window.innerHeight;
      width = height * gameRatio;
    }

    renderer.resize(width, height);

    stage.scale.x = renderer.view.width / 1280;
    stage.scale.y = renderer.view.height / 800;
    stage.scale.x *= 1.12;
    stage.scale.y *= 1.12;
    stage.x = 0 - (renderer.view.width * (0.12 / 2));
  }
  resize();
  window.addEventListener('resize', () => {
    setTimeout(resize, 50);
  });

  socket.on('gamestate', (state) => {
    balance = state.balance;
    creditsValue.text = balance.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits: 2 });

    bet = state.bet;
    coinValue = state.coinValue;
    betValue.text = (bet * coinValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    state.reels.forEach((reelValues, i) => {
      reels[i].values = reelValues;
    });
    
    stage.visible = true;
  });

  socket.on('bet', (data) => {
    balance = data.balance;
    creditsValue.text = balance.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits: 2 });
    
    data.reels.forEach((reelValues, i) => {
      reels[i].stopValues = reelValues.slice();
    });

    betResponse = {
      reels: data.reels,
    };
  });

  socket.emit('gamestate', {
    gameId,
    key,
  });
}

function initControls() {
  const controls = new PIXI.Container();
  controls.y = 800 - 180;
  controls.z = 10;
  stage.addChild(controls);

  const infoText = new PIXI.Text('HOLD SPACE FOR TURBO SPIN', new PIXI.TextStyle({
    fontFamily: 'Archivo Black',
    fontSize: 22,
    fill: '#FFFFFF',
  }));
  infoText.anchor.set(0.5, 0.5);
  infoText.x = 1280 / 2;
  controls.addChild(infoText);

  let spinCount = 0;
  reels.onStop(() => {
    if (++spinCount % 2 === 0) {
      infoText.text = 'SPIN TO WIN!';
    } else {
      infoText.text = 'PLACE YOUR BETS!';
    }
  });

  PIXI.Ticker.shared.add(() => {
    if (reels.active) {
      infoText.text = 'GOOD LUCK!';
    } else {
      const t = infoText.text;
      infoText.text = '';
      infoText.text = t;
    }
  });

  const creditsLabel = new PIXI.Text('CREDIT', {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FDAD00',
  });
  creditsLabel.x = 200;
  controls.addChild(creditsLabel);

  PIXI.Ticker.shared.add(() => {
    const t = creditsLabel.text;
    creditsLabel.text = '';
    creditsLabel.text = t;
  });

  const creditsValueEuroSign = new PIXI.Text('€', {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FFFFFF',
  });
  creditsValueEuroSign.x = creditsLabel.x + creditsLabel.width + 20;
  creditsValueEuroSign.y = creditsLabel.y;
  controls.addChild(creditsValueEuroSign);

  PIXI.Ticker.shared.add(() => {
    const t = creditsValueEuroSign.text;
    creditsValueEuroSign.text = '';
    creditsValueEuroSign.text = t;
  });

  creditsValue = new PIXI.Text(balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FFFFFF',
  });
  creditsValue.x = creditsValueEuroSign.x + creditsValueEuroSign.width + 5;
  controls.addChild(creditsValue);

  PIXI.Ticker.shared.add(() => {
    const t = creditsValue.text;
    creditsValue.text = '';
    creditsValue.text = t;
  });

  const betLabel = new PIXI.Text('BET', {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FDAD00',
  });
  betLabel.x = creditsLabel.x + creditsLabel.width - betLabel.width + 4;
  betLabel.y = creditsLabel.y + betLabel.height + 5;
  controls.addChild(betLabel);

  PIXI.Ticker.shared.add(() => {
    const t = betLabel.text;
    betLabel.text = '';
    betLabel.text = t;
  });

  const betValueEuroSign = new PIXI.Text('€', {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FFFFFF',
  });
  betValueEuroSign.x = betLabel.x + betLabel.width + 16;
  betValueEuroSign.y = betLabel.y;
  controls.addChild(betValueEuroSign);

  PIXI.Ticker.shared.add(() => {
    const t = betValueEuroSign.text;
    betValueEuroSign.text = '';
    betValueEuroSign.text = t;
  });

  betValue = new PIXI.Text((bet * coinValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FFFFFF',
  });
  betValue.x = betValueEuroSign.x + betValueEuroSign.width + 5;
  betValue.y = betLabel.y;
  controls.addChild(betValue);

  PIXI.Ticker.shared.add(() => {
    const t = betValue.text;
    betValue.text = '';
    betValue.text = t;
  });

  const btnPlay = PIXI.Sprite.from('spin-icon');
  btnPlay.scale.x = 0.3;
  btnPlay.scale.y = 0.3;
  btnPlay.anchor.set(0.5, 0.5);
  btnPlay.x = 1100 - btnPlay.width;
  btnPlay.interactive = true;
  btnPlay.on('pointerdown', play);
  controls.addChild(btnPlay);

  PIXI.Ticker.shared.add(() => {
    if (reels.active) {
      btnPlay.texture = PIXI.Texture.from('stop-icon');
    } else {
      btnPlay.texture = PIXI.Texture.from('spin-icon');
    }
  });

  const btnPlayCircle = PIXI.Sprite.from('circle-icon');
  btnPlayCircle.x = btnPlay.x;
  btnPlayCircle.y = btnPlay.y;
  btnPlayCircle.scale.x = 0.3;
  btnPlayCircle.scale.y = 0.3;
  btnPlayCircle.anchor.set(0.5, 0.5);
  btnPlayCircle.interactive = true;
  btnPlayCircle.on('pointerdown', play);
  controls.addChild(btnPlayCircle);
  
  let btnPlayCircleRotation = {
    value: 0.1,
  };

  let btnPlayCircleRotationTween;
  reels.onStart(() => {
    btnPlayCircleRotation.value = 0.1;
    btnPlayCircleRotationTween = gsap.to(btnPlayCircleRotation, { value: 0.001, duration: 2 });
  });

  reels.onStop(() => {
    btnPlayCircleRotationTween.kill();
  });

  reels.onStopCommand(() => {
    btnPlayCircleRotationTween.progress(1);
  });

  PIXI.Ticker.shared.add(() => {
    if (reels.active) {
      btnPlayCircle.rotation -= btnPlayCircleRotation.value;
    }
  });

  const btnPlayRotateTimeline = gsap.timeline({
    repeat: -1,
    repeatDelay: 10,
    delay: 10,
  });

  btnPlayRotateTimeline.to(btnPlay, {
    rotation: Math.PI / 4,
    duration: 0.5,
    ease: 'power1',
  })

  btnPlayRotateTimeline.to(btnPlay, {
    rotation: 0,
    duration: 0.5,
    ease: 'bounce',
  });

  reels.onStart(() => {
    btnPlayRotateTimeline.pause();
    btnPlayRotateTimeline.progress(0);
  });

  reels.onStop(() => {
    if (!reels.active) {
      btnPlayRotateTimeline.restart(true);
    }
  });

  const btnAutoplay = new PIXI.Container();
  btnAutoplay.x = btnPlay.x;
  btnAutoplay.y = 65;
  controls.addChild(btnAutoplay);

  const btnAutoplayBackground = new PIXI.Graphics();
  btnAutoplay.addChild(btnAutoplayBackground);

  const btnAutoplayText = new PIXI.Text('AUTOPLAY', new PIXI.TextStyle({
    fontFamily: 'Archivo Black',
    fontSize: 12,
    fill: '#FFFFFF',
  }));
  btnAutoplayText.anchor.set(0.5, 0.5);
  btnAutoplay.addChild(btnAutoplayText);
  PIXI.Ticker.shared.add(() => {
    btnAutoplayText.text = '';
    btnAutoplayText.text = 'AUTOPLAY';
  });

  const btnAutoplayTextPaddingX = 12;
  const btnAutoplayTextPaddingY = 2;
  btnAutoplayBackground.beginFill(0xFFFFFF, 1);
  btnAutoplayBackground.drawRoundedRect(
    btnAutoplayText.x - (btnAutoplayText.width / 2) - btnAutoplayTextPaddingX - 2,
    btnAutoplayText.y - (btnAutoplayText.height / 2) - btnAutoplayTextPaddingY - 2,
    btnAutoplayText.width + (btnAutoplayTextPaddingX * 2) + 4,
    btnAutoplayText.height + (btnAutoplayTextPaddingY * 2) + 4,
    12
  );
  btnAutoplayBackground.beginFill(0x000000, 1);
  btnAutoplayBackground.drawRoundedRect(
    btnAutoplayText.x - (btnAutoplayText.width / 2) - btnAutoplayTextPaddingX,
    btnAutoplayText.y - (btnAutoplayText.height / 2) - btnAutoplayTextPaddingY,
    btnAutoplayText.width + (btnAutoplayTextPaddingX * 2),
    btnAutoplayText.height + (btnAutoplayTextPaddingY * 2),
    12
  );
  btnAutoplayBackground.endFill();
}

window.renderer = renderer;
window.stage = stage;
window.reels = reels;

return renderer.view;