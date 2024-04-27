import { useContext } from "react";
import WindleContext from "../context/windle";

export default function useWindleCtx() {
  return useContext(WindleContext);
}