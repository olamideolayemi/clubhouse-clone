import { useCall, type PermissionRequestEvent } from "@stream-io/video-react-sdk";
import { useCallback, useEffect, useState } from "react";

export const PermissionRequestPanel = () => {
  const [
    permissionRequest,
    setPermissionRequest
  ] = useState<PermissionRequestEvent[]>([]);

  const call = useCall()

  useEffect(() => {
    return call?.on("call.permission_request", (event) => {
      const request = event as PermissionRequestEvent;
      setPermissionRequest((reqs) => [...reqs, request]);
    })

  }, [call])

  const handlePermissionRequest = useCallback(async (request: PermissionRequestEvent, accept: boolean) => {
    const { user, permissions } = request;
    try {
      if (accept) {
        await call?.grantPermissions(user.id, permissions);
      } else {
        await call?.revokePermissions(user.id, permissions);
      }
      setPermissionRequest((reqs) => reqs.filter((r) => r.user.id !== user.id));
    } catch (error) {
      alert("Failed to handle permission request. Please try again.");
      // console.error("Error handling permission request:", error);
    }
  }, [call]);

  if (!permissionRequest.length) {
    return;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md space-y-4">
      <h4 className="text-yellow-800 font-semibold">Permission Requests</h4>
      {permissionRequest.map((request) => (
        <div
          key={request.user.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-3 border border-gray-200 rounded-md shadow-sm"
        >
          <span className="text-sm text-gray-700 mb-2 sm:mb-0">
            <strong>{request.user.name}</strong> requested: {request.permissions.join(", ")}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePermissionRequest(request, true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              Approve
            </button>
            <button
              onClick={() => handlePermissionRequest(request, false)}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Deny
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};