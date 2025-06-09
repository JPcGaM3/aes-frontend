import React from "react";

import TableComponent from "@/components/TableComponent";
import { mock_columns, mock_statusOptions, mock_users } from "@/utils/mock";

function Table() {
  return (
    <div className="flex flex-col gap-8">
      <TableComponent
        columns={mock_columns}
        statusOptions={mock_statusOptions}
        users={mock_users}
      />
    </div>
  );
}

export default Table;
