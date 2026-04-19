interface StatBadgeProps {
  bg: string;
  text: string;
  label?: string;
  labelColor?: string;
  bold?: boolean;
  truncate?: boolean;
  children: React.ReactNode;
}

export function StatBadge({
  bg,
  text,
  label,
  labelColor = "",
  bold = false,
  truncate = false,
  children,
}: StatBadgeProps) {
  if (label) {
    return (
      <div className={`flex w-28 lg:w-36 items-center justify-between rounded-xl ${bg} px-3 py-1`}>
        <span className={`font-galmuri text-[10px] ${labelColor} whitespace-nowrap`}>{label}</span>
        <span
          className={`font-galmuri text-[10px] font-medium ${text} whitespace-nowrap${truncate ? " overflow-hidden text-ellipsis" : ""}`}
        >
          {children}
        </span>
      </div>
    );
  }
  return (
    <div className={`flex w-28 lg:w-36 items-center justify-center rounded-xl ${bg} ${text} px-3 py-1`}>
      <span
        className={`font-galmuri text-[10px]${bold ? " font-medium" : ""}${truncate ? " whitespace-nowrap overflow-hidden text-ellipsis" : " whitespace-nowrap"}`}
      >
        {children}
      </span>
    </div>
  );
}
