import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, Button, StatusBar, Alert } from 'react-native';
import { ProgressBar } from 'react-native-paper'; // Biblioteca para a barra de progresso
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export function Perfil({ navigation }) {
  const [alunoId, setAlunoId] = useState(''); // Para armazenar o ID do aluno
  const [rm, setRm] = useState(''); // Para armazenar o RM do aluno
  const [medias, setMedias] = useState({});
  const [faltasCount, setFaltasCount] = useState(0); // Para armazenar a quantidade de faltas
  const [loading, setLoading] = useState(true);

  const calcularMediasNotas = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('loggedUser');
      if (!savedUser) {
        console.error('Nenhum usuário logado.');
        setLoading(false);
        return;
      }

      const { alunoId, turmaId } = JSON.parse(savedUser);
      setAlunoId(alunoId); // Armazenar o ID do aluno

      // Recuperar os dados do aluno
      const alunoDocRef = doc(db, `Turmas/${turmaId}/alunos/${alunoId}`);
      const alunoDoc = await getDoc(alunoDocRef);

      if (!alunoDoc.exists()) {
        console.error('Aluno não encontrado.');
        setLoading(false);
        return;
      }

      const alunoData = alunoDoc.data();
      setRm(alunoData.rm); // Armazenar o RM do aluno
      setFaltasCount(alunoData.faltas ? alunoData.faltas.length : 0); // Contar faltas

      if (!alunoData.notas) {
        console.log('Nenhuma nota encontrada para este aluno.');
        setLoading(false);
        return;
      }

      const notas = alunoData.notas;

      // Calcular médias
      const mediasMaterias = {};
      for (const materia in notas) {
        const atividades = notas[materia];
        let totalNotas = 0;
        let quantidadeNotas = 0;

        for (const atividade in atividades) {
          const valorNota = atividades[atividade].valor;
          totalNotas += valorNota;
          quantidadeNotas += 1;
        }

        const mediaCalculada = totalNotas / quantidadeNotas;
        mediasMaterias[materia] = mediaCalculada.toFixed(1); // Arredondado para 1 casa decimal
      }

      setMedias(mediasMaterias);
      setLoading(false);

    } catch (error) {
      console.error('Erro ao calcular as médias das notas:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    calcularMediasNotas();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('loggedUser');
      Alert.alert('Sucesso', 'Logout realizado com sucesso!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao fazer logout.');
    }
  };

  const irBoletim = () => {
    navigation.navigate('Boletim');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Nome: {alunoId}</Text>
        <Text style={{ fontSize: 16 }}>RM: {rm}</Text>
        <Text style={{ fontSize: 16 }}>Quantidade de Faltas: {faltasCount}</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 20 }}>Médias:</Text>

        {Object.keys(medias).length > 0 ? (
          <FlatList
            data={Object.keys(medias).sort().slice(0, 4)} // Obter as 4 primeiras matérias em ordem alfabética
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 15 }}>
                <Text style={{ fontSize: 16, marginBottom: 5 }}>
                  <Text style={{ fontWeight: 'bold' }}>{item}:</Text> {medias[item]}
                </Text>
                <View style={styles.progressContainer}>
                  <Text style={styles.label}>Média</Text>
                  <Text style={styles.media}>{medias[item]}</Text>
                  <ProgressBar
                    progress={parseFloat(medias[item]) / 10} // Progresso baseado na média / 10
                    color="#1e3a8a" // Cor azul para a barra de progresso
                    style={styles.progressBar}
                  />
                </View>
              </View>
            )}
          />
        ) : (
          <Text>Nenhuma nota disponível.</Text>
        )}
      </>

      <TouchableOpacity onPress={irBoletim}>
        <Text>Boletim</Text>
      </TouchableOpacity>
      <Button title="Logout" onPress={handleLogout} />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 10,
  },
  media: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginRight: 10,
  },
  progressBar: {
    width: 150,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#dbeafe', // Cor clara para o fundo
  },
});
