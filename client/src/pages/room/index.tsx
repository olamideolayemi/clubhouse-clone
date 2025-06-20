import { OwnCapability, useCallStateHooks, useRequestPermission } from "@stream-io/video-react-sdk"
import Controls from "./controls";
import { useUser } from "../../user-context";
import { PermissionRequestPanel } from "./permission-request";
import { Participants } from "./participants";

const RoomPage = () => {
  const {
    useCallCustomData,
    useParticipants,
    useCallCreatedBy
  } = useCallStateHooks();

  const { user } = useUser();

  const custom = useCallCustomData();
  const participants = useParticipants();
  const createdBy = useCallCreatedBy();

  const { hasPermission, requestPermission } = useRequestPermission(OwnCapability.SEND_AUDIO);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{custom?.title ?? "TITLE"}</h2>
          <h3 className="text-md text-gray-600 mb-4">{custom?.description ?? "DESCRIPTION"}</h3>
          <p className="text-sm text-gray-500">{participants.length} participants</p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <Participants />
        </div>

        {user?.username === createdBy?.id && (
          <div className="mt-4">
            <PermissionRequestPanel />
          </div>
        )}

        <div className="mt-6 text-center">
          {hasPermission ? (
            <Controls />
          ) : (
            <button
              onClick={requestPermission}
              className="text-xl px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow"
            >
              ✅ Request Mic Access
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RoomPage