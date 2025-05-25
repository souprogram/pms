import { faker } from "@faker-js/faker";
import { Blog } from "../../src/types/blog";

/**
 * Generate mock blog data
 * @param overrides Partial blog data to override defaults
 * @returns Complete Blog object
 */
export const generateMockBlog = (overrides: Partial<Blog> = {}): Blog => {
  const createdAt = faker.date.recent({ days: 30 }).toISOString();

  const categories = [
    "unisport",
    "prirodnih znanosti",
    "sou program",
    "herkul",
    "una corda",
    "fintur",
    "klub studenata istre",
    "studentski zbor",
    "isha",
    "tsuru",
    "esca",
  ];

  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    created_at: createdAt,
    updated_at: faker.datatype.boolean(0.2)
      ? faker.date.between({ from: createdAt, to: new Date() }).toISOString()
      : null,
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    image_url: faker.image.urlPicsumPhotos({ width: 800, height: 400 }),
    image_alt: faker.lorem.words(3),
    category: faker.helpers.arrayElement(categories),
    author_id: faker.string.uuid(),
    author: faker.person.fullName(),
    content: faker.lorem.paragraphs(5),
    hashtags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
      faker.lorem.word()
    ),
    ...overrides,
  };
};

/**
 * Generate multiple mock blogs
 * @param count Number of blogs to generate
 * @param overrides Partial blog data to override defaults for all blogs
 * @returns Array of Blog objects
 */
export const generateMockBlogs = (
  count: number,
  overrides: Partial<Blog> = {}
): Blog[] => {
  return Array.from({ length: count }, () => generateMockBlog(overrides));
};
