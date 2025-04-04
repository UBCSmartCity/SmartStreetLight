import Link from "next/link";

export default function Dashboard() {
  return (
    <div>
      <p>You are not authorized to view this page!</p>;
      <Link href="/login">Return to login</Link>
    </div>
  );
}
