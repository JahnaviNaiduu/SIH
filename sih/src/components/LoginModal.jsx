import { useState } from "react";
import {
  QrCode,
  Lock,
  User,
  Fingerprint,
  Mic,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onRegisterClick,
}: LoginModalProps) {
  const [touristId, setTouristId] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTouristLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(
        "Tourist login functionality will be available after Supabase integration!"
      );
      onClose();
    }, 1000);
  };

  const handleAuthorityLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(
        "Authority login functionality will be available after Supabase integration!"
      );
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-gradient-card border-0 shadow-strong">
        <div className="p-6">
          <DialogHeader className="text-center space-y-3">
            <DialogTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Secure Login
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Access your SmartTourSafe account with blockchain-verified
              security
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="tourist" className="mt-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="tourist" className="text-sm font-medium">
                🧳 Tourist
              </TabsTrigger>
              <TabsTrigger value="authority" className="text-sm font-medium">
                🚨 Authority
              </TabsTrigger>
            </TabsList>

            {/* Tourist Login */}
            <TabsContent value="tourist" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tourist-id" className="text-sm font-medium">
                    Digital Tourist ID
                  </Label>
                  <div className="relative">
                    <QrCode className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tourist-id"
                      placeholder="Enter your Tourist ID or scan QR"
                      value={touristId}
                      onChange={(e) => setTouristId(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="tourist-password"
                    className="text-sm font-medium"
                  >
                    Password / OTP
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tourist-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password or OTP"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleTouristLogin}
                  className="w-full bg-gradient-hero hover:opacity-90 text-white font-semibold py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Login Securely"}
                </Button>

                <div className="flex items-center space-x-2">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">OR</span>
                  <Separator className="flex-1" />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => alert("QR scan feature coming soon!")}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR Code
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => alert("Voice login feature coming soon!")}
                >
                  <Mic className="mr-2 h-4 w-4" />
                  Voice Login (Accessibility)
                </Button>

                <div className="text-center pt-2">
                  <Button
                    variant="link"
                    onClick={onRegisterClick}
                    className="text-sm"
                  >
                    Don't have an ID? Register here
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Authority Login */}
            <TabsContent value="authority" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="authority-username"
                    className="text-sm font-medium"
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="authority-username"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="authority-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="authority-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                    <span className="text-secondary text-xs">
                      Blockchain Verified
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleAuthorityLogin}
                  className="w-full bg-authority hover:bg-authority/90 text-white font-semibold py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Access Control Panel"}
                </Button>

                <div className="flex items-center space-x-2">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">
                    SECURE OPTIONS
                  </span>
                  <Separator className="flex-1" />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => alert("Biometric login feature coming soon!")}
                >
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Biometric Login
                </Button>

                <div className="text-center pt-2">
                  <Button
                    variant="link"
                    className="text-sm text-muted-foreground"
                  >
                    Forgot Password?
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
