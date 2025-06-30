export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col justify-center gap-4">
      <div className="inline-block justify-center w-full">
        {children}
      </div>
    </section>
  );
}