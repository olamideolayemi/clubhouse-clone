import { LiveButton } from "./live-button"
import { MicButton } from "./mic-button"

const Controls = () => {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <MicButton />
      <LiveButton />
    </div>
  )
}

export default Controls