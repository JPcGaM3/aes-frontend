import { ActionConfig, FieldConfig } from "@/interfaces/interfaces";
import React from "react";

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
		<div className="flex flex-col p-6 gap-8">
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
														onClick={action.onClick}
														className="text-blue-500 hover:underline"
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

// import { ActionConfig, FieldConfig } from "@/interfaces/interfaces";
// import React from "react";

// export default function TableComponent({
//   headers,
//   datas,
//   actions,
// }: {
//   headers: FieldConfig[];
//   datas: any[];
//   actions: ActionConfig[];
// }) {
//   return (
//     <div className="flex flex-col p-6 gap-6">
//       <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//               <tr>
//                 {headers.map((header: FieldConfig) => (
//                   <th
//                     key={header.key}
//                     className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase border-b border-gray-200"
//                   >
//                     {header.label}
//                   </th>
//                 ))}
//                 {actions.length > 0 && (
//                   <th className="px-6 py-4 text-xs font-semibold tracking-wider text-center text-gray-700 uppercase border-b border-gray-200">
//                     การดำเนินการ
//                   </th>
//                 )}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-100">
//               {datas.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={headers.length + (actions.length > 0 ? 1 : 0)}
//                     className="px-6 py-12 text-center text-gray-500"
//                   >
//                     <div className="flex flex-col items-center gap-2">
//                       <svg
//                         className="w-12 h-12 text-gray-300"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2a2 2 0 012 2v1m0 0v2a2 2 0 002 2h2"
//                         />
//                       </svg>
//                       <span className="text-sm font-medium">ไม่มีข้อมูล</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 datas.map((data: any, index: number) => (
//                   <tr
//                     key={index}
//                     className="transition-all duration-200 hover:bg-blue-50/50 hover:shadow-sm group"
//                   >
//                     {headers.map((header: any) => (
//                       <td
//                         key={header.key}
//                         className="px-6 py-4 text-sm font-medium text-gray-800"
//                       >
//                         <div
//                           className="max-w-xs truncate"
//                           title={data[header.key]}
//                         >
//                           {data[header.key] || "-"}
//                         </div>
//                       </td>
//                     ))}
//                     {actions.length > 0 && (
//                       <td className="px-6 py-4">
//                         <div className="flex items-center justify-center gap-2">
//                           {actions.map((action: any) => (
//                             <button
//                               key={action.key}
//                               onClick={() => action.onClick(data, index)}
//                               className={`
//                                 group/btn relative inline-flex items-center justify-center
//                                 min-w-[2.5rem] h-10 px-3 py-2
//                                 text-sm font-medium rounded-lg
//                                 transition-all duration-200
//                                 border border-transparent
//                                 focus:outline-none focus:ring-2 focus:ring-offset-1
//                                 ${getActionButtonStyle(action.key, action.className)}
//                               `}
//                               title={action.label}
//                             >
//                               <span className="flex items-center gap-2">
//                                 <span className="flex-shrink-0 w-4 h-4">
//                                   {action.icon}
//                                 </span>
//                                 <span className="hidden sm:inline-block">
//                                   {action.label}
//                                 </span>
//                               </span>
//                             </button>
//                           ))}
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Helper function to get button styles based on action type
// function getActionButtonStyle(actionKey: string, customClassName?: string) {
//   if (customClassName) {
//     return customClassName;
//   }

//   switch (actionKey) {
//     case "view":
//     case "info":
//       return `
//         bg-blue-50 text-blue-700 border-blue-200
//         hover:bg-blue-100 hover:border-blue-300 hover:shadow-md
//         focus:ring-blue-500
//         active:bg-blue-200
//       `;
//     case "edit":
//       return `
//         bg-amber-50 text-amber-700 border-amber-200
//         hover:bg-amber-100 hover:border-amber-300 hover:shadow-md
//         focus:ring-amber-500
//         active:bg-amber-200
//       `;
//     case "delete":
//     case "reject":
//       return `
//         bg-red-50 text-red-700 border-red-200
//         hover:bg-red-100 hover:border-red-300 hover:shadow-md
//         focus:ring-red-500
//         active:bg-red-200
//       `;
//     case "approve":
//       return `
//         bg-green-50 text-green-700 border-green-200
//         hover:bg-green-100 hover:border-green-300 hover:shadow-md
//         focus:ring-green-500
//         active:bg-green-200
//       `;
//     default:
//       return `
//         bg-gray-50 text-gray-700 border-gray-200
//         hover:bg-gray-100 hover:border-gray-300 hover:shadow-md
//         focus:ring-gray-500
//         active:bg-gray-200
//       `;
//   }
// }
