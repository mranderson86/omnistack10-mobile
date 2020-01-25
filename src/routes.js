import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Main from './pages/Main';
import Profile from './pages/Profile';

// Cria o menu de navegação entre as páginas Profile e Main.
const Routes = createAppContainer(
    createStackNavigator({
        Main: {
            screen: Main,
            navigationOptions: {
                title: 'DevMaps'
            },
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                title: 'Perfil no Github'
            }
        }
    }, {
        defaultNavigationOptions: {
            headerTitleAlign: "center",
            headerTintColor: "#FFFFFF",
            headerStyle: {
                backgroundColor: "#7D40E7",
            }, 
            
        }
    })
);

export default Routes;