import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <Image 
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-PAVcejU7AD5VWklbWYxh07RUAb2gZCmDYx1o1VtRdhxNmTjHw7GzfJscqHJyG8KqSzyp07xT-YRgkSY3GIlwp5rfLgJ99WgE5D2G-I8EB1Xpw50Xw5lKNcz0SCvwjR4KJ2q2_Ac-aFaJpuAiZxgO4YhMnIl4gv0WXlWbk4cpFes7YHKaNFRX_gZhX_Doj_d620DmurDXEROWu5xOg3YdG-k3kAYvco6j34E6xNo2v1jVOc5C1smsX4Ck0FWq6HeEswSv_DBwUHt_' }}
          style={styles.bgImage}
          blurRadius={50}
        />
        <View style={styles.bgOverlay} />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-down" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>PLAYING FROM PLAYLIST</Text>
          <Text style={styles.headerTitle}>Midnight Vibes</Text>
        </View>

        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.onSurface} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.albumArtContainer}>
          <View style={styles.albumArtGlow} />
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDio4MjMr5rBPOso_l7VO_2j125bUAS3WiH8vA0oc4qvf_ZjRUfDsQ8MUaVytTEckuo99p4CdXiZy9Fc1XaGRwY2wIfgsVlzoZ4maOyrZ00Ox6KL1rJ28RjH4EsHvhIHvFkt7lkUgjBFI4YGxbWcROGt6d21n-0sEjHO1pF5ag5uPjGMUGXqaegT0fqsx6CMG8a9Vm52_OHaQJrjwMWykJ4p3DH3lflDUxKIsRKuyGsaWot9U24jrtntrb6VYPjmGC56_p8XQfwJ5j1' }}
            style={styles.albumArt}
          />
          <View style={styles.hiResBadge}>
            <Ionicons name="aperture" size={16} color={theme.colors.secondary} />
            <Text style={styles.hiResText}>HI-RES</Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          
          <View style={styles.metadataRow}>
            <View style={styles.metadataText}>
              <Text style={styles.trackTitle} numberOfLines={1}>Obsidian Dream</Text>
              <Text style={styles.trackArtist} numberOfLines={1}>The Prism Collective</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart" size={32} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.seekerContainer}>
             <View style={styles.seekerTrack}>
                <LinearGradient 
                  colors={[theme.colors.primaryContainer, theme.colors.primary]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.seekerFill, { width: '42%' }]}
                />
             </View>
             <View style={styles.timeRow}>
                <Text style={styles.timeText}>1:42</Text>
                <Text style={styles.timeText}>4:05</Text>
             </View>
          </View>

          <View style={styles.playbackControls}>
             <TouchableOpacity style={styles.secondaryControl}>
                <Ionicons name="shuffle" size={24} color="rgba(229,226,225,0.6)" />
             </TouchableOpacity>

             <View style={styles.mainControls}>
                <TouchableOpacity style={styles.controlPrimaryBtn}>
                   <Ionicons name="play-skip-back" size={36} color={theme.colors.onSurface} />
                </TouchableOpacity>

                <TouchableOpacity 
                   style={styles.playPauseBtnWrapper}
                   onPress={() => setIsPlaying(!isPlaying)}
                >
                   <LinearGradient
                      colors={[theme.colors.primaryContainer, theme.colors.primary]}
                      style={styles.playPauseBtn}
                   >
                      <Ionicons 
                         name={isPlaying ? "pause" : "play"} 
                         size={36} 
                         color={theme.colors.onPrimary} 
                         style={!isPlaying ? { marginLeft: 4 } : {}}
                      />
                   </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlPrimaryBtn}>
                   <Ionicons name="play-skip-forward" size={36} color={theme.colors.onSurface} />
                </TouchableOpacity>
             </View>

             <TouchableOpacity style={styles.secondaryControl}>
                <Ionicons name="repeat" size={24} color="rgba(229,226,225,0.6)" />
             </TouchableOpacity>
          </View>

          <View style={styles.utilityGrid}>
             <TouchableOpacity style={styles.utilityBtn}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
                <Ionicons name="musical-notes" size={20} color={theme.colors.primary} />
                <Text style={styles.utilityText}>Lyrics</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.utilityBtn}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
                <Ionicons name="list" size={20} color={theme.colors.secondary} />
                <Text style={styles.utilityText}>Up Next</Text>
             </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={[styles.bottomContext, { paddingBottom: insets.bottom + 16 }]}>
         <View style={styles.volumeControl}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
            <Ionicons name="volume-low" size={20} color="rgba(229,226,225,0.6)" />
            <View style={styles.volumeTrack}>
               <View style={[styles.volumeFill, { width: '75%' }]} />
            </View>
            <Ionicons name="volume-high" size={20} color="rgba(229,226,225,0.6)" />
         </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  bgImage: {
    width: '120%',
    height: '120%',
    top: '-10%',
    left: '-10%',
    opacity: 0.3,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 19, 19, 0.4)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 50,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(42, 42, 42, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(229, 226, 225, 0.4)',
    letterSpacing: 2,
  },
  headerTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  albumArtContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    marginBottom: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumArtGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primary,
    opacity: 0.15,
    borderRadius: 12,
    transform: [{ scale: 1.1 }],
    filter: 'blur(30px)',
  },
  albumArt: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  hiResBadge: {
    position: 'absolute',
    bottom: -16,
    right: -16,
    backgroundColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(73, 68, 84, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  hiResText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  controlsContainer: {
    width: '100%',
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  metadataText: {
    flex: 1,
    paddingRight: 16,
  },
  trackTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.onSurface,
    marginBottom: 4,
    letterSpacing: -1,
  },
  trackArtist: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  favoriteButton: {
    marginBottom: 8,
  },
  seekerContainer: {
    marginBottom: 40,
  },
  seekerTrack: {
    width: '100%',
    height: 6,
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: 3,
    overflow: 'hidden',
  },
  seekerFill: {
    height: '100%',
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(229, 226, 225, 0.4)',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 48,
  },
  secondaryControl: {
    padding: 8,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  controlPrimaryBtn: {
    padding: 8,
  },
  playPauseBtnWrapper: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  playPauseBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  utilityGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  utilityBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(73, 68, 84, 0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(53, 53, 52, 0.4)',
  },
  utilityText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomContext: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(73, 68, 84, 0.1)',
    overflow: 'hidden',
    backgroundColor: 'rgba(53, 53, 52, 0.6)',
  },
  volumeTrack: {
    width: 128,
    height: 4,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 2,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: 'rgba(229, 226, 225, 0.4)',
  }
});
