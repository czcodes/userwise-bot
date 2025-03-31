
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Settings,
  Key,
  BarChart,
  Menu,
  User,
  LogOut,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type AppLayoutProps = {
  children: React.ReactNode;
  onLogout: () => void;
  userName: string;
};

const AppLayout = ({ children, onLogout, userName }: AppLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const navigation = [
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "Credentials", href: "/credentials", icon: Key },
    { name: "Admin Panel", href: "/admin", icon: BarChart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    onLogout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="h-16 border-b flex items-center justify-between px-4 bg-white shadow-sm">
        <div className="flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex items-center mb-8 mt-4">
                <h2 className="text-xl font-bold">DevOps Bot</h2>
                <Badge variant="secondary" className="ml-2">
                  Beta
                </Badge>
              </div>
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
              <Separator className="my-4" />
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </SheetContent>
          </Sheet>
          <div className="hidden md:flex items-center">
            <h2 className="text-xl font-bold">DevOps Bot</h2>
            <Badge variant="secondary" className="ml-2">
              Beta
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex">
            <Avatar className="h-8 w-8 bg-primary">
              <User className="h-4 w-4" />
            </Avatar>
            <div className="ml-2">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 border-r bg-card">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  }`
                }
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
