/**
 * https://github.com/vadimdemedes/ink/issues/263#issuecomment-628672280
 */
import { ReactElement, useEffect } from "react";

const enterAltScreenCommand = "\x1b[?1049h";
const leaveAltScreenCommand = "\x1b[?1049l";

const exitFullScreen = () => {
  process.stdout.write(leaveAltScreenCommand);
};

const FullScreen = ({ children }: { children: ReactElement }) => {
  useEffect(() => {
    // destroy alternate screen on unmount
    return exitFullScreen;
  }, []);

  // trigger alternate screen
  process.stdout.write(enterAltScreenCommand);
  return children;
};

export { exitFullScreen };
export default FullScreen;
