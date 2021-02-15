import { writable } from "svelte/store";
import { quadInOut, circInOut } from 'svelte/easing';
// import { User } from "../../types/user/User";
// import { create, get } from "./users.store";


export const MENU_FLY_IN_CONFIG = { duration: 75, y: -40 };
export const MENU_FLY_OUT_CONFIG = { duration: 50, x: 80 };

export const MENU_SCALE_CONFIG = { duration: 100, delay: 0, opacity: 0.0, start: 1.0, easing: quadInOut };

const sidebarLinks = [
    {
        path: "account", label: "Account", icon: `
    <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    `,
        active: true
    },
    {
        path: "password", label: "Password", icon: `
    <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />`,
        active: false
    },
    {
        path: "notifications", label: "Notifications", icon: `
    <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />`,
        active: false
    }
];

export interface SettingsSidebarLink {
    path: string;
    label: string;
    icon: string;
    active: boolean;
}

export class UserSettingsState {
    activePath: string = "";
    sidebarLinks: SettingsSidebarLink[] = [];
    userData: any = null;
}

function init() {
    let state = new UserSettingsState();
    state.sidebarLinks = sidebarLinks;
    const { subscribe, set, update } = writable(state);

    return {
        subscribe,
        set,
        getUserData: (id) => update((s) => getUserData(s, id)),
        setUserData: (data) => update((s) => setUserData(s, data)),
        setSidebarLinks: (items) => update((s) => setSidebarLinks(s, items)),
        updateState: (updates) => update((s) => updateState(s, updates)),
        setActivePath: (activePath) => update((s) => setActivePath(s, activePath)),
    };
}


const getUserData = (state: UserSettingsState, id) => {
    // get(id).then(data => {
    //     const user = new User(data[0]);
    //     const updates = { userData: user };
    //     console.log(updates);

    //     userSettings.updateState(updates);
    // });
    return state;
};

const setUserData = (state: UserSettingsState, data: any) => {
    state.userData = data;
    return state;
};

const setSidebarLinks = (state: UserSettingsState, links) => {
    state.sidebarLinks = links;
    return state;
};

const setActivePath = (state: UserSettingsState, activePath: string) => {
    let links = state.sidebarLinks, len = links.length, i = 0;
    for (; len > i; ++i) {
        let link = links[i];
        if (link.path === activePath) {
            link.active = true;
        } else {
            link.active = false;
        }
    }
    state.sidebarLinks = links;
    return state;
};

export const userSettings = init();

const updateState = (state: any, updates) => {
    Object.assign(state, updates);
    return state;
};

