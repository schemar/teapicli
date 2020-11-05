import React from "react";
import { Text, useApp, useInput } from "ink";

export const HomePage = () => {
  const { exit } = useApp();
  useInput((input, key) => {
    if (input === "q") {
      exit();
    }
  });

  return (
    <>
      <Text>Here be Text</Text>
    </>
  );
};
