import * as PIXI from 'pixi.js';
import anime from 'animejs';

const Reel = function({
  positions,
  values,
  spinValues,
  stopValues,
  speed,
  bounceDepthPerc,
  bounceDuration,
  symbolMargin,
}) {
  this.positions = positions;
  this.values = values;
  this._spinValues = [];
  this.spinValues = spinValues;
  this._stopValues = [];
  this.stopValues = stopValues;
  this.symbols = [];
  this.container = new PIXI.Container();
  this.mask = new PIXI.Graphics();
  this.offset = 0;
  this.rolling = false;
  this.stopping = false;
  this.symbolMargin = symbolMargin;
  this.speed = speed;
  this.bounceDepthPerc = bounceDepthPerc;
  this.bounceDuration = bounceDuration;
  this.stopFns = [];

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
  m.drawRect(0, 0, _this.symbols[0].width, ((_this.symbols[0].height + this.symbolMargin) * _this.positions) - this.symbolMargin);
  m.endFill();

  for (var i = 0; i < _this.symbols.length; i++) {
    var symbol = _this.symbols[i];
    symbol.y = ((symbol.height + this.symbolMargin) * (i - 1)) + (0 + _this.offset);
    if (_this.values[i]) {
      if (this.rolling) {
        symbol.texture = PIXI.Texture.from('symbol-' + _this.values[i] + '-blurred');
      } else {
        symbol.texture = PIXI.Texture.from('symbol-' + _this.values[i]);
      }
    } else {
      symbol.texture = PIXI.Texture.EMPTY;
    }
  }

  if (this.rolling) {
    this.offset += this.symbols[0].height * this.speed;

    if (this.offset >= this.symbols[0].height) {
      this.offset = 0;
      if (!isNaN(parseInt(this.stopping))) {
        this.values.unshift(this._stopValues.pop());
        this.stopping++;
      } else {
        this.values.unshift(this.spinValues.pop());

        if (this.spinValues.length === 0) {
          this.spinValues = this._spinValues.slice();
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
    this._spinValues = this.spinValues.slice();
    this._stopValues = this.stopValues.slice();
    this.rolling = true;
  }
};

Reel.prototype.stop = function() {
  if (this.rolling && this.stopping === false) {
    this.stopping = 0;
    this.spinValues = this._spinValues.slice();
  }
};

Reel.prototype.onceStop = function(fn) {
  fn.once = true;
  this.stopFns.push(fn);
};

Reel.prototype.onStop = function(fn) {
  this.stopFns.push(fn);
};

export default Reel;