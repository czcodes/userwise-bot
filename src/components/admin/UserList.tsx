
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    lastActive: "2023-07-15T14:30:00",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
    lastActive: "2023-07-15T10:15:00",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "User",
    status: "Inactive",
    lastActive: "2023-07-10T09:45:00",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "User",
    status: "Active",
    lastActive: "2023-07-14T16:20:00",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    role: "User",
    status: "Active",
    lastActive: "2023-07-15T11:05:00",
  },
];

type User = typeof mockUsers[0];

export function UserList() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
    toast({
      title: "User Deleted",
      description: "The user has been deleted successfully.",
    });
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "Active" ? "Inactive" : "Active";
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
    toast({
      title: "Status Updated",
      description: "The user status has been updated successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">User Management</h3>
        <Button variant="outline" size="sm">
          Add User
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.status === "Active" ? "success" : "outline"}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(user.lastActive)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleStatus(user.id)}
                    title={user.status === "Active" ? "Deactivate" : "Activate"}
                  >
                    {user.status === "Active" ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteUser(user.id)}
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
