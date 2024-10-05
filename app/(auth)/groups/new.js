import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewGroupScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState('');
  const [participants, setParticipants] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Grupos</Text>
      
      <Text style={styles.inputLabel}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Título"
      />

      <Text style={styles.inputLabel}>Descrição</Text>
      <TextInput
        style={styles.textArea}
        value={description}
        onChangeText={setDescription}
        placeholder="Descrição"
        multiline={true}
        numberOfLines={4}
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.inputLabel}>Data</Text>
          <TouchableOpacity style={styles.dateInput} onPress={showDatepicker}>
            <Ionicons name="calendar" size={24} color="#5E17EB" />
            <Text>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
        <View style={styles.column}>
          <Text style={styles.inputLabel}>Duração</Text>
          <TextInput
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            placeholder="Duração"
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={styles.inputLabel}>Participantes</Text>
      <TouchableOpacity style={styles.participantsInput}>
        <FontAwesome name="user" size={24} color="#5E17EB" />
        <Text style={styles.placeholderText}>Selecionar participantes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Novo Grupo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5E17EB',
  },
  inputLabel: {
    fontSize: 16,
    color: '#5E17EB',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
    height: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  participantsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 20,
  },
  placeholderText: {
    marginLeft: 10,
    color: '#a9a9a9',
  },
  button: {
    backgroundColor: '#5E17EB',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
