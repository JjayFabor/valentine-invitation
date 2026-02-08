import { StoryController } from "./components/StoryController";
import { Analytics } from "@vercel/analytics/next";

function App() {
  return (
    <div className="w-full h-full">
      <Analytics />
      <StoryController />
    </div>
  );
}

export default App;
