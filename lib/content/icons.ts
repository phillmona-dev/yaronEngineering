import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Cctv,
  Cloud,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Lock,
  Network,
  Radio,
  Server,
  ShieldCheck,
  Wifi,
} from "lucide-react";

/** Icons an editor can pick for a service. Keys are stored in content; never rename one. */
export const SERVICE_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  network: { icon: Network, label: "Network" },
  server: { icon: Server, label: "Server / data center" },
  briefcase: { icon: Briefcase, label: "Consultancy" },
  shield: { icon: ShieldCheck, label: "Security shield" },
  cloud: { icon: Cloud, label: "Cloud" },
  storage: { icon: HardDrive, label: "Storage" },
  cctv: { icon: Cctv, label: "CCTV camera" },
  database: { icon: Database, label: "Database" },
  lock: { icon: Lock, label: "Lock" },
  wifi: { icon: Wifi, label: "Wi-Fi" },
  cpu: { icon: Cpu, label: "Compute" },
  globe: { icon: Globe, label: "Globe" },
  radio: { icon: Radio, label: "Telecom" },
};

export function serviceIcon(key: string | undefined): LucideIcon {
  return (key && SERVICE_ICONS[key]?.icon) || Network;
}
