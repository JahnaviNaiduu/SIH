import React, { useState } from "react";
import { User, Upload, MapPin, Phone, FileCheck, ArrowRight, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "KYC Upload", icon: Upload },
  { id: 3, title: "Trip Details", icon: MapPin },
  { id: 4, title: "Emergency Contacts", icon: Phone },
  { id: 5, title: "Review & Generate", icon: FileCheck },
];

export default function RegisterModal({ isOpen, onClose, onLoginClick }: RegisterModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    gender: "",
    age: "",
    nationality: "",
    // KYC
    aadhaarFile: null as File | null,
    passportFile: null as File | null,
    // Trip Details
    arrivalDate: "",
    departureDate: "",
    itinerary: "",
    // Emergency Contacts
    contact1Name: "",
    contact1Phone: "",
    contact2Name: "",
    contact2Phone: "",
    emergencyEmail: "",
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
    }
  };

  const handleGenerateID = () => {
    alert("Digital Tourist ID generation will be available after Supabase integration!");
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Select value={formData.nationality} onValueChange={(value) => setFormData({ ...formData, nationality: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aadhaar">Aadhaar Card (PDF/Image)</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {formData.aadhaarFile ? formData.aadhaarFile.name : "Click to upload or drag and drop"}
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload('aadhaarFile')}
                    className="hidden"
                    id="aadhaar-upload"
                  />
                  <Button variant="outline" onClick={() => document.getElementById('aadhaar-upload')?.click()}>
                    Upload Aadhaar
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passport">Passport (PDF/Image)</Label>
              <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {formData.passportFile ? formData.passportFile.name : "Click to upload or drag and drop"}
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload('passportFile')}
                    className="hidden"
                    id="passport-upload"
                  />
                  <Button variant="outline" onClick={() => document.getElementById('passport-upload')?.click()}>
                    Upload Passport
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="arrival">Arrival Date</Label>
                <Input
                  id="arrival"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departure">Departure Date</Label>
                <Input
                  id="departure"
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="itinerary">Travel Itinerary</Label>
              <Textarea
                id="itinerary"
                placeholder="Describe your planned destinations and activities..."
                rows={4}
                value={formData.itinerary}
                onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Primary Emergency Contact</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact1Name">Contact Name</Label>
                  <Input
                    id="contact1Name"
                    placeholder="Full name"
                    value={formData.contact1Name}
                    onChange={(e) => setFormData({ ...formData, contact1Name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact1Phone">Phone Number</Label>
                  <Input
                    id="contact1Phone"
                    placeholder="+91 9876543210"
                    value={formData.contact1Phone}
                    onChange={(e) => setFormData({ ...formData, contact1Phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Secondary Emergency Contact</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact2Name">Contact Name</Label>
                  <Input
                    id="contact2Name"
                    placeholder="Full name"
                    value={formData.contact2Name}
                    onChange={(e) => setFormData({ ...formData, contact2Name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact2Phone">Phone Number</Label>
                  <Input
                    id="contact2Phone"
                    placeholder="+91 9876543210"
                    value={formData.contact2Phone}
                    onChange={(e) => setFormData({ ...formData, contact2Phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyEmail">Emergency Email</Label>
              <Input
                id="emergencyEmail"
                type="email"
                placeholder="emergency@example.com"
                value={formData.emergencyEmail}
                onChange={(e) => setFormData({ ...formData, emergencyEmail: e.target.value })}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-4">
                <FileCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Generate Your Digital Tourist ID</h3>
              <p className="text-sm text-muted-foreground">
                Your information has been verified and is ready for blockchain registration.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{formData.fullName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nationality:</span>
                <span className="font-medium">{formData.nationality}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Travel Duration:</span>
                <span className="font-medium">
                  {formData.arrivalDate} to {formData.departureDate}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Emergency Contact:</span>
                <span className="font-medium">{formData.contact1Phone}</span>
              </div>
            </div>

            <Button onClick={handleGenerateID} className="w-full bg-gradient-hero hover:opacity-90 text-white font-semibold py-3">
              Generate Digital Tourist ID
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gradient-card border-0 shadow-strong">
        <div className="p-6">
          <DialogHeader className="text-center space-y-3">
            <DialogTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Register for Tourist ID
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create your blockchain-secured digital tourist identity
            </DialogDescription>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="mt-6 mb-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center">
                {steps.find(s => s.id === currentStep)?.icon && 
                  React.createElement(steps.find(s => s.id === currentStep)!.icon, { className: "mr-2 h-5 w-5" })
                }
                {steps.find(s => s.id === currentStep)?.title}
              </h3>
            </div>
            
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex space-x-2">
              {currentStep < steps.length && (
                <Button onClick={handleNext} className="bg-gradient-hero hover:opacity-90">
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Login Link */}
          {currentStep === 1 && (
            <div className="text-center mt-4 pt-4 border-t border-border">
              <Button variant="link" onClick={onLoginClick} className="text-sm">
                Already have a Tourist ID? Login here
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}