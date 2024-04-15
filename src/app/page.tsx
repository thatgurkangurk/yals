import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-5xl">welcome to yals!</h1>
      <p>
        go to{" "}
        <Link href="/dashboard" className="text-primary underline">
          the dashboard
        </Link>{" "}
        to get started!
      </p>
      <div className="py-4"></div>
    </>
  );
}
