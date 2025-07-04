export default function UnAuthorizePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold">401 - Unauthorized</h1>
        <p className="text-lg">You do not have permission to view this page.</p>
      </div>
    </div>
  );
}
