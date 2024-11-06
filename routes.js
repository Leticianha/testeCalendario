import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home } from './paginas/home';
import { Calendario } from './paginas/calendario';
import { Boletim } from './paginas/boletim';
import { Perfil } from './paginas/perfil';
import { Chat } from './paginas/chat';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AlunosDadosStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Perfil" component={Perfil} />
            <Stack.Screen name="Boletim" component={Boletim} />
        </Stack.Navigator>
    );
}

export function AlunosTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Calendario" component={Calendario} />
            <Tab.Screen name="Chat" component={Chat} />
            <Tab.Screen name="AlunosDadosStack" component={AlunosDadosStack} />
        </Tab.Navigator>
    );
}
