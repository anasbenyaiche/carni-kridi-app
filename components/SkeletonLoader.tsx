import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function SkeletonLoader({ count = 3 }: { count?: number }) {
  const skeletonOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const skeletonAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(skeletonOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(skeletonOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    skeletonAnimation.start();
    return () => skeletonAnimation.stop();
  }, [skeletonOpacity]);

  return (
    <View style={styles.container}>
      {Array.from({ length: count }, (_, index) => (
        <Animated.View
          key={index}
          style={[styles.item, { opacity: skeletonOpacity }]}
        >
          <View style={styles.content}>
            <View style={styles.nameLine} />
            <View style={styles.phoneLine} />
            <View style={styles.balanceLine} />
          </View>
          <View style={styles.arrow} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  content: {
    flex: 1,
  },
  nameLine: {
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  phoneLine: {
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 6,
    width: '50%',
  },
  balanceLine: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    width: '40%',
  },
  arrow: {
    width: 20,
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
});
