import React, { createContext, useContext } from "react";
import { Modal } from "antd";
import noop from "lodash/noop";
import { ModalStaticFunctions } from "antd/es/modal/confirm";

// 创建用户上下文
const ModalContext = createContext<Omit<ModalStaticFunctions, "warn">>(noop as any);

export function withModal(Com: React.FC) {
  return (props: any) => {
    const [modal, contextHolder] = Modal.useModal();


    return (
      <ModalContext.Provider value={modal}>
        {contextHolder}
        <Com {...props} />
      </ModalContext.Provider>
    );
  };
}

// 创建一个自定义 hook 以便在组件中使用用户上下文
export function useModal() {
  return useContext(ModalContext);
}
