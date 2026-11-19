type UnknownRecord = Record<string, unknown>;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredText(record: UnknownRecord, key: string, maxLength = 2000) {
  const value = record[key];
  if (typeof value !== "string" || !value.trim()) throw new Error(`${key} is required.`);
  const trimmed = value.trim();
  if (trimmed.length > maxLength) throw new Error(`${key} is too long.`);
  return trimmed;
}

function optionalText(record: UnknownRecord, key: string, maxLength = 2000) {
  const value = record[key];
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") throw new Error(`${key} must be text.`);
  const trimmed = value.trim();
  if (trimmed.length > maxLength) throw new Error(`${key} is too long.`);
  return trimmed || undefined;
}

function safeUrl(value: string, key: string) {
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return value;
  } catch {
    // Handled below.
  }
  throw new Error(`${key} must be an http(s) or site-relative URL.`);
}

function textArray(record: UnknownRecord, key: string, maxItems = 20) {
  const value = record[key];
  if (!Array.isArray(value) || value.length > maxItems) throw new Error(`${key} must be a list with at most ${maxItems} items.`);
  const items = value.map((item) => {
    if (typeof item !== "string" || !item.trim() || item.trim().length > 600) {
      throw new Error(`${key} contains invalid text.`);
    }
    return item.trim();
  });
  return items;
}

function objectOfText(record: UnknownRecord, key: string) {
  const value = record[key];
  if (!isRecord(value) || Object.keys(value).length > 12) throw new Error(`${key} must be a small object.`);
  const output: Record<string, string> = {};
  for (const [entryKey, entryValue] of Object.entries(value)) {
    if (!entryKey.trim() || entryKey.length > 60 || typeof entryValue !== "string" || !entryValue.trim() || entryValue.trim().length > 160) {
      throw new Error(`${key} contains invalid data.`);
    }
    output[entryKey.trim()] = entryValue.trim();
  }
  return output;
}

function parse<T>(body: unknown, validator: (record: UnknownRecord) => T): ValidationResult<T> {
  if (!isRecord(body)) return { success: false, error: "Request body must be a JSON object." };
  try {
    return { success: true, data: validator(body) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Invalid input." };
  }
}

export type ExperienceInput = {
  title: string;
  role: string;
  icon: string;
  period: string;
  location: string;
  type: string;
  description: string;
  details: string[];
  achievements: string;
  stats: Record<string, string>;
};

export function parseExperience(body: unknown): ValidationResult<ExperienceInput> {
  return parse(body, (record) => ({
    title: requiredText(record, "title", 160),
    role: requiredText(record, "role", 160),
    icon: requiredText(record, "icon", 80),
    period: requiredText(record, "period", 100),
    location: requiredText(record, "location", 160),
    type: requiredText(record, "type", 80),
    description: requiredText(record, "description", 2000),
    details: textArray(record, "details"),
    achievements: requiredText(record, "achievements", 1200),
    stats: objectOfText(record, "stats"),
  }));
}

export type TestimonialInput = {
  name: string;
  testimonial: string;
  company?: string;
  profilePic?: string;
  testimonialId?: number;
};

export function parseTestimonial(body: unknown): ValidationResult<TestimonialInput> {
  return parse(body, (record) => {
    let testimonialId: number | undefined;
    if (record.testimonialId !== undefined) {
      if (
        typeof record.testimonialId !== "number" ||
        !Number.isInteger(record.testimonialId) ||
        record.testimonialId < 0
      ) {
        throw new Error("testimonialId must be a positive whole number.");
      }
      testimonialId = record.testimonialId;
    }
    const profilePic = optionalText(record, "profilePic", 2048);
    return {
      name: requiredText(record, "name", 160),
      testimonial: requiredText(record, "testimonial", 2400),
      company: optionalText(record, "company", 200),
      ...(profilePic ? { profilePic: safeUrl(profilePic, "profilePic") } : {}),
      ...(testimonialId !== undefined ? { testimonialId } : {}),
    };
  });
}

export type ArticleInput = {
  title: string;
  description: string;
  image: { src: string; alt: string };
  link: string;
  icon?: string;
};

export function parseArticle(body: unknown): ValidationResult<ArticleInput> {
  return parse(body, (record) => {
    if (!isRecord(record.image)) throw new Error("image is required.");
    const src = requiredText(record.image, "src", 2048);
    return {
      title: requiredText(record, "title", 180),
      description: requiredText(record, "description", 2400),
      image: { src: safeUrl(src, "image.src"), alt: requiredText(record.image, "alt", 240) },
      link: safeUrl(requiredText(record, "link", 2048), "link"),
      icon: optionalText(record, "icon", 80),
    };
  });
}

export type ServiceInput = {
  serviceId: number;
  title: string;
  availability: string;
  content: string;
  category: string;
  icon: string;
  relatedIds: string[];
  status: string;
  confidence: number;
};

export function parseService(body: unknown): ValidationResult<ServiceInput> {
  return parse(body, (record) => {
    if (!Number.isInteger(record.serviceId) || (record.serviceId as number) < 0) throw new Error("serviceId must be a positive whole number.");
    if (typeof record.confidence !== "number" || !Number.isFinite(record.confidence) || record.confidence < 0 || record.confidence > 100) {
      throw new Error("confidence must be a number from 0 to 100.");
    }
    return {
      serviceId: record.serviceId as number,
      title: requiredText(record, "title", 160),
      availability: requiredText(record, "availability", 100),
      content: requiredText(record, "content", 2400),
      category: requiredText(record, "category", 120),
      icon: requiredText(record, "icon", 80),
      relatedIds: textArray(record, "relatedIds", 20),
      status: requiredText(record, "status", 80),
      confidence: record.confidence,
    };
  });
}

export type EducationInput = {
  title: string;
  description: string;
  images: { src: string; alt: string }[];
};

export function parseEducation(body: unknown): ValidationResult<EducationInput> {
  return parse(body, (record) => {
    if (!Array.isArray(record.images) || record.images.length > 12) throw new Error("images must contain at most 12 images.");
    const images = record.images.map((image) => {
      if (!isRecord(image)) throw new Error("images contains an invalid entry.");
      return { src: safeUrl(requiredText(image, "src", 2048), "images.src"), alt: requiredText(image, "alt", 240) };
    });
    return {
      title: requiredText(record, "title", 180),
      description: requiredText(record, "description", 2400),
      images,
    };
  });
}

export function parseAdminUpdate(body: unknown): ValidationResult<{ email?: string; password?: string }> {
  return parse(body, (record) => {
    const email = optionalText(record, "email", 254)?.toLowerCase();
    const password = optionalText(record, "password", 256);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
    if (password && password.length < 12) throw new Error("New passwords must be at least 12 characters.");
    if (!email && !password) throw new Error("Provide an email address or a new password.");
    return { ...(email ? { email } : {}), ...(password ? { password } : {}) };
  });
}

export function isMongoObjectId(value: string | undefined): value is string {
  return Boolean(value && /^[a-f\d]{24}$/i.test(value));
}
