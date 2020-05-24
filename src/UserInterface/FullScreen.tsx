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
    // trigger alternate screen
    process.stdout.write(enterAltScreenCommand);
    // destroy alternate screen on unmount
    return exitFullScreen;
  }, []);

  return children;
};

export { exitFullScreen };
export default FullScreen;
