export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-orange-50 to-white">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-6 py-20">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-orange-600">
          South Indian Kitchen
        </p>
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
          AirDosa
        </h1>
        <p className="mb-10 max-w-xl text-lg leading-relaxed text-zinc-600">
          Crispy dosas, fluffy idlis, and filter coffee — made fresh and
          delivered to your door. Tap the chat bubble to ask our AI assistant
          about the menu, delivery, and pricing.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Menu",
              description: "Classic & specialty dosas, uttapams, and combos.",
            },
            {
              title: "Delivery",
              description: "Within 5 km, 35–50 min. Free above ₹499.",
            },
            {
              title: "Pricing",
              description: "Dosas from ₹80. Lunch combos & family packs available.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
            >
              <h2 className="mb-1 font-semibold text-zinc-900">{item.title}</h2>
              <p className="text-sm leading-relaxed text-zinc-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
