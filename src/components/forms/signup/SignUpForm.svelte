<script>
    import { onDestroy } from "svelte";
    import Link from "../../navigation/Link.svelte";
    import Button from "../../buttons/Button.svelte";
    import Checkbox from "../../inputs/Checkbox.svelte";
    import Input from "../../inputs/Input.svelte";
    import {
        createForm,
        emailErrors,
        emailInput,
        emailValue,
        passwordConfirmErrors,
        passwordConfirmInput,
        passwordConfirmValue,
        passwordErrors,
        passwordInput,
        passwordValue,
        validatePassword,
        onSubmit,
        checkPasswordMatch,
        checkboxErrors,
        checkboxValue,
        checkboxInput,
        clearErrors,
        clearValues,
    } from "./signup.form";

    $: formValid =
        $emailErrors.length === 0 &&
        $passwordErrors.length === 0 &&
        $passwordConfirmErrors.length === 0 &&
        $emailValue &&
        $passwordValue &&
        $passwordConfirmValue;

    onDestroy(() => {
        clearValues();
        clearErrors();
    });
</script>

<form use:createForm={{ onSubmit }} on:submit|preventDefault>
    <Input
        label="Email Address"
        type="email"
        name="email"
        errorsStore={emailErrors}
        valueStore={emailValue}
        useInput={emailInput} />

    <div class="mt-6">
        <Input
            label="Password"
            type="password"
            name="password"
            on:interaction={(e) => validatePassword(e, $passwordErrors)}
            errorsStore={passwordErrors}
            valueStore={passwordValue}
            useInput={passwordInput} />
    </div>

    <div class="mt-6">
        <Input
            label="Confirm Password"
            type="password"
            name="confirm_password"
            on:interaction={(e) => checkPasswordMatch(e.detail, $passwordValue, $passwordConfirmErrors)}
            errorsStore={passwordConfirmErrors}
            valueStore={passwordConfirmValue}
            useInput={passwordConfirmInput} />
    </div>

    <div class="flex items-center justify-between mt-6">
        <div class="flex items-center">
            <Checkbox
                label="Remember Me"
                name="remember_me"
                valueStore={checkboxValue}
                errorsStore={checkboxErrors}
                useInput={checkboxInput} />
        </div>
        <div class="py-1 text-sm leading-5">
            <Link route="#/login" srText="Log in link">
                <span>Have an Account?</span>
            </Link>
        </div>
    </div>

    <div class="mt-6">
        <span class="block w-full rounded-md shadow-sm">
            <Button type="submit" disabled={!formValid}>
                <span>Create Account</span>
            </Button>
        </span>
    </div>
</form>
