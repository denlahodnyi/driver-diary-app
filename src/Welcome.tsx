import React from 'react';
import { Button, Text } from 'react-native';

function Welcome() {
  return (
    <Text>
      <Button title="PRESS ME" onPress={() => console.log('HELLO DEN')} />
    </Text>
  );
}

export default Welcome;
