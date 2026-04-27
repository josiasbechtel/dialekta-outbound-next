export const navItems = [
  { href: "/setup", label: "Setup", icon: "fa-solid fa-play-circle" },
  { href: "/live", label: "Live", icon: "fa-solid fa-headset" },
  { href: "/sales", label: "Vertrieb", icon: "fa-solid fa-user-tie", badge: true },
  {
    href: "/appointments",
    label: "Termine",
    icon: "fa-regular fa-calendar-check",
    badge: true,
  },
  { href: "/analytics", label: "Analytics", icon: "fa-solid fa-chart-pie" },
] as const;
