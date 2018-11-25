import React from 'react';
import { List, Avatar } from 'antd';
import 'antd/lib/list/style/css';  
import 'antd/lib/avatar/style/css';  


const PlayList = (props) => (
    <List
    itemLayout="horizontal"
    dataSource={props.data}
    renderItem={item => (
    <List.Item actions={[<span  onClick={() => alert('test')}>top</span>]}>
        <List.Item.Meta
        avatar={<Avatar src= {process.env.PUBLIC_URL + item.image}/>}
        title={item.title}
        description={item.singer}
        onClick={() => props.onPlay(item)}
        />
    </List.Item>
    )}
    />
)

export default PlayList