import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk"

export const LiveButton = () => {
  const { useIsCallLive } = useCallStateHooks();
  const call = useCall();
  const isLive = useIsCallLive();

  return (
    <button
      className={`px-4 py-2 rounded-md text-white font-semibold transition duration-200 shadow-md ${isLive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        }`}
      onClick={async () => {
        if (isLive) {
          call?.stopLive();
        } else {
          call?.goLive();
        }
      }}
    >
      {isLive ? "Stop Live" : "Go Live"}
    </button>
  );
};