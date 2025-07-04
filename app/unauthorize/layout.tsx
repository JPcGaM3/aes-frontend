export default function UnAuthorizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col justify-center gap-4">
      <div className="justify-center inline-block w-full">{children}</div>
    </section>
  );
}
