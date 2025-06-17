import Link from "next/link";

export default async function RedirectPage({ params }) {
  const { message } = await params;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <p className="text-xl font-semibold text-muted mb-6">
        {decodeURIComponent(message)}
      </p>
      <Link
        href="/"
        className="py-2 px-6 bg-blue text-white rounded-full text-base font-medium shadow-md hover:bg-blue/90 transition-all"
      >
        Return to Login
      </Link>
    </div>
  );
}
