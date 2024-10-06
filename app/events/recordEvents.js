import { EventRegister } from 'react-native-event-listeners';

export default {
  // Alias para addListener, para suporte à função 'on'
  on: (eventName, callback) => {
    return EventRegister.addEventListener(eventName, callback);
  },
  
  // Função para adicionar listener
  addListener: (eventName, callback) => {
    return EventRegister.addEventListener(eventName, callback);
  },

  // Função para remover listener
  removeListener: (listenerId) => {
    return EventRegister.removeEventListener(listenerId);
  },
};
