import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AlunosTabs} from './routes';
import { Welcome } from './paginas-comum/welcome';
import { Login } from './paginas-comum/login';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="AlunosTabs" component={AlunosTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}