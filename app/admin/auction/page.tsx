import { redirect } from "next/navigation";

export default function AuctionAdminRedirectPage() {
  redirect("/admin/marketplace");
}
