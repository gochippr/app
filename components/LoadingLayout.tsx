import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface LoadingLayoutProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinnerColor?: string;
  spinnerSize?: 'small' | 'large';
}

const LoadingLayout: React.FC<LoadingLayoutProps> = ({
  isLoading,
  children,
  spinnerColor = '#203627',
  spinnerSize = 'large',
}) => {
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: '#EFEFEF' }}>
        <ActivityIndicator size={spinnerSize} color={spinnerColor} />
      </View>
    );
  }

  return <>{children}</>;
};

export default LoadingLayout;
