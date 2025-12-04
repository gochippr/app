/**
 * Mock Plaid Link Component
 * 
 * Simulates the Plaid Link flow for development without requiring
 * the actual Plaid SDK or a bank connection.
 */

import React, { useState } from 'react';
import { Pressable, Text, View, Modal, ScrollView } from 'react-native';
import { simulateDelay } from '@/mocks/config';
import { linkNewAccount } from '@/mocks/mockState';

interface MockPlaidLinkProps {
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>;
  onSuccess: () => void;
  onError: (error: string) => void;
  relinkMode?: boolean;
  relinkInstitutionId?: string;
}

const MOCK_BANKS = [
  { id: 'bank_001', name: 'Chase', logo: '🏦' },
  { id: 'bank_002', name: 'Bank of America', logo: '🏛️' },
  { id: 'bank_003', name: 'Wells Fargo', logo: '🐎' },
  { id: 'bank_004', name: 'Citi', logo: '🌐' },
  { id: 'bank_005', name: 'Capital One', logo: '💳' },
];

export default function MockPlaidLink({
  fetchWithAuth,
  onSuccess,
  onError,
  relinkMode = false,
}: MockPlaidLinkProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [linkStep, setLinkStep] = useState<'select' | 'credentials' | 'connecting'>('select');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const handleBankSelect = async (bank: typeof MOCK_BANKS[0]) => {
    setSelectedBank(bank.name);
    setLinkStep('credentials');
    
    // Simulate entering credentials
    await simulateDelay();
    setLinkStep('connecting');
    
    // Simulate connection process
    setIsLinking(true);
    await simulateDelay();
    
    // Link the new account in mock state
    linkNewAccount(bank.name);
    
    await simulateDelay();
    
    setIsLinking(false);
    setModalVisible(false);
    setLinkStep('select');
    setSelectedBank(null);
    onSuccess();
  };

  const handleCancel = () => {
    setModalVisible(false);
    setLinkStep('select');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Custom UI explaining what will happen */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 20, 
          shadowColor: '#203627',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 8,
          padding: 24, 
          width: '100%', 
          maxWidth: 350, 
          marginBottom: 24 
        }}>
          <View style={{ 
            backgroundColor: '#FEF3C7', 
            borderRadius: 8, 
            padding: 8, 
            marginBottom: 16,
            alignSelf: 'center'
          }}>
            <Text style={{ color: '#92400E', fontSize: 12, fontWeight: '600' }}>
              🧪 MOCK MODE
            </Text>
          </View>
          
          <Text style={{ fontSize: 24, fontWeight: '600', color: '#203627', textAlign: 'center', marginBottom: 8 }}>
            {relinkMode ? 'Relink Your Bank' : 'Connect Your Bank'}
          </Text>
          <Text style={{ color: '#203627', textAlign: 'center', marginBottom: 24, opacity: 0.7, fontSize: 16 }}>
            {relinkMode 
              ? 'Your bank connection has expired. Please relink your account to continue.'
              : 'Securely connect your bank account to view your transactions.'}
          </Text>
          
          <View style={{ backgroundColor: '#9DC4D5', borderRadius: 16, padding: 16, marginBottom: 16, opacity: 0.9 }}>
            <Text style={{ color: '#203627', fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
              🔒 Secure & Private
            </Text>
            <Text style={{ color: '#203627', fontSize: 12, opacity: 0.8 }}>
              In mock mode, no real bank data is used.
            </Text>
          </View>

          <View style={{ backgroundColor: '#E8FF40', borderRadius: 16, padding: 16, opacity: 0.9 }}>
            <Text style={{ color: '#203627', fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
              📊 Mock Transactions
            </Text>
            <Text style={{ color: '#203627', fontSize: 12, opacity: 0.8 }}>
              Sample transaction data will be loaded.
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => setModalVisible(true)}
          style={{ 
            backgroundColor: '#203627', 
            paddingVertical: 14, 
            paddingHorizontal: 32, 
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ color: '#EFEFEF', fontWeight: '600', textAlign: 'center', fontSize: 16 }}>
            Continue to Bank Selection
          </Text>
        </Pressable>
      </View>

      {/* Mock Bank Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          justifyContent: 'flex-end' 
        }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderTopLeftRadius: 24, 
            borderTopRightRadius: 24,
            paddingTop: 16,
            paddingBottom: 40,
            maxHeight: '80%'
          }}>
            {/* Handle bar */}
            <View style={{ 
              width: 40, 
              height: 4, 
              backgroundColor: '#E5E7EB', 
              borderRadius: 2, 
              alignSelf: 'center',
              marginBottom: 16
            }} />
            
            {linkStep === 'select' && (
              <>
                <Text style={{ 
                  fontSize: 20, 
                  fontWeight: '600', 
                  color: '#203627', 
                  textAlign: 'center',
                  marginBottom: 8
                }}>
                  Select Your Bank
                </Text>
                <Text style={{ 
                  color: '#6B7280', 
                  textAlign: 'center',
                  marginBottom: 24,
                  paddingHorizontal: 24
                }}>
                  Choose a mock bank to simulate linking
                </Text>
                
                <ScrollView style={{ paddingHorizontal: 24 }}>
                  {MOCK_BANKS.map((bank) => (
                    <Pressable
                      key={bank.id}
                      onPress={() => handleBankSelect(bank)}
                      style={({ pressed }) => ({
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        backgroundColor: pressed ? '#F3F4F6' : 'white',
                        borderRadius: 12,
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: '#E5E7EB'
                      })}
                    >
                      <Text style={{ fontSize: 28, marginRight: 16 }}>{bank.logo}</Text>
                      <Text style={{ fontSize: 16, fontWeight: '500', color: '#203627' }}>
                        {bank.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}

            {linkStep === 'credentials' && (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>🔐</Text>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '600', 
                  color: '#203627', 
                  textAlign: 'center',
                  marginBottom: 8
                }}>
                  Simulating Login...
                </Text>
                <Text style={{ color: '#6B7280', textAlign: 'center' }}>
                  In mock mode, no credentials are required
                </Text>
              </View>
            )}

            {linkStep === 'connecting' && (
              <View style={{ padding: 24, alignItems: 'center' }}>
                <Text style={{ fontSize: 48, marginBottom: 16 }}>🔗</Text>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '600', 
                  color: '#203627', 
                  textAlign: 'center',
                  marginBottom: 8
                }}>
                  Connecting Account...
                </Text>
                <Text style={{ color: '#6B7280', textAlign: 'center' }}>
                  Loading mock transaction data
                </Text>
              </View>
            )}

            {linkStep === 'select' && (
              <Pressable
                onPress={handleCancel}
                style={{ 
                  marginTop: 16,
                  marginHorizontal: 24,
                  paddingVertical: 14,
                  backgroundColor: '#F3F4F6',
                  borderRadius: 12,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: '#6B7280', fontWeight: '600' }}>Cancel</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

