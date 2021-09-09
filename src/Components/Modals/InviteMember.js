import React, {useState} from 'react';
import { Form, Modal, Input, Select, Avatar } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { debounce } from 'lodash';
import { Spin } from 'antd';
import { db } from '../../firebase/config';

function  DebounceSelect({fetchOptions, debounceTimeout = 300, curMembers, ...props}){
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const debounceFetcher = React.useMemo(() =>{

        const loadOptions = (value) =>{
            setOptions([]);
            setFetching(true);
            fetchOptions(value, curMembers).then(newOptions =>{
                setOptions(newOptions);
                setFetching(false);
            })
        }
        return debounce(loadOptions, debounceTimeout); 
    }, [debounceTimeout, fetchOptions, curMembers]);

    React.useEffect(() => {
        return () => {
          // Component Did Unmount
          setOptions([]);
        };
      }, []);
    
    return (
        <Select labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size='small' /> : null}
        {...props}
        >
        {options.map((opt) => (
        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
          <Avatar size='small' src={opt.photoURL}>
            {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
          </Avatar>
          {` ${opt.label}`}
        </Select.Option>
        ))}
        </Select>
    )
}

async function fetchUserList(search, curMembers){
    return db
    .collection('users')
    .where('keywords', 'array-contains', search?.toLowerCase())
    .orderBy('displayName')
    .limit(20)
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => ({
          label: doc.data().displayName,
          value: doc.data().uid,
          photoURL: doc.data().photoURL,
        }))
        .filter((opt) => !curMembers.includes(opt.value));
    });
}


export default function InviteMember() {
    const {isInvitedMemberVisible, setIsInvitedMemberVisible, selectedRoomId, selectedRoom} = React.useContext(AppContext);
    const [value, setValue] = useState([]);
    const [form] = Form.useForm();
    const handleOk = () =>{
        form.resetFields();
        setValue([]);

        //Update member in Current Room
        const roomRef = db.collection('rooms').doc(selectedRoomId);

        roomRef.update({
            members: [...selectedRoom.members, ...value.map((val) => val.value)],
          });

        setIsInvitedMemberVisible(false);
    }
 
    const handleCancel = () => {
        // reset form value
        form.resetFields();
        setValue([]);
    
        setIsInvitedMemberVisible(false);
      };
    return (
        <div>
               <Modal
                title='Thêm thành viên'
                visible={isInvitedMemberVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <Form  form={form} layout='vertical'>
                     <DebounceSelect
                     mode='multiple'
                    name='search-user'
                    label='Tên các thành viên'
                    value={value}
                    placeholder='Nhập tên thành viên'
                    fetchOptions={fetchUserList}
                    onChange={(newValue) => setValue(newValue)}
                    curMembers={selectedRoom.members}
                    style={{ width: '100%' }}
                    />
                </Form>
            </Modal>
        </div>
    )
}
