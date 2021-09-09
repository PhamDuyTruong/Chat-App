import React, { useState} from 'react';
import  { AuthContext } from '../Context/AuthProvider';
import useFirestore from '../Hooks/useFirestore';


export const AppContext = React.createContext();

export default function AppProvider({children}) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [isInvitedMemberVisible, setIsInvitedMemberVisible] = useState(false);
    
  const {
    user: { uid },
  } = React.useContext(AuthContext);

  const roomsCondition = React.useMemo(() => {
    return {
      fieldName: 'members',
      operator: 'array-contains',
      compareValue: uid,
    };
  }, [uid]);

  const rooms = useFirestore('rooms', roomsCondition);
  const selectedRoom = React.useMemo(
    () => rooms.find((room) => room.id === selectedRoomId) || {},
    [rooms, selectedRoomId]
  );

  const usersCondition = React.useMemo(() => {
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);

  const members = useFirestore('users', usersCondition);
  console.log({members, selectedMembers: selectedRoom.members});


 
    return (
        <AppContext.Provider value={{rooms, isAddRoomVisible, setIsAddRoomVisible, selectedRoomId, setSelectedRoomId, selectedRoom, members, isInvitedMemberVisible, setIsInvitedMemberVisible}}>
             {children}
        </AppContext.Provider>
    )
}