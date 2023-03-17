import React from "react";
import { useEffect, useState } from "react";
import { DateToString } from "../service";

export const Timer = () => {
  const [timer, setTimer] = useState<Date>(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer(new Date());
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      {DateToString(timer)}
    </>
  );
};
