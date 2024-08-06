import {
  App,
  Language,
  NavItem,
  Notification,
  Profile,
  QuickLink,
} from "@app/layouts/full/full.types";

export const themeConstants = {
  DARK_THEME: "dark",
  LIGHT_THEME: "light",
  LIGHT_THEME_CLASS: "light-theme",
  DARK_THEME_CLASS: "dark-theme",
};

export const colorThemeConstants = {
  Orange: "orange_theme",
  Blue: "blue_theme",
  Aqua: "aqua_theme",
  Purple: "purple_theme",
  Green: "green_theme",
  Cyan: "cyan_theme",
};

export const screenViewConstants = {
  MOBILE_VIEW: "screen and (max-width: 768px)",
  TABLET_VIEW: "screen and (min-width: 769px) and (max-width: 1024px)",
  MONITOR_VIEW: "screen and (min-width: 1024px)",
  BELOW_MONITOR: "screen and (max-width: 1023px)",
};

export const navItemVerticalConstants: NavItem[] = [
  {
    displayName: "Starter",
    iconName: "home",
    route: "/",
  },

  {
    displayName: "Starter",
    iconName: "home",
    route: "/",
  },
];

export const navItemHorizontalConstants: NavItem[] = [
  {
    navCap: "Homef",
  },
];

export const appConstants: App[] = [
  {
    id: 1,
    img: "/assets/images/svgs/icon-dd-chat.svg",
    title: "Chat Application",
    subtitle: "Messages & Emails",
    link: "/",
  },
  {
    id: 2,
    img: "/assets/images/svgs/icon-dd-cart.svg",
    title: "eCommerce App",
    subtitle: "Buy a Product",
    link: "/",
  },
  {
    id: 3,
    img: "/assets/images/svgs/icon-dd-invoice.svg",
    title: "Invoice App",
    subtitle: "Get latest invoice",
    link: "/",
  },
  {
    id: 4,
    img: "/assets/images/svgs/icon-dd-date.svg",
    title: "Calendar App",
    subtitle: "Get Dates",
    link: "/",
  },
  {
    id: 5,
    img: "/assets/images/svgs/icon-dd-mobile.svg",
    title: "Contact Application",
    subtitle: "2 Unsaved Contacts",
    link: "/",
  },
  {
    id: 6,
    img: "/assets/images/svgs/icon-dd-lifebuoy.svg",
    title: "Tickets App",
    subtitle: "Create new ticket",
    link: "/",
  },
  {
    id: 7,
    img: "/assets/images/svgs/icon-dd-message-box.svg",
    title: "Email App",
    subtitle: "Get new emails",
    link: "/",
  },
  {
    id: 8,
    img: "/assets/images/svgs/icon-dd-application.svg",
    title: "Courses",
    subtitle: "Create new course",
    link: "/",
  },
];

export const sidebarItemConstants: NavItem[] = [
  {
    navCap: "Home",
  },
  {
    displayName: "Starter",
    iconName: "home",
    route: "/starter",
  },
  {
    navCap: "Other",
  },
  {
    displayName: "Menu Level",
    iconName: "box-multiple",
    route: "/menu-level",
    children: [
      {
        displayName: "Menu 1",
        iconName: "point",
        route: "/menu-1",
        children: [
          {
            displayName: "Menu 1",
            iconName: "point",
            route: "/menu-1",
          },

          {
            displayName: "Menu 2",
            iconName: "point",
            route: "/menu-2",
          },
        ],
      },

      {
        displayName: "Menu 2",
        iconName: "point",
        route: "/menu-2",
      },
    ],
  },
  {
    displayName: "Disabled",
    iconName: "ban",
    route: "/disabled",
    disabled: true,
  },
  {
    displayName: "Chip",
    iconName: "mood-smile",
    route: "/",
    chip: true,
    chipClass: "bg-primary text-white",
    chipContent: "9",
  },
  {
    displayName: "Outlined",
    iconName: "mood-smile",
    route: "/",
    chip: true,
    chipClass: "b-1 border-primary text-primary",
    chipContent: "outlined",
  },
  {
    displayName: "External Link",
    iconName: "star",
    route: "https://www.google.com/",
    external: true,
  },
];

export const languageConstants: Language[] = [
  {
    language: "English",
    code: "en",
    type: "US",
    icon: "/assets/images/flag/icon-flag-en.svg",
  },
  {
    language: "Thailand",
    code: "th",
    icon: "/assets/images/flag/icon-flag-es.svg",
  },
];
export const notificationConstants: Notification[] = [
  {
    id: 1,
    img: "/assets/images/profile/user-1.jpg",
    title: "Roman Joined the Team!",
    subtitle: "Congratulate him",
  },
  {
    id: 2,
    img: "/assets/images/profile/user-2.jpg",
    title: "New message received",
    subtitle: "Salma sent you new message",
  },
  {
    id: 3,
    img: "/assets/images/profile/user-3.jpg",
    title: "New Payment received",
    subtitle: "Check your earnings",
  },
  {
    id: 4,
    img: "/assets/images/profile/user-4.jpg",
    title: "Jolly completed tasks",
    subtitle: "Assign her new tasks",
  },
  {
    id: 5,
    img: "/assets/images/profile/user-5.jpg",
    title: "Roman Joined the Team!",
    subtitle: "Congratulate him",
  },
];
export const profileConstants: Profile[] = [
  {
    id: 1,
    img: "/assets/images/svgs/icon-account.svg",
    title: "My Profile",
    subtitle: "Account Settings",
    link: "/",
  },
  {
    id: 2,
    img: "/assets/images/svgs/icon-inbox.svg",
    title: "My Inbox",
    subtitle: "Messages & Email",
    link: "/",
  },
  {
    id: 3,
    img: "/assets/images/svgs/icon-tasks.svg",
    title: "My Tasks",
    subtitle: "To-do and Daily Tasks",
    link: "/",
  },
];

export const quickLinkConstants: QuickLink[] = [
  {
    id: 1,
    title: "Pricing Page",
    link: "/t",
  },
  {
    id: 2,
    title: "Authentication Design",
    link: "/",
  },
  {
    id: 3,
    title: "Register Now",
    link: "/",
  },
  {
    id: 4,
    title: "404 Error Page",
    link: "/",
  },
  {
    id: 5,
    title: "Notes App",
    link: "/",
  },
  {
    id: 6,
    title: "Employee App",
    link: "/",
  },
  {
    id: 7,
    title: "Todo Application",
    link: "/",
  },
  {
    id: 8,
    title: "Treeview",
    link: "/",
  },
];
