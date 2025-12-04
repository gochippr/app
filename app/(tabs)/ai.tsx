import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/context/auth";
import {
  ChatMessage,
  ChatResponse,
  sendChatMessage,
} from "@/services/aiService";

const INITIAL_ASSISTANT_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm your Chippr AI assistant. I can analyse your spending, help you budget, and answer questions about your transactions. What would you like to explore today?",
};

export default function AiChatPage() {
  const scrollRef = useRef<ScrollView | null>(null);
  const { fetchWithAuth } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([
    INITIAL_ASSISTANT_MESSAGE,
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = input.trim().length > 0 && !isSending;

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      scrollToEnd();
    }, [scrollToEnd])
  );

  const trimmedHistory = useMemo(() => {
    const MAX_HISTORY = 12;
    if (messages.length <= MAX_HISTORY) {
      return messages;
    }
    return messages.slice(messages.length - MAX_HISTORY);
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!fetchWithAuth || !canSend) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError(null);
    scrollToEnd();

    try {
      const response: ChatResponse = await sendChatMessage(
        fetchWithAuth,
        trimmedHistory.concat(userMessage)
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.reply },
      ]);
      scrollToEnd();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I had trouble looking that up. Please try again in a moment or rephrase your question.",
        },
      ]);
      scrollToEnd();
    } finally {
      setIsSending(false);
    }
  }, [fetchWithAuth, canSend, input, messages, trimmedHistory, scrollToEnd]);

  return (
    <SafeAreaView className="w-full h-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-[#EFEFEF]"
      >
        <View className="flex-1">
          <View className="p-4">
            <Text className="text-3xl font-bold text-[#203627]">
              AI Assistant
            </Text>
          </View>

          <ScrollView
            ref={scrollRef}
            className="flex-1 px-4"
            contentContainerStyle={{ paddingVertical: 16, gap: 12 }}
            onContentSizeChange={scrollToEnd}
          >
            {messages.map((message, index) => {
              const isAssistant = message.role === "assistant";
              return (
                <View
                  key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                  className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-sm shadow-[#203627]/10 ${
                    isAssistant
                      ? "self-start bg-white"
                      : "self-end bg-[#203627]"
                  }`}
                >
                  <Text
                    className={`text-base ${
                      isAssistant ? "text-[#203627]" : "text-white"
                    }`}
                  >
                    {message.content}
                  </Text>
                </View>
              );
            })}
            {isSending ? (
              <View className="mt-2 flex-row items-center gap-2 self-start rounded-2xl bg-white px-3 py-2 shadow-sm shadow-[#203627]/10">
                <ActivityIndicator size="small" color="#203627" />
                <Text className="text-sm text-[#203627]">Thinking…</Text>
              </View>
            ) : null}
            {error ? (
              <Text className="mt-2 text-xs text-[#B91C1C]">{error}</Text>
            ) : null}
          </ScrollView>

          <View className="border-t border-[#DEDFE1] bg-white px-4 py-3">
            <View className="flex-row items-end gap-2">
              <TextInput
                className="flex-1 rounded-2xl bg-[#F5F6F5] px-4 py-3 text-base text-[#203627]"
                multiline
                placeholder="Ask me about your spending..."
                placeholderTextColor="#9AA0A9"
                value={input}
                onChangeText={setInput}
              />
              <Pressable
                disabled={!canSend}
                onPress={handleSend}
                className={`h-12 w-14 items-center justify-center rounded-2xl ${
                  canSend ? "bg-[#203627]" : "bg-[#6C7280] opacity-60"
                }`}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#EFEFEF" />
                ) : (
                  <Text className="text-base font-semibold text-[#EFEFEF]">
                    Send
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
