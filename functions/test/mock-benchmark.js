// A lightweight benchmark that simulates the time spent doing operations without relying on the actual firestore emulator
const crypto = require("crypto");

class MockRef {
  set(data, options) {
    return new Promise((resolve) => {
        // simulate async write time: ~10ms
        setTimeout(resolve, 10);
    });
  }
}

class MockBatch {
  constructor() {
    this.ops = 0;
  }
  set(ref, data, options) {
    this.ops++;
  }
  commit() {
    return new Promise((resolve) => {
        // simulate batch commit time: ~50ms per 500 ops
        setTimeout(resolve, 50);
    });
  }
}

class MockFirestore {
    batch() {
        return new MockBatch();
    }
}

const db = new MockFirestore();

// Mock 4 collections of 200 documents each
const mockDocs = [];
for (let i = 0; i < 800; i++) {
    mockDocs.push({
        ref: new MockRef(),
        data: () => ({
            title: "Test doc " + i,
            imageUrl: "http://old-url.com/image.png",
            description: "Some very long text here to simulate a real document " + crypto.randomBytes(100).toString('hex')
        })
    });
}

const collectionsToScan = ["settings", "destinations", "articles", "cms_pages"];
// Let's assume each collection has 200 docs
const mockSnapshots = {
    settings: { docs: mockDocs.slice(0, 200) },
    destinations: { docs: mockDocs.slice(200, 400) },
    articles: { docs: mockDocs.slice(400, 600) },
    cms_pages: { docs: mockDocs.slice(600, 800) },
};

async function runSequential(oldUrl, newUrl) {
  let updatedDocs = 0;
  const start = Date.now();
  for (const col of collectionsToScan) {
    const snap = mockSnapshots[col];
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
  const start = Date.now();

  let batch = db.batch();
  let batchCount = 0;
  const commitPromises = [];

  for (const col of collectionsToScan) {
    const snap = mockSnapshots[col];
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
    console.log("Running sequential update...");
    const seqResult = await runSequential("http://old-url.com", "http://new-url.com");
    console.log(`Sequential: ${seqResult.time}ms to update ${seqResult.updatedDocs} docs`);

    console.log("Running batch update...");
    const batchResult = await runBatch("http://old-url.com", "http://new-url.com");
    console.log(`Batch: ${batchResult.time}ms to update ${batchResult.updatedDocs} docs`);
}

main().catch(console.error);
