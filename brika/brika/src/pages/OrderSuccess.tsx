import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function OrderSuccess() {
  const { id } = useParams();
  const { settings } = useSettings();
  return (
    <div className="wrap py-28 text-center">
      <CheckCircle2 size={56} className="mx-auto text-azur" />
      <h1 className="display mt-6 text-3xl font-extrabold sm:text-4xl">Order placed</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Thank you for shopping with {settings.store_name}. We've received your order and will call
        you shortly to confirm. You'll pay on delivery.
      </p>
      {id && (
        <p className="mt-4 text-sm text-muted">
          Order reference: <span className="font-mono text-ink">{id.slice(0, 8).toUpperCase()}</span>
        </p>
      )}
      <Link to="/shop" className="mt-8 inline-block btn-primary">Continue shopping</Link>
    </div>
  );
}
