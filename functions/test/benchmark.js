const admin = require("firebase-admin");

admin.initializeApp({
  projectId: "benchmark-test-project",
});

const db = admin.firestore();

async function populateDB(colName, numDocs, includeUrl) {
  const batch = db.batch();
  for (let i = 0; i < numDocs; i++) {
    const ref = db.collection(colName).doc(`doc_${i}`);
    if (includeUrl) {
        batch.set(ref, { text: `This is a test with http://old-url.com/image${i}.png` });
    } else {
        batch.set(ref, { text: `This is a test without the url` });
    }
  }
  await batch.commit();
}

async function runSequential(oldUrl, newUrl) {
  let updatedDocs = 0;
  const collectionsToScan = ["settings_seq", "destinations_seq", "articles_seq", "cms_pages_seq"];
  const start = Date.now();
  for (const col of collectionsToScan) {
    const snap = await admin.firestore().collection(col).get();
    for (const docSnap of snap.docs) {
      const raw = docSnap.data() || {};
      const asText = JSON.stringify(raw);
      if (!asText.includes(oldUrl)) continue;
      const replaced = JSON.parse(asText.split(oldUrl).join(newUrl));
      await docSnap.ref.set(replaced, { merge: true });
      updatedDocs += 1;
    }
  }
  return { time: Date.now() - start, updatedDocs };
}

async function runBatch(oldUrl, newUrl) {
  let updatedDocs = 0;
  const collectionsToScan = ["settings_batch", "destinations_batch", "articles_batch", "cms_pages_batch"];
  const start = Date.now();

  let batch = db.batch();
  let batchCount = 0;
  const commitPromises = [];

  for (const col of collectionsToScan) {
    const snap = await admin.firestore().collection(col).get();
    for (const docSnap of snap.docs) {
      const raw = docSnap.data() || {};
      const asText = JSON.stringify(raw);
      if (!asText.includes(oldUrl)) continue;

      const replaced = JSON.parse(asText.split(oldUrl).join(newUrl));
      batch.set(docSnap.ref, replaced, { merge: true });
      batchCount++;
      updatedDocs++;

      if (batchCount === 500) {
        commitPromises.push(batch.commit());
        batch = db.batch();
        batchCount = 0;
      }
    }
  }

  if (batchCount > 0) {
    commitPromises.push(batch.commit());
  }

  await Promise.all(commitPromises);

  return { time: Date.now() - start, updatedDocs };
}

async function main() {
    console.log("Setting up DB...");
    const seqCols = ["settings_seq", "destinations_seq", "articles_seq", "cms_pages_seq"];
    const batchCols = ["settings_batch", "destinations_batch", "articles_batch", "cms_pages_batch"];

    for (const col of seqCols) await populateDB(col, 200, true);
    for (const col of batchCols) await populateDB(col, 200, true);

    console.log("Running sequential update...");
    const seqResult = await runSequential("http://old-url.com", "http://new-url.com");
    console.log(`Sequential: ${seqResult.time}ms to update ${seqResult.updatedDocs} docs`);

    console.log("Running batch update...");
    const batchResult = await runBatch("http://old-url.com", "http://new-url.com");
    console.log(`Batch: ${batchResult.time}ms to update ${batchResult.updatedDocs} docs`);
}

main().catch(console.error);
