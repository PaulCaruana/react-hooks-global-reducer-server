import { createStore, reduxDevToolsExt } from "react-hooks-global-state";
import { applyMiddleware, combineReducers, compose } from 'redux';
import reduxLogger from 'redux-logger';
import reduxThunk from 'redux-thunk';
import counterReducer, {initialState as counterInitialState} from "./counter/CounterReducer";
import userReducer, {initialState as userInitialState} from "./user/UserReducer";


const reducer = combineReducers({
    count: counterReducer,
    user: userReducer,
});
const initialState = {count: counterInitialState, user: userInitialState};
const middleware = [];
const enhancers = [];

if ( process.env.NODE_ENV === 'development') {
    middleware.push(reduxLogger);
    enhancers.push(reduxDevToolsExt());
}

middleware.unshift(reduxThunk)
enhancers.unshift(applyMiddleware(...middleware) )

export const {dispatch, useGlobalState} = createStore(
    reducer,
    initialState,
    compose(...enhancers)
);
