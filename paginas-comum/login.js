import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Atualize a importação
import { collection, getDocs } from 'firebase/firestore'; // Funções do Firestore
import { db } from '../firebase/firebaseConfig';  // Certifique-se de importar o db corretamente

export function Login({ navigation }) {
  const [rm, setRM] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(true); // Para verificar o carregamento

  // Função para verificar se há um usuário logado no AsyncStorage
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('loggedUser');
        if (savedUser) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AlunosTabs' }],
          });
        } else {
          setLoading(false); // Se não há usuário logado, exibir a tela de login
        }
      } catch (error) {
        console.error('Erro ao verificar usuário logado:', error);
        setLoading(false); // Se der erro, exibir a tela de login
      }
    };

    checkUserLoggedIn();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const rmFormatado = rm.trim();
      const turmasCollectionRef = collection(db, 'Turmas');
      const turmasSnapshot = await getDocs(turmasCollectionRef);
      let alunoEncontrado = null;
      let alunoId = '';
      let turmaId = ''; // Variável para guardar o ID da turma

      for (const turmaDoc of turmasSnapshot.docs) {
        const alunosCollectionRef = collection(db, `Turmas/${turmaDoc.id}/alunos`);
        const alunosSnapshot = await getDocs(alunosCollectionRef);

        for (const alunoDoc of alunosSnapshot.docs) {
          const alunoData = alunoDoc.data();

          if (alunoData.rm.toString().toLowerCase() === rmFormatado.toLowerCase()) {
            alunoEncontrado = alunoData;
            alunoId = alunoDoc.id; // ID do documento do aluno
            turmaId = turmaDoc.id; // ID da turma
            break;
          }
        }

        if (alunoEncontrado) break;
      }

      if (!alunoEncontrado) {
        Alert.alert('Erro', 'RM não encontrado.');
        return;
      }

      const senhaCorreta = alunoEncontrado.senha || '12345678';
      if (senha === senhaCorreta) {
        // Salvando o RM, alunoId e turmaId no AsyncStorage
        await AsyncStorage.setItem('loggedUser', JSON.stringify({
          tipo: 'aluno',
          rm: alunoEncontrado.rm,
          alunoId,
          turmaId, // Salvando o ID da turma corretamente
        }));

        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Calendario', params: { turmaId } }], // Passando o turmaId
        });
      } else {
        Alert.alert('Erro', 'Senha incorreta.');
      }
    } catch (error) {
      console.error("Erro no login:", error);
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login!</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira seu RM"
        value={rm}
        onChangeText={setRM}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Insira sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 8,
  },
});
