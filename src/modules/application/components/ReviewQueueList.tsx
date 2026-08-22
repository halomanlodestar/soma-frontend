import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReviewApplication } from "@/modules/application/types/creator-review";

export function ReviewQueueList({
  applications,
  selectedApplicationId,
  onSelect,
}: {
  applications: ReviewApplication[];
  selectedApplicationId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="border-y border-border lg:border-y-0 lg:border-r lg:pr-6">
      <div className="flex items-center justify-between py-3">
        <p className="text-sm font-medium">Queue</p>
        <Badge variant="secondary">{applications.length}</Badge>
      </div>
      <div className="border-t border-border">
        {applications.map((application) => {
          const isSelected = application.id === selectedApplicationId;
          return (
            <Button
              key={application.id}
              type="button"
              variant={isSelected ? "secondary" : "ghost"}
              onClick={() => onSelect(application.id)}
              className={cn(
                "h-auto w-full justify-start rounded-none px-3 py-4 text-left",
                isSelected && "text-secondary-foreground",
              )}
            >
              <span className="flex min-w-0 flex-col items-start gap-1">
                <span className="truncate text-sm font-medium">
                  Applicant {application.applicantId.slice(0, 8)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Submitted {format(new Date(application.createdAt), "d MMM")}
                </span>
              </span>
            </Button>
          );
        })}
      </div>
    </aside>
  );
}
