import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';
import { Txt } from '~/shared/components';
import { buttonBase, buttonBaseText } from '../styles';

type FallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

function fallbackRender({ error, resetErrorBoundary }: FallbackProps) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <View style={styles.container}>
      <Txt style={styles.title}>Something went wrong</Txt>
      <Txt style={styles.message}>{error.message}</Txt>
      <TouchableOpacity style={buttonBase} onPress={resetErrorBoundary}>
        <Txt style={buttonBaseText}>Retry</Txt>
      </TouchableOpacity>
    </View>
  );
}

export {};
export default function ErrorWrapper(props: { children: React.ReactNode }) {
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      {props.children}
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});
