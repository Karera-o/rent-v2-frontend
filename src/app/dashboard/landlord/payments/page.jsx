import LandlordPayments from "@/components/dashboard/LandlordPayments";

export const metadata = {
  title: "Payments | Landlord Dashboard",
  description: "Manage and track payments for your properties",
};

export default function PaymentsPage() {
  return <LandlordPayments />;
}