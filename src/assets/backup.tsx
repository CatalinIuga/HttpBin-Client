const [bucket, setBucket] = useState<BucketType>();
const [requests, setRequests] = useState<any>([]);
const [selectedRequest, setSelectedRequest] = useState<Request>();
const [newBucket, setNewBucket] = useState(false);

const checkBucket = async () => {
  try {
    const response = await fetch("https://localhost:7134/api/buckets", {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      setBucket(data);
      getRequests(data.bucketId);
    }
  } catch (error) {
    console.error(error);
  }
  setNewBucket(false);
};

const getRequests = async (bucketId: string) => {
  try {
    const response = await fetch(
      `https://localhost:7134/api/requests/bucket/${bucketId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    setRequests(data);
  } catch (error) {
    console.error(error);
  }
};

const createBucket = async () => {
  try {
    const response = await fetch("https://localhost:7134/api/buckets", {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    setBucket(data);
    getRequests(data.bucketId);
  } catch (error) {
    console.error(error);
  }
  setNewBucket(false);
};

useEffect(() => {
  if (newBucket) {
    createBucket();
  } else {
    checkBucket();
  }
  console.log(bucket);
}, [newBucket]);

interface BucketDetailsProps {
  bucket: {
    bucketId: string;
    updatedAt: number;
    timeToLive: number;
    requestCount: number;
  };
  onExtendTimeClick: () => void;
  onDeleteClick: () => void;
}

const BucketDetails: React.FC<BucketDetailsProps> = ({
  bucket,
  onExtendTimeClick,
  onDeleteClick,
}) => {
  const timeLeft = Math.floor(
    (bucket.updatedAt + bucket.timeToLive * 1000 - Date.now()) / 1000
  );

  return (
    <div className="bg-blue-500 text-white p-4 mb-4 rounded-md flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold mb-2">Bucket ID: {bucket.bucketId}</h2>
        <p>Time Left: {timeLeft} seconds</p>
        <p>Request Count: {bucket.requestCount}</p>
      </div>
      <div className="flex space-x-4">
        <button
          className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600"
          onClick={onExtendTimeClick}
        >
          Extend Time
        </button>
        <button
          className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
          onClick={onDeleteClick}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BucketDetails;

import React from "react";

interface RequestProp {
  request: {
    requestId: string;
    receivedAt: string;
    method: string;
  };
}

const SelectedRequest: React.FC<RequestProp> = ({ request }) => {
  return (
    <div className="w-3/4 p-4">
      <h2 className="text-lg font-bold mb-4">Selected Request</h2>
      <p>{request.requestId}</p>
      <div>
        <h3 className="text-lg font-bold mb-2">Headers</h3>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">Query Parameters</h3>
        {/* Render query parameters here */}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">Body</h3>
        {/* Render body content here */}
      </div>
    </div>
  );
};

export default SelectedRequest;

import { Dispatch, SetStateAction } from "react";

interface Request {
  requestId: string;
  receivedAt: string;
  method: string;
}

interface RequestsListProps {
  requests: Request[];
  onSelectRequest: Dispatch<SetStateAction<Request | undefined>>;
}

const RequestsList: React.FC<RequestsListProps> = ({
  requests,
  onSelectRequest,
}) => {
  return (
    <aside className="w-1/4 p-4 border-r border-gray-300">
      <h2 className="text-lg font-bold mb-4">Requests</h2>
      <ul>
        {Array.isArray(requests)
          ? requests.map((request) => (
              <li
                key={request.requestId}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => onSelectRequest(request)}
              >
                {new Date(request.receivedAt).toLocaleTimeString()} -{" "}
                {request.method}
              </li>
            ))
          : ""}
      </ul>
    </aside>
  );
};

export default RequestsList;

{
  base00: "#262626",
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
}