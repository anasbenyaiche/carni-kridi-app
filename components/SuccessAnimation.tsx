import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';

interface SuccessAnimationProps {
  visible: boolean;
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export default function SuccessAnimation({
  visible,
  onComplete,
}: SuccessAnimationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const backgroundOpacityAnim = useRef(new Animated.Value(0)).current;
  const rippleScale1 = useRef(new Animated.Value(0)).current;
  const rippleScale2 = useRef(new Animated.Value(0)).current;
  const rippleScale3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Play success sound (pen writing sound simulation)
      playPenSound();

      // Start animation sequence
      Animated.sequence([
        // Fade in background
        Animated.timing(backgroundOpacityAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        // Scale and fade in checkmark
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 5,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          // Staggered ripple animations
          Animated.stagger(100, [
            Animated.spring(rippleScale1, {
              toValue: 1,
              tension: 80,
              friction: 6,
              useNativeDriver: true,
            }),
            Animated.spring(rippleScale2, {
              toValue: 1,
              tension: 80,
              friction: 6,
              useNativeDriver: true,
            }),
            Animated.spring(rippleScale3, {
              toValue: 1,
              tension: 80,
              friction: 6,
              useNativeDriver: true,
            }),
          ]),
        ]),
        // Hold for a moment
        Animated.delay(1200),
        // Fade out everything
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(backgroundOpacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rippleScale1, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rippleScale2, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(rippleScale3, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Reset animations
        scaleAnim.setValue(0);
        opacityAnim.setValue(0);
        backgroundOpacityAnim.setValue(0);
        rippleScale1.setValue(0);
        rippleScale2.setValue(0);
        rippleScale3.setValue(0);
        // Call completion callback
        onComplete();
      });
    }
  }, [visible]);

  const playPenSound = async () => {
    // Play haptic feedback as pen sound simulation
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      console.log('🖊️ Playing pen sound effect (haptic feedback)');
    } catch (error) {
      console.log('Could not play haptic feedback:', error);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[styles.background, { opacity: backgroundOpacityAnim }]}
      />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmarkCircle}>
            <Check size={60} color="#FFFFFF" strokeWidth={4} />
          </View>
        </View>
        <Animated.View
          style={[styles.ripple1, { transform: [{ scale: rippleScale1 }] }]}
        />
        <Animated.View
          style={[styles.ripple2, { transform: [{ scale: rippleScale2 }] }]}
        />
        <Animated.View
          style={[styles.ripple3, { transform: [{ scale: rippleScale3 }] }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
  container: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checkmarkContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  checkmarkCircle: {
    width: 100,
    height: 100,
    backgroundColor: '#10B981',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  ripple1: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    zIndex: 2,
  },
  ripple2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    zIndex: 1,
  },
  ripple3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
    zIndex: 0,
  },
});
