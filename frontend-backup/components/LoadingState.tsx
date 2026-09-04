export default function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-stone-500">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-brand-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
