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
    

export async function fetchUserAvatar() {
    const query = `
    query {
      user {
        attrs
      }
    }
  `;
    const res = await graphqlQuery(query);
    const attrs = res?.data?.user?.[0]?.attrs || {};

    return attrs["pro-picUploadId"];
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
        console.log('pendingProjects:', res || 'No current projects');
    
        return res?.data?.progress?.map(p => p.object.name) || [];
    

    
}


export async function fetchSkills() {
    const query = `
      query {
        transaction(
          where: {
            _and: [
              {type: { _iregex: "(^|[^[:alnum:]_])[[:alnum:]_]*skill_[[:alnum:]_]*($|[^[:alnum:]_])" }},
              {object: {type: {_eq: "project"}}},
              {type: {_in: [
                "skill_prog", "skill_algo", "skill_sys-admin", "skill_front-end", 
                "skill_back-end", "skill_stats", "skill_ai", "skill_game", 
                "skill_tcp"
              ]}}
            ]
          }
          order_by: [{type: asc}, {createdAt: desc}]
          distinct_on: type
        ) {
          amount
          type
        }
      }
    `;
  
    const res = await graphqlQuery(query);
    return res?.data?.transaction || [];
  }
  

  export async function fetchSkills2() {
    const query = `
       query {
        transaction(
            where: {
                _and: [
                    {type: { _iregex: "(^|[^[:alnum:]_])[[:alnum:]_]*skill_[[:alnum:]_]*($|[^[:alnum:]_])" }},
                    {type: {_like: "%skill%"}},
                    {object: {type: {_eq: "project"}}},
                    {type: {_in: [
                         "skill_git", "skill_go", "skill_js", 
                        "skill_html", "skill_css", "skill_unix", "skill_docker", 
                        "skill_sql"
                    ]}}
                ]
            }
            order_by: [{type: asc}, {createdAt: desc}]
            distinct_on: type
        ) {
            amount
            type
        }
    }
    `;
  
    const res = await graphqlQuery(query);
    return res?.data?.transaction || [];
  }
    

export async function fetchprojectsDone() { 
    const query=`
      query Transaction {
    transaction(
      where: {
        type: { _eq: "xp" }
        event: { path: { _eq: "/bahrain/bh-module" } }
      }
    ) {
        createdAt
      object {
        name
        
      }
    }
  }
    `;

    const res = await graphqlQuery(query);

    const projects = res?.data?.transaction?.map(p => ({
    name: p.object?.name,
    createdAt: p.createdAt
})) || [];

return projects;

}

export async function fetchPassedAudits() {
  const query = `
    query GetPassedAudits {
      user {
        audits(where: {grade: {_gte: 1}}) {
          group {
            captainLogin
            path
            object {
              name
            }
          }
        }
      }
    }
  `;

  try {
    const response = await graphqlQuery(query);
    const audits = response?.data?.user?.[0]?.audits || [];

    const projectMap = new Map();

    audits.forEach((audit) => {
      const projectName =
        audit.group?.object?.name ||
        audit.group?.path?.split("/").filter(Boolean).pop() ||
        "Unknown Project";
      projectMap.set(projectName, (projectMap.get(projectName) || 0) + 1);
    });

    return Array.from(projectMap.entries())
      .map(([name, count]) => ({ x: name, y: count }))
      .sort((a, b) => b.y - a.y);

  } catch (error) {
    console.error("Failed to fetch passed audits:", error);
    return [];
  }
}


export async function fetchFailedAudits() {
  const query = `
    query GetFailedAudits {
      user {
        failedAudits: audits(where: {grade: {_lt: 1}}) {
          group {
            captainLogin
            path
            object {
              name
            }
          }
        }
      }
    }
  `;

  try {
    const response = await graphqlQuery(query);
    
    const audits = response?.data?.user?.failedAudits || [];
    const projectMap = new Map();

    audits.forEach((audit) => {
      const projectName = 
        audit.group?.object?.name ||
        audit.group?.path?.split("/").filter(Boolean).pop() ||
        "Unknown Project";
      projectMap.set(projectName, (projectMap.get(projectName) || 0) + 1);
    });

    return Array.from(projectMap.entries())
      .map(([name, count]) => ({ x: name, y: count }))
      .sort((a, b) => b.y - a.y);

  } catch (error) {
    console.error("Failed to fetch failed audits:", error);
    return [];
  }
}