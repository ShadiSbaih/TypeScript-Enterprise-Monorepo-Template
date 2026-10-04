import * as React from "react";
import type { User } from "@repo/types";
import { formatDate } from "@repo/utils";

export const HomeScreen: React.FC = () => {
  const [currentUser] = React.useState<User>({
    id: "usr_mob_01",
    name: "Mobile App User",
    email: "mobile@example.com",
    role: "member",
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return (
    <div style={{ padding: 24, textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>React Native / Expo Mobile Client</h2>
      <p>
        Authenticated: <strong>{currentUser.name}</strong> ({currentUser.role})
      </p>
      <p style={{ color: "#666" }}>
        Joined: {formatDate(currentUser.createdAt)}
      </p>
    </div>
  );
};
