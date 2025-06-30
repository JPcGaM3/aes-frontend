export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col justify-center gap-4 py-8 md:py-10">
      <div className="inline-block justify-center w-full">
        {children}
      </div>
    </section>
  );
}
