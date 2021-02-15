<script lang="ts">
    import { userSettings } from "../../../stores/user.settings.store";

    const handleLinkClick = (e, path) => {
        e.preventDefault();
        userSettings.setActivePath(path);
    };
</script>

<aside class="px-2 py-6 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
    <nav class="space-y-1">
        {#each $userSettings.sidebarLinks as link, i}
            {#if link.active}
                <a
                    href="#/settings"
                    on:click={(e) => handleLinkClick(e, link.path)}
                    class="flex items-center px-3 py-2 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-md hover:bg-indigo-50 group"
                    aria-current="page">
                    <svg
                        class="flex-shrink-0 w-6 h-6 mr-3 -ml-1 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true">
                        {@html link.icon}
                    </svg>
                    <span class="truncate"> {link.label} </span>
                </a>
            {:else}
                <a
                    href="#/settings"
                    on:click={(e) => handleLinkClick(e, link.path)}
                    class="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md hover:text-gray-900 hover:bg-indigo-50 group">
                    <svg
                        class="flex-shrink-0 w-6 h-6 mr-3 -ml-1 text-gray-400 group-hover:text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true">
                        {@html link.icon}
                    </svg>
                    <span class="truncate"> {link.label} </span>
                </a>
            {/if}
        {/each}
    </nav>
</aside>
