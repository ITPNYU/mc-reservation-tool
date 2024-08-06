import React, { useContext, useEffect, useState } from "react";

import AddEmail from "../../components/AddEmail";
import { DatabaseContext } from "../../components/Provider";
import EmailListTable from "../../components/EmailListTable";
import { TableNames } from "../../../../policy";
import { formatDate } from "../../../utils/date";
import { SafetyTraining } from "@/components/src/types";
import { set } from "date-fns";

export default function SafetyTrainedUsers() {
  const { safetyTrainedUsers, reloadSafetyTrainedUsers } =
    useContext(DatabaseContext);
  const [safetyTrainUsersFromFirestore, setSafetyTrainUsersFromFirestore] =
    useState<SafetyTraining[]>([]);

  useEffect(() => {
    const targetUsers = safetyTrainedUsers.filter((user) => user.id !== null);
    setSafetyTrainUsersFromFirestore(targetUsers);
  }, [safetyTrainedUsers]);

  return (
    <EmailListTable
      columnFormatters={{ completedAt: formatDate }}
      tableName={TableNames.SAFETY_TRAINING}
      title="Safety Trained Users"
      userList={safetyTrainUsersFromFirestore}
      userListRefresh={reloadSafetyTrainedUsers}
    />
  );
}
