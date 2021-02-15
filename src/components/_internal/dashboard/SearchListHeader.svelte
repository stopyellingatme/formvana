<script>
	import { fly } from "svelte/transition";
	import { clickOutsideMenu } from "../../../utils/directives/clickOutside";
	import { dashboard, loadSearchList } from "../../../stores/dashboard.store";
	import {
		MENU_FLY_IN_CONFIG,
		MENU_FLY_OUT_CONFIG,
	} from "../../../stores/shell.store";
	import { onMount } from "svelte";
	import auth from "../../../stores/auth.store";

	export let header_label = "Results";
	let sort_menu_open = false;

	onMount(() => {
		loadSearchList($auth.auth_user);
	});

	const toggle = () => (sort_menu_open = !sort_menu_open);
	const onOrderChange = (e, order) => {
		e.preventDefault();
		dashboard.toggleSortOrder(order);
		setTimeout(() => {
			toggle();
		}, 100);
	};

	const onSortChange = (e, field) => {
		e.preventDefault();
		dashboard.updateSortField(field);
		setTimeout(() => {
			toggle();
		}, 100);
	};

	$: _sort_display_label = $dashboard.sortMenuOptions.filter(
		(item) => item.key === $dashboard.sortField
	)[0];
	$: sort_display_label = _sort_display_label
		? _sort_display_label.value
		: "";
</script>

<div
	class="pt-4 pb-4 pl-4 pr-6 border-t border-b border-gray-200 sm:pl-6 lg:pl-8 xl:pl-6 xl:pt-6 xl:border-t-0">
	<div class="flex items-center">
		<h1 class="flex-1 text-lg font-medium">{header_label}</h1>
		<div class="relative">
			<button
				on:click={toggle}
				id="sort-menu"
				type="button"
				class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				aria-haspopup="true"
				aria-expanded="false">
				{#if $dashboard.sortOrder === 0}
					<svg
						class="w-5 h-5 mr-3 text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true">
						<path
							d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
					</svg>
				{:else if $dashboard.sortOrder === 1}
					<svg
						class="w-5 h-5 mr-3 text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
					</svg>
				{/if}
				<span class="capitalize">{sort_display_label}</span>
				<!-- Heroicon name: chevron-down -->
				<svg
					class="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true">
					<path
						fill-rule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clip-rule="evenodd" />
				</svg>
			</button>
			{#if sort_menu_open}
				<div
					in:fly={MENU_FLY_IN_CONFIG}
					out:fly={MENU_FLY_OUT_CONFIG}
					use:clickOutsideMenu
					on:click_outside={toggle}
					class="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
					<div
						class="py-1"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="sort-menu">
						{#each $dashboard.sortMenuOptions as { key, value }, i}
							<a
								on:click={(e) => onSortChange(e, key)}
								href="#/home"
								class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
								role="menuitem">{value}</a>
						{/each}
						<a
							on:click={(e) => onOrderChange(e, 0)}
							href="#/home"
							class="flex px-4 py-2 text-sm text-gray-700 border-t border-gray-300 hover:bg-gray-100 hover:text-gray-900"
							role="menuitem">
							<svg
								class="w-5 h-5 mr-3 text-gray-400"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true">
								<path
									d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
							</svg>Ascending</a>
						<a
							on:click={(e) => onOrderChange(e, 1)}
							href="#/home"
							class="flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
							role="menuitem">
							<svg
								class="w-5 h-5 mr-3 text-gray-400"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
							</svg>Decending</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
