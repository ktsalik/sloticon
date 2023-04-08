const key = localStorage.getItem('key');

const symbolsCount = 8;

const game = new Game({
  id: 'rock-climber',
  width: 1280,
  height: 800,
  reelsCount: 5,
  reelPositions: 3,
  symbolsCount,
  hasBlurredSymbols: true,
  symbolMargin: 20,
  maskPaddingX: 13,
  maskPaddingY: 14,
  reelsSpeed: 0.16,
  spinTimeBetweenReels: 135,
}, socket);

const assetsUrl = `/data/${gameId}/`;
game.addResource([
  {
    name: 'controls-spritesheet',
    source: `/data/controls-spritesheet.json`,
  },
  {
    name: 'main-game-spritesheet',
    source: `${assetsUrl}main-game-spritesheet.json`,
  },
  {
    name: 'coin-animation-spritesheet',
    source: `/data/coin-animation-spritesheet.json`,
  },
  {
    name: 'logo-animation-spritesheet',
    source: `${assetsUrl}logo-animation-spritesheet.json`,
  },
  {
    name: 'win-animation-spritesheet',
    source: `${assetsUrl}win-animation-spritesheet.json`,
  },
]);

let keepThrowingCoins = true;
async function throwCoins(stage) {
  const coins = [];
  for (let i = 0; i < 50 && keepThrowingCoins; i++) {
    const coin = PIXI.AnimatedSprite.fromFrames(PIXI.Assets.cache.get('coin-animation-spritesheet').data.animations.coin);
    coin.x = 1280 / 2;
    coin.y = 700;
    coin.anchor.set(0.5, 0.5);
    coin.scale.set(0.25, 0.25);
    stage.addChild(coin);
    coin.play();
    let moveXStep = 50 + Math.random() * 80;
    const coinMovementTimeline = gsap.timeline();
    coinMovementTimeline.to(coin, {
      y: 550,
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
  background.z = 3;

  const screen = game.addSprite('screen');
  screen.z = 1;

  const logoAnimation = PIXI.AnimatedSprite.fromFrames(PIXI.Assets.cache.get('logo-animation-spritesheet').data.animations.logo);
  logoAnimation.x = 1280 / 2;
  logoAnimation.z = 4;
  logoAnimation.anchor.set(0.5, 0);
  logoAnimation.loop = false;
  logoAnimation.animationSpeed = 0.3;
  logoAnimation.play();
  logoAnimation.onComplete = () => {
    setTimeout(() => {
      if (!game.stage.destroyed) {
        logoAnimation.gotoAndPlay(0);
      }
    }, 5000);
  };
  game.stage.addChild(logoAnimation);

  const reels = game.reelsController.reels;

  reels.forEach((reel, i) => {
    reel.container.x = 245 + (i * 144) + (i * 15);
    reel.container.y = 90;
    reel.container.z = 2;
  });

  const controls = initControls(game);
  controls.scale.x *= 1.1;
  controls.scale.y *= 1.1;
  controls.x -= 1280 * 0.05;
  controls.y = 800 - (controls.height / 2) - 20;

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
                  const symbol = reels[i].symbols[j];

                  const animation = PIXI.AnimatedSprite.fromFrames(PIXI.Assets.cache.get('win-animation-spritesheet').data.animations.win_effect);
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

                  const frame = PIXI.Sprite.from('frame');
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

game.onLoading((progress) => {
  pleaseWaitText.text = 'Loading ' + parseInt(progress * 100) + '%';
  
  if (progress >= 1) {
    ticker.stop();
    container.destroy();
  }
});

game.start();

// const themeSoundtrack = new Audio(`${assetsUrl}theme.mp3`);
// themeSoundtrack.loop = true;
// themeSoundtrack.volume = 0.2;
// game.oncePlay(() => {
//   themeSoundtrack.currentTime = 10;
//   themeSoundtrack.play();
// });

// game.onDestroy(() => {
//   themeSoundtrack.pause();
// });

window.game = game;
return game;