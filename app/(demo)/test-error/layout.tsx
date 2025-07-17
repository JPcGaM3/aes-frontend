import { Metadata } from "next";

export const metadata: Metadata = {
	title: "ไม่มีสิทธิ์เข้าถึง",
};

export default function TestErrorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center justify-center w-full min-h-[calc(100vh-120px)]">
			{children}
		</div>
	);
}
