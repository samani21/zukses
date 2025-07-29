import MyStoreLayout from "pages/layouts/MyStoreLayout";
import { useShopProfile } from "components/my-store/ShopProfileContext";
import BankAccount from "components/my-store/bank/BankAccount";
function PageContent() {
    const shopProfil = useShopProfile();
    return (
        <div className="min-h-screen font-sans text-gray-800">
            <main className="">
                {/* Header */}
                <BankAccount shopProfil={shopProfil} />

            </main>
        </div>
    );
}

export default function BankPage() {
    return (
        <MyStoreLayout>
            <PageContent />
        </MyStoreLayout>
    );
}
