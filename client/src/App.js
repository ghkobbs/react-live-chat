import { Provider } from 'react-redux';
import store from './store';
import Application from './components/Application';

function App() {

  return (
    <Provider store={store}>
      <Application />
    </Provider>
  );

}

export default App;
