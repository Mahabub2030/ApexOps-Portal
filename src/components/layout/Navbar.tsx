import {
  BookMarkedIcon,
  CalendarClockIcon,
  FolderKanbanIcon,
  GlobeIcon,
  HomeIcon,
  MenuIcon,
  ShoppingCartIcon,
  SquarePenIcon,
} from "lucide-react";
import { useId, useState } from "react";
import { Link, useLocation } from "react-router"; // or "react-router-dom"

import Logo from "@/components/logo";
import UserMenu from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "./ModeToggler";

const navigationLinks = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/jcc", icon: SquarePenIcon, label: "JCC" },
  { href: "/ir", icon: BookMarkedIcon, label: "IR" },
  { href: "/ncr", icon: SquarePenIcon, label: "NCR" },
  { href: "/Wopr", icon: ShoppingCartIcon, label: "WO&PR Home" },
  {
    href: "/timesheet",
    icon: CalendarClockIcon,
    label: "Timesheet (Sr. Mgr.)",
  },
  { href: "/catalogs", icon: FolderKanbanIcon, label: "Catalogs" },
];

const languages = [
  { label: "En", value: "en" },
  { label: "Ar", value: "ar" },
];

type NavbarProps = {
  activeNav?: string;
  onSelectNav?: (label: string) => void;
};

export default function Navbar({ activeNav, onSelectNav }: NavbarProps) {
  const id = useId();
  const { pathname } = useLocation();
  const [language, setLanguage] = useState("en");
  const [mobileOpen, setMobileOpen] = useState(false);

  const checkIsActive = (href: string, label: string) => {
    if (activeNav) return activeNav === label;
    if (href === "/") return pathname === "/";
    return pathname.toLowerCase().startsWith(href.toLowerCase());
  };

  return (
    <header className="w-full border-b bg-background">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-[#58377a] via-[#7c5f99] to-[#dcd4e6] dark:from-indigo-950 dark:via-purple-950 dark:to-purple-900/70 text-white">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between gap-2 px-3 sm:px-6">
          {/* Left side: Mobile menu trigger + Logo & Dammam Airports */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Popover open={mobileOpen} onOpenChange={setMobileOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle navigation menu"
                  className="md:hidden shrink-0 text-white hover:bg-white/15 hover:text-white"
                >
                  <MenuIcon size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1.5 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-stretch gap-0.5">
                    {navigationLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = checkIsActive(link.href, link.label);
                      return (
                        <NavigationMenuItem className="w-full" key={link.label}>
                          <NavigationMenuLink asChild active={isActive}>
                            <Link
                              to={link.href}
                              onClick={() => {
                                onSelectNav?.(link.label);
                                setMobileOpen(false);
                              }}
                              className={`flex flex-row items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                                isActive
                                  ? "bg-[#58377a]/15 font-semibold text-[#3b1d68] dark:bg-purple-500/20 dark:text-purple-200"
                                  : "text-foreground hover:bg-accent"
                              }`}
                            >
                              <Icon
                                aria-hidden="true"
                                className="text-[#3b1d68] dark:text-purple-300 shrink-0"
                                size={16}
                              />
                              <span className="truncate">{link.label}</span>
                            </Link>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>

            <Link
              to="/"
              onClick={() => onSelectNav?.("Home")}
              className="flex items-center gap-2.5 font-semibold tracking-tight text-white hover:opacity-90 shrink-0"
            >
              <Logo />
              <span className="text-base sm:text-xl font-bold tracking-normal text-white">
                Dammam Airports
              </span>
            </Link>
          </div>

          {/* Right side: Theme toggle + Language selector + User menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-foreground shrink-0">
            <div className="rounded-md bg-background/85 text-foreground backdrop-blur-xs">
              <ModeToggle />
            </div>

            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger
                aria-label="Select language"
                className="h-8 w-auto gap-1.5 rounded-md border-none bg-background/85 px-2 text-xs sm:text-sm text-foreground shadow-none backdrop-blur-xs hover:bg-background [&>svg]:shrink-0 [&>svg]:text-muted-foreground"
                id={`language-${id}`}
              >
                <GlobeIcon aria-hidden="true" size={15} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <span className="flex items-center gap-2">
                      <span className="truncate">{lang.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center rounded-full bg-background/90 px-1.5 py-0.5 text-foreground shadow-xs">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Bar (Tablet & Desktop) */}
      <div className="hidden md:block bg-[#f3f3f5] dark:bg-muted/40 border-b">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-11 items-center justify-between gap-4 overflow-x-auto">
            <NavigationMenu className="max-w-none justify-start">
              <NavigationMenuList className="gap-1 lg:gap-3">
                <TooltipProvider>
                  {navigationLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = checkIsActive(link.href, link.label);
                    return (
                      <NavigationMenuItem key={link.label}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <NavigationMenuLink asChild active={isActive}>
                              <Link
                                to={link.href}
                                onClick={() => onSelectNav?.(link.label)}
                                className={`relative flex h-9 flex-row items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-xs lg:text-sm font-semibold transition-colors ${
                                  isActive
                                    ? "bg-[#58377a]/12 text-[#2c1352] dark:bg-purple-500/20 dark:text-purple-200 ring-1 ring-[#58377a]/25"
                                    : "text-[#3b1d68]/80 dark:text-muted-foreground hover:bg-black/5 dark:hover:bg-accent/60 hover:text-[#2c1352] dark:hover:text-foreground"
                                }`}
                              >
                                <Icon
                                  aria-hidden="true"
                                  className="shrink-0 text-[#3b1d68] dark:text-purple-300"
                                  size={16}
                                />
                                <span className="hidden lg:inline">
                                  {link.label}
                                </span>
                                <span className="sr-only lg:hidden">
                                  {link.label}
                                </span>
                              </Link>
                            </NavigationMenuLink>
                          </TooltipTrigger>
                          <TooltipContent
                            className="px-2 py-1 text-xs lg:hidden"
                            side="bottom"
                          >
                            <p>{link.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      </NavigationMenuItem>
                    );
                  })}
                </TooltipProvider>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
