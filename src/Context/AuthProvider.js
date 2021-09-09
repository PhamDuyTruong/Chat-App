import React, {useEffect, useState} from 'react';
import {auth} from '../firebase/config';
import {useHistory} from 'react-router-dom';
import { Spin } from 'antd';

export const AuthContext = React.createContext();

export default function AuthProvider({children}) {
    const [user, setUser] = useState({});
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() =>{
        const unsubcribe = auth.onAuthStateChanged((user) =>{
            console.log({user});
            if(user){
                const {displayName, uid, email, photoURL} = user;
                setUser({displayName, uid, email, photoURL}); 
                setIsLoading(false);
                history.push("/");
                return;
            }else{
                setUser({});
                setIsLoading(false);
                history.push('/login');
            }
        });
        // component did unmount
            return () =>{
                unsubcribe();
            }
    }, [history])
 
    return (
        <AuthContext.Provider value={{user}}>
             {isLoading ? <Spin style={{ position: 'fixed', inset: 0 }} /> : children}
        </AuthContext.Provider>
    )
}
