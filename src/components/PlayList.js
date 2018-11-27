import React from "react";
import { List, Avatar, Icon } from "antd";
import "antd/lib/list/style/css";
import "antd/lib/avatar/style/css";

const PlayList = props => (
  <List
    itemLayout="horizontal"
    dataSource={props.data}
    className={props.className}
    renderItem={item => (
      <List.Item
        actions={[
          <Icon
            type="cloud-download"
            onClick={() => {
              const url = item.url;
              window.open(url, "_blank");
            }}
          />
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar src={process.env.PUBLIC_URL + item.image} />}
          title={item.title}
          description={item.singer}
          onClick={props.onClick ? () => props.onClick(item) : null}
        />
      </List.Item>
    )}
  />
);

export default PlayList;
