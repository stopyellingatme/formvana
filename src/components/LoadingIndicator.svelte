<script lang="ts">
    export let visible = false;
    export let w;
    export let h;
</script>

{#if visible}
    <div
        style="width: {w}px; height: {h}px"
        class="absolute inset-0 z-40 flex flex-wrap items-center justify-center object-cover w-full m-auto bg-gray-200 opacity-75 cursor-not-allowed">
        <div class="fixed z-40 w-16 h-auto">
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="25 25 50 50">
                <circle
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                    stroke-width="5"
                    stroke="#4f46e5"
                    stroke-linecap="round"
                    stroke-dashoffset="0"
                    stroke-dasharray="100, 200">
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 50 50"
                        to="360 50 50"
                        dur="2.5s"
                        repeatCount="indefinite" />
                    <animate
                        attributeName="stroke-dashoffset"
                        values="0;-30;-124"
                        dur="1.25s"
                        repeatCount="indefinite" />
                    <animate
                        attributeName="stroke-dasharray"
                        values="0,200;110,200;110,200"
                        dur="1.25s"
                        repeatCount="indefinite" />
                </circle>
            </svg>
        </div>
    </div>
{/if}
