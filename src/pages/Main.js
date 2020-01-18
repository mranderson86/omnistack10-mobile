import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import MapView , { Marker, Callout } from 'react-native-maps';
import { 
    requestPermissionsAsync, 
    getCurrentPositionAsync  
} from 'expo-location';

function Main({ navigation }) {

    // Variável de estado - guarda as coordenadas do usuário
    const [ currentRegion, setCurrentRegion ] = useState(null);

    useEffect(() => {

        // executa quando o aplicativo inicializa.
        // e consunta a posição do usuário.
        async function loadInitialPosition(){

            // Busca permissão do usuário para usar o recurso do dispositivo
            const { granted } = await requestPermissionsAsync();

            if( granted ){
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04,
                });

            }
        }

        loadInitialPosition();

    } , []);

    if(!currentRegion){
        return null;
    }

    return (
        <MapView initialRegion={ currentRegion } style={ styles.map }>
            <Marker coordinate={{ latitude: -23.5481599 , longitude: -46.8376976 }}>
                <Image style={styles.avatar} source={{ uri: 'https://avatars0.githubusercontent.com/u/36639799?s=460&v=4' }} />

                <Callout onPress={ ()=> {
                    navigation.navigate('Profile', { github_username: 'mranderson86' });
                }}>
                    <View style={styles.callout}>
                        <Text style={styles.devName}>Anderson Gomes</Text>
                        <Text style={styles.devBio}>Desenvolvedor / Programador de Software , Geek , Gamer , gosta de tecnlogia e cultura pop.</Text>
                        <Text style={styles.devTech}>React , React Native , C# , Visual Basic</Text>
                    </View>
                </Callout>

            </Marker>
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },

    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#FFF'
    },

    callout: {
        width: 260,
    },

    devName : {
        fontWeight: 'bold',
        fontSize: 16,
    },

    devBio: {
        color: '#666',
        marginTop: 5,
    },

    tech: {
        marginTop: 5,
    }
});


export default Main;