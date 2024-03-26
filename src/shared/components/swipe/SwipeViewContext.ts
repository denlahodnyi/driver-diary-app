/* eslint-disable @typescript-eslint/member-ordering */
type Props = {
  onPress?: () => void;
  onLongPress?: () => void;
  onFullLeftSwipe?: () => void;
  onFullRightSwipe?: () => void;
};

export type Config = {
  isLeftSwipeDisabled: boolean;
  isFullLeftSwipeDisabled: boolean;
  isRightSwipeDisabled: boolean;
  isFullRightSwipeDisabled: boolean;
  swipeThreshold: number;
  fullLeftSwipeThreshold: number;
  fullRightSwipeThreshold: number;
  longPressTimeout: number;
  leftSwipeShift: number;
  rightSwipeShift: number;
};

export default class SwipeViewContext {
  state: State;
  longPressTimer?: NodeJS.Timeout;
  touchStartTime = 0;
  xPos = 0;
  isSwipeReady = false;
  isFullSwipeReady = false;

  constructor(
    public config: Config,
    public setAnimatedValue: (v: number) => void,
    public animateSwipeTransition: (
      pos: number,
      onFinish: (p: { finished: boolean }) => void,
    ) => void,
    public animateFullSwipeTransition: (
      dir: 'left' | 'right',
      onFinish: (p: { finished: boolean }) => void,
    ) => void,
  ) {
    this.state = new Idle(this);
  }

  changeState(state: State) {
    this.state = state;
  }
  changeConfig(config: Partial<Config>) {
    this.config = { ...this.config, ...config };
  }

  animateTransition(
    toPos: number,
    onFinish: (param: { finished: boolean }) => void,
  ) {
    this.animateSwipeTransition(toPos, onFinish);
  }
  touch(touchTimestamp: number, props?: Props) {
    this.state.touch(touchTimestamp, props);
  }
  move(directionX: number, props?: Props) {
    this.state.move(directionX, props);
  }
  release(releaseTimestamp: number, props?: Props) {
    this.state.release(releaseTimestamp, props);
  }
  reset() {
    this.changeState(new Transition(this));
    this.animateTransition(0, ({ finished }) => {
      if (finished) {
        this.isSwipeReady = false;
        this.isFullSwipeReady = false;
        this.xPos = 0;
        this.changeState(new Idle(this));
      }
    });
  }

  checkIfPress(touchTimestamp: number, releaseTimestamp: number) {
    return (
      Math.ceil(releaseTimestamp) - Math.ceil(touchTimestamp) <
      this.config.longPressTimeout - 1
    );
  }
}

abstract class State {
  context: SwipeViewContext;

  constructor(context: SwipeViewContext) {
    this.context = context;
  }

  abstract touch(timestamp: number, props?: Props): void;
  abstract move(directionX: number, props?: Props): void;
  abstract release(timestamp: number, props?: Props): void;
}

class Idle extends State {
  touch(timestamp: number, props?: Props): void {
    const { onLongPress } = props || {};

    this.context.touchStartTime = timestamp;

    this.context.longPressTimer = setTimeout(() => {
      this.context.longPressTimer = undefined;
      if (onLongPress) {
        onLongPress();
      }
    }, this.context.config.longPressTimeout);
  }
  move(): void {
    this.context.changeState(new Moved(this.context));
    return;
  }
  release(timestamp: number, props?: Props): void {
    if (this.context.checkIfPress(this.context.touchStartTime, timestamp)) {
      const { onPress } = props || {};

      clearTimeout(this.context.longPressTimer);
      this.context.touchStartTime = 0;
      this.context.xPos = 0;
      if (onPress) onPress();
    }
    return;
  }
}

class Moved extends State {
  touch(): void {
    if (this.context.isSwipeReady) {
      this.context.reset();
    }
    return;
  }
  move(directionX: number): void {
    this.context.xPos = directionX;

    if (this.context.config.isLeftSwipeDisabled && this.context.xPos < 0) {
      this.context.reset();
      return;
    }
    if (this.context.config.isRightSwipeDisabled && this.context.xPos > 0) {
      this.context.reset();
      return;
    }

    const xPosAbs = Math.abs(this.context.xPos);

    this.context.setAnimatedValue(Math.ceil(this.context.xPos));

    if (xPosAbs > this.context.config.swipeThreshold) {
      const fullSwipeThreshold =
        this.context.xPos < 0
          ? this.context.config.fullLeftSwipeThreshold
          : this.context.config.fullRightSwipeThreshold;

      this.context.isSwipeReady = true;
      this.context.isFullSwipeReady = xPosAbs > fullSwipeThreshold;

      if (this.context.longPressTimer) {
        clearTimeout(this.context.longPressTimer);
      }
    } else {
      this.context.isSwipeReady = false;
    }

    return;
  }
  release(_: number, props?: Props): void {
    const { onFullLeftSwipe, onFullRightSwipe } = props || {};

    if (this.context.config.isLeftSwipeDisabled && this.context.xPos < 0) {
      this.context.reset();
      return;
    }
    if (this.context.config.isRightSwipeDisabled && this.context.xPos > 0) {
      this.context.reset();
      return;
    }

    if (this.context.isSwipeReady) {
      if (
        this.context.isFullSwipeReady &&
        ((this.context.xPos > 0 &&
          this.context.config.isFullRightSwipeDisabled &&
          onFullRightSwipe) ||
          (this.context.xPos < 0 &&
            this.context.config.isFullLeftSwipeDisabled &&
            onFullLeftSwipe))
      ) {
        const dir = this.context.xPos < 0 ? 'left' : 'right';

        this.context.changeState(new Transition(this.context));
        this.context.animateFullSwipeTransition(dir, ({ finished }) => {
          if (finished) {
            if (dir === 'left' && onFullLeftSwipe) {
              onFullLeftSwipe();
            }
            if (dir === 'right' && onFullRightSwipe) {
              onFullRightSwipe();
            }
          }
        });
        return;
      }

      const finalPosition =
        this.context.xPos > 0
          ? this.context.config.rightSwipeShift
          : -this.context.config.leftSwipeShift;

      this.context.changeState(new Transition(this.context));
      this.context.animateTransition(finalPosition, ({ finished }) => {
        if (finished) {
          this.context.xPos = finalPosition;
          this.context.changeState(new Moved(this.context));
        }
      });
    } else {
      this.context.reset();
    }
    return;
  }
}

class Transition extends State {
  touch(): void {
    return;
  }
  move(): void {
    return;
  }
  release(): void {
    return;
  }
}
