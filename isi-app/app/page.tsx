'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/start");
  };

  return (
    <div className="flex min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">

      <main className="flex-grow  items-center justify-center">
      <section className="pt-20 pb-20 text-center px-4">
      <div className="container mx-auto max-w-4xl">

        <h1 className="text-5xl md:text-6xl font-bold mb-6">Enjoy more with Isi</h1>
        <p className="text-xl md:text-2xl mb-12">Plan easier your personalized experiences.</p>
        <Button onClick={handleClick} className="bg-emerald-800 hover:bg-emerald-700 text-white px-8 py-6 text-lg">Get started</Button>
      </div>
    </section>
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why book with Isi?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <span role="img" aria-label="Support" className="text-6xl">
                🐻
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7</h3>
            <p>customer support</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <span role="img" aria-label="Rewards" className="text-6xl">
                🍊
              </span>
            </div>
            <h3 className="text-xl font-semibold">Earn rewards</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-6">
              <span role="img" aria-label="Plan" className="text-6xl">
                🌳
              </span>
            </div>
            <h3 className="text-xl font-semibold">Plan your way</h3>
          </div>
        </div>
      </div>
    </section>
      </main>
    </div>
  );
}
