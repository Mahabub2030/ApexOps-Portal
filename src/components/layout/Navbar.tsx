import {
  FileTextIcon,
  GlobeIcon,
  HomeIcon,
  LayersIcon,
  MenuIcon,
  UsersIcon,
} from "lucide-react";
import { useId, useState } from "react";

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

// Navigation links
const navigationLinks = [
  { active: true, href: "#", icon: HomeIcon, label: "Dashboard" },
  { href: "#", icon: LayersIcon, label: "Projects" },
  { href: "#", icon: FileTextIcon, label: "Documentation" },
  { href: "#", icon: UsersIcon, label: "Team" },
];

// Language options
const languages = [
  { label: "En", value: "en" },
  { label: "Es", value: "es" },
  { label: "Fr", value: "fr" },
  { label: "De", value: "de" },
  { label: "Ja", value: "ja" },
];

export default function Navbar() {
  const id = useId();
  const [language, setLanguage] = useState("en");

  return (
    <header className="w-full border-b bg-background">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-purple-300/60 dark:from-indigo-950 dark:via-purple-950 dark:to-purple-900/60 text-white">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between gap-2 px-3 sm:px-6">
          {/* Left side: Mobile trigger + Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Popover>
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
              <PopoverContent align="start" className="w-48 p-1.5 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-stretch gap-0.5">
                    {navigationLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <NavigationMenuItem className="w-full" key={link.label}>
                          <NavigationMenuLink
                            active={link.active}
                            className="flex flex-row items-center gap-2.5 rounded-md px-2.5 py-2 text-sm"
                            href={link.href}
                          >
                            <Icon
                              aria-hidden="true"
                              className="text-muted-foreground shrink-0"
                              size={16}
                            />
                            <span className="truncate">{link.label}</span>
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      );
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>

            <a
              className="flex items-center gap-2 font-semibold tracking-tight text-white hover:opacity-90 shrink-0"
              href="#"
            >
              <Logo />
            </a>
          </div>

          {/* Right side: Theme toggle + Language selector + User menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 text-foreground shrink-0">
            <div className="rounded-md bg-background/90 text-foreground backdrop-blur-xs">
              <ModeToggle />
            </div>

            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger
                aria-label="Select language"
                className="h-8 w-auto gap-1.5 rounded-md border-none bg-background/90 px-2 text-xs sm:text-sm text-foreground shadow-none backdrop-blur-xs hover:bg-background [&>svg]:shrink-0 [&>svg]:text-muted-foreground"
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

            <div className="flex items-center rounded-full bg-background/95 px-1.5 py-0.5 text-foreground shadow-xs">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Bar (Tablet & Desktop) */}
      <div className="hidden md:block bg-muted/40 border-t">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-11 items-center justify-between gap-4 overflow-x-auto">
            <NavigationMenu className="max-w-none justify-start">
              <NavigationMenuList className="gap-1 lg:gap-3">
                <TooltipProvider>
                  {navigationLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavigationMenuItem key={link.label}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <NavigationMenuLink
                              active={link.active}
                              className={`flex h-9 flex-row items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors ${
                                link.active
                                  ? "bg-accent text-primary"
                                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                              }`}
                              href={link.href}
                            >
                              <Icon aria-hidden="true" size={17} />
                              {/* Icon-only on md, icon + label on lg+ */}
                              <span className="hidden lg:inline">
                                {link.label}
                              </span>
                              <span className="sr-only lg:hidden">
                                {link.label}
                              </span>
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
