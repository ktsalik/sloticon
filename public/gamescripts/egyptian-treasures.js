const key = localStorage.getItem('key');

const symbolsCount = 12;

const game = new Game({
  id: 'egyptian-treasures',
  width: 1280,
  height: 960,
  reelsCount: 5,
  reelPositions: 3,
  symbolsCount,
  hasBlurredSymbols: true,
  symbolMargin: 0,
  maskPaddingX: 0,
  maskPaddingY: 0,
  reelsSpeed: 0.17,
  spinTimeBetweenReels: 135,
}, socket);

const assetsUrl = `/data/${gameId}/`;
game.addResource([
  {
    name: 'controls-spritesheet',
    source: `/data/controls-spritesheet.json`,
  },
  {
    name: 'background',
    source: `${assetsUrl}Back.jpg`,
  },
  {
    name: 'symbols-spritesheet',
    source: `${assetsUrl}symbols-spritesheet.json`,
  },
  {
    name: 'symbol-frames-spritesheet',
    source: `${assetsUrl}symbol-frames-spritesheet.json`,
  },
  {
    name: 'coin-animation-spritesheet',
    source: `/data/coin-animation-spritesheet.json`,
  },
  {
    name: 'logo-spritesheet',
    source: `${assetsUrl}logo-spritesheet.json`,
  },
]);

for (let i = 1; i <= symbolsCount; i++) {
  game.addResource({
    name: 'symbol-' + i + '-animation-spritesheet',
    source: `${assetsUrl}symbol-${i}-animation-spritesheet.json`,
  });
}

let keepThrowingCoins = true;
async function throwCoins(stage) {
  const coins = [];
  for (let i = 0; i < 50 && keepThrowingCoins; i++) {
    const coin = PIXI.AnimatedSprite.fromFrames(PIXI.Assets.cache.get('coin-animation-spritesheet').data.animations.coin);
    coin.x = 1280 / 2;
    coin.y = 788;
    coin.anchor.set(0.5, 0.5);
    coin.scale.set(0.25, 0.25);
    stage.addChild(coin);
    coin.play();
    let moveXStep = 50 + Math.random() * 80;
    const coinMovementTimeline = gsap.timeline();
    coinMovementTimeline.to(coin, {
      y: 650,
      duration: 0.4,
      ease: 'back.easeOut',
    });

    coinMovementTimeline.to(coin, {
      y: 1000,
      duration: 0.7,
      ease: 'expo.easeIn',
    });

    if (i % 2 === 0) {
      moveXStep = -moveXStep;
    }
    gsap.to(coin, {
      x: coin.x + moveXStep,
      rotation: 3,
      duration: 0.4 + 0.7,
      onComplete: () => {
        coin.destroy();
      }, 
    });

    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

game.onInit(() => {
  const background = game.addSprite('background');
  background.z = 2;

  const logoBackground = game.addSprite('logo-back');
  logoBackground.x = (1280 - logoBackground.width) / 2;
  logoBackground.x += 15;
  logoBackground.y = 45;
  logoBackground.z = 5;

  const logoAnimation = PIXI.AnimatedSprite.fromFrames(PIXI.Assets.cache.get('logo-spritesheet').data.animations.logo_animation);
  logoAnimation.x = (1280 - logoAnimation.width) / 2;
  logoAnimation.y = 10;
  logoAnimation.z = 6;
  logoAnimation.animationSpeed = 0.3;
  logoAnimation.play();
  game.stage.addChild(logoAnimation);

  const logo = game.addSprite('logo');
  logo.x = (1280 - logo.width) / 2;
  logo.x += 15;
  logo.y = 50;
  logo.z = 7;

  const reels = game.reelsController.reels;

  reels.forEach((reel, i) => {
    reel.container.x = 57 + (i * 223) + (i * 13);
    reel.container.y = 128;
  });

  const controls = initControls(game);
  controls.scale.x *= 1.1;
  controls.scale.y *= 1.1;
  controls.x -= 1280 * 0.05;
  controls.y = 960 - (controls.height / 2) - 20;

  let linesHighlightComponents = [];
  let lineToHighlight = 0;
  let lineIsBeingHighlighted = false;
  let linesHighlightTime = 0;
  let winDisplayed = false;
  game.ticker.add((delta) => {
    if (game.betResponse && game.betResponse.isWin && !game.reelsController.reelsActive) {
      if (!winDisplayed) {
        keepThrowingCoins = true;
        throwCoins(game.stage);

        game.soundAssets.coinsEffect.volume = 0.4;
        game.soundAssets.coinsEffect.currentTime = 0;
        game.soundAssets.coinsEffect.play();

        winDisplayed = true;
        game.oncePlay(() => {
          game.soundAssets.coinsEffect.pause();
          winDisplayed = false;
          keepThrowingCoins = false;
        });
      }
      if (!lineIsBeingHighlighted) {
        game.betResponse.win.forEach((line, k) => {
          if ((lineToHighlight === 0 || k + 1 === lineToHighlight)) {
            for (let i = 0; i < line.map.length && i < line.count; i++) {
              for (let j = 0; j < line.map[i].length; j++) {
                if (line.map[i][j] === 1) {
                  const symbol = game.reelsController.reels[i].symbols[j];
                  const symbolValue = game.reelsController.reels[i].values[j];

                  const animation = PIXI.AnimatedSprite.fromFrames(PIXI.Assets.cache.get('symbol-' + symbolValue + '-animation-spritesheet').data.animations['symbol' + symbolValue]);
                  animation.anchor.set(0.5, 0.5);
                  animation.loop = false;
                  animation.animationSpeed = 0.3;
                  symbol.addChild(animation);
                  animation.onComplete = () => {
                    symbol.hide = false;
                    setTimeout(() => {
                      if (!animation.destroyed) {
                        animation.destroy();
                        symbolFrame.destroy();
                      }
                    });
                  };
                  game.reelsController.reels[i].onceStart(() => {
                    symbol.hide = false;
                    setTimeout(() => {
                      if (!animation.destroyed) {
                        animation.destroy();
                        symbolFrame.destroy();
                      }
                    });
                  });
                  symbol.hide = true;
                  animation.play();
                  linesHighlightComponents.push(animation);

                  const symbolFrame = PIXI.Sprite.from('symbol-frame-' + line.number);
                  symbolFrame.anchor.set(0.5, 0.5);
                  symbol.addChild(symbolFrame);
                  linesHighlightComponents.push(symbolFrame);
                }
              }
            }
          }
        });

        lineIsBeingHighlighted = true;
      }

      linesHighlightTime += delta * 16.667;

      if (linesHighlightTime >= 1900) {
        if (++lineToHighlight > game.betResponse.win.length) {
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
});

const loadingAssetsBundle = [
  {
    name: 'loading-background',
    srcs: `${assetsUrl}Loading/Loading screen.jpg`,
  },
  {
    name: 'loading-bar-spritesheet',
    srcs: `${assetsUrl}Loading/loading-bar-spritesheet.json`,
  },
  {
    name: 'loading-text-spritesheet',
    srcs: `${assetsUrl}Loading/loading-text-spritesheet.json`,
  },
];

const ticker = new PIXI.Ticker();
const container = new PIXI.Container();
game.resize();
container.scale.x = game.renderer.view.width / game.width;
container.scale.y = game.renderer.view.height / game.height;

ticker.add(() => {
  game.renderer.render(container);
});
ticker.start();

const pleaseWaitText = new PIXI.Text('Please Wait', {
  fontSize: 30,
  fill: '#FFFFFF',
});
pleaseWaitText.anchor.set(0.5, 0.5);
pleaseWaitText.x = 1280 / 2;
pleaseWaitText.y = 900 / 2;
container.addChild(pleaseWaitText);

PIXI.Assets.addBundle(gameId + '-loading-bundle', loadingAssetsBundle);
PIXI.Assets.loadBundle(gameId + '-loading-bundle').then(() => {
  pleaseWaitText.destroy();
  const background = PIXI.Sprite.from('loading-background');
  container.addChild(background);

  const loadingBar = PIXI.Sprite.from('LoadingBar_00.png');
  loadingBar.x = (1280 - loadingBar.width) / 2;
  loadingBar.y = 700;
  container.addChild(loadingBar);
  
  const loadingText = PIXI.AnimatedSprite.fromFrames(PIXI.Assets.cache.get('loading-text-spritesheet').data.animations.Loading);
  loadingText.animationSpeed = 0.3;
  loadingText.x = (1280 - loadingText.width) / 2;
  loadingText.y = 850;
  container.addChild(loadingText);
  loadingText.play();

  game.onLoading((progress) => {
    const progressFrame = (Math.round(progress * 23));
    loadingBar.texture = PIXI.Texture.from('LoadingBar_' + (progressFrame <= 9 ? '0' : '') + progressFrame + '.png');
    
    if (progress >= 1) {
      ticker.stop();
      container.destroy();
    }
  });
  
  game.start();
});

const themeSoundtrack = new Audio(`${assetsUrl}theme.mp3`);
themeSoundtrack.loop = true;
themeSoundtrack.volume = 0.2;
game.oncePlay(() => {
  themeSoundtrack.currentTime = 10;
  themeSoundtrack.play();
});

game.onDestroy(() => {
  themeSoundtrack.pause();
});

window.game = game;
return game;