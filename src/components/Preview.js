import React from 'react';
import { Card } from 'antd';
import 'antd/lib/card/style/css';  

const { Meta } = Card;
const Preview = (props) => (
  <Card
    onClick = {props.onClick}
    cover={<img alt="example" src={process.env.PUBLIC_URL + props.item.image} />}
    className = 'preview'
  >
    <Meta
      title={props.item.title}
      description={props.item.singer}
    />
  </Card>
)

export default Preview