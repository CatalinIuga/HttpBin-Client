import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface BucketContextProps {
  bucketId?: string;
  timeToLive?: number;
  deletedBucket: () => void;
  checkBucket: () => void;
  createBucket: () => void;
}

const BucketContext = createContext<BucketContextProps | undefined>(undefined);

const BucketProvider = ({ children }: { children: ReactNode }) => {
  const [bucketId, setBucketId] = useState<string | undefined>();
  const [timeToLive, setTimeToLive] = useState<number | undefined>();

  const checkBucket = async () => {
    try {
      const response = await fetch("https://localhost:7134/api/buckets", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setBucketId(data.bucketId);
        setTimeToLive(data.timeToLive);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deletedBucket = () => {
    setBucketId(undefined);
  };

  const createBucket = async () => {
    try {
      const response = await fetch("https://localhost:7134/api/buckets", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      setBucketId(data.bucketId);
      setTimeToLive(data.timeLeft);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkBucket();
  }, []);

  const value: BucketContextProps = {
    bucketId,
    timeToLive,
    deletedBucket,
    checkBucket,
    createBucket,
  };

  return (
    <BucketContext.Provider value={value}>{children}</BucketContext.Provider>
  );
};

const useBucketContext = () => {
  const context = useContext(BucketContext);
  if (!context) {
    throw new Error("useBucketContext must be used within a BucketProvider");
  }
  return context;
};

export { BucketProvider, useBucketContext };
