import * as PIXI from 'pixi.js';
import anime from 'animejs';

const Reel = function(positions) {
  this.positions = positions;
  this.values = [];
  this._spinValues = [];
  this.spinValues = [];
  this._stopValues = [];
  this.stopValues = [];
  this.symbols = [];
  this.container = new PIXI.Container();
  this.mask = new PIXI.Graphics();
  this.offset = 0;
  this.rolling = false;
  this.stopping = false;

  this.container.mask = this.mask;

  for (var i = 0; i < positions + 1; i++) {
    var symbol = new PIXI.Sprite(PIXI.Texture.EMPTY);
    this.container.addChild(symbol);
    this.symbols.push(symbol);
  }
};

Reel.prototype.render = function(speed, bounceDuration, reelIndex) {
  var _this = this;

  var m = _this.mask;
  m.x = _this.container.x;
  m.y = _this.container.y;
  m.clear();
  m.beginFill(0x000000);
  m.drawRect(0, 0, _this.symbols[0].width * _this.container.scale.x, (_this.symbols[0].height * _this.container.scale.y) * _this.positions);
  m.endFill();

  for (var i = 0; i < _this.symbols.length; i++) {
    var symbol = _this.symbols[i];
    symbol.y = (symbol.height * (i - 1)) + (0 + _this.offset);
    if (_this.values[i]) {
      symbol.texture = PIXI.Texture.from('symbol-' + _this.values[i]);
    } else {
      symbol.texture = PIXI.Texture.EMPTY;
    }
  }

  if (this.rolling) {
    this.offset += this.symbols[0].height * speed;

    if (this.offset >= this.symbols[0].height) {
      this.offset = 0;
      if (!isNaN(parseInt(this.stopping))) {
        if (!this._stopValues.length) {
          console.error('No stop values have been set for reel: ' + reelIndex);
        }
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
        offset: _this.symbols[0].height * speed,
      };
      this.offset = o.offset;
      anime({
        targets: o,
        offset: 0,
        round: 1,
        duration: bounceDuration,
        easing: 'easeOutQuint',
        update: function() {
          _this.offset = o.offset;
        },
        complete: function() {
          _this.stopping = false;
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

export default Reel;