import { Fragment } from 'react';
import { type StyleProp, View, type ViewStyle } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { toArray } from '~/shared/utils';
import HorizontalSwipeView from './HorizontalSwipeView';
import SwiperActionButton from './SwiperActionButton';

type ActionTypes = 'delete' | 'update' | 'bookmark';
type ActionFn = (props: {
  renderParam: RenderElementParam;
  style: StyleProp<ViewStyle>;
}) => React.ReactNode;
type Actions = (ActionTypes | ActionFn)[];

type HorizontalSwipeViewProps = HorizontalSwipeView['HorizontalSwipeViewProps'];
type RenderElementParam = Parameters<
  NonNullable<HorizontalSwipeViewProps['renderRightElement']>
>[0];

type HorizontalSwiperProps = {
  actionButtonStyle?: StyleProp<ViewStyle>;
  actionsContainerStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  HorizontalSwipeViewProps?: HorizontalSwipeViewProps;
  isBookmark?: boolean;
  lastActionButtonStyle?: StyleProp<ViewStyle>;
  leftActions?: Actions;
  onBookmark?: () => void;
  onDelete?: () => void;
  onUpdate?: () => void;
  rightActions?: Actions;
  swipedViewStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

type HorizontalSwiper = {
  ActionFn: ActionFn;
  Props: HorizontalSwiperProps;
};

function HorizontalSwiper(props: HorizontalSwiperProps) {
  const {
    HorizontalSwipeViewProps,
    actionButtonStyle,
    actionsContainerStyle,
    children,
    containerStyle,
    isBookmark,
    lastActionButtonStyle,
    leftActions,
    onBookmark,
    onDelete,
    onUpdate,
    rightActions,
    swipedViewStyle,
  } = props;
  const { styles } = useStyles(stylesheet);

  const renderActionsDivider = () => <View style={styles.divider} />;

  const getActionButton = (
    actionType: ActionTypes | ActionFn,
    renderParam: RenderElementParam,
    index: number,
    allActions: Actions,
  ) => {
    const isLast = index === allActions.length - 1;

    if (typeof actionType === 'function') {
      return actionType({
        renderParam,
        style: [
          styles.actionButton,
          ...toArray(actionButtonStyle),
          ...(isLast ? toArray(lastActionButtonStyle) : []),
        ],
      });
    }

    switch (actionType) {
      case 'delete': {
        return (
          <SwiperActionButton
            accessibilityLabel="Delete item"
            iconName="trash"
            style={[
              styles.actionButton,
              styles.actionDangerButton,
              ...toArray(actionButtonStyle),
              ...(isLast ? toArray(lastActionButtonStyle) : []),
            ]}
            onPress={() => {
              renderParam.resetSwipedState();
              if (onDelete) onDelete();
            }}
          />
        );
      }
      case 'update': {
        return (
          <SwiperActionButton
            accessibilityLabel="Update item"
            iconName="pencil"
            style={[
              styles.actionButton,
              ...toArray(actionButtonStyle),
              ...(isLast ? toArray(lastActionButtonStyle) : []),
            ]}
            onPress={() => {
              renderParam.resetSwipedState();
              if (onUpdate) onUpdate();
            }}
          />
        );
      }
      case 'bookmark': {
        return (
          <SwiperActionButton
            accessibilityLabel={
              isBookmark ? 'Remove bookmark' : 'Save as  bookmark'
            }
            iconName="bookmark"
            style={[
              styles.actionButton,
              ...toArray(actionButtonStyle),
              ...(isLast ? toArray(lastActionButtonStyle) : []),
            ]}
            onPress={() => {
              renderParam.resetSwipedState();
              if (onBookmark) onBookmark();
            }}
          />
        );
      }
      default:
        return null;
    }
  };

  const renderRightElement = (renderParam: RenderElementParam) => {
    if (rightActions?.length || HorizontalSwipeViewProps?.renderRightElement) {
      return (
        <View
          style={[
            styles.actionsContainer,
            styles.actionsContainerRight,
            ...toArray(actionsContainerStyle),
          ]}
          onLayout={({ nativeEvent }) => {
            renderParam.setConfig((prev) => ({
              ...prev,
              leftSwipeShift: nativeEvent.layout.width,
            }));
          }}
        >
          {rightActions?.map((actionType, i) => (
            <Fragment key={`right-${i}`}>
              {i !== 0 && renderActionsDivider()}
              {getActionButton(actionType, renderParam, i, rightActions)}
            </Fragment>
          ))}
          {HorizontalSwipeViewProps?.renderRightElement &&
            HorizontalSwipeViewProps.renderRightElement(renderParam)}
        </View>
      );
    }
    return null;
  };

  const renderLeftElement = (renderParam: RenderElementParam) => {
    if (leftActions?.length || HorizontalSwipeViewProps?.renderLeftElement) {
      return (
        <View
          style={[
            styles.actionsContainer,
            styles.actionsContainerLeft,
            ...toArray(actionsContainerStyle),
          ]}
          onLayout={({ nativeEvent }) => {
            renderParam.setConfig((prev) => ({
              ...prev,
              rightSwipeShift: nativeEvent.layout.width,
            }));
          }}
        >
          {leftActions?.map((actionType, i) => (
            <Fragment key={`left-${i}`}>
              {i !== 0 && renderActionsDivider()}
              {getActionButton(actionType, renderParam, i, leftActions)}
            </Fragment>
          ))}
          {HorizontalSwipeViewProps?.renderLeftElement &&
            HorizontalSwipeViewProps.renderLeftElement(renderParam)}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, ...toArray(containerStyle)]}>
      <HorizontalSwipeView
        {...HorizontalSwipeViewProps}
        renderLeftElement={renderLeftElement}
        renderRightElement={renderRightElement}
        style={[styles.swipedView, ...toArray(swipedViewStyle)]}
      >
        {children}
      </HorizontalSwipeView>
    </View>
  );
}

export default HorizontalSwiper;

const stylesheet = createStyleSheet((theme) => ({
  actionButton: {
    backgroundColor: theme.colors.primary.default,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  actionDangerButton: {
    backgroundColor: theme.colors.error.default,
  },
  actionsContainer: {
    flexDirection: 'row',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  actionsContainerLeft: {
    left: 0,
  },
  actionsContainerRight: {
    right: 0,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  divider: {
    borderColor: 'transparent',
    borderLeftWidth: 1,
  },
  swipedView: {
    width: '100%',
    zIndex: 2,
  },
}));
