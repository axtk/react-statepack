const points: Record<string, number> = {
  jane: 0,
  jack: 0,
};

const userIds = Object.keys(points);

let inited = false;

export async function fetchPoints() {
  return new Promise<Record<string, number>>((resolve) => {
    setTimeout(
      () => {
        if (inited) {
          // One user gets a point whenever the points are requested
          const randomId = userIds[Math.floor(userIds.length * Math.random())];
          points[randomId] = points[randomId] < 1e4 ? points[randomId] + 1 : 0;
        }

        inited = true;
        resolve({ ...points });
      },
      200 + 200 * Math.random(),
    );
  });
}
