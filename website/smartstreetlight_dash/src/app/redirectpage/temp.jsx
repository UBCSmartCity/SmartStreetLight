import Link from "next/link";

export default function Temp() {
  return (
    <div>
      <p>You are not authorized to view this page!</p>
      <Link href="/">Return to login</Link>
    </div>
  );
}
