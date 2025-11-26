import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';

interface NavItem {
  href: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/main', icon: 'home', label: 'Home' },
  { href: '/transactions', icon: 'card', label: 'Transactions' },
  { href: '/split-settle', icon: 'people', label: 'Split' },
  { href: '/profile', icon: 'person', label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        {navItems.map(({ href, icon, label }) => {
          const isActive = pathname === href;
          return (
            <TouchableOpacity
              key={href}
              onPress={() => router.push(href as any)}
              style={styles.navItem}
              activeOpacity={0.7}
            >
              <View style={[styles.navItemContent, isActive && styles.activeNavItem]}>
                <Ionicons 
                  name={icon} 
                  size={22} 
                  color={isActive ? '#203627' : '#203627'} 
                  style={{ opacity: isActive ? 1 : 0.5 }}
                />
                <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#9DC4D5',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    shadowColor: '#203627',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minHeight: 60,
  },
  activeNavItem: {
    backgroundColor: '#E8FF40',
  },
  navLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
    color: '#203627',
    opacity: 0.5,
  },
  activeNavLabel: {
    opacity: 1,
    fontWeight: '600',
  },
});