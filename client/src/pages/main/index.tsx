import { Call, StreamVideo } from "@stream-io/video-react-sdk"
import { useUser } from "../../user-context"
import { Navigate, useNavigate } from "react-router-dom"
import { useEffect, useState, type ChangeEvent } from "react";
import CryptoJS from "crypto-js";

interface NewRoom {
  name: string;
  description: string;
}

interface Room {
  id: string;
  title: string;
  description: string;
  participantsLength: number;
  createdBy: string;
}

type CustomCallData = {
  description?: string;
  title?: string;
}

const MainPage = () => {
  const { client, user, setCall, isLoadingClient } = useUser();
  const [newRoom, setNewRoom] = useState<NewRoom>({ name: "", description: "" });
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])

  const navigate = useNavigate();

  useEffect(() => {
    if (client) fetchListOfCalls()
  }, [client]);

  const hashRoomName = (roomName: string): string => {
    const hash = CryptoJS.SHA256(roomName).toString(CryptoJS.enc.Base64);
    return hash.replace(/[^a-zA-Z0-9_-]/g, "");
  };

  const createRoom = async () => {
    const { name, description } = newRoom;

    if (!client || !user || !name || !description) {
      alert("Please fill in both room name and description.");
      return;
    }
    const call = client.call("audio_room", hashRoomName(name))
    await call.join({
      create: true,
      data: {
        members: [{ user_id: user.username }],
        custom: {
          title: name,
          description,
        },
      },
    });

    setCall(call);
    navigate("/room", { replace: true });
  };

  const fetchListOfCalls = async () => {
    const callsQueryResponse = await client?.queryCalls({
      filter_conditions: { ongoing: true },
      limit: 4,
      watch: true,
    });

    if (!callsQueryResponse) {
      alert("Error getting calls");
    } else {
      const getCallInfo = async (call: Call): Promise<Room> => {
        const callInfo = await call.get()
        const customData = callInfo.call.custom
        const { title, description } = (customData || {}) as CustomCallData
        const participantsLength = callInfo.members.length ?? 0
        const createdBy = callInfo.call.created_by.name ?? ""
        const id = callInfo.call.id ?? ""
        return {
          id,
          title: title ?? "",
          description: description ?? "",
          participantsLength,
          createdBy,
        }
      };

      const roomPromises = await callsQueryResponse.calls.map((call) =>
        getCallInfo(call)
      );

      const rooms = await Promise.all(roomPromises)
      setAvailableRooms(rooms)
    }
  }

  const joinCall = async (callID: string) => {
    const call = client?.call("audio_room", callID)
    try {
      await call?.join()
      setCall(call)
      navigate("/room")
    } catch (err) {
      alert("Error while joining call. Wait for room to be live.")
    }
  }

  if (isLoadingClient) return <h1>Loading...</h1>;

  if ((!isLoadingClient && !user) || (!isLoadingClient && !client)) {
    return <Navigate to="/sign-in" />
  };

  return (
    <StreamVideo client={client!}>
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Welcome, {user?.name}</h1>

          <div className="bg-white shadow-md rounded-lg p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">Create Your Own Room</h2>
            <div className="space-y-4">
              <input
                placeholder="Room Name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setNewRoom((prev) => ({ ...prev, name: event.target.value }))
                }
              />
              <input
                placeholder="Room Description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  setNewRoom((prev) => ({ ...prev, description: event.target.value }))
                }
              />
              <button
                onClick={createRoom}
                className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 px-4 rounded-md transition"
              >
                Create Room
              </button>
            </div>
          </div>

          {availableRooms.length !== 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Available Rooms</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {availableRooms.map((room) => (
                  <div
                    key={room.id}
                    className="cursor-pointer bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition"
                    onClick={() => joinCall(room.id)}
                  >
                    <h4 className="text-lg font-medium text-gray-800 mb-1">{room.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{room.description}</p>
                    <p className="text-sm text-gray-500">Participants: {room.participantsLength}</p>
                    <p className="text-sm text-gray-500">Created By: {room.createdBy}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <h2 className="text-center text-gray-500">No available rooms at the moment</h2>
          )}
        </div>
      </div>
    </StreamVideo>
  )
}

export default MainPage