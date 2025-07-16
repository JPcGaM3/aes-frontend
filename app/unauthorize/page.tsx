import FuzzyText from "@/components/FuzzyTextComponent";

export default function UnAuthorizePage() {
	return (
		<div className="flex flex-col items-center justify-center w-full h-full sm:text-xl md:text-2xl lg:text-4xl">
			<FuzzyText
				baseIntensity={0.2}
				enableHover={true}
				hoverIntensity={0.5}
			>
				401
			</FuzzyText>
			<FuzzyText
				baseIntensity={0.2}
				enableHover={true}
				hoverIntensity={0.5}
			>
				Unauthorized
			</FuzzyText>
		</div>
	);
}
