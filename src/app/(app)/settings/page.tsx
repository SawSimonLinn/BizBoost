
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div>
            <PageHeader title="Settings" />
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
