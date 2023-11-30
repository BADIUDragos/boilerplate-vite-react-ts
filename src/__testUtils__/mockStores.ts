import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { AuthState } from '../store/interfaces/authInterfaces'; 

const middlewares = [thunk];
export const mockStoreAuth = configureMockStore<{ auth: AuthState }>(middlewares);
