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
    name: 'spin-icon',
    source: `/data/spin-icon.png`,
  },
  {
    name: 'stop-icon',
    source: `/data/stop-icon.png`,
  },
  {
    name: 'circle-icon',
    source: `/data/circle-icon.png`,
  },
  {
    name: 'minus-icon',
    source: `/data/minus-solid.png`,
  },
  {
    name: 'plus-icon',
    source: `/data/plus-solid.png`,
  },
  {
    name: 'xmark-icon',
    source: `/data/xmark-solid.png`,
  },
  {
    name: 'background',
    source: `${assetsUrl}Back.jpg`,
  },
  {
    name: 'symbol-1',
    source: `${assetsUrl}symbol1.png`,
  },
  {
    name: 'symbol-2',
    source: `${assetsUrl}symbol2.png`,
  },
  {
    name: 'symbol-3',
    source: `${assetsUrl}symbol3.png`,
  },
  {
    name: 'symbol-4',
    source: `${assetsUrl}symbol4.png`,
  },
  {
    name: 'symbol-5',
    source: `${assetsUrl}symbol5.png`,
  },
  {
    name: 'symbol-6',
    source: `${assetsUrl}symbol6.png`,
  },
  {
    name: 'symbol-7',
    source: `${assetsUrl}symbol7.png`,
  },
  {
    name: 'symbol-8',
    source: `${assetsUrl}symbol8.png`,
  },
  {
    name: 'symbol-9',
    source: `${assetsUrl}symbol9.png`,
  },
  {
    name: 'symbol-10',
    source: `${assetsUrl}symbol10.png`,
  },
  {
    name: 'symbol-11',
    source: `${assetsUrl}symbol11.png`,
  },
  {
    name: 'symbol-12',
    source: `${assetsUrl}symbol12.png`,
  },
  {
    name: 'symbol-1-blurred',
    source: `${assetsUrl}symbol1-blurred.png`,
  },
  {
    name: 'symbol-2-blurred',
    source: `${assetsUrl}symbol2-blurred.png`,
  },
  {
    name: 'symbol-3-blurred',
    source: `${assetsUrl}symbol3-blurred.png`,
  },
  {
    name: 'symbol-4-blurred',
    source: `${assetsUrl}symbol4-blurred.png`,
  },
  {
    name: 'symbol-5-blurred',
    source: `${assetsUrl}symbol5-blurred.png`,
  },
  {
    name: 'symbol-6-blurred',
    source: `${assetsUrl}symbol6-blurred.png`,
  },
  {
    name: 'symbol-7-blurred',
    source: `${assetsUrl}symbol7-blurred.png`,
  },
  {
    name: 'symbol-8-blurred',
    source: `${assetsUrl}symbol8-blurred.png`,
  },
  {
    name: 'symbol-9-blurred',
    source: `${assetsUrl}symbol9-blurred.png`,
  },
  {
    name: 'symbol-10-blurred',
    source: `${assetsUrl}symbol10-blurred.png`,
  },
  {
    name: 'symbol-11-blurred',
    source: `${assetsUrl}symbol11-blurred.png`,
  },
  {
    name: 'symbol-12-blurred',
    source: `${assetsUrl}symbol12-blurred.png`,
  },
]);

for (let i = 1; i <= symbolsCount; i++) {
  for (let j = 0; j <= 32; j++) {
    game.addResource({
      name: 'symbol-' + i + '-animation-' + j,
      source: `${assetsUrl}symbol${i}/symbol${i}_${(j <= 9 ? '0' : '') + j}.png`,
    });
  }
}

for (let i = 1; i <= 20; i++) {
  game.addResource({
    name: 'symbol-frame-' + i,
    source: `${assetsUrl}symbol-frames/Frame${(i <= 9 ? '0' : '') + i}.png`,
  });
}
game.addResource({
  name: 'symbol-frame-back',
  source: `${assetsUrl}symbol-frames/Frames back.png`,
});

const symbolsAnimationFramesIds = [];
for (let i = 0; i < symbolsCount; i++) {
  symbolsAnimationFramesIds[i] = [];
  for (let j = 0; j <= 32; j++) {
    symbolsAnimationFramesIds[i].push('symbol-' + (i + 1) + '-animation-' + j);
  }
}

game.onInit(() => {
  const background = game.addSprite('background');
  background.z = 2;
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
        game.soundAssets.coinsEffect.volume = 0.4;
        game.soundAssets.coinsEffect.currentTime = 0;
        game.soundAssets.coinsEffect.play();

        winDisplayed = true;
        game.oncePlay(() => {
          game.soundAssets.coinsEffect.pause();
          winDisplayed = false;
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

                  // const symbolBackground = PIXI.Sprite.from('symbol-frame-back');
                  // symbolBackground.anchor.set(0.5, 0.5);
                  // symbol.addChild(symbolBackground);
                  // linesHighlightComponents.push(symbolBackground);

                  const animation = PIXI.AnimatedSprite.fromFrames(symbolsAnimationFramesIds[symbolValue - 1]);
                  animation.anchor.set(0.5, 0.5);
                  animation.loop = false;
                  animation.animationSpeed = 0.3;
                  symbol.addChild(animation);
                  animation.onComplete = () => {
                    symbol.hide = false;
                    setTimeout(() => {
                      if (!animation.destroyed) {
                        animation.destroy();
                        // symbolBackground.destroy();
                        symbolFrame.destroy();
                      }
                    });
                  };
                  game.reelsController.reels[i].onceStart(() => {
                    symbol.hide = false;
                    setTimeout(() => {
                      if (!animation.destroyed) {
                        animation.destroy();
                        // symbolBackground.destroy();
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

      if (linesHighlightTime >= 2000) {
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
];

for (let i = 0; i <= 23; i++) {
  loadingAssetsBundle.push({
    name: 'loading-bar-' + i,
    srcs: `${assetsUrl}Loading/LoadingBar/LoadingBar_${(i <= 9 ? '0' : '') + i}.png`,
  });
}

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

  const loadingBar = PIXI.Sprite.from('loading-bar-0');
  loadingBar.x = (1280 - loadingBar.width) / 2;
  loadingBar.y = 700;
  container.addChild(loadingBar);

  game.onLoading((progress) => {
    loadingBar.texture = PIXI.Texture.from('loading-bar-' + (Math.round(progress * 23)));
    
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