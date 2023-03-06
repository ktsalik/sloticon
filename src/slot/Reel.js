import * as PIXI from 'pixi.js';
import anime from 'animejs';

const Reel = function({
  positions,
  spinValues,
  speed,
  bounceDepthPerc,
  bounceDuration,
  symbolMargin,
  maskPaddingX,
  maskPaddingY,
}) {
  this.positions = positions;
  this.values = [];
  this._spinValues = spinValues.slice();
  this.spinValues = spinValues.slice();
  this.stopValues = [];
  this.symbols = [];
  this.container = new PIXI.Container();
  this.mask = new PIXI.Graphics();
  this.offset = 0;
  this.rolling = false;
  this.stopping = false;
  this.symbolMargin = symbolMargin;
  this.speed = speed;
  this.accelerating = false;
  this.bounceDepthPerc = bounceDepthPerc;
  this.bounceDuration = bounceDuration;
  this.stopFns = [];
  this.startFns = [];
  this.maskPaddingX = maskPaddingX || 0;
  this.maskPaddingY = maskPaddingY || 0;

  this.container.mask = this.mask;

  for (var i = 0; i < positions + 1; i++) {
    var symbol = new PIXI.Sprite(PIXI.Texture.EMPTY);
    this.container.addChild(symbol);
    this.symbols.push(symbol);
  }
};

Reel.prototype.render = function() {
  var _this = this;

  var m = _this.mask;
  m.x = _this.container.x;
  m.y = _this.container.y;
  m.clear();
  m.beginFill(0x000000);
  m.drawRect(0 - this.maskPaddingX, 0 - this.maskPaddingY, _this.symbols[0].width + (this.maskPaddingX * 2), ((_this.symbols[0].height + this.symbolMargin + this.maskPaddingY) * _this.positions) - this.symbolMargin);
  m.endFill();

  for (var i = 0; i < _this.symbols.length; i++) {
    var symbol = _this.symbols[i];
    symbol.anchor.set(0.5, 0.5);

    if (_this.values[i]) {
      if (this.rolling && !this.accelerating) {
        symbol.texture = PIXI.Texture.from('symbol-' + _this.values[i] + '-blurred');
      } else {
        symbol.texture = PIXI.Texture.from('symbol-' + _this.values[i]);
      }
    } else {
      symbol.texture = PIXI.Texture.EMPTY;
    }

    symbol.x = symbol.width / 2;
    symbol.y = ((symbol.height + this.symbolMargin) * (i - 1)) + (0 + _this.offset);
    symbol.y += symbol.height / 2;
  }

  if (this.rolling) {
    this.offset += this.symbols[0].height * this.speed;

    if (this.offset >= this.symbols[0].height) {
      this.offset = 0;
      if (!isNaN(parseInt(this.stopping))) {
        this.values.unshift(this.stopValues.pop());
        this.stopping++;
      } else {
        this.values.unshift(this._spinValues.pop());

        if (this._spinValues.length === 0) {
          this._spinValues = this.spinValues.slice();
        }
      }
      this.values.splice(-1, 1);
    }

    if (this.stopping == this.positions + 1) {
      this.rolling = false;
      this.stopping++;
      var o = {
        offset: _this.symbols[0].height * this.bounceDepthPerc,
      };
      this.offset = o.offset;
      anime({
        targets: o,
        offset: 0,
        round: 1,
        duration: this.bounceDuration,
        easing: 'easeOutQuint',
        update: function() {
          _this.offset = o.offset;
        },
        complete: function() {
          _this.stopping = false;
          
          for (let i = 0; i < _this.stopFns.length; i++) {
            const fn = _this.stopFns[i];

            if (fn.once) {
              _this.stopFns.splice(i--, 1);
            }

            fn();
          }
        },
      });
    }
  }
};

Reel.prototype.roll = function() {
  if (!this.rolling && this.stopping === false) {
    this.rolling = true;

    for (let i = 0; i < this.startFns.length; i++) {
      const fn = this.startFns[i];

      if (fn.once) {
        this.startFns.splice(i--, 1);
      }

      fn();
    }
  }
};

Reel.prototype.stop = function() {
  if (this.rolling && this.stopping === false) {
    this.stopping = 0;
  }
};

Reel.prototype.onceStop = function(fn) {
  fn.once = true;
  this.stopFns.push(fn);
};

Reel.prototype.onStop = function(fn) {
  this.stopFns.push(fn);
};

Reel.prototype.onceStart = function(fn) {
  fn.once = true;
  this.startFns.push(fn);
};

Reel.prototype.onStart = function(fn) {
  this.startFns.push(fn);
};

export default Reel;