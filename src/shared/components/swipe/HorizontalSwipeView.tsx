import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, type ViewProps } from 'react-native';
import { toArray } from '../../utils';
import SwipeViewContext, { type Config } from './SwipeViewContext';

type ConfigState = Config;

type renderElementParam = {
  animatedValue: Animated.Value;
  resetSwipedState: () => void;
  setConfig: (
    value: ConfigState | ((value: ConfigState) => ConfigState),
  ) => void;
};

type HorizontalSwipeViewProps = ViewProps & {
  config?: Partial<Config>;
  onFullLeftSwipe?: () => void;
  onFullRightSwipe?: () => void;
  onLongPress?: () => void;
  onPress?: () => void;
  renderLeftElement?: (o: renderElementParam) => React.ReactNode;
  renderRightElement?: (o: renderElementParam) => React.ReactNode;
};

const DEFAULT_CONFIG: ConfigState = {
  fullLeftSwipeThreshold: 200,
  fullRightSwipeThreshold: 200,
  isFullLeftSwipeDisabled: false,
  isFullRightSwipeDisabled: false,
  isLeftSwipeDisabled: false,
  isRightSwipeDisabled: false,
  leftSwipeShift: 150,
  longPressTimeout: 301,
  rightSwipeShift: 150,
  swipeThreshold: 1.5,
};

type HorizontalSwipeView = {
  HorizontalSwipeViewProps: HorizontalSwipeViewProps;
};

function HorizontalSwipeView(props: HorizontalSwipeViewProps) {
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
  const x = useRef(new Animated.Value(0)).current;

  const [config, setConfig] = useState({ ...DEFAULT_CONFIG, ...userConfig });

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

  const performFullSwipeByDir = (
    dir: 'left' | 'right',
    onFinish: (p: { finished: boolean }) => void,
  ) => {
    performFullSwipe(onFinish);
  };

  const updateAnimatedValue = (value: number) => {
    x.setValue(value);
  };

  const context = useRef(
    new SwipeViewContext(
      config,
      updateAnimatedValue,
      performSwipeAnimation,
      performFullSwipeByDir,
    ),
  );

  useEffect(() => {
    if (context.current) {
      context.current.changeConfig(config);
    }
  }, [config]);

  const performFullSwipe = (
    onFinish?: (obj: { finished: boolean }) => void,
  ) => {
    Animated.decay(x, {
      useNativeDriver: true,
      velocity: 50,
    }).start(onFinish);
  };

  const resetSwipedState = () => {
    context.current.reset();
  };

  const panResponder = useMemo(() => {
    const ctxProps = {
      onFullLeftSwipe,
      onFullRightSwipe,
      onLongPress,
      onPress,
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      // eslint-disable-next-line sort-keys
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      // eslint-disable-next-line sort-keys
      onPanResponderGrant: (e) => {
        context.current.touch(e.nativeEvent.timestamp, ctxProps);
      },
      onPanResponderMove: (e, gestureState) => {
        context.current.move(gestureState.dx, ctxProps);
      },
      onPanResponderRelease: (e) => {
        context.current.release(e.nativeEvent.timestamp, ctxProps);
      },
    });
  }, [onFullLeftSwipe, onFullRightSwipe, onLongPress, onPress]);

  return (
    <>
      {renderLeftElement &&
        renderLeftElement({ animatedValue: x, resetSwipedState, setConfig })}
      <Animated.View
        {...panResponder.panHandlers}
        style={[...toArray(style), { transform: [{ translateX: x }] }]}
      >
        {children}
      </Animated.View>
      {renderRightElement &&
        renderRightElement({ animatedValue: x, resetSwipedState, setConfig })}
    </>
  );
}

export default HorizontalSwipeView;
