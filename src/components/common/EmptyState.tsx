import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, description, action }: { title: string, description: string, action?: { label: string, onClick: () => void } }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-md bg-slate-50 border-dashed">
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  );
}
