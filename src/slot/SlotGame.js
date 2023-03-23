import * as PIXI from 'pixi.js';
import ReelsController from './ReelsController';
import gsap from 'gsap';

class SlotGame {
  onInitFns = [];
  onDestroyFns = [];
  onBalanceChangeFns = [];
  onBetChangeFns = [];
  onCoinValueChangeFns = [];
  onLoadingFns = [];
  onPlayFns = [];

  constructor({
    id,
    width,
    height,
    reelsCount,
    reelPositions,
    symbolsCount,
    hasBlurredSymbols,
    symbolMargin,
    maskPaddingX,
    maskPaddingY,
    reelsSpeed,
    spinTime,
    spinTimeBetweenReels,
  }, socket) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.reelsCount = reelsCount;
    this.reelPositions = reelPositions;
    this.symbolsCount = symbolsCount;
    this.hasBlurredSymbols = hasBlurredSymbols || false;
    this.symbolMargin = symbolMargin || 0;
    this.maskPaddingX = maskPaddingX || 0;
    this.maskPaddingY = maskPaddingY || 0;
    this.reelsSpeed = reelsSpeed || 0.18;
    this.spinTime = spinTime;
    this.spinTimeBetweenReels = spinTimeBetweenReels;
    this.socket = socket;

    this.renderer = new PIXI.autoDetectRenderer({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
    });

    this.stage = new PIXI.Container();

    this.ticker = new PIXI.Ticker();

    this.ticker.add(() => {
      this.renderer.render(this.stage);
    });

    this.assets = [];
    this.soundAssets = {
      reelsRun: new Audio(`/data/reels-run.mp3`),
      reelStop: new Audio(`/data/reel-stop.mp3`),
      winEffect: new Audio(`/data/win.mp3`),
      coinsEffect: new Audio(`/data/coins.mp3`),
    };

    this.sprites = [];
    this.texts = [];

    this._bet = 1;
    this.coinValueValues = [0.01, 0.03, 0.10, 0.20, 0.50];
    this._coinValueValueIndex = 0;
    this._balance = 0;

    this.autoplay = false;
    this.creditsTweenCompleted = true;
  }

  onInit(fn) {
    this.onInitFns.push(fn);
  }

  onDestroy(fn) {
    this.onDestroyFns.push(fn);
  }

  resize() {
    const gameRatio = this.width / this.height;
    const windowRatio = window.innerWidth / window.innerHeight;
    let width, height;

    if (windowRatio < gameRatio) {
      width = window.innerWidth;
      height = width / gameRatio;
    } else {
      height = window.innerHeight;
      width = height * gameRatio;
    }

    this.renderer.resize(width, height);

    this.stage.scale.x = this.renderer.view.width / this.width;
    this.stage.scale.y = this.renderer.view.height / this.height;
  }

  init() {
    this.reelsController = new ReelsController(this, this.spinTime, this.spinTimeBetweenReels);

    this.resize();

    this.onInitFns.forEach((fn) => fn());

    this.stage.children.sort(function(a, b) {
      if (a.z > b.z) {
        return 1;
      } else {
        return -1;
      }
    });

    const onWindowResize = () => {
      setTimeout(() => {
        this.resize();
      }, 50);
    };

    window.addEventListener('resize', onWindowResize);

    this.onDestroy(() => {
      window.removeEventListener('resize', onWindowResize);
    });

    this.onNetworkGamestate = (state) => {
      this.processGamestate(state);
    };
    this.socket.on('gamestate', this.onNetworkGamestate);

    this.onNetworkBet = (data) => {
      this.processBet(data);
    };
    this.socket.on('bet', this.onNetworkBet);

    this.ticker.add(() => {
      this.texts.forEach((text) => {
        const t = text.text;
        text.text = '';
        text.text = t;
      });
    });
    
    this.ticker.add(() => {
      if (this.autoplay) {
        if (!this.reelsController.reelsActive) {
          if (this.betResponse === null || !this.betResponse.isWin || this.creditsTweenCompleted) {
            this.play();
          }
        }
      }
    });

    this.onActionButtonPressed = (e) => {
      if (e.code === 'Space' || e.code === 'Numpad0') {
        this.play();
      }
    };
    window.addEventListener('keypress', this.onActionButtonPressed);
  }

  start() {
    PIXI.Assets.addBundle(this.id, this.assets);
    PIXI.Assets.loadBundle(this.id, (progress) => {
      this.onLoadingFns.forEach((fn) => {
        fn(progress);
      });
    }).then(() => {
      this.init();

      this.socket.emit('gamestate', {
        key: localStorage.getItem('key'),
        gameId: this.id,
      });
    });
  }

  onLoading(fn) {
    this.onLoadingFns.push(fn);
  }

  play() {
    if (this.reelsController.reelsActive) {
      if (this.betResponse) {
        this.reelsController.onStopCommandFns.forEach((fn) => fn());
  
        if (this.reelsController.reels.some((r) => (r.rolling == true || r.stopping < r.positions + 1) && !(r.forceStopped || r.stoppedAutomatically))) {
          this.soundAssets.reelsRun.pause();
          new Audio(this.soundAssets.reelStop.src).play();
        }

        this.reelsController.reels.forEach((r, i) => {
          if ((r.rolling == true || r.stopping < r.positions + 1) && !(r.forceStopped || r.stoppedAutomatically)) {
            r.values = this.betResponse.reels[i].slice();
            r.offset = 0;
            r.stopping = r.positions + 1;
            r.forceStopped = true;
          }
        });
      }

      if (!this.reelsController.stopCommandGiven) {
        this.reelsController.stopCommandGiven = true;
        this.autoplay = false;

        for (let i = 0; i < this.onPlayFns.length; i++) {
          const fn = this.onPlayFns[i];
          fn();

          if (fn.once) {
            this.onPlayFns.splice(i--, 1);
          }
        }
      }
    } else {
      this.socket.emit('bet', {
        key: localStorage.getItem('key'),
        gameId: this.id,
        bet: this.bet,
        coinValue: this.coinValue,
      });

      this.betResponse = null;
      this.reelsController.stopCommandGiven = false;
      this.balance -= Math.round(this.betValue * 100) / 100;
  
      this.reelsController.reels.forEach((r) => {
        r.stoppedAutomatically = false;
        r.forceStopped = false;
        r.roll();
  
        r.onceStop(() => {
          if (!this.reelsController.reelsActive) {
            for (let i = 0; i < this.reelsController.onStopFns.length; i++) {
              const fn = this.reelsController.onStopFns[i];
  
              if (fn.once) {
                this.reelsController.onStopFns.splice(i--, 1);
              }
              
              fn();
            }
          }

          this.soundAssets.reelsRun.pause();
        });
      });

      this.soundAssets.reelsRun.loop = true;
      this.soundAssets.reelsRun.currentTime = 0;
      this.soundAssets.reelsRun.play();
  
      for (let i = 0; i < this.reelsController.onStartFns.length; i++) {
        const fn = this.reelsController.onStartFns[i];
  
        if (fn.once) {
          this.reelsController.onStartFns.splice(i--, 1);
        }
  
        fn();
      }

      for (let i = 0; i < this.onPlayFns.length; i++) {
        const fn = this.onPlayFns[i];
        fn();

        if (fn.once) {
          this.onPlayFns.splice(i--, 1);
        }
      }
    }
  }

  onPlay(fn) {
    this.onPlayFns.push(fn);
  }

  oncePlay(fn) {
    fn.once = true;
    this.onPlay(fn);
  }

  processGamestate(state) {
    this.balance = state.balance;
    this.coinValueValueIndex = this.coinValueValues.indexOf(state.coinValue);
    this.bet = state.bet;

    state.reels.forEach((reelValues, i) => {
      this.reelsController.reels[i].values = reelValues;
    });

    this.ticker.start();
  }

  processBet(data) {
    this.balance = data.balance;
    
    data.reels.forEach((reelValues, i) => {
      this.reelsController.reels[i].stopValues = reelValues.slice();
    });

    if (data.isWin) {
      let totalWin = 0;
      data.win.forEach((line) => totalWin += line.amount);
      this.balance -= totalWin;
  
      const o = { balance: this.balance };
      this.creditsTweenCompleted = false;
      this.reelsController.onceStop(() => {
        const creditsTween = gsap.to(o, {
          balance: this.balance + totalWin,
          duration: 3,
          onUpdate: () => {
            this.balance = o.balance;
          },
          onComplete: () => {
            this.balance = data.balance;
            this.creditsTweenCompleted = true;
          },
        });

        this.reelsController.onceStart(() => {
          setTimeout(() => {
            if (creditsTween && creditsTween.isActive()) {
              creditsTween.progress(1);
              creditsTween.kill();
            }
          });
        });
      });
    }

    this.betResponse = data;

    if (this.reelsController.stopCommandGiven) {
      this.play();
    }
  }

  addResource(resource) {
    if (resource.constructor === Array) {
      this.assets = [
        ...this.assets,
        ...resource.map((r) => {
          return {
            name: r.name,
            srcs: r.source,
          };
        }),
      ];
    } else {
      this.assets.push({
        name: resource.name,
        srcs: resource.source,
      });
    }
  }

  addSprite(resourceKey, addToStage = true) {
    const sprite = PIXI.Sprite.from(resourceKey);

    this.sprites.push(sprite);

    if (addToStage) {
      this.stage.addChild(sprite);
    }

    return sprite;
  }

  destroy() {
    this.ticker.stop();
    this.onDestroyFns.forEach((fn) => fn());
    this.socket.off('gamestate', this.onNetworkGamestate);
    this.socket.off('bet', this.onNetworkBet);
    window.removeEventListener('keypress', this.onActionButtonPressed);
  }

  get coinValue() {
    return this.coinValueValues[this.coinValueValueIndex];
  }

  get betValue() {
    return this.bet * 10 * this.coinValue;
  }

  get betValueToLocale() {
    return this.betValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  set balance(value) {
    this._balance = value;
    this.onBalanceChangeFns.forEach((fn) => fn(this._balance));
  }

  get balance() {
    return this._balance;
  }

  onBalanceChange(fn) {
    this.onBalanceChangeFns.push(fn);
  }

  set bet(value) {
    this._bet = value;
    this.onBetChangeFns.forEach((fn) => fn(this._bet));
  }

  get bet() {
    return this._bet;
  }

  onBetChange(fn) {
    this.onBetChangeFns.push(fn);
  }

  set coinValueValueIndex(value) {
    this._coinValueValueIndex = value;
    this.onCoinValueChangeFns.forEach((fn) => fn(this.coinValueValues[this._coinValueValueIndex]));
  }

  get coinValueValueIndex() {
    return this._coinValueValueIndex;
  }

  onCoinValueChange(fn) {
    this.onCoinValueChangeFns.push(fn);
  }
}

export default SlotGame;