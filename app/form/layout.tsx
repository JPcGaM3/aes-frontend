export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col justify-center items-center gap-4 py-8 md:py-10">
      <div className="inline-block justify-center max-w-lg text-center">
        {children}
      </div>
    </section>
  );
}
