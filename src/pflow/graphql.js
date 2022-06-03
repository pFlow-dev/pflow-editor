
export function getUserCollections(username) {
  return call(`query CollectionByUser {\
        userByGithub(github: \\"${username}\\")\
            { id collectionsByUserId { nodes { models name } } } }`)
      .then((res) => res.userByGithub.collectionsByUserId.nodes);
}

export function getPetrinet(id) {
  return call(`query GetPetrinet {\
        petrinetById(id: \\"${id}\\")\
            { net {\
                schema\
                transitions { delta guards { delta label } label position { x y } role }\
                parameters { label initial weight capacity source target position { x y } }\
                places { capacity initial label position { x y } } } } }`)
      .then((res) => res.petrinetById.net);
}

export function call(query) {
  return fetch('/graphql', {
    'headers': {
      'accept': 'application/json',
      'content-type': 'application/json',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
    },
    'referrerPolicy': 'strict-origin-when-cross-origin',
    'body': `{"query": "${query}"}`,
    'method': 'POST',
    'mode': 'cors',
    'credentials': 'include',
  })
      .then((res) => res.json())
      .then((res) => res.data);
}
