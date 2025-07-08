import { Accordion, AccordionItem, Code } from "@heroui/react";
import type { AccordionComponentProps } from "@/interfaces/props";

import {
	RequestOrderStatusColorMap,
	TaskOrderStatusColorMap,
} from "@/utils/constants";
import { REQUESTORDERSTATUS, TASKORDERSTATUS } from "@/utils/enum";

export const AccordionComponent = ({
	requestOrder,
	taskOrders,
}: AccordionComponentProps) => {
	const items = [
		{
			id: `request-${requestOrder.id}`,
			label: "Work order details",
			content: (
				<ul>
					{Object.entries(requestOrder).map(([key, value]) => {
						switch (key) {
							case "created_by":
							case "updated_by":
							case "created_at":
							case "updated_at":
								return null;
							case "comment":
								return (
									<Code
										className="w-full"
										color={
											requestOrder.status
												? RequestOrderStatusColorMap[
														requestOrder.status as REQUESTORDERSTATUS
													]
												: "default"
										}
									>
										<li
											key={key}
											className="grid justify-start w-full grid-cols-2"
										>
											<span>{key}</span>
											<span>{String(value)}</span>
										</li>
									</Code>
								);
							default:
								return (
									<li
										key={key}
										className="grid justify-start w-full grid-cols-2"
									>
										<span>{key}</span>
										<span>{String(value)}</span>
									</li>
								);
						}
					})}
				</ul>
			),
		},
		...(taskOrders || []).map((taskOrder, index) => ({
			id: `task-${taskOrder.id}`,
			label: `Task ${index + 1}`,
			content: (
				<ul>
					{Object.entries(taskOrder).map(([key, value]) => {
						switch (key) {
							case "created_by":
							case "updated_by":
							case "created_at":
							case "updated_at":
								return null;
							case "comment":
								return (
									<Code
										className="w-full"
										color={
											taskOrder.status
												? TaskOrderStatusColorMap[
														taskOrder.status as TASKORDERSTATUS
													]
												: "default"
										}
									>
										<li
											key={key}
											className="grid justify-start w-full grid-cols-2"
										>
											<span>{key}</span>
											<span>{String(value)}</span>
										</li>
									</Code>
								);
							default:
								return (
									<li
										key={key}
										className="grid justify-start w-full grid-cols-2"
									>
										<span>{key}</span>
										<span>{String(value)}</span>
									</li>
								);
						}
					})}
				</ul>
			),
		})),
	];

	return (
		<Accordion
			defaultExpandedKeys={[items[0].id]}
			selectionMode={taskOrders?.length ? "multiple" : "single"}
		>
			{items.map((item) => (
				<AccordionItem key={item.id} aria-label={item.label} title={item.label}>
					{item.content}
				</AccordionItem>
			))}
		</Accordion>
	);
};
