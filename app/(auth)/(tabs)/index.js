import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Hook para navegação

export default function TabOneScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.roundedButton}
          onPress={() => router.push("/groups/new")} 
        >
          <FontAwesome name="plus-circle" size={32} color="white" />
          <Text style={styles.buttonText}>Criar Novo Grupo</Text>
        </TouchableOpacity>

        {/* Botão para fazer upload de reunião/audio */}
        <TouchableOpacity 
        activeOpacity={0.8} 
        style={styles.roundedButton} 
        onPress={() => router.push("/recorder")}
        >
          <FontAwesome name="upload" size={32} color="white"/>
          <Text style={styles.buttonText}>Upload de Reunião (áudio MP3)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
        activeOpacity={0.8} 
        style={styles.roundedButton} 
        onPress={() => router.push("/files")}
        >
          <MaterialIcons name="document-scanner" size={32} color="white"/>
          <Text style={styles.buttonText}>Gerar Resumo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        activeOpacity={0.8} 
        style={styles.roundedButton} 
        onPress={() => router.push("/recorder")}
        >
          <FontAwesome name="microphone" size={32} color="white"/>
          <Text style={styles.buttonText}>Gravar nova Reunião</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  scrollContainer: {
    width: '100%',
  },
  roundedButton: {
    backgroundColor: '#3A21B8',
    padding: 15,
    marginVertical: 5,
    borderRadius: 20,
    flexDirection: 'column',
    alignItems: 'left',
    
    width: "100%"
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  }
});