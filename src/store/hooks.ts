import { useContext } from "react";
import Context from "./Context";

export const useStoreContext = () => {
  const [state, dispatch] = useContext(Context);
  return [state, dispatch];
};
