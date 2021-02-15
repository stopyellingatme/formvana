<script lang="ts">
    import Avatar from "../../Avatar.svelte";
    import { dashboard } from "../../../stores/dashboard.store";
</script>

<div
    class="pr-4 bg-gray-50 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0">
    <div class="pl-6 lg:w-80">
        <div class="pt-6 pb-2">
            <h2 class="text-sm font-semibold">Activity</h2>
        </div>
        <div>
            <ul class="divide-y divide-gray-200">
                {#each $dashboard.feedList as item, i}
                    <li class="py-4">
                        <div class="flex space-x-3">
                            {#if item.icon}{item.icon}{/if}
                            <!-- <Avatar w={6} h={6} srcUrl={item}/> -->
                            <div class="flex-1 space-y-1">
                                <div class="flex items-center justify-between">
                                    <h3 class="text-sm font-medium">
                                        {item.header}
                                    </h3>
                                    <p class="text-sm text-gray-500">
                                        {item.sub_header}
                                    </p>
                                </div>
                                <p class="text-sm text-gray-500">
                                    {item.detail}
                                </p>
                            </div>
                        </div>
                    </li>
                {/each}

                <!-- More items... -->
            </ul>
            <div class="py-4 text-sm border-t border-gray-200">
                <a
                    href="#/home"
                    class="font-semibold text-indigo-600 hover:text-indigo-900">View
                    all activity
                    <span aria-hidden="true">&rarr;</span></a>
            </div>
        </div>
    </div>
</div>
