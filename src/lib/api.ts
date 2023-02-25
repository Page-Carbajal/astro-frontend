import dotenv from "dotenv";

dotenv.config();

const GRAPHQL_URL = process.env.WP_GRAPQL_URL ?? '';


async function fetchAPI(query: string, { variables }:any = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.log(json.errors);
    throw new Error('Failed to fetch API');
  }

  return json.data;
}


export async function getLatestPublishedPosts() {
  const data = await fetchAPI(`
  {
    posts(first: 100, where: {status: PUBLISH}) {
      nodes {
        databaseId
        date
        slug
        title
        excerpt
        content
      }
    }
  }
  `);
  return data?.posts;
}



/**
 * Gets a list of all the Blog Posts Slugs
 **/
export async function getAllPublishedPostsSlugs() {
  const data = await fetchAPI(`
  {
    posts(where: {status: PUBLISH}, first: 1000) {
      edges {
        node {
          slug
        }
      }
    }
  }
  `);
  return data?.posts;
}


export async function getPostBySlug(slug: string) {
  const data = await fetchAPI(`
  {
    post(id: "${slug}", idType: SLUG) {
      id
      date
      title
      content(format: RENDERED)
      featuredImage {
        node {
          sourceUrl
        }
      }
    }
  }
  `);
  return data?.post;
}


export async function getAllPagesWithSlugs() {
  const data = await fetchAPI(`
  {
    pages(first: 10000) {
      edges {
        node {
          slug
        }
      }
    }
  }
  `);
  return data?.pages;
}


export async function getPageBySlug(slug: string) {
  const data = await fetchAPI(`
  {
    page(id: "${slug}", idType: URI) {
      title
      content
    }
  }
  `);
  return data?.page;
}



export async function getSiteInfo(): Promise<{title: string, description: string}>{
  const data = await fetchAPI(`
  {
    generalSettings {
      title
      description
    }
  }
  `);

  return data?.generalSettings;
}