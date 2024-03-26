import { View } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Button, Txt } from '~/shared/components';

type FallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  const { styles } = useStyles(stylesheet);
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <View style={styles.container}>
      <Txt style={styles.title}>Something went wrong</Txt>
      <Txt style={styles.message}>{error.message}</Txt>
      <Button isSecondary variant="outlined" onPress={resetErrorBoundary}>
        Retry
      </Button>
    </View>
  );
}

export default function ErrorWrapper(props: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>{props.children}</ErrorBoundary>
  );
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    color: theme.colors.error.default,
    fontSize: 18,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
}));
