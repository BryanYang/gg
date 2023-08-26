import React, { createContext, useContext, useEffect, useState } from "react";
import noop from "lodash/noop";
import { User } from "../models/User";
import axios from "axios";
import { logout } from "../api/user";

// 创建用户上下文
const UserContext = createContext<{
  user: User;
  setUser: (u: User) => void;
}>({
  user: {} as User,
  setUser: noop,
});

// 创建用户上下文的 Provider 组件
export function withUser(Com: React.FC) {
  return (props: any) => {
    const [user, setUser] = useState({} as User);

    useEffect(() => {
      axios.get("/users/profile").then((res) => {
        if (res?.data) {
          setUser(res.data);
        }
      }).catch(e => {
        logout();
      });
    }, []);

    return (
      <UserContext.Provider value={{ user, setUser }}>
        <Com {...props} />
      </UserContext.Provider>
    );
  };
}

// 创建一个自定义 hook 以便在组件中使用用户上下文
export function useUser() {
  return useContext(UserContext);
}
