import { URL } from 'node:url';

interface Reponse {
  entries: Record<string, Story>;
}

export interface Story {
  id: string;
  importPath: string;
  name: string;
  type?: string;
  [key: string]: unknown;
}

/**
 * Fetches the Storybook index.json from the given Storybook URL using fetch.
 * @param storybookUrl The base URL of the Storybook instance
 * @returns The entries record from index.json as Record<string, Story>
 * @throws If the fetch fails or the response is not OK
 */
export async function getStories(
  storybookUrl: string
): Promise<Record<string, Story>> {
  const indexUrl = new URL('/index.json', storybookUrl).toString();
  const res = await fetch(indexUrl);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch index.json: ${res.status} ${res.statusText}`
    );
  }
  const json: Reponse = await res.json();
  return json.entries;
}
