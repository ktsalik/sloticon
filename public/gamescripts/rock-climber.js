const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});

const spinTime = 550;
const spinTimeBetweenReels = 200;

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
          name: 'spin-icon',
          srcs: `/data/spin-icon.png`,
        }
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

function init() {
  const controls = new PIXI.Container();
  controls.z = 10;
  app.stage.addChild(controls);

  const btnPlay = PIXI.Sprite.from('spin-icon');
  btnPlay.scale.x = 0.1;
  btnPlay.scale.y = 0.1;
  btnPlay.x = 950 - btnPlay.width;
  controls.addChild(btnPlay);

  const btnPlayCircle  = new PIXI.Graphics();
  btnPlayCircle.lineStyle(20, 0xFFFFFF, 1);
  btnPlayCircle.drawEllipse(485, 410, 550, 550);
  btnPlay.addChild(btnPlayCircle);

  PIXI.Ticker.shared.add(() => {
    controls.y = ((800 - 240) * app.renderer.view.height) / 800;
  });

  const background = PIXI.Sprite.from('background');
  background.x = 0;
  background.y = 0;
  background.z = 2;
  app.stage.addChild(background);

  const reelsBackground = PIXI.Sprite.from('reels-background');
  reelsBackground.x = 0;
  reelsBackground.y = 0;
  reelsBackground.z = 1;
  app.stage.addChild(reelsBackground);

  for (let i = 0; i < 5; i++) {
    const values = [];
    for (let k = 0; k < 4; k++) {
      values.push(parseInt(Math.random() * 8) + 1);
    }

    const spinValues = [];
    for (let k = 0; k < 100; k++) {
      spinValues.push(parseInt(Math.random() * 8) + 1);
    }

    const stopValues = [];
    for (let k = 0; k < 4; k++) {
      stopValues.push(parseInt(Math.random() * 8) + 1);
    }

    const reel = new Reel({
      positions: 3,
      values,
      spinValues,
      stopValues,
      speed: 0.18,
      bounceDepthPerc: 0.2,
      bounceDuration: 350,
      symbolMargin: 13,
    });
    reel.container.z = 3;
    reel.mask.z = 4;
    PIXI.Ticker.shared.add(() => {
      reel.container.x = ((245 + (i * 144) + (i * 15)) * app.renderer.view.width) / 1280;
      reel.container.y = (101 * app.renderer.view.height) / 800;
      reel.render();
    });
    app.stage.addChild(reel.container);
    app.stage.addChild(reel.mask);
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
        if (reel.rollingTime > reelStopTime) {
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
    if (e.code === 'Space') {
      let reelsActive = false;
      for (let i = 0; i < reels.length; i++) {
        reelsActive |= reels[i].rolling == true || reels[i].stopping !== false;
      }

      if (reelsActive) {
        reels.forEach((r, i) => {
          if ((r.rolling == true || r.stopping < r.positions + 1) && !(r.forceStopped || r.stoppedAutomatically)) {
            const stopValues = [];
            for (let k = 0; k < 4; k++) {
              stopValues.push(parseInt(Math.random() * 8) + 1);
            }
            r.stopValues = stopValues;
            r.values = r.stopValues.slice();
            r.offset = 0;
            r.stopping = r.positions + 1;
            r.forceStopped = true;
          }
        });
      } else {        
        reels.forEach((r) => {
          r.stoppedAutomatically = false;
          r.forceStopped = false;
          r.roll();
        });
      }
    }
  });

  app.stage.children.sort(function(a, b) {
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

    app.renderer.resize(width, height);

    app.stage.children.forEach((component) => {
      component.scale.x = app.renderer.view.width / 1280;
      component.scale.y = app.renderer.view.height / 800;
    });
  }

  resize();
  window.addEventListener('resize', resize);
}

window.app = app;
window.reels = reels;

return app.view;