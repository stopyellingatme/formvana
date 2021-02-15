<script lang="ts">
    import { onDestroy } from "svelte";
    import Input from "../../inputs/Input.svelte";
    import Checkbox from "../../inputs/Checkbox.svelte";
    import Link from "../../navigation/Link.svelte";
    import Button from "../../buttons/Button.svelte";
    import {
        createForm,
        emailErrors,
        emailInput,
        emailValue,
        passwordErrors,
        passwordInput,
        passwordValue,
        checkboxErrors,
        checkboxInput,
        checkboxValue,
        onSubmit,
        clearErrors,
        clearValues,
    } from "./login.form";

    $: formValid =
        $emailErrors.length === 0 &&
        $passwordErrors.length === 0 &&
        $emailValue &&
        $passwordValue;

    onDestroy(() => {
        clearValues();
        clearErrors();
    });
</script>

<form use:createForm={{ onSubmit }} on:submit|preventDefault>
    <Input
        label="Email Address"
        attrs={{ type: 'email' }}
        name="email"
        errorsStore={emailErrors}
        valueStore={emailValue}
        useInput={emailInput} />

    <div class="mt-6">
        <Input
            label="Password"
            attrs={{ type: 'password' }}
            name="password"
            valueStore={passwordValue}
            errorsStore={passwordErrors}
            useInput={passwordInput} />
    </div>

    <div class="flex items-center justify-between mt-6">
        <div class="flex-col">
            <div class="flex items-center">
                <Checkbox
                    label="Remember Me"
                    name="remember_me"
                    valueStore={checkboxValue}
                    errorsStore={checkboxErrors}
                    useInput={checkboxInput} />
            </div>
            <div class="py-1 text-sm leading-5">
                <Link
                    route="#/forgot"
                    srText="Forgot password or username link">
                    <span>Forgot something?</span>
                </Link>
            </div>
        </div>

        <div class="flex-col">
            <div class="text-sm leading-5">
                <Link route="#/signup" srText="Sign up link">
                    <span>Don't have an Account?</span>
                </Link>
            </div>
        </div>
    </div>

    <div class="mt-6">
        <span class="block w-full rounded-md shadow-sm">
            <Button type="submit" disabled={!formValid}>
                <span>Login</span>
            </Button>
        </span>
    </div>
</form>
