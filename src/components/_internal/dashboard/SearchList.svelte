<script>
    import { dashboard, loadSearchList } from "../../../stores/dashboard.store";
    import { onMount } from "svelte";
    import auth from "../../../stores/auth.store";
    import SearchListHeader from "./SearchListHeader.svelte";
    import { shell } from "../../../stores/shell.store";
    import SearchListItem from "./SearchListItem.svelte";

    onMount(() => {
        loadSearchList($auth.auth_user);
    });

    $: search_results = $dashboard.searchList.filter((item) =>
        `${item[$dashboard.sortField]}`
            .toLowerCase()
            .includes($shell.searchTerm)
    );
</script>

<div class="bg-white lg:min-w-0 lg:flex-1">
    <!-- Search Header Area -->
    <SearchListHeader />
    <!-- Search Result List -->
    <ul class="relative z-0 border-b border-gray-200 divide-y divide-gray-200">
        {#each search_results as item}
            <SearchListItem {item} />
        {/each}
    </ul>
</div>
