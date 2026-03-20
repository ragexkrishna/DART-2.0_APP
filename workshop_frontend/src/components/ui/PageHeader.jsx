/**
 * PageHeader – consistent top of every inner page.
 * Props: title, subtitle, actions (JSX node)
 */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-dart-text tracking-tight">{title}</h1>
        {subtitle && <p className="text-dart-muted text-sm mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
    </div>
  );
}
