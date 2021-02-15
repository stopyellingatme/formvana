<script lang="ts">
    import { modals } from "../../../stores/modal.store";
    import { createBusiness } from "../../../stores/business.store";
    import SimpleModal from "../../modals/SimpleModal.svelte";

    const style = 0;
    const title = "Create New Business";
    const content = `<p class="text-sm text-gray-500">
                            You are about to create a new Business entry.
                        </p>
                        <p class="text-sm text-gray-500">
                            Would you like to continue?
                        </p>`;
    const titleIcon = `<div
                            class="${
                                //@ts-ignore
                                style === 0
                                    ? "flex items-center justify-center w-12 h-12 mx-auto bg-indigo-100 rounded-full"
                                    : "flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-indigo-100 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                            } ">
                            <svg
                            class="w-6 h-6 text-indigo-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>`;
    const successButton = {
        text: "New Business",
        color: "bg-indigo",
    };
    const cancelButton = {
        text: "Cancel",
        color: "bg-indigo",
    };

    let loading = false;
    const onClose = (action) => {
        if (action.detail === "success") {
            // Create the business!
            loading = true;
            createBusiness().then((res) => {
                console.log("RESP FROM MODAL: ", res);
                if (res.data && !res.error) {
                    modals.toggle();
                }
                loading = false;
            });
        } else {
            // Close the modal
            modals.toggle();
        }
    };
</script>

<SimpleModal
    on:close={onClose}
    {style}
    {loading}
    {title}
    {content}
    {titleIcon}
    {successButton}
    {cancelButton} />
