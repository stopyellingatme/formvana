<script lang="ts">
    import DashboardActionButtons from "./DashboardActionButtons.svelte";
    import Avatar from "../../Avatar.svelte";
    import { dashboard, hanldeActions } from "../../../stores/dashboard.store";
    import { onMount } from "svelte";

    onMount(() => {
        dashboard.setAccountData();
    });
</script>

{#if $dashboard.accountData}
    <div
        class="bg-white xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-gray-200">
        <div class="py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
            <div class="flex items-center justify-between">
                <div class="flex-1 space-y-8">
                    <div
                        class="space-y-8 sm:space-y-0 sm:flex sm:justify-between sm:items-center xl:block xl:space-y-8">
                        <!-- Profile -->
                        <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0 w-12 h-12">
                                <Avatar w={12} h={12} />
                            </div>
                            <div class="space-y-1">
                                <div class="text-sm font-medium text-gray-900">
                                    {$dashboard.accountData.name}
                                </div>
                                <!-- Probably gonna put role info here -->
                                <div
                                    class="group flex items-center space-x-2.5">
                                    <svg
                                        class="w-5 h-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 22 22"
                                        stroke="currentColor">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                    <span
                                        class="text-sm font-medium text-gray-500 capitalize">{$dashboard.accountData.type.toLowerCase()}</span>
                                </div>
                            </div>
                        </div>
                        <!-- Action buttons -->
                        <DashboardActionButtons
                            on:click={(e) => hanldeActions(e.detail)}
                            buttons={$dashboard.actions} />
                    </div>
                    <!-- Meta info -->
                    <div
                        class="flex flex-col space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-6">
                        <div class="flex items-center space-x-2">
                            <!-- Heroicon name: badge-check -->
                            <svg
                                class="w-5 h-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true">
                                <path
                                    fill-rule="evenodd"
                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span
                                class="text-sm font-medium text-gray-500">Store
                                Location</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <!-- Heroicon name: collection -->
                            <svg
                                class="w-5 h-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true">
                                <path
                                    d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                            <span class="text-sm font-medium text-gray-500">#
                                Search Results</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
