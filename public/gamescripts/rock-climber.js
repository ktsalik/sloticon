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
const coinValueValues = [0.01, 0.03, 0.10, 0.20, 0.50];
let coinValueValueIndex = 0;
let balance = 0;
let betResponse = false;

const symbolsCount = 8;
const spinTime = 350;
const spinTimeBetweenReels = 200;

let creditsValue, betValue, betValueTool, coinValueTool, totalBetTool;

const texts = [];

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
        {
          name: 'minus-icon',
          srcs: `/data/minus-solid.svg`,
        },
        {
          name: 'plus-icon',
          srcs: `/data/plus-solid.svg`,
        },
        {
          name: 'xmark-icon',
          srcs: `/data/xmark-solid.svg`,
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
        {
          name: 'symbol-win-frame',
          srcs: `${assetsUrl}main_game/frame.png`,
        },
        {
          name: 'symbol-win-effect-87',
          srcs: `${assetsUrl}animations/win_effect/win_effect_87.png`,
        },
        {
          name: 'symbol-win-effect-88',
          srcs: `${assetsUrl}animations/win_effect/win_effect_88.png`,
        },
        {
          name: 'symbol-win-effect-89',
          srcs: `${assetsUrl}animations/win_effect/win_effect_89.png`,
        },
        {
          name: 'symbol-win-effect-90',
          srcs: `${assetsUrl}animations/win_effect/win_effect_90.png`,
        },
        {
          name: 'symbol-win-effect-91',
          srcs: `${assetsUrl}animations/win_effect/win_effect_91.png`,
        },
        {
          name: 'symbol-win-effect-92',
          srcs: `${assetsUrl}animations/win_effect/win_effect_92.png`,
        },
        {
          name: 'symbol-win-effect-93',
          srcs: `${assetsUrl}animations/win_effect/win_effect_93.png`,
        },
        {
          name: 'symbol-win-effect-94',
          srcs: `${assetsUrl}animations/win_effect/win_effect_94.png`,
        },
        {
          name: 'symbol-win-effect-95',
          srcs: `${assetsUrl}animations/win_effect/win_effect_95.png`,
        },
        {
          name: 'symbol-win-effect-96',
          srcs: `${assetsUrl}animations/win_effect/win_effect_96.png`,
        },
        {
          name: 'symbol-win-effect-97',
          srcs: `${assetsUrl}animations/win_effect/win_effect_97.png`,
        },
        {
          name: 'symbol-win-effect-98',
          srcs: `${assetsUrl}animations/win_effect/win_effect_98.png`,
        },
        {
          name: 'symbol-win-effect-99',
          srcs: `${assetsUrl}animations/win_effect/win_effect_99.png`,
        },
        {
          name: 'symbol-win-effect-100',
          srcs: `${assetsUrl}animations/win_effect/win_effect_100.png`,
        },
        {
          name: 'symbol-win-effect-101',
          srcs: `${assetsUrl}animations/win_effect/win_effect_101.png`,
        },
        {
          name: 'symbol-win-effect-102',
          srcs: `${assetsUrl}animations/win_effect/win_effect_102.png`,
        },
        {
          name: 'symbol-win-effect-103',
          srcs: `${assetsUrl}animations/win_effect/win_effect_103.png`,
        },
        {
          name: 'symbol-win-effect-104',
          srcs: `${assetsUrl}animations/win_effect/win_effect_104.png`,
        },
        {
          name: 'symbol-win-effect-105',
          srcs: `${assetsUrl}animations/win_effect/win_effect_105.png`,
        },
        {
          name: 'symbol-win-effect-106',
          srcs: `${assetsUrl}animations/win_effect/win_effect_106.png`,
        },
        {
          name: 'symbol-win-effect-107',
          srcs: `${assetsUrl}animations/win_effect/win_effect_107.png`,
        },
        {
          name: 'symbol-win-effect-108',
          srcs: `${assetsUrl}animations/win_effect/win_effect_108.png`,
        },
        {
          name: 'symbol-win-effect-109',
          srcs: `${assetsUrl}animations/win_effect/win_effect_109.png`,
        },
        {
          name: 'symbol-win-effect-110',
          srcs: `${assetsUrl}animations/win_effect/win_effect_110.png`,
        },
        {
          name: 'symbol-win-effect-111',
          srcs: `${assetsUrl}animations/win_effect/win_effect_111.png`,
        },
        {
          name: 'symbol-win-effect-112',
          srcs: `${assetsUrl}animations/win_effect/win_effect_112.png`,
        },
        {
          name: 'symbol-win-effect-113',
          srcs: `${assetsUrl}animations/win_effect/win_effect_113.png`,
        },
        {
          name: 'symbol-win-effect-114',
          srcs: `${assetsUrl}animations/win_effect/win_effect_114.png`,
        },
        {
          name: 'symbol-win-effect-115',
          srcs: `${assetsUrl}animations/win_effect/win_effect_115.png`,
        },
        {
          name: 'symbol-win-effect-116',
          srcs: `${assetsUrl}animations/win_effect/win_effect_116.png`,
        },
        {
          name: 'symbol-win-effect-117',
          srcs: `${assetsUrl}animations/win_effect/win_effect_117.png`,
        },
        {
          name: 'symbol-win-effect-118',
          srcs: `${assetsUrl}animations/win_effect/win_effect_118.png`,
        },
        {
          name: 'symbol-win-effect-119',
          srcs: `${assetsUrl}animations/win_effect/win_effect_119.png`,
        },
        {
          name: 'symbol-win-effect-120',
          srcs: `${assetsUrl}animations/win_effect/win_effect_120.png`,
        },
        {
          name: 'symbol-win-effect-121',
          srcs: `${assetsUrl}animations/win_effect/win_effect_121.png`,
        },
        {
          name: 'symbol-win-effect-122',
          srcs: `${assetsUrl}animations/win_effect/win_effect_122.png`,
        },
        {
          name: 'symbol-win-effect-123',
          srcs: `${assetsUrl}animations/win_effect/win_effect_123.png`,
        },
        {
          name: 'symbol-win-effect-124',
          srcs: `${assetsUrl}animations/win_effect/win_effect_124.png`,
        },
        {
          name: 'symbol-win-effect-125',
          srcs: `${assetsUrl}animations/win_effect/win_effect_125.png`,
        },
        {
          name: 'symbol-win-effect-126',
          srcs: `${assetsUrl}animations/win_effect/win_effect_126.png`,
        },
        {
          name: 'symbol-win-effect-127',
          srcs: `${assetsUrl}animations/win_effect/win_effect_127.png`,
        },
        {
          name: 'symbol-win-effect-128',
          srcs: `${assetsUrl}animations/win_effect/win_effect_128.png`,
        },
        {
          name: 'symbol-win-effect-129',
          srcs: `${assetsUrl}animations/win_effect/win_effect_129.png`,
        },
        {
          name: 'symbol-win-effect-130',
          srcs: `${assetsUrl}animations/win_effect/win_effect_130.png`,
        },
        {
          name: 'symbol-win-effect-131',
          srcs: `${assetsUrl}animations/win_effect/win_effect_131.png`,
        },
        {
          name: 'symbol-win-effect-132',
          srcs: `${assetsUrl}animations/win_effect/win_effect_132.png`,
        },
        {
          name: 'symbol-win-effect-133',
          srcs: `${assetsUrl}animations/win_effect/win_effect_133.png`,
        },
        {
          name: 'symbol-win-effect-134',
          srcs: `${assetsUrl}animations/win_effect/win_effect_134.png`,
        },
        {
          name: 'symbol-win-effect-135',
          srcs: `${assetsUrl}animations/win_effect/win_effect_135.png`,
        },
        {
          name: 'symbol-win-effect-136',
          srcs: `${assetsUrl}animations/win_effect/win_effect_136.png`,
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

const symbolWinEffectFramesIds = [];
for (let i = 87; i <= 136; i++) {
  symbolWinEffectFramesIds.push('symbol-win-effect-' + i);
}

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
      coinValue: coinValueValues[coinValueValueIndex],
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
    for (let k = 0; k < 1000; k++) {
      spinValues.push(parseInt(Math.random() * symbolsCount) + 1);
    }

    const reel = new Reel({
      positions: 3,
      spinValues,
      speed: 0.165,
      bounceDepthPerc: 0.1,
      bounceDuration: 350,
      symbolMargin: 20,
      maskPaddingX: 13,
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

  let linesHighlightComponents = [];
  let lineToHighlight = 0;
  let lineIsBeingHighlighted = false;
  let linesHighlightTime = 0;
  PIXI.Ticker.shared.add((delta) => {
    if (betResponse && betResponse.isWin && !reels.active) {
      if (!lineIsBeingHighlighted) {
        betResponse.win.forEach((line, k) => {
          if ((lineToHighlight === 0 || k + 1 === lineToHighlight)) {
            for (let i = 0; i < line.map.length && i < line.count; i++) {
              for (let j = 0; j < line.map[i].length; j++) {
                if (line.map[i][j] === 1) {
                  const symbol = reels[i].symbols[j];

                  const animation = PIXI.AnimatedSprite.fromFrames(symbolWinEffectFramesIds);
                  animation.anchor.set(0.5, 0.5);
                  animation.loop = false;
                  animation.animationSpeed = 0.5;
                  symbol.addChild(animation);
                  animation.onComplete = () => {
                    if (!animation.destroyed) {
                      gsap.to(animation.scale, { x: 0, y: 0, duration: 0.35 });
                      gsap.to(animation, { alpha: 0, duration: 0.35, onComplete: () => {
                        if (!animation.destroyed) {
                          animation.destroy();
                        }
                      }});
                    }
                  };
                  reels[i].onceStart(() => {
                    if (!animation.destroyed) {
                      animation.destroy();
                    }
                  });
                  animation.play();
                  linesHighlightComponents.push(animation);

                  const frame = PIXI.Sprite.from('symbol-win-frame');
                  frame.anchor.set(0.5, 0.5);
                  frame.alpha = 0;
                  symbol.addChild(frame);
                  gsap.to(frame, { alpha: 1, duration: 1.2, ease: 'linear' });
                  reels[i].onceStart(() => {
                    if (!frame.destroyed) {
                      frame.destroy();
                    }
                  });
                  linesHighlightComponents.push(frame);
                }
              }
            }
          }
        });

        lineIsBeingHighlighted = true;
      }

      linesHighlightTime += delta * 16.667;

      if (linesHighlightTime >= 2500) {
        if (++lineToHighlight > betResponse.win.length) {
          lineToHighlight = 0;
        }

        linesHighlightComponents.forEach((component) => {
          if (!component.destroyed) {
            component.destroy();
          }
        });
        linesHighlightComponents = [];

        lineIsBeingHighlighted = false;
        linesHighlightTime = 0;
      }
    } else {
      if (linesHighlightComponents.length) {
        linesHighlightComponents.forEach((component) => {
          if (!component.destroyed) {
            component.destroy();
          }
        });
        linesHighlightComponents = [];
      }
      
      lineToHighlight = 0;
      linesHighlightTime = 0;
      lineIsBeingHighlighted = false;
    }
  });

  socket.on('gamestate', (state) => {
    balance = state.balance;
    creditsValue.text = balance.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits: 2 });

    bet = state.bet;
    coinValueValueIndex = coinValueValues.indexOf(state.coinValue);
    betValue.text = (bet * 10 * coinValueValues[coinValueValueIndex]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    betValueTool.valueText.text = bet;
    coinValueTool.valueText.text = '€' + coinValueValues[coinValueValueIndex].toFixed(2);
    totalBetTool.valueText.text = '€' + (bet * 10 * coinValueValues[coinValueValueIndex]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    state.reels.forEach((reelValues, i) => {
      reels[i].values = reelValues;
    });
    
    stage.visible = true;

    setTimeout(() => {
      texts.forEach((text) => {
        const t = text.text;
        text.text = '';
        text.text = t;
      });
    });
  });

  socket.on('bet', (data) => {
    balance = data.balance;
    creditsValue.text = balance.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits: 2 });
    
    data.reels.forEach((reelValues, i) => {
      reels[i].stopValues = reelValues.slice();
    });

    betResponse = data;

    // for testing
    // betResponse = JSON.parse(`{"balance":9021,"reels":[[8,2,5,2],[5,5,2,2],[2,3,6,2],[1,8,8,4],[8,5,4,1]],"isWin":true,"win":[{"number":7,"symbol":2,"count":3,"map":[[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1]]},{"number":9,"symbol":2,"count":3,"map":[[0,1,0,0],[0,0,1,0],[0,0,0,1],[0,0,1,0],[0,1,0,0]]}]}`);
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
  texts.push(infoText);

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
    }
  });

  const creditsLabel = new PIXI.Text('CREDIT', {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FDAD00',
  });
  creditsLabel.x = 200;
  controls.addChild(creditsLabel);
  texts.push(creditsLabel);

  const creditsValueEuroSign = new PIXI.Text('€', {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FFFFFF',
  });
  creditsValueEuroSign.x = creditsLabel.x + creditsLabel.width + 20;
  creditsValueEuroSign.y = creditsLabel.y;
  controls.addChild(creditsValueEuroSign);
  texts.push(creditsValueEuroSign);

  creditsValue = new PIXI.Text(balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FFFFFF',
  });
  creditsValue.x = creditsValueEuroSign.x + creditsValueEuroSign.width + 5;
  controls.addChild(creditsValue);
  texts.push(creditsValue);

  const betLabel = new PIXI.Text('BET', {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FDAD00',
  });
  betLabel.x = creditsLabel.x + creditsLabel.width - betLabel.width + 4;
  betLabel.y = creditsLabel.y + betLabel.height + 5;
  controls.addChild(betLabel);
  texts.push(betLabel);

  const betValueEuroSign = new PIXI.Text('€', {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FFFFFF',
  });
  betValueEuroSign.x = betLabel.x + betLabel.width + 16;
  betValueEuroSign.y = betLabel.y;
  controls.addChild(betValueEuroSign);
  texts.push(betValueEuroSign);

  betValue = new PIXI.Text((bet * 10 * coinValueValues[coinValueValueIndex]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FFFFFF',
  });
  betValue.x = betValueEuroSign.x + betValueEuroSign.width + 5;
  betValue.y = betLabel.y;
  controls.addChild(betValue);
  texts.push(betValue);

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
  texts.push(btnAutoplayText);

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

  const btnBetMinusCircle = new PIXI.Graphics();
  btnBetMinusCircle.beginFill(0x000000, 0.4);
  btnBetMinusCircle.lineStyle(10, 0xFFFFFF);
  btnBetMinusCircle.drawEllipse(0, 0, 100, 100);
  btnBetMinusCircle.endFill();
  btnBetMinusCircle.scale.x = 0.22;
  btnBetMinusCircle.scale.y = 0.22;
  btnBetMinusCircle.x = btnPlay.x - (btnPlay.width / 2) - btnBetMinusCircle.width;
  btnBetMinusCircle.y = btnPlay.y + (btnPlay.height / 2) - (btnBetMinusCircle.height / 2) + 10;
  controls.addChild(btnBetMinusCircle);

  const btnBetMinus = PIXI.Sprite.from('minus-icon');
  btnBetMinus.anchor.set(0.5, 0.5);
  btnBetMinusCircle.addChild(btnBetMinus);

  const btnBetPlusCircle = new PIXI.Graphics();
  btnBetPlusCircle.beginFill(0x000000, 0.4);
  btnBetPlusCircle.lineStyle(10, 0xFFFFFF);
  btnBetPlusCircle.drawEllipse(0, 0, 100, 100);
  btnBetPlusCircle.endFill();
  btnBetPlusCircle.scale.x = 0.22;
  btnBetPlusCircle.scale.y = 0.22;
  btnBetPlusCircle.x = btnPlay.x + (btnPlay.width / 2) + btnBetPlusCircle.width;
  btnBetPlusCircle.y = btnPlay.y + (btnPlay.height / 2) - (btnBetPlusCircle.height / 2) + 10;
  controls.addChild(btnBetPlusCircle);

  const btnBetPlus = PIXI.Sprite.from('plus-icon');
  btnBetPlus.anchor.set(0.5, 0.5);
  btnBetPlusCircle.addChild(btnBetPlus);

  initBetWindow();
}

function initBetWindow() {
  const container = new PIXI.Container();
  container.x = 850;
  container.y = 130;
  stage.addChild(container);

  const background = new PIXI.Graphics();
  background.beginFill(0x000000, 0.9);
  background.drawRoundedRect(0, 0, 280, 400, 10);
  background.endFill();
  container.addChild(background);

  const betMultiplerText = new PIXI.Text('BET MULTIPLIER 10x', {
    fontFamily: 'Archivo Black',
    fontSize: 15,
    fill: '#FDAD00',
  });
  betMultiplerText.anchor.set(0.5, 0);
  betMultiplerText.x = container.width / 2;
  betMultiplerText.y = 20;
  container.addChild(betMultiplerText);
  texts.push(betMultiplerText);

  betValueTool = createBetTool('BET');
  betValueTool.container.x = 0;
  betValueTool.container.y = betMultiplerText.y + betMultiplerText.height + 50;
  container.addChild(betValueTool.container);
  betValueTool.valueText.text = bet;
  betValueTool.btnMinus.on('pointerdown', function() {
    if (bet > 1) {
      bet -= 1;
      betValueTool.valueText.text = bet;
      betValue.text = (bet * 10 * coinValueValues[coinValueValueIndex]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      totalBetTool.valueText.text = '€' + (bet * 10 * coinValueValues[coinValueValueIndex]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  });
  betValueTool.btnPlus.on('pointerdown', function() {
    if (bet < 10) {
      bet += 1;
      betValueTool.valueText.text = bet;
      betValue.text = (bet * 10 * coinValueValues[coinValueValueIndex]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      totalBetTool.valueText.text = '€' + (bet * 10 * coinValueValues[coinValueValueIndex]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  });

  coinValueTool = createBetTool('COIN VALUE');
  coinValueTool.container.x = 0;
  coinValueTool.container.y = betValueTool.container.y + betValueTool.container.height + 30;
  container.addChild(coinValueTool.container);
  coinValueTool.valueText.text = '€' + coinValueValues[coinValueValueIndex].toFixed(2);
  coinValueTool.btnMinus.on('pointerdown', function() {
    if (coinValueValueIndex > 0) {
      coinValueValueIndex--;
      coinValueTool.valueText.text = '€' + coinValueValues[coinValueValueIndex].toFixed(2);
      betValue.text = (bet * 10 * coinValueValues[coinValueValueIndex]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      totalBetTool.valueText.text = '€' + (bet * 10 * coinValueValues[coinValueValueIndex]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  });
  coinValueTool.btnPlus.on('pointerdown', function() {
    if (coinValueValueIndex < coinValueValues.length - 1) {
      coinValueValueIndex += 1;
      coinValueTool.valueText.text = '€' + coinValueValues[coinValueValueIndex].toFixed(2);
      betValue.text = (bet * 10 * coinValueValues[coinValueValueIndex]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      totalBetTool.valueText.text = '€' + (bet * 10 * coinValueValues[coinValueValueIndex]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  });

  totalBetTool = createBetTool('TOTAL BET');
  totalBetTool.container.x = 0;
  totalBetTool.container.y = coinValueTool.container.y + coinValueTool.container.height + 30;
  container.addChild(totalBetTool.container);
  totalBetTool.valueText.text = '€' + (bet * 10 * coinValueValues[coinValueValueIndex]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

}

function createBetTool(label) {
  const container = new PIXI.Container();

  const labelText = new PIXI.Text(label, {
    fontFamily: 'Archivo Black',
    fontSize: 15,
    fill: '#FFFFFF',
  });
  labelText.anchor.set(0.5, 0.5);
  container.addChild(labelText);
  texts.push(labelText);

  const btnMinusCircle = new PIXI.Graphics();
  btnMinusCircle.beginFill(0xFFFFFF);
  btnMinusCircle.drawCircle(0, 0, 25);
  btnMinusCircle.x = btnMinusCircle.width;
  btnMinusCircle.y = labelText.height + 30;
  btnMinusCircle.interactive = true;
  container.addChild(btnMinusCircle);

  const btnMinusIcon = PIXI.Sprite.from('minus-icon');
  btnMinusIcon.scale.set(0.22, 0.22);
  btnMinusIcon.anchor.set(0.5, 0.5);
  btnMinusIcon.tint = 0x333333;
  btnMinusCircle.addChild(btnMinusIcon);

  const valueBackgroundBorder = new PIXI.Graphics();
  valueBackgroundBorder.beginFill(0x444444);
  valueBackgroundBorder.drawRoundedRect(0, 0, 100, 50, 5);
  valueBackgroundBorder.endFill();
  valueBackgroundBorder.x = btnMinusCircle.x + (btnMinusCircle.width / 2) + 15;
  valueBackgroundBorder.y = btnMinusCircle.y - (btnMinusCircle.height / 2);
  container.addChild(valueBackgroundBorder);

  const valueBackground = new PIXI.Graphics();
  valueBackground.beginFill(0x222222);
  valueBackground.drawRoundedRect(3, 3, 94, 44, 5);
  valueBackground.endFill();
  valueBackgroundBorder.addChild(valueBackground);

  const valueText = new PIXI.Text('', {
    fontFamily: 'Google Sans',
    fontWeight: 800,
    fontSize: 16,
    fill: '#FFFFFF',
  });
  valueText.anchor.set(0.5, 0.5);
  valueText.x = valueBackgroundBorder.width / 2;
  valueText.y = valueBackgroundBorder.height / 2;
  valueBackgroundBorder.addChild(valueText);
  texts.push(valueText);

  const btnPlusCircle = new PIXI.Graphics();
  btnPlusCircle.beginFill(0x00B862);
  btnPlusCircle.drawCircle(0, 0, 25);
  btnPlusCircle.x = valueBackgroundBorder.x + valueBackgroundBorder.width + (btnPlusCircle.width / 2) + 15;
  btnPlusCircle.y = btnMinusCircle.y;
  btnPlusCircle.interactive = true;
  container.addChild(btnPlusCircle);

  const btnPlusIcon = PIXI.Sprite.from('plus-icon');
  btnPlusIcon.scale.set(0.22, 0.22);
  btnPlusIcon.anchor.set(0.5, 0.5);
  btnPlusIcon.tint = 0xFFFFFF;
  btnPlusCircle.addChild(btnPlusIcon);

  labelText.x = valueBackgroundBorder.x + (valueBackgroundBorder.width / 2);

  return { container, valueText, btnMinus: btnMinusCircle, btnPlus: btnPlusCircle };
}

window.renderer = renderer;
window.stage = stage;
window.reels = reels;

return renderer.view;