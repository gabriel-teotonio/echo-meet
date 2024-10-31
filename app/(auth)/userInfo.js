import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Image } from 'react-native';
import { useSession } from '../ctx';

export default function UserInfoScreen() {
  const { session } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para gerenciar o tema

  const toggleTheme = () => {
    setIsDarkMode(previousState => !previousState);
    // Aqui você pode adicionar a lógica para salvar o tema no contexto ou no armazenamento local se necessário.
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Informações do Usuário</Text>
      <View style={styles.userInfoContainer}>
        <Image
          source={{ uri: session.user?.profilePicture || 'https://via.placeholder.com/150' }}
          style={styles.profilePicture}
        />
        <Text style={[styles.infoText, isDarkMode && styles.darkText]}>Nome: {session.user?.name || 'Nome não disponível'}</Text>
        <Text style={[styles.infoText, isDarkMode && styles.darkText]}>Login: {session.user?.login || 'Login não disponível'}</Text>
      </View>
      <View style={styles.themeToggleContainer}>
        <Text style={[styles.toggleLabel, isDarkMode && styles.darkText]}>Modo Escuro</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  darkTitle: {
    color: '#fff',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  toggleLabel: {
    fontSize: 18,
    color: '#000',
  },
});

