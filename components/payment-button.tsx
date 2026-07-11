import { AUTHORIZE_NET_ACTION } from "@/lib/data";

interface PaymentButtonProps {
  linkId: string;
  label: string;
  variant?: "solid" | "outline";
  className?: string;
}

export function PaymentButton({
  linkId,
  label,
  variant = "solid",
  className = "",
}: PaymentButtonProps) {
  const base =
    "inline-flex w-full items-center justify-center rounded-md px-6 py-3 text-sm font-semibold tracking-wide uppercase transition-colors";
  const solid =
    "bg-gold-600 text-navy-900 hover:bg-gold-700 shadow-sm";
  const outline =
    "border-2 border-gold-600 text-gold-700 hover:bg-gold-50";

  return (
    <form
      method="post"
      action={AUTHORIZE_NET_ACTION}
      className={className}
    >
      <input type="hidden" name="LinkId" value={linkId} />
      <button
        type="submit"
        className={`${base} ${variant === "solid" ? solid : outline}`}
      >
        {label}
      </button>
    </form>
  );
}
