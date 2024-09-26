import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Tab One",
          tabBarIcon: ({ color }) => <FontAwesome name="code" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={'blue'}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <FontAwesome name="home" color={color} size={24}/>,
        }}
      />
      <Tabs.Screen
        name="summary/index"
        options={{
          title: "Reuniões",
          tabBarIcon: ({ color }) => <FontAwesome name="wechat" color={color} size={24}/>,
        }}
        />
        <Tabs.Screen
        name="groups/index"
        options={{
          title: "Grupos",
          tabBarIcon: ({ color }) => <FontAwesome name="group" color={color} size={24}/>,
        }}
      />
    </Tabs>
  );
}