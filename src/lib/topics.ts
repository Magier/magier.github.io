interface TaggedPost {
  data: { tags?: readonly string[] };
}

export interface Topic {
  path: string;
  label: string;
  depth: number;
  count: number;
}

export function topicLabel(path: string): string {
  return path.split('/').at(-1)!.split('-')
    .map((word) => word === 'ai' ? 'AI' : word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function matchesTopic(post: TaggedPost, path: string): boolean {
  return (post.data.tags ?? []).some((tag) => tag === path || tag.startsWith(`${path}/`));
}

// Count each post once per topic, including inferred ancestors.
export function getTopics(posts: readonly TaggedPost[]): Topic[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    const paths = new Set<string>();
    for (const tag of post.data.tags ?? []) {
      const segments = tag.split('/');
      for (let length = 1; length <= segments.length; length++) {
        paths.add(segments.slice(0, length).join('/'));
      }
    }
    for (const path of paths) counts.set(path, (counts.get(path) ?? 0) + 1);
  }
  return [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([path, count]) => ({
    path,
    label: topicLabel(path),
    depth: path.split('/').length - 1,
    count,
  }));
}
