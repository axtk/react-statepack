export type User = {
  name: string;
};

const users: Record<string, User> = {
  jane: {
    name: "Jane Smith",
  },
  jack: {
    name: "Jack Smith",
  },
};

export async function fetchUsers() {
  return new Promise<Record<string, User>>((resolve) => {
    setTimeout(
      () => {
        resolve({ ...users });
      },
      200 + 200 * Math.random(),
    );
  });
}
