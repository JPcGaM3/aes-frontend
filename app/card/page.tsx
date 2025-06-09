import React from "react";

import { mock_users } from "@/utils/mock";
import CardComponent from "@/components/CardComponent";

function Table() {
  return (
    <div className="flex flex-col gap-8">
      <CardComponent users={mock_users} />
    </div>
  );
}

export default Table;
