const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
});
window.app = app;
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
          name: 'symbol-2',
          srcs: `${assetsUrl}main_game/icon_2.png`,
        },
        {
          name: 'symbol-3',
          srcs: `${assetsUrl}main_game/icon_3.png`,
        },
        {
          name: 'symbol-4',
          srcs: `${assetsUrl}main_game/icon_4.png`,
        },
        {
          name: 'symbol-5',
          srcs: `${assetsUrl}main_game/icon_5.png`,
        },
        {
          name: 'symbol-6',
          srcs: `${assetsUrl}main_game/icon_6.png`,
        },
        {
          name: 'symbol-7',
          srcs: `${assetsUrl}main_game/icon_7.png`,
        },
        {
          name: 'symbol-8',
          srcs: `${assetsUrl}main_game/icon_8.png`,
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

function init() {
  const reelsBackground = PIXI.Sprite.from('reels-background');
  reelsBackground.scale.x = app.renderer.view.width / 1280;
  reelsBackground.scale.y = app.renderer.view.height / 800;
  app.stage.addChild(reelsBackground);
  
  const background = PIXI.Sprite.from('background');
  background.scale.x = app.renderer.view.width / 1280;
  background.scale.y = app.renderer.view.height / 800;
  app.stage.addChild(background);

  const reel1 = new Reel(3);
  reel1.values = [1, 2, 3, 4];
  reel1.spinValues = [4, 4, 7, 7, 7, 1, 1, 2, 2, 2, 5, 5, 6, 6, 6];
  reel1.stopValues = [8, 7, 6, 5];
  reel1.container.scale.x = app.renderer.view.width / 1280;
  reel1.container.scale.y = app.renderer.view.height / 800;
  app.stage.addChild(reel1.container);
  app.stage.addChild(reel1.mask);
  PIXI.Ticker.shared.add(() => {
    reel1.container.x = (245 * app.renderer.view.width) / 1280;
    reel1.container.y = (101 * app.renderer.view.height) / 800;
    reel1.render(0.1, 500);
  });
  window.r = reel1;
}

return app.view;