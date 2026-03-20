/**
 * EmptyState – shown when a list has 0 items.
 * Props: icon, title, message, action (JSX)
 */
export default function EmptyState({ icon = "📭", title = "Nothing here yet", message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <span className="text-5xl mb-4 opacity-70">{icon}</span>
      <h3 className="text-dart-text font-semibold text-lg mb-1">{title}</h3>
      {message && <p className="text-dart-muted text-sm max-w-xs">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
