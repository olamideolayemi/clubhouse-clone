import { ParticipantsAudio, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Participant } from "./participant";

export const Participants = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  return (
    <div className="space-y-4">
      <ParticipantsAudio participants={participants} />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {participants.map((p) => (
          <Participant participant={p} key={p.sessionId} />
        ))}
      </div>
    </div>
  )
}