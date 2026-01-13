import { createContext, useContext} from "react";
import { getRole} from "../services/roleService";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  return (
    <RoleContext.Provider value={{ userRole: getRole()}}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
