import { useBucketContext } from "../Context/BucketContext";
import { CopyIcon, DeleteIcon, TestIcon, TimerIcon } from "../svgs/icons";

function Topbar() {
  const { bucketId, createBucket, deletedBucket } = useBucketContext();

  function copy() {
    navigator.clipboard.writeText(bucketId || "");
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://localhost:7134/api/buckets/${bucketId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        deletedBucket();
        console.log("Bucket deleted successfully");
      } else {
        console.error("Failed to delete bucket");
      }
    } catch (error) {
      console.error("An error occurred during bucket deletion", error);
    }
  };

  const handleExtend = async () => {
    try {
      const response = await fetch(
        `https://localhost:7134/api/buckets/${bucketId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (response.ok) {
        console.log("Bucket extended successfully");
      } else {
        console.error("Failed to extend bucket");
      }
    } catch (error) {
      console.error("An error occurred during bucket extenction", error);
    }
  };

  const handleTest = async () => {
    const response = await fetch(
      `https://localhost:7134/${bucketId}/test?limit=10&test=true`,
      {
        method: "POST",
        body: JSON.stringify({
          string: "string",
          boolean: true,
          number: 12345,
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to perform test request");
    }
  };

  return (
    <header className="flex justify-between items-center bg-[#151515] w-full px-10 py-5 mb-3">
      <a
        href="/"
        className="text-3xl border p-2 rounded font-cubano hover:opacity-80"
      >
        HTTP BIN
      </a>
      {bucketId ? (
        <>
          <div className="flex gap-2">
            <button
              className="cursor-pointer flex items-center border p-2 rounded hover:opacity-80"
              onClick={copy}
            >
              <div className="text-xl font-cubano mr-2">Bucket:</div>
              <p className="font-extrabold text-green-500">{bucketId}</p>
              <CopyIcon />
            </button>
            <button
              onClick={handleExtend}
              className="px-4 border flex items-center gap-2 rounded-md bg-green-600 hover:opacity-80"
            >
              +30 min
              <TimerIcon className="w-6 h-6 color-white" fill="white" />
            </button>
            <button
              onClick={handleTest}
              className="px-4 border flex items-center gap-2 rounded-md bg-blue-600 hover:opacity-80"
            >
              Test
              <TestIcon className="w-6 h-6 color-white" fill="white" />
            </button>
            <button
              className="px-4 border flex items-center gap-2 rounded-md bg-red-600 hover:opacity-80"
              onClick={handleDelete}
            >
              Delete
              <DeleteIcon className="w-5 h-5 color-white" fill="white" />
            </button>
          </div>
        </>
      ) : (
        <button
          className="text-center px-4 border py-2 rounded-md bg-green-600 hover:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={createBucket}
        >
          New Bucket
        </button>
      )}
    </header>
  );
}

export default Topbar;
