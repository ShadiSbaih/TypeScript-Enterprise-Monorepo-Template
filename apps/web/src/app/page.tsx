"use client";

import * as React from "react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@repo/ui";
import type { User } from "@repo/types";
import { createId, formatDate } from "@repo/utils";

export default function HomePage() {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);

  const handleCreateMockUser = () => {
    const newUser: User = {
      id: createId("usr"),
      name: "Template Developer",
      email: "developer@example.com",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCurrentUser(newUser);
  };

  return (
    <main style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <header style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "8px" }}>
          Next.js Enterprise Client
        </h1>
        <p style={{ color: "#666" }}>
          Connected to <code>@repo/ui</code>, <code>@repo/types</code>, and <code>@repo/utils</code>.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Session Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ marginBottom: "16px" }}>
            <Button onClick={handleCreateMockUser}>
              Initialize User Session
            </Button>
          </div>

          {currentUser ? (
            <div style={{ background: "#f5f5f5", padding: "16px", borderRadius: "8px" }}>
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Role:</strong> {currentUser.role}</p>
              <p><strong>Created:</strong> {formatDate(currentUser.createdAt)}</p>
            </div>
          ) : (
            <p style={{ color: "#999", fontStyle: "italic" }}>
              No active session loaded. Click above to test state.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
