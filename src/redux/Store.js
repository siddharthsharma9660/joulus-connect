import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import userReducers from './Reducers';

const rootReducer = combineReducers({ userReducers });

export const Store = createStore(rootReducer, applyMiddleware(thunk));