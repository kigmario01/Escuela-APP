export function KPICard({ title, value, icon, trend }: { title: string; value: string | number; icon?: any; trend?: string }) {
  const Icon = icon;
  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {trend && <p className="text-xs text-green-600 mt-1">{trend}</p>}
    </div>
  );
}
