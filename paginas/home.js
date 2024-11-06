import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import moment from 'moment';
import 'moment/locale/pt-br';  // Importando para configurar o idioma para português
import { ScrollView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export function Home() {
  // Carregar fontes
  const [fontsLoaded] = useFonts({
    'Bochan': require('../assets/fonts/Bochan Serif.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  // Ocultar a tela de splash quando as fontes estiverem carregadas
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) {
      onLayoutRootView();
    }
  }, [fontsLoaded]);

  // Configura o momento para usar o idioma português
  moment.locale('pt-br');

  // Obtém a data atual
  const currentDate = moment();
  const dayName = currentDate.format('ddd').charAt(0).toUpperCase() + currentDate.format('ddd').slice(1);  // Primeira letra maiúscula
  const dayNumber = currentDate.format('DD');
  const currentMonth = currentDate.month();  // Janeiro é 0, Dezembro é 11

  // Define os meses a serem exibidos com base no mês atual
  const months = currentMonth < 6
    ? ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
    : ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Define as cores específicas para os meses
  const getMonthStyle = (month) => {
    switch (month) {
      case 'Ago':
      case 'Out':
      case 'Dez':
        return styles.specialMonthBox;
      default:
        return styles.monthBox;
    }
  };

  // Estado para o texto que muda
  const [text, setText] = useState('Olá sou o nexus!');

  // useEffect para mudar o texto a cada alguns segundos
  useEffect(() => {
    const texts = ['Olá sou o nexus!', 'Converse comigo!'];
    let index = 0;

    const intervalId = setInterval(() => {
      index = (index + 1) % texts.length;
      setText(texts[index]);
    }, 3000);  // Muda o texto a cada 3 segundos

    return () => clearInterval(intervalId);
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.containerLogo}>
          <Image style={styles.logo} source={require('../assets/logo.png')} />
        </View>
      </View>
      <ScrollView>
        <View style={styles.conteudo}>
          <View style={styles.bannerInteiro}>
            <View style={styles.banner}>
              <TouchableOpacity style={styles.botaoCalendario}>
                <View style={styles.boxCalendario}>
                  <Text style={styles.text}>{`${dayName}.${dayNumber}`}</Text>
                  <Text style={styles.subText}>Confira os eventos e atividades do dia!</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.calendar}>
                <View style={styles.linhaCalendario}>
                  <View style={styles.linha1}></View>
                  <View style={styles.linha2}></View>
                </View>
                {currentMonth < 6 ? (
                  months.map((month, index) => (
                    <View key={index} style={getMonthStyle(month)}>
                      <Text style={styles.monthText}>{month}</Text>
                    </View>
                  ))
                ) : (
                  <>
                    <View style={styles.row}>
                      {months.slice(0, 3).map((month, index) => (
                        <View key={index} style={getMonthStyle(month)}>
                          <Text style={styles.monthText}>{month}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.row}>
                      {months.slice(3).map((month, index) => (
                        <View key={index} style={getMonthStyle(month)}>
                          <Text style={styles.monthText}>{month}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}

              </View>

            </View>
            <TouchableOpacity style={styles.botaoSaberMais}>
              <ImageBackground style={styles.imageSaberMais} source={require('../assets/botaobranco.png')}>
              </ImageBackground>
            </TouchableOpacity>

          </View>
          <View style={styles.vestibulares}>
            <Text style={styles.titulo1}>Vestibulares</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={styles.carrossel}>
                <TouchableOpacity style={styles.card}>
                  <Image style={styles.imgCard} source={require('../assets/imgEnem.png')} />
                  <View style={styles.botaoCard}>
                    <Text style={styles.textCard}>Enem</Text>
                    <Image style={styles.imgCardBotao} source={require('../assets/setared.png')} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card}>
                  <Image style={styles.imgCard} source={require('../assets/imgFatec.png')} />
                  <View style={styles.botaoCard}>
                    <Text style={styles.textCard}>Enem</Text>
                    <Image style={styles.imgCardBotao} source={require('../assets/setared.png')} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card}>
                  <Image style={styles.imgCard} source={require('../assets/imgfuvest.png')} />
                  <View style={styles.botaoCard}>
                    <Text style={styles.textCard}>Fuvest</Text>
                    <Image style={styles.imgCardBotao} source={require('../assets/setared.png')} />
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

        </View>
      </ScrollView>

      <View style={styles.textBox}>
        <Text style={styles.dynamicText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingTop: '14%',
  },
  header: {
    flexDirection: "row",
    alignItems: 'center',
    paddingStart: '8%',
    width: 234,
    height: 60,
    backgroundColor: '#C90018',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50
  },
  containerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 163,
    height: 38
  },
  conteudo: {
    paddingEnd: '8%',
    paddingStart: '8%',
  },
  banner: {
    flexDirection: 'row',
    // justifyContent: "space-between",
    // paddingEnd: 20,
  },
  bannerInteiro: {
    backgroundColor: "#C90018",
    zIndex: 1,
    height: 170,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    marginTop: 25
  },
  botaoSaberMais: {
    width: 185,
    height: 85.54,
    zIndex: -1,
    alignSelf: 'flex-end',
    position: "relative",
    bottom: 40,

  },
  imageSaberMais: {
    width: 185,
    height: 85.54,
    // justifyContent: "space-around",
    // alignItems: 'stretch'
  },
  botaoCalendario: {
    paddingTop:20,
    paddingStart: 20,
    paddingBottom:20,
    marginEnd:13,
    // paddingVertical: 20,
    borderRadius: 80,
  },
  boxCalendario: {
    width: 170,
  },
  text: {
    fontFamily: "Bochan",
    fontSize: 24,
    color: "white"
  },
  subText: {
    fontFamily: "Poppins-Regular",
    fontSize: 17,
    color: "white"
  },
  calendar: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    // marginVertical: 1,
  },
  monthBox: {
    width: 39.96,
    height: 39.96,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9C3CA',
    borderRadius: 10,
  },
  specialMonthBox: {
    width: 39.96,
    height: 39.96,
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 2,
    backgroundColor: '#fff',  // Different color for Aug, Oct, Dec
    borderRadius: 10,
  },
  linhaCalendario: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  linha1: {
    backgroundColor: 'white',
    width: 2.6,
    height: 28.08,
    position: 'relative',
    right: 38
  },
  linha2: {
    backgroundColor: 'white',
    width: 2.6,
    height: 28.08,
    position: 'relative',
    left: 38
  },
  monthText: {
    fontFamily: 'Poppins-Regular'
  },
  titulo1:{
    fontFamily:'Bochan',
    color:"#000",
    fontSize:24,
    paddingVertical:25
  },
  imgCard:{
    width:163,
    height:99,
    borderRadius:7
  },
  botaoCard:{
    width:163,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    backgroundColor:'white',
    borderWidth:1,
    borderColor:'rgba(217, 217, 217, 1)',
    borderRadius:5,
    padding:7,
    paddingTop:10,
    zIndex:-1,
    position:"relative",
    bottom:7
  },
  textCard:{
    fontFamily:'Poppins-Regular',
    fontSize:17
  },
  imgCardBotao:{
    width:27,
    height:27,
  },
  carrossel:{
    flexDirection:"row",
  },
  card:{
    paddingEnd:25
  }

  // dynamicText: {
  //   color: '#ffffff',
  //   fontSize: 18,
  //   fontWeight: 'bold',
  // },
});
