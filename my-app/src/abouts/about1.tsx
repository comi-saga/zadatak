import React from "react";
import { Stack, Text } from "@fluentui/react";
import { Timer } from "../views/timer";

export const About1 = () => {
  return (
    <Stack
      grow={1}
      styles={{ root: { padding: 20 } }}
      tokens={{ childrenGap: 20 }}
    >
      <Text styles={{ root: { fontSize: 30, fontWeight: 600 } }}>
        Ovo je About 1 stranica
      </Text>
      <Timer />
    </Stack>
  );
};
