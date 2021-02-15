<script lang="ts">
  import "tailwindcss/dist/tailwind.css";
  import "tailwindcss/dist/components.css";
  // import Router from "svelte-spa-router";
  // import routes, { conditionsFailed, routeLoaded } from "./routes";
  // import Notifications from "./components/notifications/Notifications.svelte";
  // import Footer from "./components/Footer.svelte";
  // import Navbar from "./components/navigation/Navbar.svelte";
  // import Modals from "./components/modals/Modals.svelte";
  // import { auth } from "./stores/auth.store";
  import { onMount } from "svelte";
  import BusinessSettings from "./pages/BusinessSettings.svelte";

  // auth.isAuthenticated();
  onMount(() => {
    // setTimeout(() => {
    //   auth.isAwaitingEmailConfirm();
    // }, 1000);
  });
</script>

<main>
  <BusinessSettings />
</main>

<!-- <style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style> -->
