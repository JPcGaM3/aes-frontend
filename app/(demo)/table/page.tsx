import React from "react";

import { ActionConfig, FieldConfig } from "@/interfaces/interfaces";

export default function TableComponent({
	headers,
	datas,
	actions,
}: {
	headers: FieldConfig[];
	datas: any[];
	actions: ActionConfig[];
}) {
	return (
		<div className="flex flex-col gap-8 p-6">
			<div className="overflow-x-auto border border-gray-200 rounded-lg shadow-lg">
				<table className="min-w-full bg-white">
					<thead className="bg-gray-50">
						<tr>
							{headers.map((header: FieldConfig) => {
								return (
									<th
										key={header.key}
										className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b border-gray-200"
									>
										{header.label}
									</th>
								);
							})}
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200 ">
						{datas.map((data: any, index: number) => {
							return (
								<tr
									key={index}
									className="transition-colors duration-150 hover:bg-gray-50"
								>
									{headers.map((header: any) => {
										return (
											<td
												key={header.key}
												className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap"
											>
												{data[header.key]}
											</td>
										);
									})}
									<td className="flex flex-row w-full h-full">
										{actions.map((action) => {
											return (
												<div
													key={action.key}
													className="px-2 py-1 text-sm whitespace-nowrap"
												>
													<button
														className="text-blue-500 hover:underline"
														onClick={action.onClick}
													>
														{action.icon}
													</button>
												</div>
											);
										})}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
