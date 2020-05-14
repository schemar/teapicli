import React, { FunctionComponent } from "react";
import Configuration from "../Configuration";

const UserInterface: FunctionComponent<{ configuration: Configuration }> = ({
  configuration,
}) => {
  return <>Yeah! {configuration.get("keys.quit")}</>;
};

export default UserInterface;
