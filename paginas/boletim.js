import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Button } from 'react-native';
import { ProgressBar } from 'react-native-paper'; // Biblioteca para a barra de progresso
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export function Boletim() {
  const [medias, setMedias] = useState({});
  const [loading, setLoading] = useState(true);
  const [etapa, setEtapa] = useState(1); // Estado para controlar a etapa
  const [turmaId, setTurmaId] = useState(''); // Para armazenar o ID da turma

  const calcularMediasNotas = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('loggedUser');
      if (!savedUser) {
        console.error('Nenhum usuário logado.');
        setLoading(false);
        return;
      }

      const { alunoId, turmaId } = JSON.parse(savedUser);
      setTurmaId(turmaId); // Armazenar o ID da turma

      const alunoDocRef = doc(db, `Turmas/${turmaId}/alunos/${alunoId}`);
      const alunoDoc = await getDoc(alunoDocRef);

      if (!alunoDoc.exists()) {
        console.error('Aluno não encontrado.');
        setLoading(false);
        return;
      }

      const alunoData = alunoDoc.data();
      if (!alunoData.notas) {
        console.log('Nenhuma nota encontrada para este aluno.');
        setLoading(false);
        return;
      }

      const notas = alunoData.notas;
      const mediasMaterias = {};
      
      // Percorre as matérias e calcula a média
      for (const materia in notas) {
        const atividades = notas[materia];
        let totalNotas = 0;
        let quantidadeNotas = 0;

        // Percorre as notas da matéria
        for (const nota in atividades) {
          const { data, valor } = atividades[nota];
          const mes = new Date(data).getMonth() + 1; // Obtém o mês da data (1-12)

          // Verifica se a nota está dentro do intervalo da etapa selecionada
          if (isNotaNaEtapa(mes, etapa)) {
            totalNotas += valor;
            quantidadeNotas += 1;
          }
        }

        if (quantidadeNotas > 0) {
          const mediaCalculada = totalNotas / quantidadeNotas;
          mediasMaterias[materia] = mediaCalculada.toFixed(1); // Arredondado para 1 casa decimal
        }
      }

      setMedias(mediasMaterias);
      setLoading(false);

    } catch (error) {
      console.error('Erro ao calcular as médias das notas:', error);
      setLoading(false);
    }
  };

  const isNotaNaEtapa = (mes, etapa) => {
    switch (etapa) {
      case 1:
        return mes >= 1 && mes <= 4; // Janeiro a Abril
      case 2:
        return mes >= 5 && mes <= 8; // Maio a Agosto
      case 3:
        return mes >= 9 && mes <= 12; // Setembro a Dezembro
      default:
        return false;
    }
  };

  useEffect(() => {
    calcularMediasNotas();
  }, [etapa]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando notas...</Text>
      </View>
    );
  }

  const renderEtapas = () => {
    const etapasDisponiveis = turmaId.startsWith('2') || turmaId.startsWith('3') ? [1, 2] : [1, 2, 3];
    return etapasDisponiveis.map(num => (
      <Button
        key={num}
        title={`Etapa ${num}`}
        onPress={() => setEtapa(num)}
      />
    ));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Boletim de Notas
      </Text>

      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        {renderEtapas()}
      </View>

      {Object.keys(medias).length > 0 ? (
        <FlatList
          data={Object.keys(medias).sort()} // Ordenar as matérias em ordem alfabética
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
    width:150,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#dbeafe', // Cor clara para o fundo
  },
});
