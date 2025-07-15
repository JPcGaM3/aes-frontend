export default function UnAuthorizeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col justify-center gap-4 h-full">
			<div className="inline-block justify-center w-full">{children}</div>
		</section>
	);
}
