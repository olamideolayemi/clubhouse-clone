import { Avatar, type StreamVideoParticipant } from "@stream-io/video-react-sdk";

interface Props {
  participant: StreamVideoParticipant;
}

export const Participant = ({ participant }: Props) => {
  return (
    <div className="flex flex-col items-center space-y-2 bg-white p-4 rounded-lg shadow">
      <div
        className={`w-16 h-16 rounded-full overflow-hidden border-2 ${participant.isSpeaking ? "border-green-500 shadow-lg" : "border-gray-300"
          }`}
      >
        <Avatar imageSrc={participant.image} className="w-full h-full object-cover" />
      </div>
      <p className="text-sm text-gray-800 font-medium text-center">
        {participant.name ?? "Anonymous"}
      </p>
    </div>
  );
};
