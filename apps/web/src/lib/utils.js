export function formatDate(date) {
    if (!date) return "-";

    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}

export function formatMoney(value) {
    if (value === null || value === undefined || value === "") {
        return "-";
    }

    return `₹${Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export
    function StatusBadge({ status }) {
    const active = status === "ACTIVE";

    return (
        <span
            className={`
        inline-flex items-center gap-1.5
        rounded-full px-2.5 py-1
        text-xs font-medium
        ${active
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-destructive/10 text-destructive"
                }
      `}
        >
            <span
                className={`
          h-1.5 w-1.5 rounded-full
          ${active ? "bg-emerald-500" : "bg-destructive"}
        `}
            />

            {status}
        </span>
    );
}