import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SomaOption = { id: string; name: string };

export function ReviewQueueHeader({
  somas,
  somaId,
  onSomaChange,
}: {
  somas: SomaOption[];
  somaId: string;
  onSomaChange: (somaId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">
          Creator review
        </p>
        <h1 className="mt-2 font-heading text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
          Review with care.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Consider the work, process, and fit for each Soma—not just a single
          signal.
        </p>
      </div>
      <div className="w-full sm:w-64">
        <Select value={somaId} onValueChange={onSomaChange}>
          <SelectTrigger aria-label="Choose a Soma review queue">
            <SelectValue placeholder="Choose a Soma" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {somas.map((soma) => (
                <SelectItem key={soma.id} value={soma.id}>
                  {soma.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
