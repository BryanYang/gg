import React, { createContext, useContext } from "react";
import { message } from "antd";
import noop from "lodash/noop";
import { MessageInstance } from "antd/es/message/interface";

// 创建用户上下文
const MessageContext = createContext<MessageInstance>(noop as any);

export function withMessage(Com: React.FC) {
  return (props: any) => {
    const [messageApi, contextHolder] = message.useMessage();

    return (
      <MessageContext.Provider value={messageApi}>
        {contextHolder}
        <Com {...props} />
      </MessageContext.Provider>
    );
  };
}

// 创建一个自定义 hook 以便在组件中使用用户上下文
export function useMessage() {
  return useContext(MessageContext);
}
