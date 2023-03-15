import { useEffect, useState } from "react";

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
      {timer.getDate() < 10 ? 0 : ""}
      {timer.getDate()}/{timer.getMonth() < 9 ? 0 : ""}
      {timer.getMonth() + 1}/{timer.getFullYear()} -{" "}
      {timer.getHours() < 10 ? 0 : ""}
      {timer.getHours()} : {timer.getMinutes() < 10 ? 0 : ""}
      {timer.getMinutes()} : {timer.getSeconds() < 10 ? 0 : ""}
      {timer.getSeconds()}
    </>
  );
};
