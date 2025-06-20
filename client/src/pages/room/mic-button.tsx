import { useCallStateHooks } from "@stream-io/video-react-sdk"

export const MicButton = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();

  return (
    <button
      onClick={async () => {
        if (isMute) {
          await microphone?.enable();
        } else {
          await microphone?.disable();
        }
      }}
      className={`px-4 py-2 rounded-md text-white font-semibold transition duration-200 shadow-md ${isMute ? "bg-gray-600 hover:bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
    >
      {isMute ? "Unmute" : "Mute"}
    </button>
  )
}