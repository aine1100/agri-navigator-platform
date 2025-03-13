
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Database, Lock, Mail, ServerIcon, Settings, Globe, Shield } from "lucide-react";

const generalSchema = z.object({
  systemName: z.string().min(2, { message: "System name must be at least 2 characters" }),
  adminEmail: z.string().email({ message: "Please enter a valid email address" }),
  defaultLanguage: z.string(),
  timeZone: z.string(),
});

const securitySchema = z.object({
  requireMfa: z.boolean(),
  sessionTimeout: z.string(),
  passwordExpiration: z.string(),
  failedLoginAttempts: z.string(),
});

const notificationSchema = z.object({
  adminAlerts: z.boolean(),
  farmerRegistrations: z.boolean(),
  systemUpdates: z.boolean(),
  securityAlerts: z.boolean(),
});

const backupSchema = z.object({
  autoBackup: z.boolean(),
  backupFrequency: z.string(),
  storageLocation: z.string(),
  retentionPeriod: z.string(),
});

const AdminSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const generalForm = useForm({
    resolver: zodResolver(generalSchema),
    defaultValues: {
      systemName: "AgriNavigator Farm Management System",
      adminEmail: "admin@agrimanagement.com",
      defaultLanguage: "english",
      timeZone: "UTC-5",
    },
  });

  const securityForm = useForm({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      requireMfa: true,
      sessionTimeout: "30",
      passwordExpiration: "90",
      failedLoginAttempts: "5",
    },
  });

  const notificationForm = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      adminAlerts: true,
      farmerRegistrations: true,
      systemUpdates: true,
      securityAlerts: true,
    },
  });

  const backupForm = useForm({
    resolver: zodResolver(backupSchema),
    defaultValues: {
      autoBackup: true,
      backupFrequency: "daily",
      storageLocation: "cloud",
      retentionPeriod: "30",
    },
  });

  const onGeneralSubmit = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("General settings:", data);
      toast({
        title: "Settings updated",
        description: "Your system settings have been updated successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const onSecuritySubmit = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("Security settings:", data);
      toast({
        title: "Security settings updated",
        description: "Your security settings have been updated successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const onNotificationSubmit = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("Notification settings:", data);
      toast({
        title: "Notification settings updated",
        description: "Your notification settings have been updated successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };

  const onBackupSubmit = (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("Backup settings:", data);
      toast({
        title: "Backup settings updated",
        description: "Your backup settings have been updated successfully.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">System Settings</h1>
        <p className="text-muted-foreground">
          Configure and manage the farm management system
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="space-x-1">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Backup & Recovery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                  <FormField
                    control={generalForm.control}
                    name="systemName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>System Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the name displayed throughout the application
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name="adminEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Primary contact email for administrative notifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={generalForm.control}
                      name="defaultLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="spanish">Spanish</SelectItem>
                              <SelectItem value="french">French</SelectItem>
                              <SelectItem value="german">German</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Default language for the system interface
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="timeZone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>System Time Zone</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time zone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                              <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                              <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                              <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                              <SelectItem value="UTC+0">UTC</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Used for scheduling and timestamps
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Branding</CardTitle>
              <CardDescription>
                Customize the look and feel of the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormLabel>Logo</FormLabel>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 border rounded-md flex items-center justify-center bg-muted">
                      <Globe className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <Button variant="outline" size="sm">Upload New Logo</Button>
                  </div>
                  <FormDescription>
                    Recommended size: 200x200px. PNG or SVG format.
                  </FormDescription>
                </div>
                <Separator />
                <div className="space-y-2">
                  <FormLabel>Theme Colors</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    <div className="w-8 h-8 rounded-full bg-farm-forest border cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-farm-green border cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-farm-wheat border cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-blue-500 border cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-500 border cursor-pointer"></div>
                    <div className="w-8 h-8 rounded-full bg-black border cursor-pointer"></div>
                  </div>
                  <FormDescription>
                    Click to select a primary color for the system.
                  </FormDescription>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure system security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                  <FormField
                    control={securityForm.control}
                    name="requireMfa"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Require MFA for Admins</FormLabel>
                          <FormDescription>
                            Enforce multi-factor authentication for all administrator accounts
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={securityForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Timeout (minutes)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Inactive session expiration time
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="passwordExpiration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password Expiration (days)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            How often passwords must be changed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="failedLoginAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Failed Login Attempts</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Maximum attempts before lockout
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Security Settings"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>API Security</CardTitle>
              <CardDescription>
                Manage API keys and access control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">API Access</p>
                    <p className="text-sm text-muted-foreground">Enable or disable external API access</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div>
                  <FormLabel>API Keys</FormLabel>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">Production Key</p>
                        <p className="text-xs text-muted-foreground">Created: May 15, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">Development Key</p>
                        <p className="text-xs text-muted-foreground">Created: June 2, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">Regenerate</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure which notifications the system sends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <FormField
                    control={notificationForm.control}
                    name="adminAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Admin Alerts</FormLabel>
                          <FormDescription>
                            Critical system alerts for administrators
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="farmerRegistrations"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Farmer Registrations</FormLabel>
                          <FormDescription>
                            Notifications when new farmers register
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="systemUpdates"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">System Updates</FormLabel>
                          <FormDescription>
                            Notifications about system maintenance and updates
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="securityAlerts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Security Alerts</FormLabel>
                          <FormDescription>
                            Notifications about suspicious login attempts and security breaches
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Notification Settings"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Customize system email notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Select defaultValue="welcome">
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome Email</SelectItem>
                    <SelectItem value="password-reset">Password Reset</SelectItem>
                    <SelectItem value="account-verification">Account Verification</SelectItem>
                    <SelectItem value="system-alert">System Alert</SelectItem>
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <FormLabel>Subject</FormLabel>
                  <Input defaultValue="Welcome to AgriNavigator Farm Management System" />
                </div>
                <div className="space-y-2">
                  <FormLabel>Content</FormLabel>
                  <Textarea className="min-h-[200px]" defaultValue="Dear {name},

Thank you for joining AgriNavigator Farm Management System. We're excited to help you manage your farm more efficiently.

To get started, please verify your email by clicking the button below:

{verification_button}

If you have any questions, please don't hesitate to contact our support team.

Best regards,
The AgriNavigator Team" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Preview</Button>
                  <Button>Save Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Recovery</CardTitle>
              <CardDescription>
                Configure system backup settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...backupForm}>
                <form onSubmit={backupForm.handleSubmit(onBackupSubmit)} className="space-y-6">
                  <FormField
                    control={backupForm.control}
                    name="autoBackup"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Automatic Backups</FormLabel>
                          <FormDescription>
                            Enable scheduled automatic backups
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={backupForm.control}
                      name="backupFrequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Backup Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How often automatic backups are performed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={backupForm.control}
                      name="storageLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="local">Local Server</SelectItem>
                              <SelectItem value="cloud">Cloud Storage</SelectItem>
                              <SelectItem value="both">Both (Local & Cloud)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Where backup files are stored
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={backupForm.control}
                    name="retentionPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Retention Period (days)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          How long backup files are kept before automatic deletion
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Backup Settings"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Manual Backup & Restore</CardTitle>
              <CardDescription>
                Manually backup or restore your system data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Create Backup</p>
                      <p className="text-sm text-muted-foreground">Generate a complete system backup now</p>
                    </div>
                    <Button>
                      <Database className="mr-2 h-4 w-4" />
                      Backup Now
                    </Button>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-medium">Restore From Backup</p>
                    <p className="text-sm text-muted-foreground mb-2">Select a backup file to restore</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">Daily Backup</p>
                          <p className="text-xs text-muted-foreground">June 15, 2023 - 02:30 AM</p>
                        </div>
                        <Button variant="outline">Restore</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">Weekly Backup</p>
                          <p className="text-xs text-muted-foreground">June 10, 2023 - 03:00 AM</p>
                        </div>
                        <Button variant="outline">Restore</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div>
                          <p className="font-medium">Manual Backup</p>
                          <p className="text-xs text-muted-foreground">June 5, 2023 - 11:45 AM</p>
                        </div>
                        <Button variant="outline">Restore</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
