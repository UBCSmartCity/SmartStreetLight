import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DataCard from "@/components/DataCard";
import CardCollection from "./CardCollection";
import { addDataIncrementally } from "@/lib/data";

export default async function Page({ searchParams }) {
  const search = await searchParams;
  const loc = search?.location || "";
  const id = search?.id || "";

  return (
    <div className="min-h-screen flex flex-col h-full w-full text-center gap-y-4 p-3 ">
      <Header lightLocation={loc} />

      <CardCollection />

      <DataCard energy={true} />
      <DataCard energy={false} />

      <Footer />

      {/* adds a data point on the graph  */}
      <form action={addDataIncrementally}>
        <button type="submit">add data</button>
      </form>
    </div>
  );
}
