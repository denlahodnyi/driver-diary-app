import { useRef } from 'react';
import { Animated, Easing, PanResponder, type ViewProps } from 'react-native';
import { toArray } from '../utils';

type renderElementParam = {
  animatedValue: Animated.Value;
  resetSwipedState: () => void;
};
type HorizontalSwipeViewProps = ViewProps & {
  config?: {
    fullLeftSwipeThreshold?: number;
    fullRightSwipeThreshold?: number;
    isLeftSwipeDisabled?: boolean;
    isRightSwipeDisabled?: boolean;
    leftSwipeShift?: number;
    longPressDelay?: number;
    rightSwipeShift?: number;
    swipeThreshold?: number;
  };
  onFullLeftSwipe?: () => void;
  onFullRightSwipe?: () => void;
  onLongPress?: () => void;
  onPress?: () => void;
  renderLeftElement?: (o: renderElementParam) => React.ReactNode;
  renderRightElement?: (o: renderElementParam) => React.ReactNode;
};
type StateStatus =
  | 'idle'
  | 'press'
  | 'long_press'
  | 'move'
  | 'swipe_ready'
  | 'swiped'
  | 'full_swipe_ready'
  | 'fully_swiped'
  | 'swipe_cancel';

const DEFAULT_CONFIG = {
  disableLeftSwipe: false,
  disableRightSwipe: false,
  fullLeftSwipeThreshold: 200,
  fullRightSwipeThreshold: 200,
  leftSwipeShift: 150,
  longPressDelay: 301,
  rightSwipeShift: 150,
  swipeThreshold: 1.5,
};

export default function HorizontalSwipeView(props: HorizontalSwipeViewProps) {
  const {
    children,
    config: userConfig,
    onFullLeftSwipe,
    onFullRightSwipe,
    onLongPress,
    onPress,
    renderLeftElement,
    renderRightElement,
    style,
  } = props;
  const {
    fullLeftSwipeThreshold,
    fullRightSwipeThreshold,
    isLeftSwipeDisabled,
    isRightSwipeDisabled,
    leftSwipeShift,
    longPressDelay,
    rightSwipeShift,
    swipeThreshold,
  } = { ...DEFAULT_CONFIG, ...userConfig };
  const x = useRef(new Animated.Value(0)).current;
  let xValueAfterRelease = useRef(0).current;
  let dx = useRef(0).current;
  let status = useRef<StateStatus>('idle').current;
  let longPressTimer = useRef<NodeJS.Timeout>().current;
  let touchTimestamp = useRef(0).current;

  const performSwipeAnimation = (
    pos: number,
    onFinish?: (obj: { finished: boolean }) => void,
  ) => {
    Animated.timing(x, {
      duration: 200,
      easing: Easing.bezier(0, 0.55, 0.45, 1),
      toValue: pos,
      useNativeDriver: true,
    }).start(onFinish);
  };

  const performFullLeftSwipe = () => {
    performFullSwipe(({ finished }) => {
      if (finished && onFullLeftSwipe) {
        onFullLeftSwipe();
      }
    });
  };

  const performFullRightSwipe = () => {
    performFullSwipe(({ finished }) => {
      if (finished && onFullRightSwipe) {
        onFullRightSwipe();
      }
    });
  };

  const performFullSwipe = (
    onFinish?: (obj: { finished: boolean }) => void,
  ) => {
    Animated.decay(x, {
      useNativeDriver: true,
      velocity: 50,
    }).start(onFinish);
  };

  const resetSwipedState = () => {
    status = 'swipe_cancel';
    performSwipeAnimation(0, ({ finished }) => {
      if (finished) {
        xValueAfterRelease = 0;
        status = 'idle';
      }
    });
  };

  const checkIfPress = (
    lastTouchTimestamp: number,
    releaseTimestamp: number,
  ) => {
    return (
      Math.ceil(releaseTimestamp) - Math.ceil(lastTouchTimestamp) <
      longPressDelay - 1
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // eslint-disable-next-line sort-keys
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      // eslint-disable-next-line sort-keys
      onPanResponderGrant: (e) => {
        switch (status) {
          case 'idle': {
            // save current touch time
            touchTimestamp = e.nativeEvent.timestamp;
            // start timer for possible long press
            longPressTimer = setTimeout(() => {
              longPressTimer = undefined;
              status = 'long_press';
              // long press
              if (onLongPress) onLongPress();
              status = 'idle';
            }, longPressDelay);
            break;
          }
          default:
            break;
        }
      },
      onPanResponderMove: (e, gestureState) => {
        dx = gestureState.dx;

        switch (status) {
          case 'idle': {
            status = 'move';
            break;
          }
          case 'move': {
            const newX = xValueAfterRelease + dx;

            if (isLeftSwipeDisabled && newX < 0) return;
            if (isRightSwipeDisabled && newX > 0) return;

            x.setValue(Math.ceil(newX));

            if (Math.abs(newX) > swipeThreshold) {
              if (longPressTimer) clearTimeout(longPressTimer);
              status = 'swipe_ready';
            }
            break;
          }
          case 'swiped': {
            const newX = xValueAfterRelease + Math.ceil(dx);
            const fullSwipeThreshold =
              newX < 0 ? fullLeftSwipeThreshold : fullRightSwipeThreshold;

            x.setValue(newX);

            if (Math.abs(newX) > fullSwipeThreshold) {
              status = 'full_swipe_ready';
            }
            break;
          }
          case 'swipe_ready': {
            const newX = xValueAfterRelease + dx;
            const fullSwipeThreshold =
              newX < 0 ? fullLeftSwipeThreshold : fullRightSwipeThreshold;
            const dxAbs = Math.abs(newX);

            x.setValue(Math.ceil(newX));

            if (dxAbs > fullSwipeThreshold) {
              status = 'full_swipe_ready';
            } else if (dxAbs < swipeThreshold) {
              status = 'move';
            }
            break;
          }
          case 'full_swipe_ready': {
            const newX = xValueAfterRelease + dx;
            const fullSwipeThreshold =
              newX < 0 ? fullLeftSwipeThreshold : fullRightSwipeThreshold;
            const newXabs = Math.abs(newX);

            x.setValue(Math.ceil(newX));

            if (newXabs < fullSwipeThreshold && newXabs > swipeThreshold) {
              status = 'swipe_ready';
            } else if (newXabs < swipeThreshold) {
              status = 'move';
            }
            break;
          }
          default:
            break;
        }
      },
      onPanResponderRelease: (e) => {
        switch (status) {
          case 'idle': {
            if (checkIfPress(touchTimestamp, e.nativeEvent.timestamp)) {
              clearTimeout(longPressTimer);
              xValueAfterRelease = 0;
              touchTimestamp = 0;
              status = 'press';
              if (onPress) onPress();
              status = 'idle';
            }
            break;
          }
          case 'swipe_ready': {
            if (leftSwipeShift && dx < 0) {
              performSwipeAnimation(-leftSwipeShift, ({ finished }) => {
                if (finished) {
                  xValueAfterRelease = -leftSwipeShift;
                  status = 'swiped';
                }
              });
            } else if (rightSwipeShift && dx > 0) {
              performSwipeAnimation(rightSwipeShift, ({ finished }) => {
                if (finished) {
                  xValueAfterRelease = rightSwipeShift;
                  status = 'swiped';
                }
              });
            } else {
              resetSwipedState();
            }
            break;
          }
          case 'move':
          case 'swiped':
            resetSwipedState();
            break;
          case 'full_swipe_ready': {
            const newX = xValueAfterRelease + dx;

            if (newX < 0) {
              if (onFullLeftSwipe) {
                performFullLeftSwipe();
              } else if (leftSwipeShift) {
                performSwipeAnimation(-leftSwipeShift, ({ finished }) => {
                  if (finished) {
                    xValueAfterRelease = -leftSwipeShift;
                    status = 'swiped';
                  }
                });
              } else {
                resetSwipedState();
              }
            } else {
              if (onFullRightSwipe) {
                performFullRightSwipe();
              } else if (rightSwipeShift) {
                performSwipeAnimation(rightSwipeShift, ({ finished }) => {
                  if (finished) {
                    xValueAfterRelease = rightSwipeShift;
                    status = 'swiped';
                  }
                });
              } else {
                resetSwipedState();
              }
            }
            break;
          }
          default:
            break;
        }
      },
    }),
  ).current;

  return (
    <>
      {renderLeftElement &&
        renderLeftElement({ animatedValue: x, resetSwipedState })}
      <Animated.View
        {...panResponder.panHandlers}
        style={[...toArray(style), { transform: [{ translateX: x }] }]}
      >
        {children}
      </Animated.View>
      {renderRightElement &&
        renderRightElement({ animatedValue: x, resetSwipedState })}
    </>
  );
}
