import { editorialTeamName, formatEditorialDate } from "@/lib/editorial";

type EditorialMetaProps = {
  reviewedAt: string;
  className?: string;
};

export default function EditorialMeta({
  reviewedAt,
  className,
}: EditorialMetaProps) {
  return (
    <div
      className={`rounded-2xl border border-stroke/80 bg-white/70 px-4 py-3 text-sm text-muted ${
        className ?? ""
      }`}
    >
      <p className="text-xs uppercase tracking-[0.3em] text-muted">
        Editorial review
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <span>Reviewed by {editorialTeamName}</span>
        <span>Updated {formatEditorialDate(reviewedAt)}</span>
      </div>
    </div>
  );
}
