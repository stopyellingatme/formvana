// import { supa } from "../stores/supa.store";
import {
  Business,
  EmployeeBusinessLink,
  BusinessStatus,
} from "../../types/biz/Business";
// import { getUsers } from "./users.store";
// import { push } from "svelte-spa-router";
import { writable } from "svelte/store";

function initStore() {
  const { subscribe, set, update } = writable({
    selected_business_id: null,
  });

  return {
    subscribe,
    set,
    updateState: (updates) => update((s) => updateState(s, updates)),
  };
}

export const updateState = (state, updates) => {
  Object.assign(state, updates);
  return state;
};

export const bizState = initStore();

export const createBusiness = () => {
  const b = new Business().bso();
  console.log("CREATE BUSINESS: ", b);

  // return supa
  //   .from("businesses")
  //   .insert([b])
  //   .then((res) => {
  //     console.log(res);
  //     if (res.data && !res.error) {
  //       push(`/business/${res.data[0].id}/details`);
  //     }
  //     return res;
  //   });
};

export const getBusiness = (id: any) => {
  // return supa
  //   .from<Business>("businesses")
  //   .select("*")
  //   .eq("id", id)
  //   .then((res) => {
  //     console.log(res);
  //     return res.data;
  //   });
};

export const getBusinesses = () => {
  // return supa
  //   .from<Business>("businesses")
  //   .select("*")
  //   //   .eq("id", id)
  //   .then((res) => {
  //     // console.log(res);
  //     return res.data;
  //   });
};

export const updateBusniess = (data: any) => {
  // return supa
  //   .from<Business>("businesses")
  //   .update(data)
  //   .eq("id", data.id)
  //   .then((res) => {
  //     console.log(res);
  //     return res;
  //   });
};

export const archiveBusiness = (data: Business) => {
  data.status = "ARCHIVED";

  // return supa
  //   .from<Business>("businesses")
  //   .update(data)
  //   .eq("id", data.id)
  //   .then((res) => {
  //     console.log(res);
  //     return res;
  //   });
};

// TODO: Look at breaking up emaployee_business stuff into diff file
// Employee/Business Linking functions
export const addEmployeeLink = (biz: Business, user: any) => {
  const link = new EmployeeBusinessLink().link(biz.id, user.id);

  // return supa
  //   .from<EmployeeBusinessLink>("employee_business_link")
  //   .insert([link])
  //   .then((res) => {
  //     console.log(res);
  //     return res;
  //   });
};

export const removeEmployeeLink = (link: EmployeeBusinessLink) => {
  link.active = false;

  // return supa
  //   .from<EmployeeBusinessLink>("employee_business_link")
  //   .update(link)
  //   .eq("id", link.id)
  //   .then((res) => {
  //     console.log(res);
  //     return res;
  //   });
};

export const getEmployees = (biz: Business) => {
  // return supa
  //   .from<EmployeeBusinessLink>("employee_business_link")
  //   .select("*")
  //   .eq("business_id", biz.id)
  //   .then((res) => {
  //     console.log(res);

  //     // *Should return list of links with userIds

  //     // const employees = getUsers(res.data.map(item => item.user_id));

  //     // return employees;
  //   });
};
