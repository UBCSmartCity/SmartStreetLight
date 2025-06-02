import BackButton from "@/components/BackButton";

export default function NotAdmin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-boxes p-8 rounded-2xl shadow-sm border border-border w-full max-w-md flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold text-center text-blue">
          You aren't an admin.
        </h1>
        <BackButton />
      </div>
    </div>
  );
}
