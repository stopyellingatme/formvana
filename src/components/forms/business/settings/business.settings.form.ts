import { get as sget, writable } from "svelte/store";
import { getBusiness, updateBusniess, bizState } from "../../../../stores/business.store";
import { Business } from "../../../../../types/biz/Business";
import { Form } from "../../../../../types/_internal/Form";

function initStore() {
    let form = new Form();
    form.model = new Business();
    form.makeFields();
    const { subscribe, set, update } = writable({
        ...form,
    });

    return {
        subscribe,
        set,
        updateState: (updates) => update((s) => updateState(s, updates)),
        setLoading: (loading) => update((s) => setLoading(s, loading)),
    };
}
export const updateState = (state, updates) => {
    Object.assign(state, updates);
    return state;
};

export const setLoading = (state, loading) => {
    state.loading = loading;
    return state;
};

export const formState = initStore();

export const init = () => {
    formState.setLoading(true);

    setTimeout(() => {
        formState.setLoading(false);
    }, 1000);

    // Now update with DB fetched values
    // getBusiness(sget(bizState).selected_business_id).then((data) => {
    //     console.log(data);
    //     const biz = new Business(data[0]);
    //     console.log(biz);

    //     const form = sget(formState);
    //     form.model = biz;
    //     form.loading = true;

    //     formState.updateState({ form: form });


    //     setTimeout(() => {
    //         formState.setLoading(false);
    //     }, 1000);
    // });
};

export const onSubmit = (ev) => {
    console.log("SUBMIT: ", ev);

    formState.setLoading(true);
    // Values come in the order they were created
    // const values: any[] = Array.from(getValues().values());
    // console.log(values);
    const item = new Business();

    // updateBusniess(item).then((res) => {
    //     // console.log("BIZ SETTINGS FORM: ", res.data[0]);
    //     // const _user = new User(res.data[0]);
    //     // auth.updateAuthUser(_user);
    //     formState.setLoading(false);
    // });
};
