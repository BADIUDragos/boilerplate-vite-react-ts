import Idle from "idle-js"

import { useLogoutMutation, useTokens } from "../../store";
import { useEffect } from "react";

export const useIdle = (milliseconds: number = 900000) : void => {
  const [logout] = useLogoutMutation();
  const tokens = useTokens();

  useEffect(() => {
    if (tokens) {
      const idle = new Idle({
        idle: milliseconds, 
        onIdle: () => {
          logout({ refresh: tokens.refresh });
        },
        events: ['mousemove', 'keydown', 'mousedown'], 
      });

      idle.start(); 

      return () => {
        idle.stop();
      };
    }
  }, [logout, tokens, milliseconds]); 
}