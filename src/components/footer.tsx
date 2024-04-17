import Link from "next/link";
import { getServerSettingsOrInit } from "@/lib/settings";

export async function Footer() {
    const serverSettings = await getServerSettingsOrInit();

    const { footerEnabled } = serverSettings;

    if (footerEnabled) return (
        <div className="sticky bottom-0 px-2 py-4 border-t-2">
            <p>this server is using <Link href="https://github.com/thatgurkangurk/yals" className="underline text-primary underline-offset-4">yals</Link></p>
        </div>
    );
    else return <></>
}