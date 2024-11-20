import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {
          
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => <FontAwesome name="home" color={color} size={24}/>,
        }}
      />
        <Tabs.Screen
        name="groups/index"
        options={{
          title: "Grupos",
          tabBarIcon: ({ color }) => <FontAwesome name="group" color={color} size={24}/>,
        }}
      />
       {/* <Tabs.Screen
        name="files/index"
        options={{
          title: "Arquivos de áudio",
          tabBarIcon: ({ color }) => <FontAwesome name="file" color={color} size={24}/>,
        }}
      /> */}
    </Tabs>
  );
}