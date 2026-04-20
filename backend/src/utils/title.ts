export const ENTRY_TITLE_MAX_LENGTH = 20;

function collapseWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function truncateAtWordBoundary(value: string, maxLength: number): string {
  const normalizedValue = collapseWhitespace(value);

  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  const slicedValue = normalizedValue.slice(0, maxLength);
  const lastWhitespaceIndex = slicedValue.lastIndexOf(" ");

  if (lastWhitespaceIndex > 0) {
    return slicedValue.slice(0, lastWhitespaceIndex).trimEnd();
  }

  return slicedValue.trimEnd();
}

export function generateEntryTitle(content: string): string {
  const normalizedContent = collapseWhitespace(content);

  if (!normalizedContent) {
    return "";
  }

  const title = truncateAtWordBoundary(normalizedContent, ENTRY_TITLE_MAX_LENGTH);
  return title || normalizedContent.slice(0, ENTRY_TITLE_MAX_LENGTH).trimEnd();
}

export function resolveEntryTitle(title: string | undefined, content: string): string {
  const normalizedTitle = collapseWhitespace(title ?? "");

  if (!normalizedTitle) {
    return generateEntryTitle(content);
  }

  return truncateAtWordBoundary(normalizedTitle, ENTRY_TITLE_MAX_LENGTH);
}
