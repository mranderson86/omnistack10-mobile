import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView , { Marker, Callout } from 'react-native-maps';
import { 
    requestPermissionsAsync, 
    getCurrentPositionAsync  
} from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import { connect, disconnect, subscribeToNewDevs } from '../services/socket';

function Main({ navigation }) {

    const [ devs, setDevs ] = useState([]);
    const [ techs, setTechs ] = useState('');
    // Variável de estado - guarda as coordenadas do usuário
    const [ currentRegion, setCurrentRegion ] = useState(null);

    useEffect(() => {
        // executa quando o aplicativo inicializa.
        // e consunta a posição do usuário.
        async function loadInitialPosition() {

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

    useEffect(()=> { 
        // função que "inscreve" a aplicação para ser notificada pelo
        // backend toda vez que um novo dev for cadastrado
        subscribeToNewDevs(dev => { 
            //console.log('new dev',dev);

            setDevs([...devs, dev])
        });

    } , [ devs ]);

    function setupWebSocket() {
        disconnect();

        const { latitude, longitude } = currentRegion;

        connect(
            latitude,
            longitude,
            techs
        );
    }

    // Pesquisa por devs dentro de um raio
    // e com tecnologias informadas
    async function loadDevs() {
        const { latitude, longitude } = currentRegion;

        try{

            const response = await api.get('/search', {
                params: {
                    latitude,
                    longitude,
                    techs,
                }
               
            });

            setDevs(response.data.devs);
            setupWebSocket();

        }catch(err){
            console.log(err);
        }
    }

    // Executa toda vez que a localização no mapa mudar.
    function handleRegionChanged( region ) {
        setCurrentRegion(region);
    }

    if(!currentRegion){
        return null;
    }

    return (
        <>
        <MapView onRegionChangeComplete={handleRegionChanged}  initialRegion={ currentRegion } style={ styles.map }>
            
            {
                

                devs.map(dev => (
                    <Marker 
                        key={dev._id}
                        coordinate={
                        { 
                            longitude: dev.location.coordinates[0],
                            latitude: dev.location.coordinates[1] , 
                        }}
                    >
                        <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />

                        <Callout onPress={ ()=> {
                            navigation.navigate('Profile', { github_username: dev.github_username });
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{ dev.bio }</Text>
                                <Text style={styles.devTech}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>

                    </Marker>
                ))
            }

        </MapView>
        <View style={styles.searchForm}>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar devs por techs..."
                placeholderTextColor="#999"
                autoCapitalize="words"
                autoCorrect={false}

                onChangeText = { (text) => setTechs(text)  }
            />

            <TouchableOpacity onPress={ loadDevs } style={styles.loadButton}>
                <MaterialIcons name="my-location" size={20} color="#FFF" />
            </TouchableOpacity>
        </View>
        </>
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
    },

    searchForm: {
        //top: 50,
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row',
    },

    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFFFFF',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2,
    },

    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#8E4DFF',
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 15,
    }

});


export default Main;