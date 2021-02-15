<script lang="ts">
    // import createValidation from "svelidation";
    import { onMount } from "svelte";
    import BusinessSettingsForm from "../components/forms/business/settings/BusinessSettingsForm.svelte";
    import RadioGroup from "../components/inputs/RadioGroup.svelte";
    import Toggle from "../components/inputs/Toggle.svelte";
    import SettingsSidebar from "../components/_internal/user/SettingsSidebar.svelte";
    // import { auth } from "../../../stores/auth.store";
    import { bizState } from "../stores/business.store";

    // const {
    //     createForm,
    //     createEntries,
    //     getValues,
    //     clearErrors,
    // } = createValidation({
    //     validateOnEvents: { change: false, input: true, blur: true },
    //     clearErrorsOnEvents: { reset: false, focus: true },
    //     listenInputEvents: 1,
    //     presence: "required",
    //     trim: true,
    //     includeAllEntries: false,
    //     useCustomErrorsStore: false,
    //     warningsEnabled: true,
    //     getValues: true,
    // });

    // const [
    //     [radio_err, radio_val, radio_inp],
    //     [toggle_err, toggle_val, toggle_inp],
    // ] = createEntries([
    //     {
    //         type: "number",
    //         required: false,
    //         value: [],
    //     },
    //     {
    //         type: "boolean",
    //         required: false,
    //     },
    // ]);

    //* You need to define the component prop "params" to capture route params
    export let params = {};

    onMount(() => {
        // if (params && params["id"]) {
            // console.log(params);
            // bizState.updateState({ selected_business_id: params["id"] });
        // }

        // if (params && params["subRoute"]) {
        //     bizState.updateState({ selected_business_id: params["id"] });
        // }
    });

    const options = [
        {
            id: "first_one",
            name: "first",
            title: "First Test",
            subTitle: "Just testing...",
            value: 0,
        },
        {
            id: "sec_one",
            name: "sec",
            title: "Second Test",
            subTitle: "Just testing again...",
            value: 1,
        },
    ];
</script>

<main
    class="py-24 pb-10 mx-auto max-w-7xl lg:py-36 xl:py-36 2xl:py-36 md:py-24 lg:px-8">
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <!-- Settings Sidebar -->
        <SettingsSidebar />
        <!-- Payment details -->
        <div class="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <section aria-labelledby="user_account_settings_heading">
                <BusinessSettingsForm />
            </section>

            <!-- Plan -->
            <!-- <section aria-labelledby="plan_heading">
                <form action="#" method="POST">
                    <div class="shadow sm:rounded-md sm:overflow-hidden">
                        <div class="px-4 py-6 space-y-6 bg-white sm:p-6">
                            <div>
                                <h2
                                    id="plan_heading"
                                    class="text-lg font-medium leading-6 text-gray-900">
                                    Plan
                                </h2>
                            </div>

                            <RadioGroup
                                errorsStore={radio_err}
                                valueStore={radio_val}
                                useInput={radio_inp}
                                {options} />

                            <Toggle
                                valueStore={toggle_val}
                                label="Receive Notifications"
                                subLabel="We will send emails to your inbox."
                                checked={$toggle_val}
                                labelPos={1} />
                        </div>
                        <div class="px-4 py-3 text-right bg-gray-50 sm:px-6">
                            <button
                                type="submit"
                                class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </section> -->

            <!-- Billing history -->
            <section aria-labelledby="billing_history_heading">
                <div
                    class="pt-6 bg-white shadow sm:rounded-md sm:overflow-hidden">
                    <div class="px-4 sm:px-6">
                        <h2
                            id="billing_history_heading"
                            class="text-lg font-medium leading-6 text-gray-900">
                            Billing history
                        </h2>
                    </div>
                    <div class="flex flex-col mt-6">
                        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div
                                class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div
                                    class="overflow-hidden border-t border-gray-200">
                                    <table
                                        class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Date
                                                </th>
                                                <th
                                                    scope="col"
                                                    class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Description
                                                </th>
                                                <th
                                                    scope="col"
                                                    class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Amount
                                                </th>
                                                <!--
                              `relative` is added here due to a weird bug in Safari that causes `sr-only` headings to introduce overflow on the body on mobile.
                            -->
                                                <th
                                                    scope="col"
                                                    class="relative px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    <span class="sr-only">View
                                                        receipt</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            class="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td
                                                    class="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                    1/1/2020
                                                </td>
                                                <td
                                                    class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    Business Plan - Annual
                                                    Billing
                                                </td>
                                                <td
                                                    class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    CA$109.00
                                                </td>
                                                <td
                                                    class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                    <a
                                                        href="#/settings"
                                                        class="text-orange-600 hover:text-orange-900">View
                                                        receipt</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</main>
