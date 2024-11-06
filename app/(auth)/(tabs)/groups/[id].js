import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useGlobalSearchParams } from 'expo-router';
import Participants from '../../../../components/participantes';
import Summaries from '../../../../components/summaries';
import AudioFiles from '../../../../components/audioFiles';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const GroupPage = () => {
  const { id } = useGlobalSearchParams(); 

  console.log("Id do grupo grupopage:", id);

  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Participantes"
        options={{ 
          title: 'Participantes', 
          tabBarIcon: ({ color }) => <MaterialIcons name="group" color={color} size={24} /> 
        }}
        children={() => <Participants groupId={id} />}  // Passando a tela de Participantes
      />
      <Tab.Screen 
        name="Resumos"
        options={{ 
          title: 'Resumos',  
          tabBarIcon: ({ color }) => <MaterialIcons name="assignment" color={color} size={24} /> 
        }}
        children={() => <Summaries groupId={id} />}  // Passando a tela de Resumos
      />
      <Tab.Screen 
        name="Áudios"
        options={{ 
          title: 'Áudios', 
          tabBarIcon: ({ color }) => <MaterialIcons name="mic" color={color} size={24} /> 
        }}
        children={() => <AudioFiles groupId={id} />}  // Passando a tela de Áudios
      />
    </Tab.Navigator>
  );
};

export default GroupPage;
