import * as PIXI from 'pixi.js';
import gsap from 'gsap';

let onBtnTotalBetMinus, onBtnTotalBetPlus;

function initControls(game) {
  game.reelsController.onStart(() => {
    betWindow.visible = false;
  });

  const controls = new PIXI.Container();
  controls.z = 10;
  game.stage.addChild(controls);

  const infoText = new PIXI.Text('HOLD SPACE FOR TURBO SPIN', new PIXI.TextStyle({
    fontFamily: 'Archivo Black',
    fontSize: 22,
    fill: '#FFFFFF',
  }));
  infoText.anchor.set(0.5, 0.5);
  infoText.x = 1280 / 2;
  controls.addChild(infoText);
  game.texts.push(infoText);

  let spinCount = 0;
  game.reelsController.onStop(() => {
    if (++spinCount % 2 === 0) {
      infoText.text = 'SPIN TO WIN!';
    } else {
      infoText.text = 'PLACE YOUR BETS!';
    }
  });

  game.ticker.add(() => {
    if (game.reelsController.reelsActive) {
      infoText.text = 'GOOD LUCK!';
    }
  });

  const creditsLabel = new PIXI.Text('CREDIT', {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FDAD00',
  });
  creditsLabel.x = 200;
  controls.addChild(creditsLabel);
  game.texts.push(creditsLabel);

  const creditsValueEuroSign = new PIXI.Text('€', {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FFFFFF',
  });
  creditsValueEuroSign.x = creditsLabel.x + creditsLabel.width + 20;
  creditsValueEuroSign.y = creditsLabel.y;
  controls.addChild(creditsValueEuroSign);
  game.texts.push(creditsValueEuroSign);

  const creditsValue = new PIXI.Text(game.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FFFFFF',
  });
  creditsValue.x = creditsValueEuroSign.x + creditsValueEuroSign.width + 5;
  controls.addChild(creditsValue);
  game.texts.push(creditsValue);

  game.onBalanceChange((balance) => {
    creditsValue.text = balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  });

  const betLabel = new PIXI.Text('BET', {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FDAD00',
  });
  betLabel.x = creditsLabel.x + creditsLabel.width - betLabel.width + 4;
  betLabel.y = creditsLabel.y + betLabel.height + 5;
  controls.addChild(betLabel);
  game.texts.push(betLabel);

  const betValueEuroSign = new PIXI.Text('€', {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FFFFFF',
  });
  betValueEuroSign.x = betLabel.x + betLabel.width + 16;
  betValueEuroSign.y = betLabel.y;
  controls.addChild(betValueEuroSign);
  game.texts.push(betValueEuroSign);

  const betValue = new PIXI.Text(game.betValueToLocale, {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    fill: '#FFFFFF',
  });
  betValue.x = betValueEuroSign.x + betValueEuroSign.width + 5;
  betValue.y = betLabel.y;
  controls.addChild(betValue);
  game.texts.push(betValue);

  game.onBetChange(() => {
    betValue.text = game.betValueToLocale;
  });

  const winAmountContainer = new PIXI.Container();
  winAmountContainer.visible = false;
  controls.addChild(winAmountContainer);

  const winLabel = new PIXI.Text('WIN:', {
    fontFamily: 'Archivo Black',
    fontSize: 30,
    fill: '#FDAD00',
  });
  winAmountContainer.addChild(winLabel);
  game.texts.push(winLabel);

  const winAmountText = new PIXI.Text('', {
    fontFamily: 'Archivo Black',
    fontSize: 30,
    fill: '#FFFFFF',
  });
  winAmountText.x = winLabel.width + 15;
  winAmountContainer.addChild(winAmountText);
  game.texts.push(winAmountText);

  game.ticker.add(() => {
    if (game.betResponse && game.betResponse.isWin && !game.reelsController.reelsActive) {
      infoText.visible = false;
      winAmountContainer.visible = true;

      let totalWinAmount = 0;
      game.betResponse.win.forEach((line) => {
        totalWinAmount += line.amount;
      });

      winAmountText.text = '€' + totalWinAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      winAmountContainer.x = (1280 / 2) - (winAmountContainer.width / 2);
    } else {
      winAmountContainer.visible = false;
      infoText.visible = true;
    }
  });

  const btnPlay = PIXI.Sprite.from('spin-icon');
  btnPlay.scale.x = 0.3;
  btnPlay.scale.y = 0.3;
  btnPlay.anchor.set(0.5, 0.5);
  btnPlay.x = 1100 - btnPlay.width;
  btnPlay.interactive = true;
  btnPlay.on('pointerdown', () => {
    game.play();
  });
  controls.addChild(btnPlay);

  game.ticker.add(() => {
    if (game.reelsController.reelsActive || game.autoplay) {
      btnPlay.texture = PIXI.Texture.from('stop-icon');
    } else {
      btnPlay.texture = PIXI.Texture.from('spin-icon');
    }
  });

  const btnPlayCircle = PIXI.Sprite.from('circle-icon');
  btnPlayCircle.x = btnPlay.x;
  btnPlayCircle.y = btnPlay.y;
  btnPlayCircle.scale.x = 0.3;
  btnPlayCircle.scale.y = 0.3;
  btnPlayCircle.anchor.set(0.5, 0.5);
  btnPlayCircle.interactive = true;
  btnPlayCircle.on('pointerdown', () => {
    game.play();
  });
  controls.addChild(btnPlayCircle);
  
  let btnPlayCircleRotation = {
    value: 0.1,
  };

  let btnPlayCircleRotationTween;
  game.reelsController.onStart(() => {
    btnPlayCircleRotation.value = 0.1;
    btnPlayCircleRotationTween = gsap.to(btnPlayCircleRotation, { value: 0.001, duration: 2 });
  });

  game.reelsController.onStop(() => {
    btnPlayCircleRotationTween.kill();
  });

  game.reelsController.onStopCommand(() => {
    btnPlayCircleRotationTween.progress(1);
  });

  PIXI.Ticker.shared.add(() => {
    if (game.reelsController.reelsActive) {
      btnPlayCircle.rotation -= btnPlayCircleRotation.value;
    }
  });

  const btnPlayRotateTimeline = gsap.timeline({
    repeat: -1,
    repeatDelay: 10,
    delay: 10,
  });

  btnPlayRotateTimeline.to(btnPlay, {
    rotation: Math.PI / 4,
    duration: 0.5,
    ease: 'power1',
  })

  btnPlayRotateTimeline.to(btnPlay, {
    rotation: 0,
    duration: 0.5,
    ease: 'bounce',
  });

  game.reelsController.onStart(() => {
    btnPlayRotateTimeline.pause();
    btnPlayRotateTimeline.progress(0);
  });

  game.reelsController.onStop(() => {
    if (!game.reelsController.reelsActive) {
      btnPlayRotateTimeline.restart(true);
    }
  });

  const btnAutoplay = new PIXI.Container();
  btnAutoplay.x = btnPlay.x;
  btnAutoplay.y = 65;
  btnAutoplay.interactive = true;
  btnAutoplay.on('pointerdown', () => { game.autoplay = !game.autoplay; });
  controls.addChild(btnAutoplay);

  const btnAutoplayBackground = new PIXI.Graphics();
  btnAutoplay.addChild(btnAutoplayBackground);

  const btnAutoplayText = new PIXI.Text('AUTOPLAY', new PIXI.TextStyle({
    fontFamily: 'Archivo Black',
    fontSize: 12,
    fill: '#FFFFFF',
  }));
  btnAutoplayText.anchor.set(0.5, 0.5);
  btnAutoplay.addChild(btnAutoplayText);
  game.texts.push(btnAutoplayText);

  game.ticker.add(() => {
    if (game.autoplay) {
      btnAutoplayText.tint = 0xB1071D;
    } else {
      btnAutoplayText.tint = 0xFFFFFF;
    }
  });

  const btnAutoplayTextPaddingX = 12;
  const btnAutoplayTextPaddingY = 2;
  btnAutoplayBackground.beginFill(0xFFFFFF, 1);
  btnAutoplayBackground.drawRoundedRect(
    btnAutoplayText.x - (btnAutoplayText.width / 2) - btnAutoplayTextPaddingX - 2,
    btnAutoplayText.y - (btnAutoplayText.height / 2) - btnAutoplayTextPaddingY - 2,
    btnAutoplayText.width + (btnAutoplayTextPaddingX * 2) + 4,
    btnAutoplayText.height + (btnAutoplayTextPaddingY * 2) + 4,
    12
  );
  btnAutoplayBackground.beginFill(0x000000, 1);
  btnAutoplayBackground.drawRoundedRect(
    btnAutoplayText.x - (btnAutoplayText.width / 2) - btnAutoplayTextPaddingX,
    btnAutoplayText.y - (btnAutoplayText.height / 2) - btnAutoplayTextPaddingY,
    btnAutoplayText.width + (btnAutoplayTextPaddingX * 2),
    btnAutoplayText.height + (btnAutoplayTextPaddingY * 2),
    12
  );
  btnAutoplayBackground.endFill();

  const btnBetMinusCircle = new PIXI.Graphics();
  btnBetMinusCircle.beginFill(0x000000, 0.4);
  btnBetMinusCircle.lineStyle(10, 0xFFFFFF);
  btnBetMinusCircle.drawEllipse(0, 0, 100, 100);
  btnBetMinusCircle.endFill();
  btnBetMinusCircle.scale.x = 0.22;
  btnBetMinusCircle.scale.y = 0.22;
  btnBetMinusCircle.x = btnPlay.x - (btnPlay.width / 2) - btnBetMinusCircle.width;
  btnBetMinusCircle.y = btnPlay.y + (btnPlay.height / 2) - (btnBetMinusCircle.height / 2) + 10;
  btnBetMinusCircle.interactive = true;
  btnBetMinusCircle.on('pointerdown', () => {
    onBtnTotalBetMinus();
    betWindow.visible = true;
  });
  controls.addChild(btnBetMinusCircle);

  const btnBetMinus = PIXI.Sprite.from('minus-icon');
  btnBetMinus.scale.x = 0.3;
  btnBetMinus.scale.y = 0.3;
  btnBetMinus.anchor.set(0.5, 0.5);
  btnBetMinusCircle.addChild(btnBetMinus);

  const btnBetPlusCircle = new PIXI.Graphics();
  btnBetPlusCircle.beginFill(0x000000, 0.4);
  btnBetPlusCircle.lineStyle(10, 0xFFFFFF);
  btnBetPlusCircle.drawEllipse(0, 0, 100, 100);
  btnBetPlusCircle.endFill();
  btnBetPlusCircle.scale.x = 0.22;
  btnBetPlusCircle.scale.y = 0.22;
  btnBetPlusCircle.x = btnPlay.x + (btnPlay.width / 2) + btnBetPlusCircle.width;
  btnBetPlusCircle.y = btnPlay.y + (btnPlay.height / 2) - (btnBetPlusCircle.height / 2) + 10;
  btnBetPlusCircle.interactive = true;
  btnBetPlusCircle.on('pointerdown', () => {
    onBtnTotalBetPlus();
    betWindow.visible = true;
  });
  controls.addChild(btnBetPlusCircle);

  const btnBetPlus = PIXI.Sprite.from('plus-icon');
  btnBetPlus.anchor.set(0.5, 0.5);
  btnBetPlus.scale.x = 0.3;
  btnBetPlus.scale.y = 0.3;
  btnBetPlusCircle.addChild(btnBetPlus);

  const betWindow = initBetWindow(game, controls, betValue);
  betWindow.visible = false;

  return controls;
}

function initBetWindow(game, controls, betValue) {
  const container = new PIXI.Container();
  container.x = 850;
  container.y = -500;
  controls.addChild(container);

  const background = new PIXI.Graphics();
  background.beginFill(0x000000, 0.9);
  background.drawRoundedRect(0, 0, 280, 400, 10);
  background.endFill();
  container.addChild(background);

  const btnClose = PIXI.Sprite.from('xmark-icon');
  btnClose.scale.set(0.07, 0.07);
  btnClose.x = container.width - btnClose.width - 10;
  btnClose.y = 5;
  btnClose.interactive = true;
  btnClose.on('pointerdown', () => {
    container.visible = false;
  });
  container.addChild(btnClose);

  const betMultiplerText = new PIXI.Text('BET MULTIPLIER 10x', {
    fontFamily: 'Archivo Black',
    fontSize: 15,
    fill: '#FDAD00',
  });
  betMultiplerText.anchor.set(0.5, 0);
  betMultiplerText.x = container.width / 2;
  betMultiplerText.y = 20;
  container.addChild(betMultiplerText);
  game.texts.push(betMultiplerText);

  const betValueTool = createBetTool(game, 'BET');
  betValueTool.container.x = 0;
  betValueTool.container.y = betMultiplerText.y + betMultiplerText.height + 50;
  container.addChild(betValueTool.container);
  betValueTool.valueText.text = game.bet;
  betValueTool.btnMinus.on('pointerdown', function() {
    if (game.bet > 1) {
      game.bet -= 1;
      betValueTool.valueText.text = game.bet;
      betValue.text = game.betValueToLocale;
      totalBetTool.valueText.text = '€' + game.betValueToLocale;
    }
  });
  betValueTool.btnPlus.on('pointerdown', function() {
    if (game.bet < 10) {
      game.bet += 1;
      betValueTool.valueText.text = game.bet;
      betValue.text = game.betValueToLocale;
      totalBetTool.valueText.text = '€' + game.betValueToLocale;
    }
  });

  const coinValueTool = createBetTool(game, 'COIN VALUE');
  coinValueTool.container.x = 0;
  coinValueTool.container.y = betValueTool.container.y + betValueTool.container.height + 30;
  container.addChild(coinValueTool.container);
  coinValueTool.valueText.text = '€' + game.coinValue.toFixed(2);
  coinValueTool.btnMinus.on('pointerdown', function() {
    if (game.coinValueValueIndex > 0) {
      game.coinValueValueIndex--;
      coinValueTool.valueText.text = '€' + game.coinValue.toFixed(2);
      betValue.text = game.betValueToLocale;
      totalBetTool.valueText.text = '€' + game.betValueToLocale;
    }
  });
  coinValueTool.btnPlus.on('pointerdown', function() {
    if (game.coinValueValueIndex < game.coinValueValues.length - 1) {
      game.coinValueValueIndex += 1;
      coinValueTool.valueText.text = '€' + game.coinValue.toFixed(2);
      betValue.text = game.betValueToLocale;
      totalBetTool.valueText.text = '€' + game.betValueToLocale;
    }
  });

  const totalBetTool = createBetTool(game, 'TOTAL BET');
  totalBetTool.container.x = 0;
  totalBetTool.container.y = coinValueTool.container.y + coinValueTool.container.height + 30;
  container.addChild(totalBetTool.container);
  totalBetTool.valueText.text = '€' + game.betValueToLocale;
  onBtnTotalBetMinus = function() {
    let betDecreased = false;

    let b = game.bet, cvvi = game.coinValueValueIndex, tb;
    while (!betDecreased && (b > 1 || cvvi > 0)) {
      if (b === 1) {
        if (cvvi > 0) {
          cvvi--;
          b = 10;
        }
      } else {
        b--;
      }

      tb = b * 10 * game.coinValueValues[cvvi];
      const currentBet = game.betValue;
      betDecreased = tb < currentBet;
    }

    game.bet = b;
    game.coinValueValueIndex = cvvi;

    betValueTool.valueText.text = game.bet;
    coinValueTool.valueText.text = '€' + game.coinValue.toFixed(2);
    totalBetTool.valueText.text = '€' + game.betValueToLocale;
    betValue.text = game.betValueToLocale;
  };
  totalBetTool.btnMinus.on('pointerdown', onBtnTotalBetMinus);

  onBtnTotalBetPlus = function() {
    let betIncreased = false;

    let b = game.bet, cvvi = game.coinValueValueIndex, tb;
    while (!betIncreased && (b < 10 || cvvi < game.coinValueValues.length - 1)) {
      if (b === 10) {
        if (cvvi < game.coinValueValues.length - 1) {
          cvvi++;
          b = 1;
        }
      } else {
        b++;
      }

      tb = b * 10 * game.coinValueValues[cvvi];
      const currentBet = game.betValue;
      betIncreased = tb > currentBet;
    }

    game.bet = b;
    game.coinValueValueIndex = cvvi;

    betValueTool.valueText.text = game.bet;
    coinValueTool.valueText.text = '€' + game.coinValue.toFixed(2);
    totalBetTool.valueText.text = '€' + game.betValueToLocale;
    betValue.text = game.betValueToLocale;
  };
  totalBetTool.btnPlus.on('pointerdown', onBtnTotalBetPlus);

  return container;
}

function createBetTool(game, label) {
  const container = new PIXI.Container();

  const labelText = new PIXI.Text(label, {
    fontFamily: 'Archivo Black',
    fontSize: 15,
    fill: '#FFFFFF',
  });
  labelText.anchor.set(0.5, 0.5);
  container.addChild(labelText);
  game.texts.push(labelText);

  const btnMinusCircle = new PIXI.Graphics();
  btnMinusCircle.beginFill(0xFFFFFF);
  btnMinusCircle.drawCircle(0, 0, 25);
  btnMinusCircle.x = btnMinusCircle.width;
  btnMinusCircle.y = labelText.height + 30;
  btnMinusCircle.interactive = true;
  container.addChild(btnMinusCircle);

  const btnMinusIcon = PIXI.Sprite.from('minus-icon');
  btnMinusIcon.scale.set(0.07, 0.07);
  btnMinusIcon.anchor.set(0.5, 0.5);
  btnMinusIcon.tint = 0x333333;
  btnMinusCircle.addChild(btnMinusIcon);

  const valueBackgroundBorder = new PIXI.Graphics();
  valueBackgroundBorder.beginFill(0x444444);
  valueBackgroundBorder.drawRoundedRect(0, 0, 100, 50, 5);
  valueBackgroundBorder.endFill();
  valueBackgroundBorder.x = btnMinusCircle.x + (btnMinusCircle.width / 2) + 15;
  valueBackgroundBorder.y = btnMinusCircle.y - (btnMinusCircle.height / 2);
  container.addChild(valueBackgroundBorder);

  const valueBackground = new PIXI.Graphics();
  valueBackground.beginFill(0x222222);
  valueBackground.drawRoundedRect(3, 3, 94, 44, 5);
  valueBackground.endFill();
  valueBackgroundBorder.addChild(valueBackground);

  const valueText = new PIXI.Text('', {
    fontFamily: 'Google Sans',
    fontWeight: 800,
    fontSize: 16,
    fill: '#FFFFFF',
  });
  valueText.anchor.set(0.5, 0.5);
  valueText.x = valueBackgroundBorder.width / 2;
  valueText.y = valueBackgroundBorder.height / 2;
  valueBackgroundBorder.addChild(valueText);
  game.texts.push(valueText);

  const btnPlusCircle = new PIXI.Graphics();
  btnPlusCircle.beginFill(0x00B862);
  btnPlusCircle.drawCircle(0, 0, 25);
  btnPlusCircle.x = valueBackgroundBorder.x + valueBackgroundBorder.width + (btnPlusCircle.width / 2) + 15;
  btnPlusCircle.y = btnMinusCircle.y;
  btnPlusCircle.interactive = true;
  container.addChild(btnPlusCircle);

  const btnPlusIcon = PIXI.Sprite.from('plus-icon');
  btnPlusIcon.scale.set(0.07, 0.07);
  btnPlusIcon.anchor.set(0.5, 0.5);
  btnPlusIcon.tint = 0xFFFFFF;
  btnPlusCircle.addChild(btnPlusIcon);

  labelText.x = valueBackgroundBorder.x + (valueBackgroundBorder.width / 2);

  return { container, valueText, btnMinus: btnMinusCircle, btnPlus: btnPlusCircle };
}

export default initControls;