import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold font-headline text-foreground mb-4">
                Settings
            </h1>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="text-primary" />
                        Application Settings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Settings and configuration options will be available here soon.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
