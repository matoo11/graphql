// query.js
import { graphqlQuery } from './graphql.js';

export async function fetchUserAttrs() {
    const query = `
        query {
            user {
                attrs
            }
        }
    `;
    const res = await graphqlQuery(query);
    return res?.data?.user?.[0]?.attrs || {};
}

export async function fetchUserInfo() {
    const query = `
        query {
            user {
                login
                auditRatio
                totalDown
                totalUp
            }
        }
    `;
    const res = await graphqlQuery(query);
    const arr = res?.data?.user;
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : {};
}

export async function fetchXP() {
    const query = `
        query {
            transaction_aggregate(
                where: {
                    event: { path: { _eq: "/bahrain/bh-module" } }
                    type: { _eq: "xp" }
                }
            ) {
                aggregate {
                    sum {
                        amount
                    }
                }
            }
        }
    `;
    const res = await graphqlQuery(query);
    return res?.data?.transaction_aggregate?.aggregate?.sum?.amount || 0;
}

export async function fetchLevel(userlogin) {
    const query = `
        query Event_user($userlogin: String) {
            event_user(
                where: {
                    userLogin: { _eq: $userlogin }
                    event: { path: { _eq: "/bahrain/bh-module" } }
                }
            ) {
                level
            }
        }
    `;
    const res = await graphqlQuery(query, { userlogin });
    const arr = res?.data?.event_user;
    return Array.isArray(arr) && arr.length > 0 ? arr[0].level : 0;
}

export async function fetchPendingProject() {
    const query = `
        query {
            progress(
                where: { isDone: { _eq: false }, object: { type: { _eq: "project" } } }
            ) {
                object {
                    name
                }
            }
        }
    `;
    const res = await graphqlQuery(query);
    return res?.data?.progress?.[0]?.object?.name || 'No current project';
}
