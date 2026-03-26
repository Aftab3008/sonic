import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../constants/theme';
import { ScreenWrapper } from '../../../components/ui/ScreenWrapper';

export default function SearchScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.text}>Search</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontFamily: theme.typography.headline,
    fontSize: 24,
  }
});
