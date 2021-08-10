import admin from 'firebase-admin'

import serviceAccount from '../serviceAccountKey.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const firestore = admin.firestore()

const TOKENS_COLLECTION = firestore.collection('tokens')

export async function getAllTokens() {
  const docs = await TOKENS_COLLECTION.get()

  return docs.docs.map(doc => doc.data())
}

export async function addToken(token, lat, lon) {
  const data = {
    token,
    lat,
    lon,
  }

  const docs = await TOKENS_COLLECTION.get()

  if(docs.size > 0) {
    docs.forEach(doc => {
      if(doc.data().token === token) {
        doc.ref.update(data)
      } else {
        TOKENS_COLLECTION.add(data)
      }
    })
  } else {
    TOKENS_COLLECTION.add(data)
  }
}

export async function deleteToken(token) {
  const docs = await TOKENS_COLLECTION.where('token', '==', token).get()

  docs.forEach(async doc => await doc.ref.delete())
}