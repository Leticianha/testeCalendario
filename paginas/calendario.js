import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export function Calendario({ route, navigation }) {
  const { turmaId } = route.params || {}; // Verifica se route.params está definido
  const [turmaInfo, setTurmaInfo] = useState(null);

  useEffect(() => {
    if (turmaId) {
      console.log('ID da Turma:', turmaId);
    } else {
      console.log('turmaId não encontrado!');
    }
  }, [turmaId]);


  return (
    <View style={styles.container}>
      <Text>Calendário!</Text>
      {turmaId ? <Text>Turma ID: {turmaId}</Text> : <Text>Carregando dados da turma...</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
