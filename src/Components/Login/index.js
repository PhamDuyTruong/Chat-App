import React, {useEffect} from 'react';
import { Row, Col, Button, Typography } from 'antd';
import firebase ,{auth, db} from '../../firebase/config';
import { addDocument, generateKeywords } from '../../firebase/service';

const {Title} = Typography;
const fbProvider = new firebase.auth.FacebookAuthProvider();

export default function Login() {


    const handleFbLogin = async () =>{
        const {additionalUserInfo, user } = await auth.signInWithPopup(fbProvider);
        if(additionalUserInfo?.isNewUser){
            addDocument('users', {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: additionalUserInfo.providerId,
                keywords: generateKeywords(user.displayName?.toLowerCase())
            })
        }
    };

    
    return (
        <div>
            <Row justify="center" style={{height:"800px"}}>
                <Col span={8}>
                    <Title style={{textAlign:"center"}}>My Chat Room</Title>
                    <Button style={{width:"100%", marginBottom:5}}>Đăng nhập bằng Google</Button>
                    <Button style={{width:"100%"}} onClick={handleFbLogin}>Đăng nhập bằng Facebook</Button>
                </Col>
            </Row>
        </div>
    )
}
