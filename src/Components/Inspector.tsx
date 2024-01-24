import ReactJson from "@microlink/react-json-view";
import React, { useEffect, useState } from "react";
import { useBucketContext } from "../Context/BucketContext";
import { DeleteIcon } from "../svgs/icons";
import { coloredHttpMethod } from "../utils/colored_methods";

interface CapturedRequest {
  requestId: string;
  receivedAt: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  body: string;
  queryParameters: Record<string, string | null>;
}

interface InspectorProps {
  requestId: string | null;
}

const Inspector: React.FC<InspectorProps> = ({ requestId }) => {
  const { bucketId } = useBucketContext();
  const [request, setRequest] = useState<CapturedRequest | null>(null);

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://localhost:7134/api/requests/${requestId}`,
        { credentials: "include", method: "DELETE" }
      );
      if (response.ok) {
        setRequest(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (requestId) {
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://localhost:7134/api/requests/${requestId}`
          );
          if (response.ok) {
            const data: CapturedRequest = await response.json();
            setRequest(data);
          }
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [requestId]);

  return (
    <main className="flex flex-col bg-[#181818]  gap-2 rounded-tl-lg col-span-6 p-5 max-w-full overflow-y-auto">
      {bucketId && request && Object.keys(request).length !== 0 ? (
        <>
          <section className="flex  justify-between">
            <h3 className="font-cubano text-2xl">Request Details</h3>
            <div className="flex items-center gap-3">
              <div className="text-xl">
                {new Date(request.receivedAt).toLocaleTimeString()}
              </div>
            </div>
          </section>
          <div className="flex  justify-start gap-10">
            <div className="font-cubano text-lg">
              Method:
              <span className={coloredHttpMethod(request.method)}>
                {" " + request.method}
              </span>
            </div>
            <div className="font-cubano text-lg">
              Path:
              <span className="font-mono text-yellow-400">
                {" " + request.path}
              </span>
            </div>
            <div className="flex-1"></div>
            <button
              onClick={handleDelete}
              className="rounded border group hover:opacity-80 bg-red-600 p-1"
            >
              <DeleteIcon className="h-5 w-5" fill="white" />
            </button>
          </div>

          <section className="flex flex-col gap-4 h-full overflow-y-auto">
            <CollapsibleSection title={"Headers"}>
              <div className="flex flex-col m-[10px] gap-2">
                {Object.entries(request.headers).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex whitespace-nowrap bg-[#191919] border border-black rounded items-baseline p-2 "
                  >
                    <span className="capitalize font-extrabold text-lg text-blue-500">
                      {key}
                      <span className="text-orange-500 whitespace-pre">:</span>
                    </span>
                    <div className="break-words whitespace-pre-wrap overflow-hidden">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {!["GET", "HEAD"].includes(request.method) ? (
              <CollapsibleSection title={"Body"}>
                <div className="text-xl m-2 rounded border-black border">
                  <ReactJson
                    src={JSON.parse(request.body)}
                    displayDataTypes={false}
                    theme={{
                      base00: "#191919",
                      base01: "#282a2e",
                      base02: "#373b41",
                      base03: "#969896",
                      base04: "#b4b7b4",
                      base05: "#c5c8c6",
                      base06: "#e0e0e0",
                      base07: "#ffffff",
                      base08: "#CC342B",
                      base09: "#F96A38",
                      base0A: "#FBA922",
                      base0B: "#198844",
                      base0C: "#3971ED",
                      base0D: "#3971ED",
                      base0E: "#A36AC7",
                      base0F: "#3971ED",
                    }}
                    enableClipboard={false}
                    iconStyle={"circle"}
                    displayObjectSize={false}
                    shouldCollapse={false}
                    style={{ padding: "10px", borderRadius: "4px" }}
                  />
                </div>
              </CollapsibleSection>
            ) : (
              <div className="flex justify-between items-center bg-[#262626]  gap-1  rounded-md  border p-2 ">
                <h2 className="text-2xl font-cubano">Body</h2>
                <div className="">
                  not available for{" "}
                  <span
                    className={
                      coloredHttpMethod(request.method) + " font-cubano"
                    }
                  >
                    {request.method}
                  </span>{" "}
                  method!
                </div>
              </div>
            )}

            <CollapsibleSection title="Query Parameters">
              <div className="flex flex-wrap m-2 gap-2">
                {Object.keys(request.queryParameters).length > 0 ? (
                  Object.entries(request.queryParameters).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex text-lg items-baseline border border-black bg-[#191919] p-2 rounded"
                      >
                        <span className="text-blue-500">{key}</span>
                        <span className="text-orange-500">{"="}</span>
                        <span className="break-words overflow-hidden">
                          {value === null ? "null" : value.toString()}
                        </span>
                      </div>
                    )
                  )
                ) : (
                  <div className="">No parameters</div>
                )}
              </div>
            </CollapsibleSection>
          </section>
        </>
      ) : (
        <div className="flex relative text-2xl h-full justify-center items-center ">
          <div className="absolute font-cubano  top-0 left-0">
            REQUEST DETAILS
          </div>
          <div className="absolute text-xl top-0 right-0">--:--:-- ??</div>
          Select a request to inspect it!
        </div>
      )}
    </main>
  );
};

export default Inspector;

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col bg-[#262626]  gap-1  rounded-md  border p-2 ">
      <button
        onClick={toggleSection}
        className="flex justify-between text-2xl font-cubano mr-2"
      >
        <h2 className="text-2xl font-cubano">{title}</h2>

        {isOpen ? "▼" : "◀"}
      </button>

      {isOpen && <div>{children}</div>}
    </div>
  );
};
