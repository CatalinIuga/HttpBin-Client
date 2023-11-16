import { useEffect, useState } from "react";
import { useBucketContext } from "../Context/BucketContext";
import { coloredHttpMethod } from "../utils/colored_methods";

interface CapturedRequest {
  requestId: string;
  receivedAt: string;
  method: string;
  path: string;
}

function Sidebar({
  setRequestId,
}: {
  setRequestId: (requestId: string) => void;
}) {
  const [requests, setRequests] = useState<CapturedRequest[]>([]);

  const date = new Date()
    .toLocaleString("en-us", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(",", "");
  const { bucketId } = useBucketContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (bucketId) {
          const response = await fetch(
            `https://localhost:7134/api/requests/bucket/${bucketId}`
          );
          if (response.ok) {
            const data = await response.json();
            setRequests(data);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, [bucketId]);

  return (
    <aside className="bg-[#151515] rounded-tr-lg h-full col-span-3 p-5 flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between mb-3 w-full">
        <div className="text-2xl font-cubano">requests</div>
        <p className="font-bold text-gray-400">{date}</p>
      </div>
      <section className="flex font-bold flex-col gap-4 text-lg h-full overflow-y-auto">
        {bucketId && requests.length ? (
          requests.map((r) => (
            <button
              key={r.requestId}
              onClick={() => setRequestId(r.requestId)}
              className="relative group flex px-2 py-1 rounded-md w-full  bg-[#262626] hover:bg-[#383838] border border-white"
            >
              <div className="flex items-center gap-4 w-2/3">
                <div className="text-gray-400 text-sm">
                  {new Date(r.receivedAt).toLocaleTimeString()}
                </div>
                <div
                  className={
                    "text-xl font-cubano " + coloredHttpMethod(r.method)
                  }
                >
                  {r.method}
                </div>
              </div>
              <div className="w-1/2 pl-3 text-left overflow-hidden whitespace-nowrap text-ellipsis">
                {r.path}
              </div>
            </button>
          ))
        ) : (
          <div className="flex w-full h-full justify-center text-center items-center">
            Your requests will end up here!
          </div>
        )}
      </section>
    </aside>
  );
}

export default Sidebar;
