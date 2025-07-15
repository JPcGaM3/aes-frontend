import { Metadata } from "next";

export const metadata: Metadata = {
	title: "หน้าจัดการ master",
};

export default function ManagementLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-col justify-center gap-4">
			<div className="inline-block justify-center w-full">{children}</div>
		</section>
	);
}
