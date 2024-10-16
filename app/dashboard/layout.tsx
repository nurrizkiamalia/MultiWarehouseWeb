'use client'
import {ReactNode, useEffect} from "react";
import DashboardSidebar from "app/dashboard/components/DashboardSidebar";
import DashboardHeader from "app/dashboard/components/DashboardHeader";
import DashboardMobileHeader from "app/dashboard/components/DashboardMobileHeader";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import useDashboardStore from "@/stores/useDashboardStore";

const DashboardLayout = ({
        children
    }: Readonly<{
        children: ReactNode
    }>) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const setWarehouse = useDashboardStore(state => state.setWarehouse)
    const setIsAdmin = useDashboardStore(state => state.setIsAdmin)

    useEffect(() => {
        if (status === "authenticated") {
            if (session?.user?.warehouseId && session.user.warehouseName) {
                setWarehouse({
                    id: session.user.warehouseId,
                    name: session.user.warehouseName
                })
                setIsAdmin(session.user.role === "ADMIN")
            }
            if (session.user?.role !== "ADMIN" && session.user?.role !== "WAREHOUSE_ADMIN") {
                router.push("/");
            }
        } else if (status === "unauthenticated") {
            router.push("/dashboard/sign-in");
        }
    }, [status, session, router, setWarehouse, setIsAdmin]);

    if (status === "loading") {
        return (
            <div className={"flex h-screen justify-center items-center"}>
                <div className={"loader"}></div>
            </div>
        )
    }

    return <main className={"flex"}>
        <DashboardSidebar />
        <div className={"h-full w-full border-l"}>
            <DashboardMobileHeader />
            <DashboardHeader />
            {children}
        </div>
    </main>
}

export default DashboardLayout