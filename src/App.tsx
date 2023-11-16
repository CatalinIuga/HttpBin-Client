import { useState } from "react";
import Inspector from "./Components/Inspector";
import Sidebar from "./Components/Sidebar";
import Topbar from "./Components/Topbar";
import { BucketProvider } from "./Context/BucketContext";

function App() {
  const [requestId, setRequestId] = useState<string | null>(null);
  return (
    <BucketProvider>
      <div className="h-screen flex flex-col items-center overflow-hidden">
        <Topbar />
        <div className="grid grid-cols-9 gap-4 w-full h-full overflow-hidden">
          <Sidebar setRequestId={setRequestId} />
          <Inspector requestId={requestId} />
        </div>
      </div>
    </BucketProvider>
  );
}

export default App;
