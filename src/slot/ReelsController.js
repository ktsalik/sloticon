import Reel from './Reel';

class ReelsController {
  onStartFns = [];
  onStopCommandFns = [];
  onStopFns = [];
  stopCommandGiven = false;

  constructor(game, spinTime, spinTimeBetweenReels) {
    this.reels = [];

    for (let i = 0; i < game.reelsCount; i++) {
      const spinValues = [];
      for (let k = 0; k < 1000; k++) {
        spinValues.push(parseInt(Math.random() * game.symbolsCount) + 1);
      }
  
      const reel = new Reel({
        positions: game.reelPositions,
        spinValues,
        speed: game.reelsSpeed,
        useBlurredSymbols: game.hasBlurredSymbols,
        bounceDepthPerc: 0.1,
        bounceDuration: 350,
        symbolMargin: game.symbolMargin,
        maskPaddingX: game.maskPaddingX,
        maskPaddingY: game.maskPaddingY,
      });
      reel.container.z = 3;
      reel.mask.z = 4;

      game.ticker.add(() => {
        reel.render();
      });

      game.stage.addChild(reel.container);
      game.stage.addChild(reel.mask);
      this.reels.push(reel);
    }
  
    this.reels.forEach((reel) => {
      reel.rollingTime = 0;
    });

    this.spinTime = spinTime || 350;
    this.spinTimeBetweenReels = spinTimeBetweenReels || 200;
  
    game.ticker.add((delta) => {
      for (let i = 0; i < this.reels.length; i++) {
        const reel = this.reels[i];
        const active = reel.rolling == true || reel.stopping !== false;
  
        if (active && game.betResponse) {
          const reelStopTime = this.spinTime + (i * this.spinTimeBetweenReels);
          if (reel.rollingTime > reelStopTime) {
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
  }

  get reelsActive() {
    return this.reels.some((reel) => reel.rolling == true || reel.stopping !== false);
  }

  onStart(fn) {
    this.onStartFns.push(fn);
  }

  onceStart(fn) {
    fn.once = true;
    this.onStart(fn);
  }

  onStopCommand(fn) {
    this.onStopCommandFns.push(fn);
  }

  onStop(fn) {
    this.onStopFns.push(fn);
  }

  onceStop(fn) {
    fn.once = true;
    this.onStop(fn);
  }
}

export default ReelsController;
